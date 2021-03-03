---
title: docker安装Jenkins
date: '2021-03-03 13:22'
sidebar: 'auto'
categories:
 - centos
tags:
 - devops
sticky: 1
---

```bash
mkdir -p ~/my-jenkins
tee ~/my-jenkins/Dockerfile <<-'EOF'
FROM jenkins/jenkins:lts
USER root
ARG dockerGid=1001
RUN echo "docker:x:${dockerGid}:jenkins" >> /etc/group
RUN echo "jenkins ALL=NOPASSWD: ALL" >> /etc/sudoers
# 设置时区
RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
RUN echo 'Asia/Shanghai' > /etc/timezone
EOF

tee ~/my-jenkins/myJenkins.sh <<-'EOF'
#！/bin/bash
# chown -R 1000 /var/jenkins_home 修改目录权限
docker stop auto-jenkins || true
docker rm auto-jenkins || true
docker rmi auto-jenkins || true
docker build . -t auto-jenkins
docker run --restart=unless-stopped --name auto-jenkins -d -p 8088:8080 -p 50000:50000 -v /var/jenkins_home:/var/jenkins_home -v /var/run/docker.sock:/var/run/docker.sock -v $(which docker):/usr/bin/docker -v /usr/lib64/libltdl.so.7:/usr/lib/x86_64-linux-gnu/libltdl.so.7 auto-jenkins
EOF

cd ~/my-jenkins
docker stop auto-jenkins || true
docker rm auto-jenkins || true
docker rmi auto-jenkins || true
docker build . -t auto-jenkins
docker run --restart=unless-stopped --name auto-jenkins -d -p 8088:8080 -p 50000:50000 -v /var/jenkins_home:/var/jenkins_home -v /var/run/docker.sock:/var/run/docker.sock -v $(which docker):/usr/bin/docker -v /usr/lib64/libltdl.so.7:/usr/lib/x86_64-linux-gnu/libltdl.so.7 auto-jenkins
```
