---
title: GitHub pages同步主题作者仓库更改
date: 2024-2-20 00:00:00 +0800
categories: [Blog, Build]
tags: [blog]
---

## 问题

我们在 fork 了作者主题的仓库之后，这时候我们和主题仓库实际上已经是两个仓库了，也就是说我们自己可以在 fork 出的仓库自己更改，同时作者也在更新功能或者修复主题的 bug，此时如果我们想获取作者的修改，如果没有 git，我们就需要一行一行对照着进行修改，好处是我们有 git，也就是说我们可以通过 git 来自动化 merge 作者的修改，具体的操作如下

1. 首先需要你使用命令行进入我们自己仓库的根目录，如下图例如笔者这里

    ![截图](/assets/image/2024/2/20240220003809.png)

2. 添加原始仓库为你的 fork 的一个远程源（如果你还没有这么做的话）。这样做可以让你能够获取原始仓库的更新。打开终端或 Git Bash，然后运行如下命令：

    ```
    git remote add upstream <原始仓库的URL>
    ```

    这里，upstream 是原始仓库的一个常用名称，你可以将其替换为任何你喜欢的名字。<原始仓库的 URL>应该替换为你想要同步的原始 GitHub 仓库的 URL，笔者仓库使用的是https://github.com/cotes2020/jekyll-theme-chirpy，所以笔者的命令就如下：

    ```
    git remote add upstream https://github.com/cotes2020/jekyll-theme-chirpy
    ```

3. 获取原始仓库的更新。通过执行以下命令，你可以获取（但不合并）原始仓库（即 upstream）的所有更新：

    ```
    git fetch upstream
    ```

    ![截图](/assets/image/2024/2/20240220004302.png)

4. 切换到你的本地主分支。在合并更新之前，确保你在你的 fork 的主分支上（通常是 main 或 master）：

    ```
    git checkout main
    ```

    或者如果你的主分支是 master：

    ```
    git checkout master
    ```

    笔者这里是 master，所以执行 git checkout master

    ![截图](/assets/image/2024/2/20240220004511.png)

    如何知道自己仓库是 main 还是 master，在 GitHub 的仓库首页即可看到

    ![截图](/assets/image/2024/2/20240220004641.png)

5. 将更新合并到你的主分支。现在，你可以将 upstream 的更新合并到你的本地主分支：

    ```
    git merge upstream/main
    ```

    或者如果原始仓库的主分支是 master：

    ```
    git merge upstream/master
    ```

    执行完命令之后，如果出现如下图所示的 Automatic merge failed; fix conflicts and then commit the result. 就需要暂停下步骤，请转到下一 part 冲突处理

    ![截图](/assets/image/2024/2/20240220004928.png)

    如果没有出现，则可以继续最后一步

6. 推送更新到你的 GitHub fork。最后一步，将这些更改推送到你的 fork 上：

    ```
    git push origin main
    ```

    或者如果你的主分支是 master：

    ```
    git push origin master
    ```

### 冲突处理

在上述第 5 步中如果出现了 Automatic merge failed; fix conflicts and then commit the result.

那就说明了你可能和主题作者同时出现了修改，需要进行额外的步骤处理：

1. 识别在合并过程中出现冲突的文件。你可以使用 git status 命令。这个命令会列出所有当前存在冲突的文件，以及它们的状态，帮助你理解需要解决哪些冲突。冲突的文件通常会被标记为“未合并”(unmerged)状态。

    ```
    git status
    ```

    笔者这里执行之后，出现了一堆的红色冲突（Unmerged paths），绿色是 git 帮你自动 merge 好的或者自动处理了冲突的，相当于已经执行了 git add 命令，可以不用管

    ![截图](/assets/image/2024/2/20240220005806.png)

    当然红色冲突部分也分为多种，比如笔者这里出现了两种，一种是 【deleted by us】 的，也就是笔者删除了文件同时主题作者又修改了这一文件，另一种是 【both modified】 ，也就是笔者和作者同时修改了这个文件的某一部分

