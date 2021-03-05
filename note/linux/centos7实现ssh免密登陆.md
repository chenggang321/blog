---
date: 2021-03-04 14:30
title: centos7实现ssh免密登陆
categories:
  - centos
tags:
  - centos
---

一、serverA 免密登录 serverB 原理

1.  首先在 serverA 上生成一对秘钥（ssh-keygen）
2.  将公钥拷贝到 serverB，重命名 authorized_keys
3.  serverA 向 serverB 发送一个连接请求，信息包括用户名、ip
4.  serverB 接到请求，会从 authorized_keys 中查找，是否有相同的用户名、ip，如果有 serverB 会随机生成一个字符串  

    然后使用使用公钥进行加密，再发送个 serverA

5.  serverA 接到 serverB 发来的信息后，会使用私钥进行解密，然后将解密后的字符串发送给 serverB
6.  serverB 接到 serverA 发来的信息后，会给先前生成的字符串进行比对，如果一直，则允许免密登录

二、Centos7 默认安装了 ssh服务

三、启动 ssh 服务

```
# 查看 ssh 状态
systemctl status sshd
# 启动 ssh
systemctl start sshd
# 停止 ssh
systemctl stop sshd
```

四、serverA 生成秘钥，遇到提示直接敲回车即可

```
ssh-keygen
```

五、将serverA 公钥复制到 serverB 文件authorized_keys中

六、用serverA 免密连接 serverB
