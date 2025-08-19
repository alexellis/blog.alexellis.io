---
title: "2016 or 12 months of writing, speaking and hacking"
slug: "twelve-months-of-hacking"
date: "2016-12-30T10:05:00Z"
author: "Alex Ellis"
meta_title: "2016 or 12 months of writing, speaking and hacking"
meta_description: "Read my 12 months of writing, speaking, blogging, publishing, travelling - Linux, Docker, Raspberry Pi, Swarm, Clusters, Alexa, Serverless and IoT!"
feature_image: "/content/images/2016/12/banner.jpg"
tags:
  - "docker"
  - "overview"
  - "review"
  - "2016"
---

Over the past twelve months I've written 1-2 blog posts per week, spoken at events, travelled the world, been published in print and got connected to an incredible tech community. It's been a busy year with plenty of challenges so I wanted to share some of the highlights with you.

### Linux User & Developer Magazine

I met an editor from the Linux User and Developer magazine (Imagine Publishing, now Future Publishing) at PiWars. We got chatting and after Gavin saw a few posts on my blog he asked me to write for their magazine as a freelancer.

This year I've had one or two tutorials in almost every issue of the magazine with a 4-part special on building an autonomous robot with the [Explorer Robot kit from Pimoroni](https://shop.pimoroni.com/products/explorer-robot-kit) from issue 167 through 170.

![](/content/images/2016/12/IP_DSC_7625_large.JPG)

