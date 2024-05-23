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

以上是正常使用docker从git clone到运行的过程，这时候注册登录，就能在网页中，输入对应得key来设置使用预置的大模型，UI设计几乎和ChatGPT完全一致。

![截图](/assets/image/2024/5/20240524020904.png)

当然笔者在本地部署时，遇到几个坑点

1. docker国内拉取慢
   国内速度无法clone到所需的几个镜像，而设置aliyun这类镜像也只能解决其中的几个镜像，比如常用的mongodb，其余的api等只能挂梯子。
   ![截图](/assets/image/2024/5/20240524020411.png)

2. 运行报错
   如果去掉了最后一条命令的-d，也就是后台运行，这里会出现一个报错，先忽略，这里是为了进一步配置的时候使用。
   ![截图](/assets/image/2024/5/20240524015745.png)

## 直接部署在Windows
