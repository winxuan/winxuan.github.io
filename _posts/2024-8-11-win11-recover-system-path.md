---
title: Win10&win11 恢复系统自带用户文件夹
date: 2024-8-11 00:00:00 +0800
categories: [Tips, System]
tags: [tips]
---

# 1. 前言&问题

笔者在安装win11系统后，误删了自己用户名下的系统文件夹 下载。笔者尝试新建文件夹恢复，如果直接创建Downloads文件夹，那么这个文件夹不会显示系统自带的下载图标，如果创建“下载”文件夹，那么创建的文件夹是中文名，很多软件并不认中文路径。笔者经过深入搜索，发现这个文件夹是Windows自带的一种特殊的系统文件夹，直接挪动位置和重命名等操作，会导致该文件夹转变成一种普通文件夹，从而失去很多功能，比如属性中设置位置等，笔者经过多种尝试，正常恢复了“下载”文件夹。

![截图](/assets/image/2024/8/20240811143837.png)


# 2. 尝试

笔者在多方查找之后，发现了两种比较有用的方法：

## 2.1 方法一：使用 Windows 命令修复用户配置文件文件夹

1. 打开命令提示符（以管理员身份运行）
2. 输入以下命令来重新注册用户配置文件文件夹：
   ```cmd
   attrib +r -s -h "%USERPROFILE%\Downloads" /S /D
   ```
   这将为“下载”文件夹恢复“只读”属性，并清除隐藏和系统属性。
3. 注册表修复：
   1. 确保在注册表编辑器中，HKEY_CURRENT_USER\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\User Shell Folders 中 Downloads 的路径为 %USERPROFILE%\Downloads。
   2. 在 HKEY_CURRENT_USER\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\Shell Folders 中也检查 Downloads 键的值，确保它指向正确的文件夹路径。
4. 注销并重新登录
   完成以上步骤后，注销当前用户帐户并重新登录，查看“下载”文件夹是否恢复了其特殊属性。

## 2.2 方法二：通过 Windows PowerShell 重置文件夹

1. 打开 PowerShell（以管理员身份运行）：
   在搜索栏中输入 PowerShell，右键点击“Windows PowerShell”，选择“以管理员身份运行”。
2. 输入以下命令重置所有用户文件夹：
   ```powershell
   $Key = 'HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\User Shell Folders'
   Set-ItemProperty -Path $Key -Name '{374DE290-123F-4565-9164-39C4925E467B}' -Value '%USERPROFILE%\Downloads'
   ```
   这将会重置“下载”文件夹的位置并恢复它的默认设置。
3. 重启电脑或者注销当前当户二选一即可

# 最后

笔者是因为误删导致，但是经过搜索发现这类所谓的系统文件夹恢复起来异常困难，微软压根没有提供一个比较简单的恢复机制，当然这并不影响日常使用。