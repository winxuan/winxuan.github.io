---
title: LibreChat--钱包积分系统（控制用户tokens使用量）
date: 2024-5-24 00:00:00 +0800
categories: [AIGC, OpenAI]
tags: [chatgpt]
---

LibreChat是用户积分系统的，也就是可以控制每个人tokens的使用量。


# token相关

如果需要了解LirbeChat中是如何控制每个人tokens的使用量，首先需要了解一些关于token的定义和计算方法，如果已经非常了解，可以跳过该段。

## token定义

token，直译为令牌。在大型语言模型（如GPT系列）中，token是文本的基本单位。

理解token对于使用和开发这些模型非常重要。以下是关于token的一些关键点：

1. 基本定义：

    Token是文本的最小单位，可以是一个单词、一个单词的一部分、一个标点符号，或者是一个特殊字符。
    例如，"Hello, world!" 可能被分成 ["Hello", ",", " ", "world", "!"] 这几个token。

2. 作用：

    输入表示：模型接收输入时，文本被转换成token序列。
    输出生成：模型生成文本时，是一个接一个地生成token。
    上下文限制：模型有token数量限制（如GPT-3的2048个token），决定了一次可处理的文本长度。

    比如笔者做了以下输入：

    ![截图](/assets/image/2024/6/20240623204308.png)

    那么输入就是"Hello, world!"，模型输出就是"Hello! How can I assist you today?"

    后台可以看到本轮对话的具体信息：

    ![截图](/assets/image/2024/6/20240624011604.png)

    ![截图](/assets/image/2024/6/20240624011628.png)

3. 特点：

    语言无关：同一个模型可以处理多种语言，因为token是基于统计规律划分的。
    非固定长度：英语中，一个token平均对应约4个字符，但这不是固定的。

4. 影响：

    计算成本：处理的token数量直接影响计算成本和时间。
    模型性能：更多的token通常意味着更好的上下文理解，但也增加了计算负担。


5. 应用考虑：

    API使用：许多AI服务按token计费，了解token有助于估算成本。
    提示工程：编写高效提示时，需要考虑token的使用。

6. 技术实现：

    分词器（Tokenizer）负责将文本转换为token。
    不同模型可能使用不同的分词方法，如BPE（Byte Pair Encoding）、WordPiece等。


7. 挑战：

    稀有词：某些专业术语或不常见词可能被分割成多个token，影响理解。
    跨语言应用：不同语言的token效率可能不同。



理解token概念有助于更好地利用和优化大语言模型，无论是在应用开发、成本管理还是性能优化方面。


## token计算

上文定义中提到，AI服务按token计费而不是按照字符数来，而分词器（Tokenizer）是负责将文本转换为token的工具。

这里关于分词器，每个模型都有不同的分词器，比如gpt-3.5-turbo和gpt-4o，同样的文本经过不同的分词器，结果的token数是不一样的，如下图

![截图](/assets/image/2024/6/20240624013820.png)

![截图](/assets/image/2024/6/20240624014005.png)

这里OpenAI在推出gpt-4o时，为gpt-4o配置了一个全新的分词器，而且该分词器针对非英文语言的句子拆分为更长的词组，也就是说比如这个“中国福利彩票天天”，在之前的分词器中，会有10个token，而在新的分词器中只有2个

![截图](/assets/image/2024/6/20240624014321.png)

![截图](/assets/image/2024/6/20240624014249.png)

也就是说好的分词器，同样的文本，对应的token少了，而模型计算就是按照token来得，则价格也随之降低了

比如gpt-4和gpt-4o（gpt-3.5和gpt-4用的同样的分词器），这里看起来是价格全面降低了一半，实际上降低的更多

![截图](/assets/image/2024/6/20240624014812.png)

但是分词器只能由具体模型供应商自己决定。


# LibreChat钱包积分系统

