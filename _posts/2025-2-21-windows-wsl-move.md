---
title: wsl整体迁移
date: 2025-2-21 00:00:00 +0800
categories: [Tips, System]
tags: [tips]
---

## 前言
wsl 是Windows子系统，相当于在Windows系统中就可以使用到原生的Linux系统，非常好用。但是这个wsl没有类似软件安装包提供（可以选择安装路径），只能命令行或者微软商店安装。

屎一样的微软商店，安装时不支持选择路径，如果重度使用，类似笔者在wsl中启用docker，ollama等，会导致c盘直接变红，如果一个软件一个软件设置到c盘，不仅麻烦，而且容易报错，不如直接将wsl整体放在另一个盘里面，也就是我们需要将安装好的wsl整体迁移到其他盘

## 迁移方法

迁移主要是先将wsl备份打包，然后使用命令放在指定位置上，这里笔者以自己安装的Ubuntu22.04迁移到F盘为例

1. 停用wsl

```
wsl --shutdown
```

2. 备份指定的wsl

```
wsl --export Ubuntu-22.04 F:\ubuntu2204.tar
```

3. 导入系统到F盘

这里笔者迁移到了F盘，需要提前新建路径F:\WSL\ubuntu2204


```
wsl --import Ubuntu-22.04-F F:\WSL\ubuntu2204 F:\ubuntu2204.tar
```

4. （可选）删除原来的子系统
可删可不删除，实际上说是删除，实际上更像是格式化，unregister之再从软件列表里面打开，会像全新安装的wsl

```
wsl --unregister Ubuntu-22.04
```

这时再使用list命令即可看到新的wsl

```
wsl --list
```

## 后记

笔者尝试了安装各种docker和ollama等，c盘并没有增大，存储位置确实全部在F盘了。但是有一个问题，好像默认启动的用户是root，这个没有太多的影响。