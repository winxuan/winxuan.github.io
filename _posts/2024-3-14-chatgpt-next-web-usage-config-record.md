---
title: ChatGPT-Next-Web客户端+Azure使用配置部署
date: 2024-3-14 12:00:00 +0800
categories: [AIGC, OpenAI]
tags: [chatgpt]
---

# 问题

笔者当前的状态是这样的，自己和朋友合租一个 vps 搭了梯子，用来连接使用 chatgpt 并且开通了 Plus，使用了接近一年时间，发现平时工作已经完全无法离开 ChatGPT，但是看着女朋友和身边的同事们此时要么不使用，要么还在使用 gpt3.5 来作为自己日常的生产力工具，并且随着将来工作的变更，也没有人维护现有的 gpt 聊天工具，本着分享的精神，而且笔者也拥有对应 4.0 api，所以笔者在为朋友和同事寻找 ChatGPT 的替代品；

# 过程

一开始笔者准备通过 flask 自学下前端相关搭建一个类似的，结果看到已经有很多人在实现类似的来降低大家的使用门槛，所以笔者也就去体验了一下，发现十分好用，于是准备写这篇文章，记录下一个小白如何使用 ChatGPT-Next-Web，由于笔者现在的同事还是使用服务端程序提供的 chatgpt，而笔者的朋友们并没有使用 Docker 和 node 等经验，所以笔者本篇文章只写下如何最简单的使用 ChatGPT-Next-Web 的方法

# 使用配置部署方案

1. 下载对应工具

这里 ChatGPT-Next-Web 提供了一个很小的 Windows 客户端版本，只要有对应密钥即可使用，好处是使用部署十分方便，坏处是密钥一旦被泄露，就比较难办，所以如果不是很熟悉的朋友，不建议使用这个版本。

首先是下载位置https://github.com/ChatGPTNextWeb/ChatGPT-Next-Web

打开网址后点 release 这里的网址

![截图](/assets/image/2024/3/20240316185645.png)

然后往下到最后会见到这个界面，这里我们只需要下载我们所需要的 Windows 版本安装包即可

![截图](/assets/image/2024/3/20240316185850.png)

2. 安装和配置

下载完成后，默认安装，一路 next 过去就好，安装完成默认会启动，首次启动会出现如下图所示的页面

![截图](/assets/image/2024/3/20240316190359.png)

这里提示的意思是需要你配置对应的 API，因为这个软件是利用 API 搭建的一个聊天框架，如果你想要使用，还是需要配置对应的 API 的。这里直接点 Settings，就可以进入到对应的软件配置界面中，进入后往下拉找到如图所示的位置：

![截图](/assets/image/2024/3/20240316190820.png)

上图就是配置 API key 的位置，笔者手里拥有的是 Azure 的 API，所以这里笔者首先将模型服务商切换到 Azure

![截图](/assets/image/2024/3/20240316191017.png)

然后接口地址这里注意了，并不是直接使用的如下图所示的 Azure 提供的终结点，而是需要拼写出对应的模型 ID

![截图](/assets/image/2024/3/20240316191308.png)

其实也比较好找，懒点的可以这么办，首先在 Azure 中找到如下图所示的模型部署，点进去然后跳转到模型调试界面

![截图](/assets/image/2024/3/20240316191503.png)

点进聊条这里 Azure 担心你调试好了不会使用对应的接口，专门提供了一个输出当前接口脚本的功能，这里下面就有对应的接口地址

![截图](/assets/image/2024/3/20240316191820.png)
![截图](/assets/image/2024/3/20240316192019.png)

比如这里的地址是

https://xxxxx-sweden-central.openai.azure.com/openai/deployments/gpt-4-turbo/chat/completions?api-version=2024-02-15-preview

对应 ChatGPT-Next-Web 软件中的配置项就是

接口地址：https://xxxxx-sweden-central.openai.azure.com/openai/deployments/gpt-4-turbo

接口版本：2024-02-15-preview

再填入对应的密钥（也就是 Azure 示例代码的接口地址下一栏即是），再填入自定义模型名，这里自定义模型名主要是为了使用时选择模型方便，比如笔者这里就写的是 Azure-gpt-4-turbo，然后再在下面模型一栏中选择填好的模型名，下面的参数建议默认即可，所有信息填好之后如图下所示：

![截图](/assets/image/2024/3/20240316192919.png)

点右上角 x 关闭设置之后，即可开始与 ChatGPT 的对话：

![截图](/assets/image/2024/3/20240316193414.png)

上图中箭头所指的位置是配置模型位置，这里我们在刚刚配置的最后一步选择了模型，所以这里默认是我们刚刚选择 Azure-gpt-4-turbo

# 结尾

ChatGPT-Next-Web 做了很多额外的配置，由于国内使用 ChatGPT 门槛对于普通人比较高，像 ChatGPT-Next-Web 这样的项目能让自己身边更多的人接触到 ChatGPT 已经很不错了，结合上 ChatGPT-Next-Web 自带的面具功能，也能降低普通人使用生成式大模型的难度。

建议日常使用比较少的用户可以不使用 20 美刀购买 Plus，用 API 足够了，但是考虑到一些深度用户，可能 Plus 一天的使用量就能回本的那种，还是开通 Plus 比较划算。
