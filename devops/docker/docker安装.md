---
title: docker在线安装
date: '2021-03-03 13:22'
sidebar: 'auto'
categories:
 - centos
tags:
 - devops
sticky: 1
---

```bash
curl -o /etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-7.repo
yum clean all
yum makecache
yum install -y yum-utils device-mapper-persistent-data lvm2
yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
yum install docker-ce docker-ce-cli containerd.io -y
mkdir -p /etc/docker/
tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": ["https://eas36iwd.mirror.aliyuncs.com"]
}
EOF
systemctl start docker
systemctl enable docker
docker info
```
