---
title: "Bring Linux apps to the Mac Desktop with Docker"
slug: "linux-desktop-on-mac"
date: "2016-08-01T08:11:00Z"
author: "Alex Ellis"
meta_title: "Bring Linux apps to the Mac Desktop with Docker"
meta_description: "Let's look at how to bring Linux X11 apps to the Mac desktop with Docker. Run and test multiple versions of apps. Secure your surfing through isolation. "
tags:
  - "linux"
  - "apple"
  - "macos"
  - "docker"
  - "proxies"
---

If you use Linux as your host operating system then with one or two commands you can have most graphical Linux applications up and running on your desktop in seconds. Package managers like `apt-get`, `yum` and `pacman` make installing new software almost seamless. If you are running an XWindows server (which you probably are) then getting a graphical application to appear on your screen from a remote Linux system or a Docker container can be as simple as setting the `DISPLAY` environmental variable.

### But macOS though?

Many applications that exist for Linux also exist for Mac: Chrome, FireFox, VLC Player, Slack, Arduino IDE etc. In some cases they have been ported and re-built natively and even optimized to take advantage of the OS. 

> So why would you want to run Linux versions of apps on your Mac?

Here are a few reasons why you may want to use Docker to run Linux applications on macOS:

* To access to newer versions of software
* To test various versions of the same software simultaneously
* To use tools which may not be ported to macOS yet
* For sandboxing an application:
 * To tighten up on security
 * or to isolate and/or spy on network traffic

Since Docker provides a sandboxed environment for applications that means you can add/remove just the capabilities you want and tighten up on security. 

