---
title: Azure管理用API设置与自动化脚本demo
date: 2024-6-1 12:00:00 +0800
categories: [AIGC, OpenAI]
tags: [azure]
---

# 前言

笔者在使用Azure OpenAI时，因为部署在项目组公共机器中，担心密钥泄露的风险，经常需要登录到Azure后台中进行密钥的更新和获取，同时也需要监控当前账单多少等等，都有需要自动化脚本进行配置。

但是因为Azure本身是面向企业服务，本身系统就设计的异常复杂，而且安全性也是会放在第一位的，并且加上很多新名词，之前非常简单的自动化脚本，反而成了整套Azure OpenAI搭建过程中较难的一部分。

这里笔者花了大概6个小时的时间，终于踩完所有的坑，下面给出从Azure配置到API调用成功的详细步骤。

# 详细配置过程

首先需要有一个概念，Azure不同于一般网站，常用的爬虫手段不太能用，所以步骤和一般网站不同，最好先完全跟着笔者的步骤去配置，等通了再想为什么：

0. 前提条件
   
   笔者这里默认读者已经配置好Azure OpenAI，也就是达到可以在套壳ChatGPT中调用Azure OpenAI接口的程度了，如果没有配置好，请先看笔者这一系列的文章再来。

1. 使用Microsoft Entra ID 创建应用（创建服务主体）

    可以参考Azure的文档[向 Microsoft Entra ID 注册应用程序并创建服务主体](https://learn.microsoft.com/zh-cn/entra/identity-platform/howto-create-service-principal-portal#register-an-application-with-microsoft-entra-id-and-create-a-service-principal)
   
    1. 进入Microsoft Entra ID服务中-->进入左侧应用注册中-->点新注册
   
        ![截图](/assets/image/2024/6/20240604014924.png)

        ![截图](/assets/image/2024/6/20240604015045.png)

        ![截图](/assets/image/2024/6/20240604015357.png)

    2. 输入应用名-->选择“仅此组织目录(仅 默认目录 - 单一租户)中的帐户”-->点注册
      
        ![截图](/assets/image/2024/6/20240604015605.png)
    
    3. 注册成功会自动跳转到如下图中，需要保存一下如图两个值：
      
        1. 应用程序(客户端) ID：对应后面接口中client_id
        
        2. 目录(租户) ID：对应接口url中的tenant
   
        ![截图](/assets/image/2024/6/20240604020138.png)

    4. 点管理-->API权限-->添加权限-->选择Azure Service Management-->勾选权限-->点添加权限

        ![截图](/assets/image/2024/6/20240604021056.png)
    
    5. 点证书和密码-->客户端密码-->+新客户端密码-->填写说明（随便）-->选截至期限-->点添加

        ![截图](/assets/image/2024/6/20240604021424.png)

        注意保存下这里的值，只会出现一次，也会作为后面接口的client_secret值

   以上，服务主体配置完成

2. 关联应用与订阅

    可以参考Azure的文档 [向应用程序分配角色](https://learn.microsoft.com/zh-cn/entra/identity-platform/howto-create-service-principal-portal#assign-a-role-to-the-application)
   
    1. 进入Azure主页-->进入订阅-->进入自己创建的给OpenAI用的订阅中

        ![截图](/assets/image/2024/6/20240604021747.png)

        ![截图](/assets/image/2024/6/20240604022042.png)

    2. 点访问控制-->添加-->添加角色分配

        ![截图](/assets/image/2024/6/20240604022253.png)

    3. 跳转到角色分配页面-->角色-->特权管理员角色-->点所有者
   
        ![截图](/assets/image/2024/6/20240604022740.png)

    4. 点成员-->+选择成员-->手动输入1中创建的应用名-->点选该应用名-->选择

        ![截图](/assets/image/2024/6/20240604023038.png)

        这里有个坑点就是这里选择成员是不会默认弹出应用的，需要输入应用名才能选，对新手非常坑的一个位置。

    5. 点条件-->允许用户分配所有角色 (高特权) -->点左下角审阅和分配

        ![截图](/assets/image/2024/6/20240604023356.png)
    
    以上，关联应用与订阅完成

3. 获取token

    笔者这里以postman举例：

    1. 方法选择post，url输入：

        ```
        https://login.microsoftonline.com/{tenant}/oauth2/v2.0/token

        ```

        {tenant}为1中创建应用时记录的tenant

        ![截图](/assets/image/2024/6/20240604024010.png)
    
    2. Headers中配置
        
        ```
        key：Content-Type
        value：application/x-www-form-urlencoded
        
        ```

        ![截图](/assets/image/2024/6/20240604024041.png)

    3. Body配置

        ```
        client_id：应用中配置的
        scope：根据接口配置的不同的值，更新密钥就配置https://management.azure.com/.default
        grant_type：直接填client_credentials
        client_secret：1中只会出现一次的值
        ```

        ![截图](/assets/image/2024/6/20240604024304.png)
    
    配置好之后，send就会收到对应的token值

    ![截图](/assets/image/2024/6/20240604024740.png)

4. 初尝接口

    获取到token之后，我们可以用更新密钥这一接口来验证下是否ok

    1. 首先浏览器抓包得到对应更新密钥的API是

        ```
        https://management.azure.com//subscriptions/{订阅ID}/resourceGroups/{资源组名}/providers/Microsoft.CognitiveServices/accounts/{资源名}/regenerateKey?api-version=2022-03-01
        ```

        如下图所示

        ![截图](/assets/image/2024/6/20240604025528.png)

    2. 使用postman更新密钥

        1. 方法选择post，url填1中拼出来的API，如下图

            ![截图](/assets/image/2024/6/20240604025826.png)
   
        2. authorization中选择bearer token，填入上面获取的token，如下图

            ![截图](/assets/image/2024/6/20240604030024.png)
        
        3. body中选择raw，这次只更新第一个密钥Key1，所以如下填写即可：
   
            ```
            {"keyName": "Key1"}
            ```
            
            ![截图](/assets/image/2024/6/20240604030306.png)
            
        4. seed接口会返回更新之后的密钥

            ![截图](/assets/image/2024/6/20240604030522.png)

# 后记

以上即为如何配置使用Azure API的详细流程，因为Azure面向企业，所以认证和配置过程复杂度都超过一般应用，走通之后，后续可以据此写很多自动化的脚本，十分方便管理Azure。