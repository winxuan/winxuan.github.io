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
   [docker-desktop]:https://www.docker.com/products/docker-desktop/
   ![截图](/assets/image/2024/5/20240523232229.png)

3. 配置启动项目
   命令行进入1中clone的项目根目录，首先使用cp命令创建env文件，这个相当于项目运行的小配置文件，第一次运行可以先不用管内容，先运行起来再说
   ```
   cp .env.example .env
   ```

   ![截图](/assets/image/2024/5/20240523233430.png)

   再运行docker命令启动（执行命令前建议国内的小伙伴配置下docker的国内镜像源[aliyun_mirror]:https://cr.console.aliyun.com/cn-hangzhou/instances/mirrors）

   ```
   docker compose up -d
   ```

   ![截图](/assets/image/2024/5/20240524014108.png)

   上面的命令会自动拉取所需要的镜像，并创建启动容器，启动运行正常后，因为这里命令带了-d，所以运行正常之后，命令行可以正常执行命令的。

   这时候进入http://localhost:3080/，正常就会出现相应的注册登录界面
   ![截图](/assets/image/2024/5/20240524015917.png)

以上是正常使用docker从git clone到可以运行的过程，这时候注册登录，就能在网页中，输入对应得key来设置使用预置的大模型，UI设计几乎和ChatGPT完全一致。

![截图](/assets/image/2024/5/20240524020904.png)

如果需要进一步配置，比如配置默认的模型和key等，就需要修改config文件，笔者这里介绍下两种配置，一种是Azure，一种是笔者本地的llama3，两种方案涵盖了大部分需求：

1. libreChat配置Azure OpenAI
   笔者这里默认大家已经配置好了Azure OpenAI模型部署相关，所以会直接从libreChat的配置写起，项目工程作者也提供了配置的方法说明[configuration]https://www.librechat.ai/docs/configuration
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
      作者给每一个修改都添加了具体的修改说明，比如[Azure OpenAI]:https://www.librechat.ai/docs/configuration/librechat_yaml/ai_endpoints/azure
      Azure OpenAI的配置因为有了终结点，部署名和部署模型等，变得非常复杂，这里笔者根据自己日常所需，需要三种模型，gpt3.5，4，o，所以举了下例子：

      笔者这里假设Azure OpenAI中配置得到了如下参数：
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
      [模型摘要表和区域可用性]:https://learn.microsoft.com/zh-cn/azure/ai-services/openai/concepts/models#model-summary-table-and-region-availability

      那么对应的librechat.yaml就需要添加如下的配置
      ```
      endpoints:
         azureOpenAI:
               # Endpoint-level configuration
               titleModel: "current_model"
               titleMethod: "completion"
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
      作者的配置为了适配Azure OpenAI的复杂性也非常复杂，这里笔者能省略即省略了，这个应该是能配置2个终结点多个模型的最简化配置了。


2. libreChat配置llama3

当然笔者在本地部署时，遇到几个坑点

1. docker国内拉取慢
   国内速度无法clone到所需的几个镜像，而设置aliyun这类镜像也只能解决其中的几个镜像，比如常用的mongodb，其余的api等只能挂梯子。
   ![截图](/assets/image/2024/5/20240524020411.png)

2. 运行报错
   如果去掉了最后一条命令的-d，也就是后台运行，这里会出现一个报错，先忽略，这里是为了进一步配置的时候使用。
   

## 直接部署在Windows
