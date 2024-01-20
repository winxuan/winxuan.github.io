---
title: GitHub Actions出错--Build Failure with Ruby 3.x问题解决
date: 2024-1-20 18:00:00 +0800
categories: [Blog, Build]
tags: [blog]
---

## 问题出现

笔者在编写blog并提交到GitHub后，对应的GitHub action开始被触发自动运行，但是在2023年12月25日之后，出现了必然build失败的问题

![截图](/assets/image/2024/1/20240120190517.png)

## 解决过程

最开始笔者以为是自己提交的md出现了问题导致了失败，于是将所有修改回退到了上一次build成功的内容，并且触发构建，但是build过程仍然出现了错误

于是笔者结合GitHub action的报错内容和自己在打包上长期的经验来看，判断是环境出现了问题，并且是和google-protobuf相关，于是笔者使用beyond compare对比了前一次成功和失败的日志，在报错日志前发现了区别

build错误的日志中，环境安装的Ruby版本是3.3.0
Ruby = 3.3.0

而build正确的版本，Ruby的版本是3.2.2
Ruby = 3.2.2

然后结合Google，笔者发现刚好在12月25日Ruby进行了升级，发布了3.3.0的最新版本

![截图](/assets/image/2024/1/20240120191516.png)


于是笔者果断更改了GitHub action的打包配置，将主题作者配置的ruby-version: 3指定了小版本号，也就是之前成功的ruby-version: 3.2.2

```
- name: Setup Ruby
uses: ruby/setup-ruby@v1
with:
    ruby-version: 3.2.2
    bundler-cache: true
```

保存后再次尝试了打包，果然打包成功，build失败的问题没有再次出现了，于是作者将这个问题以issue的形式提到了原本fork的作者仓库，并将问题解决办法放在了issue中 

[Build Failure with Ruby 3.x due to google-protobuf Gem Error in GitHub Actions](https://github.com/cotes2020/jekyll-theme-chirpy/issues/1429)

![截图](/assets/image/2024/1/20240120191958.png)

果然有很多人也出现了同样的错误，并且对笔者给出的解决办法点赞和感谢（笔者也是头一次这样被世界各地的人夸奖，那种内啡肽释放的快乐也持续了很久）

![截图](/assets/image/2024/1/20240120192234.png)