---
title: "Serverless at the Docker Cambridge meet-up"
slug: "docker-cambridge-openfaas"
date: "2017-11-21T10:47:29Z"
author: "Alex Ellis"
meta_title: "Serverless at the Docker Cambridge meet-up"
meta_description: "Notes from my first Docker Cambridge meet-up where I spoke along with Nic Jackson on Serverless with OpenFaaS using Docker, Kubernetes and Nomad."
tags:
  - "speaking"
  - "docker cambridge"
  - "meetup"
  - "openfaas"
---

Last night I attended my first Docker Cambridge meet-up as part of an evening on Serverless Functions Made Simple with OpenFaaS.

> [OpenFaaS](https://www.openfaas.com) is the only Serverless Functions project which has native support for both Docker Swarm and Kubernetes.

On the agenda was my introductory talk on Serverless Functions Made Simple and a talk from [Nic Jackson](https://twitter.com/sheriffjackson), Developer Advocate at Hashicorp on Nomad + OpenFaaS. Nic told of how we met at [Cloud Native London](https://www.meetup.com/Cloud-Native-London/) a few months ago which inspired him to bring OpenFaaS to Hashicorp's enterprise customers

> Checkout Nic's book on [Microservices with Go](https://www.packtpub.com/application-development/building-microservices-go).

The meet-up was held at a trendy cocktail bar called Baroosh just a few minutes' walk away from Jesus Lane in the centre of the city. We saw around 45 people turn up - eager to find out how they could start using Serverless Functions with their existing Docker deployments.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">OpenFaaS demo by <a href="https://twitter.com/alexellisuk?ref_src=twsrc%5Etfw">@alexellisuk</a> at <a href="https://twitter.com/Docker?ref_src=twsrc%5Etfw">@Docker</a> Cambridge Meetup. Check out <a href="https://twitter.com/ColorizeBot?ref_src=twsrc%5Etfw">@ColorizeBot</a> for an awesome example! <a href="https://t.co/iipVCkhiyA">pic.twitter.com/iipVCkhiyA</a></p>&mdash; Nic Jackson 🤠 (@sheriffjackson) <a href="https://twitter.com/sheriffjackson/status/932698929388556289?ref_src=twsrc%5Etfw">November 20, 2017</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> 

If you live near Cambridge or are in the area then sign-up for the meet-up (run by Will Hall) - https://www.meetup.com/docker-cambridge/events/243206434/

You can take the train to Cambridge but I drove and found good, cheap parking at [Park Street](https://www.cambridge.gov.uk/park-street-car-park).

> Docker Inc has an office in Cambridge, so a bonus of attending this meet-up is bumping into some of the engineers behind Docker for Mac and [LinuxKit](https://github.com/linuxkit/linuxkit/).

## Grab my slides

<iframe src="//www.slideshare.net/slideshow/embed_code/key/MSHDQF5TqjUUMf" width="595" height="485" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:1px solid #CCC; border-width:1px; margin-bottom:5px; max-width: 100%;" allowfullscreen> </iframe> <div style="margin-bottom:5px"> <strong> <a href="//www.slideshare.net/secret/MSHDQF5TqjUUMf" title="Docker Cambridge: Serverless Functions Made Simple with OpenFaaS" target="_blank">Docker Cambridge: Serverless Functions Made Simple with OpenFaaS</a> </strong> from <strong><a href="https://www.slideshare.net/AlexEllis11" target="_blank">Alex Ellis</a></strong> </div>

Grab Nic's slides on [OpenFaaS Serverless Functions on Nomad](https://www.slideshare.net/secret/ChRWDAFexyuWyJ).

## Get connected

If you'd like to join the OpenFaaS slack community then send a quick intro over to alex@openfaas.com. Alternatively you can *Star* the [GitHub repo for OpenFaaS here](https://github.com/openfaas/faas/)

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">I will be speaking at the <a href="https://twitter.com/Docker?ref_src=twsrc%5Etfw">@Docker</a> Cambridge Meetup on Monday with <a href="https://twitter.com/alexellisuk?ref_src=twsrc%5Etfw">@alexellisuk</a> about <a href="https://twitter.com/openfaas?ref_src=twsrc%5Etfw">@openfaas</a> and the new <a href="https://twitter.com/HashiCorp?ref_src=twsrc%5Etfw">@HashiCorp</a> Nomad provider. We will have stickers!<a href="https://t.co/GmuzLR8eAb">https://t.co/GmuzLR8eAb</a> <a href="https://t.co/bzfYlw2DXl">pic.twitter.com/bzfYlw2DXl</a></p>&mdash; Nic Jackson 🤠 (@sheriffjackson) <a href="https://twitter.com/sheriffjackson/status/932160853234905088?ref_src=twsrc%5Etfw">November 19, 2017</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> 

You can test out OpenFaaS with Kubernetes on your laptop with `minikube` or with Docker Swarm in 60 seconds.

Try OpenFaaS with Docker Swarm:

* [Docker Swarm TestDrive](https://github.com/openfaas/faas#get-started-with-openfaas)

Follow the official Kubernetes tutorial with `minikube`:

* [Getting started with OpenFaaS on minikube
](https://medium.com/@alexellisuk/getting-started-with-openfaas-on-minikube-634502c7acdf)

You can find out about OpenFaaS on Nomad here:

* [hashicorp/faas-nomad](https://github.com/hashicorp/faas-nomad)