2. 处理【deleted by us】冲突

    假如笔者这里确定仍要删除这些文件，对于每个标记为 deleted by us 的文件，笔者需要使用 git rm 命令来确认删除这些文件。这个命令不仅会从你的工作目录中删除文件（如果它们还在的话），还会将这次删除操作添加到暂存区，为下一次提交做准备。对于上述提到的文件，笔者执行如下命令：

    ```
    git rm .github/dependabot.yml
    git rm .github/workflows/codeql.yml
    git rm .github/workflows/stale.yml
    git rm _posts/2019-08-08-text-and-typography.md
    git rm _posts/2019-08-08-write-a-new-post.md
    git rm _posts/2019-08-09-getting-started.md
    ```

    分别执行之后，就会发现这些文件已经从工作目录删除，同时这里执行 git status 命令也会发现，【Unmerged paths】部分也不会再显示这些文件冲突

    ![截图](/assets/image/2024/2/20240220010721.png)

    假如笔者这里希望保留【\_posts/2019-08-09-getting-started.md】文件，那就需要检出这个文件：

    首先，需要使用 git checkout 命令从 upstream/master 分支检出这个文件到你的工作目录。这将撤销删除操作，并将文件的状态回滚到 upstream/master 分支上的版本。执行以下命令：

    ```
    git checkout upstream/master -- _posts/2019-08-09-getting-started.md
    ```

    检出文件后，需要将其添加到暂存区，准备进行提交。使用 git add 命令添加这个文件：

    ```
    git add _posts/2019-08-09-getting-started.md
    ```

3. 处理【both modified】冲突

    通常非常容易出现这类冲突，这里我们以笔者这里出现的.gitignore 文件冲突举例说明如何处理这类冲突

    使用编辑器（笔者这里使用 vscode）打开后，会非常醒目的标记出冲突，如图
    ![截图](/assets/image/2024/2/20240220000252.png)

    这里需要手动编辑这个文件，决定保留哪个版本的更改，或者合并这些更改。冲突部分会被包围在<<<<<<< HEAD 和>>>>>>> upstream/master 之间，类似这样：

    ```
    <<<<<<< HEAD
    你在HEAD（你的分支）版本的内容
    =======
    upstream/master分支的内容
    >>>>>>> upstream/master
    ```

    笔者这里希望保留主题作者的更改，于是首先删除了【你在 HEAD（你的分支）版本的内容】，然后删除<<<<<<< HEAD、=======、>>>>>>> upstream/master 这些标记并保存。修改完如图：

    ![截图](/assets/image/2024/2/20240220012217.png)

    最后再使用 git add 命令提交这个文件

    ```
    git add .gitignore
    ```

4. 处理完以上所有冲突后，推送更新到你的 GitHub fork，将这些更改推送到你的 fork 上：

    ```
    git push origin main
    ```

    或者如果你的主分支是 master：

    ```
    git push origin master
    ```

## 最后

提交到远程仓库之后，正常情况下会打包成功并且会显示你的代码仓库领先主题作者仓库多少分支，如图笔者这里提交后的显示：

![截图](/assets/image/2024/2/20240220012526.png)

这里【This branch is 100 commits ahead of cotes2020/jekyll-theme-chirpy:master.】这句话表示笔者当前的分支比 cotes2020/jekyll-theme-chirpy 仓库的 master 分支领先了 100 个提交。在 Git 中，这意味着笔者最后一次从 cotes2020/jekyll-theme-chirpy 的 master 分支拉取（或克隆或者以它为基础创建分支）以来，笔者已经在笔者的分支上进行了 100 次提交的更改，而这些更改还没有被推送到 cotes2020/jekyll-theme-chirpy 的 master 分支上

也就是说，笔者已经成功 merge 到了主题作者所有的修改，看到这句话，也就证明此次 merge 到此结束了。
