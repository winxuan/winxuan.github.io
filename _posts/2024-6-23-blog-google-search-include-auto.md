---
title: Google搜索收录Github Pages 自动化(Blog可以被Google搜索到)
date: 2024-6-23 00:00:00 +0800
categories: [Blog, Build]
tags: [blog]
---

笔者之前有文章提到过如何将自己使用Github Pages创建的blog加入到Google搜索结果，相信试用过之后都会发现一个最基本的问题，那就是如果写了新文章之后，还需要手动导出一次网站地图然后提交，并且还要等很久才能加入到谷歌搜索结果中。

## 网站地图vs直接添加索引

笔者在实际使用过程中发现，实际上如果提交网站地图，速度会比直接在Google搜索中添加索引慢非常多，如下图所示：

![截图](/assets/image/2024/6/20240623011410.png)

笔者在很久之前就将网站地图提交，同时也在索引中手动添加了几个网站，直接添加索引到Google，大概3天左右Google搜索中就出现了数据，而添加网站地图之后，笔者等了2周还是没有结果，所以相对于添加网站地图来说，最好的方式莫过于直接添加索引快很多。

## 创建配置API权限

Google search有对应的API，该API可以实现向Google search中添加索引。

[Google Search Console API](https://developers.google.com/webmaster-tools/v1/api_reference_index?hl=zh-cn)

![截图](/assets/image/2024/6/20240623012100.png)

想要使用这个API，一共分为三个步骤，创建服务账户，拿到密钥，将Google Search Console资源与服务账户关联

1. 创建服务账户

    访问[ Google API Console](https://console.cloud.google.com/apis/credentials/consent?hl=zh-cn&project=our-hull-257713)

    如下图所示，点 凭据-管理服务账号

    ![截图](/assets/image/2024/6/20240625051759.png)

    跳转到如下图，再点击创建服务账号

    ![截图](/assets/image/2024/6/20240625052024.png)

    填写相关信息即可，注意第二步中选择owner

    ![截图](/assets/image/2024/6/20240625052138.png)

    ![截图](/assets/image/2024/6/20240625052217.png)

    完成后则跳转到服务账号的界面

    ![截图](/assets/image/2024/6/20240625052408.png)

2. 创建和获取密钥

    接上图中服务账户位置，选择三个竖点后点管理密钥

    ![截图](/assets/image/2024/6/20240625052606.png)

    跳转到密钥界面，点添加密钥，选择创建新密钥，

    ![截图](/assets/image/2024/6/20240625052718.png)

    这里密钥类型选择json格式，并点创建

    ![截图](/assets/image/2024/6/20240625052852.png)

    创建好之后，会自动下载一个json文件到你的电脑，这个json文件里面就是私钥，妥善保管好这个私钥

    ![截图](/assets/image/2024/6/20240625053004.png)
    
3. 将Google Search Console资源与服务账户关联

    首先进入到自己的[Google Search Console](https://search.google.com/search-console?utm_source=about-page)页面

    如下图所示，点设置-用户和权限

    ![截图](/assets/image/2024/6/20240625053432.png)

    点添加用户，邮箱就是刚刚创建的服务账户中生成的邮箱，权限选拥有者即可

    ![截图](/assets/image/2024/6/20240625053516.png)

以上就是创建设置和关联API权限的整个过程

## demo验证

拿到之后，即可开始使用API，这里我们首先使用postman简单尝试下：

首先回到最开始的[Google Search Console API](https://developers.google.com/webmaster-tools/v1/api_reference_index?hl=zh-cn)‘

这里笔者选择如下图所示[搜索 Google Analytics（分析）](https://developers.google.com/webmaster-tools/v1/api_reference_index?hl=zh-cn#Search_analytics)

![截图](/assets/image/2024/6/20240625054314.png)

步骤共分为2步，首先使用刚刚自动下载的json私钥向谷歌获取token，配置token使用postman通过API拿到数据

1. 使用python脚本通过json私钥创建一个token

    首先通过pip安装必要的库

    ```
    pip install google-auth google-auth-oauthlib google-auth-httplib2
    ```

    然后使用如下脚本，需要手动配置下json私钥的路径和你自己的代理，这里笔者的json路径放在脚本同目录，并且对应代理在socks5://192.168.50.113:1080

    ```python
    import json
    from google.oauth2 import service_account
    from google.auth.transport.requests import Request
    import requests

    def generate_access_token(service_account_file, scopes, proxies):
        try:
            # 创建一个会话
            session = requests.Session()
            session.proxies.update(proxies)

            # 读取服务账号JSON文件
            with open(service_account_file, 'r') as f:
                credentials_info = json.load(f)

            credentials = service_account.Credentials.from_service_account_info(
                credentials_info, scopes=scopes)

            # 确保凭证是有效的
            credentials.refresh(Request(session=session))

            # 生成token
            access_token = credentials.token

            return access_token
        except json.JSONDecodeError as e:
            print(f"JSONDecodeError: {e}")
            print("Please check if the service account file contains valid JSON.")
        except Exception as e:
            print(f"An error occurred: {e}")

    def main():
        # 服务账号JSON文件的路径
        service_account_file = 'xxxxx.json'
        
        # 定义所需的作用域，这里是完全访问（允许读取和修改）
        scopes = ['https://www.googleapis.com/auth/webmasters']

        # 定义socks5代理
        proxies = {
            'http': 'socks5://192.168.50.113:1080',
            'https': 'socks5://192.168.50.113:1080'
        }

        # 生成access_token
        access_token = generate_access_token(service_account_file, scopes, proxies)

        if access_token:
            print(f"Generated Access Token: {access_token}")
            print("You can now use this access token to make API calls.")

    if __name__ == '__main__':
        main()
    ```

    运行脚本后，可以生成一个token，可以在Postman或其他HTTP客户端中使用

2. postman中测试

    1. 选择 HTTP 方法为 POST，输入 URL:

        这里笔者的网站地址是winxuan.github.io，自己替换下就好
        ```
        https://www.googleapis.com/webmasters/v3/sites/https%3A%2F%2Fwinxuan.github.io%2F/searchAnalytics/query
        ```
        
    2. 在 "Authorization" 选项卡中,选择类型为 "Bearer Token"，输入1中获取的access_token
    3. "Body" 选项卡，选择 "raw" 并将格式设置为 JSON，输入以下 JSON 数据(可以根据需要调整日期和维度):

        ```json
        {
            "startDate": "2024-05-25",
            "endDate": "2024-06-25",
            "dimensions": ["country", "device"]
        }
        ```
    4. 如果需要使用vpn，记得设置下postman的vpn
        
        位置在，设置--Proxy--Use Custom Proxy Configuration--Proxy Server，输入地址和端口即可
    
    完成以上设置，send之后即可看到结果

    ![截图](/assets/image/2024/6/20240625071732.png)

## 配置自动化脚本

为了实现我们写完一篇文章之后，能自动推送到Google搜索的索引，需要设计一个自动化的方案：

笔者这里设计了一个简单的自动化方案参考

1. 获取需要推送的网址；
    
    笔者希望脚本能通过网站，生成网站地图，和之前的网站地图对比，查找到新增的网址

2. 获取token

    笔者已经在上文给出demo脚本，可以自动化的获取token

3. 检查是否需要推送

    推送前最好检查下是否需要推送网址，对应的API是

    ```
    POST https://searchconsole.googleapis.com/v1/urlInspection/index:inspect
    {
        "inspectionUrl": "https://winxuan.github.io/posts/gpt-api-function-call/",
        "siteUrl": "https://winxuan.github.io/",
        "languageCode": "zh-cn"
    }
    ```

    分别有以下几种状态

    1. 已提交，且已编入索引

        查找的网站已经编入索引状态；

        如笔者这里查找了自己已经进入索引状态的网址的结果如下

        ```json
        {
            "inspectionResult": {
                "inspectionResultLink": "",
                "indexStatusResult": {
                    "verdict": "PASS",
                    "coverageState": "已提交，且已编入索引",
                    "robotsTxtState": "ALLOWED",
                    "indexingState": "INDEXING_ALLOWED",
                    "lastCrawlTime": "2024-06-21T09:55:37Z",
                    "pageFetchState": "SUCCESSFUL",
                    "googleCanonical": "https://winxuan.github.io/posts/gpt-api-function-call/",
                    "userCanonical": "https://winxuan.github.io/posts/gpt-api-function-call/",
                    "referringUrls": [
                        "https://winxuan.github.io/plan/"
                    ],
                    "crawledAs": "MOBILE"
                },
                "mobileUsabilityResult": {
                    "verdict": "VERDICT_UNSPECIFIED"
                }
            }
        }
        ```

    2. Google 无法识别此网址

        查找的网站从未进入到Google搜索中，

        如笔者这里以自己为配置过索引的网址举例

        ```json
        {
            "inspectionResult": {
                "inspectionResultLink": "",
                "indexStatusResult": {
                    "verdict": "NEUTRAL",
                    "coverageState": "Google 无法识别此网址",
                    "robotsTxtState": "ROBOTS_TXT_STATE_UNSPECIFIED",
                    "indexingState": "INDEXING_STATE_UNSPECIFIED",
                    "pageFetchState": "PAGE_FETCH_STATE_UNSPECIFIED"
                },
                "mobileUsabilityResult": {
                    "verdict": "VERDICT_UNSPECIFIED"
                }
            }
        }
        ```
    
4. 推送需要索引的地址

    推送有两种，一种是推送网站索引地图（效果不好），一种是直接推送索引（相对较好），笔者建议是使用直接推送索引的方式，对应的API是

    ```
    PUT https://www.googleapis.com/webmasters/v3/sites/siteUrl
    ```

    这里笔者以自己想要推送的一个地址举例

    方法选择put，然后内容填下面这个，注意这里siteUrl被替换成了笔者经过编码后的网址，也就是替换/后的https://winxuan.github.io/posts/chatgpt-azure-openai-preface

    ```
    https://www.googleapis.com/webmasters/v3/sites/https%3A%2F%2Fwinxuan.github.io%2Fposts%2Fchatgpt-azure-openai-preface
    ```

    这里会返回的是一个204 no content，返回内容为空，则证明成功的推送上去了

    ![截图](/assets/image/2024/6/20240625075440.png)

