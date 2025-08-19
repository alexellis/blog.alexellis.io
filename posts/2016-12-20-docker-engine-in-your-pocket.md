---
title: "Is that a Docker Engine in your pocket??"
slug: "docker-engine-in-your-pocket"
date: "2016-12-20T21:24:59Z"
author: "Alex Ellis"
meta_title: "Carry a Docker Engine in your pocket"
meta_description: "Get a full Docker Engine in your pocket with a Pi Zero and a USB cable. This 15min guide has everything you need to get started with a container in 15mins."
tags:
  - "docker"
  - "hacks"
  - "Raspberry PI"
---

How cool would it be to be able to carry around an [entire computer](https://www.raspberrypi.org/magpi/stick-pc-pi-zero/) the size of half a credit card loaded up with a full [Docker Engine](https://www.docker.com/what-docker)?

> The [Raspberry Pi Zero](http://stockalert.alexellis.io/) is that computer and with USB networking you can plug it straight into your laptop. 

![](/content/images/2016/12/captains-1.jpg)

*Featured above with the awesome [Pimoroni Blinkt](http://blog.pimoroni.com/blinkt/)*

Here's what we're about to do:

* Flash an SD card, enabling SSH and OTG
* Enable Internet connection sharing
* Grab Docker
* Build, ship and run a fun container in Node.js

This guide should take less than 15-20 minutes from start to finish.

Let's get started!
==================

Head over to the Raspberry Pi website and download the latest Jessie Lite image:

* [https://www.raspberrypi.org/downloads/raspbian/](https://www.raspberrypi.org/downloads/raspbian/)

Use `dd` or a similar tool like [Etcher](https://etcher.io) to write the image to the SD card. If you're on a Mac or Windows, plug in the SD card and wait for a Boot volume to appear.

Edit config.txt and add this on two separate lines at the bottom of the file:

```
dtoverlay=dwc2
gpu_mem=16
```

Edit cmdline.txt (make sure you don't add any line-breaks) and append this after `rootwait`:

```
modules-load=dwc2,g_ether
```

Now to enable SSH create a file named `ssh` with no extension. If you're on a Mac you can probably do this: `touch /Volumes/boot/ssh`.

Eject (`diskutil eject /Volumes/boot`) or unmount the SD card and insert it into your Pi Zero. Plug the Pi Zero into the computer via a USB port and a good quality USB cable.

Now wait 1-2 minutes while it boots up.

I use this script to wait until the Pi is reachable:

```
while [ true ]; do sleep 0.2 && ping -c 1 raspberrypi.local && sleep 0.2 ; done 
```

You can find the Pi via mDNS or the avahi-daemon on Windows or a Mac. This may not be enabled on your Linux machine, so install the package if you can't find the Pi.

And SSH
=======

So connect to your device with a Terminal, or Putty/Git Bash if you're on Windows.

The password is: **raspberry**

```
$ ssh pi@raspberrypi.local
```

Add Internet access
===================

You will now need to set up Internet connection sharing on your Mac or Windows machine. 

> On Linux you'll need to set up IPv4 forwarding (grab the instructions for your distribution from Google).

This is the Preferences app:

![](/content/images/2016/12/Screen-Shot-2016-12-20-at-8-48-43-PM.png)

Make sure you share from either Wi-Fi or Ethernet to your RNDIS/Ethernet Gadget. Then click the checkbox by *Internet Sharing*.

After a few minutes or a reboot your Pi Zero will obtain an IP address like 192.168.2.2 and you can test connectivity like this:

![](/content/images/2016/12/Screen-Shot-2016-12-20-at-8-51-25-PM.png)

To install the Docker Engine go ahead and type in:

```
$ curl -sSL https://get.docker.com | sh
$ sudo usermod -aG docker pi
```

And there you have it. A fully working Docker Engine in your pocket. Whenever you need it, plug it into your PC or laptop via USB and build, ship, run!

> Note: If you cannot figure how to setup Internet Connection Sharing on *your Linux distro*, you can install a HTTP proxy server and configure Docker to use that instead.

Run a container
===============

For that first container let's use a Node.js web server which serves up over 400 ASCII cows.

```
$ git clone https://github.com/alexellis/arm-cows
$ cd arm-cows
$ docker build -t arm-cows .
```

*This may take a while*

```
$ docker run -p 3000:3000 --name web -d arm-cows
$ curl -4 http://localhost:3000/

         (__)
         (oo)
  /-------\/
 / |     || ---->
*  ||----||
  ___/  ___/

 Cow waterskiing
```

> You'll also be able to `curl` the web server from your machine using the IP address of USB0 `ifconfig usb0`.

Share this tutorial
===================

You can reach out to me on Twitter [@alexellisuk](https://twitter.com/alexellisuk/).

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Create a Docker Engine that you can carry around in your pocket with the $5 <a href="https://twitter.com/Raspberry_Pi">@Raspberry_Pi</a> Zero! <a href="https://t.co/dz23CHYEbj">https://t.co/dz23CHYEbj</a> <a href="https://t.co/eMGtTReVgt">pic.twitter.com/eMGtTReVgt</a></p>&mdash; Alex Ellis (@alexellisuk) <a href="https://twitter.com/alexellisuk/status/811321985829601280">December 20, 2016</a></blockquote> <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>
Further reading:
================

* [Hands-on video - zero to GPIO + Docker on the Pi](http://blog.alexellis.io/hands-on-docker-raspberrypi/)

* [5 things about Docker and the Raspberry Pi](http://blog.alexellis.io/5-things-docker-rpi/)

* [Pi Zero Docker Swarm over USB (OTG)](http://blog.alexellis.io/pizero-otg-swarm/)