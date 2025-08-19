---
title: "Open Source Summit 2017 (recap)"
slug: "open-source-summit"
date: "2019-09-07T08:51:05Z"
author: "Alex Ellis"
meta_title: "Open Source Summit 2017 (recap)"
meta_description: "This is a recap of my experience at the Open Source Summit in 2017. A draft that I never finished, here are the raw materials including lots of photos."
tags:
  - "trip"
  - "serverless"
  - "openfaas"
  - "oss"
  - "summit"
  - "linuxfoundation"
---

> This is a recap of my experience at the Open Source Summit in 2017. A draft that I never finished, here are the raw materials including lots of photos.

## Main event

The Open Source Summit or #OSSummit took place in the JW Marriot Live in LA and was a collection of industry events held under one roof but running in separate tracks. This event was previously known as "LinuxCon".

**Conference format**

Each morning over Monday, Tuesday and Wednesday there were keynote sessions lead by the Linux Foundation from 9-11.30 followed by talks in the various tracks for the rest of the day.

Keynotes focused on:

* Importance of building and encouraging community
* New projects and partners joining the CNCF
* The reach and scale of Linux and containers

Dan Kohn who heads up the Cloud Native Computing Foundation (CNCF) announced that two new projects had joined the CNCF.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Thrilled to have <a href="https://twitter.com/EnvoyProxy">@EnvoyProxy</a> and <a href="https://twitter.com/JaegerTracing">@JaegerTracing</a> as part of <a href="https://twitter.com/CloudNativeFdn">@CloudNativeFdn</a> and now the new <a href="https://twitter.com/hashtag/CloudNativeLandscape?src=hash">#CloudNativeLandscape</a> 0.9.7 <a href="https://t.co/65Put1rFQw">pic.twitter.com/65Put1rFQw</a></p>&mdash; Dan Kohn (@dankohn1) <a href="https://twitter.com/dankohn1/status/908302499198545921">September 14, 2017</a></blockquote> <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

The first project donated to the CNCF was Kubernetes, but the foundation now has over 118 members showing 5x growth over 2 years.

<blockquote class="twitter-tweet" data-lang="en"><p lang="und" dir="ltr"><a href="https://twitter.com/hashtag/OSSummit?src=hash">#OSSummit</a> <a href="https://t.co/BI8gRwyJQG">pic.twitter.com/BI8gRwyJQG</a></p>&mdash; Alex Ellis (@alexellisuk) <a href="https://twitter.com/alexellisuk/status/908006584063848448">September 13, 2017</a></blockquote> <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

### 5 minute summary

Here's a 5-min video I was sent by Greg Pollack - it's an excellent summary of the first day of the conference and has a nice mention of the OpenFaaS project at 2min 50 secs.

<iframe width="560" height="315" src="https://www.youtube.com/embed/3yl294IK1Vk?rel=0" frameborder="0" allowfullscreen></iframe>

### Zero to serverless in 60 seconds

