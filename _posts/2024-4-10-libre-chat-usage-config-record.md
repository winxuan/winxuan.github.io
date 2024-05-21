---
title: LibreChat+Azure使用配置部署
date: 2024-4-10 22:00:00 +0800
categories: [AIGC, OpenAI]
tags: [chatgpt]
---

# 前言

笔者是十分看好LibreChat项目的，其项目思想和现在比较火热的ChatGPT-Next-Web和LobeChat有很大不同，其一开始就有鉴权和后端数据库，这决定了LibreChat的交互体验，尤其是跨设备体验是非常舒适的，这也是笔者在自己家里和公司都选择LibreChat的原因。笔者写这篇文章主要是为了记录部署过程，后续调整时使用。

# 部署过程

LibreChat的项目文档十分细节，细节到教会你如何更新Docker配置。如下图所示：

![截图](/assets/image/2024/4/20240410231820.png)

项目文档十分细节是非常难得的，这直接会让用户的部署和维护变得不是那么困难。并且项目支持多种部署方式，这里介绍下两种部署方式，使用Docker部署和使用Windows部署，使用Linux和Mac也大同小异。

## 使用Docker部署

Docker的部署十分简便，如果各位部署环境中有长期运行的Docker服务，十分建议选择此种部署方案，性能方面Docker几乎没有损失，主要是内存占用比较大，除此之外没有其他缺点。

1. clone对应项目

如果是长期使用，这里笔者建议下载release版本较为稳定。如下所示链接下载：

```

```

## 直接部署在Windows