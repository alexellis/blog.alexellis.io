---
title: "Get started with Docker on 64-bit ARM"
slug: "get-started-with-docker-on-64-bit-arm"
date: "2016-11-18T12:30:00Z"
author: "Alex Ellis"
meta_title: "Get started with Docker on 64-bit ARM"
meta_description: "Looking at the Pine64, Odroid-C2 and Packet.net's 96-core beast. We install Docker on ARMv8 then build and benchmark 64-bit images from scratch."
tags:
  - "docker"
  - "arm64"
  - "armv8"
  - "Getting Started"
  - "tutorial"
---

In this guide we'll get started with Docker on 64-bit ARM, build 64-bit images, benchmark the code and upgrade to the latest version of Docker.

![Odroid C2](/content/images/2016/11/odroid.jpeg)
*Late to the party, here's my Odroid C2.*

Earlier this year Docker started to quietly, semi-officially support the ARM platform and the Raspberry Pi Zero/2/3 boards when running Raspbian. 

> Raspbian is a port of Debian for the armhf architecture and the default operating system for the Raspberry Pi.

Several boards have recently become available which have an ARMv8 or 64-bit architecture. A couple of these are the Pine64 (around 15 USD) and the Odroid-C2 (43 GBP). These boards both have Ubuntu images available so I decided to find out how easy it was to setup Docker and build some test images.

### Installation

If you have either of these two boards here's a deep link to the image download pages for Ubuntu 16.04:

