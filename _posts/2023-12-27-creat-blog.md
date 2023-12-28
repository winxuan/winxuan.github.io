---
title: github pages + jekyll快速搭建blog
date: 2023-12-27 12:00:00 +0800
categories: [Blog, Build]
tags: [blog]
---

## 简介

在数字时代，拥有一个个人博客不仅是展示你技能和创意的绝佳平台，也是与世界分享你独特视角的方式。而GitHub Pages配合Jekyll，提供了一个简单、高效且免费的途径来创建和托管你的个人博客。（抄的）

本文将指导你如何使用GitHub Pages和Jekyll，以及如何借助社区分享的主题来快速搭建一个既美观又实用的个人博客。无论你是编程新手还是资深开发者，遵循这些步骤，你将能轻松建立起自己的在线空间。（也是抄的）

## GitHub Pages & Jekyll 简介

GitHub Pages是一种静态网站托管服务，它允许用户直接从GitHub上的仓库（repository）中托管网站内容。它特别适用于托管项目文档、个人博客、甚至是小型网站。实际上就是我们在GitHub中创建的仓库，但是该仓库比较特殊，经过一些自动化的特殊处理，就可以呈现给我们网站的表现。

Jekyll是一个简单、可扩展的静态站点生成器。它将文本格式的内容（如Markdown或HTML）转换为静态网站和博客。Jekyll广泛用于个人、项目和组织网站，尤其与GitHub Pages的集成使其成为创建和托管博客的热门选择。

整体来说，就是Jekyll生成对应的静态网站，GitHub提供环境支持，最后能得到一个看起来像blog的git仓库。

之所以为什么会选择GitHub Pages作为静态网站托管服务，有以下几个好处：

