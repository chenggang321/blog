---
categories:
  - 读书笔记
tags:
  - 前端
  - JavaScript
---
# 第一章-灵活的JavaScript

为了防止作用域的变量被覆盖，可以采用对象来保护变量，同时也防止了覆盖别人的变量 -- 用对象来收编变量

```js
var CheckObject = {
    checkName: function () {
        console.log("验证姓名");
    },
    checkEmail: function () {
        console.log("验证邮箱");
    },
    checkPassword: function () {
        console.log("验证密码");
    }
};
CheckObject.checkName();
CheckObject.checkEmail();
CheckObject.checkPassword();
```

对象的另一种形式，先声明对象 再添加方法

```js
var CheckObjectTwo = function () {
};
CheckObjectTwo.checkName = function () {
    console.log("验证姓名");
};
CheckObjectTwo.checkEmail = function () {
    console.log("验证邮箱");
};
CheckObjectTwo.checkPassword = function () {
    console.log("验证密码");
};
CheckObjectTwo.checkName();
CheckObjectTwo.checkEmail();
CheckObjectTwo.checkPassword();
```

类也可以可重复使用,但有时候内存消耗巨大，应为每次调用的时候都会new一个新对象，如果调用过多
造成大量的内存消耗

```js
var CheckObjectThree = function () {
    this.checkName = function () {
        console.log("验证姓名");
    };
    this.checkEmail = function () {
        console.log("验证邮箱");
    };
    this.checkPassword = function () {
        console.log("验证密码");
    }
};

var a = new CheckObjectThree();
a.checkName();
a.checkEmail();
a.checkPassword();
```

为了避免，每次都new一个对象，都会生成对象方法实例，可以采用将方法放到原型上，不用每次new的
时候都会实例化方法减少内存的消耗，（这种方法会重复书写prototype）

```js
var CheckObjectFour = function () {
};

CheckObjectFour.prototype.checkName = function () {
    console.log("验证姓名");
};
CheckObjectFour.prototype.checkEmail = function () {
    console.log("验证邮箱");
};
CheckObjectFour.prototype.checkPassword = function () {
    console.log("验证密码");
};
var b = new CheckObjectFour();
b.checkName();
b.checkEmail();
b.checkPassword();
```

为了防止 prototype 书写多遍 可以这样做两种方法不能混用 - 命名相同会造成覆盖 同时我们还发
现了在调用的时候 c 写了多遍

```js
var CheckObjectFive = function () {
};
CheckObjectFive.prototype = {
    checkName: function () {
        console.log("验证姓名");
    },
    checkEmail: function () {
        console.log("验证邮箱");
    },
    checkPassword: function () {
        console.log("验证密码");
    }
};

console.log(">>>>>>>>>>>>>>>>>>>>");
var c = new CheckObjectFive();
c.checkName();
c.checkEmail();
c.checkPassword();
```

实现链式调用 - 解决c书写多次

```js
var CheckObjectSix = function () {
};
CheckObjectSix.prototype = {
    checkName: function () {
        console.log("验证姓名");
        return this;
    },
    checkEmail: function () {
        console.log("验证邮箱");
        return this;
    },
    checkPassword: function () {
        console.log("验证密码");
        return this;
    }
};
console.log(">>>>>>>>>>>>>>>>>>>>six");
var d = new CheckObjectSix();
d.checkName().checkEmail().checkPassword();
```

函数的祖先-在添加函数的时候也可以这样做

```js
Function.prototype.addMethod = function (name, fn) {
    this[name] = fn;
    return this;//实现链式
};

var methods = function () {
};
methods.addMethod('checkName', function () {
    console.log("验证姓名");
    return this;//实现链式
}).addMethod('checkEmail', function () {
    console.log("验证邮箱");
    return this;//实现链式
}).addMethod('checkPassword', function () {
    console.log("验证密码");
    return this;//实现链式
});
/*methods.checkName();
 methods.checkEmail();
 methods.checkPassword();*/
methods.checkName().checkEmail().checkPassword();
```

换一种方式使用方法
```js
Function.prototype.addMethodTwo = function (name, fn) {
    this.prototype[name] = fn;
    return this;
};
var Methods = function () {
};
Methods.addMethodTwo('checkName', function () {
    console.log("验证姓名");
}).addMethodTwo('checkEmail', function () {
    console.log("检测邮箱");
});
console.log("换一种方式使用方法");
var m=new Methods();
m.checkName();
m.checkEmail();
```






