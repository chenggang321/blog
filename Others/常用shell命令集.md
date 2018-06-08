- mac OS
- Linux
- windows

### mac OS
`ls -A` 查看包含隐藏文件的所有文件，不包含. .. 。
`ls -a`查看包含隐藏文件的所有文件，包含. .. 。
`chmod 4755 filename`赋予文件root权限
`man command` 查看命令详情
`ls -l`查看文件(夹)权限
`ls -al`查看包含隐藏文件的所有文件的文件名和属性
`ls -lT`查看完整的文件最后修改日期
`groups`当前用户所属组
`groups username`用户所属组
`whoami`当前用户
`chgrp group filename`修改文件所属组，用户需要在对应的组内
` cat /private/var/db/dslocal/nodes/Default/users/root.plist` 用户详细信息
`ls -l *.sh`罗列以.sh结尾的文件
`unzip apache-maven-3.5.3-bin.zip`  解压zip文件
`tar xzvf apache-maven-3.5.3-bin.tar.gz`解压tar文件
`vim .bash_profile`修改环境变量配置文件
`mkdir -p`创建嵌套目录，假设foo不存在，mkdir foo/bar报错，mkdir -p foo/bar 正常。权限为0777。
`echo $HOME`打印当前用户的目录。
`diff a.txt b.txt -y -W 50 `比较两个文件的异同。

### Linux
《鸟哥的Linux私房菜》是本好书

![image](https://user-images.githubusercontent.com/19262750/39347893-7c5c475c-4a27-11e8-878a-072cf8173d44.png)

**1.选择Linux图形用户界面还是Linux命令行界面？**

Linux命令行界面，原因是因为图形用户界面是构建在命令行界面之上的。更进一步，这也意味着在命令行里可以十分便捷的管理和访问Linux的文件系统。ubuntu开启命令行程序的命令是：ctrl+alt+f1（f1~f6）,可开启6个。

**2.目录和文件系统**

①树形结构。

②最上层是/，也叫根目录。

③一切皆为文件：硬盘，分区，可插拔介质，因此所有都在根目录中。

例如：/home/jebediah/cheeses.odt 给出了正确的完整路径，它指向 cheeses.odt 文件，而该文件位于 jebediah 目录下，该目录又位于 home 目录，最后，home 目录又位于根(/) 目录下。

④根目录（/）下，有一组重要的系统目录，大多数linux中都如此用。

**3.权限**

①Linux系统上所有文件都有权限。

②超级用户root，可以访问系统上的任意文件。

③文件有，访问限制，用户限制，隶属于某个用户或者组。

④权限优先级保护：用户user>组group>其他other

⑤实际权限包括：读read，写write，可执行execute

⑥编辑文件或目录权限方法：打开 位置 → 主文件夹 并在文件或者目录上单击右键。然后选择 属性。授权信息就在 权限 标签页中，如果您是该文件的所有者，您可以编辑所有的授权等级。

**4.root用户和sudo命令**

①第一个创建的用户账号，拥有sudo权限

②Ubuntu 上并不包含 root 用户，而是将管理员权限授予特定用户，他们可以使用 "sudo" 应用程序来执行管理任务。

③短时间内 sudo 会记得您输入过的密码。

④使用root终端 sudo -i

⑤图形界面工具默认使用sudo

**5.终端**

    又叫文件浏览器，终端又叫命令行或者shell，过去，这就是人机交互的方式。即便现在，Linux用户仍然觉得shell比图形方式更加方便。
