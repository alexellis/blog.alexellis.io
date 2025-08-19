---
title: "Announcing the OpenFaaS Function Store"
slug: "announcing-function-store"
date: "2017-12-01T10:13:00Z"
author: "Alex Ellis"
meta_title: "Announcing the OpenFaaS Function Store"
meta_description: "Find out how and why OpenFaaS is the first Serverless project to launch a Function Store with the help of our community Making Serverless Functions Simple."
feature_image: "/content/images/2017/12/DMWH-LkWAAAupSu.jpg"
tags:
  - "openfaas"
  - "function store"
---

I'm proud to announce that the OpenFaaS community has pulled together to build and launch the first Function Store for Serverless Functions.

![Logo](https://cdn-images-1.medium.com/max/1600/1*C9845SlyaaT1_xrAGOBURg.png)

The mission for OpenFaaS is *Serverless Functions Made Simple* and that means finding new ways of making Serverless even easier to approach. We already have key advantages such as:

* Deployed in 60 seconds
* Native Docker Swarm and Kubernetes support
* Cloud Native integrations with existing trusted tooling such as Prometheus and AlertManager
* Helm chart for Kubernetes
* Community support for DC/OS, Rancher Cattle, Nomad and Hyper.sh
* A UI portal and rich CLI

The community asked for a function store from early on and it slowly crept up the ROADMAP.

> I think it's no longer an "if" an App Store is right for an eco-system, but a when. The when is now and I want to give you a quick preview.

## Try it out

Deploy OpenFaaS using Docker Swarm on your laptop or Kubernetes with minikube [following one of our guides](https://github.com/openfaas/faas/tree/master/guide).

![](/content/images/2017/12/filter.png)

> We also incorporated UX feedback from the community by making the manual deployment page easier to use and pointing folks to the more powerful experience of the CLI.

Now open the UI portal and click "Deploy Function" - you'll now see a dialog with all the functions listed and you can even search and filter them by name.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Introducing the <a href="https://twitter.com/openfaas?ref_src=twsrc%5Etfw">@OpenFaaS</a> function store - an excellent community collaboration effort <a href="https://twitter.com/hashtag/community?src=hash&amp;ref_src=twsrc%5Etfw">#community</a> <a href="https://twitter.com/hashtag/teamserverless?src=hash&amp;ref_src=twsrc%5Etfw">#teamserverless</a> - try it out today <a href="https://t.co/66ELJg5WZ2">https://t.co/66ELJg5WZ2</a> <a href="https://twitter.com/kenfdev?ref_src=twsrc%5Etfw">@kenfdev</a> <a href="https://twitter.com/stefanprodan?ref_src=twsrc%5Etfw">@stefanprodan</a> <a href="https://t.co/XeCjGxLYUs">pic.twitter.com/XeCjGxLYUs</a></p>&mdash; Alex Ellis (@alexellisuk) <a href="https://twitter.com/alexellisuk/status/936160369516654592?ref_src=twsrc%5Etfw">November 30, 2017</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> 


We've already had function submissions for functions from [Nic Jackson](https://github.com/nicholasjackson) (Hashicorp) and [Stefan Prodan](https://github.com/stefanprodan) (WeaveWorks) along with several other community members.

You can find out how the Function Store works or submit your own function by raising a Pull Request.

* View on GitHub: [openfaas/store](https://github.com/openfaas/store)

One of my [favourite functions (certinfo)](https://github.com/stefanprodan/openfaas-certinfo) reports back on when your LetsEncrypt SSL certificate is going to expire. How handy is that?

### OpenFaaS on the road

You can find out about OpenFaaS at KubeCon on the Thursday 7th December in Austin Texas at my talk

[FaaS and Furious - Zero to Serverless in 60 seconds, Anywhere](https://kccncna17.sched.com/event/CU6s/faas-and-furious-0-to-serverless-in-60-seconds-anywhere-alex-ellis-adp)

### Get involved

You can join the Slack community by emailing an introduction to alex@openfaas.com.

Become a backer of OpenFaaS on [Patreon](https://patreon.com/alexellis/)

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">It&#39;s great to see 14 new backers for <a href="https://twitter.com/openfaas?ref_src=twsrc%5Etfw">@OpenFaaS</a> already. We&#39;re working on some very cool stuff for next week at KubeCon. <a href="https://twitter.com/hashtag/community?src=hash&amp;ref_src=twsrc%5Etfw">#community</a> <a href="https://t.co/mtABTRznUM">https://t.co/mtABTRznUM</a></p>&mdash; Alex Ellis (@alexellisuk) <a href="https://twitter.com/alexellisuk/status/935606915215822849?ref_src=twsrc%5Etfw">November 28, 2017</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> 

Or if you're not ready to back the project then please help us reach our goal of 10k GitHub stars by the end of 2017:

* **Star OpenFaaS on GitHub:** [openfaas/faas](https://github.com/openfaas/faas)

Thanks for your support!