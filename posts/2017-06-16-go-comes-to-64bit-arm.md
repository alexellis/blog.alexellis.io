---
title: "Go 1.9 Beta 1 comes to 64-bit ARM"
slug: "go-comes-to-64bit-arm"
date: "2017-06-16T17:41:57Z"
author: "Alex Ellis"
meta_title: "Go 1.9 comes to 64-bit ARM"
meta_description: "The Go project is about to start releasing builds for 64-bit ARM - learn where you can run it and how to get started with this quick guide."
tags:
  - "golang"
  - "armv8"
---

The Go project is planning on releasing binary builds of Golang for 64-bit ARM servers (ARMv8) from Go 1.9 and onwards - but they need our help to test it out.

> If you're new to Go or still learning - [try my Golang fundamentals blog series](http://blog.alexellis.io/tag/golang-basics/).

### Why do we need this?

We started off with official Golang builds for vanilla architectures like 32-bit and 64-bit Intel systems but have now gained a growing list of pre-built binaries available. This even covers the Raspberry Pi.

Having an up-to-date binary package available for ARMv8 will make Go and dependent projects like Docker, Kubernetes and Prometheus easier to work with and maintain.

### Which devices can I test on?

You can test on 64-bit ARM SoCs or cloud instances, here are a few:

**SoC**

* Pine64
* ODroid-C2
* Raspberry Pi 3 (with 64-bit OS)

**Cloud providers**

* Equinix Metal's Type2A bare-metal machine with 2x Cavium ThunderX

Equinix Metal (aka Packet) provides a telco-grade 64-bit ARM machine with 120GB RAM, 96 Cores and 340GB of SSD included.

[View Equinix Metal Pricing](https://metal.equinix.com/product/pricing/)

* Scaleway - ARM64 virtual SSD servers

Scaleway offers virtual SSD servers with between 2 and 8 cores and 2 and 8GB of RAM.

[View Scaleway Pricing](https://www.scaleway.com/)

These are two very different machines, but for a few hours usage neither will cost very much.

### Get Go the quick way

Let's show how to provision a machine on Packet and then install the (unstable) Golang binary for 1.9.

Sign up for a Packet account and then create your server as follows:

![](/content/images/2017/06/select.png)

You can pick the nearest datacenter to you. The Type2A can be very popular - so if one is not available near-by you can select one of the other facilities.

You can click the Manage button to enter any additional SSH keys you need and to setup your cloud-init script. The cloud init can do things like install Docker, monitoring tools or a development environment - so that they are ready when you first log in.

![](/content/images/2017/06/manage_.png)

The provisioning takes a few minutes - unlike AWS or Azure we're actually provisioning a bare-metal machine which means there are no CPU credits, no firewalls and no restrictions. It's all on you.

![](/content/images/2017/06/wait.png)

> We're provisioning a vanilla Ubuntu installation - but Packet also supports booting up custom images over iPXE meaning you can run practically any OS you like.

*Logging in*

By default you need to login as the `root` account using your `ssh` key. If you need it you can also find out what the password is - but only for the first 24-hours. So if you need that make sure you change it or memorize it right away.

```
$ ssh root@147.75.74.62

Welcome to Ubuntu 16.04.2 LTS (GNU/Linux 4.4.0-77-generic aarch64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/advantage

The programs included with the Ubuntu system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Ubuntu comes with ABSOLUTELY NO WARRANTY, to the extent permitted by
applicable law.

root@go-for-it:~# 
```

Download the latest Golang build for ARM64 - at the moment this means clicking on the Unstable set of releases:

* [Go download page](https://golang.org/dl/#unstable)

Let's pull down the archive, make a new directory and extract the Go binary:

```
root@go-for-it:~# wget https://storage.googleapis.com/golang/go1.9beta1.linux-arm64.tar.gz

root@go-for-it:~# mkdir -p /usr/local/go

root@go-for-it:~# tar -xvf go1.9beta1.linux-arm64.tar.gz --strip-components=1 -C /usr/local/go
```

We have to setup some paths:

```
root@go-for-it:~# go
-bash: go: command not found

root@go-for-it:~# /usr/local/go/bin/go version
go version go1.9beta1 linux/arm64
```

Edit your /root/.bashrc file and add the following. Then log out and in again.

```
export PATH=$PATH:/usr/local/go/bin  
export GOROOT=/usr/local/go 
export GOPATH=/root/go
```

You can alter the `GOPATH` to the home directory of another user if you decide to drop root access for trying out Go. 

**Get a project to build**

Before you can download projects using `go get` you should install git:

```
root@go-for-it:~# apt-get update && apt-get install git -qy
```

Now let's download a test [web-server](https://github.com/alexellis/hash-browns) that generates hashes of input strings and build it.

```
root@go-for-it:~# go get -u github.com/alexellis/hash-browns

/usr/local/go/pkg/tool/linux_arm64/link: running gcc failed: exec: "gcc": executable file not found in $PATH
```

Looks like we need `gcc` available - so go ahead and add the `build-essential` package and try again:

```
root@go-for-it:~# apt-get install build-essential -qy
```

Git clone / build:

```
root@go-for-it:~# go get -u github.com/alexellis/hash-browns

root@go-for-it:~# cd $GOPATH/src/github.com/alexellis/hash-browns

root@go-for-it:~/go/src/github.com/alexellis/hash-browns# go build

root@go-for-it:~/go/src/github.com/alexellis/hash-browns# ./hash-browns  &
[1] 14030
```

Try the Golang binary like this:

```
curl localhost:8080/hash -d "hi there" -4
"hi there"
9b96a1fe1d548cbbc960cc6a0286668fd74a763667b06366fb2324269fcabaa4
```

It also has metrics built-in which you can see via:

```
root@go-for-it:~# curl 127.0.0.1:8080/metrics  |grep hash

hash_seconds_sum{code="200"} 0.000102143
hash_seconds_count{code="200"} 1
```

### Wrapping up

For more on learning and using Golang checkout my fundamentals blog series:

* [Golang fundamentals](http://blog.alexellis.io/tag/golang-basics/)
* [Equinix Metal](https://metal.equinix.com)

If you run into any problems please raise an issue on Github on the Go project - [http://github.com/golang/go/issues](http://github.com/golang/go/issues)