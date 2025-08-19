---
title: "Build your PiZero Swarm with OTG networking"
slug: "pizero-otg-swarm"
date: "2016-09-14T18:56:00Z"
author: "Alex Ellis"
meta_title: "Build a Pi Zero Swarm with OTG networking"
meta_description: "Use OTG networking to build a Pi Zero Swarm and then use Docker to create a super-computer. Raspberry Pi and Docker Swarm Mode make it easy. "
feature_image: "/content/images/2016/09/IMG_20160829_103245.jpg"
tags:
  - "docker"
  - "swarm"
  - "Raspberry PI"
  - "linux"
---

So I unleashed a picture on the Internet several weeks ago which combined Docker, the Pi Zero and OTG networking. A lot of you responded to the post and wanted to try it out for yourself so I've put a new tutorial together.

The Raspberry Pi foundation's [Matt Richardson](https://twitter.com/MattRichardson) also bundled up the original tweet along with some of my best Docker material and posted it onto the official blog below: 

* [Docker comes to the Raspberry Pi](https://www.raspberrypi.org/blog/docker-comes-to-raspberry-pi/)

**If you have no idea what Docker is, check out the post from the Raspberry Pi foundation above**

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Look ma, no Ethernet! 8 core <a href="https://twitter.com/docker">@Docker</a> 1.12 swarm boom USB OTG <a href="https://twitter.com/Raspberry_Pi">@Raspberry_Pi</a> <a href="https://twitter.com/pimoroni">@pimoroni</a> <a href="https://t.co/frlSQ9ePpr">pic.twitter.com/frlSQ9ePpr</a></p>&mdash; Alex Ellis (@alexellisuk) <a href="https://twitter.com/alexellisuk/status/764518552154042369">August 13, 2016</a></blockquote> <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

Before we get into the guide, I wanted to give you a bit of background.

### Q&A

OTG networking uses a gadget module in the Linux Kernel and can be used as a stand-in for Ethernet. Docker will run on an OTG network in the same way it would any other - providing that the various hosts have connectivity with each other.

#### Why would I use OTG networking?

OTG networking when done right means that a Pi Zero can be connected to almost any host device (PC, Pi 3, Laptop) with a single USB cable to create a fully-workable network.

This saves on network switches, cables, power supplies and bulk. That would have been a handy saving @ [Container.Camp](https://Container.Camp):

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Flashy <a href="https://twitter.com/hashtag/docker?src=hash">#docker</a> demo on <a href="https://twitter.com/hashtag/rpi?src=hash">#rpi</a>, thanks <a href="https://twitter.com/alexellisuk">@alexellisuk</a> <a href="https://t.co/7XjcDg3ayC">pic.twitter.com/7XjcDg3ayC</a></p>&mdash; Nicolas De loof (@ndeloof) <a href="https://twitter.com/ndeloof/status/774284729755500544">September 9, 2016</a></blockquote> <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

#### So how does it work?

You will get your hands messy by editing system config files and setting up static IP addresses and subnets. Once complete you will have in theory the equivalent of a USB ethernet adapter.

> If hacking on system files is not for you, then you may find the ClusterHAT (which comes with pre-flashed images) to be an easier alternative. See below.

#### But Docker, though?

Once your networking is fully configured you can set up a Docker Swarm in exactly the same way you would with an Ethernet configuration with my other Deep Dive guide.

> If you're wondering what a Swarm is, this is the best place to start:

* [Deep Dive: Docker Swarm Mode on Raspberry Pi](http://blog.alexellis.io/live-deep-dive-pi-swarm/)

Here is an example from last night when I ran through the instructions and created a brand new OTG cluster with Docker:

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Tutorial underway: <a href="https://twitter.com/Raspberry_Pi">@Raspberry_Pi</a> OTG networking with <a href="https://twitter.com/hashtag/pizero?src=hash">#pizero</a> to create ethernet-free <a href="https://twitter.com/docker">@docker</a> swarm. <a href="https://twitter.com/hashtag/testeverything?src=hash">#testeverything</a> <a href="https://t.co/7CXIhrz1wM">pic.twitter.com/7CXIhrz1wM</a></p>&mdash; Alex Ellis (@alexellisuk) <a href="https://twitter.com/alexellisuk/status/775798793736511488">September 13, 2016</a></blockquote> <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

### OK.. how do I do this?
Follow the QuickStart guide on Github.com: 

* [QuickStart: OTG Networking for Raspberry Pi](https://github.com/alexellis/docker-arm/blob/master/OTG.md)

> Please send your comments, questions and suggestions my way on Twitter or via the comments section. 
### Who else is doing this?

There is a very cool product called the [ClusterHAT](https://shop.pimoroni.com/products/cluster-hat) which can be mounted onto a Pi's GPIO header to provide a USB hub for your Pi Zeros. Docker can also be used with this setup.

[James](http://raspberryjamberlin.de/zero360-part-1-building-the-zero360/) from Raspberry Pi Berlin Meetup has built a 360-degree camera using Pi Zeros and OTG networking. I'm still trying to convince him to try out Docker. It makes building, deploying and updating your software so much easier than manual hacking and scripts.

### What could go wrong?

The reason for the air-gap between my initial Tweet and these instructions is due to the sheer amount of unreliability I've experienced with OTG. The power supply needs to be just right, the host needs to be just right, the cables have to be perfect quality - and if the planets align you may be able to boot up 4x Pi Zeros at once. 

> Don't let this put you off - I would like to improve  the solution so please send in your comments, questions and suggestions.

The bandwidth may also be more limited when using 4x OTG devices through the shared USB host than through Ethernet ports. It would be good to see how this plays out in practice - if you want to do some benchmarking with [Docker Swarm](https://docs.docker.com/engine/swarm/how-swarm-mode-works/services/) that would be really interesting to see.

## See Also:

I host my blog on a Raspberry Pi 3 using Docker. You can find out more below:

* [Get your own Ghost blog in 5 mins](http://blog.alexellis.io/ghost-on-docker-5mins/)

If you want to find Pi Zeros then check out [stockalert.alexellis.io](http://stockalert.alexellis.io) and the write-up below:

* [Using Docker to find Pi Zero Stock](http://blog.alexellis.io/rapid-prototype-docker-compose/)