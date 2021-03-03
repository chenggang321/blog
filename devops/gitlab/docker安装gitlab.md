---
title: docker安装gitlab
date: '2021-03-03 13:22'
sidebar: 'auto'
categories:
 - centos
tags:
 - devops
sticky: 1
---

```bash
#安装gitlab
docker run \
 -itd  \
 -p 9980:80 \
 -p 9922:22 \
 -v ~/gitlab/etc:/etc/gitlab  \
 -v ~/gitlab/log:/var/log/gitlab \
 -v ~/gitlab/opt:/var/opt/gitlab \
 --restart always \
 --privileged=true \
 --name my-gitlab \
 gitlab/gitlab-ce
 
 #进入容器
 docker exec -it my-gitlab /bin/bash
 #重启gitlab配置
 gitlab-ctl reconfigure
 
vi /opt/gitlab/embedded/service/gitlab-rails/config/gitlab.yml
# 调整配置
host: 192.168.1.194
port: 9980
https: false
ssh_host: 192.168.1.194

# 重启gitlab
gitlab-ctl restart 
 
 #退出容器
 exit
 
 192.168.1.194:9980
 
 移除
 docker stop my-gitlab || true
 docker rm my-gitlab || true
 docker rmi my-gitlab || true
```