* [Pine64 Ubuntu download link](http://forum.pine64.org/showthread.php?tid=343)

* [Odroid-C2 download mirrors](http://odroid.com/dokuwiki/doku.php?id=en:c2_release_linux_ubuntu)

Once you have flashed the Ubuntu 16.04 image to your Pine64 or Odroid-C2 log in over `ssh` and type in:

```
# apt-get update && apt-get install docker.io
```

> Spoiler alert: curl | sh installation method is not currently working for ARM 64-bit. Use apt-get.

Resulting in:

```
# docker version
Client:
 Version:      1.12.1
 API version:  1.24
 Go version:   go1.6.2
 Git commit:   23cf638
 Built:        Tue, 27 Sep 2016 12:25:38 +1300
 OS/Arch:      linux/arm64

Server:
 Version:      1.12.1
 API version:  1.24
 Go version:   go1.6.2
 Git commit:   23cf638
 Built:        Tue, 27 Sep 2016 12:25:38 +1300
 OS/Arch:      linux/arm64
```

So it seems that the Ubuntu ports repository already contains Docker 1.12.1 (quite a recent version of Docker) - this is a really nice surprise and in most cases this is all you will need to start building and testing images.

[Justin Cormack](https://twitter.com/justincormack) who maintains Alpine Linux suggested trying out the [Alpine 64-bit ARM image](https://hub.docker.com/r/aarch64/alpine/).

```
FROM aarch64/alpine:edge
RUN apk --update add nodejs
CMD ["node"]
```

> Word of caution: the [README.md file on the Docker Hub](https://hub.docker.com/r/aarch64/alpine/) mentions an invalid tag. Right now there isn't even a aarch64/alpine:latest tag, so make sure you are using the edge tag.

```
root@odroid64:~# docker build -t nodejs-armv8 .
root@odroid64:~# docker run -ti nodejs
> process.version
'v6.7.0'
> 
```

Nice, it appears to work really well and the container started quickly too.

Here's a picture of my Pine64 board kindly donated by [Uli Middelberg](https://twitter.com/umiddelberg/) (a follower on Twitter).

![](/content/images/2016/11/pine64.jpeg)
*Limited edition Pine64 developer-board*

#### Trying docker-compose

> Docker Compose has become such a vital tool for defining and linking services that it is likely to become integrated into the `docker` CLI going forward.

When using this installation method (apt-get) you do not get `docker-compose` bundled in with the engine. So let's install `python-pip` and pull down the latest version.

```
# apt-get install -qy python-pip --no-install-recommends
# pip install pip --upgrade
# pip install docker-compose
```

Here's a sample hit-counter built out with Node.js and redis.

```
version: "2"
services:
  redis:
    ports:
      - 6379/TCP
    image: aarch64/redis
  counter:
    ports:
      - 3000/TCP
    image: alexellis2/redis_hit_counter:aarch64
    depends_on:
     - redis
```

Use `docker-compose ps` to find the port where the micro-service is running and then try accessing it with curl.

```
# docker-compose up -d
# docker-compose ps
```

```
           Command               State            Ports          
----------------------------------------------------------------
node app.js                      Up      0.0.0.0:32771->3000/tcp 
docker-entrypoint.sh redis ...   Up      0.0.0.0:32770->6379/tcp 
```

```
# curl -4 localhost:32771
```

I am using `-4` to force ipv4 - some Ubuntu/Debian distributions try to use ipv6 by default due to a new entry in /etc/hosts.

```
root@odroid64:~# curl -4 localhost:32771
{"message":"Ping","count":"4"}
root@odroid64:~#
curl -4 localhost:32771
{"message":"Ping","count":"5"}
root@odroid64:~# curl -4 localhost:32771
{"message":"Ping","count":"6"}
```

Why don't you install apache bench and see how many requests per second you can get out of the application?

```
# apt-get install -qy apache2
# ab -n 1000 -c 10 http://localhost:32771/
```

Here's my results:

```
Time taken for tests:   6.852 seconds
Requests per second:    145.93 [#/sec] (mean)
```

If you have multiple cores then you can scale the application upwards and measure the increase in throughput. For a simple guide to Docker services check out my [Swarm Mode](http://blog.alexellis.io/tag/swarmmode/) series.

#### Enterprise-grade ARM

[Packet.net](https://packet.net) provides a 96-core ARMv8 board costing $0.5/hour. These specifications are nothing like the hubmle (but versatile) Raspberry Pi. It even has 128GB of **ECC RAM** and a huge SSD - it was definitely designed for production workloads.

* 96 Physical Cores @ 2.0 GHz (2 × Cavium ThunderX)
* 128 GB of DDR4 ECC RAM 
* 340 GB of SSD 
* 20Gbps Bonded Network

Why not try spend a few cents trying out Docker on some impressive hardware? I have no affiliation to [Packet.net](https://packet.net) - just admiration for this hardware.

### Upgrading to 1.12.3

Docker 1.12.3 is the *reference* build of 1.12 so we should upgrade as soon as possible to get all the fixes around *Swarm Mode* and *overlay networking*.

Now if you were on a Raspberry Pi (32-bit ARM) you could upgrade to the latest stable release by typing in:

```
curl -ssL get.docker.com | sh
```

I tried this out on all three platforms but was met with a bunch of errors. I pinged some folks on the Docker Community Slack channel in #arm and was assured that some fixes are on the way to support this.

The easiest way to get up to date is to rebuild from Github. Normally we would build with `make deb` and install the resulting Debian package - it turns out that this is currently not working either.

So instead let's create a `tgz` with all the binaries and deploy them over the top of 1.12.1.

* Install screen

This will take a while so install screen with `apt-get`. That way, if you get disconnected `screen -r` will get you back into the terminal.

* Clone the repo and make the binaries

```
# screen
# git clone https://github.com/docker/docker
# cd docker
# git checkout v1.12.3
# make tgz
```

You will find the .tgz in bundles/latest - unzip it directly over the top of 1.12.1 and then restart the service:

```
# tar -xvf ./docker-1.12.3.tgz -C /usr/bin/ --strip-components=1
# systemctl daemon-reload
# systemctl restart docker
```

You will now have the latest Docker version.

#### What about Swarm Mode?

I've only got two ARMv8 boards but was able to provision 5x 96-core hosts on [Packet.net](https://packet.net) which use the Cavium ThunderX chipset. It's no surprise but this incredible machine build the Docker binaries way quicker than my Pine64!

After upgrading to the latest Docker version Swarm Mode worked well for scheduling tasks including inter-service communication between the Node.js and Redis app above. If you're familiar with Swarm Mode, here's my test script:

```
# docker network create --driver=overlay --subnet 20.10.0.0/24 count_redis
# docker service create --name redis --publish 6379:6379 --replicas=1 --network=count_redis aarch64/redis
# docker service create --name counter --publish 80:3000 --mode=global --network=count_redis alexellis2/redis_hit_counter:aarch64
```

#### Final notes:

Please bare in mind that ARMv8 images will need to be rebuilt from scratch just like any armhf or Raspberry Pi images. I have a series you can follow and adapt for ARMv8, just check out the links below.

Keep an eye on the issues over on the Docker repo. Much of the work-arounds here will not be needed after the Docker team resolve the issues with the `curl | sh`.

### Questions, comments, suggestions?

Please get in touch on Twitter [@alexellisuk](https://twitter.com/alexellisuk).

Here are some follow-up links for Docker on ARM.

* [docker-arm images on Github](https://github.com/alexellis/docker-arm)

* [Docker for ARM series](http://blog.alexellis.io/tag/raspberry-pi/)

* [Deep dive testing Docker Swarm on ARM](http://blog.alexellis.io/live-deep-dive-pi-swarm/)