---
title: Win10系统如何设置自动登录
date: 2024-2-5 18:00:00 +0800
categories: [Tips, System]
tags: [tips]
---

## 前言

笔者写这篇文章主要是为了反思为什么不习惯看“说明书”的问题，如果各位是为了解决问题，可以直接参考这篇官方教程即可药到病除[在 Windows 中启用自动登录功能](https://learn.microsoft.com/zh-cn/troubleshoot/windows-server/user-profiles-and-logon/turn-on-automatic-logon)


## 问题

笔者在得到一块魔改的4960HQ CPU之后，购买了配套的主板和内存以及一个2.5G网卡，组装了一个旁路由，具体装配方案后面笔者再另开一篇文章说明，这里说的是笔者在搭建时系统选择了很多人都抛弃的Windows 10，因为笔者日常工作中打包机等大都使用了Windows，所以在使用了Windows和Linux之后，还是选择了使用Windows 10作为旁路由的系统，但是饱受开机后需要远程登录一次，相应的自启动软件才能运行的问题

## 尝试

笔者在网上找到了关于设置自动登录的一些教程，大都是设置账户密码为空的设置，比如去掉“要使用本计算机，用户必须输入用户名和密码”复选框这种，win10后来都隐藏了对应的选项

![截图](/assets/image/2024/2/20240205212238.png)

这种办法是盛传已久的解决办法，笔者之前也成功依靠这种办法解决过，但是微软隐藏了这个设置的选项，如果非要使用这种方法，具体的开启方法是注册表的

HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\PasswordLess\Device

的DevicePasswordLessBuildVersion的值

改成0

然后笔者在Google搜索时，发现了一个排名很后的文章，也就是微软自己出的文章：[在 Windows 中启用自动登录功能](https://learn.microsoft.com/zh-cn/troubleshoot/windows-server/user-profiles-and-logon/turn-on-automatic-logon)

笔者按照微软给出的方法，顺利解决了自动登录的问题。

## 最后

其实重点不是解决，之所以写这篇文章，原因是在使用了很长时间的微软系统，使用搜索引擎解决系统出现的问题，都是依赖百度经验或者CSDN之类，最近一段时间发现其实微软是提供了非常详细且优秀的使用说明文档的，比如在使用微软Azure时就发现很多人写的demo根本无法运行，但是微软的文档几乎是在遍历我们环境一样给出了demo。

我们平时碰到和微软相关的问题，其实都可以在微软提供的文档中找到解决办法，而不是看鱼龙混杂的百度经验或者CSDN。

引申一点，其实很多说明书才是真正的宝贝，比如接口文档，比如药品说明书，比如书的引言，有点感觉追悔莫及，本来可以更顺畅的解决问题的，结果浪费了多少时间和精力。