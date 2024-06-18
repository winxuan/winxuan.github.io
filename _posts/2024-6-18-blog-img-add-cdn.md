---
title: GitHub Pages添加图片CDN（加速国内访问）
date: 2024-6-18 18:00:00 +0800
categories: [Blog, Build]
tags: [blog]
---

国内部署到GitHub pages经常会出现访问慢的问题，文字部分还好，主要是图片这类资源，经常性加载失败导致用户无法浏览blog

笔者这里配置了图片相关CDN，能部分缓解访问慢的问题。

笔者这里以现在使用的blog模板举例，该模板支持全局的图片CDN配置：

1. 找一个可用的前端资源CDN地址

    推荐用这两个：
    ```
    fastly.jsdelivr.net
    testingcf.jsdelivr.net
    ```

2. 配置blog的CDN

    如笔者这里在blog根目录配置如下：

    ```
    img_cdn: https://testingcf.jsdelivr.net/gh/winxuan/winxuan.github.io
    ``` 
    使用的cdn是testingcf.jsdelivr.net

3. 配置完成提交后检查

    等GitHub pages打包完成，随便找一张自己blog的图片，检查对应的图片链接是否有CDN

    如笔者这里的图片链接如下：

    修改前：
    ```
    https://winxuan.github.io/assets/image/dutch.png
    ```
    修改后
    ```
    https://testingcf.jsdelivr.net/gh/winxuan/winxuan.github.io/assets/image/dutch.png
    ```

    同时可以多找几个同学朋友帮你检查下，看国内网是否可以访问，最简单的办法就是用自己手机关闭无线网使用5G访问自己的blog看下加载速度是否比以前快很多。