LibreChat中项目作者设计了一套积分管理系统，这套管理系统能管理每个用户的使用限额，比如给一个用户设定了1000积分，则用户在消耗了1000积分之后，就不能再正常使用了，需要管理员充值才能正常使用，并且项目作者还设计了一套从积分和token之间得转换逻辑，统一了不同token定价的模型，积分始终可以和钱挂钩。

比如假设1刀能换100万积分，再假设100万积分能换gpt-3.5的100万个生成token，同样的，gpt4的1生成token是gpt3.5的20倍，则100万积分只能换5万个生成token

具体计算的细节，首先需要了解LibreChat中实际消耗token具体计算逻辑和包含哪些内容范围，然后再了解项目作者是怎么把积分转换成token的，以及怎么管理和配置用户的积分

## LibreChat中token计算逻辑

细心的读者已经发现了，笔者在上文举例中提到的token计算，明明这句"Hello! How can I assist you today?"，只有9个token，为什么数据库中记录了13个，是不是LibreChat在偷摸用我的模型接口。

![截图](/assets/image/2024/6/20240624011628.png)

这里是因为OpenAI 的 API 在处理对话时，会添加一些特殊标记，如 <|im_start|> 和 <|im_end|>。这些标记用于标识消息的开始和结束。

纯文本 "Hello! How can I assist you today?" 确实是 9 个 token，添加 <|im_start|> 和 <|im_end|> 后，总 token 数增加到 13 个。

这就是为什么数据库中会出现13个token的原因

这里我们用提示输入1和模型返回1来测试，发现LibreChat中数据库都会记录tokenCount为5，也就是会计算<|im_start|> 和 <|im_end|>的4个token

如下图所示
用户输入1，模型回复一串的数据是：
User--tokenCount:5，用户输入1则一共5个token
Azure OpenAI--tokenCount:272，模型回复了272个token
总共277个token

用户输入n个字符，模型只回复1的数据是：
User--tokenCount:26，用户输入一共26个token
Azure OpenAI--tokenCount:5，模型回复1用了5个token
总共31个token

![截图](/assets/image/2024/6/20240624032504.png)

而积分系统中则不同

首先是提示输入1和模型回复，如下图所示，积分系统中一共记录了4条数据，分别是

message--prompt:-8，用户输入的1消耗了8个token
message--completion:-268，模型回复消耗了268个token
title--prompt:-131，预置的生成标题的输入消耗了131个token
title--completion:-6，模型回复的标题消耗了6个token
也就是这段对话共消耗了413个token

![截图](/assets/image/2024/6/20240624033456.png)

然后是提示输出n个字符，模型回复1

![截图](/assets/image/2024/6/20240624033540.png)

message--prompt:-29，用户输入的消耗了29个token
message--completion:-1，模型回复1消耗了1个token
title--prompt:-89，预置的生成标题的输入消耗了89个token
title--completion:-9，模型回复的标题消耗了9个token
也就是这段对话共消耗了128个token

这里积分系统细心的用户就会发现，为什么积分系统中记录了这么多，是不是LibreChat在替商家黑我们？

实际上这里是因为大模型的设计，也就是隐形消耗的token了

首先大模型并不是除了我们看到的用户输入1回复了一堆，一共只消耗了277个，实际上还要包括系统角色消耗，标题生成消耗

比如这里提示输入1，则对应的token应该是1，特殊token增加了4个，然后system的提示词又增加了3个，所以用户只输入了1，但是实际消耗是8

而细心的用户又发现，这里生成怎么又算少了，生成的token是272个，怎么积分系统只计算了268个，少算了4个？实际上并不是少算，而是OpenAI并不计算这4个

比如模型回复了1，对应的token应该是1，这里并不用计算特殊Token的4个，也没有其他角色消耗，所以回复1的实际消耗是1

## LibreChat中token计算包含范围

## token与钱包积分转换规则

## LibreChat配置与管理钱包积分系统

