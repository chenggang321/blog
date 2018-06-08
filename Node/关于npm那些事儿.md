- 常用npm命令总结
- 如何更加优雅地使用npm
- Node与操作系统之间的纠葛

### 常用npm命令小结
- 批量安装包
`npm install`
在package.json中的devDependencies字段中写明依赖的第三方包，然后就可以批量下载第三方包了
- 淘宝node镜像源
`$ npm install -g cnpm --registry=https://registry.npm.taobao.org`
- 更换npm到特定版本号
`npm install npm@版本号`
- mac上管理node版本
`npm install n`
- 只下载dependencies中的模块
`npm install --production`
- windows下的node版本控制工具
[Nodist](https://www.cnblogs.com/darrenji/p/5726342.html)
- 可以搜索出相应的包
`npm search [package]`
- 查看全局安装包
`npm list -g --depth 0`
- 删除全局包
`npm uninstall -g <package>`
- 更新单个全局包
`npm install -g <package>`
- 更新全部全局包
`npm update -g` 需要root权限
- 生成项目文件package.json:
npm init
- 升级npm
`npm install npm -g`
- 查询包详细信息
`npm info <package>`
- 只查看的包的description选项
`npm info <package> description`
- 带上包名字并且查看包的description选项
`npm info <package> name description`
- 设置npm安装包进度的显示和关闭
`npm set progress=true`
- 查看node，npm信息及cli(脚手架)信息
`npm -dd 或npm -ddd`

### 如何更加优雅地使用npm
**- devDependencies与Dependencies区别**
Dependencies`用于开发环境多放置开发依赖，例如jquery等用户需要加载的库；devDependencies用于生产环境多放置前端依赖，例如webpack等开发工具
**- --save和--save-dev的区别**
--save是对生产环境所需依赖的声明(开发应用中使用的框架，库),--save-dev是对开发环境所需依赖的声明(构建工具，测试工具)
**- npm i 是什么意思？**
npm i 是npm install的简写
**- package.json中的proxy是什么？**
默认值为null，类型为url，一个为了发送http请求的代理。如果HTTP__PROXY或者http_proxy环境变量已经设置好了，那么proxy设置将被底层的请求库实现。
这个配置目前我只了解到可以与create-react-app的react-scripts结合使用:[Proxying API Requests in Development](https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#proxying-api-requests-in-development)
可以到我的这篇博文去一探究竟：[如何理解package.json中的proxy字段？](https://github.com/FrankKai/FrankKai.github.io/issues/60)

### Node与操作系统之间的纠葛
**- export命令**
export 命令用于设置或显示环境变量。通过 export 添加的环境变量仅在此次登陆周期内有效。

比如很多时候我们的开发环境和生产环境，就可以通过设置一个临时环境变量来，然后在程序中根据不同的环境变量来设置不同的参数。

设置 NODE_ENV 环境变量。退出 SHELL 时失效
```
$ export NODE_ENV=development
```
查看当前所有环境变量
```
$ export -p 
...
declare -x Apple_PubSub_Socket_Render="/private/tmp/com.apple.launchd.T7FbIu3TKI/Render"
declare -x HOME="/Users/frank"
declare -x LANG="zh_CN.UTF-8"
declare -x LOGNAME="frank"
declare -x NVM_CD_FLAGS=""
declare -x NVM_DIR="/Users/frank/.nvm"
...
```
在 Node.js 代码中判断当前环境是开发环境还是生产环境：
```
if （process.env.NODE_ENV === 'development'） {
    console.log（'开发环境'）;
} else {
    console.log（'生产环境'）;
}
```