Explorer Robot Series [part 1](https://www.imagineshop.co.uk/magazines/linuxuser/linux-user-and-developer-issue-167.html) [part 2](https://www.imagineshop.co.uk/magazines/linuxuser/linux-user-and-developer-issue-168.html) [part 3](https://www.imagineshop.co.uk/magazines/linuxuser/linux-user-and-developer-issue-169.html) [part 4](https://www.imagineshop.co.uk/magazines/linuxuser/linux-user-and-developer-issue-170.html)

My first tutorial was 4 pages long and was titled "Create a Raspberry Pi Cluster with Docker Swarm". Here's my post about the article: [Docker Article in Linux magazine](http://blog.alexellis.io/linux-user-developer-magazine/)

![](http://blog.alexellis.io/content/images/2016/03/12751465_202678110091142_997768928_n.jpg)

If you want to build a Docker Swarm with your Pi, read on.

### Aye! Aye! Captain
In April the Docker team invited me to join their [Docker Captains programme](https://www.docker.com/community/docker-captains). I'd never had a company or project approach me and recognise the work I'd been doing before so this was a novel experience. I said yes and it's been the start of an exciting journey. Here's some of my work from March/April:

[Hands-on Docker Labs](http://blog.alexellis.io/handsondocker/)

> 12 self-paced, progressive labs for learning how to build/ship and run with Docker.

### Dockercon 2016

![](http://blog.alexellis.io/content/images/2016/06/queues.jpg)

The Docker Captains get free entry to events run by Docker and there is no better place to learn and grow than Docker's official get-together: Dockercon. This was actually my first ever conference and the scale was massive - with over 4000 people - it certainly had the wow factor and I picked up new knowledge like a sponge.

I learnt about Grafana and InfluxDB which lead me to write this tutorial:

* [Create an Environmental Monitoring Dashboard ](http://blog.alexellis.io/environmental-monitoring-dashboard/)

I met Travis Wright, a product manager with the Microsoft SQL team and later in the year I went on to get a link back from the official SQL blog to this write-up: 

* [Docker with Microsoft SQL 2016 + ASP.NET](http://blog.alexellis.io/docker-does-sql2016-aspnet/)

Here are [my notes as a Captain and speaker](http://blog.alexellis.io/dockercon-2016-speaker-notes/) from the whole event.

### Dockercon Cool-hacks contest

I entered two cool-hacks for the Dockercon cool hacks contest and while neither were accepted by the panel - both took me way beyond my expectations. The first was a combination of Docker Swarm and GPIO on the Raspberry Pi to create a visualisation of a load-balancer with LEDs.

[My Dockercon Hack: IoT cluster
](http://blog.alexellis.io/iot-docker-cluster/)

I got a message from Solomon Hykes - Docker's CTO which was great followed by an invitation [to visit Pimoroni](http://blog.alexellis.io/magic-and-pirates/) and to speak on their BilgeTank show.

<iframe width="560" height="315" src="https://www.youtube.com/embed/ASYnWV0Km_A" frameborder="0" allowfullscreen></iframe>

After my first hack was turned down I went back to the drawing board. Pimoroni offered to build me a multi-colour (RGB) [LED board called Blinkt!](http://blog.pimoroni.com/blinkt/) and they had just released an environmental sensor board with motion detection.

I combined both of these devices in a Docker Swarm to create a sensor monitoring network for your datacenter and presented it in the [community theatre at Dockercon](http://blog.alexellis.io/dockercon-2016-speaker-notes/) and [at Container Camp, London](http://blog.alexellis.io/contain-yourself-in-london/).

<iframe width="560" height="315" src="https://www.youtube.com/embed/-qRUsuevKj4" frameborder="0" allowfullscreen></iframe>

You can [buy Blinkt! here](https://shop.pimoroni.com/products/blinkt).

### Docker comes to Raspberry Pi!

On August 30th I noticed a huge increase in traffic on the blog and tends of thousands of hits on my YouTube Swarm Deep Dive Video. Eventually I released that the Official Raspberry Pi Blog had announced Docker for the Raspberry Pi making use of my blogs and videos.

It was an honour to be featured and great to see the RPi and maker community making use of Docker for projects and physical hardware.

* [Docker comes to Raspberry Pi](https://www.raspberrypi.org/blog/docker-comes-to-raspberry-pi/)

> Check out the embedded video on the link if you want to build a Docker Swarm with Raspberry Pi.

**OTG networking**

The Raspberry Pi Zero can act as a network adapter via a USB cable enabling you to [carry around a Docker Engine and full Linux OS in your pocket](http://blog.alexellis.io/docker-engine-in-your-pocket/).

I'm going to feature this Tweet because it seems to be my most popular ever with the accompanying article published later as:

* [Build your PiZero Swarm with OTG networking
](http://blog.alexellis.io/pizero-otg-swarm/)

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Look ma, no Ethernet! 8 core <a href="https://twitter.com/docker">@Docker</a> 1.12 swarm boom USB OTG <a href="https://twitter.com/Raspberry_Pi">@Raspberry_Pi</a> <a href="https://twitter.com/pimoroni">@pimoroni</a> <a href="https://t.co/frlSQ9ePpr">pic.twitter.com/frlSQ9ePpr</a></p>&mdash; Alex Ellis (@alexellisuk) <a href="https://twitter.com/alexellisuk/status/764518552154042369">August 13, 2016</a></blockquote> <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

### Windows Containers landed

Just a few weeks after Dockercon Microsoft released a production-ready version of Windows 2016 with native container support. It brings the powerful interface of Docker to [Windows containers](http://blog.alexellis.io/tag/windows/) and [legacy .NET applications](http://blog.alexellis.io/3-steps-to-msbuild-with-docker/).

It was really exciting for me having worked with Windows and .NET for 10 years - I could now leverage Docker for repeatable builds, even with Windows. I wrote a [series of posts](http://blog.alexellis.io/tag/windows/) exploring how to [build a Jenkins CI/CD pipeline](http://blog.alexellis.io/continuous-integration-docker-windows-containers/) and how to [Build C++/.NET code with MSBuild](http://blog.alexellis.io/3-steps-to-msbuild-with-docker/) as well as looking into [.NET options for Windows Containers](http://blog.alexellis.io/docker-dotnet-containers/).

One of the highlights was being able to port the Docker Voting app fully to Windows Containers with MSSQL and a .NET MVC WebAPI:

* [Windows does the Docker Voting app
](http://blog.alexellis.io/docker-does-sql2016-aspnet/)

### Jenkins 2.0 and Blue Ocean

As soon as Jenkins 2.0 was released I took it for a test drive and wrote up my [first impressions on Jenkins 2.0](http://blog.alexellis.io/jenkins-2-0-first-impressions/). A little later in the year a team at CloudBees released a Beta of their Blue Ocean UX overhaul and I wrote up a guide on how to install it and to try it out with Docker, their project manager even gave me an interview for the write-up which was a very cool. That made it into the [CloudBees press release](https://www.cloudbees.com/press/jenkins-community-builds-success-jenkins-2-powerful-new-user-experience) which was announced at JenkinsWorld.

* [Jenkins makes a UX splash with Blue Ocean](http://blog.alexellis.io/jenkins-splashes-with-blue-ocean/)

### Alexa launched in UK

Amazon launched their Amazon Echo and Echo Dot devices in the United Kingdom which meant it was time to get hacking. Once I started I couldn't stop and built a bunch of different hacks with my Raspberry Pi including a very popular Christmas Tree (or Holiday Tree).

<iframe width="560" height="315" src="https://www.youtube.com/embed/u4aIFOdGP2k" frameborder="0" allowfullscreen></iframe>

> [A Christmas Tree IoT with Alexa - technical overview](http://blog.alexellis.io/christmas-iot-tree/)

The write-up was featured on the [MagPi blog](https://magpi.cc/) and I have a piece commissioned with Linux User magazine for 2017, so keep an eye out for it.

> I also managed to get Alexa to integrate with sensors and even the Docker Hub API. Find my Alexa videos and code on my [alexa-demos Github repository](https://github.com/alexellis/alexa-demos).

**Serverless**

I have submitted talks to Dockercon 2017 including a prototype for running serverless tasks on a Docker Swarm with an API Gateway. This would let you run a similar process to AWS Lambda but on your own equipment. If you're curious or want to know more I published a video below where my Echo Dot sends requests straight to my serverless functions on Docker Swarm instead of the cloud.

<iframe width="560" height="315" src="https://www.youtube.com/embed/BQP67FWF1P8" frameborder="0" allowfullscreen></iframe>

I had the opportunity to meet up with Docker's Justin Cormack a couple of weeks ago and we started to hash out [a new approach](https://github.com/alexellis/faas/tree/draft_1).

## And much, much more!

It's been a great year of learning, building and hacking. I hope you find something here to inspire you or to whet your appetite for 2017. You can get in touch with me via Twitter [@alexellisuk](https://twitter.com/alexellisuk) or on [LinkedIn](https://www.linkedin.com/in/alexellisuk) if you want to connect.

> Please like & share with your friends:

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">The New Year is coming, get inspired for 2017 and Read my 12 months of writing, speaking and hacking - <a href="https://t.co/zeUrHhwoOW">https://t.co/zeUrHhwoOW</a> <a href="https://t.co/T0Ak0BySYZ">pic.twitter.com/T0Ak0BySYZ</a></p>&mdash; Alex Ellis (@alexellisuk) <a href="https://twitter.com/alexellisuk/status/814797376389083136">December 30, 2016</a></blockquote> <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>