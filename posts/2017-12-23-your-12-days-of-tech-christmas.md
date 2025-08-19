---
title: "Plan your 12 Days of techie Christmas - part 1"
slug: "your-12-days-of-tech-christmas"
date: "2017-12-23T21:48:15Z"
author: "Alex Ellis"
meta_title: "Your 12 Days of techie Christmas - part 1"
meta_description: "I've got 12 days' worth of techie projects, plans and proposals to keep you learning ready for a great 2018 - from Docker to RPi to clusters and Kubernetes"
feature_image: "/content/images/2017/12/pexels-photo-688019-crop.jpg"
tags:
  - "technology"
  - "docker"
  - "IoT"
---

Start here to plan your 12 Days of Christmas starting on Monday 25th December - whether you observe the holiday or are just taking time off over this season. I've got 12 days' worth of techie projects, plans and proposals to keep you learning and to give you a jump start into a great 2018.

![](/content/images/2017/12/gift_small.jpg)

## Day 1 - 25th December

This is a day best spent with friends and family. I'd suggest turning off Slack/Twitter/GitHub notifications and not checking email. Definitely no connecting to the work VPN.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">My wife and family have done a great job on the tree! <a href="https://t.co/PeGO7ZvcYe">pic.twitter.com/PeGO7ZvcYe</a></p>&mdash; Alex Ellis (@alexellisuk) <a href="https://twitter.com/alexellisuk/status/942159083653738496?ref_src=twsrc%5Etfw">December 16, 2017</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

If you're following the British tradition of watching Dr. Who on Christmas Day then make sure you try out [@Colorisebot](https://twitter.com/colorisebot) which has been a hit with Dr. Who fans. It can take any B&W photo and show you how it'd look in colour using machine learning.

Read more: [Colorisebot and OpenFaaS](https://blog.alexellis.io)

Want to read the code? [alexellis/repaint-the-past](https://github.com/alexellis/repaint-the-past)

## Day 2 - 26th December

It's Boxing Day or "the day after Christmas" outside of the UK. You may have got some money from your family. There's only really one course of action - RPis and IoT add-on boards.

Buy a Raspberry Pi Zero W because it's a 1GHz CPU, 512Mb RAM and half the size of a credit card. You can use it to build dozens of different projects. Browse my blog or the MagPi magazine for some ideas.

Read [My Raspberry Pi blogs](https://blog.alexellis.io/tag/raspberry-pi/)

Browse back-issues: [The MagPi Magazine](https://www.raspberrypi.org/magpi/)

**Notable add-on boards:**

[RPi camera](https://shop.pimoroni.com/products/raspberry-pi-zero-camera-module) - one of my favourites - take photos in no time and build cool projects.

Blinkt! - designed for my [Dockercon talk](http://blog.pimoroni.com/blinkt/)

The [Envirophat](http://blog.pimoroni.com/enviro-phat/) is packed with sensors and really easy to control through Python

I created a Christmas IoT decoration with a Blinkt! and a cheap decoration in this popular blog-post:

[Holiday lights that harmonize around the globe](https://blog.alexellis.io/festive-docker-lights/)

## Day 3 - 27th December

Now you need something to read while you wait for those accessories to arrive.

**Best programming reads for the holidays:**

[The Go Programming Language (Addison-Wesley)](https://www.amazon.co.uk/Programming-Language-Addison-Wesley-Professional-Computing/dp/0134190440/ref=sr_1_1?ie=UTF8&qid=1514060434&sr=8-1&keywords=golang)

I'm a big fan of this book - it has a great section on primitives like `channels`, HTTP, marshaling, unit-testing and much more.

Read my blog series on [Golang fundamentals](https://blog.alexellis.io/tag/golang-basics/).

[Unix Power Tools: 100 3rd Edition](https://www.amazon.co.uk/Unix-Power-Tools-Shelley-Powers-ebook/dp/B0043EWUT8/ref=sr_1_2?ie=UTF8&qid=1514060567&sr=8-2&keywords=unix+power+tools)

This is officially *the* best command-line reference guide for working with UNIX-like systems - i.e. Mac/Linux or even bash on Windows. This book is full of anecdotes as well as great practical tips and many CLI utilities I'd never heard of before.

## Day 4 - 28th December

You may have cleared the wrapping paper away by now, so it's time to start thinking about a plan for the New Year. If you don't have a Raspberry Pi cluster yet then it's time to build one.

Here's your bill of materials:

* 3-6x Raspberry Pi 3 & 16Gb SD Cards
* [6x USB Ankler Power Supply](https://www.amazon.co.uk/Anker-PowerPort-Family-Sized-Technology-Smartphones-Black/dp/B00PK1IIJY/ref=sr_1_1?ie=UTF8&qid=1514061161&sr=8-1&keywords=anker+power+supply)
* [Anker charging cables](https://www.amazon.co.uk/Anker-4-Pack-PowerLine-Micro-USB/dp/B016BEVNK4/ref=pd_bxgy_23_img_2?_encoding=UTF8&psc=1&refRID=B7195QVQFN5NC9NV7V4T)
* 8 port Gigabit switch & cables

> Pro tip: don't scrimp on the RPis, cables or power supplies. I've been there and done that. The RPi Zero isn't recommended for clustering because it cannot run Kubernetes. RPi clones do not maintain up-to-date mainline Linux kernels which will cause headaches. Cheap USB power cables can cause intermittent reboots.

There's no need to go bigger than 6 RPis, however do as I say not as I do:

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">What if I told you I had a x30 RPi node cluster with 120 cores running <a href="https://twitter.com/kubernetesio?ref_src=twsrc%5Etfw">@kubernetesio</a> and <a href="https://twitter.com/openfaas?ref_src=twsrc%5Etfw">@openfaas</a> ??? <a href="https://t.co/qULW0kgf6i">pic.twitter.com/qULW0kgf6i</a></p>&mdash; Alex Ellis (@alexellisuk) <a href="https://twitter.com/alexellisuk/status/944511947101360128?ref_src=twsrc%5Etfw">December 23, 2017</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> 

If you already have the parts skip ahead:

[Serverless Kubernetes homelab](https://blog.alexellis.io/serverless-kubernetes-on-raspberry-pi/)

## Day 5 - 29th December

It's Day 5 so we're going to start preparing by learning about Docker. Docker is the leading technology project for running containers. Containers are becoming the industry-standard way to build, ship and run distributed applications.

My buddy and fellow Docker Captain Bret Fisher has a great video-course on Udemy for mastering Docker, you can start here: [Docker Mastery](https://www.udemy.com/docker-mastery/)

I have 79 blog posts in [my series on Docker](https://blog.alexellis.io/tag/docker/) which covers a wide range of topics relating to running modern applications in the cloud or on-prem.

## Day 6 - 30th December

If you had fun learning about Docker then you can take it to the next level by finding out how people run applications in production, at scale over multiple hosts (clusters).

[What you need to know: Kubernetes and Swarm](https://blog.alexellis.io/you-need-to-know-kubernetes-and-swarm/)

> Read my analysis on Docker Swarm and Kubernetes where I compare and contrast the two options:

Learn how to [deploy a Kubernetes cluster in 10 minutes](https://blog.alexellis.io/tag/learn-k8s/)

### Questions, comments & suggestions

If you have questions, comments and suggestions then follow me on Twitter so you never miss a post, hack or cool project:

* [twitter.com/alexellisuk](https://twitter.com/alexellisuk)

You can subscribe to my blog on Feedly using the links below.

Have a great time and see you again soon for Part 2!