---
title: wsl安装docker(规避Docker desktop收费)
date: 2025-2-21 00:00:00 +0800
categories: [Tips, System]
tags: [tips]
---

## 前言

笔者在公司给配的Windows电脑中安装了docker desktop，几天后收到了公司IT的邮件告知，该软件需要收费。

笔者很疑惑，后面查了下Docker desktop确实收费，而且收费政策仅限于企业内Windows端，也就是普通用户都是不收费的，并且Linux端和mac端也是不收费的

笔者去查阅了下，有以下几种办法可以解决：

1. 缴费使用Docker desktop，每年收费	2083元/个/年；暂时pass
2. 换用mac，笔者有mac，但是mac现在基本上都是arm处理器，很多比较新的开源工具，暂时都不提供arm镜像，所以也pass
3. 换用Linux。笔者只有Windows和mac，没有纯Linux的电脑。但是Windows有子系统Linux，可以考虑。

最终笔者还是决定尝试下Windows的子系统安装docker

## 安装步骤

1. 安装wsl
一般直接去微软商店安装，参考微软这篇官方文档即可
[如何使用 WSL 在 Windows 上安装 Linux](https://learn.microsoft.com/zh-cn/windows/wsl/install)

2. 安装docker

首先更新下系统
```
sudo apt-get update
sudo apt-get upgrade
```

然后安装依赖
```
sudo apt-get install \
    ca-certificates \
    curl \
    gnupg \
    lsb-release
```

再添加 Docker 的官方 GPG 密钥：
```
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
```

设置仓库
```
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

安装Docker Engine：
```
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-compose-plugin
```

安装成功后，记得测试下能不能使用

启动 Docker：
```
sudo service docker start
```

验证 Docker 安装：
```
sudo docker run hello-world
```

为了避免每次都用 sudo 运行 Docker，可以将你的用户添加到 docker 组(第二个命令会退出wsl，重新打开就生效了)：
```
sudo usermod -aG docker $USER
newgrp docker
```

## 性能问题

笔者发现wsl确实可以很完美的运行docker，但是还是担心有性能问题，笔者搜索并多次使用后，发现wsl并不会存在性能问题：

1. 是否会占用cpu过高
并不会，wsl本身优化的非常好，占用极低的Windows系统资源就可以运行一个相对完整的Linux系统

2. 是否会占用ram过高
也不会，本身wsl仅占用百十兆内存，整整吃内存的是docker中那些镜像，和这些相比，wsl本身占用的内存根本不值一提

3. 运行docker时性能是否受限？
并没有，笔者尝试过，甚至wsl中性能更好，占用cpu和内存反而更低。本身docker也是从Linux中来，支持Windows更像是兼容。
