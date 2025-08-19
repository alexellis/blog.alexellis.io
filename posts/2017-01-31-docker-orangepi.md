---
title: "The Orange Pi gets Docker!"
slug: "docker-orangepi"
date: "2017-01-31T21:00:00Z"
author: "Alex Ellis"
meta_title: "Docker on the Orange Pi"
meta_description: "Docker is now available for the Orange Pi using the latest mainline Linux Kernel. Take advantage of this cheap RPi alternative with a fast 1GB / H3 chipset."
tags:
  - "orangepi"
  - "docker"
  - "arm"
---

Docker now functions on the Orange Pi! This is good news for anyone like me who has a couple of these devices gathering dust. I bought them months ago because I wanted to play with something different and hoped to run Docker on them.

> Prior to this point the legacy Linux Kernel (3.4) that was made available lacked the features required to run containers on the H3 chipset.

![](/content/images/2017/01/orange_pi_heatsink_1.jpg)

*Despite the name it's blue, not Orange!*

My Twitter buddy [Sylvain Deauré](https://twitter.com/SylvainDeaure) messaged me a few days ago saying that he'd seen a mainline Linux Kernel available for the Orange Pi and that after flashing an Armbian image that Docker installed and functioned. I wanted to check it out and report back.

The Orange Pi / Pi PC / Pi Zero can normally be found on AliExpress.

**How does this fit in with the Raspberry Pi?**

The Raspberry Pi was clearly the pioneer and leader in this space. The Pi has a thriving community with great support from the Raspberry Pi Foundation and many software vendors.

> That said, the Orange Pi range is cheaper and in some cases just as performant. You can build a cluster and run Docker Swarm at a fraction of the price of Pi Model 2s. YMMV

### Quick start

This is a guide to installing and running Docker 1.13 on the Orange Pi with the new mainline Kernel.

The current downloads page is over here:

* [Orange Pi PC](https://www.armbian.com/orange-pi-pc/)

![](/content/images/2017/01/download_path_1.png)

#### Download and decompress

Pick Mainline 4.9.4 and wait for the download to complete. Unfortunately the image is compressed as "7-zip" which means you will have to install some additional software to decompress.

If you're on Mac, it looks like [Keka](http://www.kekaosx.com/en/) may be your best option for a free tool.

#### Flash the image

I would recommend using [Etcher.io](https://etcher.io) to flash the image, it will do some checking for you after the write. This is especially important if you re-use SD cards or leave them in Pis running 24/7.

#### Power on and `ssh`

The username and password are `root` / `1234` but these could change in the future, so if this doesn't work when you try checkout the downloads page mentioned above.

The Raspberry Pi on initial boot broadcasts an mDNS message which means you can easily locate a Pi and connect to it on your network. It looks like Armbian has this disabled (checked with `mdns-scan`).

Fortunately I ran a network scan before and after plugging in with `nmap`. You can do something like this or go old fashioned and plug a keyboard and HDMI cable in.

```
nmap -sP 192.168.0.0/24
```

> At first login Armbian will ask you to change your password and it will also add a regular user account with `sudo` enabled.

![](/content/images/2017/01/splash.png)

#### Get Docker

The Docker installation method should be the same as per the Raspberry Pi. The H3 chip is technically ARMv7 like the Pi 2.

```
$ uname -a
Linux orangepipc 4.9.4-sun8i #3 SMP Fri Jan 20 22:11:20 CET 2017 armv7l armv7l armv7l GNU/Linux
```

*uname output*

You can follow the guides for the Raspberry Pi, or run this command:

```
$ curl -sSL https://get.docker.com | sh
```

At time of writing, this installed the Docker 1.13 release.
 
```
Server:
 Version:      1.13.0
 API version:  1.25 (minimum version 1.12)
 Go version:   go1.7.3
 Git commit:   49bf474
 Built:        Tue Jan 17 10:24:46 2017
 OS/Arch:      linux/arm
 Experimental: false
```

* [Video: Hands-on Docker for the Raspberry Pi](http://blog.alexellis.io/hands-on-docker-raspberrypi/)

* [Getting started with Docker on the Pi](http://blog.alexellis.io/getting-started-with-docker-on-raspberry-pi/)

#### Get hacking

So now you have Docker installed on your Orange Pi you'll want to start hacking and building images. 

**Docker Images**

The good news is that the images built for the Raspberry Pi will work fine. Check out my `docker-arm` repository and send in PRs if you see something missing. 

* [alexellis/docker-arm](https://github.com/alexellis/docker-arm/tree/master/images/armhf)

Also check out the semi-official `armhf` user on the Docker Hub run by a contributor to the Docker project. 

* https://hub.docker.com/r/armhf/

As an example you can try out my Minio image [minio-armhf](https://hub.docker.com/r/alexellis2/minio-armhf/) which I built on a Pi 2. It provides you with an S3 file-server server you can host yourself.

**Best base images**

You may find that for compatibility reasons a Debian-style image is best for you, in which case use `resin/rpi-raspbian`.

If you want a tiny image, then check out Alpine Linux which has the base of `armhf/alpine:latest`. When compressed, this is less than 2MB in total size. Its packages will be more up to date than Raspbian, but not cutting edge - Node.js is version 6.7 and Golang is version 1.6.3.

To install a package on Alpine type in `apk add --update nodejs`. A full list of ARM packages is available here: 

* [Alpine armhf packages](https://pkgs.alpinelinux.org/packages?name=&branch=&repo=&arch=armhf&maintainer=)

#### Related reading

I'll finish here, with an addendum around experimental or untested features. It's important to remember that the Pi is largely compatible with the Orange Pi. You can build and run images on either and in the future probably create a hybrid cluster or swarm.

* [Docker Swarm on RPi deep dive](http://blog.alexellis.io/live-deep-dive-pi-swarm/) *(as featured on hackaday.com)*

* [Golang basics - fetch JSON from an API](http://blog.alexellis.io/golang-json-api-client/)

* [The entire Raspberry Pi blog series](http://blog.alexellis.io/tag/raspberry-pi/)

#### Addendum: experimental
**Swarm Mode**

The Kernel includes an important `vxlan` module which enables overlay networking. I was able to create a swarm with 2x Pi 2s and 2x Orange Pi PCs and then deploy a set of Docker services.

It would be great to get some feedback if you could run through the example below.

Quick example:

```
$ docker swarm init
$ docker service create --name nginx --mount type=bind,source=/etc/hostname,target=/var/lib/nginx/html/index.html --publish 80:80 alexellis2/nginx-armhf:latest
```

Wait for the state to go from Preparing to Running.

```
$ watch docker service ps nginx
$ curl -4 localhost
orangepipc
```

Curl will return the hostname of each node in your swarm.

If you want to take this further, then try out the  [alexellis/swarmmode-tests](https://github.com/alexellis/swarmmode-tests/tree/master/arm) which I put together to verify Docker Swarm on the Pi itself several months ago.

**Checking compatibility**

The following script from the Docker project will check various Kernel features to see whether any changes need to be made to support Docker and Swarm Mode fully.

* [docker/check-config.sh](https://raw.githubusercontent.com/docker/docker/master/contrib/check-config.sh)

It reads the `config.tgz` file which is generated when a Kernel is built, but note that this is not always available on every system. 

**AUFS**

During the Docker install there was an error message about AUFS missing. I'd say this is OK as the Docker team have recommended using Overlay or Overlay2 as a storage back-end.

```
modprobe: FATAL: Module aufs not found in directory /lib/modules/4.9.4-sun8i
Warning: current kernel is not supported by the linux-image-extra-virtual
 package.  We have no AUFS support.  Consider installing the packages
 linux-image-virtual kernel and linux-image-extra-virtual for AUFS support.
```