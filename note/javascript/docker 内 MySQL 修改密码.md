---
date: 2021-03-04 14:30
title: docker 内 MySQL 修改密码
categories:
  - javascript
tags:
  - 前端
  - JavaScript
---

第一步 进入docker容器
==============

docker exec -it mysql bash

第二步 进入MySQL数据库
==============

mysql -u root -p

第三步切换数据库mysql,修改密码
==================

use mysql;  
update user set authentication_string=PASSWORD(“xxx”) where User=‘root’;

退出MySQL，退出容器 重启MySQL
====================

docker restart mysql
