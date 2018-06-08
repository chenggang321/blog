**1.什么是.har文件**
https://en.wikipedia.org/wiki/.har
The HTTP Archive format (HTTP存档格式) or HAR，是一个用来记录web浏览器与站点交互的日志JSON文档格式的文件。这些文件的常用的扩展为.har。
HTTP存档格式规范，定义了HTTP事务的归档格式，Web浏览器可以使用归档格式来导出关于其加载的网页的详细性能数据。这个格式的规范由W3C组织的Web Performance Working Group提出。规范现在还是草案形式，完整规范还在进行中。

HAR 文件包含敏感数据！
* 记录时所下载网页中的内容
* 您的 Cookie（任何有 HAR 文件的人都可以使用这些 Cookie 冒用您的帐号）
* 记录时提交的所有信息：个人 详细信息、密码、信用卡号码…

在任何情况下，您都可以在下列三大主要浏览器中记录 HTTP 会话： IE、Firefox 和 Chrome 浏览器。不过，我们建议您使用 Chrome 或 Firefox。
Internet Explorer/Edge | Edge 可自行生成 HAR 文件
-- | --
Firefox | 从 Firefox 41 开始，无需任何附加扩展程序即可创建 HAR 文件。
Chrome | 在 Chrome 浏览器中，您可以使用“开发者工具”中的“Network”（网络）标签 记录 HTTP 会话。

**2.打开.har文件的方式**
1.文本编辑器：sublime text或vscode等
2.在线HAR分析器：https://toolbox.googleapps.com/apps/har_analyzer/?lang=zh-CN

