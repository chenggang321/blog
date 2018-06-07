来源：https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html
setTimeout()和setInterval()方法允许作者调用timer-based回调函数。

- Web开发者指南（非标准）
    - `handle = self.setTimeout(handler,[,timeout[,arguments...]])`
        在timeout毫秒时延之后，设定一个timeout运行handler。任何实参数组都会通过arguments被直接传递到handler中。
    -` handle = self.setTimeout(code,[,timeout])`
        在timeout毫秒时延之后，设定一个time去编译运行code。
    - `self.clearTimeout(handle)`
        通过传入setTimeout()或者setInterval()的handle，取消timeout。
    - `handle = self.setInterval(handler,[,timeout[,arguments...]])`
        设定一个timeout每隔一段运行handler。任何实参数组都会通过arguments被直接传递到handler中。
    - `handle = self.setInterval(code,[timeout])`
        在timeout毫秒时延之后，设定一个time去编译运行code。
    - `self.clearInterval(handle)`
         通过传入setInterval()或者setTimeout()的handle，取消timeout。

注意：Timers是可以嵌套的；在5个类似的嵌套timer之后，interval的最小时间间隔是4毫秒。
注意：这个API不会保证按照设定的方法去运行。可能会由于CPU负载，或者任务等等受到影响。

实现WindowOrWorkerGlobalScope mixin的对象具有活动计时器的列表。列表中的每个入口，由一个数字标记，它必须在实现WindowOrWorkerGlobalScope mixin对象的生命周期列表中唯一。

- **setTimeout()与setInterval()区别**
- **clearTimeout() 和clearInterval()都能清除定时器的原因**

setTimeout()方法必须返回由**timer initialization step**返回的值，传递它们到方法的实参数组，运行该算法的方法所针对的对象作为method context实现（Window或WorkerGlobalScope对象），并将重复标志设置为**false**。

setInterval()方法必须返回由**timer initialization step**返回的值，传递它们到方法的实参数组，运行该算法的方法所针对的对象作为method context实现（Window或WorkerGlobalScope对象），并将重复标志设置为**true**。

clearTimeout() 或者clearInterval()方法必须清除调用的WindowOrWorkerGlobalScope对象上的**active timer列表**的处理器入口，如果有的话，handle会传递给方法。（如果handle不能表明调用的WindowOrWorkerGlobalScope对象上的active timer列表的处理器入口的话，方法不做任何事。）

注意：因为clearTimeout()和clearInterval()清楚了同一个列表的入口，所以两种方法既可以清除setTimeout() timer，又可以清除setInterval() timer。

### timer initialization step

关键词：method context，method context，repeat flag，可选的预处理器，遵循以下步骤：

1. 如果是WorkerGlobalScope对象，则将method context proxy作为method context，否则WindowProxy对应到method conext。
2. 如果previous handle已经设置好了，handle会作为pervious handle；否则，handle作为user-agent-defined的大于零的整数，它将识别活动定时器列表中由此调用设置的超时时间。
3. 如果previous handle没有设置，为handle在定时器列表中新增一个入口。
4. 让callerRealm作为current Realm Record，calleeRealm作为context的Javascript realm 方法上下文。
5. initiating script 作为active script
6. Assert：initiating script不是null，因为this算法通常由其他script调用。
7. 让任务作为task将执行以下几个字步骤：
    1. 如果定时器列表中的handle入口被清除，退出，终止后续所有的步骤。
    2. 根据下面的列表运行适当的步骤：
        - 如果第一个方法实参是Function
         1. 调用Function。使用第三个参数和随后的方法的实参数组作为实参数组去调用Function。使用method context proxy作为callback this value。
        - 否则
         1. 执行HostEnsureCanCompileStrings(callerRealm,calleeRealm)。如果这抛出了异常，捕捉它，报告异常，退出终止后续所有步骤。
         2. 使script source 作为第一个方法的实参
         3. 使settings object作为method context的环境设置对象。
         4. 使base URL作为initiating script的base URL。
         5. 使fetch 选项作为script fetch options，这个选项的cryptographic nonce是initiating script的fetch options的cryptographic nonce，正元数据是空字符串，解析元数据是"not-parser-inserted"，证书模型是initiating script的fetch options的证书模型，而且referrer policy是initiating script的fetch 选项的referrer的policy。
         注意：这些选项的效果确保setTimeout（）和setInterval（）完成的字符串编译的行为与eval（）完成的行为相同。也就是说，通过import（）获取的模块脚本在两个上下文中都会表现相同。
         6. 使script作为creating a classic script与given script source，settings object，baseURL以及fetch options作用的结果。
         7. 运行classic script脚本
    3. 如果repeat flag是true，然后再调用timer initialization步骤，传递相同的方法实参，相同的method context，并将repeat flag设置为true，然后将previous handle设置为handler。
