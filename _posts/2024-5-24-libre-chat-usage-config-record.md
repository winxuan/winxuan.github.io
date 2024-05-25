---
title: LibreChat使用配置部署
date: 2024-5-24 00:00:00 +0800
categories: [AIGC, OpenAI]
tags: [chatgpt]
---

# 前言

笔者是十分看好LibreChat项目的，其项目思想和现在比较火热的ChatGPT-Next-Web和LobeChat有很大不同，其一开始就有鉴权和后端数据库，这决定了LibreChat的交互体验，尤其是跨设备体验是非常舒适的，这也是笔者在自己家里和公司都选择LibreChat的原因。笔者写这篇文章主要是为了记录部署过程，后续调整时使用。

# 部署过程

LibreChat的项目文档十分细节，细节到教会你如何更新Docker配置。如下图所示：

![截图](/assets/image/2024/5/20240524021544.png)

项目文档十分细节是非常难得的，这直接会让用户的部署和维护变得不是那么困难。并且项目支持多种部署方式，这里介绍下两种部署方式，使用Docker部署和使用Windows部署，使用Linux和Mac也大同小异。

不过部署过程还是有点小坑，尤其是第一次部署的，不一定能顺利部署启动成功，下面是笔者自己在Windows使用docker和直接部署的过程，以及踩坑&解决办法

## 使用Docker部署

Docker的部署十分简便，如果各位部署环境中有长期运行的Docker服务，十分建议选择此种部署方案，性能方面Docker几乎没有损失。其他情况还是建议直接部署比较好。

1. clone对应项目
    使用git clone命令获取到项目代码。如果是长期使用，这里笔者建议下载release版本较为稳定，目前（2024年5月23日）libreChat暂未发布release版本。

    ```
    git clone https://github.com/danny-avila/LibreChat.git
    ```

    release版本

    ```
    git clone --branch v0.7.2 https://github.com/danny-avila/LibreChat.git
    ```