**3.Chrome network开发者工具**
在Chrome开发者控制台的Network里，右键HTTP记录会有一个save as HAR content，然后会生成一个.har文件。
转换成curl命令的神器
get http://192.168.241.11:8086/user/q/province
copy link address
```
http://192.168.241.11:8086/user/q/province
```
copy request headers
```
GET /user/q/province HTTP/1.1
Host: 192.168.241.11:8086
Connection: keep-alive
Pragma: no-cache
Cache-Control: no-cache
Accept: application/json, text/plain, */*
Origin: http://localhost:3000
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.89 Safari/537.36
Referer: http://localhost:3000/access/admin
Accept-Encoding: gzip, deflate
Accept-Language: zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7
```
copy response headers
```
HTTP/1.1 200
Access-Control-Allow-Origin: http://localhost:3000
Vary: Origin
Access-Control-Allow-Credentials: true
Content-Type: application/json;charset=UTF-8
Transfer-Encoding: chunked
Date: Fri, 05 Jan 2018 02:41:52 GMT
```
copy response
```
[{"label":"安徽省","value":"p-27-82-119-27-66-67-25-100-127"},{"label":"湖北省","value":"p-26-71-106-27-116-105-25-100-127"},{"label":"山东省","value":"p-27-79-79-28-72-100-25-100-127"},{"label":"浙江省","value":"p-26-75-103-26-79-97-25-100-127"}]
```
copy as cURL(cmd 双引号)
```
curl "http://192.168.241.11:8086/user/q/province" -H "Pragma: no-cache" -H "Origin: http://localhost:3000" -H "Accept-Encoding: gzip, deflate" -H "Accept-Language: zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7" -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.89 Safari/537.36" -H "Accept: application/json, text/plain, */*" -H "Referer: http://localhost:3000/access/admin" -H "Connection: keep-alive" -H "Cache-Control: no-cache" --compressed
```
copy as cURL(bash 单引号)
```
curl 'http://192.168.241.11:8086/user/q/province' -H 'Pragma: no-cache' -H 'Origin: http://localhost:3000' -H 'Accept-Encoding: gzip, deflate' -H 'Accept-Language: zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7' -H 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.89 Safari/537.36' -H 'Accept: application/json, text/plain, */*' -H 'Referer: http://localhost:3000/access/admin' -H 'Connection: keep-alive' -H 'Cache-Control: no-cache' --compressed
```
copy all as cURL(cmd)
```
curl "http://localhost:3000/access/admin" -H "Pragma: no-cache" -H "Accept-Encoding: gzip, deflate, br" -H "Accept-Language: zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7" -H "Upgrade-Insecure-Requests: 1" -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.89 Safari/537.36" -H "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8" -H "Cache-Control: no-cache" -H "Cookie: oracle.uix=0^^^^GMT+8:00^^p; csrftoken=4HlQKS2vpxj8PEADCxbh5cCgeUWU4NczuBVAahsBUsvdhvBU3RJahyLxw1atwiAG" -H "Connection: keep-alive" --compressed &
curl "http://localhost:3000/static/js/bundle.js" -H "Pragma: no-cache" -H "Accept-Encoding: gzip, deflate, br" -H "Accept-Language: zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7" -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.89 Safari/537.36" -H "Accept: */*" -H "Referer: http://localhost:3000/access/admin" -H "Cookie: oracle.uix=0^^^^GMT+8:00^^p; csrftoken=4HlQKS2vpxj8PEADCxbh5cCgeUWU4NczuBVAahsBUsvdhvBU3RJahyLxw1atwiAG" -H "Connection: keep-alive" -H "Cache-Control: no-cache" --compressed &
curl "http://192.168.241.11:8086/user/q/user?currentPage=1^&pageSize=10^&name=^&description=^&province=^&city=" -H "Pragma: no-cache" -H "Origin: http://localhost:3000" -H "Accept-Encoding: gzip, deflate" -H "Accept-Language: zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7" -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.89 Safari/537.36" -H "Accept: application/json, text/plain, */*" -H "Referer: http://localhost:3000/access/admin" -H "Connection: keep-alive" -H "Cache-Control: no-cache" --compressed &
curl "http://192.168.241.11:8086/user/q/province" -H "Pragma: no-cache" -H "Origin: http://localhost:3000" -H "Accept-Encoding: gzip, deflate" -H "Accept-Language: zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7" -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.89 Safari/537.36" -H "Accept: application/json, text/plain, */*" -H "Referer: http://localhost:3000/access/admin" -H "Connection: keep-alive" -H "Cache-Control: no-cache" --compressed &
curl "http://192.168.241.11:8086/user/q/group" -H "Pragma: no-cache" -H "Origin: http://localhost:3000" -H "Accept-Encoding: gzip, deflate" -H "Accept-Language: zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7" -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.89 Safari/537.36" -H "Accept: application/json, text/plain, */*" -H "Referer: http://localhost:3000/access/admin" -H "Connection: keep-alive" -H "Cache-Control: no-cache" --compressed &
curl "chrome-extension://hacmcodfllhbnekmghgdlplbdnahmhmm/page.bundle.js" -H "Referer: http://localhost:3000/access/admin" -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.89 Safari/537.36" --compressed &
curl "chrome-extension://odkdoekijebogaiopbjgkgogkgifjfnk/detector.js" -H "Referer: http://localhost:3000/access/admin" -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.89 Safari/537.36" --compressed &
curl "http://localhost:3000/sockjs-node/info?t=1515120261153" -H "Pragma: no-cache" -H "Accept-Encoding: gzip, deflate, br" -H "Accept-Language: zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7" -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.89 Safari/537.36" -H "Accept: */*" -H "Referer: http://localhost:3000/access/admin" -H "Cookie: oracle.uix=0^^^^GMT+8:00^^p; csrftoken=4HlQKS2vpxj8PEADCxbh5cCgeUWU4NczuBVAahsBUsvdhvBU3RJahyLxw1atwiAG" -H "Connection: keep-alive" -H "Cache-Control: no-cache" --compressed &
curl "ws://localhost:3000/sockjs-node/011/ipjuczfo/websocket" -H "Pragma: no-cache" -H "Origin: http://localhost:3000" -H "Accept-Encoding: gzip, deflate, br" -H "Accept-Language: zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7" -H "Sec-WebSocket-Key: imdIn+1kx4HqNrnAbVXr4Q==" -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.89 Safari/537.36" -H "Upgrade: websocket" -H "Sec-WebSocket-Extensions: permessage-deflate; client_max_window_bits" -H "Cache-Control: no-cache" -H "Cookie: oracle.uix=0^^^^GMT+8:00^^p; csrftoken=4HlQKS2vpxj8PEADCxbh5cCgeUWU4NczuBVAahsBUsvdhvBU3RJahyLxw1atwiAG" -H "Connection: Upgrade" -H "Sec-WebSocket-Version: 13" --compressed
```
copy all as cURL(bash)
```
curl 'http://localhost:3000/access/admin' -H 'Pragma: no-cache' -H 'Accept-Encoding: gzip, deflate, br' -H 'Accept-Language: zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7' -H 'Upgrade-Insecure-Requests: 1' -H 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.89 Safari/537.36' -H 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8' -H 'Cache-Control: no-cache' -H 'Cookie: oracle.uix=0^^GMT+8:00^p; csrftoken=4HlQKS2vpxj8PEADCxbh5cCgeUWU4NczuBVAahsBUsvdhvBU3RJahyLxw1atwiAG' -H 'Connection: keep-alive' --compressed ;
curl 'http://localhost:3000/static/js/bundle.js' -H 'Pragma: no-cache' -H 'Accept-Encoding: gzip, deflate, br' -H 'Accept-Language: zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7' -H 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.89 Safari/537.36' -H 'Accept: */*' -H 'Referer: http://localhost:3000/access/admin' -H 'Cookie: oracle.uix=0^^GMT+8:00^p; csrftoken=4HlQKS2vpxj8PEADCxbh5cCgeUWU4NczuBVAahsBUsvdhvBU3RJahyLxw1atwiAG' -H 'Connection: keep-alive' -H 'Cache-Control: no-cache' --compressed ;
curl 'http://192.168.241.11:8086/user/q/user?currentPage=1&pageSize=10&name=&description=&province=&city=' -H 'Pragma: no-cache' -H 'Origin: http://localhost:3000' -H 'Accept-Encoding: gzip, deflate' -H 'Accept-Language: zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7' -H 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.89 Safari/537.36' -H 'Accept: application/json, text/plain, */*' -H 'Referer: http://localhost:3000/access/admin' -H 'Connection: keep-alive' -H 'Cache-Control: no-cache' --compressed ;
curl 'http://192.168.241.11:8086/user/q/province' -H 'Pragma: no-cache' -H 'Origin: http://localhost:3000' -H 'Accept-Encoding: gzip, deflate' -H 'Accept-Language: zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7' -H 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.89 Safari/537.36' -H 'Accept: application/json, text/plain, */*' -H 'Referer: http://localhost:3000/access/admin' -H 'Connection: keep-alive' -H 'Cache-Control: no-cache' --compressed ;
curl 'http://192.168.241.11:8086/user/q/group' -H 'Pragma: no-cache' -H 'Origin: http://localhost:3000' -H 'Accept-Encoding: gzip, deflate' -H 'Accept-Language: zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7' -H 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.89 Safari/537.36' -H 'Accept: application/json, text/plain, */*' -H 'Referer: http://localhost:3000/access/admin' -H 'Connection: keep-alive' -H 'Cache-Control: no-cache' --compressed ;
curl 'chrome-extension://hacmcodfllhbnekmghgdlplbdnahmhmm/page.bundle.js' -H 'Referer: http://localhost:3000/access/admin' -H 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.89 Safari/537.36' --compressed ;
curl 'chrome-extension://odkdoekijebogaiopbjgkgogkgifjfnk/detector.js' -H 'Referer: http://localhost:3000/access/admin' -H 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.89 Safari/537.36' --compressed ;
curl 'http://localhost:3000/sockjs-node/info?t=1515120261153' -H 'Pragma: no-cache' -H 'Accept-Encoding: gzip, deflate, br' -H 'Accept-Language: zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7' -H 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.89 Safari/537.36' -H 'Accept: */*' -H 'Referer: http://localhost:3000/access/admin' -H 'Cookie: oracle.uix=0^^GMT+8:00^p; csrftoken=4HlQKS2vpxj8PEADCxbh5cCgeUWU4NczuBVAahsBUsvdhvBU3RJahyLxw1atwiAG' -H 'Connection: keep-alive' -H 'Cache-Control: no-cache' --compressed ;
curl 'ws://localhost:3000/sockjs-node/011/ipjuczfo/websocket' -H 'Pragma: no-cache' -H 'Origin: http://localhost:3000' -H 'Accept-Encoding: gzip, deflate, br' -H 'Accept-Language: zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7' -H 'Sec-WebSocket-Key: imdIn+1kx4HqNrnAbVXr4Q==' -H 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.89 Safari/537.36' -H 'Upgrade: websocket' -H 'Sec-WebSocket-Extensions: permessage-deflate; client_max_window_bits' -H 'Cache-Control: no-cache' -H 'Cookie: oracle.uix=0^^GMT+8:00^p; csrftoken=4HlQKS2vpxj8PEADCxbh5cCgeUWU4NczuBVAahsBUsvdhvBU3RJahyLxw1atwiAG' -H 'Connection: Upgrade' -H 'Sec-WebSocket-Version: 13' --compressed
```
copy all as HAR
```
{
  "log": {
    "version": "1.2",
    "creator": {
      "name": "WebInspector",
      "version": "537.36"
    },
    "pages": [
      {
        "startedDateTime": "2018-01-05T02:44:12.852Z",
        "id": "page_1",
        "title": "http://localhost:3000/access/admin",
        "pageTimings": {
          "onContentLoad": 2375.7279999554157,
          "onLoad": 3020.5129999667406
        }
      }
    ],
    "entries": [
      {
        "startedDateTime": "2018-01-05T02:44:13.178Z",
        "time": 313.9559999583289,
        "request": {
          "method": "GET",
          "url": "http://localhost:3000/access/admin",
          "httpVersion": "HTTP/1.1",
          "headers": [
            {
              "name": "Pragma",
              "value": "no-cache"
            },
            {
              "name": "Accept-Encoding",
              "value": "gzip, deflate, br"
            },
            {
              "name": "Host",
              "value": "localhost:3000"
            },
            {
              "name": "Accept-Language",
              "value": "zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7"
            },
            {
              "name": "Upgrade-Insecure-Requests",
              "value": "1"
            },
            {
              "name": "User-Agent",
              "value": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.89 Safari/537.36"
            },
            {
              "name": "Accept",
              "value": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8"
            },
            {
              "name": "Cache-Control",
              "value": "no-cache"
            },
            {
              "name": "Cookie",
              "value": "oracle.uix=0^^GMT+8:00^p; csrftoken=4HlQKS2vpxj8PEADCxbh5cCgeUWU4NczuBVAahsBUsvdhvBU3RJahyLxw1atwiAG"
            },
            {
              "name": "Connection",
              "value": "keep-alive"
            }
          ],
          "queryString": [],
          "cookies": [
            {
              "name": "oracle.uix",
              "value": "0^^GMT+8:00^p",
              "expires": null,
              "httpOnly": false,
              "secure": false
            },
            {
              "name": "csrftoken",
              "value": "4HlQKS2vpxj8PEADCxbh5cCgeUWU4NczuBVAahsBUsvdhvBU3RJahyLxw1atwiAG",
              "expires": null,
              "httpOnly": false,
              "secure": false
            }
          ],
          "headersSize": 570,
          "bodySize": 0
        },
        "response": {
          "status": 200,
          "statusText": "OK",
          "httpVersion": "HTTP/1.1",
          "headers": [
            {
              "name": "Date",
              "value": "Fri, 05 Jan 2018 02:44:13 GMT"
            },
            {
              "name": "Content-Encoding",
              "value": "gzip"
            },
            {
              "name": "ETag",
              "value": "W/\"649-W8GnY7MkgPFg6/GXObpRHPnVDeU\""
            },
            {
              "name": "X-Powered-By",
              "value": "Express"
            },
            {
              "name": "Vary",
              "value": "Accept-Encoding"
            },
            {
              "name": "Content-Type",
              "value": "text/html; charset=UTF-8"
            },
            {
              "name": "Transfer-Encoding",
              "value": "chunked"
            },
            {
              "name": "Connection",
              "value": "keep-alive"
            },
            {
              "name": "Accept-Ranges",
              "value": "bytes"
            }
          ],
          "cookies": [],
          "content": {
            "size": 1609,
            "mimeType": "text/html",
            "compression": 0
          },
          "redirectURL": "",
          "headersSize": 283,
          "bodySize": 1609,
          "_transferSize": 1892
        },
        "cache": {},
        "timings": {
          "blocked": 4.77599997632206,
          "dns": 0.007999944500619804,
          "ssl": -1,
          "connect": 302.5599999818949,
          "send": 0.23600005079100583,
          "wait": 6.376000004820298,
          "receive": 0,
          "_blocked_queueing": -1
        },
        "serverIPAddress": "127.0.0.1",
        "connection": "15993",
        "pageref": "page_1"
      },
      {
        "startedDateTime": "2018-01-05T02:44:13.233Z",
        "time": 325.1755671004066,
        "request": {
          "method": "GET",
          "url": "http://localhost:3000/static/js/bundle.js",
          "httpVersion": "HTTP/1.1",
          "headers": [
            {
              "name": "Pragma",
              "value": "no-cache"
            },
            {
              "name": "Accept-Encoding",
              "value": "gzip, deflate, br"
            },
            {
              "name": "Host",
              "value": "localhost:3000"
            },
            {
              "name": "Accept-Language",
              "value": "zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7"
            },
            {
              "name": "User-Agent",
              "value": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.89 Safari/537.36"
            },
            {
              "name": "Accept",
              "value": "*/*"
            },
            {
              "name": "Referer",
              "value": "http://localhost:3000/access/admin"
            },
            {
              "name": "Cookie",
              "value": "oracle.uix=0^^GMT+8:00^p; csrftoken=4HlQKS2vpxj8PEADCxbh5cCgeUWU4NczuBVAahsBUsvdhvBU3RJahyLxw1atwiAG"
            },
            {
              "name": "Connection",
              "value": "keep-alive"
            },
            {
              "name": "Cache-Control",
              "value": "no-cache"
            }
          ],
          "queryString": [],
          "cookies": [
            {
              "name": "oracle.uix",
              "value": "0^^GMT+8:00^p",
              "expires": null,
              "httpOnly": false,
              "secure": false
            },
            {
              "name": "csrftoken",
              "value": "4HlQKS2vpxj8PEADCxbh5cCgeUWU4NczuBVAahsBUsvdhvBU3RJahyLxw1atwiAG",
              "expires": null,
              "httpOnly": false,
              "secure": false
            }
          ],
          "headersSize": 510,
          "bodySize": 0
        },
        "response": {
          "status": 200,
          "statusText": "OK",
          "httpVersion": "HTTP/1.1",
          "headers": [
            {
              "name": "Date",
              "value": "Fri, 05 Jan 2018 02:44:13 GMT"
            },
            {
              "name": "Content-Encoding",
              "value": "gzip"
            },
            {
              "name": "ETag",
              "value": "W/\"35efa6-ol6aDYxwQgQP9Cbw0TeiNfgQABc\""
            },
            {
              "name": "X-Powered-By",
              "value": "Express"
            },
            {
              "name": "Vary",
              "value": "Accept-Encoding"
            },
            {
              "name": "Content-Type",
              "value": "application/javascript; charset=UTF-8"
            },
            {
              "name": "Transfer-Encoding",
              "value": "chunked"
            },
            {
              "name": "Connection",
              "value": "keep-alive"
            },
            {
              "name": "Accept-Ranges",
              "value": "bytes"
            }
          ],
          "cookies": [],
          "content": {
            "size": 3534758,
            "mimeType": "application/javascript",
            "compression": 2878375
          },
          "redirectURL": "",
          "headersSize": 299,
          "bodySize": 656383,
          "_transferSize": 656682
        },
        "cache": {},
        "timings": {
          "blocked": 1.780567049630921,
          "dns": -1,
          "ssl": -1,
          "connect": -1,
          "send": 0.12899993453174985,
          "wait": 17.1150000533089,
          "receive": 308.15100006293505,
          "_blocked_queueing": 0.5670000100508332
        },
        "serverIPAddress": "127.0.0.1",
        "connection": "15993",
        "pageref": "page_1"
      },
      {
        "startedDateTime": "2018-01-05T02:44:15.201Z",
        "time": 1001.6365330008557,
        "request": {
          "method": "GET",
          "url": "http://192.168.241.11:8086/user/q/user?currentPage=1&pageSize=10&name=&description=&province=&city=",
          "httpVersion": "HTTP/1.1",
          "headers": [
            {
              "name": "Pragma",
              "value": "no-cache"
            },
            {
              "name": "Origin",
              "value": "http://localhost:3000"
            },
            {
              "name": "Accept-Encoding",
              "value": "gzip, deflate"
            },
            {
              "name": "Host",
              "value": "192.168.241.11:8086"
            },
            {
              "name": "Accept-Language",
              "value": "zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7"
            },
            {
              "name": "User-Agent",
              "value": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.89 Safari/537.36"
            },
            {
              "name": "Accept",
              "value": "application/json, text/plain, */*"
            },
            {
              "name": "Referer",
              "value": "http://localhost:3000/access/admin"
            },
            {
              "name": "Connection",
              "value": "keep-alive"
            },
            {
              "name": "Cache-Control",
              "value": "no-cache"
            }
          ],
          "queryString": [
            {
              "name": "currentPage",
              "value": "1"
            },
            {
              "name": "pageSize",
              "value": "10"
            },
            {
              "name": "name",
              "value": ""
            },
            {
              "name": "description",
              "value": ""
            },
            {
              "name": "province",
              "value": ""
            },
            {
              "name": "city",
              "value": ""
            }
          ],
          "cookies": [],
          "headersSize": 515,
          "bodySize": 0
        },
        "response": {
          "status": 200,
          "statusText": "",
          "httpVersion": "HTTP/1.1",
          "headers": [
            {
              "name": "Access-Control-Allow-Origin",
              "value": "http://localhost:3000"
            },
            {
              "name": "Date",
              "value": "Fri, 05 Jan 2018 02:41:52 GMT"
            },
            {
              "name": "Access-Control-Allow-Credentials",
              "value": "true"
            },
            {
              "name": "Vary",
              "value": "Origin"
            },
            {
              "name": "Transfer-Encoding",
              "value": "chunked"
            },
            {
              "name": "Content-Type",
              "value": "application/json;charset=UTF-8"
            }
          ],
          "cookies": [],
          "content": {
            "size": 1499,
            "mimeType": "application/json",
            "compression": -13
          },
          "redirectURL": "",
          "headersSize": 233,
          "bodySize": 1512,
          "_transferSize": 1745
        },
        "cache": {},
        "timings": {
          "blocked": 1.2645329622318986,
          "dns": 0.0040000304579701496,
          "ssl": -1,
          "connect": 1.1050000321120002,
          "send": 0.88199996389449,
          "wait": 37.25900000426918,
          "receive": 961.1220000078902,
          "_blocked_queueing": 0.5329999839887023
        },
        "serverIPAddress": "192.168.241.11",
        "connection": "16035",
        "pageref": "page_1"
      },
      {
        "startedDateTime": "2018-01-05T02:44:15.201Z",
        "time": 872.4824870353332,
        "request": {
          "method": "GET",
          "url": "http://192.168.241.11:8086/user/q/province",
          "httpVersion": "HTTP/1.1",
          "headers": [
            {
              "name": "Pragma",
              "value": "no-cache"
            },
            {
              "name": "Origin",
              "value": "http://localhost:3000"
            },
            {
              "name": "Accept-Encoding",
              "value": "gzip, deflate"
            },
            {
              "name": "Host",
              "value": "192.168.241.11:8086"
            },
            {
              "name": "Accept-Language",
              "value": "zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7"
            },
            {
              "name": "User-Agent",
              "value": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.89 Safari/537.36"
            },
            {
              "name": "Accept",
              "value": "application/json, text/plain, */*"
            },
            {
              "name": "Referer",
              "value": "http://localhost:3000/access/admin"
            },
            {
              "name": "Connection",
              "value": "keep-alive"
            },
            {
              "name": "Cache-Control",
              "value": "no-cache"
            }
          ],
          "queryString": [],
          "cookies": [],
          "headersSize": 458,
          "bodySize": 0
        },
        "response": {
          "status": 200,
          "statusText": "",
          "httpVersion": "HTTP/1.1",
          "headers": [
            {
              "name": "Access-Control-Allow-Origin",
              "value": "http://localhost:3000"
            },
            {
              "name": "Date",
              "value": "Fri, 05 Jan 2018 02:41:52 GMT"
            },
            {
              "name": "Access-Control-Allow-Credentials",
              "value": "true"
            },
            {
              "name": "Vary",
              "value": "Origin"
            },
            {
              "name": "Transfer-Encoding",
              "value": "chunked"
            },
            {
              "name": "Content-Type",
              "value": "application/json;charset=UTF-8"
            }
          ],
          "cookies": [],
          "content": {
            "size": 259,
            "mimeType": "application/json",
            "compression": -13
          },
          "redirectURL": "",
          "headersSize": 233,
          "bodySize": 272,
          "_transferSize": 505
        },
        "cache": {},
        "timings": {
          "blocked": 1.3564869643887534,
          "dns": 0.0040000304579699275,
          "ssl": -1,
          "connect": 1.1170000070705999,
          "send": 0.5629999795928602,
          "wait": 14.196999953128396,
          "receive": 855.2450001006946,
          "_blocked_queueing": 0.4870000993832946
        },
        "serverIPAddress": "192.168.241.11",
        "connection": "16043",
        "pageref": "page_1"
      },
      {
        "startedDateTime": "2018-01-05T02:44:15.202Z",
        "time": 678.0735000463901,
        "request": {
          "method": "GET",
          "url": "http://192.168.241.11:8086/user/q/group",
          "httpVersion": "HTTP/1.1",
          "headers": [
            {
              "name": "Pragma",
              "value": "no-cache"
            },
            {
              "name": "Origin",
              "value": "http://localhost:3000"
            },
            {
              "name": "Accept-Encoding",
              "value": "gzip, deflate"
            },
            {
              "name": "Host",
              "value": "192.168.241.11:8086"
            },
            {
              "name": "Accept-Language",
              "value": "zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7"
            },
            {
              "name": "User-Agent",
              "value": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.89 Safari/537.36"
            },
            {
              "name": "Accept",
              "value": "application/json, text/plain, */*"
            },
            {
              "name": "Referer",
              "value": "http://localhost:3000/access/admin"
            },
            {
              "name": "Connection",
              "value": "keep-alive"
            },
            {
              "name": "Cache-Control",
              "value": "no-cache"
            }
          ],
          "queryString": [],
          "cookies": [],
          "headersSize": 455,
          "bodySize": 0
        },
        "response": {
          "status": 200,
          "statusText": "",
          "httpVersion": "HTTP/1.1",
          "headers": [
            {
              "name": "Access-Control-Allow-Origin",
              "value": "http://localhost:3000"
            },
            {
              "name": "Date",
              "value": "Fri, 05 Jan 2018 02:41:52 GMT"
            },
            {
              "name": "Access-Control-Allow-Credentials",
              "value": "true"
            },
            {
              "name": "Vary",
              "value": "Origin"
            },
            {
              "name": "Transfer-Encoding",
              "value": "chunked"
            },
            {
              "name": "Content-Type",
              "value": "application/json;charset=UTF-8"
            }
          ],
          "cookies": [],
          "content": {
            "size": 1467,
            "mimeType": "application/json",
            "compression": -13
          },
          "redirectURL": "",
          "headersSize": 233,
          "bodySize": 1480,
          "_transferSize": 1713
        },
        "cache": {},
        "timings": {
          "blocked": 1.5155000108061312,
          "dns": 0.0040000304579799195,
          "ssl": -1,
          "connect": 0.8340000640600997,
          "send": 0.35200000274926024,
          "wait": 12.596999993547797,
          "receive": 662.7709999447688,
          "_blocked_queueing": 0.49999996554106474
        },
        "serverIPAddress": "192.168.241.11",
        "connection": "16047",
        "pageref": "page_1"
      },
      {
        "startedDateTime": "2018-01-05T02:44:21.154Z",
        "time": 1129.5895279969554,
        "request": {
          "method": "GET",
          "url": "http://localhost:3000/sockjs-node/info?t=1515120261153",
          "httpVersion": "HTTP/1.1",
          "headers": [
            {
              "name": "Pragma",
              "value": "no-cache"
            },
            {
              "name": "Accept-Encoding",
              "value": "gzip, deflate, br"
            },
            {
              "name": "Host",
              "value": "localhost:3000"
            },
            {
              "name": "Accept-Language",
              "value": "zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7"
            },
            {
              "name": "User-Agent",
              "value": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.89 Safari/537.36"
            },
            {
              "name": "Accept",
              "value": "*/*"
            },
            {
              "name": "Referer",
              "value": "http://localhost:3000/access/admin"
            },
            {
              "name": "Cookie",
              "value": "oracle.uix=0^^GMT+8:00^p; csrftoken=4HlQKS2vpxj8PEADCxbh5cCgeUWU4NczuBVAahsBUsvdhvBU3RJahyLxw1atwiAG"
            },
            {
              "name": "Connection",
              "value": "keep-alive"
            },
            {
              "name": "Cache-Control",
              "value": "no-cache"
            }
          ],
          "queryString": [
            {
              "name": "t",
              "value": "1515120261153"
            }
          ],
          "cookies": [
            {
              "name": "oracle.uix",
              "value": "0^^GMT+8:00^p",
              "expires": null,
              "httpOnly": false,
              "secure": false
            },
            {
              "name": "csrftoken",
              "value": "4HlQKS2vpxj8PEADCxbh5cCgeUWU4NczuBVAahsBUsvdhvBU3RJahyLxw1atwiAG",
              "expires": null,
              "httpOnly": false,
              "secure": false
            }
          ],
          "headersSize": 523,
          "bodySize": 0
        },
        "response": {
          "status": 200,
          "statusText": "OK",
          "httpVersion": "HTTP/1.1",
          "headers": [
            {
              "name": "Access-Control-Allow-Origin",
              "value": "*"
            },
            {
              "name": "Date",
              "value": "Fri, 05 Jan 2018 02:44:21 GMT"
            },
            {
              "name": "Cache-Control",
              "value": "no-store, no-cache, no-transform, must-revalidate, max-age=0"
            },
            {
              "name": "Vary",
              "value": "Origin"
            },
            {
              "name": "Connection",
              "value": "keep-alive"
            },
            {
              "name": "Transfer-Encoding",
              "value": "chunked"
            },
            {
              "name": "Content-Type",
              "value": "application/json; charset=UTF-8"
            }
          ],
          "cookies": [],
          "content": {
            "size": 79,
            "mimeType": "application/json",
            "compression": -11
          },
          "redirectURL": "",
          "headersSize": 278,
          "bodySize": 90,
          "_transferSize": 368
        },
        "cache": {},
        "timings": {
          "blocked": 1.1785280059557415,
          "dns": -1,
          "ssl": -1,
          "connect": -1,
          "send": 0.10599999222904,
          "wait": 0.9609999833628573,
          "receive": 1129.3440000154078,
          "_blocked_queueing": 0.5280000623315573
        },
        "serverIPAddress": "127.0.0.1",
        "connection": "16012",
        "pageref": "page_1"
      }
    ]
  }
}
```
如何对比上述cmd和bashcurl代码的异同？
git中这样使用 >456代表不同的地方。
diff a.txt b.txt -y -W 50 


Amazing：cmd的curl命令是双引号，bash的命令时单引号。