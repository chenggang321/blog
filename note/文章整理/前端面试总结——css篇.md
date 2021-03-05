---
date: 2021-03-04 14:30
title: 前端面试总结——css篇
categories:
  - css
tags:
  - 前端
  - css
---

 ### 1.css盒模型

 简介：就是用来装页面上的元素的矩形区域。CSS中的盒子模型包括IE盒子模型和标准的W3C盒子模型。

 box-sizing(有3个值哦)：border-box,padding-box,content-box.

 * 标准盒子模型：![2018-07-10 4 24 03](https://user-images.githubusercontent.com/17233651/42498021-b4dd6a46-845d-11e8-8bd9-ac2d90985f2a.png)

 * IE盒子模型：![2018-07-10 4 24 12](https://user-images.githubusercontent.com/17233651/42498075-d3496e3a-845d-11e8-919c-eb3a7866883b.png)


 区别：从图中我们可以看出，这两种盒子模型最主要的区别就是width的包含范围，在标准的盒子模型中，width指content部分的宽度，在IE盒子模型中，width表示content+padding+border这三个部分的宽度，故这使得在计算整个盒子的宽度时存在着差异：

 标准盒子模型的盒子宽度：左右border+左右padding+width  
 IE盒子模型的盒子宽度：width

 在CSS3中引入了box-sizing属性，box-sizing:content-box;表示标准的盒子模型，box-sizing:border-box表示的是IE盒子模型

 最后，前面我们还提到了，box-sizing:padding-box,这个属性值的宽度包含了左右padding+width

 也很好理解性记忆，包含什么，width就从什么开始算起。

 ### 2.画一条0.5px的线

 * 采用meta viewport的方式
 * 采用 border-image的方式
 * 采用transform: scale()的方式

 ### 3.link标签和import标签的区别

 * link属于html标签，而@import是css提供的
 * 页面被加载时，link会同时被加载，而@import引用的css会等到页面加载结束后加载。
 * link是html标签，因此没有兼容性，而@import只有IE5以上才能识别。
 * link方式样式的权重高于@import的。

 ### 4.transition和animation的区别

 Animation和transition大部分属性是相同的，他们都是随时间改变元素的属性值，他们的主要区别是transition需要触发一个事件才能改变属性，而animation不需要触发任何事件的情况下才会随时间改变属性值，并且transition为2帧，从from … to，而animation可以一帧一帧的。

 ### 5.Flex布局

 文章链接：  
 [http://www.ruanyifeng.com/blog/2015/07/flex-grammar.html?utm_source=tuicool（语法篇）](http://www.ruanyifeng.com/blog/2015/07/flex-grammar.html?utm_source=tuicool%EF%BC%88%E8%AF%AD%E6%B3%95%E7%AF%87%EF%BC%89)  
 [http://www.ruanyifeng.com/blog/2015/07/flex-examples.html（实例篇）](http://www.ruanyifeng.com/blog/2015/07/flex-examples.html%EF%BC%88%E5%AE%9E%E4%BE%8B%E7%AF%87%EF%BC%89)

 Flex是Flexible Box的缩写，意为"弹性布局"，用来为盒状模型提供最大的灵活性。  
 布局的传统解决方案，基于盒状模型，依赖 display属性 + position属性 + float属性。它对于那些特殊布局非常不方便，比如，垂直居中就不容易实现。

 简单的分为容器属性和元素属性  
 容器的属性：

 * flex-direction：决定主轴的方向（即子item的排列方法）  

     .box {  

     flex-direction: row | row-reverse | column | column-reverse;  

     }

 * flex-wrap：决定换行规则  

     .box{  

     flex-wrap: nowrap | wrap | wrap-reverse;  

     }

 * flex-flow：  

     .box {  

     flex-flow:  || ;  

     }

 * justify-content：对其方式，水平主轴对齐方式
 * align-items：对齐方式，竖直轴线方向

 项目的属性（元素的属性）：

 * order属性：定义项目的排列顺序，顺序越小，排列越靠前，默认为0
 * flex-grow属性：定义项目的放大比例，即使存在空间，也不会放大
 * flex-shrink属性：定义了项目的缩小比例，当空间不足的情况下会等比例的缩小，如果定义个item的flow-shrink为0，则为不缩小
 * flex-basis属性：定义了在分配多余的空间，项目占据的空间。
 * flex：是flex-grow和flex-shrink、flex-basis的简写，默认值为0 1 auto。
 * align-self：允许单个项目与其他项目不一样的对齐方式，可以覆盖align-items，默认属性为auto，表示继承父元素的align-items

 比如说，用flex实现圣杯布局

 ### 6.BFC（块级格式化上下文，用于清楚浮动，防止margin重叠等）

 直译成：块级格式化上下文，是一个独立的渲染区域，并且有一定的布局规则。

 * BFC区域不会与float box重叠
 * BFC是页面上的一个独立容器，子元素不会影响到外面
 * 计算BFC的高度时，浮动元素也会参与计算

 那些元素会生成BFC：

 * 根元素
 * float不为none的元素
 * position为fixed和absolute的元素
 * display为inline-block、table-cell、table-caption，flex，inline-flex的元素
 * overflow不为visible的元素

 ### 7.垂直居中的方法

 ### (1)margin:auto法

 css:


 ```
 div{
   width: 400px;
   height: 400px;
   position: relative;
   border: 1px solid #465468;
  }
  img{
       position: absolute;
       margin: auto;
       top: 0;
       left: 0;
       right: 0;
       bottom: 0;
  }
 ```


 html:


 ```
 <div>
  <img src="mm.jpg">
 </div>
 ```


 定位为上下左右为0，margin：0可以实现脱离文档流的居中.

 #### (2)margin负值法


 ```
 .container{
   width: 500px;
   height: 400px;
   border: 2px solid #379;
   position: relative;
 }
 .inner{
   width: 480px;
   height: 380px;
   background-color: #746;
   position: absolute;
   top: 50%;
   left: 50%;
   margin-top: -190px; /*height的一半*/
   margin-left: -240px; /*width的一半*/
  }
 ```


 补充：其实这里也可以将marin-top和margin-left负值替换成，  
 transform：translateX(-50%)和transform：translateY(-50%)

 #### (3)table-cell（未脱离文档流的）

 设置父元素的display:table-cell,并且vertical-align:middle，这样子元素可以实现垂直居中。


 ```
 css:
 div{
     width: 300px;
     height: 300px;
     border: 3px solid #555;
     display: table-cell;
     vertical-align: middle;
     text-align: center;
 }
 img{
     vertical-align: middle;
 }
 ```


 #### (4)利用flex

 将父元素设置为display:flex，并且设置align-items:center;justify-content:center;


 ```
 css:
 .container{
       width: 300px;
       height: 200px;
       border: 3px solid #546461;
       display: -webkit-flex;
       display: flex;
       -webkit-align-items: center;
       align-items: center;
       -webkit-justify-content: center;
       justify-content: center;
  }
  .inner{
       border: 3px solid #458761;
       padding: 20px;
  }
 ```


 ### 8.关于js动画和css3动画的差异性

 渲染线程分为main thread和compositor thread，如果css动画只改变transform和opacity，这时整个CSS动画得以在compositor trhead完成（而js动画则会在main thread执行，然后出发compositor thread进行下一步操作），特别注意的是如果改变transform和opacity是不会layout或者paint的。  
 区别：

 * 功能涵盖面，js比css大
 * 实现/重构难度不一，CSS3比js更加简单，性能跳优方向固定
 * 对帧速表现不好的低版本浏览器，css3可以做到自然降级
 * css动画有天然事件支持
 * css3有兼容性问题

 ### 9.块元素和行元素

 块元素：独占一行，并且有自动填满父元素，可以设置margin和pading以及高度和宽度  
 行元素：不会独占一行，width和height会失效，并且在垂直方向的padding和margin会失  
 效。

 ### 10.多行元素的文本省略号


 ```
 display: -webkit-box
 -webkit-box-orient:vertical
 -webkit-line-clamp:3
 overflow:hidden
 ```


 ### 11.visibility=hidden, opacity=0，display:none

 opacity=0，该元素隐藏起来了，但不会改变页面布局，并且，如果该元素已经绑定一些事件，如click事件，那么点击该区域，也能触发点击事件的visibility=hidden，该元素隐藏起来了，但不会改变页面布局，但是不会触发该元素已经绑定的事件display=none，把元素隐藏起来，并且会改变页面布局，可以理解成在页面中把该元素删除掉一样。

 ### 12.双边距重叠问题（外边距折叠）

 多个相邻（兄弟或者父子关系）普通流的块元素垂直方向marigin会重叠

 折叠的结果为：

 两个相邻的外边距都是正数时，折叠结果是它们两者之间较大的值。  
 两个相邻的外边距都是负数时，折叠结果是两者绝对值的较大值。  
 两个外边距一正一负时，折叠结果是两者的相加的和。
