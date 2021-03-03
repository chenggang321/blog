---
title: docker安装禅道
date: '2021-03-03 13:22'
sidebar: 'auto'
categories:
 - centos
tags:
 - devops
sticky: 1
---

```shell script
#安装禅道
docker pull easysoft/zentao
docker run --name zentao2 -p 8080:80  -v /www/zentaopms:/www/zentaopms -v /www/mysqldata2:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=cg@_@cg -d easysoft/zentao
```
