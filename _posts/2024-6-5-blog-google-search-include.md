---
title: Google搜索收录个人blog（Blog可以被Google搜索到）
date: 2024-6-5 00:00:00 +0800
categories: [Blog, Build]
tags: [blog]
---

# 前言

笔者在部署完成GitHub blog之后，发现浏览量非常稀少，相对于CSDN一天一篇文章就大几百的浏览量，自建的博客写了很久每天浏览量也不过几十，于是笔者搜索了下原因发现笔者的blog并没有被收录到Google搜索中，也就是说笔者写的所有文章，别入想阅读到完全靠笔者自己分享。。。好在自建blog可以主动去Google那里配置被搜索到。

# 配置过程

1. 确认自己的blog确实未被Google搜索收录

浏览器输入如下网址：

```
site:https://your_github_id.github.io/
```

比如笔者这里就是site:https://winxuan.github.io/

如果没有被Google搜索收录，那会出现如下图所示，跟着笔者往下一步一步配置吧

![截图](/assets/image/2024/6/20240605004207.png)

如果被收录了，那就会出现如下图所示，忽略本文章的后续步骤吧

2. 进入上图所提示的Google Search Console

选择右侧的网址前缀，并输入自己的blog地址点继续

```
https://your_github_id.github.io/
```

![截图](/assets/image/2024/6/20240605004637.png)

3. 下载并将对应的html文件上传到自己blog中

上一步继续后会弹出如下窗口

![截图](/assets/image/2024/6/20240605005125.png)

这里建议选择下载文件上传的方式更简单些

下载文件后将文件放在自建blog的根目录中并上传，上传后点验证，正常一般都会验证通过

![截图](/assets/image/2024/6/20240605005315.png)

4. 添加站点地图

上一步成功之后，点弹窗右下角前往资源页面，在跳转的网页中右侧会有网络地图的tag

![截图](/assets/image/2024/6/20240605005537.png)

网络地图的作用是给Google知道你网站的结构，方便它的爬虫来爬你的内容的，所以非常有必要设置

生成网络地图的方法也比较简单，到[https://www.xml-sitemaps.com/](https://www.xml-sitemaps.com/)这个网站，输入自己网站地址

```
https://your_github_id.github.io/
```

点start

![截图](/assets/image/2024/6/20240605005926.png)

等待一会，弹窗提示成功，点VIEW SITEMAP DETAILS，在跳转的网页点DOWNLOAD YOUR XML SITEMAP FILE，下载到sitemap.xml文件

![截图](/assets/image/2024/6/20240605010033.png)

![截图](/assets/image/2024/6/20240605010155.png)

将该sitemap.xml文件上传到自己网站的根目录

回到刚刚Google的网络地图，输入sitemap.xml并提交即可

![截图](/assets/image/2024/6/20240605010644.png)

![截图](/assets/image/2024/6/20240605010715.png)

等待1天后再回来看看数据是否发生变化，也可以在Google搜索引擎中搜索自己的blog查看


# 后记

以上即是如何将自己的blog收录到Google搜索引擎中，除此之外，读者可以根据搜索引擎排行榜，添加bing等引擎

