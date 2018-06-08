- 踩过的CRUD的坑
- 如何更优雅地使用MongoDB

### 踩过的CRUD的坑
- **同时自增N条数据中的某字段**

假设我查询到100条数据，每条数据中都有一个count字段（number类型），想让这100条数据的count字段全部自增，应该怎么做？

贴上我的代码：
```
   db.coll.update\({

        someQuery: 'xxx'

    }, {$inc: {count: 1}}, false, true\)
```
我这么做只能自增查询到的第一条，该怎么做？

问题原因：update参数设置错误，导致它等同于updateOne，仅匹配第一条数据，因此仅自增第一条。

解决办法：

1.还是用update，{multi:true}激活multi。
```
db.coll.update({
    someQuery: 'xxx'
}, {$inc: {count: 1}}, {multi:true})
```
2.改用updateMany，去掉true选项，自增所有数据。
```
db.coll.updateMany({
    someQuery: 'xxx'
}, {$inc: {count: 1}})
```

- **mongodb增加修改字段**
>mongodb的文章中说： http://docs.mongoing.com/manu...
MongoDB使用动态模式。你可以建立一个没有预定义模式的集合。你可以通过直接在文档内增加或删除字段的方式修改文档的结构。文档在一个集合内不需要有相同的字段集。

问题： 我想增加字段，修改字段名称，怎么操作呢？

增加字段 : "Season"
`{ $set: { <field1>: <value1>, ... } }`
修改字段名称 : `"team"→"NBA Team"`

`{$rename: { <field1>: <newName1>, <field2>: <newName2>, ... } }`

mongo-shell完整示例代码：
```
use nba
db.createCollection(players)
db.players.insert({"team":"Cleveland","firstname":"Irving","lastname":"Kyrie"})
db.players.update({"firstname":"Irving"},{$set:{"team":"Cletics","Season":"2017~2018"}})
db.players.update({"firstname":"Irving"},{$rename:{"team":"NBA Team"}})
```
记录一下数据变化：
```
{ "_id" : ObjectId("59a1a734c8143c78793d3da6"), "firstname" : "Irving", "lastname" : "Kyrie", "team" : "Cleveland" }
{ "_id" : ObjectId("59a1a734c8143c78793d3da6"), "firstname" : "Irving", "lastname" : "Kyrie", "team" : "Cletics", "Season" : "2017~2018" }
{ "_id" : ObjectId("59a1a734c8143c78793d3da6"), "firstname" : "Irving", "lastname" : "Kyrie", "NBA Team" : "Cletics", "Season" : "2017~2018" }
```

### 如何更优雅地使用MongoDB

- **MongoDB游标**
下面这两个mongoDB集合的操作应该怎么做呢？

有两个集合：
```
Collection:categories：

{"category":"animal","category\_id":"1"}

{"category":"fruit","category\_id":"2"}

{"category":"sport","category\_id":"3"}
```
Collection:details，它没有category_id这一项：
```
{"id":"1","name":"apple","category":"fruit"}

{"id":"2","name":"pear","category":"fruit"}

{"id":"3","name":"football","category":"sport"}

{"id":"4","name":"basketball","category":"sport"}

{"id":"5","name":"cat","category":"animal"}

{"id":"6","name":"dog","category":"animal"}
```
问题：

我想把details中的每一条加上category_id项，它的值就是categories中对应的category_id值。应该怎么做呢？

这属于集合间的引用问题，解决办法代码如下。
```
fruit=db.categories.findOne({"category":"fruit"})
db.details.updateMany({"category":"fruit"},{$set:{"category_id":fruit.categsory_id}})
```
上述代码做到了为details中的所有的{"category":"fruit"}项加上category_id项，它的值就是categories中的{"category":"fruit"}项对应的category_id值。

为details中剩余的添加category_id是同理的，只需要将fruit的部分替换成animal和sport即可。

游标升级版...
```
db.details.find\(\).forEach\( \(x\)=&gt; {

       db.categories.find\(\).forEach\( \(y\)=&gt; {

        if\(y.category===x.category\){

            db.details.updateMany\({"category":x.category},{$set:{"category\_id":y.category\_id}}\)

        }

    }\)

}\)
```

