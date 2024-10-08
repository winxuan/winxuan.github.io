---
title: 使用Google Analytics监听GitHub pages页面访问量
date: 2024-1-4 18:00:00 +0800
categories: [Blog, Build]
tags: [blog]
---

## 背景

自建blog后会发现，原来在一些大型平台创建blog时，后台会有相关的数据监控，比如帖子的浏览数量等数据，当使用GitHub pages自建时，这些功能往往都不是GitHub pages和相关主题自带的，会提供一些接口，仍需要我们配置等；

![主题](/assets/image/2024/1/20240104182130.png)

这里提供一种借助Google Analytics实现一些基本数据的监控，类似如图这些数据，并且Google Analytics也有相关API，后面想根据数据做一些自动化也是非常方便的。

![主题](/assets/image/2024/1/20240104173304.png)

## Google Analytics介绍

由谷歌提供的网站流量和网站表现分析服务。它允许网站所有者了解他们的网站访问者的行为，包括他们从何处来，他们在网站上花费多少时间，以及他们最感兴趣的内容等信息。

主要功能包括：

1. 流量分析：追踪访问者的来源，无论是直接访问、搜索引擎、社交媒体还是推荐链接。

2. 用户行为追踪：分析用户在网站上的活动，比如访问的页面、停留的时间以及互动行为。

3. 转化跟踪：监测目标完成情况，例如购物车的使用、注册或下载等。

4. 自定义报告：用户可以根据自己的需要创建定制报告，以便更好地理解数据。

5. 实时报告：查看实时数据，了解当前有多少人在浏览网站以及他们的行为。

6. 细分市场分析：可以根据地理位置、设备类型、访问来源等多种维度来细分市场。

7. 集成其他Google服务：如Google Ads，使广告投放更加高效。

Google Analytics 对于网站所有者来说是一个非常有价值的工具，因为它提供了深入了解网站表现和用户行为的数据，帮助他们做出更明智的营销和内容决策。

这里实际上我们用的比较多的是实时报告相关，可以看到具体的每天每个页面访问人数的，其他的数据后

## Google Analytics接入GitHub pages

首先需要关注自己的blog主题是否支持Google Analytics，因为官方提供的主题是支持的，一般主题都是根据官方主题的改版，所以一般都会在config文件内有Google Analytics id的设置项，比如chirpy主题，就在仓库根目录_config.yml文件中提供了入口：

![主题](/assets/image/2024/1/20240104173720.png)

从配置项看出来，只需要提供一个id即可，所以配置是非常简单的。接下来是配置过程：

1. 官网注册

    使用谷歌账户登录 https://marketingplatform.google.com/about/analytics/

    ![主题](/assets/image/2024/1/20240104180406.png)

    选择开始衡量，就开始填写一些基本信息，大概4步，这里按照自己需求填写即可，没有太多影响

    ![主题](/assets/image/2024/1/20240104180532.png)

    创建好之后，会获取到一个Google 代码 ID，正常是一系列字母和数字组合，通常以“G-”开头。，这个id就是我们config文件内需要的id

    如果没有来的及保存，也可以官网找到，详细参考官方参考信息：

    <a href="https://support.google.com/analytics/answer/9539598?hl=zh-Hans&ref_topic=14088998&sjid=14875448403416879290-AP" target="_blank">Google_Analytics_help</a>

2. 项目配置

    这里的项目配置非常简单，只需要在仓库根目录_config.yml文件中找到如图所示的配置，添加或者创建自己的id即可

    ![主题](/assets/image/2024/1/20240104173720.png)

    修改后直接push，打包完成后，一般24小时后会收到数据相关

3. 扩展信息

    很多blog平台或者github主题都会直接在blog中展示一些信息，比如访问量等，如果我们的主题并没有提供这种配置，我们也可以采取以下方案实现访问量等信息的展示



    1. 创建脚本，通过Google Analytics的API获取如blog总访问量，每篇文章的访问量信息等；

    2. 脚本自动修改仓库中blog总访问量，每篇文章的访问量信息的展示信息后，自动git push；
    
    3. 脚本部署成定时执行的脚本，比如每天早上6点执行一次自动修改；

    还有一点是GitHub提供相关的CI流程，可以撰写一个python脚本，完成上述功能，并在GitHub的actions中配置相关自动化信息即可完成。后续我应该会撰写相关帖子信息。



