---
title: 使用giscus配置GitHub Pages评论功能
date: 2024-1-4 12:00:00 +0800
categories: [Blog, Build]
tags: [blog]
---

一般博客为了和读者进行交流，都是需要有评论区功能的，除了一些很奇怪的博客。。。


# 评论基础能力确认

GitHub pages开通评论区，首先需要确认的是自己选择的主题是否支持开通评论的功能，确认这种能力一般是两种办法，一种是看主题作者提供的demo是否有带评论区的功能，二是在配置文件中查找是否有相关配置比如giscus的关键词；

# 评论能力开通

1. GitHub仓库配置

    首先需要在自己的仓库中开通Discussion功能，一般新仓库默认不会打开，需要手动开通然后再添加对应的模块即可

    1. 开通Discussion功能

        进入自己的GitHub pages所在仓库，找到setting界面和里面的General选项

        ![主题](/assets/image/2024/1/20240104154923.png)

        下滑找到Feature中勾选Discussion即可打开

        ![主题](/assets/image/2024/1/20240104155100.png)
    
    2. 创建comment

        找到Discussion界面，点Categories右侧的🖊按钮，进入后点New category，准备新建一个category

        ![主题](/assets/image/2024/1/20240104155447.png)

        ![主题](/assets/image/2024/1/20240104155704.png)

        这里name就填Comments，Format勾选Open-ended discussion，完事确认就配置ok

        ![主题](/assets/image/2024/1/20240104155820.png)

2. giscus配置

    首先打开gitscu官网，需要使用当前仓库的GitHub账号登录：https://giscus.app/

    1. 配置语言：
        
        这里是评论区的加载显示语言相关，并不会影响到评论内容的显示，所以选择英语或者中文都行。
    
        ![主题](/assets/image/2024/1/20240104153254.png)
    
    2. 配置仓库：

        这里配置的仓库就是自己现在想要配置的pages页面的仓库地址，用户名+仓库名，比如我的仓库就是winxuan/winxuan.github.io

        ![主题](/assets/image/2024/1/20240104153730.png)

    3. 配置Discussion 分类

        这里就是步骤1中创建的comment选项，勾选即可

        ![主题](/assets/image/2024/1/20240104160029.png)

    4. 其余保持默认，但是不要关闭该也页面，下一步配置中需要使用到这里的信息

        ![主题](/assets/image/2024/1/20240104160517.png)

3. 仓库config配置

    这里以目前使用的主题chirpy（2024年1月4日）配置举例

    找到仓库根目录下的_config.yml文件，找到comments配置，如图中所有的信息都抄下giscus中《启用 giscus》块中的信息即可 

    ![主题](/assets/image/2024/1/20240104160803.png)

    配置完成后，将_config.yml文件push到仓库。

4. 配置效果

    走完打包流程后，弹出更新界面并更新，这时帖子最下方就会出现评论区：

    ![主题](/assets/image/2024/1/20240104161229.png)

    这里可以测试下评论区的评论和回复功能以及表情功能：

    ![主题](/assets/image/2024/1/20240104161412.png)

    相应的仓库Discussion会有对应的信息展示：

    ![主题](/assets/image/2024/1/20240104161541.png)

    

    