---
title: Google搜索收录Github Pages 自动化(Blog可以被Google搜索到)
date: 2024-6-23 00:00:00 +0800
categories: [Blog, Build]
tags: [blog]
---

笔者之前有文章提到过如何将自己使用Github Pages创建的blog加入到Google搜索结果，相信试用过之后都会发现一个最基本的问题，那就是如果写了新文章之后，还需要手动导出一次网站地图然后提交，并且还要等很久才能加入到谷歌搜索结果中。

## 网站地图vs直接添加索引

笔者在实际使用过程中发现，实际上如果提交网站地图，速度会比直接在Google搜索中添加索引慢非常多，如下图所示：

![截图](/assets/image/2024/6/20240623011410.png)

笔者在很久之前就将网站地图提交，同时也在索引中手动添加了几个网站，直接添加索引到Google，大概3天左右Google搜索中就出现了数据，而添加网站地图之后，笔者等了2周还是没有结果，所以相对于添加网站地图来说，最好的方式莫过于直接添加索引快很多。

## 自动化添加索引

Google search有对应的API，该API可以实现向Google search中添加索引。

[Google Search Console API](https://developers.google.com/webmaster-tools/v1/api_reference_index?hl=zh-cn)

![截图](/assets/image/2024/6/20240623012100.png)