标准库可以说是node的基础，非常重要。
- path.join()与path.resolve()什么区别？
- process.cwd()
- fs.readFile()与fs.readFileSync()有什么区别？

### path.join()与path.resolve()什么区别？
一个demonstration就可以说明主要问题：
```
const path = require('path');
const urlJoin = path.join(__dirname, '../../');
const urlResolve = path.resolve(__dirname, '../../');

console.log(urlJoin,urlResolve);
//urlJoin: /Users/frank/Desktop/ 
//urlResolve: /Users/frank/Desktop

```
细心的你一定发现了，join返会的路径以分隔符"/"结尾，而resolve以目录名结尾。

这是在传入"../../"的情况下，那如果直接传入目录名呢？
```
const urlJoinPersonal = path.join(urlJion,"./personal/");
const urlResolvePersonal = path.resolve(urlResolve,"./personal/");

console.log(urlJoinPersonal,urlResolvePersonal);
//urlJoinPersonal: /Users/frank/Desktop/personal/
//urlResolvePersonal: /Users/frank/Desktop/personal

```
path.join会始终保留路径原来的模样，预留一个空间。path.resolve会自动把多余的/去掉，从而保证是一个有效的目录。

因此我们可以做出总结：
- path.join适用于目录中确定有较多文件时，从而进行规范化，它得到的可以是filepath或者filepath + "/"。
- path.resolve适用于访问特定的确定的目录，从而保证绝对路径，它得到的只能是filepath。

#### path.join()
主要用于**规范化路径**。

- 参数是[...paths]，path类型必须为string
- 根据最后出现的"/" 分隔符进行拼接path 片段
- 零宽字符串返回 "."，表示当前目录
```
path.join('/foo', 'bar', 'baz/asdf', 'quux', '..');
// Returns: '/foo/bar/baz/asdf'
path.join('foo', {}, 'bar');
// throws 'TypeError: Path must be a string. Received {}'
```
#### path.resolve()
主要用于返回**绝对路径**。

- path.resolve()方法可以将路径解析成绝对路径
- 传入路径从右至左解析，遇到第一个绝对路径是完成解析，例如path.resolve('/foo', '/bar', 'baz') 将返回 /bar/baz
- 如果传入的绝对路径不存在，没有传参，或者没有"/"时，当前目录将被返回

```
path.resolve('/foo/bar', './baz');
// Returns: '/foo/bar/baz'

path.resolve('/foo/bar', '/tmp/file/');
// Returns: '/tmp/file'

path.resolve('wwwroot', 'static_files/png/', '../gif/image.gif');
// if the current working directory is /home/myself/node,
// this returns '/home/myself/node/wwwroot/static_files/gif/image.gif'
```

关于path.join与path.resolve，部门老大刚才从源码角度带着我理解了一波，源码地址在这里：https://github.com/nodejs/node/blob/master/lib/path.js

### process.cwd()
由上面的path.js源码拓展出一个process.cwd()的问题。

老大说：
- 正常情况下，process.cwd()返回的是当前的工作目录。也就是最顶级的node index.js的路径。不一定是文件所在路径。
-  但是在使用pm2监控进程时，process.cwd()返回的是process.json的路径，并不是启动文件index.js或者app.js的路径。

由于工科男的执着，我们对上面的结论做两次实验：
#### 普通实验
```
-path
  -dir
      foo.js
      bar.js
  index.js
```
index.js
```
const foo = require('./dir/foo');
const bar = require('./dir/bar');

console.log("dir/foo.js:",foo);
console.log("dir/bar.js:",bar);
console.log("index.js",process.cwd())
```
foo.js
```
function foo (){
    return process.cwd();
}
module.exports = foo();
```
bar.js
```
function bar (){
    return process.cwd();
}
module.exports = bar();
```
```
node index.js
```
输出结果：
```
dir/foo.js: /Users/frank/Desktop/path
dir/bar.js: /Users/frank/Desktop/path
index.js /Users/frank/Desktop/path
```

