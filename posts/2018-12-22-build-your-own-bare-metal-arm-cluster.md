---
title: "Build your own bare-metal ARM cluster"
slug: "build-your-own-bare-metal-arm-cluster"
date: "2018-12-22T20:38:20Z"
author: "Alex Ellis"
meta_title: "Build your own bare-metal ARM cluster "
meta_description: "Learn everything you need to know about building your very own bare-metal ARM cluster with Docker and Kubernetes including real life use-cases."
feature_image: "/content/images/2018/12/abstract-astronomy-constellation-1025469-crop.jpg"
tags:
  - "open source"
  - "swarm"
  - "kubernetes"
  - "Raspberry PI"
  - "arm"
  - "serverless"
---

In this blog post we'll explore how to build your very own bare-metal ARM cluster that you can run 24/7 at home for very little cost. There are many different ARM System on Chip (SoC) boards available so it can be a confusing space or an unfortunate time-sink. In this post I'll explore some important terminology for ARM and explain some of the practicalities in buying this type of equipment to build clusters. Don't worry - I will be giving you a bill of materials.

When you have the fundamentals in place we'll then deploy cloud native software that can help you learn about distributed and cloud computing such as Kubernetes and Docker Swarm. The primary goals of this post are to raise awareness for working with ARM hardware and to help you build a tangible, educational project that you can develop over time.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Anyone want to submit a talk about their shiny <a href="https://twitter.com/Raspberry_Pi?ref_src=twsrc%5Etfw">@Raspberry_Pi</a> + <a href="https://twitter.com/openfaas?ref_src=twsrc%5Etfw">@OpenFaaS</a> cluster? KubeCon CfP deadline is today - DockerCon is on 15th. Willing to review / help for these events or others. 🤠 <a href="https://twitter.com/hashtag/DockerCaptain?src=hash&amp;ref_src=twsrc%5Etfw">#DockerCaptain</a> <a href="https://t.co/LvQumfzqBZ">pic.twitter.com/LvQumfzqBZ</a></p>&mdash; Alex Ellis (@alexellisuk) <a href="https://twitter.com/alexellisuk/status/951857917153677312?ref_src=twsrc%5Etfw">January 12, 2018</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> 

## 1.0 Introduction to ARM

It's arguable that the best-known ARM SoC board is the Raspberry Pi and in 2018 the Raspberry Pi sold over [23 million units](https://blog.adafruit.com/2018/12/21/23-million-raspberry-pi-computers-sold-raspberry_pi-raspberrypi/) since its launch in on 29 February, 2012. The Raspberry Pi is known as a System on Chip (SoC) micro-computer based around a chipset from Broadcom designed for use with mobile phones.

<blockquote class="twitter-tweet" data-lang="en-gb"><p lang="en" dir="ltr">Raspberry Pi in numbers - thanks <a href="https://twitter.com/adafruit?ref_src=twsrc%5Etfw">@adafruit</a>!<a href="https://t.co/Muhp7OPAWd">https://t.co/Muhp7OPAWd</a> <a href="https://t.co/rSAh0xoIvf">pic.twitter.com/rSAh0xoIvf</a></p>&mdash; Raspberry Pi (@Raspberry_Pi) <a href="https://twitter.com/Raspberry_Pi/status/1076404258017345536?ref_src=twsrc%5Etfw">22 December 2018</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

The original board launched with a 32-bit instruction set called armv6 - this covers the models: A/B/A+/B+. The newer Model B 2 has an armv7 chip which can run binaries built for armv6. What is a bit confusing is that the Model B 2+/B 3 and B 3+ all have a 64-bit ARM processor called armv8 or `aarch64`, but that the Raspberry Pi Foundation contintues to ship a 32-bit OS with binaries targetting a 32-bit CPU architecture.

If this all sounds confusing, it's because it is. Fortunately by the Raspberry Pi Foundation only shipping one OS for all three CPU architectures we can stay largely shielded from all of these details. Just download a single OS image and flash it to your SD card and that's it.

