原文：https://developer.mozilla.org/zh-CN/docs/Web/Guide/HTML/Using_data_attributes
演示：http://jsbin.com/ujiday/2/edit?html,output
>HTML5是具有扩展性的设计，它初衷是数据应与特定的元素相关联，但不需要任何定义。data-* 属性允许我们在标准内于HTML元素中存储额外的信息，而不需要使用类似于 classList，标准外属性，DOM额外属性或是 setUserData之类的伎俩。

####HTML 语法

语法非常简单。所有在元素上以data-开头的属性为数据属性。比如说你有一片文章，你想要存储一些没有可视化展现意义的额外信息。请使用data属性：
```
<article
  id="electriccars"
  data-columns="3"
  data-index-number="12314"
  data-parent="cars">
...
</article>
```
####JavaScript 访问Edit

在外部使用JavaScript去访问这些属性的值同样非常简单。你可以使用getAttribute()配合它们完整的HTML名称去读取它们，但标准定义了一个更简单的方法：DOMStringMap你可以使用dataset读取到数据。

为了使用dataset对象去获取到数据属性，需要获取属性名中data-之后的部分(要注意的是破折号连接的名称需要转换为驼峰样式的名称)。

`var article = document.querySelector('#electriccars');`
 
```
article.dataset.columns // "3"
article.dataset.indexNumber // "12314"
article.dataset.parent // "cars"
```
每一个属性都是一个可读写的字符串。在上面的例子中，article.dataset.columns = 5.将会调整属性的值为5。

####CSS 访问Edit

请注意到，data attributes设定为HTML属性，他们同样能被CSS访问.比如你可以通过generated content使用函数attr()来显示data-parent的内容：

```
article::before {
  content: attr(data-parent);
}
```
你同样可以在CSS中使用属性选择器根据data来改变样式：
```
article[data-columns='3'] {
  width: 400px;
}
article[data-columns='4'] {
  width: 600px;
}
```
你可以在这个JSBin 的实例里面看到全部的演示。

 

Data属性同样可以存储不断变化的信息，比如游戏的得分。使用CSS选择器与JavaScript去访问可以让你得的花俏的效果，这里你并不需要你编写你常规的编写方案。 请参考这个视频  (JSBin example).

####IssuesEdit

不要在data attribute里储存需要显示及访问的内容，因为一些其他的技术可能访问不到它们。另外爬虫不能将data attribute的值编入索引中。

IE的支持度及显示效果是最主要讨论的问题。IE11+支持这个标准，但所有更早期的版本都不支持dataset。为了支持IE10及以下的版本，你必须使用getAttribute() 来访问。另外，读取 data-attributes的行为相比JS存储数据会慢。使用dataset 会比使用getAttribute()读取数据来得慢。

####参阅Edit

 
This article is adapted from Using data attributes in JavaScript and CSS on hacks.mozilla.org.
How to use HTML5 data attributes (Sitepoint)