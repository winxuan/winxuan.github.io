---
title: Jenkins备份与快速恢复
date: 2024-3-7 18:00:00 +0800
categories: [Blog, Build]
tags: [blog]
---

## 问题

Jenkins用的多了就会发现有非常多得任务和配置，当然这些任务和配置一般是没有svn或者git做版本管理的，也就是会有这么一个问题：部署Jenkins的机器有一天硬盘宕机了，那恢复的时候会发现这时候离职其实是最好的选择。

笔者自己就经历过类似的事情，大概是20年的时候，笔者所在的一个5年的老项目组想做后续大型的线上更新，但是偏偏这时候机器宕机了，原因是因为这台机器是一台黑苹果，固态硬盘老化损坏无法开机了，巧合的是这台机器刚好就是部署了项目组Jenkins和iOS整包patch的一个机器，无奈就硬着头皮恢复打包机，在国庆节前一周时间费尽力气一点一点恢复，那一周真的废了半条命，配合上一点幸运值加成，最终恢复了Jenkins和打包环境，不然整个项目组就会全面停摆去走极其艰难的申请版号的路，5年后想起来这件事仍然历历在目。所以笔者的亲身经历告诉自己，Jenkins必须想办法进行配置备份和快速恢复，否则真到了水逆的那一天，项目组停摆，制作人和主程以及主QA站在你身后看着你，哭也算时间哦。

## 方案

好在Jenkins的框架设计决定了它非常容易备份，直接复制文件就可以在另一个环境中完全恢复完成。这里说下安装在Windows环境中的Jenkins备份方法，安装在Linux和mac上的恢复方法类似，因为本身底层就是java。

1. 备份

    首先需要找到Jenkins安装路径，一般默认会安装到这个目录
    ```
    C:\Users\Administrator\AppData\Local\Jenkins\.jenkins
    ```
    如果没有找到类似的话可以使用everything搜索下关键词.jenkins一般就可以找到，这个路径就是Jenkins的所有配置文件的根目录

    1. job的备份：
    
    进入.jenkins根目录后，会有一个job的文件夹，该文件夹中即是所有任务的配置文件和运行log文件，直接复制这个文件夹到备份文件夹根目录即可。

    2. node的备份
    
    同理进入.jenkins根目录后，会有一个node的文件夹，也是直接复制这个文件夹到备份文件夹根目录即可。

    3. 全局配置的备份

    同理进入.jenkins根目录后，会有一个config.xml的文件，这个文件就是全局配置的配置文件，也是直接复制该文件到备份文件夹根目录即可。

    4. 插件的备份

    同理进入.jenkins根目录后，会有一个plugins的文件夹，好在Jenkins安装插件时，下载的插件位置和安装插件的位置都在这个目录下，插件文件夹直接复制到新环境中，不用安装即可使用，所以也是直接复制该文件到备份文件夹根目录即可。

    以上备份基本上满足了我们备份Jenkins的目的，现在只需要将备份文件夹上传到svn或者云端即可保障项目组CICD的根基。

    当然也可以写一些自动化脚本帮助我们完成备份，比如因为log我不想要，我只需要配置文件，即可使用笔者这个bat

    ```bat
    @echo off
    setlocal enabledelayedexpansion

    D:
    cd D:\jenkins_backup

    REM 设置JENKINS_HOME目录，请根据实际情况替换下面的路径
    set JENKINS_HOME=C:\Users\Administrator\AppData\Local\Jenkins\.jenkins

    REM 设置备份目录名称
    set BACKUP_DIR=jenkins_backup_test

    REM 检查备份目录是否存在，如果存在则删除
    if exist "%BACKUP_DIR%" (
        echo Found existing backup directory. Deleting...
        rmdir /s /q "%BACKUP_DIR%"
    )

    REM 创建新的备份目录
    echo Creating new backup directory...
    mkdir "%BACKUP_DIR%"

    REM 复制Jenkins插件
    echo Copying Jenkins plugins...
    xcopy "%JENKINS_HOME%\plugins" "%BACKUP_DIR%\plugins\" /E /I /Q

    REM 复制Jenkins主配置文件
    echo Copying Jenkins main configuration file...
    xcopy "%JENKINS_HOME%\config.xml" "%BACKUP_DIR%\" /Q

    REM 复制Jenkins作业配置（需要为每个作业执行此操作）
    echo Copying Jenkins job configurations...
    for /d %%a in ("%JENKINS_HOME%\jobs\*") do (
        set JOB_NAME=%%~nxa
        echo Copying configuration for job: !JOB_NAME!
        mkdir "%BACKUP_DIR%\jobs\!JOB_NAME!"
        xcopy "%%a\config.xml" "%BACKUP_DIR%\jobs\!JOB_NAME!\" /Q
    )

    REM 复制节点配置
    echo Copying Jenkins node configurations...
    xcopy "%JENKINS_HOME%\nodes" "%BACKUP_DIR%\nodes\" /E /I /Q

    echo Backup completed successfully.
    endlocal
    
    ```

2. 新环境快速安装部署

    安装Jenkins非常简单，只需要一个java运行环境再运行Jenkins安装包即可，当然这里我们也可以做一些自动化，比如自动化安装和配置java环境，使用一个bat即可：

    ```bat
    @echo off
    SETLOCAL EnableDelayedExpansion

    :: 设置安装包名称
    set JAVA_INSTALLER=jdk-11.0.22_windows-x64_bin.exe

    :: 安装Java
    echo Installing Java...
    start /wait "" "%~dp0%JAVA_INSTALLER%" /s

    :: 设置JAVA_HOME环境变量
    set "JAVA_HOME=C:\Program Files\Java\jdk-11"
    setx JAVA_HOME "%JAVA_HOME%"
    setx PATH "%PATH%;%JAVA_HOME%\bin"


    ENDLOCAL
    ```

    上述脚本根据自己在java官网下载的包不同，修改下安装包名称和环境变量中的位置即可

    安装Jenkins没有什么比较快速的办法，不过有个技巧，就是在运行安装包后，在配置Jenkins时，记得不要安装任何插件，因为国内网速的问题，可以先跳过就可以节省大量时间，后续使用文件夹恢复或者使用镜像地址重新安装都比这里安装的快。

3. 恢复
    
    新环境安装完成之后，仍旧是找到根目录.jenkins，将之前备份的几个文件夹复制到这里，重启新环境的Jenkins，重启之后，你会发现连登录鉴权都复制过来了，只不过需要重新连接对应node即可。至此，备份和快速恢复结束，大部分配置都可以恢复过来，如果新环境安装时使用了同版本的Jenkins，那剩下的不兼容问题也都能解决。

以上即为备份和快速恢复的方法，也可以用做Jenkins迁移的方案，原理和操作都非常简单，但是作用非常大，并且笔者尝试了下，比较熟练得情况下，基本上10分钟左右即可恢复完成，建议可以使用Windows自带的sandbox进行新环境部署和恢复验证。同时笔者后续也会再写一些节点管理自动化相关的文章，进一步释放大家的人力。