实验表明，`正常情况下，process.cwd()返回的是当前的工作目录。也就是最顶级的node index.js的路径。不一定是文件所在路径。`正确。

#### PM2实验
能力有限，未完待续。

### fs.readFile()与fs.readFileSync()有什么区别？
二者返回的结果都是目录下文件名数组，最为关键的地方在于Sync关键字。在nodejs中，有大量的*Sync类型的标准库api，就拿fs来说，就有下面这么多。

| without sync  | with sync |
| ------------- | ------------- |
| fs.access  | fs.accessSync  |
| fs.appendFile  | fs.appendFileSync  |
| fs.chmod  | fs.chmodSync  |
| fs.chown  | fs.chownSync  |
| fs.close  | fs.closeSync  |
| fs.copyFile  | fs.copyFileSync  |
| fs.exists  | fs.existsSync  |
| fs.fchmod  | fs.fchmod Sync  |
| fs.fchown  | fs.fchownSync  |
| fs.fdatasync  | fs.fdatasyncSync  |
| fs.fsync  | fs.fsyncSync  |
| fs.ftruncate  | fs.ftruncateSync  |
| fs.futimes  | fs.futimesSync  |
| fs.lchmod  | fs.lchmod Sync  |
| fs.lchown  | fs.lchownSync  |
| fs.link  | fs.linkSync  |
| fs.lstat  | fs.lstaSync  |
| fs.mkdir  | fs.mkdirSync  |
| fs.mkdtemp  | fs.mkdtempSync  |
| fs.open  | fs.openSync  |
| fs.readdir  | fs.readdirSync  |
| fs.readFile  | fs.readFileSync  |
| fs.readlink  | fs.readlinkSync  |
| fs.realpath  | fs.realpathSync  |
| fs.realpath.native  | fs.realpath.nativeSync  |
| fs.rename  | fs.renameSync  |
| fs.rmdir  |  fs.rmdir Sync  |
| fs.stat  |fs.statSync  |
| fs.symlink  | fs.symlinkSync  |
| fs.truncate  | fs.truncateSync  |
| fs.unlink  | fs.unlinkSync  |
| fs.utimes  | fs.utimesSync  |
| fs.writeFile  | fs.writeFileSync  |

*Sync 类型的是同步函数，它们会立即返回一个值，而其它的是异步函数，返回的是undefined，但是可以接收一个callback去处理它们的响应。

拿fs.readFile与fs.readFileSync来说。
```
# 同步 synchronous
data = fs.readFileSync ( filename )
# 现在我就可以使用data了
console.log ( data )
```
```
# 异步 asynchronous
fs.readFile ( filename, (err, data) =>{
  # 现在data变量在回调函数上下文中是可用的
  # **但是在fs.readFile函数的上下文中是不可调用的**
  console.log(data)
})
```
虽然同步的方式比较直观，但是对于在node进程同步读取文件的时候，进程处于阻塞状态，不能去做其它事情。而采用异步的方式是非常畅通的。

再来想个问题：为什么不把fs.readFile写成fs.readFileAsync，这样更直观啊？

因为在nodejs的场景中，会大量用到异步的场景，这也是node的优势所在，相比fs.readFileAsync，fs.readFile的写法更简洁，少写了5个字母，可以略微提升coding的速度。

- nodejs中同步的方式不好吗？
运行时不太好，启动时很有必要。
在node应用的启动过程中，有些操作必须是同步阻塞的，因为后面的一些require需要保证被require的对象的存在，才能进行后续的操作。举个例子来说，应用启动可能需要mkdir，可能需要遍历目录，而这些操作必须是同步的。

- nodejs运行时不能使用同步吗？
不完全是。
如果一定要使用同步阻塞的方式，避免在阻塞主线程，可以使用child_process.fork，去开一个子线程，使用事件订阅发布的形式实现多线程通信。