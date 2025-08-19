---
title: "Dockercon 2017 - Captain's Log"
slug: "dockercon-2017-captains-log"
date: "2017-04-25T11:29:32Z"
author: "Alex Ellis"
meta_title: "Dockercon 2017 - Captain's Log"
meta_description: "Read my highlights of Dockercon 2017 including exciting tech and a long list of people that helped make my serverless FaaS Cool Hacks submission a success."
feature_image: "/content/images/2017/04/1500x500.jpg"
tags:
  - "Dockercon"
  - "recap"
  - "write-up"
  - "debrief"
  - "captain's log"
  - "speakers's notes"
---

Last week I flew out to Austin a couple of days before the start of Dockercon 2017 - Docker's flagship conference in the US to attend as a Captain, speaker, mentor and a tech enthusiast. It did not disappoint - in this post I'll share my highlights and thank some key people.

#### Dockercon 2016

In early 2016 I spent several weeks putting together and refining a [hands-on Docker training course](https://github.com/alexellis/handsondocker) driven by a passion to share what I'd learnt about Docker. I ran this as workshops or labs internally at ADP and in the community in Peterborough, UK. This was part of a series of events that lead to me being invited to join the [Captains program](https://www.docker.com/community/docker-captains).

I travelled out to Seattle in June 2016 to give a talk in the community theatre and to participate in Captains activities. You can read my [speaker notes here](http://blog.alexellis.io/dockercon-2016-speaker-notes/).

Since then I've been blogging 1-3 times per week around containers and related tech, building hacks and getting involved with the Docker community has been very encouraging along the way. The [Captains program](https://www.docker.com/community/docker-captains) lead by [Jenny Burcio](https://twitter.com/TheBurce) has provided lots of opportunities to get involved and to mingle with engineering, product and marketing folks at Docker.

### Austin

#### 1. Cool Hacks winning submission

One of the key objectives of this trip was to rehearse, tune and deliver my Cool Hack presentation and demos to the Dockercon audience in the closing ceremony called Moby's Cool Hacks. This would be a crowd of Docker enthusiasts  numbering over five thousand plus additional watchers on a live stream. It had been a long term goal for me ever since the previous year - where I ended up cutting my teeth as a Dockercon speaker in a packed-out community theatre talking about [Raspberry Pi, Docker Swarm and IoT](http://blog.alexellis.io/dockercon-2016-speaker-notes/). My 2016 Hack was called Protecting the datacenter with IoT temperature and motion sensors.

**Functions as a Service**

My Cool Hack called - [Functions as a Service (or FaaS)](http://get-faas.com) is a framework for building serverless applications on Docker. The demo covered several applications of serverless functions and you can see them in action on the [Docker blog re-cap post Moby's Cool Hacks](https://blog.docker.com/2017/04/dockercon-2017-mobys-cool-hack-sessions/).

*Watch the closing keynote video*

<iframe width="560" height="315" src="https://www.youtube.com/embed/-h2VTE9WnZs?start=954" frameborder="0" allowfullscreen></iframe>

**Serverless demos:**

Here's a quick summary of my serverless demos.

* An Alexa skill called My Assistant which could award a cash bonus to employees and calculate a payroll 
* An Alexa skill in Golang that could integrate with the MobyMingle meetup program being run at Dockercon and pull out keywords and the total amount of mingles
* A webhook receiver to monitor and audit events from mirroring thousands of files from the West to East coast via a Minio S3 server
* A GitHub Fanclub application - having deployed a fanclub function earlier in the day and set that on my GitHub's webhooks page - every time someone starred FaaS, their photo was downloaded and transferred to a Minio S3 server mirrored live to my Desktop.

You can find the code in the [faas-dockercon](https://github.com/alexellis/faas-dockercon) repository on GitHub.

The GitHub demo had such a high response from the audience and live-stream that we triggered a traffic filter!

<a href="https://twitter.com/tiffanyfayj/status/854822984724434944"><img src="https://pbs.twimg.com/media/C9zw-HSUwAIKGO1.jpg" width="55%"><p>Tweet by Tiffany Jernigan</p></a>

Here's what happened in the stats during the Github demo. The Fanclub function got so much load that it also auto-scaled all the way to 20 replicas.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">During my Cool Hack <a href="https://twitter.com/DockerCon">@DockerCon</a> triggered a denial of service attack on <a href="https://twitter.com/github">@github</a> through stars. See the functions here <a href="https://t.co/MCFMnqB5X2">https://t.co/MCFMnqB5X2</a> <a href="https://t.co/cw8fLXiIfW">pic.twitter.com/cw8fLXiIfW</a></p>&mdash; Alex Ellis (@alexellisuk) <a href="https://twitter.com/alexellisuk/status/855064655538139136">April 20, 2017</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

**Thank you - to everyone that helped**

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr"><a href="https://twitter.com/alexellisuk">@alexellisuk</a> killed!  <a href="https://twitter.com/hashtag/faas?src=hash">#faas</a> demo with <a href="https://twitter.com/hashtag/docker?src=hash">#docker</a> at <a href="https://twitter.com/hashtag/DockerCon?src=hash">#DockerCon</a> and won the Moby Cool Hacks! <a href="https://twitter.com/hashtag/dockercaptain?src=hash">#dockercaptain</a> <a href="https://t.co/JzRaS18czm">pic.twitter.com/JzRaS18czm</a></p>&mdash; Bret Fisher (@BretFisher) <a href="https://twitter.com/BretFisher/status/854849886868713473">April 20, 2017</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

Many hours, days and weeks went into this Cool Hack starting back as early as October 2016. It's been a labor of love and I'm very happy with the progress made, but I need to thank some people that helped along the way.

* Docker
 * [Amir Chaudhry](https://twitter.com/amirmc) for advocating for my hack internally, helping keep my talk focused and for making me rehearse over and over again :-)
 * [Justin Cormack](https://twitter.com/justincormack) for inviting me over to the Cambridge office to hangout for the day and bounce serverless ideas around
 * [Patrick Chanzeon](https://twitter.com/chanezon) for ideas around auto-scaling via AlertManager and encouraging me to peruse my Cool Hack as a contest entry
 * [Madhu Venugopal](https://twitter.com/MadhuVenugopal) from Docker's Swarm / networking team for getting up at 5am to video conference and debug Swarm performance and Healthchecks while performance testing FaaS
* ADP Peterborough
 * For being supportive of my Captains activities and releasing me for the week to attend Dockercon
* [Packet.net](https://packet.net) for generously supplying me with fast infra-structure for testing and running my FaaS demo.
* Alina and Alex (CTO) from the [E-180 team behind MobyMingle](https://www.e-180.com/).  They pulled together an API in less than two weeks so we could have some fun with the data collected during the conference. 
* Community
 * For trying out FaaS, [building your own functions](https://github.com/alexellis/faas/blob/master/community.md), speaking at meet-up groups and telling me what was broken or missing. This really helped.
 * [Kelsey Hightower](https://twitter.com/kelseyhightower) gave me a couple of pointers - specifically to focus on ease of use via a UI and quick, hands-off deployments
 * [Julius Volz](https://twitter.com/juliusvolz) (Prometheus co-founder) for helping me get to grips with PromQL and for tuning my queries for the demo.
 * Thanks to the Minio team for answering questions about your S3 server and helping me get [webhook support merged into your server component](https://blog.minio.io/introducing-webhooks-for-minio-e2c3ad26deb2) 

*If I've managed to miss you off the list then thanks so much for helping me along the way.*

#### 2. Mentoring and collaboration

In this section I want to talk about paying forward. I've got a lot out of the Captains program and have had the opportunity to give back and help advocate for others.

**Finnian Anderson**

A few months ago I had a ping on Twitter from a 17-year old in the UK telling me he'd built a Raspberry Pi cluster and learned Docker by following my tutorials. I was able to advocate for him through my Docker Captain connections and help promote his blog including giving some guidance on blogging.  

[Victor Coisne](https://twitter.com/vcoisne) from Docker's community marketing team wrote a blog post celebrating [Docker's 4th Birthday](https://blog.docker.com/2017/03/thank-you-docker-community-2/) and called me out for mentoring and leadership in the community, which was really encouraging. Victor was Finnian's main contact.

Finnian kept on hacking and writing and one of his projects stood out for the Community Theatre - a gauge made with a Raspberry Pi to show the level of strain on a Docker Swarm. I was able to come and help Finnian set up, take some photos and support - much like someone had done for me the previous year.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">This is <a href="https://twitter.com/developius">@developius</a> - 17 from the UK - why i wish i learned Docker while i was 12 <a href="https://t.co/tvUvcgQqPp">pic.twitter.com/tvUvcgQqPp</a></p>&mdash; Alex Ellis (@alexellisuk) <a href="https://twitter.com/alexellisuk/status/854371639018106881">April 18, 2017</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

We ran a Raspberry Pi workshop on Day Zero and Finnian helped test the content and then was hands-on during the workshop helping people learn Raspberry Pi and Docker.

Finnian got a mention by [Ben Golub](https://twitter.com/golubbe) (Docker's CEO) in the opening session on Day 1 - which was super cool!

He showed a great technical ability to learn and adapt - setting up his Twitter monitor to call home via a remote SSH tunnel for easy administration and writing FaaS functions between sessions. Here's one of his PRs: [PR 54: Adds some examples to the use cases](https://github.com/alexellis/faas/pull/54). I was impressed and am looking forward to working together more.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Very cool to hear people at <a href="https://twitter.com/DockerCon">@dockercon</a> are checking out FaaS - here&#39;s a really neat function by <a href="https://twitter.com/developius">@developius</a> <a href="https://t.co/GYeKzQ7g4X">https://t.co/GYeKzQ7g4X</a> <a href="https://t.co/Id5GmY8QgQ">pic.twitter.com/Id5GmY8QgQ</a></p>&mdash; Alex Ellis (@alexellisuk) <a href="https://twitter.com/alexellisuk/status/853818592676245507">April 17, 2017</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

**Mario Cruz**

I need to give a special mention to Mario Cruz from Miami (also known as Mario Maker) who spent many hours prototyping and building an awesome wooden container to hold a Raspberry Pi timelapse. Mario actually built two of these - one was put on display in the hallways which you may have seen taking a timelapse 24/7 during the event. The second was used in the workshop and as a tester.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Thanks to <a href="https://twitter.com/mariocruz">@mariocruz</a> for building a very cool Container enclosure to host a <a href="https://twitter.com/Raspberry_Pi">@Raspberry_Pi</a>, Camera and 1TB PiDrive from <a href="https://twitter.com/julie_wdc">@julie_wdc</a>. <a href="https://t.co/dwNjWC121l">pic.twitter.com/dwNjWC121l</a></p>&mdash; Alex Ellis (@alexellisuk) <a href="https://twitter.com/alexellisuk/status/856473636169011200">April 24, 2017</a></blockquote> <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

Inside the box were: Raspberry Pi 3, RPi Color Camera (8MP), WDLabs 1TB PiDrive (sponsored by Julie Wiesen from WDLabs) and a 3.5Amp power supply.

He also donated a one-off set of wooden coin for my workshop pictured below for everyone in the workshop.

![](https://pbs.twimg.com/media/C9pSkoTUMAAU8TT.jpg:medium)

**RPi Workshop**

The Docker and Raspberry Pi workshop held on Day Zero was made possible by the collaboration with Pimoroni to create a special one-off bundle. Thanks to the guys in Sheffield UK for soldering all 50+ headers onto the Pis for us.

The Teaching Assistants gave valuable feedback on the days leading up to the event and then helped people get up and running with their Pi Zeros on the day. Thanks Nirmal, Jonas, Mario, Finnian and Jesse.

**Buy the kit for yourself - code DOCKER 10% off**

Pimoroni have created a special Dockercon discount code for those that missed out on the workshop. The [Pi Zero W starter kit](https://shop.pimoroni.com/products/pi-zero-w-starter-kit) contains everything you need to get started with the Dockercon workshop.

*Use code DOCKER for 10% off this kit (only). Pimoroni ship world-wide*

The instructions are on GitHub: [docker-blinkt-workshop](https://github.com/alexellis/docker-blinkt-workshop)

![](https://pbs.twimg.com/media/C9pA3UoVwAAiFml.jpg)


### 3. Captains gonna Captain

The Docker Captains are an awesome, supportive and inspiring group of individuals - it's great to be a part of it. Some of us met for the first time in Seattle, or Berlin and are already firm friends - collaborating and spurring each other on.

One of the most useful parts of the program for me is the open access to the Docker teams. There are regular private briefings for the Captains and we are trusted with embargoed information so that we can prepare ourselves and get ahead of the game ready for when announcements are made public.

Jenny arranged a Captains summit for us where we talked about how the program should develop and we were able to welcome in a set of new Captains. I should also mention the awesome swag - a laptop bag with our logo sewn on, custom socks and a very cool blue hoodie that most of us wore all week long!

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Cheers capatins!!! <a href="https://twitter.com/hashtag/DockerCon17?src=hash">#DockerCon17</a> <a href="https://t.co/QWLGT30WkZ">pic.twitter.com/QWLGT30WkZ</a></p>&mdash; Jimena Tapia (@tapiajimena) <a href="https://twitter.com/tapiajimena/status/854832709918699522">April 19, 2017</a></blockquote> <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

Each one of us brings something different to the table, so I would highly recommend you to follow us all on Twitter so that you can get tips, tutorials, videos, training courses and more.

* [Follow all the Captains on Twitter with a Docker container](http://blog.alexellis.io/follow-all-captains/).
* Come and talk to us and ask us your questions on [Docker Community Slack](https://dockr.ly/community)

We also speak, organise meet-ups and blog - so if you've got a great idea for an event or a hack please share it with us.
 
### 4. Dockercon talks

I spoke to [Johnathon](https://twitter.com/xetorthio) and [Marcos](https://twitter.com/marcosnils) (two of the other captains who presented in the Cool Hacks ceremony) and we realised that we hadn't been able to attend any talks other than the general sessions because of all the rehearsals. We'll be catching up with all the recordings as soon the jet-lag has worn off.

Having said that - here's two of the most interesting announcements for me personally.

**LinuxKit**

[LinuxKit](https://github.com/linuxkit/linuxkit) has been spun out of the internals of projects like Docker for Mac and enables you to build an entire bootable Linux OS which is secure by default in a few seconds. Try it out with [my 10 minute tutorial building an OpenSSH OS with LinuxKit](http://blog.alexellis.io/boot-linuxkit-in-10-mins/).

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Boot an OpenSSH server in 10 mins with LinuxKit from <a href="https://twitter.com/docker">@docker</a> <a href="https://t.co/tTocWVEJRI">https://t.co/tTocWVEJRI</a> <a href="https://twitter.com/DockerCon">@dockercon</a> <a href="https://twitter.com/hashtag/MobyProject?src=hash">#MobyProject</a> <a href="https://t.co/of9G5xZ1yj">pic.twitter.com/of9G5xZ1yj</a></p>&mdash; Alex Ellis (@alexellisuk) <a href="https://twitter.com/alexellisuk/status/856109591079387136">April 23, 2017</a></blockquote> <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>
**Microsoft's mix and match Hyper-V**

Microsoft announced that it's now possible to run several Linux and Windows container daemons at the same time concurrently on Windows Server. I believe this is still under development, but opens up some great opportunities. 

I'm really interested in trying this out - especially for porting my [FaaS serverless project to Windows containers](https://github.com/alexellis/faas/blob/win_watchdog/watchdog/Dockerfile.win).

### Summing up

On the flight home I started to write down all the key conversations I'd had and needed to follow-up on - it was three pages long, in very small writing. For me this year's event has really been about collaborating with the awesome Docker community and making new connections.

I'm looking forward to what's to come next including [Dockercon EU](http://europe-2017.dockercon.com) in October this year and Dockercon San Francisco in 2018 (if I can find a way to make it there). 

**Internals summit**

On Thursday many Docker contributors and people in industry had the chance to gather together to hear about the latest developments in InfraKit, SwarmKit, MirageOS, LinuxKit, containerd and several of the other lower level components within the Docker stack. This kind of time is great for engineers like myself - to ask important questions and to hear what is coming next.

The first time I attended an internals summit was in [Berlin in October](http://blog.alexellis.io/docker-berlinsummit-2016/) and it was a cross between a hackathon and a training/briefing. If you are technically-minded and have the chance to attend one of these sessions, don't pass it up.

### Following-up

I'm seeking contributions for [my FaaS project](http://github.com/alexellis/faas) including documentation, use-cases and help to shape it into a 1.0 release. Please get in touch on [GitHub](http://github.com/alexellis/faas) and [Twitter @alexellisuk](http://twitter.com/alexellisuk). I'm also defining [a roadmap](https://github.com/alexellis/faas/blob/master/ROADMAP.md).


You can find the functions from my live demo in the [faas-dockercon](https://github.com/alexellis/faas-dockercon) repository on GitHub.

Mano Marks wrote a re-cap on both of [Moby's Cool Hacks](https://blog.docker.com/2017/04/dockercon-2017-mobys-cool-hack-sessions/) on the Docker blog. You can watch the live video recording there too.

The Raspberry Pi workshop is scheduled to be repeated at Dockercon EU in Copenhagen and the instructions are on GitHub: [docker-blinkt-workshop](https://github.com/alexellis/docker-blinkt-workshop). The [hardware kit is on sale at Pimoroni](https://shop.pimoroni.com/products/pi-zero-w-starter-kit) with international shipping - *use code DOCKER for 10% off*.

If you'd like to learn more about Minio which can be used to store objects (files) and even as a back-end for a Docker registry - read [my introductory blog post](http://blog.alexellis.io/meet-minio/).