8. 使timeout作为第二个参数
9. 如果现在运行的task是由this算法生成的，那么使nesting level作为task的timer nesting level。否则nesting level为0.
10. 如果timeout值小于0，设置timeout为0
11. 如果nesting level小于5，而且timeout小于4，设置timeout为4.
12. 嵌套等级递增1
13. 使task的timer nesting level作为nesting level
14. 返回handle，并且并行继续运行此算法
15. 如果method context是Window对象，等待定时器时延后将与method context有关联的Document被完全激活。
16. 等到有相同method context的this算法被调用，在this one之前开始，而且它们的timeout将相等或者小于this one的，将被完成。
笔记：argument转换是由Web IDL定义的。（例如，在对象上调用toString()方法将作为第一个实参被传入），在算法调用前，Web IDL定义了算法实现。
例如：下面的代码很愚蠢会导致包含“ONE TWO”的日志：
```
var log = '';
function logger(s) { log += s + ' '; }

setTimeout({ toString: function () {
  setTimeout("logger('ONE')", 100);
  return "logger('TWO')";
} }, 100);
```
17. 可选的，等待另一个user-agent定义的时间
          笔记：这旨在允许用户代理根据需要填充超时以优化设备的电源使用情况。例如，一些处理器具有低功耗模式，其中定时器的粒度减小;在这样的平台上，用户代理可以减慢定时器以适应这个时间表，而不需要处理器使用更精确的模式及其相关的更高功率使用。
18. 队列化任务
          一旦任务处理完毕，如果重复标志为false，则从活动定时器列表中删除句柄条目是安全的（检测条目的存在是无法通过此点检测的，因此它在技术上不会以某种方式或另一种方式）

### 这些任务的任务源代码是timer task source
毫不时延地去一毫秒一毫秒运行任务，同时回到浏览器以避免starving用户界面，也就是留白（也避免浏览器杀掉占用CPU的script）。在执行工作前，简易队列化下一个timer。
```
function doExpensiveWork(){
    var done = false;
    //...
    //函数的这一部分占用5毫秒
    //当我们结束之后，设置done为true
    //...
    return done;
}
function rescheduleWork() {
    var handle = setTimeout(rescheduleWork,0);// 预先安排下一次迭代
    if(foExpensiveWork()){
        clearTimeout(handle);//如果我们不需要这个句柄，清除掉它
    }
}
function scheduleWork() {
    setTimeout(rescheduleWork,0)
}
scheduleWork();//队列化task去做大量工作
```

其实还是很懵逼的状态，但是可以引申出一些子问题。
### Q&A
- 什么是list of active timers，如何查看列表？
- 什么是Javascript realm？
- 什么是active script？
- 什么是class script，如何create？如何run？
- 什么是timer nesting level？
- method context的fully active是一种什么状态？
- 什么是task？如何理解queue？
- 如何理解event loop？

### 什么是list of active timers，如何查看列表？
通过重写setTimeout和clearTimeout的方式，将数据统计到window.activeTimer属性上。
这种实现方式可以确保增量式扩展函数，也就是先保留原始函数，之后再声明同名函数并且赋新的函数给它，在新函数体内部做扩展，但是需要在函数内部return原始函数的处理结果。
```
window.originalSetTimeout=window.setTimeout;
window.originalClearTimeout=window.clearTimeout;
window.activeTimers=0;

window.setTimeout=function(func,delay)
{
    window.activeTimers++;
    return window.originalSetTimeout(func,delay);
};

window.clearTimeout=function(timerID)
{
    window.activeTimers--;
    window.originalClearTimeout(timerID);
};
```
例如：
新增6个active timer
```
for(var i=0;i<6;i++){
    setTimeout(function(){
        console.log(i)
    },0)
}
console.log(i)
window.activeTimers;//6个timer
```
清除2 active timer：
```
for(var i=0;i<2;i++){
    setTimeout(function(){
        console.log(i)
    },0)
}
console.log(i)
window.activeTimers;//剩余4个active timer
```
参考：https://stackoverflow.com/questions/858619/viewing-all-the-timeouts-intervals-in-javascript

