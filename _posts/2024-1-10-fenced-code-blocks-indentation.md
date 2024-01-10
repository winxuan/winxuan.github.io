---
title: chirpy主题围栏代码块（Fenced Code Blocks）缩进功能添加
date: 2024-1-10 12:00:00 +0800
categories: [Blog, Build]
tags: [blog]
---

## 问题

笔者在使用[chirpy主题](https://github.com/cotes2020/jekyll-theme-chirpy)时，因为很多文章都涉及到代码，尤其是最后需要给出例程，所以很多情况下需要使用到这种围栏代码块（Fenced Code Blocks），也就是\~~~或者\```包围代码块，比如

```python


```

虽然这种放置代码的格式不论是在书写方便还是展示上高亮效果都很好，但是展示上有点小问题，那就是不控制长度，如果你的代码有几百行，这里也会显示几百行，导致用户阅读十分困难。

我之前有用过其他的blog网站，都会在代码过长时进行自动的折叠，目前使用的chirpy主题还没有提供自动折叠的能力，这里笔者找到了一个方法可以添加这个能力。

方案来自于两年前的一个blog[让Chirpy主题支持折叠展示代码块](https://azhu.site/posts/add-code-fold-feature/)，我没有找到原始blog，也不知道看到的这是几手的，但是看起来应该是原创的，不好判断是因为作者一直在更换主题和仓库等导致的时间问题。

方案看起来很好用，和主流的折叠方案几乎一致，这里准备抄作业

笔者发现作者虽然blog的时间是23年，但是根据文章内gif图来看已经是21年的了，目前已经（2024年1月10日）。简单做了下社工，发现作者好像在好几个位置都投了相同的稿件，但是内容上都大差不差。

但是有几个问题，

1. 笔者虽然混迹互联网五六年了，但是几乎没有太多接触过前端代码；
2. 方案是21年的，距今已经3年之久，直接使用几乎不可能，当然也可以考虑联系作者但是预计时间会跨度太大；
3. 解决方案作者方案描述用的是什么文件几行几行修改哪些，预估3年时间已经完全对应不上行数，几乎没办法使用；

笔者这里因为强迫症和倔的问题，也确实想要这折叠代码的能力，所以直接上手干了；

## 解决过程

1. 修改"\_includes\refactor-content.html"

    这里作者按照行数给出了修改的意见

    ![截图](/assets/image/2024/1/20240110162700.png)

    我尝试对照了下，发现应该时对不上号了，于是去chirpy主题找到了3年前的代码，对照3份代码看了下，完成了修改，这里其实就是在所有class为highlight的容器中添加一个collapsible-content自定义容器，然后增加了一段替换容器和js的逻辑；

    ![截图](/assets/image/2024/1/20240110163139.png)

    ```html
        <p class="language-javascript collapsible-trigger collapsible-trigger-css">展开/收起</p>
    ```

    ```html
        {% if _content contains '<div class="language-' and '<div class="content">'%}
        {% assign _content = _content
            | replace: '<div class="language-', '<div class="collapsible-container language-'
            | replace: '<div class="content">', '<script src="/assets/js/dist/collapsible.js"></script><div class="content">' 
        %}
        {% endif %}
    ```

    这里注意post-content现在已经修改为了content，我已经修改了

2. 修改\assets\css\style.scss

    chirpy作者已经删除了这个文件，不过也大差不差，改成了\assets\css\jekyll-theme-chirpy.scss，这里同样向后添加即可

    ![截图](/assets/image/2024/1/20240110163700.png)

    ```
        .collapsible-container {
        margin-bottom: 10px;
        }

        .collapsible-container p {
        cursor: pointer;
        margin: 0;
        }

        .collapsible-content {
        overflow-x: auto;
        overflow-y: hidden;
        margin-top: 10px;
        max-height: calc(1.6em * 5); /* Adjust this value to show more lines (n) */
        }
        .collapsible-trigger-css {
        color: gray; 
        text-align: center; 
        font-size: small;
        }

        /* 为代码展示框设置滚动条样式，仅针对WebKit浏览器 */
        .collapsible-content::-webkit-scrollbar {
        width: 8px; /* 滚动条宽度 */
        height: 8px; /* 滚动条高度（对于水平滚动条） */
        }

        .collapsible-content::-webkit-scrollbar-thumb {
        background-color: rgba(0, 0, 0, 0.2); /* 滚动条滑块颜色 */
        border-radius: 6px; /* 滚动条滑块圆角 */
        }

        .collapsible-content::-webkit-scrollbar-thumb:hover {
        background-color: rgba(0, 0, 0, 0.3); /* 滚动条滑块鼠标悬停颜色 */
        }

        .collapsible-content::-webkit-scrollbar-track {
        background-color: #f1f1f1; /* 滚动条轨道颜色 */
        border-radius: 6px; /* 滚动条轨道圆角 */
        }
    ```

3. 创建\assets\js\collapsible.js

    这里直接创建即可，位置不变

    ```javascript
        document.addEventListener("DOMContentLoaded", function () {
        let coll = document.getElementsByClassName("collapsible-container");
        let maxLines = 5; // 设置折叠显示的行数 Maximum number of lines to display without collapsing

        for (let i = 0; i < coll.length; i++) {
            let trigger = coll[i].querySelector('.collapsible-trigger');
            let content = coll[i].querySelector('.collapsible-content');
            let codeLines = content.textContent.split('\n').length;

            /* codeLines=实际行的行数*2+一行换行空行，因为chirpy主题使用了<table>标签，里边包含两列，所以js会将1行代码视为2行。下边被注释掉的代码可以查看codeLines的真实值。codeLines=real_lines*2+1wrap_blank_line,because the chirpy theme uses <table> with 2 columns,which js reguard 1 line as 2 lines. The code section below can help you see the real value of codeLines.
            let tempcodeLines = content.textContent.split('\n').length;
            let lineCount = document.createElement('span');
            lineCount.textContent = ' (' + tempcodeLines + ' lines)';
            coll[i].appendChild(lineCount);
            */

            if (codeLines - 6 <= maxLines) { /*根据主题的实际情况将codeLines调整为实际行数 Adjust codeLines to real lines*/
            trigger.style.display = 'none';
            } else {
            trigger.addEventListener("click", function () {
                this.classList.toggle("active");
                if (content.style.maxHeight) {
                content.style.maxHeight = null;
                } else {
                content.style.maxHeight = content.scrollHeight + "px";
                }
            });
            }
        }
        });
    ```

更改之后，代码超过5行就被自动折叠，如果不超过5行，不会出现折叠展开按钮

## 优化

这里已经实现了代码折叠与展开的功能，但是实际上影响到了Chirpy主题原有CSS的适配，并且默认折叠和展开的行数有点少需要调节下，折叠的时候，眼睛容易失焦，最后还有这个展开与折叠的那妞也可以修改下；

这里我们一条一条实现

1. 对于Chirpy主题影响

实际上是因为作者这里的替换

```html
    {% if _content contains '<div class="language-' and '<div class="post-content">'%}
        {% assign _content = _content
            | replace: '<div class="language-', '<div class="collapsible-container language-'
            | replace: '<div class="post-content">', '<script src="/assets/js/collapsible.js"></script><div class="post-content">' %}
            {% endif %}
```

| replace: '<div class="language-', '<div class="collapsible-container language-'

上面这一句我们修改下替换的顺序

| replace: 'highlighter-rouge', 'highlighter-rouge collapsible-container'

也就是最终改为这个

```html
    {% if _content contains '<div class="language-' and '<div class="content">'%}
    {% assign _content = _content
        | replace: 'highlighter-rouge', 'highlighter-rouge collapsible-container'
        | replace: '<div class="content">', '<script src="/assets/js/dist/collapsible.js"></script><div class="content">' 
    %}
    {% endif %}
```
笔者这里将collapsible.js文件移动到了/assets/js/dist/，这里看心情是否移动

这样几乎不再影响到原主题的设置

2. 默认折叠和展开的行数有点少需要调节下

修改下\assets\css\style.scss的max-height: calc(1.6em * 5)，这里5就是显示5行，如果想显示30行，就改为30就可以

然后在\assets\js\collapsible.js中同步修改

let maxLines = 30; // 设置折叠显示的行数 Maximum number of lines to display without collapsing

最后改动太多，我基本上重构了下这个js，实现了折叠后滚动，默认显示行数的问题解决，收起展开按钮显示等等

```javascript
    document.addEventListener("DOMContentLoaded", function () {
        let coll = document.getElementsByClassName("collapsible-container");
        let maxLines = 19; // 设置折叠显示的行数 Maximum number of lines to display without collapsing
        let defaultOpenLines = 30; // 默认展开的最大行数

        for (let i = 0; i < coll.length; i++) {
        let trigger = coll[i].querySelector('.collapsible-trigger');
        let content = coll[i].querySelector('.collapsible-content');
        let codeLines = (content.textContent.split('\n').length - 1) / 2; // 计算实际的代码行数
    
        console.log(codeLines)

        if (codeLines <= defaultOpenLines) {
            this.innerHTML = "收起";
            trigger.style.display = 'none'; // 隐藏触发器
            content.style.maxHeight = content.scrollHeight + "px";
        } else {
            trigger.addEventListener("click", function () { 
            // var triggerPosition = trigger.getBoundingClientRect().top; // 获取按钮当前位置
            // 切换按钮上的文字
            if (this.innerHTML.includes("展开")) {
                this.innerHTML = "收起";
            } else {
                this.innerHTML = "展开";
            }
            this.classList.toggle("active");
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
                // 滚动页面到 trigger 元素的位置
                content.scrollIntoView({
                behavior: "smooth",
                block: "center"
                });
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
            }
            });
        }
        }
    });
```

大家直接抄作业即可，修改完之后默认的效果即可在这个内容中看到，有什么问题也可以参考我对应的GitHub仓库对照修改