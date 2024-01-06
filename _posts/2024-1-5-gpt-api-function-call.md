---
title: GPT API 调用本地函数（function call）
date: 2024-1-5 12:00:00 +0800
categories: [AIGC, OpenAI]
tags: [chatgpt]
---

## 引言

GPT在23年的6月份发送了一份重要的更新通知：

<a href="https://openai.com/blog/function-calling-and-other-api-updates" target="_blank">Function calling and other API updates</a>

在这份通知中，GPT不仅仅发布了新模型与降低价格，更重要的是GPT增加了函数调用（Function calling）能力，这个能力根据官网介绍，模型会智能地选择输出一个JSON对象，其中包含调用这些函数的参数。这是一种更可靠地连接GPT的能力与外部工具和API的新方法。

![主题](/assets/image/2024/1/20240105144639.png)

简单来说，新版本的API模型已经具备了这种能力：模型在和用户交流过程中，会知道什么时候需要调用本地函数，在生成回复过程中，会在回复中带有一个json，这个json中带有这个函数名和参数，开发者只需要写一个监控，在发现这个json的时候按照gpt给出的函数名和参数执行并将返回值传递给gpt即可。

官方同时也给出了一些使用上的example，比如聊天机器人可以去调用外部工具等，官方也同步添加了详细解释Function calling的技术文档

<a href="https://platform.openai.com/docs/guides/function-calling" target="_blank">Function-calling</a>

英语基础比较好的同学建议可以直接阅读官方文档，接下来我也会写如何使用方面的内容，并且会给出一个我们在工作上已经实践的例子。

## 介绍（Learn how to connect large language models to external tools.）

GPT最新的更新引入了函数调用能力，标志着大型语言模型在与外部工具连接方面迈出了重要一步。这一功能的核心目的在于实现类似于万物互联的智能世界，使得语言模型能更有效地与各类工具协作。

值得注意的是，这次更新并没有使GPT直接拥有调用外部函数的能力。相反，它简化了将GPT的输出与外部函数调用结合的过程。根据官方更新，GPT现在可以更明确地指出在特定情境下应调用的函数及其相关参数，而非直接执行函数调用。

有了这一新功能，很多先前通过GPT与软件进行交互的工具可能会进行重构。过去，由于缺乏直接的函数调用能力，开发者不得不依赖复杂的prompt设计来引导GPT格式化地返回函数名和参数。现在，这种需求得到了简化，开发者可以更直接地在GPT的交互过程中识别出需要调用的函数和参数。

根据官方文档，增加的函数调用功能，总结下来就是这样的几步骤：

1. 工具开发者给出函数的简介（函数名，参数解释，函数功能解释），并写入到system的prompt中

2. GPT在与用户交流前，已经知道了函数的上下文

3. 与用户交流过程中，GPT理解用户的自然语言描述，决定调用函数，在生成的提示中后缀一个json字段，该字段中包含了函数名和函数参数

4. 开发者需要在生成的回复中检测是否有这样的json，检测到之后，根据函数和参数调用后返回给GPT或者返回给用户

5. 如果返回给GPT，GPT会根据函数调用返回结果再返回给用户新的回复，比如进一步确认是否调用函数等

## 使用

如果不太能理解步骤，这里结合一个示例详细解释下：

首先截止目前（2024年1月6日），gpt-3.5-turbo-1106 和 gpt-4-1106-preview已经发布，能力上进一步提升，主要是判断什么时间调用函数，所以功能上只是优化准确率，没有影响到使用方法。

这里举一个官网给出的例子，区别在于这里会进行改进，更详细的说明代码设计和关键步骤，将来抄作业落地到自己工具中会更简单：

```
这是一个关于获取天气的工具。用户只需要描述自己想知道哪个地方的天气情况，GPT根据用户描述返回该地今天的天气描述。
```