> [Runtime privilege and Linux capabilities](https://docs.docker.com/engine/reference/run/#/runtime-privilege-and-linux-capabilities)

Several paid tools exist for macOS to isolate network traffic and push it down different HTTP proxies or SOCKS tunnels depending on custom rulesets. This is ideal if you frequently work on public WiFi networks or behind a restrictive corporate network. By using your own hosted proxy server or VPN you can protect some or all of your traffic. So why pay for something you can do for free with Docker?

![Slack for Linux running on macOS](/content/images/2016/07/slack_2-1-0.png)

*Slack for Linux running on the Mac Desktop in El Captain*

### Step-by-step

Here's what you need to do to bring X11 to your Desktop.
#### 1. Install an X11 server

An X11 server exists for MacOS which allows applications like XTerm to run and display output on your local computer. It's packaged up as the [XQuartz project](https://www.xquartz.org) and can be installed with [brew](http://brew.sh):

```
$ brew install Caskroom/cask/xquartz

==> brew cask install Caskroom/cask/xquartz
==> Creating Caskroom at /usr/local/Caskroom
==> Downloading https://dl.bintray.com/xquartz/downloads/XQuartz-2.7.9.dmg
################################## 100.0%
```

#### 2. Build your Dockerfile

Once you have XQuartz set up you can then install your favourite graphical Linux apps into a Debian container or whichever distribution you prefer.

```
FROM debian:stretch

ENV LC_ALL en_US.UTF-8
ENV LANG en_US.UTF-8

RUN apt-get update && apt-get install -y \
	apt-transport-https \
	ca-certificates \
	curl \
	gconf2 \
	gconf-service \
	gvfs-bin \
	hunspell-en-us \
	libasound2 \
	libgtk2.0-0 \
	libnotify4 \
	libnss3 \
	libxss1 \
	libxtst6 \
	locales \
	python \
	xdg-utils \
        libgnome-keyring0 \
        gir1.2-gnomekeyring-1.0 \
        libappindicator1 \
	--no-install-recommends \
	&& rm -rf /var/lib/apt/lists/*

RUN echo "en_US.UTF-8 UTF-8" >> /etc/locale.gen \
	&& locale-gen en_US.utf8 \
	&& /usr/sbin/update-locale LANG=en_US.UTF-8

ADD ./slack-desktop-2.1.0-amd64.deb ./
RUN dpkg -i slack-desktop-2.1.0-amd64.deb

ENTRYPOINT ["slack"]
```

[Fork the Dockerfile](https://gist.github.com/alexellis/bddcae106587d34e5c5e97ecba375bb1)

I adapted this Dockerfile from one that [Jess Frazelle](https://github.com/jfrazelle/dockerfiles/blob/master/slack/Dockerfile) came up with. It appeared to be broken when I tried it so I've added some more packages to fix the runtimes errors I encountered.

You may also be asking yourself why I've added slack from the local filesystem instead of using `wget` or `curl`. If you need to fetch the binary from a specific HTTP proxy or VPN tunnel then you may not want Docker to handle that. 

Run this before building the Dockerfile or move it back into the file itself as a `RUN` step:

```
$ wget https://downloads.slack-edge.com/linux_releases/slack-desktop-2.1.0-amd64.deb
```

Most packages are available in package repositories or PPAs so `apt-get` could be used, but Slack is an exception to the rule.

#### 3. Set up XQuartz for network connections

By default XQuartz will listen on a UNIX socket, which is private and only exists on local our filesystem. This means Docker won't be able to access it.

Install and run `socat` to create a tunnel from an open X11 port (6000) through to the local UNIX socket where XQuartz is listening for connections:

```
$ socat TCP-LISTEN:6000,reuseaddr,fork UNIX-CLIENT:\"$DISPLAY\"
```

This will block, so open a new tab or terminal.

#### 4. Start the application

Build your Dockerfile, then start it by passing in an environmental variable for the `DISPLAY` so your graphical application knows where to show itself. Change the IP address of *192.168.0.15* to whatever you see on `ifconfig`.

```
$ wget https://downloads.slack-edge.com/linux_releases/slack-desktop-2.1.0-amd64.deb
$ docker build -t slack:2.1.0
$ docker run -e DISPLAY=192.168.0.15:0 --name slack -d slack:2.1.0
```

For extra points you could:

* Use docker-compose to make starting/stopping the app easier and manage the container
* Bind-mount an options directory so the container can 'remember' your communities. I.e.
 * `-v /home/alex/.slack:/root/.config/slack`
* Use a script to find the IP address to insert into the `DISPLAY` variable.
* Create a `docker-compose.yml` file for easy starting/stopping of the application. (See below)

#### 4.1 Note on proxies:

If you want an app such as Slack to use a HTTP_PROXY then you can pass in the environmental variable at runtime. Here's an example with a `docker-compose.yml` file for convenience:

```
version: "2.0"
services:
  slack:
    image: slack:2.1.0
    environment:
      - HTTP_PROXY=http://192.168.0.10:8080
      - HTTPS_PROXY=http://192.168.0.10:8080
      - DISPLAY=192.168.0.10:0
    volumes:
      - .slack_config:/root/.config/Slack
    networks:
      - default
```

*docker-compose.yml*

#### 5. Wrapping up

X11 forwarding from Docker to Linux is fast and can be accelerated by sharing additional resources such as `/dev/video0` or `/dev/shm`, unfortunately this is not possible with Docker on macOS. When forwarding apps from Docker to XQuartz you may find that they do not run correctly or have unexpected lag. This may be because hardware acceleration and use of the GPU is not available, but the applications may still be useable enough for you to get the benefits.

##### See also:

[Getting started with Docker 1.12 Swarm-Mode](http://blog.alexellis.io/tag/swarmmode/)

### Acknowledgements:

Most of what I've outlined above came from reading a Github issue from 2015: [Docker issue #8710](https://github.com/docker/docker/issues/8710).

For examples of running popular Linux apps on the Linux Desktop see [Jess' Containers on the Desktop blog post](https://blog.jessfraz.com/post/docker-containers-on-the-desktop/).

Let me know if you know of any way of accelerating the performance of X11-forwarded apps on macOS. Or if you have any other tips or hacks, send me a tweet @alexellisuk or post a comment.