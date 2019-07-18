# Kubernetes

## Creating Master node

1. Check the apt installation source for the following configuration, using Aliyun's system and Kubernetes's source.

```bash
$ vim /etc/apt/sources.list
# 系统安装源
deb http://mirrors.aliyun.com/ubuntu/ xenial main restricted
deb http://mirrors.aliyun.com/ubuntu/ xenial-updates main restricted
deb http://mirrors.aliyun.com/ubuntu/ xenial universe
deb http://mirrors.aliyun.com/ubuntu/ xenial-updates universe
deb http://mirrors.aliyun.com/ubuntu/ xenial multiverse
deb http://mirrors.aliyun.com/ubuntu/ xenial-updates multiverse
deb http://mirrors.aliyun.com/ubuntu/ xenial-backports main restricted universe multiverse
# kubeadm及kubernetes组件安装源
deb https://mirrors.aliyun.com/kubernetes/apt kubernetes-xenial main
```

2. Install Docker
```bash
$ sudo apt-get install docker.io
```

3. Update the source, ignoring the GPG error information. Force the installation of kubeadm, kubectl, kubelet packages.
```bash
$ sudo apt-get update && sudo apt-get install -y kubelet kubeadm kubectl --allow-unauthenticated
```

4. init the master
```bash
$ sudo kubeadm init --pod-network-cidr=10.244.0.0/16 --apiserver-advertise-address=10.0.0.60
```

5. Execute the following command to configure kubectl.
```bash
$ mkdir -p $HOME/.kube
$ sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
$ sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

6. Canal
```bash
$ kubectl apply -f https://docs.projectcalico.org/v3.1/getting-started/kubernetes/installation/hosted/canal/rbac.yaml
$ kubectl apply -f https://docs.projectcalico.org/v3.1/getting-started/kubernetes/installation/hosted/canal/canal.yaml

```
## Slave join

```bash
$ sudo kubeadm join 192.168.0.200:6443 --token {{token}}--discovery-token-ca-cert-hash sha256:{{sha}}
```

## About docker images

Using other developers' pushed images on dockerhub.

https://hub.docker.com/u/imdingtalk

## About docker cgroup driver

Modify or create / etc / docker / daemon. JSON by adding the following:
```json
{
  "exec-opts": ["native.cgroupdriver=systemd"]
}
```

Then restart docker.