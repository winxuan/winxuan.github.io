---
title: GPT API 调用本地函数（function call）
date: 2024-1-8 00:00:00 +0800
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

1. 接口实现：根据城市名获取当前天气的脚本

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

2. 接口描述：也就是告诉GPT我们提供了一个什么样的接口让它调用

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

    一般的函数或者接口按照上述的函数描述，GPT就可以很好的理解函数到达的目的，这里建议抄作业即可；


3. prompt撰写：撰写system和符合预期的用例

    根据之前的prompt提示词学习，这个例子因为非常简单，对应提示词其实可以很简化：

    ```
    system：你是一个根据天气查询机器人。根据用户给出的城市名，通过调用接口，获取到该城市当天的天气状况，并返回给用户。

    example：{
        1. 
            uesr：我想知道广州的天气？
            assistant：今天广州天气多云，最高气温24℃，最低气温14℃
        2.
            uesr：广州天气怎么样？
            assistant：今天广州天气多云，最高气温24℃，最低气温14℃
    }
        
    ```

4. 代码实现：使用python实现该机器人
    
    这里也是分几步完成，按照如下步骤进行即可：

    1. GPT的API使用方法：
        这里有两种使用方法，微软和OpenAI官方的两种API，这里微软给出了两者的调用转换
        <a href="https://learn.microsoft.com/zh-cn/azure/ai-services/openai/how-to/switching-endpoints" target="_blank">如何使用 Python 在 OpenAI 和 Azure OpenAI 终结点之间进行切换</a> <br />

        这里我们会用到azure的API，所以我们代码中使用了这个
        ```python
        import os
        from openai import AzureOpenAI
            
        client = AzureOpenAI(
            api_key=os.getenv("AZURE_OPENAI_KEY"),  
            api_version="2023-12-01-preview",
            azure_endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
        )
        ```
        当然如果你是OpenAI的API用户，只需要替换成这样
        ```python
        from openai import OpenAI

        client = OpenAI(
        api_key=os.environ['OPENAI_API_KEY']  
        )
        ```
        因为OpenAI Python API 库 1.x的发布，所以现在OpenAI和azure的调用区别只有密钥部分，使用调用时可以说时完全一致了，详情请参考微软文档

        <a href="https://learn.microsoft.com/zh-cn/azure/ai-services/openai/how-to/migration?tabs=python%2Cdalle-fix" target="_blank">迁移到 OpenAI Python API 库 1.x</a> <br />

        > 这里请务必使用1.x的库，如果没有请务必升级
        {: .prompt-warning }

    2. 函数调用例程

        这里微软和OpenAI官方都给了例程，也就是配置好python环境，在例程中加入自己的密钥部分即可直接运行，大家可以测试下：

        微软：

        <a href="https://learn.microsoft.com/zh-cn/azure/ai-services/openai/how-to/function-calling?tabs=python" target="_blank">如何将函数调用与 Azure OpenAI 服务配合使用（预览版）</a> <br />

        OpenAI：（见Example invoking multiple function calls in one response部分，代码被折叠起来了）

        <a href="https://platform.openai.com/docs/guides/function-calling" target="_blank">Function calling</a> <br />

        目前应该不能直接使用（2024年1月8日），因为两个例程中都会在这里报错

        ```python
        second_response = client.chat.completions.create(
        报错：Error code: 400 - {'error': {'message': "'content' is a required property - 'messages.1'", 'type': 'invalid_request_error', 'param': None, 'code': None}}
        ```

        原因其实很简单，1.x的API不允许返回的key中None，当然你使用低于1.x的API也会报错，报错是提示你格式不对，这里其实GitHub有讨论这个问题，

        <a href="https://github.com/openai/openai-python/issues/703" target="_blank">The official example for Function Calling doesn't work with SDK version 1.1.1</a> <br />

        代码中的错误行是这个
        ```python
        messages.append(response_message)  # extend conversation with assistant's reply
        ```

        原因是response返回的是一个object，你直接append肯定会出事，这里需要append前转换下格式：
        ```python
        response_message = dict(response.choices[0].message)
        ```
        这里就应该可以解决低于1.x的API报错的问题

        但是1.x会继续报错，因为None的问题，其实可以观察下dict后的返回值

        ```python
        {'content': None, 'role': 'assistant', 'function_call': None, 'tool_calls': [ChatCompletionMessag...function'), ChatCompletionMessag...function'), ChatCompletionMessag...function')]}
        ```
        content为None，function_call也为None，API的要求是不允许返回None，所以删除掉所有None的key就行了

        ```python
        response_message = {k: v for k, v in response_message.items() if v is not None}
        ```
        
        应该又会提示content不存在，因为API还有另一个要求是content必须在，所以这里就给它一个空的值

        ```python
        response_message["content"] = ""
        ```

        总的来说：

        使用低1.x版本的API就修改成这样
        ```python
        response_message = dict(response.choices[0].message)
        messages.append(response_message)  # extend conversation with assistant's reply
        ```

        使用1.x版本的API就修改成这样
        ```python
        response_message = dict(response.choices[0].message)
        response_message = {k: v for k, v in response_message.items() if v is not None}
        response_message["content"] = ""
        messages.append(response_message)  # extend conversation with assistant's reply
        ```

        修改完成后再次运行就会正常

    3. 适配我们自己的程序

        运行完例程之后，需要学习下如何做修改使其适配我们自己的程序

        结合我们刚刚前置的操作步骤，我们需要修改的位置有以下几处：

        1. prompt提示词：需要将提示词部分，代码中就是messages，修改成我们自己的提示词；
        
        2. tools：即我们描述我们函数接口的部分，我们刚刚的tools和例程中的格式一致，直接修改过来即可；

        3. 函数：在AI工作时，会去已知的接口中查找到能用的接口，并且需要拼装对应的参数，直接替换修改即可；

    完成上述步骤之后，我们的代码就完成了

    
    ```python
    from urllib.request import urlopen
    from bs4 import BeautifulSoup

    import requests as r
    import json
    from typing import Dict

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
        # print('temperatureLow = ' + temperatureLow, ' temperatureHigh = ' + temperatureHigh, ' weather = ' + weather)

        return json.dumps({'temperatureLow':temperatureLow, 'temperatureHigh':temperatureHigh, 'weather':weather})
        # return json.dumps({'temperatureLow':"16℃", 'temperatureHigh':"16℃", 'weather':"多云"})

    # AI代码
    from openai import AzureOpenAI
        
    client = AzureOpenAI(
        api_key= "",    # 这里填写你的密钥
        api_version="2023-12-01-preview",
        azure_endpoint = "" # 这里填写你的终结点
    )

    def run_conversation():
        # Step 1: send the conversation and available functions to the model
        messages = [{"role": "user", "content": "深圳今天天气怎么样"}]
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
        response = client.chat.completions.create(
            model="gpt-35-turbo-1106",
            messages=messages,
            tools=tools,
            tool_choice="auto",  # auto is default, but we'll be explicit
        )
        response_message = response.choices[0].message
        tool_calls = response_message.tool_calls
        # Step 2: check if the model wanted to call a function
        if tool_calls:
            # Step 3: call the function
            # Note: the JSON response may not always be valid; be sure to handle errors
            available_functions = {
                "get_temperature_by_cityname": get_temperature_by_cityname,
            }  # only one function in this example, but you can have multiple
            response_message = dict(response.choices[0].message)
            response_message = {k: v for k, v in response_message.items() if v is not None}
            response_message["content"] = ""
            messages.append(response_message)  # extend conversation with assistant's reply
            # Step 4: send the info for each function call and function response to the model
            for tool_call in tool_calls:
                function_name = tool_call.function.name
                function_to_call = available_functions[function_name]
                function_args = json.loads(tool_call.function.arguments)
                function_response = function_to_call(
                    cityname=function_args.get("cityname"),
                )
                messages.append(
                    {
                        "tool_call_id": tool_call.id,
                        "role": "tool",
                        "name": function_name,
                        "content": function_response,
                    }
                )  # extend conversation with function response
            second_response = client.chat.completions.create(
                model="gpt-35-turbo-1106",
                messages=messages,
            )  # get a new response from the model where it can see the function response
            return second_response

    print(run_conversation())
    ```

## 总结

以上只是给出一个例程，通过这个例程可以掌握函数调用的基本方法，后续遇到更复杂的情况，基于这些基本方法，并结合一些流程设计和编程技巧，问题都会迎刃而解。

        

    