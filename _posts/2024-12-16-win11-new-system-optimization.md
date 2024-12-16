---
title: Windows 11 新装系统优化合集
date: 2024-12-16 00:00:00 +0800
categories: [Tips, System]
tags: [tips]
---

## 前言

笔者安装Windows 11之后，发现很多与win10相去甚远的配置，而且相对于win10的傻瓜式使用，win11默认开启了一些普通用户完全没有必要使用的功能，同时一些功能也变得不通人性（感谢阿三），恰好笔者最近连续新装了n个电脑，所以将Windows 11新装系统之后的配置一一列出，方便自己和大家参考

## 操作步骤（顺序进行）

### 1. 浏览器安装

建议直接使用自带的edge浏览器即可。因为目前edge浏览器已经使用chrome内核，所以几乎继承了所有chrome的特点，比如可以使用chrome的插件，占用内存和chrome一样大。
不过edge也有自己的优点：
1. 纵向标签页
   
   这是edge自带的能力。笔者认为这是非常好的设计，本身现在屏幕宽高比越来越大，纵向空间利用率非常低，反而都在挤占横向空间，甚至很多人把屏幕竖起来以获得更“长”的空间。纵向标签页完美解决了这个问题：

   ![截图](/assets/image/2024/12/2024-12-16_010356_504.png)

2. 账号
   
   chrome绑定谷歌账户，导致很多人不能翻墙或者不能注册到谷歌账户而无法享受到云资料的管理。
   
   因为浏览器登录账号之后，很多内容都会同步到云端，比如插件，收藏，密码，历史记录等，有了账户之后非常方便进行多端使用。

   而edge默认使用微软账户，更加适合中国宝宝。（谁知道哪天自己梯子就寄了呢？

### 2. 显卡驱动

A卡装：[AMD software](https://www.amd.com/zh-cn/support/download/drivers.html)

N卡装：[GeForce® 驱动程序](https://www.nvidia.cn/geforce/drivers/)

### 3. everything

[everything官方下载地址](https://www.voidtools.com/zh-cn/)

查找文件神器，精确查找电脑中所有文件，且不占用系统资源

### 4. 运行库合集

推荐安装这个老外打包的即可

[VisualCppRedist AIO](https://github.com/abbodi1406/vcredist/releases)

或者也可以安装国内比较优秀的合集，如3DM或者果壳维护的都行。

之所以安装这个，是因为很多游戏的引擎，是从vs编译出来的，新vs或多或少缺那么一点点运行库，但就是缺这么一点的运行库，导致一些老系统无法运行游戏

比如你安装了最老版本的win10，并且关闭了系统更新，而此时游戏厂商升级了游戏引擎，但是忽视了游戏对于Windows系统兼容性的测试，这时的你会概率出现如下图所示的报错

![截图](/assets/image/2024/12/2024-12-16_012316_976.png)

或者说你安装了最新的win11，而你的游戏并没有升级引擎，也概率会出现类似报错，最好的方式就是安装运行库。

### 5. 一些系统设置

#### 1. 电源：卓越性能

卓越性能就是指微软为了更好的让配置和系统结合达到高性能状态，推出的“卓越性能模式”，如果你喜欢玩游戏，那么这个模式可以帮助到将CPU一直保持鸡血状态。但是卓越性能会增加供电负担和更多的散热,不过这一项对于非企业版和工作站系统默认是隐藏的，需要手动才能开启。

首先建议首先先检查下自己的电源计划中是否有该默认，企业版工作站版会自带，有则启动就好，不考虑续航和散热等，大多数台式机都建议启动。

假如你的系统没有该默认，则需要打开管理员模式的命令行，输入：

```powershell
powercfg -duplicatescheme e9a42b02-d5df-448d-aa00-03f14749eb61
```

这时再打开电源计划就会出现该选项

#### 2. 关闭基于虚拟化的安全性

关闭这个，主要目的并不是禁用虚拟化，而是为了关闭内存完整性检查，这个会占用比较多的系统资源

管理员模式的命令行，输入：

```powershell
bcdedit /set hypervisorlaunchtype off
```

关闭之后，唯一的影响就是所谓的安全性降低和游戏帧数的提升，并不会造成无法使用虚拟机的问题。

更改完成后重启电脑，并在【系统信息】中，会看到对应功能未启用，则成功关闭：

![截图](/assets/image/2024/12/2024-12-16_014456_454.png)

### 6. 杀毒软件

微软自带的defender防护能力已经足够，如果自己本身不爱折腾，而且有良好的上网习惯，大可不必安装额外的安全软件。

笔者自己是不喜欢微软过强的防护能力，且已经使用了火绒多年，所以杀毒软件会额外安装火绒。

建议偷懒的小伙伴，360或者火绒或者其他杀毒软件选择一个即可，但是千万不要裸奔。

### 7. 其他软件

1. 压缩软件：winRAR 64位，现在64位也免费，免费版本唯一的区别就是有广告，配合去广告软件还是挺香的；
2. 看图软件：2345看图王，虽然2345是个流氓，但是这个看图王确实是神器，建议网上找找独立版本安装；
3. 视频软件：PotPlayer，很强大的视频播放软件，唯一的问题是更新频繁并且使用比较复杂；
4. 音乐软件：网易云音乐（猪厂老板情怀产品
5. 通讯软件：QQ，微信；
6. 文件夹软件：Q-dir，如果你喜欢很多文件夹同时打开和显示，安装就行
7. 编程相关：vscode，Notepad++（政治不正确），python环境，studio 3T
8. 游戏：steam，epic
9. 虚拟机：VMware，一个已经全免费的软件，准备一个虚拟机不时之需还是蛮重要的，当然如果sandbox已经满足使用了，就没必要了；
10. MobaXterm：pro版本很好用，网上很多；
11. TuneBlade：HomePod mini连接Windows系统的软件，没有可以不用
12. 微星小飞机：显示游戏内硬件运行状态信息的神器，[安装教程](https://winxuan.github.io/posts/msi-afterburner-download-install/)
13. cFosSpeed：一个让你迅雷全速下载的时候，畅玩网游的神器
14. Logitech hub：有罗技鼠标的必备

以上就是笔者在安装一个新版本Windows系统时操作和安装顺序，只是参考和建议。重装系统耗费精力，建议大家尽量保持自己系统的干净整洁，一个保持很好的系统，用个3~5年依然非常流畅。