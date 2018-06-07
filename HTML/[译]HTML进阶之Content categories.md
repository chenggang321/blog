原文链接：https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Content_categories

![](http://upload-images.jianshu.io/upload_images/2976869-26c183be7a2ab346.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/512)

1. **主要内容目录**
    - **元数据**
    - **流**
    - **章节**
    - **标题**
    - **短语**
    - **内嵌**
    - **交互**
    - 可触
    - **表单**
2. **次要内容目录**
    - **脚本支持元素**
3. 透明内容模型
4. 其他内容模型

每个HTML标签都是一定数量的内容目录中的一员，内容目录是一个具有相同特性的标签组。标签组的划分是不严格的，因为实际上组内的标签之间是没有任何联系的，但是对于定义和描述他们必须遵守的行为和规则来说是十分有帮助的，尤其是当你深入到他们的错综复杂的细节中时。有些元素，不属于任何这些内容目录。

>有三种内容目录：
>- **主要内容**目录，描述了许多标签遵循的普通内容规则。
>- **表单内容**目录，描述了表单相关标签的内容规则。
>- 特殊内容目录，描述了一些稀有标签的内容规则，有时只在特定的上下文中生效。

###主要内容目录
####元数据内容
元数据类型标签会**修改当前演示文档或是剩余文档的行为，例如建立到其他文档的链接，或者是实现与其他文档的通信。**

属于这个目录的标签包括：```<base>, <command>, <link>, <meta>, <noscript>, <script>, <style> and <title>```
####流式内容
流式内容标签典型特征是**包含文本或者是内嵌内容**。属于此类的标签包括：```<a>, <abbr>, <address>, <article>, <aside>, <audio>, <b>,<bdo>, <bdi>, <blockquote>, <br>, <button>, <canvas>, <cite>, <code>, <command>, <data>, <datalist>, <del>, <details>, <dfn>, <div>, <dl>, <em>, <embed>, <fieldset>, <figure>, <footer>, <form>, <h1>, <h2>, <h3>, <h4>, <h5>, <h6>, <header>, <hgroup>, <hr>, <i>, <iframe>, <img>, <input>, <ins>, <kbd>, <keygen>, <label>, <main>, <map>, <mark>, <math>, <menu>, <meter>, <nav>, <noscript>, <object>, <ol>, <output>, <p>, <pre>, <progress>, <q>, <ruby>, <s>, <samp>, <script>, <section>, <select>, <small>, <span>, <strong>, <sub>, <sup>, <svg>, <table>, <template>, <textarea>, <time>, <ul>, <var>, <video>, <wbr> 和文本节点.```
有一些标签也属于此类，但前提是需要满足一些条件
- <area>，是<map>标签的子标签时。
- <link>, itemprop属性有初始值时。
- <meta>, itemprop属性有初始值时。
- <style>, scoped属性有初始值时。
####章节内容
属于章节内容模型的标签能够在**清晰地在大纲中划分一部分区域出来**，例如<header><footer>和标题内容标签。
属于章节内容的标签有<article>, <aside>, <nav> 和<section>.
####标题内容
**标题内容定义了章节的标题**，由一个显式的章节内容标签标记或者隐式的由标题内容标签自己定义。
属于标题内容的标签有```<h1>,<h2>,<h3>,<h4>,<h5>,<h6>以及<hgroup>```。
####短语内容
短语内容定义了他**包含的文本和包含的标签,多个短语内容组成段落**。
短语内容标签包括：```<abbr>, <audio>, <b>, <bdo>, <br>, <button>, <canvas>, <cite>, <code>, <command>, <data>, <datalist>, <dfn>, <em>, <embed>, <i>, <iframe>, <img>, <input>, <kbd>, <keygen>, <label>, <mark>, <math>, <meter>, <noscript>, <object>, <output>, <progress>, <q>, <ruby>, <samp>, <script>, <select>, <small>, <span>, <strong>, <sub>, <sup>, <svg>, <textarea>, <time>, <var>, <video>, <wbr> ```和非空纯文本。

有一些需要满足特定条件才属于此目录的标签：
- <a>, 仅包含内容短语时
- <area>, 是<map>标签的子孙元素时
- <del>, 仅包含内容短语时
- <ins>, 仅包含内容短语时
- <link>, itemprop属性有初始值时
- <map>, 仅包含内容短语时
- <meta>, itemprop属性有初始值时

####内嵌内容
内嵌内容标签**导入其他内容，或者插入内容到其他标签语言和文档命名空间中**。属于这个目录的标签有：```<audio>,<canvas>,<embed>,<iframe>,<img>,<math>,<object>,<svg>,<video>.

####交互内容
交互内容标签包含**专门为了用户交互而设计**的标签。属于这个目录的标签有：```<a>, <button>, <details>, <embed>, <iframe>, <keygen>, <label>, <select>, and <textarea>.```
有一些需要满足特定条件才属于此目录的标签：
- <audio>, controls属性有初始值时
- <img>, usemap属性有初始值时
- <input>, type类型不在隐藏状态中时
- <menu>,type类型不在工具栏状态中时
- <object>, usemap属性有初始值时
- <video>, controls属性有初始值时

####可触内容
内容既不空也不隐藏;它是呈现的内容，是实质性的。其模型是流程内容或措辞内容的元素应该至少有一个可触摸的节点。

####表单相关内容
表单相关内容包含**具有表单所有者的标签，由form属性暴露出去**。一个表单父节点可以是<form>元素，也可以是其id在表单属性中被指定了的元素。
```
<button>
<fieldset>
<input>
<keygen>
<label>
<meter>
<object>
<output>
<progress>
<select>
<textarea>
```
这个目录由于较为复杂，因此还有几个子目录：
#####可枚举的
在 form.elements 和 fieldset.elements IDL 集合中列举出的元素. 包括 ```<button>，<fieldset>，<input>，<keygen>，<object>，<output>，<select> 和 <textarea>```
#####可标记的
与<label>标记相关的标签，包括```<button>，<input>，<keygen>，<meter>，<output>，<progress>，<select> 和 <textarea>。```
#####可提交的
可用来在表单提交时，组成表单数据的元素。包括```<button>,<input>,<keygen>,<object>,<select>和<textarea>```
#####可重置的
表单重置时会影响到的标签。包括：```<input>，<keygen>，<output>，<select> 和 <textarea>.```

###次要内容目录
还有一些次要的内容目录可以简单了解下。
####脚本支持标签
脚本支持标签**不直接影响文档渲染后输出的结果**。相反，它们通过直接包含或指定脚本代码来支持脚本，或者通过指定什么数据被脚本使用。
脚本支持标签包括：
- <script>
- <template>

###透明内容模型
如果一个标签属于特殊内容模型， 即使将透明内容更换为子元素，其内容必须由合法的HTML5元素组成。
例如，<del> 和 <ins> 是透明的：
`<p>We hold these truths to be <del><em>sacred &amp; undeniable</em></del> <ins>self-evident</ins>.</p>`
如果这两个元素被移除，这个程序段依然是合法的。
`<p>We hold these truths to be <em>sacred &amp; undeniable</em> self-evident.</p>`

###其他内容模型
####sectioning root
sectioning root category 的作用是把它的内容与常规的大纲隔离。

译文完毕。

附：
如果你有耐心读到这里，恭喜你，你将会了解到vue的单文件组件对于本文中一些不被人所熟知的标签的应用。
来看个vue官方的hello world单文件组件：
![](http://upload-images.jianshu.io/upload_images/2976869-baa435cbfdfb8326.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
单文件组件主要包含3个标签，<template>,<script>,<style>。

我们从上述标签中找出这3个标签属于的分类。

- <template>：流式标签，脚本支持标签。（flow content , Script-supporting elements。）
- <script>：元数据标签，流式标签，短语标签，脚本支持标签。（Metadata content , Flow content , Phrasing content , Script-supporting elements）
- <style>：元数据标签，流式标签（因为此时scoped有定义，也就是style标签中的样式只作用于当前当文件组件的作用域）。（Metadata content , Flow content(the scoped attribute is present)）

再来简单分析下。

>template，符合流式标签和脚本支持的特点。主要包含包含内嵌内容和文本：例如双向数据绑定模板；而且也包含脚本代码且指定数据被脚本使用：例如事件处理函数的调用。

>script，主要符合元数据和脚本支持的特点。元数据的原因是这里可以导入依赖，也能实现组件间通信，或者是vuex通信；会有脚本支持的情况，例如事件处理函数的定义。

>style，主要是流式标签，没有元数据的成分。因为这里加的scoped主要是为了内嵌样式内容。

翻译此文之前，我还以为template标签和style的scoped是尤雨溪自己创造出来的，翻译完才发现，原来是W3C组织定义的，被自己的天真和无知所打败，看来要好好审视下"精通html,css和javascript"这句话了。

努力成为优秀的前端开发工程师！