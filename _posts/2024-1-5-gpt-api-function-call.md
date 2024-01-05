---
title: GPT API 调用本地函数（function call）
date: 2024-1-5 12:00:00 +0800
categories: [AIGC, OpenAI]
tags: [chatgpt]
---

## 引言

GPT在23年的6月份发送了一份重要的更新通知：

<a href="https://openai.com/blog/function-calling-and-other-api-updates" target="_blank">Function calling and other API updates</a>

在这份通知中，GPT不仅仅发布了新模型与降低价格，更重要的是GPT增加了函数调用（Function calling）能力，这个能力根据官网介绍，模型会智能地选择输出一个JSON对象，其中包含调用这些函数的参数。这是一种更可靠地连接GPT的能力与外部工具和API的新方法。

![主题](/assets/image/2024/1/20240105144639.png)

简单来说，新版本的API模型已经具备了这种能力：模型在和用户交流过程中，会知道什么时候需要调用本地函数，在生成回复过程中，会在回复中带有一个json，这个json中带有这个函数名和参数，开发者只需要写一个监控，在发现这个json的时候按照gpt给出的函数名和参数执行并将返回值传递给gpt即可。

官方同时也给出了一些使用上的example

## 使用