### 什么是Javascript realm？
在求值之前，所有的ECMAScript代码将会与一个realm联系起来。
从概念上来说，一个realm由**内在对象的集合**组成，一个ECMAScript全局环境，所有的ES代码都将在这个全局环境的scope中加载，然后是其他相关的state和resource。

一个realm在规范中的定义是Realm Record，它有不同的值。

Realm Record Filed
-----
|Field Name|Value|Meaning|
|:----|------|------:|
[[Intrinsics]]|记录其字段名称是内部键，其值是对象|与此领域相关的代码使用的内在值
[[GlobalObject]]|Object|这个realm的全局对象
[[GlobalEnv]]|词法环境|这个realm的全局环境
[[TemplateMap]]|记录列表{[[Site]]：解析节点，[[Array]]：Object}。|使用Realm Record的[[TemplateMap]]为每个领域单独规范化模板对象。每个[[Site]]值是一个TemplateLiteral的Parse节点。关联的[[Array]]值是传递给标记函数的相应模板对象。(一旦Parse节点变得无法访问，相应的[[Array]]也无法访问，如果一个实现从[[TemplateMap]]列表中删除了这个对，这将是不可见的。)
[[HostDefined]]|任意值，默认值为undefined|字段保留供需要将附加信息与Realm Record关联的主机环境使用。

### 什么是active script？
active script由以下算法组成：
1. 使记录成为GetActiveScriptOrModule()
2. 如果record 是null，返回null
3. 返回record.[[HostDefined]]

### 什么是task？如何理解task queue？
关键词：**task ，task queue ，event loop，task source，starved task queue**

说到task queue，其实就要说到event loop，因为一个事件循环有一个或者多个任务队列，关于事件循环，有以下算法：
**task**
- Events:
    为一个特定的EventTarget对象分发一个Event对象，通常由一个专门任务 (dedicated task)完成。
- Parsing：
    HTML parser标记一个或者多个字节，然后处理结果token，也是一个典型的task。
- Callbacks
    调用一个callback通常也是一个task。
- 使用一个资源
    当算法获取一个资源时，如果以非阻塞方式进行提取，那么一旦某个或全部资源可用，对资源的处理由task执行。
- 对DOM操作作出反应
    某些元素具有响应DOM操作而触发的tasks，例如，当该元素插入到文档中时。

**task queue ，event loop，task source，starved task queue**
- 在浏览器上下文的event loop中的每一个task都与Document有关。
    - 如果task在一个元素的上下文中排队，实际上它是元素的节点document
    - 如果task在浏览器上下文排队，那么它是任务排队时浏览器上下文的激活的document。
    - 如果task是排队或者脚本，则该文档是脚本的设置对象指定的负责文档。
- 一个任务针对特定的事件循环：event loop用来处理与Document或者worker相关的任务。
- 当一个user agent在为一个任务排队时，它必须将任务分配给与当前任务所在的任务队列的事件循环。
- 每个task都由一个特定的task source定义。来源于同一个task source的task会注定要与一个特定的event loop关联。例如
    - Document对象的timer生成的callback
    - Document对象上触发鼠标移动的事件
    - Document对象上队列解析的任务
- **来源相同的task必须被加到相同的task 队列，从不同的task sources上来源的task分配到不同的task 队列**。

例如：例如，用户代理可以有一个用于鼠标和键盘事件的任务队列（用户交互任务源），另一个用于其他任务。然后，用户代理可以在**四分之三的时间**内给予键盘和鼠标事件**优先**于其他任务，保持界面响应但不会**挨饿其他任务队列**，并且从不处理来自任何一个任务源的事件

- 每个event loop 都有当前的运行中task。
    - 初始化时，它是null。
    - 用来处理重入。
    - 每个event loop 都有performing a microtask checkpoint的flag，初始值必须是false。这是为了它用于防止执行微任务检查点算法的重入调用。

参考：https://html.spec.whatwg.org/multipage/webappapis.html#task-queue