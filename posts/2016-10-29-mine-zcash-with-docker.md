---
title: "Get Mining Zcash with Docker in no time"
slug: "mine-zcash-with-docker"
date: "2016-10-29T07:55:57Z"
author: "Alex Ellis"
meta_title: "Get Mining Zcash with Docker in no time"
meta_description: "Learn how Docker can get you up and running - mining Zcash in no time. Based on Bitcoin's code it intends to offer privacy and anonymity."
tags:
  - "docker"
  - "bitcoin"
  - "mining"
  - "zcash"
  - "zerocash"
---

Have you heard of Zcash yet? Here's a quick introduction.

> Zcash is an implementation of the "Zerocash" protocol. Based on Bitcoin's code, it intends to offer a far higher standard of privacy and anonymity through a sophisticated zero-knowledge proving scheme that preserves confidentiality of transaction metadata.

![](/content/images/2016/10/Screen-Shot-2016-10-29-at-08-53-55.png)

## Update: 01-Jan-2018

If you're interested in making a profit from mining crypto-currencies with CPU/GPU then checkout my new project: [mine-with-docker](https://github.com/alexellis/mine-with-docker) and start earning Bitcoin today.

## Original Zcash article

*Disclaimer:* from the [project page](https://github.com/zcash/zcash).

> Zcash is unfinished and highly experimental. Use at your own risk.

### Automate all the things with a Dockerfile

I wanted to try the code but it turns out you have to build the code for yourself - from scratch that you need Ubuntu or Debian on your system. I started to wonder why there was no Dockerfile?

Well I put a quick one together based upon the [official instructions](https://github.com/zcash/zcash):

*This Dockerfile enables the app for work on Windows, Mac, other Linux distro and will be just as at home on a cloud instance or on your laptop.*

```
FROM ubuntu:latest

RUN apt-get update -q && apt-get -qy install \
      build-essential pkg-config libc6-dev m4 g++-multilib \
      autoconf libtool ncurses-dev unzip git python \
      zlib1g-dev wget bsdmainutils automake

WORKDIR /root/
RUN git clone https://github.com/zcash/zcash.git
WORKDIR /root/zcash/
RUN git checkout v1.0.0-rc4
RUN ./zcutil/fetch-params.sh

RUN ./zcutil/build.sh -j$(nproc)
```

[Fork on Github](https://gist.github.com/alexellis/4aa99cb62ba44572488bb958eb2a5fd1)

```
$ docker build -t zcash .
```

At this point you now perform a fully automated build - regardless of whether Ubuntu is installed and running on your base system.

The resulting image had a size of around 4GB, but bare in mind that this also includes the Ubuntu base image in its size. Here's a summary of the layers created:

```
CREATED BY                                      SIZE     
/bin/sh -c ./zcutil/build.sh -j$(nproc)         2.282 GB 
/bin/sh -c ./zcutil/fetch-params.sh             910.2 MB 
/bin/sh -c git checkout v1.0.0-rc4              600.6 kB 
/bin/sh -c #(nop)  WORKDIR /root/zcash/         0 B      
/bin/sh -c git clone https://github.com/zcash   67.2 MB  
/bin/sh -c #(nop)  WORKDIR /root/               0 B      
/bin/sh -c apt-get update -q && apt-get -qy i   433 MB   
```

I would suggest that the Zcash team think about pushing this image to the Docker Hub. It would reduce your build-to-run time from 30-90mins down to the download time. There doesn't appear to be individual secrets or user config in the steps above.

Here's my image if you want to skip ahead and pull it: `docker pull alexellisio/zcash:latest`. It will save waiting for the build to complete.

### Configuring your user

Zcash has an [official video](https://www.youtube.com/watch?v=ZoRFLkZG0zg&feature=youtu.be). Here are the next steps needed once you've built your Docker image.

* Run a container interactively:

```
$ docker run --name zcash -ti zcash /bin/bash
```

* Make a settings file:

```
mkdir ~/.zcash/
cd ~/.zcash/

echo testnet=1 > zcash.conf
echo addnode=testnet.z.cash >> zcash.conf
echo rpcuser=username >> zcash.conf
echo rpcpassword=$(head -c 32 /dev/urandom | base64) >> zcash.conf
```

That just created a strong password and saved your username into a config file.

* Enable mining

```
echo gen=1 >> ~/.zcash/zcash.conf
```

### Start mining!

Now you simply type in `~/zcash/src/zcashd` and watch the stats collect. You can hit (Control + C) at any time to quit.

![](/content/images/2016/10/Screen-Shot-2016-10-29-at-09-30-13.png)

*This screenshot is running Ubuntu on Docker for Mac on a MacBook Air*

If you want to detach from the Docker container, but keep it running hit Control P + Q. You can reattach at any time with `docker attach zcash`

If you want to save the state of your container use the [docker commit](https://docs.docker.com/engine/reference/commandline/commit/) command.

### Additional info

You can get additional info on the mining process at any time by typing in:

```
$ docker exec -ti zcash /root/zcash/src/zcash-cli getinfo

{
    "version" : 1000028,
    "protocolversion" : 170002,
    "walletversion" : 60000,
    "balance" : 0.00000000,
    "blocks" : 0,
    "timeoffset" : 0,
    "connections" : 0,
    "proxy" : "",
    "difficulty" : 1.00000000,
    "testnet" : false,
    "keypoololdest" : 1477728080,
    "keypoolsize" : 101,
    "paytxfee" : 0.00000000,
    "relayfee" : 0.00005000
}

```

The `zcash-cli` command can be used to increase or decrease the amount of cores the miner is using and check whether you have found any blocks.

```
docker exec -ti zcash /root/zcash/src/zcash-cli -help`
```

**Please RT + Share on Twitter:**

Spread the word and share your *Sols/s* rate on Twitter.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Get Mining <a href="https://twitter.com/hashtag/Zcash?src=hash">#Zcash</a> with <a href="https://twitter.com/docker">@docker</a> in no time - on any platform - anywhere <a href="https://t.co/jyOUcleu9P">https://t.co/jyOUcleu9P</a> <a href="https://twitter.com/zcashco">@zcashco</a></p>&mdash; Alex Ellis (@alexellisuk) <a href="https://twitter.com/alexellisuk/status/792274187998138368">October 29, 2016</a></blockquote> <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

### Pooled & cloud mining

**Can I make a profit on my own?**

While your computer on its own can contribute to the ZCash project, it is very unlikely that you will be able to make a profit if you go it alone. A mining pool such as NiceHash will effectively rent your hardware out to perform hashing in a large pool of computers. You get paid a share of the profits. Find out more in the tutorial below.

**Can I Mine in the Cloud?**

Docker will run almost anywhere which means it will also run on the cloud. If you want to save on your electricity bill you could easily set up a powerful node - or a series of nodes and Docker Swarm makes that simple.

> Check out my tutorial on setting up AWS EC2 instances for cloud mining: [Scale and deploy an application on AWS](http://blog.alexellis.io/scale-docker-swarm-on-aws/)


### See also:

* [Deploy & scale your application on AWS with Docker Swarm](http://blog.alexellis.io/scale-docker-swarm-on-aws/)

* [Bring your Windows applications to Docker Containers](http://blog.alexellis.io/tag/windows)

* [Docker Swarm for Raspberry Pi](http://blog.alexellis.io/tag/raspberry-pi)