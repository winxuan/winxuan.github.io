---
title: giscus评论区出现：An error occurred URI_TOO_LONG
date: 2024-1-9 06:00:00 +0800
categories: [Blog, Build]
tags: [blog]
---

配置完成giscus，将新文章推送到GitHub后，偶现在评论位置未出现评论，而是出现了报错的信息如下：

```
An error occurred
URI_TOO_LONG
```

解决办法非常简单，直接修改文章对应的md文件的文件名，推送到GitHub即可

原理上对于GitHub等版本管理软件来说，修改文件名=删除文件+新建文件 ，这时候之前通过md生成的html文件就相当于重新生成了。这里注意直接修改文件内容并不会生效，只有修改文件名才会生效。