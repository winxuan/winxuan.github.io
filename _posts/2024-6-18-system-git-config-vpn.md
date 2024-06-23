---
title: Windows&Linux系统GitHub配置git命令VPN
date: 2024-6-18 18:00:00 +0800
categories: [Tips, System]
tags: [tips]
---

笔者在使用GitHub的过程中发现，国内使用GitHub有时clone和pull工程会过于缓慢，甚至会直接报错，鉴于国内的环境，则不得不为git命令单独配置vpn。

git的命令会有两种连接，一种是http或者https，一种是ssh，以下是两种配置

![截图](/assets/image/2024/6/20240618225044.png)

![截图](/assets/image/2024/6/20240618225017.png)

# Windows系统配置git命令的全局vpn

1. http or https

    笔者一般在clone别人开源项目时，经常使用https的链接，因为该链接是https，不用ssh那样会有些麻烦

    而自己的项目如果选择https，则每次push或者clone时都会要求输入GitHub的用户名和密码，十分不方便，但是https胜在简单，如果想配置https使用vpn，则直接在命令行输入如下指令即可

    ```
    git config --global http.proxy socks5://192.168.50.113:1080
    git config --global https.proxy socks5://192.168.50.113:1080
    ```
    笔者的vpn是支持socks5的，ip是192.168.50.113，port是1080，各位可以据此更改自己的vpn配置

2. ssh
   
    笔者一般都使用ssh来clone自己的项目，并且在自动化提交时，也不用输入密码即可直接提交，非常方便

    但是国内环境不稳定，经常5分钟前刚push完，5分钟后就不能pull了，就会像这样：

    ```
    PS D:\github\winxuan.github.io> git pull
    The authenticity of host 'github.com (134.122.196.100)' can't be established.
    ED25519 key fingerprint is SHA256
    +OfkhiMd0kWxjBgdK0SOgJujui5Zyxg.
    This key is not known by any other names.
    Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
    Warning: Permanently added 'github.com' (ED25519) to the list of known hosts.
    git@github.com's password:
    ```
    我怎么知道git@github.com的密码！

    这时候不论你删除.ssh目录下的known_hosts，还是配置成443端口，都没有用，这个纯属国内环境问题，时好时坏

    为了解决这个问题，笔者也给ssh上了vpn，步骤如下

    1. 安装ncat
        
        一般Windows在安装git for Windows时是不安装netcat，简称nc的，没有这个软件是没办法转发ssh的请求的，所以需要单独安装

        这里我们选择ncat，相当于netcat的增强版，由 Nmap 项目维护，网址在https://nmap.org/dist/nmap-7.92-setup.exe

        下载之后默认安装即可

    2. 配置ncat

        ncat需要配置到系统环境变量中，配置方式如下：

        1. 编辑系统环境变量--系统变量--Path--编辑
        
        2. 点“新建”，然后添加 Nmap 的安装目录路径，默认是：C:\Program Files (x86)\Nmap。

    3. 配置git ssh环境变量

        git ssh的命令也需要配置到环境变量中

        1. 编辑系统环境变量--系统变量--新建

        2. 输入如下信息

            ```
            变量名：GIT_SSH_COMMAND
            变量值：ssh -o ProxyCommand='ncat --proxy 192.168.50.113:1080 --proxy-type socks5 %h %p'
            ```

    4. 测试配置

        输入如下命令

        ```
        ssh -T git@github.com
        ```

        正常会输出如下：

        ```
        Hi your_username! You've successfully authenticated, but GitHub does not provide shell access.
        ```

# Linux系统配置git命令的全局vpn

笔者这里使用的是树莓派来进行配置

1. http or https

    也是使用git命令的方式配置，比如笔者这里的vpn使用socks5://192.168.50.113:1080，则对应config为：

    ```
    git config --global http.proxy socks5://192.168.50.113:1080
    git config --global https.proxy socks5://192.168.50.113:1080
    ```

2. ssh

    笔者这里以自己的配置为例：socks5://192.168.50.113:1080

    1. 编辑 SSH 配置文件：使用文本编辑器（如 nano）打开或创建 SSH 配置文件

        ```
        nano ~/.ssh/config
        ```
    
    2. 添加代理配置：在文件中添加以下内容:

        ```
        Host github.com
            User git
            ProxyCommand nc -X 5 -x 192.168.50.113:1080 %h %p
        ```

    3. 保存并关闭文件：在 nano 中，按 Ctrl+X，然后按 Y，最后按 Enter 来保存并退出。

        之所以写这一步骤，是因为有人在笔者的csdn的blog中骂笔者没有教他怎么在nano中保存。

    4. 确保已安装 netcat：树莓派应该预装了 netcat，没有的话安装下：

        ```
        sudo apt update
        sudo apt install netcat
        ```
    5. Git 配置中设置全局代理

        ```
        git config --global core.sshCommand "ssh -o ProxyCommand='nc -X 5 -x 192.168.50.113:1080 %h %p'"
        ```


笔者自己在配置后即可正常使用git，如果不想配置如上，建议使用国内的gitee，gitee的功能和GitHub是差不多的，而且gitee有个仓库镜像同步的功能

![截图](/assets/image/2024/6/20240618231231.png)

也就是说在gitee配置和GitHub的连接之后，通过gitee推送的提交，可以自动通过gitee的服务器推送到GitHub中。

当然gitee也有些问题，比如开源仓库少等，自己写一些小工具的私有仓库，使用gitee没毛病，但是开源和GitHub pages这些还是推荐GitHub吧，笔者两个仓库都用。

