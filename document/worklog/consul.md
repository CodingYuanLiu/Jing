# Consul

## 安装

### Linux

> wget https://releases.hashicorp.com/consul/1.5.2/consul_1.5.2_linux_amd64.zip

然后在当前目录会有`consul_1.5.2_linux_amd64.zip`, 注意是 zip,要使用相应的工具进行解压

> unzip -d /usr/local consul_1.5.2_linux_amd64.zip

`-d`　 directory 的意思，将文件解压到/usr/local 目录下

如果提示`-bash: unzip: command not found`, 那么是因为没有安装`zip`工具，这个时候直接用`apt`安装即可

> apt-get instal zip

然后就可以在`bash`下输入 consul 命令啦</br>
如果提示`-bash: consul: command not found`,是因为 bash 没有给这个`consul`建立链接，在`PATH`下也无法找到，这个时候可以简单的给这个`consul`建立一个软链接

> sudo ln -s /usr/local/consul /usr/local/bin/consul

这样在`bash`里输入`consul`就不会出错啦

### 使用
