 ---
title: 多平台安装与配置ollama
date: 2024-6-17 00:00:00 +0800
categories: [AIGC, Ollama]
tags: [ollama]
---

ollama目前已经支持三种平台的安装（2024年6月16日），Windows，MacOS和Linux

# Windows安装

之前版本的ollama，只能通过安装在Windows子系统的方式安装，目前ollama已经支持直接安装在Windows，并且安装完成之后不用再安装cuda等组件支持，直接可以调用显卡算力；

以下用llama3举例：

1. 官网下载和安装ollama

    访问官网下载安装包：

    [Download Ollama](https://www.ollama.com/download)
    
    这里选择Windows，目前（2024年6月16日）暂时应该只能选择预览版本。

    ![截图](/assets/image/2024/6/20240616230112.png)

    下载并安装即可

2. Windows配置对应环境变量

    Windows--编辑系统环境变量--xxx的用户环境变量--按照需求新增以下配置

    1. 配置模型安装位置

        默认的模型会下载到C盘，如果你的C盘很小不想变红，建议设置下，因为一个模型大小小则几个G多则上百G，并且建议设置到固态硬盘速度会更快一些
        
        OLLAMA_MODELS=自定义位置

        如笔者这里需要安装在D盘的Ollama文件夹，则对应的用户环境变量配置如下：

        ![截图](/assets/image/2024/6/20240617004228.png)

        ![截图](/assets/image/2024/6/20240617004731.png)

        配置完成后在ollama命令中pull的模型就默认放在自定义位置
        
    2. 配置Chat API地址

        Ollama提供了两个API访问接口，常用的是Chat。两个API连接默认是127.0.0.1:11434，也即默认只能用本机访问11434端口，可以在浏览器中看到如下效果：

        ![截图](/assets/image/2024/6/20240617004534.png)

        共有两个变量控制，一个OLLAMA_HOST控制访问地址，一个OLLAMA_PORT控制端口

        如笔者这里需要设置为局域网可访问，且端口需要修改为8086，则对应的变量应该设置OLLAMA_HOST为0.0.0.0，OLLAMA_PORT为8086：

        ![截图](/assets/image/2024/6/20240617004926.png)

    3. 设置并发请求数量

        Ollama可以同时处理多个请求，默认只能处理一个请求，这里如果需要放开，则需要设置OLLAMA_NUM_PARALLEL

        如笔者需要Ollama能同时处理5个请求，则需要添加环境变量OLLAMA_NUM_PARALLEL，对应的值设置为5

    4. 多模型并发运行

        Ollama支持同时运行多个模型，默认也只运行一个模型，这里如果需要同时加载几个模型，则需要设置OLLAMA_MAX_LOADED_MODELS

        如笔者需要Ollama能同时运行2个模型，则需要添加环境变量OLLAMA_MAX_LOADED_MODELS，对应的值设置为5

        一般该值需要配合变量OLLAMA_NUM_PARALLEL一起配置，比如笔者希望能同时运行3个模型，并且支持3个用户同时请求，那就需要设置红OLLAMA_MAX_LOADED_MODELS=3，OLLAMA_NUM_PARALLEL=3

    5. 模型保持运行（模型存活时间）

        Ollama默认在最后一次使用模型5分钟之后就会自动卸载掉模型，表现就是模型在第一次使用时生成速度较慢，5分钟内如果再次使用，则生成速度较快，5分钟内没有使用5分钟后再次使用，则模型回复速度又和第一次一样缓慢；

        而且目前（2024年6月17日）Ollama有个小bug，在卸载掉模型之后，对应的内存实际上还是存在的，需要手动释放掉，所以建议如果需要长期使用，就让模型一直存活即可，则设置对应的环境变量OLLAMA_KEEP_ALIVE为-1或者24h

        Ollama无法释放内存的问题，就需要手动释放内存：

        ```
        taskkill /F /IM ollama
        taskkill /F /IM ollama*
        taskkill /F /IM *ollama
        ```
        或者powershell中执行

        ```
        Get-Process | Where-Object { $_.Name -match 'ollama' } | ForEach-Object { Stop-Process -Id $_.Id -Force }
        ```

        执行完成命令可以用这个命令查看下Ollama是否有进程， 这个命令是用于在 Windows 系统上列出所有名为 Ollama.Exe 的进程。

        ```
        Tasklist /FI "IMAGENAME Eq *ollama*"
        ```


3. 安装模型与模型调用

    正常安装即可使用在命令行执行Ollama相关命令

    比如笔者这里需要运行llama3的8b模型，正常流程如下：

    1. Ollama官网搜索该模型

        [Ollama Models](https://www.ollama.com/library)

        ![截图](/assets/image/2024/6/20240617013750.png)

        对应模型会有很多详细信息，比如笔者需要的llama:3b，对应的命令也会有提示

        ![截图](/assets/image/2024/6/20240617013844.png)

    2. 本地pull

        Ollama提供了两个命令，一个是ollama pull xxx用来pull对应模型，一个是ollama run xxx用来pull&run对应的模型

        笔者这里习惯在新机器上先pull好几个模型然后再使用API直接调用，所以习惯用拆开的run命令

        ```
        ollama run llama3:8b
        ```

        这里有个小tips，llama3的默认模型是8b，所以ollama run llama3和ollama run llama3:8b都会run 8b的模型

        ![截图](/assets/image/2024/6/20240617014607.png)

    3. 本地run
   
        ```
        ollama run llama3:8b
        ```

        这里启动速度取决于硬盘，内存和cpu
        
        笔者这里是7800x3d配7900GRE，执行8b模型的速度还是十分快的：

        ![截图](/assets/image/2024/6/20240617015100.gif)
        
        上文提到本地run模型会自动使用显卡算力，这里有个小tips，默认任务管理器的显卡信息显示的利用率并不是对应显卡的算力，如下gif中可以看到其实将Compute 0作为指标更为合适

        ![截图](/assets/image/2024/6/20240617015452.png)

        N卡的话观察cuda会更合适一些。
    
    4. Ollama模型退出

        这里上文有提到过，Ollama有个不能退出模型的小bug，需要在任务管理器中杀掉如下几个Ollama进程才行：

        ```
        映像名称                       PID 会话名              会话#       内存使用
        ========================= ======== ================ =========== ============
        ollama.exe                   42004 Console                    1     19,528 K
        ollama app.exe               39268 Console                    1     18,204 K
        ollama.exe                   45728 Console                    1    147,600 K
        ollama_llama_server.exe      43844 Console                    1  5,201,756 K
        ```

        杀掉之后会发现之前cpu和gpu占用的内存都会释放掉。
    

        