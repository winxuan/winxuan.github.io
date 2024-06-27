---
title: 游戏自动化测试框架设计
date: 2024-2-19 12:00:00 +0800
categories: [SDET, AutoTest]
tags: [autotest]
---

# 前言

笔者作为游戏项目组QA，平时负责组内的打包工作，经常出现打包过程正确，实际无法登录进入游戏的情况，而且这种问题最让人烦恼的是，一旦出现则立即是高优任务，因为会阻挡正常组内的开发和测试工作，所以必须要立即解决，而且这种游戏内的问题有一个坑点就是发现问题的时间点肯定滞后于出问题的时间点，需要逐步排查SVN提交记录，找出可能出现问题的提交，而且这种工作的能力要求又很高，很难找人替代，就导致不能去做其他产出比更高的任务一直在这个上面不断的浪费精力。

笔者曾经在网易的时候设计过一套自动化框架，可以整合组内的测试任务，使用Jenkins来排布控制任务队列进行，面向过程的控制结构，表驱动来控制每次执行的任务，同时算是吃透了win32的接口，做了很多周边辅助测试的工具，比如截图工具，可以在锁屏和游戏处于后台时根据进程ID截屏等，同时设计上也有一些缺陷，比如虽然设计了一整套执行控制任务逻辑，但是插入新任务模块做的很烂，一个新的任务其他人想插入进来是比较复杂的，还需要修改主框架部分。同时任务执行状态控制的不好，理想状态是任务需要有很多checkpoint，通过检查checkpoint记录自动化执行状态，但是框架内并没有记录，并且通用的状态卡死没办法记录。

笔者希望全新设计的自动化框架，能改善以前出现的问题。

# 目标

实现一个多平台的游戏自动化框架，为了改善之前出现的问题，整体采用如下思路设计开发：

## 整体思路设计

### 混合编程思路

1. 主程序入口点保持相对过程化的结构，通过调用框架的方法来控制整个测试流程；
2. 主框架的核心结构采用面向对象设计，相对于之前面向过程的控制结构，有利于管理和维护代码结构；
3. 测试方法内部，采用更加过程化的编程风格来组织具体的执行步骤；

采用这种混合方法在保持代码结构清晰的同时，也能够使用最适合每个特定任务的编程范式。既可以利用面向对象的优势来管理复杂性和提高可维护性，又保留面向过程编程直观和线性的适合自动化测试的特点。

### 整体结构划分

整体设计分为三个部分，核心框架，基础模块和插件。核心框架部分负责接收配置和跑测调动以及实现插件系统；基础模块部分负责通用的基础能力模块，如数据库模块，日志模块等；插件部分负责工具类插件和测试类插件；

核心框架部分负责多种核心基础能力，主要有配置能力，表驱动能力，插件能力；
1. 配置能力：接收测试参数定制，作为框架入口，会影响整个测试框架运行行为；
2. 表驱动能力：根据配置选择跑测插件，控制测试内容的核心；
3. 插件接口能力：实现插件系统的基础；

基础模块
1. 数据库模块：数据库操作基础模块
2. 日志模块

插件：
1. 工具类插件：工具相关，如截图工具插件；
2. 测试类插件：各个测试模块，如


## 1. 测试框架部分

功能上
1. Jenkins控制任务执行：

    整体还是采用Jenkins来启动测试。Jenkins已经做到了队列（排队功能），参数化执行任务，条件触发和定时执行任务，基本上满足了自动化测试触发和参数定制的需求，这部分框架可以不用实现。

2. 日志系统

    框架提供基础核心能力之一，其他几乎所有的干

3. 表驱动部分

整体思想上：

4. 测试框架部分从原来面向过程转向面向对象，这样有利于管理工具部分和测试功能部分，以及长期维护代码结构；

5. 由于自动化测试本身是一种偏向过程的思想，所在框架方法内部仍使用过程化的编程风格来组织具体的框架执行步骤；

6. 主程序入口点可以保持相对过程化的结构，通过调用框架的方法来控制整个测试流程；

采用混合方法主要是在保持代码结构清晰的同时，也能够使用最适合每个特定任务的编程范式。既能利用面向对象的优势来管理复杂性和提高可维护性，又保留面向过程编程直观和线性的特点。

## 2. 工具部分

1. 工具部分由原来模块化转

## 3. 测试功能部分