1. 免费与活跃社区支持：

    GitHub Pages是完全免费的解决方案，而且本身也有很多免费优秀的主题，用户通过fork对应主题的仓库，再通过一些简单的配置文件修改，即可生成一个自己的网站。比如我通过fork cotes2020/jekyll-theme-chirpy主题仓库，修改一些配置之后，得到了一个自己的网站：[https://winxuan.github.io/](https://winxuan.github.io/)。同时如果出现任何问题，都可以通过fork from的仓库发issue去询问解决，同时如果自己有代码能力也可以自己去解决并通过issue帮助同样有问题的人解决问题，在一个非常流行的主题仓库是有很多活跃的用户的，他们非常乐意去分享自己的内容。

2. 集成与自动部署：

    首次配置好GitHub Pages与Jekyll之后，后面自己再继续写的文章等，都不需要再进行配置，只需要将文章的md文件等git push之后，GitHub action就会自动生成对应的文章html等，也就是GitHub Pages自带有免费的CI/CD流程支持，免去自己需要在本地处理文章从md格式转换成网页的过程，极大降低了使用门槛。

3. 定制与源码管理：

    Jekyll有提供多种主题供用户选择，而且用户选择好主题之后，可以fork对应仓库，这样整个网站的源码就在自己的个人仓库中，用户可以通过修改源码，深度定制属于自己的博客。并且GitHub由于处于国外，不需要进行帖子审核等即可上传到自己的个人博客上。

## 搭建GitHub Pages博客的准备工作

准备一个GitHub账号，这里不在赘述如何申请，这个也是一个使用门槛，没有GitHub不懂得git使用等，基本上无法在GitHub中搭建属于自己的博客和网站。建议在搭建之前，至少掌握git的核心思想和基本操作，手里有一个自己的GitHub账号再继续。

## 找到Jekyll主题

推荐直接去GitHub中寻找适合自己的主题。[github.com/topics/jekyll-theme](https://github.com/topics/jekyll-theme)
上述是GitHub自己给出的当前主题排名，一般建议挑选排名靠前的主题，如果自己有需要某些特殊的功能，比如显示数学公式等，也可以在各自的主题介绍中寻找。
![主题](/assets/image/20231228005305.png)
一般每个主题都会有自己的demo网站，一般格式都是 xxx.github.io，也有自己有域名改换成自己私有的域名的，demo内容上都大差不差，都会介绍自己主题的表现以及详细的部署和使用文档。
比如等下我们要着重介绍部署和使用方法的主题的demo网站 https://chirpy.cotes.page/
![主题](/assets/image/20231228005731.png)

## 获取主题与GitHub相关配置

根据demo中文档介绍，主题作者提供了两种创建方案供我们选择，一种是通过fork作者的开发仓库，一种是generate作者的另一个仓库，两种操作各有优缺点，这里会同时介绍两种操作。如果专注于内容，建议使用作者推荐的方案，隔离无关的项目文件，忍受一些小问题，专注于内容创作；如果是自己有能力解决问题，并且有时间有能力自己动手解决问题，则建议fork仓库的形式，为社区做贡献；

### Using the Chirpy Starter（推荐）

操作步骤如下：

1. 创建git仓库

    仓库URL: https://github.com/cotes2020/chirpy-starter，进入仓库后点右上角 <kbd>Use this template</kbd> > <kbd>Create a new repository</kbd> 如下图所示：
    ![主题](/assets/image/20231228112752.png)

    跳转进入创建页面，修改下仓库名称为 `USERNAME.github.io`，比如我的GitHub用户名是winxuan，那么我的仓库名就是winxuan.github.io（这里因为我已经创建过一个同名仓库了，所以有红字提示）
    ![主题](/assets/image/20231228113351.png)

2. 配置github仓库

    进入自己创建好的仓库，点 <kbd>Settings</kbd> <kbd>Pages</kbd> <kbd>Settings</kbd> 后，点 <kbd>Build and deployment</kbd> 下面的 <kbd>Source</kbd> 中的选项 Github Actions，如下图所示。
    ![主题](/assets/image/20231228114948.png)

这里会自动创建部署脚本，配置好之后，自己的GitHub Pages已经开始打包了，可以在仓库中 `Actions` 看到对应部署过程。
![主题](/assets/image/20231228115450.png)

3. 修改项目配置

    _config.yml中的变量，url，avatar，timezone，lang，主要是这四个配置

    正常都会在1分钟内部署完成，这时候访问`USERNAME.github.io`，即刚刚创建的仓库名，比如我的是winxuan.github.io，即可看到对应的网页。如果能正常看到类似demo的网页，那说明部署成功了。

### GitHub Fork（开发者专用）

操作步骤如下（选择这一方法说明已经很了解相关过程，这里简写下）

1. 创建git仓库

    fork该仓库https://github.com/cotes2020/jekyll-theme-chirpy，同时修改仓库名为 `USERNAME.github.io`，比如我的GitHub用户名是winxuan，那么我的仓库名就是winxuan.github.io

2. 配置github仓库

    进入自己创建好的仓库，点 <kbd>Settings</kbd> <kbd>Pages</kbd> <kbd>Settings</kbd> 后，点 <kbd>Build and deployment</kbd> 下面的 <kbd>Source</kbd> 中的选项 Github Actions，如下图所示。
    ![主题](/assets/image/20231228114948.png)

    注意这里需要抄作业：
    删除代码仓库中的.github文件夹，将我的仓库中对应的文件夹上传上去
    https://github.com/winxuan/winxuan.github.io/tree/master/.github/workflows
    因为作者的CI流程有些复杂，可能不可用，这里其实用最简单的流程即可，不需要太复杂。

3. 修改项目配置

    _config.yml中的变量，url，avatar，timezone，lang，主要是这四个配置

## 本地部署环境和调试

首先调试环境非必须，因为后续大部分使用md文件来创建文章，一般的编辑器都带有实时预览功能，所见即所得，一般写完之后直接上传md和相关资源文件即可。如果上面使用Using the Chirpy Starter方式创建，也完全可以不用该调试环境，专注于内容创作即可。如果是fork方式，建议一定要配置好自己的本地环境，非常方便开发调试。

不同的操作系统可能会不太一样，这里以Windows举例，配置本地调试环境：

1. 安装RUBY

    https://rubyinstaller.org/downloads/
    记得下载带devkit的版本

    安装过程中，如果有类似MSYS2 and MINGW development tool chain的选项，记得勾选

    安装成功后，使用命令行验证安装结果：
    ```
    ruby -v
    gem -v
    ```
    未出现报错即安装成功

2. 安装Jekyll

    ```
    gem install jekyll bundler
    ```
    安装成功后，使用命令行验证安装结果：
    ```
    jekyll -v
    ```

3. 运行项目
    首先使用git clone拉到项目所有文件，然后进入项目根目录文件夹中，运行命令：
    ```
    bundle
    ```
    如果安装过程过于缓慢，建议配置国内镜像：
    ```
    bundle config mirror.https://rubygems.org https://gems.ruby-china.com
    ```
    然后再运行bundle

    运行成功后，记得配置项目目录下的_config.yml中的变量，url，avatar，timezone，lang
    还有其他变量可以多探索下。

    最后使用命令
    ```
    bundle exec jekyll serve
    ```
    成功的话命令行中会有提醒对应的网址，一般是 http://127.0.0.1:4000/
    访问该网址即是对应自己网站的首页。

## 维护与更新博客

1. 学习md知识

    如果之前没有使用过markdown，建议花20分钟左右速刷下教程，语法比较简单，而且加上现在很多编辑器都有实时预览功能，比如vscode，所见即所得。
    这里推荐MarkDown官方文档即可：https://markdown.com.cn/

2. 写第一篇文章

    在_posts文件夹下创建一个md格式文件，文件名格式使用YYYY-MM-DD-TITLE.md
    文件内容上也有要求，前几行格式大概是这样：
    ```
    ---
    title: github pages + jekyll快速搭建blog
    date: 2023-12-27 12:00:00 +0800
    categories: [Blog, Build]
    tags: [blog]
    ---
    ```
    title:即文章标题
    date：就是写文章的日期，记得git push的时候这个时间不能超过真实时间
    categories：分类，比如这篇文章的分类在网站就长这样
    ![主题](/assets/image/20231228185955.png)
    tags: 可以看成文章的标记，比如这篇文章长这样
    ![主题](/assets/image/20231228190130.png)
    后面就是文章正文，按照md的格式进行编写即可

3. 预览与提交

    如果本地有配置环境，可以先在本地进行预览后，没有其他需要修改的部分即可push到github中，等大概1分钟打包好之后，刷新blog过几秒后会弹出更新框，点update之后，即可看到更新好的文章。
