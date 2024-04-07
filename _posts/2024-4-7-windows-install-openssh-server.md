---
title: Windows系统如何安装ssh服务端
date: 2024-4-7 12:00:00 +0800
categories: [Tips, System]
tags: [tips]
---

# 前言

Windows系统一般不默认安装ssh，尤其是ssh服务端，也就是别的机器想通过ssh方式连接Windows机器时，Windows机器需要启动的服务，这里因为笔者日常经常会使用到Windows系统ssh服务端，并且由于Windows安装ssh服务端经常会出现失败，这里笔者总结了3种方法，确保可以安装成功。

# 前置检查：

1. Windows系统最低要求： Windows Server 2019 或 Windows 10
2. PowerShell 5.1以上：打开PowerShell，输入$PSVersionTable.PSVersion，最低要求是5
3. 用户为管理员用户组：打开PowerShell，输入以下命令

```
(New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
```

输出显示 True则为管理员组

务必确认以上检查通过，没有通过建议询问ChatGPT寻求解决方案

# 方法一：Windows设置中安装

1. 打开“设置”，选择“系统”，然后选择“可选功能”，没找到就直接在设置中搜索“可选功能”
2. 扫描列表，查看是否已安装 OpenSSH。 如果未安装，请在页面顶部选择“添加功能”，找到“OpenSSH 客户端”，然后选择“安装”，找到“OpenSSH Server”，然后选择“安装”
3. 确保安装成功，有概率安装会安装失败，可能因为环境或者网络问题，如果安装失败，建议直接用方法三；
4. 打开“服务”桌面应用。 （选择“开始”，在搜索框中键入 services.msc ，然后选择“服务”应用或按 ENTER。）
5. 在详细信息窗格中，双击“OpenSSH SSH 服务器”。
6. 在“常规”选项卡上的“启动类型”下拉菜单中，选择“自动”，然后选择“确定”。
7. 若要启动服务，请选择“启动”。

以上是Windows10操作系统的过程，Windows11会有细微不同这里不再赘述

# 方法二：命令行方式（全程使用管理员PowerShell）

1. 输入如下命令

```
Get-WindowsCapability -Online | Where-Object Name -like 'OpenSSH*'
```

一般会返回

```
Name  : OpenSSH.Client~~~~0.0.1.0
State : Installed

Name  : OpenSSH.Server~~~~0.0.1.0
State : NotPresent
```

也就是ssh客户端已经安装，服务端没有安装

2. 输入如下命令分别安装ssh客户端和服务端

```
# Install the OpenSSH Client
Add-WindowsCapability -Online -Name OpenSSH.Client~~~~0.0.1.0

# Install the OpenSSH Server
Add-WindowsCapability -Online -Name OpenSSH.Server~~~~0.0.1.0
```

过程中如果出现错误，建议直接使用方法三

3. 使用如下命令分别启动ssh服务端，配置服务开机自动启动，配置防火墙

```
# Start the sshd service
Start-Service sshd

# OPTIONAL but recommended:
Set-Service -Name sshd -StartupType 'Automatic'

# Confirm the Firewall rule is configured. It should be created automatically by setup. Run the following to verify
if (!(Get-NetFirewallRule -Name "OpenSSH-Server-In-TCP" -ErrorAction SilentlyContinue | Select-Object Name, Enabled)) {
    Write-Output "Firewall Rule 'OpenSSH-Server-In-TCP' does not exist, creating it..."
    New-NetFirewallRule -Name 'OpenSSH-Server-In-TCP' -DisplayName 'OpenSSH Server (sshd)' -Enabled True -Direction Inbound -Protocol TCP -Action Allow -LocalPort 22
} else {
    Write-Output "Firewall rule 'OpenSSH-Server-In-TCP' has been created and exists."
}
```

# 方法三：手动下载离线安装

微软PowerShell的GitHub仓库有开源ssh部分，这里直接下载安装即可。

1. 仓库位置在https://github.com/PowerShell/Win32-OpenSSH，这里建议直接下载release版本即可，位置在https://github.com/PowerShell/Win32-OpenSSH/releases，根据版本选择，这里笔者选择OpenSSH-Win64.zip
2. 由于是长期使用软件，这里笔者直接将解压后的文件放在C:\Program Files\OpenSSH-Win64
3. 使用管理员打开PowerShell，并cd到C:\Program Files\OpenSSH-Win64目录下，输入如下命令

```
set-executionpolicy remotesigned
```

并输入y确认
再输入如下命令完成安装

```
.\install-sshd.ps1
```

4. 使用如下命令分别启动ssh服务端，配置服务开机自动启动，配置防火墙

```
# Start the sshd service
Start-Service sshd

# OPTIONAL but recommended:
Set-Service -Name sshd -StartupType 'Automatic'

# Confirm the Firewall rule is configured. It should be created automatically by setup. Run the following to verify
if (!(Get-NetFirewallRule -Name "OpenSSH-Server-In-TCP" -ErrorAction SilentlyContinue | Select-Object Name, Enabled)) {
    Write-Output "Firewall Rule 'OpenSSH-Server-In-TCP' does not exist, creating it..."
    New-NetFirewallRule -Name 'OpenSSH-Server-In-TCP' -DisplayName 'OpenSSH Server (sshd)' -Enabled True -Direction Inbound -Protocol TCP -Action Allow -LocalPort 22
} else {
    Write-Output "Firewall rule 'OpenSSH-Server-In-TCP' has been created and exists."
}
```

方法一和二实际上就是微软官方给出的安装指南，链接：https://learn.microsoft.com/zh-cn/windows-server/administration/openssh/openssh_install_firstuse?tabs=powershell
但是实际上容易失败，可能是网络或者是本地环境问题，所以笔者给出第三种方案，也是之前微软没有将ssh服务端加入到Windows系统可选功能前的安装办法，这里笔者也是担心遗忘写帖子记录下。