There are 64-bit ARM OSes available for Raspberry Pi - the first official one was [SuSE Linux](https://www.suse.com/products/arm/) followed by [some community hacks](https://blog.hypriot.com/post/building-a-64bit-docker-os-for-rpi3/) and most recently an [Ubuntu 18.04 beta](http://cdimage.ubuntu.com/releases/18.04/beta/). In my experience the 64-bit OSes all run much slower on the RPi3/+ than Raspbian.

The place where 64-bit ARM is most interesting for me is the data-center grade ARM which is always 64-bit. Some notable resellers include [Packet Host](https://packet.net), [Scaleway](https://www.scaleway.com/), and [AWS](https://www.theregister.co.uk/2018/11/27/amazon_aws_a1/). Here we see a very different board from the Raspberry Pi - going from 4 cores and 1GB of RAM up to 96 cores and 120GB server-grade RAM with SSD in the [Cavium ThunderX Dual Socket](https://www.cavium.com/GIGABYTE-Announces-384-Core-2U-Server-Powered-By-Cavium-ThunderX-ARMv8-Processors.html).

> Note: these boards are prohibitively expensive to own, but are quick and easy to rent per hour with the service providers mentioned above. My prediction for 2019 is that we will see even more bare metal ARM offerings and more-powerful boards becoming available for the datacenter.

If we get back to our Raspberry Pi we see an affordable, credit-card sized computer running a full Linux OS that only draws between 1-4 Watts on average meaning we can leave it on 24/7 without worrying about its impact on our household bills. 

> See also: [Raspberry Pi power consumption](https://www.pidramble.com/wiki/benchmarks/power-consumption)

### 1.1 Exec format error

A custom operating system derived from Debian Linux had to be built and compiled for this CPU architecture and that's probably one of the first things people realise when they first work with ARM.

> You can't run binaries designed for a normal PC on an ARM board

Of course this only counts for compiled code - the Raspberry Pi community have built libraries and teaching materials for Python which is a scripted language and since it's not compiled it is very portable. The difficulties comes with compiled code like C/C++ where binaries have to be built either on the device itself or through a cross-compilation toolchain which requires additional packages and complexity for the developer.
Here's what happens if you run a binary built for a 64-bit PC:

```
$ wget https://github.com/openfaas/faas-cli/releases/download/0.8.2/faas-cli
$ chmod +x faas-cli
$ ./faas-cli
-bash: ./faas-cli: cannot execute binary file: Exec format error
```

One of the tools you can use to inspect a binary is `file`:

```
$ file faas-cli
faas-cli: ELF 64-bit LSB executable, x86-64, version 1 (SYSV), statically linked, stripped
```

Here's a 32-bit ARM variant which is also known as `armhf`:

```
$ wget https://github.com/openfaas/faas-cli/releases/download/0.8.2/faas-cli-armhf
faas-cli-armhf: ELF 32-bit LSB executable, ARM, EABI5 version 1 (SYSV), statically linked, stripped
```

On a day-to-day basis this probably won't affect you because the package manager for your operating system will have already bundled all the common utilities you would expect to find such as `tmux`, `wget`, `bash` and many more.

### 1.2 E: Unable to locate package

For general use you will find a package for most of the things you need, but when `apt install` says: `E: Unable to locate package` then you will need to switch tactic. Some projects ship binaries on their homepage for various platform such as the [OpenFaaS CLI](https://github.com/openfaas/faas-cli/releases) used in the example above or the [Prometheus monitoring tool](https://prometheus.io/download/). 

For the first generation Raspberry Pi you will need to download binaries called `armv6` or sometimes `armhf`. For newer Raspberry Pi boards such as the 2/3/3+ you can download either the `armhf` or `armv7` binary.

### 1.3 Build your own

The alternative when a binary is not available is to download the source for the project and hope that it builds on an ARM device. There's a growing chance that projects will just work - but many Makefiles include build-steps that call arbitrary binaries and before you know it you may be going down a rabbit-hole.

> Note some software such as MongoDB is designed to only work on 64-bit architectures. See also: the [MongoDB image for 64-bit ARM](https://hub.docker.com/_/mongo)

There is hope - some project maintainers may be willing to accept your patches to make their software build on ARM. In my experience this is not always the case and then you will have to maintain your own patches - something which is incredibly brittle and time-consuming.

### 1.4 Community

The folks at Packet Host started a program called [WorksOnArm](https://www.worksonarm.com/) which allows developers of projects to get support and list their programs as being available or compatible with ARM. This program is currently led by [Ed Vielmetti](https://twitter.com/vielmetti) who is friendly, approachable and who really desires to see software available for this great platform. You can even apply for free access to ARM servers to help port your programs and projects for the community.

The [Raspberry Pi forum](https://www.raspberrypi.org/forums/) can also be useful for finding out how to run new or exotic software.

## 2.0 Starting out with `docker`

Docker is a tool that makes it easy to package, build and deploy applications in the cloud using containers. Containers are a Linux concept which isolates workloads and allows us to apply constraints around the available CPU and memory. Containers are quick to start up and are often bundled with features such as copy-on-write (CoW) filesystems which minimize the amount of disk space needed only writing differences to disk.

An example use-case for Docker may be shipping your Python 3.6 application with all its dependencies, pip modules and an entire root-filesystem in a known configuration. You will need to build a `Makefile` called a `Dockerfile` which specifies where to start out (which base Linux image) and all the instructions needed to configure your application.

### 2.1 Get Docker

The easiest way to get Docker is to use a curl/bash script:

```
$ curl -sLSf https://get.docker.com | sudo sh
$ usermod pi -aG docker

# Now log out and log in again.
```

There are many ARM SoC boards available, but unfortunately many of them do not have a new enough Kernel available to run Docker and clustering services. If you really want to go cheap, then buy fewer boards which are known to work.

### 2.2 Docker & Python example

One of the most useful parts of the Docker eco-system is the range of base images and software made available by the community and by the company behind Docker, Docker Inc.

Browse: [Python on the Docker Hub](https://hub.docker.com/_/python)

Each image has a name like `python` followed by a tag representing its version. In this case we want `python:3`. We can further narrow things down by picking Debian + Python as a base image or Alpine Linux (a tiny Linux OS written for containers) + Python.

Let's write a tiny Flask webserver:

```
from flask import Flask
app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello, World!'
```
app.py

```
flask
```
requirements.txt

```
FROM python:3.6.7-alpine3.8
WORKDIR /root/
COPY app.py  .
COPY requirements.txt .
RUN pip install -r requirements.txt

EXPOSE 5000
CMD  ["python", "-m", "flask", "run", "--host=0.0.0.0"]
```
Dockerfile

Build and run the container:

```
$ docker build -t my-flask:0.1 .
$ docker run -t -i -p 5000:5000 my-flask:0.1
```

Try the RPi's IP address on port 5000 in a browser, then hit Control + C on the terminal to kill the container.

To find out whether an official Docker image supports the ARM architecture you can look at its README file. [Find out more here](https://github.com/docker-library/official-images#architectures-other-than-amd64).

### 2.3 Run something else

You don't have to use Docker for clustering or running web-applications, but they are the easiest to start with. I have a wide range of blog posts covering all sorts of applications. In fact with the Raspberry Pi you can make cool projects with external LED boards, the camera or additional storage attached over USB.

* [Holiday lights that harmonize around the globe](https://blog.alexellis.io/festive-docker-lights/)

* [Get eyes in the sky with your Raspberry Pi](https://blog.alexellis.io/track-flights-with-rpi/)

* [Live stream to YouTube with your Raspberry Pi and Docker](https://blog.alexellis.io/live-stream-with-docker/)

* [Attach USB storage to your Raspberry Pi](https://blog.alexellis.io/attach-usb-storage/)

You could even port my instructions for running a Ghost 1.0 blog with SSL over to [Raspberry Pi](https://blog.alexellis.io/your-ghost-blog/).

## 3.0 Try clustering

Now if you have more than one Raspberry Pi you can start to connect them together with networking so that their resources can be pooled together to create a cluster.

When you have a single RPi3 that's 4 cores, 1GB RAM and probably a 16GB SD card, but x6 of those gives 24 Cores, 6GB RAM and 96GB of storage - things are already starting to sound more interesting. 

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">You want to run distributed containers on your <a href="https://twitter.com/Raspberry_Pi?ref_src=twsrc%5Etfw">@Raspberry_Pi</a> cluster? I just tried Docker Swarm 18.05-ce and had a 3-node RPi2 cluster up and running with <a href="https://twitter.com/openfaas?ref_src=twsrc%5Etfw">@OpenFaaS</a> + samples within about 10-20 minutes including flashing the SD cards. <a href="https://t.co/VdlJAImcSv">https://t.co/VdlJAImcSv</a> <a href="https://t.co/fRAgr0rA3b">pic.twitter.com/fRAgr0rA3b</a></p>&mdash; Alex Ellis (@alexellisuk) <a href="https://twitter.com/alexellisuk/status/1009446648165040128?ref_src=twsrc%5Etfw">June 20, 2018</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> 

Once you have a piece of software running in a Docker container exposing a HTTP port, it's not much work to get it deployed in a cluster where it can be scaled and replicated across multiple devices.

This isn't the kind of clustering that can run a game faster or mine bitcoins. You can't even make a faster desktop computer this way, but you could build software that would power the back-end processing of a massive multiplayer online game or the control software for a bitcoin mining farm.

The kind of clustering we can do most simply with our devices is building, packaging and scaling web applications - something that applies in some way to almost every business.

You can hear more in my talk with Scott Hanselman back in Feburary on "Building a Serverless Raspberry Pi Cluster":

<iframe width="560" height="315" src="https://www.youtube.com/embed/ZyTLMnzehyU" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

You can cluster the flask app across one or more Raspberry Pis using Docker Swarm or Kubernetes.

### 3.1 Picking a clustering platform

You can build a Raspberry Pi cluster with Docker Swarm or Kubernetes. Docker Swarm is very light-weight and will leave more resources free for your experiments. It has fallen out of fashion somewhat with the hype and interest in the industry around managed Kubernetes services, but is still a strong option for learning distributed computing [with wide production usage](https://thenewstack.io/parity-check-bright-grey-container-prediction/).

Pick Swarm if you want "things to just work" and like an easy life. You can even run Swarm on a single node along with a few containers.

Here's a quick hack to turn our flask example into a scaleable application on a single Raspberry Pi using Swarm:

```
$ docker swarm init
$ docker service create --name my-flask --replicas=3 --publish 5000:5000 my-flask:0.1
```

When you're done run `docker service rm my-flask`. This process on Kubernetes is much more involved, but also more extensible and flexible. One of the pieces of software I introduce in the tutorials is OpenFaaS which automates away a lot of the inherent configuration options and complexity of Kubernetes to help you focus on just writing code.

Pick Kubernetes for the most benefit to your career - if you want to learn practical skills that you can take over to your everyday activities running software in the cloud. You'll need several nodes with one dedicated over to being a master. Unfortunately once the core Kubernetes components are deployed the ambient CPU usage will be high across the whole cluster and there will be little left for running your applications.

> It feels like Kubernetes has outgrown a 1GB Raspberry Pi

I maintain a set of instructions for setting up Kubernetes on Raspberry Pi which I'll go over in section 3.3. Unfortunately with each release of Kubernetes these instructions need a significant amount of time for re-testing. There are currently several hacks and work-arounds needed due to issues in the ecosystem and the lack of RAM on the device. It feels like Kubernetes is getting a bit too big to run on a small SoC board with 1GB RAM, but if you can live with the work-arounds and latency you can make it work.

### 3.2 Buy your cluster

For Docker Swarm you can get started with one or two RPis - with Kubernetes you will need 3-5 to make it usable.

Find a [bill of materials here](https://blog.alexellis.io/your-serverless-raspberry-pi-cluster/).

There are a few different options for connecting the boards together including the [BitScope Blade](http://www.bitscope.com/product/blade/), [PicoCluster](https://www.picocluster.com/), [laser-cut acrylic](https://www.amazon.co.uk/Clear-Acrylic-Layer-Cluster-Raspberry-NA/dp/B07972YQXC) and using screws. My favourite option is to use screw columns [like this](https://www.pololu.com/product/1952) and they are stackable to raise the height. To buy your own search on Google / eBay or AliExpress for "male standoffs" or "male screw columns".

> See also: my review of the [BitScope Blade and the state of netbooting on the Raspberry Pi](https://blog.alexellis.io/the-state-of-netbooting-raspberry-pi/).

For 32-bit ARM buy the Raspberry Pi 3B+ which is compatible with Docker Swarm and Kubernetes.

For 64-bit ARM I recommend the [Rock64 4GB](https://www.pine64.org/?page_id=7147) which I have tested with both Docker and Kubernetes using the latest Ubuntu image provided by the community. The additional RAM means that you get a much better experience, but do need to port software to the armv8 / aarch64 platform.

> Disclaimer: go off-piste at your own risk, even the Pine64 from the same manufacturer as the Rock64 does not support Kubernetes well due the lack of a mainline Kernel.

You can also rent a Raspberry Pi per month from [Mythic Beasts](https://www.mythic-beasts.com/order/rpi) or rent out a range of different ARM devices from [mininodes.com](https://www.mininodes.com) too.

### 3.3 Build your cluster

The following guides will help you to build out a fully-working cluster for Swarm or Kubernetes and then shows you how to make Docker and clusters even easier with OpenFaaS.

OpenFaaS uses Docker images and a set of standard templates for Node, Python, Go and other languages to package up code as highly-scalable and portable functions. There's not much you cannot do - from building web-pages to webhook receivers to Slackbots or even IoT processing pipelines. Just pick your favourite programming language - write your code and deploy it to the cluster.

If you want to use Docker Swarm then you can follow [my tutorial here](https://blog.alexellis.io/your-serverless-raspberry-pi-cluster/).

To use Kubernetes [start here](https://blog.alexellis.io/serverless-kubernetes-on-raspberry-pi/).

### 3.4 Share your build!

Tweet to me [@alexellisuk](https://twitter.com/alexellisuk) with your build so we can share your hard work with the community of ARM enthusiasts around the world. Here's one from Andrew Baxter just a few days ago:

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">An early visit from Santa. This little lot is destined to be a Kubernetes cluster running <a href="https://twitter.com/openfaas?ref_src=twsrc%5Etfw">@openfaas</a>, following the plan detailed in <a href="https://twitter.com/alexellisuk?ref_src=twsrc%5Etfw">@alexellisuk</a>&#39;s blog. ☺ <a href="https://t.co/0ZKkxpQzas">pic.twitter.com/0ZKkxpQzas</a></p>&mdash; Andrew Baxter 🇪🇺 (@ogden_clough) <a href="https://twitter.com/ogden_clough/status/1075335195719593984?ref_src=twsrc%5Etfw">December 19, 2018</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> 

### 3.5 Do real work

I'm often asked whether there is any point in deploying applications to a hobbyist-grade ARM SoC such as a Raspberry Pi. It is true that these devices are underpowered and depend on unreliable SD cards for storage, but there is a whole industry based upon this very use-case. Take [Balena](https://www.balena.io/) (previously known as Resin.io) for instance who have built a dedicated OS based around Docker containers and remote management. You can flash their OS, plug in your device in one of your office or factory locations and it will apepar on your management dashboard ready to receive your chosen software.

> This year at VMworld 2018 VMware's CTO Ray O 'Farrell showed us [a Raspberry Pi running ESXi](https://vinfrastructure.it/2018/11/vmware-esxi-on-raspberry-pi/) - a leading hypervisor normally seen in the datacenter.

One of the most promising applications I've seen for a Raspberry Pi cluster this year was from [Tanuj Thapliyal](https://twitter.com/tanujt). He gave me a personal demo of his cluster at work whilst we were in Seattle for KubeCon a couple of weeks ago.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">I got a demo from <a href="https://twitter.com/tanujt?ref_src=twsrc%5Etfw">@tanujt</a> of his ML-driven camera software that can run on Raspberry Pi with Kubernetes. Very cool stuff and my blog post helped him set up the infrastructure 👌 <a href="https://twitter.com/spot_ai?ref_src=twsrc%5Etfw">@spot_ai</a> <a href="https://t.co/1Cc7PatstK">pic.twitter.com/1Cc7PatstK</a></p>&mdash; Alex Ellis (@alexellisuk) <a href="https://twitter.com/alexellisuk/status/1074356065083510785?ref_src=twsrc%5Etfw">December 16, 2018</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> 

Tanuj has co-founded a company named [Spot AI](https://twitter.com/spot_ai) which is making use of ARM SoCs for business purposes. He is currently building clusters made of low-cost Raspberry Pi cameras which crunch streams of video data that. This is a task that is too slow and costly to transmit back to a larger datacenter for processing. In the live demo his cameras used a hardware-assistance module to power a machine-learning model that was identifying all the objects found in each video frame.

He also shared on Twitter how he found it easier to make use of Serverless Functions with OpenFaaS on his devices than the traditional approaches for deploying code. One of the benefits of using OpenFaaS it that is works exactly the same way on-premises or in the cloud.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">thanks for spotting that :)<br><br>we&#39;re discovering that using <a href="https://twitter.com/openfaas?ref_src=twsrc%5Etfw">@openfaas</a> - at the edge can be used to solve really significant business problems where the data can&#39;t be moved for whatever reason (too much data, too $$, too much time, too insecure)</p>&mdash; Tanuj Thapliyal (@tanujt) <a href="https://twitter.com/tanujt/status/1075490693663973376?ref_src=twsrc%5Etfw">December 19, 2018</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> 

### 3.6 Get connected

If you need help or want to share ideas then feel free to reach out over [Twitter @alexellisuk](https://twitter.com/alexellisuk), or join the OpenFaaS Slack channel where we have a dedicated channel to discuss [ARM & RPi](https://docs.openfaas.com/community). You will also find Ed hanging out there.

## Wrapping up

We've explored the various types of ARM from 32-bit SoCs to 64-bit datacenter-grade bare metal. We talked about the practicalities of building and porting software for ARM and how to start making use of Docker to make this easier. We then went on to outline two methods of clustering, which devices to buy and how to start making clustering even easier with [OpenFaaS: Serverless Functions Made Simple](https://www.openfaas.com/).

### You may also like

* Video: [Building a Raspberry Pi Kubernetes Cluster and running .NET Core - Alex Ellis & Scott Hanselman](https://www.youtube.com/watch?v=ZyTLMnzehyU)

* Video: [Interview on OpenFaaS with theCUBE | DevNet Create 2018](https://www.youtube.com/watch?v=J8UYZ1GXNTQ&t=178s)

* Blog: [Five tips to move your project to Kubernetes](https://blog.alexellis.io/move-your-project-to-kubernetes/)

> Thanks to [Richard Gee](https://twitter.com/rgee0) for proof reading and feedback