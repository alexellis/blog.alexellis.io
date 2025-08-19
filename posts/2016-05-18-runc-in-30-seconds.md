---
title: "runc in 30 seconds"
slug: "runc-in-30-seconds"
date: "2016-05-18T16:57:18Z"
author: "Alex Ellis"
meta_title: "runc in 30 seconds"
meta_description: "Take 30 seconds to try out runc, an Open Container Project tool build on libcontainer, the same battled-hardened tech as the Docker Engine. "
tags:
  - "docker"
  - "runc"
  - "first impressions"
---

![](/content/images/2016/05/Screen-Shot-2016-05-18-at-18-03-19.png)

**runC** is a CLI tool produced through the Open Container Project for spawning and running containers without having to run a Docker daemon. It makes use of libcontainer which powers the Docker Engine.

> *Let's take 30 seconds to try it out.*


What you need:

* runc package or binary installed
* A root filesystem

#### runc package
I'm using Arch Linux which has runc available in the package repository and is installed along with Docker 1.11.

```
$ sudo pacman -Sy runc
```

For Ubuntu 16.04 use `apt`:

```
sudo apt install runc
```

#### rootfs
We can either prepare a root-filesystem from scratch, extract one from a Linux distribution's rootfs.tgz file or export one from a container already run in Docker.

Let's extract a rootfs from a Docker image by running a container, then using `docker export`.

```
$ docker run --name node4 mhart/alpine-node:4 node
$ docker export node4 > rootfs.tar
$ mkdir -p ./rootfs
$ tar -xf rootfs.tar -C ./rootfs
```

Now generate a config file for `runc` and start the container. You will be given a Node.js REPL.

```
$ runc spec
```
Finally, pick a name for the new container and run it as root or sudo - launch `node` and try out a few commands:

```
$ sudo runc start node4_repl
/ # node
> process.version
'v4.4.1'
> 
```

Running the example on my machine:

![](/content/images/2016/05/Screen-Shot-2016-05-18-at-18-00-36.png)
*Running the example in bash.*

#### Learn more

Both runc and Docker make use of libcontainer but have very different CLIs. If you would like to learn more about how to customise runc, add networking and much more then check out the official homepage at: [runc.io](https://runc.io) or the [Github repo](https://github.com/opencontainers/runc).

#### Popular on the blog this week:

* [My Dockercon Hack: IoT Cluster](http://blog.alexellis.io/iot-docker-cluster/) (as re-tweeted by Solomon Hykes, Docker creator)

* [Rapid prototyping a real application with docker-compose](http://blog.alexellis.io/rapid-prototype-docker-compose/)