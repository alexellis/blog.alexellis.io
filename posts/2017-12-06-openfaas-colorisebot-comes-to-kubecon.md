---
title: "Colorisebot and OpenFaaS"
slug: "openfaas-colorisebot-comes-to-kubecon"
date: "2017-12-06T15:50:41Z"
author: "Alex Ellis"
meta_title: "Colorisebot and OpenFaaS"
meta_description: "Learn how Colorisebot is turning black and white family photos, cult classics and fine art images back to colour with OpenFaaS and Kubernetes."
feature_image: "/content/images/2017/12/cncf_day1.jpg"
tags:
  - "openfaas"
  - "colorisebot"
  - "gke"
  - "kubernetes"
  - "cncf"
  - "kubecon"
---

You can tweet any black and white photo to [Colorisebot](https://twitter.com/colorisebot) and it will turn it into colour instantly and reply back to you with the result - whether that's a family photo, fine art from Ansel Adams or a clip from your favourite Dr. Who episode.

Colorisebot has gained fans around the world and was picked up by the global media too.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">.<a href="https://twitter.com/alexellisuk?ref_src=twsrc%5Etfw">@alexellisuk</a> look at 0:40 of this video from major french newspaper LeMonde : don&#39;t see something familiar ? <a href="https://twitter.com/hashtag/docker?src=hash&amp;ref_src=twsrc%5Etfw">#docker</a> &amp; <a href="https://twitter.com/hashtag/openfaas?src=hash&amp;ref_src=twsrc%5Etfw">#openfaas</a> powa :) /cc <a href="https://twitter.com/laurentgrangeau?ref_src=twsrc%5Etfw">@laurentgrangeau</a> <a href="https://t.co/t2c0aaPrYg">https://t.co/t2c0aaPrYg</a></p>&mdash; Adrien Blind (@AdrienBlind) <a href="https://twitter.com/AdrienBlind/status/933027888307240960?ref_src=twsrc%5Etfw">November 21, 2017</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> 
 
### Background story

The idea for [Colorisebot](https://twitter.com/colorisebot) came from two 17-year old developers from Britain: [Finnian Anderson](https://twitter.com/developius) and [Oli Callaghan](https://twitter.com/olicallaghan_).

> I met Finnian earlier this year when he stumbled upon one of my many tutorials for building a Raspberry Pi cluster. We hit it off immediately and began collaborating together where I would mentor, encourage and advocate for him.

Over the year that we've known each other I've seen Finnian speak at Dockercon twice and grow as he has become a part of the global container community.

### From Dockercon to KubeCon

Leading up to Dockercon Finnian and I worked around the clock to create a Twitter bot with OpenFaaS that could scale to demand, handle failures and rate limiting and found a home for it on Docker Swarm hosted on Packet.net's bare metal offering.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr"><a href="https://twitter.com/hashtag/TeamServerless?src=hash&amp;ref_src=twsrc%5Etfw">#TeamServerless</a> community joining together 7pm BST for a <a href="https://twitter.com/DockerCon?ref_src=twsrc%5Etfw">@Dockercon</a> recap and <a href="https://twitter.com/openfaas?ref_src=twsrc%5Etfw">@openfaas</a> contributors meeting 👏💻😃 <a href="https://t.co/fTRCGd3zjQ">pic.twitter.com/fTRCGd3zjQ</a></p>&mdash; Alex Ellis (@alexellisuk) <a href="https://twitter.com/alexellisuk/status/922009328151879681?ref_src=twsrc%5Etfw">October 22, 2017</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> 

Since Dockercon we've hardened the code for the bot to make it more resilient and easier to manage including building a rich dashboard with Grafana and Prometheus. We also started to work with [weaveworks](https://www.weave.works) and are excited to say that has resulted in us moving Colorisebot to a sponsored cluster on Google Kubernetes Engine (GKE). Stefan Prodan from DX at weaveworks (also a [very active OpenFaaS contributor](https://twitter.com/stefanprodan/status/935453457452097537)) helped us integrate with Weave Cloud for monitoring for visualisation of traffic between functions.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr"><a href="https://twitter.com/openfaas?ref_src=twsrc%5Etfw">@openfaas</a> on Google <a href="https://twitter.com/hashtag/Kubernetes?src=hash&amp;ref_src=twsrc%5Etfw">#Kubernetes</a> engine ! <a href="https://t.co/VYqNmp1N6d">https://t.co/VYqNmp1N6d</a></p>&mdash; Chen Goldberg (@GoldbergChen) <a href="https://twitter.com/GoldbergChen/status/938073592054591489?ref_src=twsrc%5Etfw">December 5, 2017</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

### 10,000 ft

![](/content/images/2017/12/Screen-Shot-2017-12-05-at-13.37.18.png)

This is a 10,000ft view of what's going on whenever you tweet.

> OpenFaaS uses a long-running service (tweet-listener) to sync with Twitter's streaming API. Any tweeted photos are stored in [Minio](https://minio.io) (Object Storage) and then the Colorise function is invoked by the OpenFaaS Gateway.

Colorising an image is CPU intensive so takes 5-10 seconds and runs asynchronously through the use of NATS Streaming (Kakfa is also available). Finally when that's done the Tweet-pic function gets called - colours are normalised with ImageMagick and we Tweet back to you using a Python function.

You can read the source-code over on GitHub - [repaint-the-past](https://github.com/alexellis/repaint-the-past/).

### From the KubeCon keynote

OpenFaaS featured in Alexis Richardson's keynote (CEO Weaveworks). Here are some of the highlights:

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Some serious <a href="https://twitter.com/openfaas?ref_src=twsrc%5Etfw">@openfaas</a> exposure by <a href="https://twitter.com/monadic?ref_src=twsrc%5Etfw">@monadic</a> at <a href="https://twitter.com/hashtag/KubeCon?src=hash&amp;ref_src=twsrc%5Etfw">#KubeCon</a>! Congrats to fellow <a href="https://twitter.com/hashtag/DockerCaptain?src=hash&amp;ref_src=twsrc%5Etfw">#DockerCaptain</a> <a href="https://twitter.com/alexellisuk?ref_src=twsrc%5Etfw">@alexellisuk</a> 👍 <a href="https://t.co/fD0I2Pbavv">pic.twitter.com/fD0I2Pbavv</a></p>&mdash; Phil Estes (@estesp) <a href="https://twitter.com/estesp/status/938560519002296320?ref_src=twsrc%5Etfw">December 7, 2017</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> 

<blockquote class="twitter-tweet" data-lang="en"><p lang="und" dir="ltr"> <a href="https://t.co/LBv256g6wW">pic.twitter.com/LBv256g6wW</a></p>&mdash; Weaveworks (@weaveworks) <a href="https://twitter.com/weaveworks/status/938560409254195206?ref_src=twsrc%5Etfw">December 7, 2017</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> 

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Proud to see <a href="https://twitter.com/openfaas?ref_src=twsrc%5Etfw">@openfaas</a> in the keynote at KubeCon today highlighting Colorisebot a great collaboration with <a href="https://twitter.com/developius?ref_src=twsrc%5Etfw">@developius</a> <a href="https://t.co/0klkt57Qqe">https://t.co/0klkt57Qqe</a> <a href="https://t.co/Qk9Wzcj3Nr">pic.twitter.com/Qk9Wzcj3Nr</a></p>&mdash; OpenFaaS (@openfaas) <a href="https://twitter.com/openfaas/status/938561130557034496?ref_src=twsrc%5Etfw">December 7, 2017</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> 

You can also get the live-tweet stream from my talk [FaaS and Furious - 0 to Serverless in 60 Seconds, Anywhere](https://kccncna17.sched.com/event/CU6s/faas-and-furious-0-to-serverless-in-60-seconds-anywhere-alex-ellis-adp?iframe=no) from the following [Twitter-thread thanks to Weaveworks](https://twitter.com/weaveworks/status/938859046840528896).

### Dive into the story

* Read [my notes from Dockercon on developing Colorisebot with OpenFaaS](https://blog.alexellis.io/dockercon-2017-copenhagen/)

* Read Weave's latest blog post: [Running OpenFaaS on GKE - a step by step guide](https://www.weave.works/blog/openfaas-gke).

* Read Finnian's [blog post](https://finnian.io/blog/colourising-video-with-openfaas-serverless-functions/) from Dockercon on Machine Learning

### Support OpenFaaS

Launched over 12 months ago, OpenFaaS is an open-source project that Makes Serverless Functions Simple for Docker and Kubernetes. We've gained over 8k GitHub stars, Best Cloud Software Award from InfoWorld, 65 contributors and over 1400 commits along with a thriving community.

You can [become a backer for OpenFaaS on Patreon](https://patreon.com/alexellis/) or **Star** the [project on GitHub](https://github.com/openfaas/faas). We're on Twitter as [@openfaas](https://twitter.com/openfaas/).