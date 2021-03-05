---
date: 2021-03-04 14:30
title: fromData对象的简单使用
categories:
  - javascript
tags:
  - 前端
  - JavaScript
---

> XMLHttpRequest Level 2添加了一个新的接口FormData.利用FormData对象,我们可以通过JavaScript用一些键值对来模拟一系列表单控件,
> 我们还可以使用XMLHttpRequest的send()方法来异步的提交这个"表单".比起普通的ajax,使用FormData的最大优点就是我们可以异步上传一个二进制文件.

> xhr中的使用方法

```js
var form = document.getElementById("form");
var formData = new FormData(form);
var xhr = new XMLHttpRequest();
xhr.open("post","server.php");
xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
xhr.send(formData);
```

> ajax中的使用方法

```js
var form=document.getElementById("form");
var formData =new FormData(form);
        $.ajax({
             url: "server.php",
             type: "post",
             data: formData,
             processData: false,  // 告诉jQuery不要去处理发送的数据
             contentType: false,   // 告诉jQuery不要去设置Content-Type请求头
             success: function(response,status,xhr){
                console.log(response,status,xhr);
             }
        });
```

> 上述代码中的 server.php 是服务器端的文件，接收ajax请求，并将接收结果返回，具体代码如下：

```php
<?php
$name = isset($_POST['name'])? $_POST['name'] : '';  
$gender = isset($_POST['gender'])? $_POST['gender'] : '';
$number = isset($_POST['number'])? $_POST['number'] : '';  
$filename = time().substr($_FILES['photo']['name'], strrpos($_FILES['photo']['name'],'.'));  
$response = array();
if(move_uploaded_file($_FILES['photo']['tmp_name'], $filename)){  
    $response['isSuccess'] = true;  
    $response['name'] = $name;  
    $response['gender'] = $gender;
    $response['number'] = $number;  
    $response['photo'] = $filename;  
}else{  
    $response['isSuccess'] = false;  
}  
echo json_encode($response);
?>
```

> formData的api

1.  FormData 接口的append() 方法 会添加一个新值到 FormData 对象内的一个已存在的键中，如果键不存在则会添加该键。
    * FormData.set 和 append() 的区别在于，如果指定的键已经存在， FormData.set 会使用新值覆盖已有的值，而 append() 会把新值添加到已有值集合的后面。
2.  delete() 方法 会从 FormData 对象中删除指定 key 和它对应的 value(s)。
3.  The FormData.entries() 方法返回一个 iterator对象 ，此对象可以遍历访问FormData中的键值对。其中键值对的key是一个 USVString 对象；value是一个 USVString , 或者 Blob对象。
4.  FormData的get()方法用于返回FormData对象中和指定的键关联的第一个值，如果你想要返回和指定键关联的全部值，那么可以使用getAll()方法。
5.  getAll()方法会返回该 FormData 对象指定 key 的所有值。
6.  has()方法会返回一个布尔值，表示该FormData对象是否含有某个key 。
7.  FormData.keys() 该方法返回一个迭代器（iterator），遍历了该 formData  包含的所有key ，这些 key 是 USVString 对象。
8.  set() 方法会对 FormData 对象里的某个 key 设置一个新的值，如果该 key 不存在，则添加。
    *  set() 和 FormData.append 不同之处在于：如果某个 key 已经存在，set() 会直接覆盖所有该 key 对应的值，而 FormData.append 则是在该 key 的最后位置再追加一个值。
9.  FormData.values() 方法返回一个允许遍历该对象中所有值的 迭代器 。这些值是 USVString 或是Blob 对象。
