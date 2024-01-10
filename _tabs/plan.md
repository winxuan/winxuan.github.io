---
# the default layout is 'page'
icon: fa-solid fa-check
order: -1
title: Plan
---

<!-- ![西部点子王](/assets/image/dutch.png) -->
<img src="/assets/image/dutch.png" alt="西部点子王" style="clip-path: inset(0% 0% 0% 0%); width: 100%; max-width: 100%; position: relative; left: -1%; margin-top: -14%;" />


<button onclick="openAllDetails()">展开所有</button>
<button onclick="closeAllDetails()">关闭所有</button>

# 🧐**AIGC相关**🧐
   <details open> 
    <summary><b>1. 吴恩达Prompt工程指南系列</b></summary>
    <div style="margin-left: 40px !important;">
        <details> <summary>课程学习</summary>
        <div style="margin-left: 40px !important;">
        1. ✅ <a href="https://winxuan.github.io/posts/chatgpt-clear-specific/" target="_blank">写好ChatGPT提示词之：清晰且具体（clear & specific）</a> <br />
        2. ✅ <a href="https://winxuan.github.io/posts/chatgpt-more-think/" target="_blank">写好ChatGPT提示词之：消耗更多步骤（算力换准确度）</a> <br />
        3. 🔜 <a href="https://winxuan.github.io/posts/chatgpt-Iterate/" target="_blank">写好ChatGPT提示词之：prompt的迭代（Iterate）</a> <br />
        4. 写好ChatGPT提示词之：文本概括（Summarizing）
        5. 写好ChatGPT提示词之：文本推断（Inferring）
        6. 写好ChatGPT提示词之：文本转换（Transforming）
        7. 写好ChatGPT提示词之：文本扩展（Expanding）
        8. 写好ChatGPT提示词之：聊天机器人（Chatbot）
        参考资料：https://xiniushu.com/
        </div>
        </details>
    </div>
   </details>

   <details open> 
    <summary><b>2. GPT工具开发系列</b></summary>
    <div style="margin-left: 40px !important;">
        1. ✅ <a href="https://winxuan.github.io/posts/gpt-api/" target="_blank">如何调用GPT API（python）</a> <br />
        2. ✅ <a href="https://winxuan.github.io/posts/gpt-api-function-call/" target="_blank">GPT API 调用本地函数（function call）</a> <br />
        3. 🔜 <a href="https://winxuan.github.io/posts/introduction-ai-programming/" target="_blank">面向AI框架编程--引言&简介</a> <br />
    </div>
   </details>

******
# 🧐**基础技术相关**🧐
   <details open> 
    <summary><b>1. 自建个人独立blog站系列</b></summary>
    <div style="margin-left: 40px !important;">
        1. ✅ <a href="https://winxuan.github.io/posts/creat-blog/" target="_blank">使用github pages+jekyll快速搭建个人blog</a> <br />
        <details> <summary>搭建小配置记录</summary>
        <div style="margin-left: 40px !important;">
                1. 🔜 <a href="https://winxuan.github.io/posts/fenced-code-blocks-indentation/" target="_blank">chirpy主题围栏代码块（Fenced Code Blocks）缩进功能添加</a> <br />
                2. ✅ <a href="https://winxuan.github.io/posts/config-blog-comment/" target="_blank">使用giscus配置GitHub Pages评论功能</a> <br />
                3. ✅ <a href="https://winxuan.github.io/posts/add-google-analytics/" target="_blank">使用Google Analysis监听GitHub pages页面访问量</a> <br />
                4. 使用python脚本自动获取GitHub pages页面访问量 <br />
                5. GitHub Pages添加CDN服务（加速国内访问1）<br />
                6. 使用GitHub+jsDelivr自建图床（加速国内访问2） <br />
        </div>
        </details>
        <details> <summary>搭建小问题解决记录</summary>
        <div style="margin-left: 40px !important;">
                1. ✅ <a href="https://winxuan.github.io/posts/blog-giscus-url/" target="_blank">giscus评论区出现：An error occurred URI_TOO_LONG</a> <br />
                2. GitHub Actions出错--Build Failure with Ruby 3.x问题解决
                3. 本地环境init配置国内镜像
        </div>
        </details>
    </div>
   </details>

   <details open> 
    <summary><b>2. go语言系列</b></summary>
    <div style="margin-left: 40px !important;">
        <details> <summary>go语言基础</summary>
        <div style="margin-left: 40px !important;">
            1. 搭建go语言开发环境 <br />
            2. go 基础语法 <br />
            3. go 高级特性 <br />
        </div>
        </details>
        <details> <summary>gin 框架</summary>
        <div style="margin-left: 40px !important;">
            1. gin 框架基础学习 <br />
        </div>
        </details>
    </div>
   </details>

   <details open> 
    <summary><b>3. python语言系列</b></summary>
    <div style="margin-left: 40px !important;">
        <details> <summary>python语言基础</summary>
        <div style="margin-left: 40px !important;">
            1. 搭建python语言开发环境 <br />
            2. python 基础语法 <br />
            3. python 高级特性 <br />
        </div>
        </details>
        <details> <summary>Flask 框架</summary>
        <div style="margin-left: 40px !important;">
            1. Flask 框架基础学习 <br />
        </div>
        </details>
    </div>
   </details>

******

# 🧐**unity相关**🧐

******

# 🤓**测试开发相关**🤓

******

# 🤓**测试相关**🤓

******

# 🤗**读书笔记**🤗

******

# 🤗**日常随笔**🤗

******

# 🤗**英语学习**🤗

<!-- <div style="position: fixed; bottom: 0; right: 0;">
    <img src="/assets/image/ArthurMorgan.png" alt="描述" style="width: 200px; height: auto;" />
</div>
 -->

<script>
function openAllDetails() {
    document.querySelectorAll('details').forEach((detail) => {
        detail.setAttribute('open', '');
    });
}

function closeAllDetails() {
    document.querySelectorAll('details').forEach((detail) => {
        detail.removeAttribute('open');
    });
}
</script>