My talk was called [Zero to Serverless in 60 seconds, anywhere](https://ossna2017.sched.com/event/BDx5/from-zero-to-serverless-in-60-seconds-anywhere-alex-ellis-adp) and was held on the Monday in Gold Ballroom 4. 67 people registered for the event and all demos ran smoothly!

Only the keynote sessions were recorded, but I gave a very similar talk to 220 people at the [Cloud Native London meetup the week before which has a HD recording](https://skillsmatter.com/skillscasts/10813-faas-and-furious-0-to-serverless-in-60-seconds-anywhere).

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr"><a href="https://twitter.com/hashtag/DockerCaptain?src=hash">#DockerCaptain</a> <a href="https://twitter.com/alexellisuk">@alexellisuk</a> talking about his <a href="https://twitter.com/OpenFaaS">@OpenFaaS</a> project and its foundation in <a href="https://twitter.com/Docker">@Docker</a> and containers <a href="https://t.co/3C5MhrrDNO">pic.twitter.com/3C5MhrrDNO</a></p>&mdash; Phil Estes (@estesp) <a href="https://twitter.com/estesp/status/907367106026471424">September 11, 2017</a></blockquote> <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

I gave a live demo of converting a QuickTime video file to an animated GIF via a Serverless function:

<blockquote class="twitter-video" data-lang="en"><p lang="en" dir="ltr">This is <a href="https://twitter.com/ah3rz">@ah3rz</a> dream demo...live GIF making <a href="https://twitter.com/hashtag/FaaS?src=hash">#FaaS</a> by <a href="https://twitter.com/alexellisuk">@alexellisuk</a> <a href="https://twitter.com/hashtag/OSSummit?src=hash">#OSSummit</a> <a href="https://t.co/d1ayZ8gOe5">pic.twitter.com/d1ayZ8gOe5</a></p>&mdash; Ashlynn Polini (@AshlynnPolini) <a href="https://twitter.com/AshlynnPolini/status/907368628453908480">September 11, 2017</a></blockquote> <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

Gordon, Docker's Mascot received a cash bonus through a Serverless Alexa skill.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Thanks <a href="https://twitter.com/alexellisuk">@alexellisuk</a> for all the cash bonuses this year. Always enjoy your <a href="https://twitter.com/hashtag/serverless?src=hash">#serverless</a> talks <a href="https://twitter.com/hashtag/OSSummit?src=hash">#OSSummit</a> <a href="https://twitter.com/EventsLF">@EventsLF</a> <a href="https://t.co/NknSBsvIc8">pic.twitter.com/NknSBsvIc8</a></p>&mdash; Gordon the Turtle (@gordonTheTurtle) <a href="https://twitter.com/gordonTheTurtle/status/907365624719872001">September 11, 2017</a></blockquote> <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

If you would like to find out more about the project head over to [openfaas.com](https://www.openfaas.com/).

## Moby Summit

The Moby Summit was at the end of the Open Source Summit event and followed a familiar format: in the morning the various Moby project leads presented the progress and developments made by their teams along with a technical demo.

Some demos included:

* buildkit (premier)
* linuxkit on ARM64
* notary for image signing
* containerd and cri-containerd (via Google)

And as a last minute addition the OpenFaaS serverless project.

In the afternoon everyone breaks out into areas by common interest or project and collaborates together - either to evaluate the projects and give feedback or to start hacking on the source code. This is always a very hands-on time involving whiteboards, heated discussion and hacking. At the end of the day notes are collated and presented back by to the wider group.

The first [Moby Summit](https://blog.alexellis.io/docker-berlinsummit-2016/) was [held in Berlin in October 2016](https://blog.alexellis.io/docker-berlinsummit-2016/).

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Serverless making a guest appearance​ at the <a href="https://twitter.com/moby">@Moby</a> Summit <a href="https://twitter.com/open_faas">@open_faas</a> <a href="https://t.co/NoRXStbHEN">pic.twitter.com/NoRXStbHEN</a></p>&mdash; Alex Ellis (@alexellisuk) <a href="https://twitter.com/alexellisuk/status/908396678054600704">September 14, 2017</a></blockquote> <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

Patrick Chanezon from Docker Inc was heading up the event and doing live tweeting. Here are some of the highlights from the OpenFaaS talk:

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr"><a href="https://twitter.com/hashtag/MobySummit?src=hash">#MobySummit</a> <a href="https://twitter.com/OpenFaaS">@openfaas</a> backends are pluggable: you could build one with LinuxKit + <a href="https://twitter.com/containerd">@containerd</a> <a href="https://t.co/2FX1pVdz17">pic.twitter.com/2FX1pVdz17</a></p>&mdash; chanezon (@chanezon) <a href="https://twitter.com/chanezon/status/908441140449263616">September 14, 2017</a></blockquote> <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr"><a href="https://twitter.com/hashtag/MobySummit?src=hash">#MobySummit</a> Derek is a simple chatbot for Github on top of <a href="https://twitter.com/OpenFaaS">@openfaas</a> that gives you finer grained access control for operations on your repo <a href="https://t.co/PL9qSxlNeO">pic.twitter.com/PL9qSxlNeO</a></p>&mdash; chanezon (@chanezon) <a href="https://twitter.com/chanezon/status/908440202003152896">September 14, 2017</a></blockquote> <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

### OpenFaaS Birds of a Feather session

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">At the <a href="https://twitter.com/moby">@moby</a> summit in the <a href="https://twitter.com/hashtag/serverless?src=hash">#serverless</a> bof session with <a href="https://twitter.com/open_faas">@open_faas</a> <a href="https://t.co/RRQRgmgPbu">pic.twitter.com/RRQRgmgPbu</a></p>&mdash; Alex Ellis (@alexellisuk) <a href="https://twitter.com/alexellisuk/status/908490567683903489">September 15, 2017</a></blockquote> <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr"><a href="https://twitter.com/hashtag/MobySummit?src=hash">#MobySummit</a> lot of action in <a href="https://twitter.com/OpenFaaS">@OpenFaaS</a>, opportunities with <a href="https://twitter.com/moby">@moby</a> <a href="https://t.co/bOVMDs2Rhf">pic.twitter.com/bOVMDs2Rhf</a></p>&mdash; chanezon (@chanezon) <a href="https://twitter.com/chanezon/status/908442348782182400">September 14, 2017</a></blockquote> <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr"><a href="https://twitter.com/hashtag/OSSSummit?src=hash">#OSSSummit</a> <a href="https://twitter.com/OpenFaaS">@OpenFaaS</a> <a href="https://twitter.com/tensorflow">@tensorflow</a> example: recognizes a whale in a picture with 2 lines of code <a href="https://t.co/Z1gKtcJzJo">pic.twitter.com/Z1gKtcJzJo</a></p>&mdash; chanezon (@chanezon) <a href="https://twitter.com/chanezon/status/907795270552842241">September 13, 2017</a></blockquote> <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

## Other networking

In the expo area Microsoft were demoing the Windows Subsystem for Linux which enables native execution of Linux binaries on a Windows system.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Had fun playing with WSL, Go, <a href="https://twitter.com/open_faas">@open_faas</a> and bash with <a href="https://twitter.com/gigastarks">@gigastarks</a> at the MS booth <a href="https://t.co/CB7mGZWSbx">pic.twitter.com/CB7mGZWSbx</a></p>&mdash; Alex Ellis (@alexellisuk) <a href="https://twitter.com/alexellisuk/status/907774597579153408">September 13, 2017</a></blockquote> <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

I met with John Starks the lead developer of "Linux on Windows" to talk about Serverless on a [mixed Windows and Linux cluster](https://blog.alexellis.io/multi-os-serverless-cluster/). I also had a chance to play with the Surface Laptop - which was a very cool device.

## Follow me

* Follow me on Twitter [@alexellisuk](https://twitter.com/alexellisuk)

* Check out my [Open Source work](https://github.com/alexellis/)