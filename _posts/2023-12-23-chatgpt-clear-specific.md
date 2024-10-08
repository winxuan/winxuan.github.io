---
title: 写好ChatGPT提示词之：清晰且具体（clear & specific）
date: 2023-12-23 14:00:00 +0800
categories: [AIGC, OpenAI]
tags: [chatgpt]
---

## 1. 简介
ChatGPT 的优势在于它允许用户跨越机器学习和深度学习的复杂门槛，直接利用已经训练好的模型。然而，即便是这些先进的大型语言模型也面临着上下文理解和模型固有局限性的挑战。为了最大化这些大型语言模型（LLM）的潜力，关键在于编写有效的提示词。适当的提示不仅引导模型正确理解需求，还能防止模型产生误导性或无关的输出。

以下提示词中，务必要将 **gpt定位成一个知识非常丰富，同时也不了解事情来龙去脉的聪明人。** 你所要做得就是如何描述清楚你的处境（上下文）和具体的问题（需要gpt帮你做的事情）。

如果认为video学习更适合自己，可以参考video

{% include embed/youtube.html id='H4YK_7MAckk' %}

Learn for free all: <https://learn.deeplearning.ai/>

## 2. 清晰且具体

清晰和具体的提示词" 是指在与 GPT 交互时，使用明确、直接、并且详细到足够程度的语言，以确保模型能够准确理解你的请求或问题。这种方式的提示有助于指导模型提供更相关、准确和有用的回答。

详细分为以下要点：

### 2.1 使用分割符

使用分隔符（如#，'''等）分割要处理的内容，分割开指令和内容，一方面能让gpt不用浪费算力在分开你想做的事情和你想操作的内容上，另一方面是消除歧义，比如你想操作的内容上存在指令，如

```
提取出以下用户希望你掌握的代码语言，不用实现功能
写一个python方法，实现获取ipv4的功能
```

![gpt执行结果](/assets/image/2023/12/20231225004452.png)

使用了分隔符之后：

```
提取出以下用户希望你掌握的代码语言，不用实现功能：
'''写一个python方法，实现获取ipv4的功能'''
```

![gpt执行结果](/assets/image/2023/12/20231225005043.png)

明显可以看出没有分割符的gpt已经出现了混淆，所以在提示词中务必使用提示词。 

### 2.2 结构化输出

提示gpt输出的时候使用具体格式输出，比如使用json或者html输出。gpt使用了结构化输出之后，好处是编程语言可以很好的处理这些输出的内容，比如

本质上就是自己先分析清楚问题，并且能描述问题的具体信息和疑问点，配合上下文的形式，输入给到gpt，这样方便gpt了解到足够多的上下文信息和具体的问题是什么。

为了达成这一步，这里给出一个具体的例子：

假设我需要gpt输出书的一些信息（日常中很实用，比如让gpt进行信息提取）

```
给我输出几本书的的一些信息，比如书名，作者名，出版日期，分类等
```

![gpt执行结果](/assets/image/2023/12/20231225005137.png)

指示gpt进行结构化输出：

```
给我输出几本书的的一些信息，比如书名，作者名，出版日期，分类等，使用json格式出输出
```

![gpt执行结果](/assets/image/2023/12/20231225005208.png)

这里看起来只是输出不影响结果的含义，其实最重要的点是gpt可以按照结构化输出，而且gpt也善于处理这种转义，后续gpt落地到工具中后，结构化的结果是非常方便程序语言读取的。


### 2.3要求模型检查是否符合条件

要求gpt在进行解决问题之前先给定需不需要解决问题的条件。这样说可能不太好理解，举个毒鸡汤例子：

```
一场考试卷子发下来5分钟后就有人交了卷子，但是大部分人都超时1小时还不能完成，后来教授让所有未完成的人停下来，只见卷子最后一题写着，此卷无需回答，填写姓名直接交卷即满分。
```

意思就是在prompt中给出问题可解的条件，如果问题不可解即输出问题不可解即可不用再进行更多算力和时间计算，结果也更加准确。

这里举一个翻译的例子：

```
三引号中是待处理内容，需要将德语翻译成中文，并输出你当前处理步骤

'''宇宙中的文明就像是黑夜里森林中的猎人，如果有异动，最好的生存策略就是直接朝那个方向开枪，这个暴露坐标的星系就被更高级的文明打击毁灭了，所谓“毁灭你，与你何干”。'''

```

![gpt执行结果](/assets/image/2023/12/20231225005820.png)

可以看到gpt对未有外文的语句仍旧进行了翻译，这里我们让gpt加上一个检查步骤