2. Windows安装docker并启动
   docker官网下载并启动即可
   [docker-desktop](https://www.docker.com/products/docker-desktop/)
   ![截图](/assets/image/2024/5/20240523232229.png)

3. 配置启动项目
   命令行进入1中clone的项目根目录，首先使用cp命令创建env文件，这个相当于项目运行的小配置文件，第一次运行可以先不用管内容，先运行起来再说
   ```
   cp .env.example .env
   ```

   ![截图](/assets/image/2024/5/20240523233430.png)

   再运行docker命令启动（执行命令前建议国内的小伙伴配置下docker的国内镜像源[aliyun_mirror](https://cr.console.aliyun.com/cn-hangzhou/instances/mirrors)

   ```
   docker compose up -d
   ```

   ![截图](/assets/image/2024/5/20240524014108.png)

   上面的命令会自动拉取所需要的镜像，并创建启动容器，启动运行正常后，因为这里命令带了-d，所以运行正常之后，命令行可以正常执行命令的。

   这时候进入http://localhost:3080/ ，正常就会出现相应的注册登录界面
   ![截图](/assets/image/2024/5/20240524015917.png)

以上是正常使用docker从git clone到可以运行的过程，这时候注册登录，就能在网页中，输入对应得key来设置使用预置的大模型，UI设计几乎和ChatGPT完全一致。

![截图](/assets/image/2024/5/20240524020904.png)

如果需要进一步配置，比如配置默认的模型和key等，就需要修改config文件，笔者这里介绍下两种配置，一种是Azure，一种是笔者本地的llama3，两种方案涵盖了大部分需求：

1. libreChat配置Azure OpenAI
   笔者这里默认大家已经配置好了Azure OpenAI模型部署相关，所以会直接从libreChat的配置写起，项目工程作者也提供了配置的方法说明[configuration](https://www.librechat.ai/docs/configuration)
   1. 首先需要按照作者的步骤，复制粘贴下config文件（好像新版本作者取消了这个步骤）
      ```
      cp librechat.example.yaml librechat.yaml
      ```
   2. 修改下docker-compose.yml，添加一行
      ```
      - ./librechat.yaml:/app/librechat.yaml
      ```
      ![截图](/assets/image/2024/5/20240524143301.png)
      不修改这里的话，因为docker的原因，会找不到这个librechat.yaml的，librechat.yaml的配置也会失效
      ![截图](/assets/image/2024/5/20240524015745.png)
      这里bug好像作者是已知的，但是没有修复，不知道为什么，建议如果没报错或者配置生效了，建议不改了
   
   3. 修改librechat.yaml，配置Azure OpenAI
      作者给每一个修改都添加了具体的修改说明，比如[Azure OpenAI](https://www.librechat.ai/docs/configuration/librechat_yaml/ai_endpoints/azure)
      Azure OpenAI的配置因为有了终结点，部署名和部署模型等，变得非常复杂，这里笔者根据自己日常所需，需要三种模型，gpt3.5，4，o，所以举了下例子：

      笔者这里假设Azure OpenAI中配置得到了如下参数（key是我乱敲的）：
      ```
      终结点1: https://marvin-sweden-central.openai.azure.com/
      密钥: deas90d8f90as8d8f09a8sd0asdfa
      部署模型1: gpt-4
      部署名: gpt-4-turbo
      部署模型2: gpt-35-turbo
      部署名: gpt-35-turbo

      终结点2: https://marvin-us-north-central.openai.azure.com/
      密钥: jolk122j312jlkj1l2k3jlkjasdf
      部署模型1: gpt-4o
      部署名: gpt-4o
      ```
      
      这里由于Azure OpenAI并不是在所有地区开放所有模型的，所以需要配置多个终结点，比如笔者这里，需要使用gpt3.5和4以及4o，3.5和4部署在瑞典中部，而4o部署在美东，具体部署模型与地区可以参考：
      [模型摘要表和区域可用性](https://learn.microsoft.com/zh-cn/azure/ai-services/openai/concepts/models#model-summary-table-and-region-availability)

      那么对应的librechat.yaml就需要添加如下的配置
      ```
      endpoints:
         azureOpenAI:
            # Endpoint-level configuration
            titleModel: "gpt-3.5-turbo"
            titleMethod: "completion"
            summarize: true
            summaryModel: "gpt-4o"
            plugins: true
            groups:
            # Group-level configuration
            - group: "sweden-central"
               apiKey: "deas90d8f90as8d8f09a8sd0asdfa"
               baseURL: "https://${INSTANCE_NAME}.openai.azure.com/openai/deployments/${DEPLOYMENT_NAME}/chat/completions?api-version=${version}"
               instanceName: "marvin-sweden-central"
               models:
                  gpt-3.5-turbo:
                     deploymentName: gpt-35-turbo
                     version: "2024-02-01"
                  gpt-4:
                     deploymentName: gpt-4-turbo
                     version: "2024-02-15-preview"
         
            - group: "us-north-central"
               apiKey: "jolk122j312jlkj1l2k3jlkjasdf"
               baseURL: "https://${INSTANCE_NAME}.openai.azure.com/openai/deployments/${DEPLOYMENT_NAME}/chat/completions?api-version=${version}"
               instanceName: "marvin-us-north-central"
               models:
                  gpt-4o:
                     deploymentName: gpt-4o
                     version: "2024-02-01"
      ```
      作者的配置为了适配Azure OpenAI的复杂性也非常复杂，配置参数之间也相互有耦合，也不太好理解。这里笔者能省略即省略了，这个应该是能配置2个终结点多个模型的最简化配置了。
      下面我分别解释下上述出现的配置是干嘛的
      首先是Endpoint-level configuration的配置（azureOpenAI下面的第一层缩进）
      1. titleModel: 配置生成对话中的标题的模型，就是这里
         ![截图](/assets/image/2024/5/20240524235752.png)
         这里可以看出，模型根据对话内容自动总结出了标题
         一般不重要，不过还是要有的吧，可以直接设置成模型名，也可以设置成"current_model"
      2. titleMethod: 决定titleModel生成的方式，有两种选项，像笔者一样不配置默认是"completion"，还有一种是"functions"，两个的区别作者没有写，不过翻代码可以看到
         completion的部分，作者是以system的角色让titleModel的模型生成了标题
         ![截图](/assets/image/2024/5/20240525000850.png)
         functions的部分，作者是用到了langchain那套方法，保底还是completion的，细节不再看了，还是会用到大模型生成的，只是方法不同
         ![截图](/assets/image/2024/5/20240525002325.png)
         所以笔者这里直接默认缺省了
      3. titleConvo: 给所有的Azure模型配置生成标题，默认false，笔者暂时没发现使用场景，因为就配置了3个gpt的，暂时缺省了
      4. summarize: 给所有的Azure模型配置对话摘要，默认false，这个是摘要功能，开启这个可以节省token，建议开启
         很多类chatGPT都会有摘要功能，原因是长对话会出现上下文，如果不开启摘要，会将对话原封不动的再次传递给模型，会浪费大量的token，开启后可以摘要后再传递给模型，节省token，建议开启。
      5. summaryModel: 摘要也是需要大模型来做的，所以需要配置摘要的模型，这里也别太省，gpt-4o是个不错的选择
      6. plugins: 插件功能，作者给配置了几个比较常用的插件功能，Google搜索，Azure AI Search之类的，要深入配置的，如果感兴趣可以阅读作者的[tools](https://www.librechat.ai/docs/configuration/tools)
         这里作者没有写明白开启的这个插件是什么，笔者自己理解是这里配置插件为true时，对应插件会使用该大模型，配置为true的话插件这里如下图所示
         ![截图](/assets/image/2024/5/20240525130652.png)
         如果没有配置，默认会是false，默认会使用openai的大模型，需要输入key才能正常使用插件。
      7. assistants: 这个是设置Azure assistants的，关于assistants可以看微软的文档[Azure assistants](https://learn.microsoft.com/zh-cn/azure/ai-services/openai/concepts/assistants)
         笔者个人理解Azure assistants十分没有必要，一般公司内不会将资料拱手给微软，一般个人用户也没有那么多资料需要，而且部分会有额外定价，笔者这里看到定价是0.03刀每次
         ![截图](/assets/image/2024/5/20240525131203.png)
      综上，作者这里在# Endpoint-level configuration的配置如下
      ```
      titleModel: "gpt-3.5-turbo"
      titleMethod: "completion"
      summarize: true
      summaryModel: "gpt-4o"
      plugins: true
      ```
      
      然后是# Group-level configuration（groups下面的缩进）
      1. group：不会影响实际功能，只是为了标记每个grop的不同，这里笔者因为每个grop是用了一个Azure地区，于是就使用了Azure的地区名
      2. apiKey：就是密钥
      3. instanceName：作者解释是Name of the Azure OpenAI instance，笔者这里翻代码发现这个instanceName实际上就是Azure的那个终结点前面的一段数据
         比如笔者的终结点是https://marvin-sweden-central.openai.azure.com/，那么这个instanceName就是marvin-sweden-central
         ![截图](/assets/image/2024/5/20240525132114.png)
      4. deploymentName：部署模型自己定的名称
         ![截图](/assets/image/2024/5/20240525132448.png)
      5. version：调用模型用的API版本（注：不是部署模型的版本），这个可以从

2. libreChat配置llama3

当然笔者在本地部署时，遇到几个坑点

1. docker国内拉取慢
   国内速度无法clone到所需的几个镜像，而设置aliyun这类镜像也只能解决其中的几个镜像，比如常用的mongodb，其余的api等只能挂梯子。
   ![截图](/assets/image/2024/5/20240524020411.png)

2. 运行报错librechat.yaml
   这里会有两种报错：一种是上文中
   

## 直接部署在Windows
