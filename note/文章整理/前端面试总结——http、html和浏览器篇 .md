---
date: 2021-03-04 14:30
title: 前端面试总结——http、html和浏览器篇 
categories:
  - javascript
tags:
  - 前端
  - JavaScript
---

 ### 1.http和https

 **_https的SSL加密是在传输层实现的。_**

 #### (1)http和https的基本概念

 http: 超文本传输协议，是互联网上应用最为广泛的一种网络协议，是一个客户端和服务器端请求和应答的标准（TCP），用于从WWW服务器传输超文本到本地浏览器的传输协议，它可以使浏览器更加高效，使网络传输减少。

 https: 是以安全为目标的HTTP通道，简单讲是HTTP的安全版，即HTTP下加入SSL层，HTTPS的安全基础是SSL，因此加密的详细内容就需要SSL。

 https协议的主要作用是：建立一个信息安全通道，来确保数组的传输，确保网站的真实性。

 #### (2)http和https的区别？

 http传输的数据都是未加密的，也就是明文的，网景公司设置了SSL协议来对http协议传输的数据进行加密处理，简单来说https协议是由http和ssl协议构建的可进行加密传输和身份认证的网络协议，比http协议的安全性更高。  
 主要的区别如下：

 * Https协议需要ca证书，费用较高。
 * http是超文本传输协议，信息是明文传输，https则是具有安全性的ssl加密传输协议。
 * 使用不同的链接方式，端口也不同，一般而言，http协议的端口为80，https的端口为443
 * http的连接很简单，是无状态的；HTTPS协议是由SSL+HTTP协议构建的可进行加密传输、身份认证的网络协议，比http协议安全。

 #### (3)https协议的工作原理

 客户端在使用HTTPS方式与Web服务器通信时有以下几个步骤，如图所示。

 * 客户使用https url访问服务器，则要求web 服务器建立ssl链接。
 * web服务器接收到客户端的请求之后，会将网站的证书（证书中包含了公钥），返回或者说传输给客户端。
 * 客户端和web服务器端开始协商SSL链接的安全等级，也就是加密等级。
 * 客户端浏览器通过双方协商一致的安全等级，建立会话密钥，然后通过网站的公钥来加密会话密钥，并传送给网站。
 * web服务器通过自己的私钥解密出会话密钥。
 * web服务器通过会话密钥加密与客户端之间的通信。

 #### (4)https协议的优点

 * 使用HTTPS协议可认证用户和服务器，确保数据发送到正确的客户机和服务器；
 * HTTPS协议是由SSL+HTTP协议构建的可进行加密传输、身份认证的网络协议，要比http协议安全，可防止数据在传输过程中不被窃取、改变，确保数据的完整性。
 * HTTPS是现行架构下最安全的解决方案，虽然不是绝对安全，但它大幅增加了中间人攻击的成本。
 * 谷歌曾在2014年8月份调整搜索引擎算法，并称“比起同等HTTP网站，采用HTTPS加密的网站在搜索结果中的排名将会更高”。

 #### (5)https协议的缺点

 * https握手阶段比较费时，会使页面加载时间延长50%，增加10%~20%的耗电。
 * https缓存不如http高效，会增加数据开销。
 * SSL证书也需要钱，功能越强大的证书费用越高。
 * SSL证书需要绑定IP，不能再同一个ip上绑定多个域名，ipv4资源支持不了这种消耗。

 ### 2.tcp三次握手，一句话概括

 **_客户端和服务端都需要直到各自可收发，因此需要三次握手。_**

 简化三次握手：![2018-07-10 3 42 11](https://user-images.githubusercontent.com/17233651/42496289-1c6d668a-8458-11e8-98b3-65db50f64d48.png)


 从图片可以得到三次握手可以简化为：C发起请求连接S确认，也发起连接C确认我们再看看每次握手的作用：第一次握手：S只可以确认 自己可以接受C发送的报文段第二次握手：C可以确认 S收到了自己发送的报文段，并且可以确认 自己可以接受S发送的报文段第三次握手：S可以确认 C收到了自己发送的报文段

 ### 3.TCP和UDP的区别

 （1）TCP是面向连接的，udp是无连接的即发送数据前不需要先建立链接。

 （2）TCP提供可靠的服务。也就是说，通过TCP连接传送的数据，无差错，不丢失，不重复，且按序到达;UDP尽最大努力交付，即不保证可靠交付。 并且因为tcp可靠，面向连接，不会丢失数据因此适合大数据量的交换。

 （3）TCP是面向字节流，UDP面向报文，并且网络出现拥塞不会使得发送速率降低（因此会出现丢包，对实时的应用比如IP电话和视频会议等）。

 （4）TCP只能是1对1的，UDP支持1对1,1对多。

 （5）TCP的首部较大为20字节，而UDP只有8字节。

 （6）TCP是面向连接的可靠性传输，而UDP是不可靠的。

 ### 4.WebSocket的实现和应用

 #### (1)什么是WebSocket?

 WebSocket是HTML5中的协议，支持持久连续，http协议不支持持久性连接。Http1.0和HTTP1.1都不支持持久性的链接，HTTP1.1中的keep-alive，将多个http请求合并为1个

 #### (2)WebSocket是什么样的协议，具体有什么优点？

 * HTTP的生命周期通过Request来界定，也就是Request一个Response，那么在Http1.0协议中，这次Http请求就结束了。在Http1.1中进行了改进，是的有一个connection：Keep-alive，也就是说，在一个Http连接中，可以发送多个Request，接收多个Response。但是必须记住，在Http中一个Request只能对应有一个Response，而且这个Response是被动的，不能主动发起。
 * WebSocket是基于Http协议的，或者说借用了Http协议来完成一部分握手，在握手阶段与Http是相同的。我们来看一个websocket握手协议的实现，基本是2个属性，upgrade，connection。

 基本请求如下：


 ```
 GET /chat HTTP/1.1
 Host: server.example.com
 Upgrade: websocket
 Connection: Upgrade
 Sec-WebSocket-Key: x3JJHMbDL1EzLkh9GBhXDw==
 Sec-WebSocket-Protocol: chat, superchat
 Sec-WebSocket-Version: 13
 Origin: http://example.com
 ```


 多了下面2个属性：


 ```
 Upgrade:webSocket
 Connection:Upgrade
 告诉服务器发送的是websocket
 Sec-WebSocket-Key: x3JJHMbDL1EzLkh9GBhXDw==
 Sec-WebSocket-Protocol: chat, superchat
 Sec-WebSocket-Version: 13
 ```


 ### 5.HTTP请求的方式，HEAD方式

 * head：类似于get请求，只不过返回的响应中没有具体的内容，用户获取报头
 * options：允许客户端查看服务器的性能，比如说服务器支持的请求方式等等。

 ### 6.一个图片url访问后直接下载怎样实现？

 请求的返回头里面，用于浏览器解析的重要参数就是OSS的API文档里面的返回http头，决定用户下载行为的参数。

 下载的情况下：


 ```
 1. x-oss-object-type:
          Normal
   2. x-oss-request-id:
          598D5ED34F29D01FE2925F41
   3. x-oss-storage-class:
          Standard
 ```


 ### 7.web Quality （无障碍）

 能够被残障人士使用的网站才能称得上一个易用的（易访问的）网站。  
 残障人士指的是那些带有残疾或者身体不健康的用户。

 使用alt属性：


 ```
 <img src="person.jpg"  alt="this is a person"/>
 ```


 有时候浏览器会无法显示图像。具体的原因有：

 * 用户关闭了图像显示
 * 浏览器是不支持图形显示的迷你浏览器
 * 浏览器是语音浏览器（供盲人和弱视人群使用）  

     如果您使用了 alt 属性，那么浏览器至少可以显示或读出有关图像的描述。


 ### 8.几个很实用的BOM属性对象方法?

 什么是Bom? Bom是浏览器对象。有哪些常用的Bom属性呢？

 #### (1)location对象

 location.href-- 返回或设置当前文档的URL  
 location.search – 返回URL中的查询字符串部分。例如 http://www.dreamdu.com/dreamdu.php?id=5&name=dreamdu 返回包括(?)后面的内容?id=5&name=dreamdu  
 location.hash – 返回URL#后面的内容，如果没有#，返回空  
 location.host – 返回URL中的域名部分，例如www.dreamdu.com  
 location.hostname – 返回URL中的主域名部分，例如dreamdu.com  
 location.pathname – 返回URL的域名后的部分。例如 http://www.dreamdu.com/xhtml/ 返回/xhtml/  
 location.port – 返回URL中的端口部分。例如 http://www.dreamdu.com:8080/xhtml/ 返回8080  
 location.protocol – 返回URL中的协议部分。例如 http://www.dreamdu.com:8080/xhtml/ 返回(//)前面的内容http:  
 location.assign – 设置当前文档的URL  
 location.replace() – 设置当前文档的URL，并且在history对象的地址列表中移除这个URL location.replace(url);  
 location.reload() – 重载当前页面

 #### (2)history对象

 history.go() – 前进或后退指定的页面数 history.go(num);  
 history.back() – 后退一页  
 history.forward() – 前进一页

 #### (3)Navigator对象

 navigator.userAgent – 返回用户代理头的字符串表示(就是包括浏览器版本信息等的字符串)  
 navigator.cookieEnabled – 返回浏览器是否支持(启用)cookie

 ### 9.HTML5 drag api

 * dragstart：事件主体是被拖放元素，在开始拖放被拖放元素时触发，。
 * darg：事件主体是被拖放元素，在正在拖放被拖放元素时触发。
 * dragenter：事件主体是目标元素，在被拖放元素进入某元素时触发。
 * dragover：事件主体是目标元素，在被拖放在某元素内移动时触发。
 * dragleave：事件主体是目标元素，在被拖放元素移出目标元素是触发。
 * drop：事件主体是目标元素，在目标元素完全接受被拖放元素时触发。
 * dragend：事件主体是被拖放元素，在整个拖放操作结束时触发

 ### 10.http2.0

 首先补充一下，http和https的区别，相比于http,https是基于ssl加密的http协议  
 简要概括：http2.0是基于1999年发布的http1.0之后的首次更新。

 * 提升访问速度（可以对于，请求资源所需时间更少，访问速度更快，相比http1.0）
 * 允许多路复用：多路复用允许同时通过单一的HTTP/2连接发送多重请求-响应信息。改善了：在http1.1中，浏览器客户端在同一时间，针对同一域名下的请求有一定数量限制（连接数量），超过限制会被阻塞。
 * 二进制分帧：HTTP2.0会将所有的传输信息分割为更小的信息或者帧，并对他们进行二进制编码
 * 首部压缩
 * 服务器端推送

 ### 11.补充400和401、403状态码

 #### (1)400状态码：请求无效

 产生原因：

 * 前端提交数据的字段名称和字段类型与后台的实体没有保持一致
 * 前端提交到后台的数据应该是json字符串类型，但是前端没有将对象JSON.stringify转化成字符串。

 解决方法：

 * 对照字段的名称，保持一致性
 * 将obj对象通过JSON.stringify实现序列化

 #### (2)401状态码：当前请求需要用户验证

 #### (3)403状态码：服务器已经得到请求，但是拒绝执行

 ### 12.fetch发送2次请求的原因

 **_fetch发送post请求的时候，总是发送2次，第一次状态码是204，第二次才成功？_**

 原因很简单，因为你用fetch的post请求的时候，导致fetch 第一次发送了一个Options请求，询问服务器是否支持修改的请求头，如果服务器支持，则在第二次中发送真正的请求。

 ### 13.Cookie、sessionStorage、localStorage的区别

 共同点：都是保存在浏览器端，并且是同源的

 * Cookie：cookie数据始终在同源的http请求中携带（即使不需要），即cookie在浏览器和服务器间来回传递。而sessionStorage和localStorage不会自动把数据发给服务器，仅在本地保存。cookie数据还有路径（path）的概念，可以限制cookie只属于某个路径下,存储的大小很小只有4K左右。 （key：可以在浏览器和服务器端来回传递，存储容量小，只有大约4K左右）
 * sessionStorage：仅在当前浏览器窗口关闭前有效，自然也就不可能持久保持，localStorage：始终有效，窗口或浏览器关闭也一直保存，因此用作持久数据；cookie只在设置的cookie过期时间之前一直有效，即使窗口或浏览器关闭。（key：本身就是一个回话过程，关闭浏览器后消失，session为一个回话，当页面不同即使是同一页面打开两次，也被视为同一次回话）
 * localStorage：localStorage 在所有同源窗口中都是共享的；cookie也是在所有同源窗口中都是共享的。（key：同源窗口都会共享，并且不会失效，不管窗口或者浏览器关闭与否都会始终生效）

 补充说明一下cookie的作用：

 * 保存用户登录状态。例如将用户id存储于一个cookie内，这样当用户下次访问该页面时就不需要重新登录了，现在很多论坛和社区都提供这样的功能。 cookie还可以设置过期时间，当超过时间期限后，cookie就会自动消失。因此，系统往往可以提示用户保持登录状态的时间：常见选项有一个月、三个 月、一年等。
 * 跟踪用户行为。例如一个天气预报网站，能够根据用户选择的地区显示当地的天气情况。如果每次都需要选择所在地是烦琐的，当利用了 cookie后就会显得很人性化了，系统能够记住上一次访问的地区，当下次再打开该页面时，它就会自动显示上次用户所在地区的天气情况。因为一切都是在后 台完成，所以这样的页面就像为某个用户所定制的一样，使用起来非常方便
 * 定制页面。如果网站提供了换肤或更换布局的功能，那么可以使用cookie来记录用户的选项，例如：背景色、分辨率等。当用户下次访问时，仍然可以保存上一次访问的界面风格。

 ### 14.web worker

 在HTML页面中，如果在执行脚本时，页面的状态是不可相应的，直到脚本执行完成后，页面才变成可相应。web worker是运行在后台的js，独立于其他脚本，不会影响页面你的性能。并且通过postMessage将结果回传到主线程。这样在进行复杂操作的时候，就不会阻塞主线程了。

 如何创建web worker：

 * 检测浏览器对于web worker的支持性
 * 创建web worker文件（js，回传函数等）
 * 创建web worker对象

 ### 15.对HTML语义化标签的理解

 HTML5语义化标签是指正确的标签包含了正确的内容，结构良好，便于阅读，比如nav表示导航条，类似的还有article、header、footer等等标签。

 ### 16.iframe是什么？有什么缺点？

 定义：iframe元素会创建包含另一个文档的内联框架  
 提示：可以将提示文字放在
 <iframe></iframe>之间，来提示某些不支持iframe的浏览器

 缺点：

 * 会阻塞主页面的onload事件
 * 搜索引擎无法解读这种页面，不利于SEO
 * iframe和主页面共享连接池，而浏览器对相同区域有限制所以会影响性能。

 ### 17.Doctype作用? 严格模式与混杂模式如何区分？它们有何意义?

 Doctype声明于文档最前面，告诉浏览器以何种方式来渲染页面，这里有两种模式，严格模式和混杂模式。

 * 严格模式的排版和 JS 运作模式是  以该浏览器支持的最高标准运行。
 * 混杂模式，向后兼容，模拟老式浏览器，防止浏览器无法兼容页面。

 ### 18.Cookie如何防范XSS攻击

 XSS（跨站脚本攻击）是指攻击者在返回的HTML中嵌入javascript脚本，为了减轻这些攻击，需要在HTTP头部配上，set-cookie：

 * httponly-这个属性可以防止XSS,它会禁止javascript脚本来访问cookie。
 * secure - 这个属性告诉浏览器仅在请求为https的时候发送cookie。

 结果应该是这样的：Set-Cookie=…

 ### 19.Cookie和session的区别

 HTTP是一个无状态协议，因此Cookie的最大的作用就是存储sessionId用来唯一标识用户

 ### 20. 一句话概括RESTFUL

 **_就是用URL定位资源，用HTTP描述操作_**

 ### 21.讲讲viewport和移动端布局

 可以参考我的这篇文章：

 [响应式布局的常用解决方案对比(媒体查询、百分比、rem和vw/vh）](https://github.com/forthealllight/blog/issues/13)

 ### 22. click在ios上有300ms延迟，原因及如何解决？

 #### (1)粗暴型，禁用缩放


 ```
 <meta name="viewport" content="width=device-width, user-scalable=no">
 ```


 #### (2)利用FastClick，其原理是：

 检测到touchend事件后，立刻出发模拟click事件，并且把浏览器300毫秒之后真正出发的事件给阻断掉
