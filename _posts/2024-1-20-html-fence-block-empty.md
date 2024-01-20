---
title: GitHub pages代码围栏块写入html显示为空问题解决
date: 2024-1-20 18:00:00 +0800
categories: [Blog, Build]
tags: [blog]
---

## 问题出现

笔者在使用GitHub pages的md文件进行编辑过程中，贴了一些html的代码，结果在打包后，出现了html代码块空白的问题，类似如下效果

```
{% if _content contains '<div class="language-' and '<div class="post-content">'%}
    {% assign _content = _content
        | replace: '<div class="language-', '<div class="collapsible-container language-'
        | replace: '<div class="post-content">', '<script src="/assets/js/collapsible.js"></script><div class="post-content">' %}
        {% endif %}
```

实际上我在代码块中写的是如下html代码

![截图](/assets/image/2024/1/20240120201026.png)

也就是说如果在md规定的代码段中写html相关的代码，会被浏览器误以为是需要执行的html代码

## 解决过程

于是询问了ChatGPT相关问题，GPT建议是在html代码前后加入标记{% raw %}{% endraw %}，如下图所示

![截图](/assets/image/2024/1/20240120201426.png)

于是html代码围栏就会正常显示

```
{% raw %}
{% if _content contains '<div class="language-' and '<div class="post-content">'%}
    {% assign _content = _content
        | replace: '<div class="language-', '<div class="collapsible-container language-'
        | replace: '<div class="post-content">', '<script src="/assets/js/collapsible.js"></script><div class="post-content">' %}
        {% endif %}
{% endraw %}
```

原理是这些标记的主要作用是告诉模板引擎在 {% raw %} 和 {% endraw %} 之间的内容应该被视为原始数据，不应该进行任何处理或解析，这样，读者可以看到实际的模板代码，而不是代码执行后的输出。