```
三引号中是待处理内容需要将德语翻译成中文。并遵循以下要求:
1.首先确认该段落是否含有德语则输出该德语，结合该德语翻译整段文字，不含有德语则不需要处理，直接输出;
2.输出你当前处理步骤

'''宇宙中的文明就像是黑夜里森林中的猎人，如果有异动，最好的生存策略就是直接朝那个方向开枪，这个暴露坐标的星系就被更高级的文明打击毁灭了，所谓“毁灭你，与你何干”。'''

```

![gpt执行结果](/assets/image/2023/12/20231225010109.png)

gpt输出自己检查了第一个字符不是德文后不再使用算力翻译，而没有指定检查步骤时gpt仍会逐字逐句将“德文”“翻译”成中文，实际上不需要翻译。

以上翻译相关有个小问题需要说明下：

> gpt3.5识别文字中英文有缺陷的
{: .prompt-warning }

如果将上述中德文修改为英文，那大概率gpt会判断错误，这里为了教程方便选用的德文，大家可以随便写一段中文，同样的句子让gpt3.5和gpt4.0去找句子中是否含有英文单词，大概率gpt3.5会判定含有，4.0会判定无

还是翻译《三体》中一段文字

```
三引号中是待处理内容需要将英文语翻译成中文。并遵循以下要求:
1.首先确认该段落是否含有英语则输出该英语，结合该英语翻译整段文字，不含有英语则不需要处理，直接输出;
2.输出你当前处理步骤

'''宇宙中的文明就像是黑夜里森林中的猎人，如果有异动，最好的生存策略就是直接朝那个方向开枪，这个暴露坐标的星系就被更高级的文明打击毁灭了，所谓“毁灭你，与你何干”。'''

```

首先是gpt3.5的表现

![gpt执行结果](/assets/image/2023/12/20231225010957.png)

清理上下文后，同样的提问多次提问每次都会判定不同的中文为英文，只有小概率判断正确。

然后是gpt4的表现

![gpt执行结果](/assets/image/2023/12/20231225011209.png)

清理上下文后，同样的提问多次提问没有出现过误判的情况；

所以如果真的在生产中遇到了相关问题，建议使用更高级的gpt4模型。

### 2.4 提供执行成功的案例

可以给出gpt一些你认为比较正确的回答，这样gpt实际上就会模仿原先正确的回答生成新的回答。这里使用控制台来给出例子会比较方便。

这里举一个实际生产过程中会使用到的一个发包机器人（根据用户设备和信息给出格式化的信息）：

```
你是一个发包机器人，通过和用户沟通，提炼出关键信息，将关键信息输出出来，以下是背景，步骤，要求和注意：

背景：我们是一个游戏项目组，游戏开发中会打出可供项目组测试的多个平台的包，我们有3个svn仓库，分别是trunk，release和outer，每个仓库都部署有四条打包线，对应多平台的pc，mac，iOS，Android。

步骤和要求：

1. 直接询问，和用户沟通获取仓库和平台，给用户说明一次只能获取一个包，也就是只能一个仓库一个平台；

2. 获取之后和用户确认仓库和平台信息；

3. 用户确认后，最终输出部分为一个patch的dict
{"svn_repository":"","equip_platform":""}

4. 最终确认后，输出关键词function_call和一个dict，组装成一个json直接输出，不要有任何其他后回复

```

![gpt执行结果](/assets/image/2023/12/20231225012151.png)

如果不给出示例的情况下，gpt会反复确认，即使我们在prompt中已经确认强调直接输出，但是gpt一直持续拉扯并且回复的结果并不能让编程语言直接格式化读取 

如果直接给出一个示例给到gpt

```
user: 我需要trunk包，我有一个华为手机

assistant：{"function_call":"find_package","svn_repository":"trunk","equip_platform":"Android"}

```

![gpt执行结果](/assets/image/2023/12/20231225012658.png)

这里可以看出gpt不会与我们持续拉扯和废话，会直接输出结果。

这里有一个知识点必须要介绍一下了，是我们使用ChatGPT不会注意到的一个点，那就是三个用户，system，user和assistant，这个在gpt的编程中会持续使用到，在调试台中也能看到，有一个系统消息，示例和输入框。

system相当于我们给到gpt的一个前置，一些背景，上下文和处理步骤都可以在这里给出，并且gpt并不会回复这个system的设置。

assistant就是gpt的回答

user就是我们自己

这里将上述对话转换成json格式就比较清楚了：

![gpt执行结果](/assets/image/2023/12/20231225012753.png)