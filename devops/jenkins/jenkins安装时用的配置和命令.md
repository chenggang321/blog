---
title: jenkins安装时用的配置和命令
date: '2021-03-03 13:22'
sidebar: 'auto'
categories:
 - centos
tags:
 - devops
sticky: 1
---

```bash
# Jenkins 插件国内镜像
https://mirrors.tuna.tsinghua.edu.cn/jenkins/updates/update-center.json

# node 阿里镜像
https://npm.taobao.org/mirrors/node/
curl -O https://cdn.npm.taobao.org/dist/node/latest-v15.x/node-v15.3.0-linux-x64.tar.gz
tar -xvzf node-v15.3.0-linux-x64.tar.gz

# 修改文件权限
chmod -R 777 dirPath

# yum 阿里源
curl -o /etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-7.repo
yum clean all
yum makecache

# docker安装
1.更新yum包
yum update
2.安装需要的软件包， yum-util 提供yum-config-manager功能，另外两个是devicemapper驱动依赖的
yum install -y yum-utils device-mapper-persistent-data lvm2
3.设置yum源，官方太慢，用阿里云的
yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
4.安装docker
yum install docker-ce docker-ce-cli containerd.io -y
5.设置镜像仓库源为国内
mkdir -p /etc/docker/
tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": ["https://eas36iwd.mirror.aliyuncs.com"]
}
EOF
7.启动Docker，命令：systemctl start docker，然后加入开机启动，如下
systemctl start docker
systemctl enable docker
重启docker
systemctl restart docker
8.查看docker信息
docker info

9 启动网络转发

查看网络转发是否启动
cat /proc/sys/net/ipv4/ip_forward
开启
echo "net.ipv4.ip_forward = 1" >> /etc/sysctl.conf
生效
sysctl -p 

# 关闭防火墙
systemctl stop firewalld && systemctl disable firewalld
查看防火墙状态
iptables -L -n
重启docker
systemctl restart docker

# 配置防火墙
# 查看防火墙配置
firewall-cmd --list-all 
# 查询端口是否开放
firewall-cmd --query-port=8080/tcp
# 开放80端口
firewall-cmd --permanent --add-port=80/tcp
# 关闭端口
firewall-cmd --permanent --remove-port=8080/tcp
#重启防火墙(修改配置后要重启防火墙)
firewall-cmd --reload

# 参数解释
1、firwall-cmd：是Linux提供的操作firewall的一个工具；
2、--permanent：表示设置为持久；
3、--add-port：标识添加的端口；

#开启ssh
systemctl start sshd
开机自启动
systemctl enable sshd.service
```