之所以举这个例子，首先是因为这里涉及了函数调用功能，因为本身GPT是离线的，不具备在线浏览和查询的能力，所以需要借助外部函数，比如一个已有的查询地区今天天气的API，但是GPT本身也不具备调用函数的能力，这里就凸显出函数调用功能的作用，GPT：我虽然不能直接调用，但是我知道调用谁干什么啊。

以下就是为了完成这一任务，根据介绍中的步骤，我们自己来实现一遍这个功能：

1. 实现根据城市名获取当前天气的脚本，以及对应的接口描述

    这个脚本因为并不是重点，所以这里直接给出：

    ```python
    from urllib.request import urlopen
    from bs4 import BeautifulSoup

    import requests as r
    import json
    from typing import Dict

    # 获取国内所有城市代码
    def get_citycode():
        
        response = r.request(
            method='get',
            url='https://j.i8tq.com/weather2020/search/city.js',
            headers={
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36 Edg/115.0.0.0',
                'Referer': 'http://www.weather.com.cn/',
                'Host': 'j.i8tq.com'
            }
        )

        raw_text = response.text
        first_bracket_index = raw_text.index('{')
        raw_json = raw_text[first_bracket_index:]
        weather_json: dict = json.loads(raw_json)

        stack = [weather_json[k] for k in weather_json]
        name2code: Dict[str, str] = {}

        while len(stack) > 0:
            q: Dict[str, Dict] = stack.pop()
            for sq in q.values():
                area_id = sq.get('AREAID', '')
                name_cn = sq.get('NAMECN', '')
                if area_id:
                    name2code[name_cn] = area_id
                else:
                    stack.append(sq)

        areas = sorted(name2code, key=lambda x:name2code[x])
        name2code = {a: name2code[a] for a in areas}
        with open('city_code.json', 'w', encoding='utf-8') as fp:
            json.dump(name2code, fp, indent=4, ensure_ascii=False)

        return name2code

    # 根据城市代码获取天气
    def get_temperature_by_citycode(citycode):
        if not citycode:
            return None, None, None
        resp=urlopen(f'http://www.weather.com.cn/weather/{citycode}.shtml')
        soup=BeautifulSoup(resp,'html.parser')
        tagToday=soup.find('p',class_="tem")  #第一个包含class="tem"的p标签即为存放今天天气数据的标签
        try:
            temperatureHigh=tagToday.span.string  #有时候这个最高温度是不显示的，此时利用第二天的最高温度代替。
        except AttributeError as e:
            temperatureHigh=tagToday.find_next('p',class_="tem").span.string  #获取第二天的最高温度代替

        temperatureLow=tagToday.i.string  #获取最低温度
        weather=soup.find('p',class_="wea").string #获取天气
        
        return temperatureLow, temperatureHigh, weather

    # 根据城市获取城市代码
    def get_temperature_by_cityname(cityname):
        
        # 获取所在城市的城市代码
        name2code = get_citycode()

        citycode = name2code[cityname]

        # 根据城市代码获取当前天气
        temperatureLow, temperatureHigh, weather = get_temperature_by_citycode(citycode)

        print('temperatureLow = ' + temperatureLow, ' temperatureHigh = ' + temperatureHigh, ' weather = ' + weather)

        return {'temperatureLow':temperatureLow, 'temperatureHigh':temperatureHigh, 'weather':weather}

    get_temperature_by_cityname('广州') 
    ```

    这里简单介绍下该脚本，国内获取城市天气需要一个城市代码，然后根据城市代码，可以通过一些免费API或者爬虫来获取对应的城市天气：
    
    1. 获取城市代码：

        ```python
        # 获取国内所有城市代码
        def get_citycode():
            
            response = r.request(
                method='get',
                url='https://j.i8tq.com/weather2020/search/city.js',
                headers={
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36 Edg/115.0.0.0',
                    'Referer': 'http://www.weather.com.cn/',
                    'Host': 'j.i8tq.com'
                }
            )

            raw_text = response.text
            first_bracket_index = raw_text.index('{')
            raw_json = raw_text[first_bracket_index:]
            weather_json: dict = json.loads(raw_json)

            stack = [weather_json[k] for k in weather_json]
            name2code: Dict[str, str] = {}

            while len(stack) > 0:
                q: Dict[str, Dict] = stack.pop()
                for sq in q.values():
                    area_id = sq.get('AREAID', '')
                    name_cn = sq.get('NAMECN', '')
                    if area_id:
                        name2code[name_cn] = area_id
                    else:
                        stack.append(sq)

            areas = sorted(name2code, key=lambda x:name2code[x])
            name2code = {a: name2code[a] for a in areas}
            with open('city_code.json', 'w', encoding='utf-8') as fp:
                json.dump(name2code, fp, indent=4, ensure_ascii=False)

            return name2code

        ```

        代码中直接使用爬虫去获取了一个城市名对应城市代码的字典

    2. 根据城市代码获取当前天气状态

        ```python
        # 根据城市代码获取天气
        def get_temperature_by_citycode(citycode):
            if not citycode:
                return None, None, None
            resp=urlopen(f'http://www.weather.com.cn/weather/{citycode}.shtml')
            soup=BeautifulSoup(resp,'html.parser')
            tagToday=soup.find('p',class_="tem")  #第一个包含class="tem"的p标签即为存放今天天气数据的标签
            try:
                temperatureHigh=tagToday.span.string  #有时候这个最高温度是不显示的，此时利用第二天的最高温度代替。
            except AttributeError as e:
                temperatureHigh=tagToday.find_next('p',class_="tem").span.string  #获取第二天的最高温度代替

            temperatureLow=tagToday.i.string  #获取最低温度
            weather=soup.find('p',class_="wea").string #获取天气
            
            return temperatureLow, temperatureHigh, weather
        ```

        因为免费的API这里都会需要注册，很麻烦，这里为了简化使用上的步骤，直接爬取中国天气网的信息了，返回的是今天的最低气温，最高气温，天气状态

    3. 组装成接口
        ```python
        # 根据城市获取城市代码
        def get_temperature_by_cityname(cityname = '广州'):
            
            # 获取所在城市的城市代码
            name2code = get_citycode()

            citycode = name2code[cityname]

            # 根据城市代码获取当前天气
            temperatureLow, temperatureHigh, weather = get_temperature_by_citycode(citycode)

            print('temperatureLow = ' + temperatureLow, ' temperatureHigh = ' + temperatureHigh, ' weather = ' + weather)

            return {'temperatureLow':temperatureLow, 'temperatureHigh':temperatureHigh, 'weather':weather}
        ```

        可以直接通过调用get_temperature_by_cityname，输入市的名字即可获取当地今天天气
        ```
        14℃ 24℃ 多云
        ```

    脚本完成之后，我们需要进行接口描述，也就是告诉GPT我们提供了一个什么样的接口让它调用

    ```python
    tools = [
        {
            "type": "function",
            "function": {
                "name": "get_temperature_by_cityname",
                "description": "通过城市名称获取该城市今天的天气情况",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "cityname": {
                            "type": "string",
                            "description": "城市的名称，比如广州，深圳，北京，南京",
                        },
                        "unit": {"type": "string"},
                    },
                    "required": ["cityname"],
                },
                "returns": {
                    "type": "object",
                    "properties": {
                        "temperatureLow": {
                            "type": "string",
                            "description": "城市的最低温度",
                        },
                        "temperatureHigh": {
                            "type": "string",
                            "description": "城市的最高温度",
                        },
                        "weather": {
                            "type": "string",
                            "description": "城市的天气情况",
                        },
                    },
                },
                "example": {
                    "code": "get_temperature_by_cityname('广州')",
                    "result": "{'temperatureLow': '14℃ ', 'temperatureHigh': '24℃ ', 'weather': '多云'}"
                }
            },
        }
    ]
    
    ```

    这里接口描述有一些技巧，

    