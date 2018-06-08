　　对Chrome控制台有一定的了解的朋友都在知道，Network面板会包括很多网络请求方面的东西，包括Http相关的Request信息，Response信息，以及Cookies等等，都是前端开发需要密切关注的问题。
　　这些信息都是属于功能性的，那么当我们的功能需求满足后，势必需要对于性能进行优化，有什么工具可以帮助我们进行分析呢？答案就是Chrome控制台的Performance面板。
　　需要注意的一点是，Performance面板下的功能，是对于细节中的细节进行的优化。其中包含：
```
1.FPS,CPU和NET的使用情况？
2.页面的前1毫秒和后1毫秒网络任务是怎样？
3.Javascript代码的执行消耗时间，显卡负载情况等？
4.浏览器对页面的绘制精确到毫秒级的情况？
```
![](http://upload-images.jianshu.io/upload_images/2976869-bb1d7e85fe95cb0d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
　　这幅图中，1，2包括了FPS，CPU，NET以及网页渲染快照以及流式Network图，直观地浅显地回答了1和2两个问题，3回答了Javascript代码的执行消耗时间，显卡负载情况等，4则回答了浏览器对页面的绘制精确到毫秒级的情况。
 　　上一篇博客中也提到了，第4步，也就是我们最关心的一步，是浏览器对页面的绘制精确到毫秒级的情况，准确的为我们剖析了浏览器加载渲染页面的全过程。
![](http://upload-images.jianshu.io/upload_images/2976869-2f6d47ef20e8f552.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

　　因此下文我们主要对4进行剖析，它包括4个分析面板，肯定有各自的意思在其中。
![](http://upload-images.jianshu.io/upload_images/2976869-c9ab03bde70ae9e0.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
 　　先来分析Summary面板，和其字面意思一样，这是总结面板。从宏观层面概括了浏览器加载的总时间，包括:

| 颜色 | 英文 | 中文 |
|-----|------|-----|
|蓝色|Loading|记载|
|黄色|Scripting|脚本|
|紫色|Rendering|渲染|
|绿色|Painting|绘制|
|深灰|Other|其他|
|浅灰|其他|未熄火（空闲）|

　　再来分析Bottom-Up面板，直接翻译成上下很愚蠢，索性翻译成刨根问底得了，这样更合适。
　　Self Time和Total Time以及Activity，其中的Self Time代表函数本身执行消耗时间，Total Time则是函数本身消耗再加上在调用它的函数中消耗的总时间，Activity不用解释，就是浏览器活动的意思。
![](http://upload-images.jianshu.io/upload_images/2976869-08a7e859e22f45c9.png?imageMogr2 t/auto-orient/strip%7CimageView2/2/w/1240)
　　值得注意的是，这里的Group面板非常有用。我们可以很清晰明了得分析按照活动，目录，域，子域，URL和Frame进行分组的前端性能。对于开发非常有帮助。
![](http://upload-images.jianshu.io/upload_images/2976869-25225e675bff4957.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
　　其实Bottom-Up和Call Tree都有各自的意思，前者是The Heavy (Bottom Up) view is available in the Bottom-Up tab，后者是And the Tree (Top Down) view is available in the Call Tree tab。个人理解的话，前者类似事件冒泡，后者类似事件捕获。要知道，Nodejs是事件驱动型，这对于以后学习Nodejs有很大的帮助。

![](http://upload-images.jianshu.io/upload_images/2976869-699e86f6e3ef1d67.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
![](http://upload-images.jianshu.io/upload_images/2976869-1e0c6df989915e7c.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
　　看一下二者的对比图，很明显可以看出，自上而下的Call-Tree更符合我们的人类正常思维，可以更直观地分析浏览器对页面的build精确到毫秒级的情况。
　　就以百度首页进行分析。
**1. 绘制阶段**
综合视窗，绘制
![](http://upload-images.jianshu.io/upload_images/2976869-0d6c6738c8122f65.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
**2. 加载阶段**
解析样式表，解析HTML（评估脚本，事件）
![](http://upload-images.jianshu.io/upload_images/2976869-c5bdbc9a15f2104a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
**3.脚本阶段**
　　DOM GC（DOM垃圾回收），评估脚本，事件，Major GC（清理年老区（Tenured space）），Minor GC（每次Minor GC只会清理年轻代），Run Microtasks（运行微服务），Timer Fired（销毁计时器） ，XMR Load（异步加载对象加载）。
![](http://upload-images.jianshu.io/upload_images/2976869-32232b6806aea9d3.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
**4.渲染阶段**
　　视窗，升级视图树，重新计算样式。
![](http://upload-images.jianshu.io/upload_images/2976869-8154f0f8c9a780ba.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

　　最后说一下Event Log ，顾名思义就是事件日志的意思，可以很方便的选择想查看的某一阶段的日志。

![](http://upload-images.jianshu.io/upload_images/2976869-8025da3f6fd65700.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

　　
　　其实我的这篇博客没有特别深入的讲解了浏览器渲染机制，只是简单介绍了一下Performance如何使用，大家可以先看下Alon大牛的这篇[浏览器前端优化](http://jinlong.github.io/2017/05/08/optimising-the-front-end-for-the-browser/)，这篇博客干货非常多。
　　大家也都注意到了，Performance工具当中，包含了许多方便Nodejs开发的工具。我斗胆猜想，这可能真的是大前端的味道。前端不再是传统的UI层面或者操作DOM，而是担任了更多的角色。前端热潮中的mvvm三框架，vue，react以及angular，都有很多后端的思想。
　　有心的同学可以发现，饿了么大前端团队的文章，大多都是nodejs相关，对于后端了解较少的同学学起来会非常困难。同学在点我达，他们正在筹划改组成大前端团队。我们公司都没有ios和安卓，而是有一个类似大前端的开发支持部。所以说，这呈现出一个趋势，未来优秀的的前端工程师，后端Nodejs必不可少。
　　关于Performance，暂时浅尝辄止到这里，我想这对自己，以及每个阅读了这篇博客的前端工程师，将来会有或多或少的帮助。
参考文档：
https://developers.google.com/web/tools/chrome-devtools/evaluate-performance/timeline-tool?hl=zh-cn
https://stackoverflow.com/questions/7127671/difference-between-self-and-total-in-chrome-cpu-profile-of-js
https://developers.google.com/web/updates/2016/12/devtools-javascript-cpu-profile-migration
http://colobu.com/2015/04/07/minor-gc-vs-major-gc-vs-full-gc/