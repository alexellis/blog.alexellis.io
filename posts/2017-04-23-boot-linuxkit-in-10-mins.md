---
title: "Boot an OpenSSH server in 10 mins with LinuxKit"
slug: "boot-linuxkit-in-10-mins"
date: "2017-04-23T11:30:43Z"
author: "Alex Ellis"
meta_title: "Boot an OpenSSH server in 10 mins with LinuxKit"
meta_description: "LinuxKit builds bootable Linux systems that can run on many targets and load in seconds. Get started in 10 mins with an SSH server as an appliance"
tags:
  - "vm"
  - "systems"
  - "docker"
  - "hyperkit"
  - "linuxkit"
---

In this post we'll get hands-on and use Docker's LinuxKit to build, run and connect to a bootable Linux system image with OpenSSH. You will need Docker for Mac for this example, but LinuxKit can create images bootable on many types of system.

> Edit: Thanks to Mike Coleman for highlighting [a change](https://github.com/linuxkit/linuxkit/pull/1695) since the blog was published. This tutorial now uses two CLIs - `moby` to build bootable images and `linuxkit` to start them up.

![](/content/images/2017/04/sshd_starbucks.jpg)
*Photo: Running LinuxKit for the first time in Starbucks in Austin during Dockercon*

LinuxKit is an exciting new project spun out of Docker's internals. It is designed to build bootable Linux systems that can run on bare-metal, the cloud, in a Docker container or through HyperKit (the Hypervisor used for Docker for Mac). A very small init process starts the system, then everything else is run through containers via containerd. 

> [containerd](https://containerd.io) is Docker's low-level container technology.

![](https://avatars3.githubusercontent.com/u/27256246?v=3&s=200)

**Get hands-on in 10 minutes**

* Install and configure `go` from [https://golang.org/dl/](https://golang.org/dl/)
* Install and start [Docker for Mac](https://www.docker.com/get-docker) - pick the **Edge edition** (I have 17.05.0-ce-rc1-mac8)

I want to show you how to build and run an SSHD server in around 10 minutes. We'll be using an example that was demo'd in the general session at Dockercon by [Rolf Neugebauer](https://github.com/rneugeba)

### Let's get started

First pull the code down for LinuxKit and build it.

```
# git clone https://github.com/linuxkit/linuxkit
```

Now head over to the directory and initiate a `make`:

```
# cd $GOPATH/src/github.com/linuxkit/linuxkit
# make
```

You'll see output like this:

```
tar cf - vendor src/initrd src/pad4 -C src/cmd/moby . | docker run --rm --net=none --log-driver=none -i -e GOOS=darwin -e GOARCH=amd64 linuxkit/go-compile:4513068d9a7e919e4ec42e2d7ee879ff5b95b7f5@sha256:bdfadbe3e4ec699ca45b67453662321ec270f2d1a1dbdbf09625776d3ebd68c5 --package github.com/linuxkit/linuxkit --ldflags "-X main.GitCommit=90d459a82eac9111a08795d6e2a89f32c270e41e -X main.Version="0.0" " -o bin/moby > tmp_moby_bin.tar
gofmt...
govet...
golint...
ineffassign...
go build...
tar xf tmp_moby_bin.tar > bin/moby
rm tmp_moby_bin.tar
touch bin/moby
tar cf - vendor -C src/cmd/infrakit-instance-hyperkit . | docker run --rm --net=none --log-driver=none -i -e GOOS=darwin -e GOARCH=amd64 linuxkit/go-compile:4513068d9a7e919e4ec42e2d7ee879ff5b95b7f5@sha256:bdfadbe3e4ec699ca45b67453662321ec270f2d1a1dbdbf09625776d3ebd68c5 --package github.com/linuxkit/linuxkit -o bin/infrakit-instance-hyperkit > tmp_infrakit_instance_hyperkit_bin.tar
gofmt...
govet...
golint...
ineffassign...
go build...
tar xf tmp_infrakit_instance_hyperkit_bin.tar > bin/infrakit-instance-hyperkit
rm tmp_infrakit_instance_hyperkit_bin.tar
touch bin/infrakit-instance-hyperkit
```

This is building two new CLIs called `moby` and `linuxkit` which can then be used to create and start a bootable system.

Install the new `moby` and `linuxkit` CLI:

```
sudo cp ./bin/moby /usr/local/bin
sudo cp ./bin/linuxkit /usr/local/bin
```

**Build the SSHD example**

I've put together a [sshdkit Github repository](https://github.com/alexellis/sshdkit) with some utility scripts, we'll clone that into the current folder and use it for the rest of this post.

```
# git clone https://github.com/alexellis/sshdkit
# cd sshdkit
```

Put your public SSH key into the YAML file:  

```
# cp sshd.example.yml sshd.yml
```

First of all edit the `sshd.yml` sample file and put your ssh key into the slot that says `root/.ssh/authorized_keys`:

```
  - path: root/.ssh/authorized_keys
    contents: "ssh-rsa ...."
```

Your ssh key will be found in $HOME/.ssh/id_rsa.pub, if that file is missing then type in `ssh-keygen` and hit enter to all the questions.

Now build a bootable system:

```
# moby build ./sshd.yml
```

You'll see the `moby` CLI tool will pull down various images down and then construct one final package including a recent Linux kernel.

```
Extract kernel image: linuxkit/kernel:4.9.x
Add init containers:
Process init image: linuxkit/init:63eed9ca7a09d2ce4c0c5e7238ac005fa44f564b
Process init image: linuxkit/runc:b0fb122e10dbb7e4e45115177a61a3f8d68c19a9
Process init image: linuxkit/containerd:18eaf72f3f4f9a9f29ca1951f66df701f873060b
Process init image: linuxkit/ca-certificates:eabc5a6e59f05aa91529d80e9a595b85b046f935
Add onboot containers:
  Create OCI config for linuxkit/sysctl:2cf2f9d5b4d314ba1bfc22b2fe931924af666d8c
Add service containers:
  Create OCI config for linuxkit/rngd:3dad6dd43270fa632ac031e99d1947f20b22eec9
  Create OCI config for linuxkit/dhcpcd:48e249ebef6a521eed886b3bce032db69fbb4afa
  Create OCI config for linuxkit/sshd:e108d208adf692c8a0954f602743e0eec445364e
Add files:
  root/.ssh/authorized_keys
Create outputs:
  sshd-bzImage sshd-initrd.img sshd-cmdline
  sshd.iso
  sshd-efi.iso
```

You will see several system images created in the current folder:

```
Create outputs:
  sshd-bzImage sshd-initrd.img sshd-cmdline
  sshd.iso
  sshd-efi.iso
```

**Boot the system**

Now go ahead and type in the following and watch a full Linux system boot up in your terminal. When it's ready you will be connected to a BusyBox shell and can type in commands.

> This is going to be leveraging the HyperKit project as a hypervisor. To close the VM down - type in `halt` when you are ready.

```
# linuxkit run -ip 192.168.65.100 sshd
```

```
Welcome to LinuxKit
/ # INFO[0000] starting containerd boot...                   module=containerd
...
INFO[0000] containerd successfully booted in 0.022888s   module=containerd
 - 000-sysctl
 - dhcpcd
 - rngd
 - sshd

/ # 
```

We're also allocating a static IP address so we can access it later.

The easiest way to access the SSHD VM we started in HyperKit is by running a Docker container with the SSH client and your SSH keys baked-in.

Use the included utility script to build that Docker image:

```
# ./build.sh
```

Now run the Docker container which is an Alpine Linux image with SSHD added and your SSH keys mounted:

```
# ./run-client.sh
/ #
```

From this Docker container we can connect with the `ssh` client into the SSHD VM:

```
/ # ssh root@192.168.65.100

Welcome to LinuxKit 
moby-025000000002:~# cat /etc/os-release 
NAME="Alpine Linux"
ID=alpine
VERSION_ID=3.5.0
PRETTY_NAME="Alpine Linux v3.5"
HOME_URL="http://alpinelinux.org"
BUG_REPORT_URL="http://bugs.alpinelinux.org"

moby-025000000002:~# uname -a
Linux moby-025000000002 4.9.22-moby #1 SMP Fri Apr 14 12:32:33 UTC 2017 x86_64 Linux
```

As you can see this system is running `containerd` and `runc`:

```
moby-025000000002:~# ps |grep containerd
  356 root       0:00 /usr/bin/containerd

...

moby-025000000002:~# ps |grep runc
  392 root       0:00 /usr/bin/runc run --bundle /containers/services/dhcpcd --pid-file /run/dhcpcd.pid dhcpcd
  408 root       0:00 /usr/bin/runc run --bundle /containers/services/rngd --pid-file /run/rngd.pid rngd
  420 root       0:00 /usr/bin/runc run --bundle /containers/services/sshd --pid-file /run/sshd.pid sshd
```

**Boot multiple SSH Server VMs:**

You can boot additional systems by allocating them a separate IP address. This is the contents of the boot.sh file (`linuxkit run -ip 192.168.65.100 sshd`):

Boot with a unique IP:

```
# linuxkit run -ip 192.168.65.101 sshd
```

On my 2016 entry-level Macbook 12" this took around 4-5 seconds, which feels blisteringly fast.

You can now connect to either or both of those SSHD servers at once.

```
/ # ssh root@192.168.65.100 uptime
 10:45:39 up 29 min,  load average: 0.00, 0.02, 0.00

/ # ssh root@192.168.65.101 uptime
 10:45:40 up 1 min,  load average: 0.00, 0.00, 0.00
/ # 
```

### Wrapping up

This was a very simple example of how to build a bootable image with a useful system service and then connect to it. It feels like the possibilities opened up by this project are endless. I'm really excited to see what people will do with this power and flexibility.

If you're a Google Cloud user, you can boot images there just as easily. PacketHost even enables booting the image we just built on a bare metal server.

* What about a Raspberry Pi?

I think that conceptually LinuxKit could eventually build images for a 32-bit Raspberry Pi architecture, but this will take some tweaking and porting of the Kernel and images used to construct a system. For now the easiest way to get started on a Raspberry Pi is with the Raspbian image and my tutorial series.

* [5 things about Docker on Raspberry Pi](http://blog.alexellis.io/5-things-docker-rpi/)

One of the other cool demos shown on stage was building a similar bootable system image, but with Kubernetes baked-in. So that's Kubernetes on Mac, booted up in seconds. Here's a Tweet from Docker Captain Jesse White:

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Flexing the framework of <a href="https://twitter.com/hashtag/Moby?src=hash">#Moby</a> with <a href="https://twitter.com/kubernetesio">@kubernetesio</a> on containerd, LinuxKit and <a href="https://twitter.com/docker">@docker</a>. <a href="https://twitter.com/DockerNYC">@DockerNYC</a> <a href="https://t.co/i5hpLc6ra1">pic.twitter.com/i5hpLc6ra1</a></p>&mdash; Jesse White (@Jesse_White) <a href="https://twitter.com/Jesse_White/status/854362561919279104">April 18, 2017</a></blockquote> <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

**Where next?**

Rolf and the rest of Docker's Engineering team are building out some very practical examples and instructions for booting these systems on bare metal, Docker and other platforms.

Head over to the LinuxKit repository to try the other examples such as an [OS for Redis](https://github.com/linuxkit/linuxkit/blob/master/projects/demo/redis-os/redis-os.yml) and find out more:

* [linuxkit/linuxkit](https://github.com/linuxkit/linuxkit)

RancherOS is an operating system which uses Docker as its starting point and runs all its system services through Docker containers. LinuxKit works in a very similar way, but leverages containerd instead of Docker directly.

* [RancherOS' thoughts on LinuxKit](http://rancher.com/rancher-moby-project/)

### See also:

See video demos of Moby's Cool Hacks winners during the closing keynote at Dockercon.

[FaaS (Functions as a Service)](http://github.com/alexellis/faas) which is an easy-to-use serverless framework for Docker and Play-with-Docker (an interactive Docker playground for learning and training).

Docker blog: [Moby's Cool Hack winners - recap and live videos](https://blog.docker.com/2017/04/dockercon-2017-mobys-cool-hack-sessions/)