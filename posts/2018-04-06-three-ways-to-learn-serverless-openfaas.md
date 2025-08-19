---
title: "Three ways to learn Serverless with OpenFaaS this season"
slug: "three-ways-to-learn-serverless-openfaas"
date: "2018-04-06T16:01:05Z"
author: "Alex Ellis"
meta_title: "Three ways to learn Serverless & OpenFaaS this season"
meta_description: "From Udemy courses, to hands-on labs, to a new documentation site. There are so many ways to learn about Serverless with Kubernetes. Here are my 3 top picks"
feature_image: "/content/images/2018/04/flora-flowers-garden-102896-c.jpg"
tags:
  - "community"
  - "learn-openfaas"
  - "tutorials"
  - "workshop"
  - "kubernetes"
  - "openfaas"
  - "severless"
---

It's the beginning of Spring and you like many others, may be wondering what tech trend to follow next. I want to give you three practical ways to learn about Serverless with OpenFaaS so that you can think less about servers and focus on shipping your applications.

Serverless is a modern architectural pattern for designing systems which lets teams focus on shipping small reusable chunks of code which can be packaged, monitoring and scaled all in the same way. They can even be combined together to create pipelines and workflows that create new value.

![](https://blog.alexellis.io/content/images/2018/03/functions.png)
*Traits of Serverless Functions*

When you can manage all your functions the same way then that has some advantages over traditional microservices. Microservices often differ widely and need their own custom Dockerfiles, health-checks and finely tuned web-service frameworks. The OpenFaaS framework makes use of Docker and Kubernetes to abstract as much of this away from you as you want. The framework will provide sane defaults and because the code is Open Source you have the opportunity to tweak things when you need more control.

So here are three ways for you to start learning about Serverless and how to implement it in a way that means you can use your existing open-source or enterprise Docker workflows along with the benefits provided by OpenFaaS.

## 1. Learn Serverless & OpenFaaS on Udemy

[Nigel Poulton](https://twitter.com/nigelpoulton) is a Docker Captain, author of [books on Docker and Kubernetes](http://blog.nigelpoulton.com/docker-deep-dive-back-on-sale/) and many related courses on [PluralSight](https://www.pluralsight.com). He took a deep dive into Serverless with OpenFaaS and produced a light-weight video-course that you can take on your lunch-break and come away with all the high-level context you need.

This course is free for 7-days before going back to the regular price advertised by Udemy. It's short so check it out today.

[Introduction to Serverless by Nigel Poulton](hhttps://www.udemy.com/introduction-to-serverless/?couponCode=FAAS-FRIDAY2)

> Use the coupon: FAAS-FRIDAY2 - the first code already sold out with 1k people within several hours.


## 2. Take the OpenFaaS workshop

I developed the [OpenFaaS workshop](https://github.com/openfaas/workshop) along with help from the community to equip developers all over the world with a working knowledge of how to build practical Serverless Functions with OpenFaaS. Within a few hours you'll have built your own auto-responder bot for GitHub using Python.

<img src="https://github.com/openfaas/media/raw/master/OpenFaaS_Magnet_3_1_png.png" width="500px"></img>

If you're familiar with what the project is about and want to get started this is the best place for you to begin:

https://github.com/openfaas/workshop

The workshop is made up of a series of hands-on labs which you can work through at your own pace. The community will also be leading a series of events coming up this year around the world where you can take part in a local workshop. The first of those is at [Cisco's DevNet Create](https://devnetcreate.io/2018/pages/agenda/agenda.html) event next week in Mountain View followed by OpenFaaS at [Agile Peterborough 50 minutes from London/Cambridge](https://www.meetup.com/Agile-Peterborough/events/249112848/) in the UK in May. Spaces are limited so sign up if you want to attend.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">This week <a href="https://twitter.com/hashtag/FaaSFriday?src=hash&amp;ref_src=twsrc%5Etfw">#FaaSFriday</a> was little early for me. Two days back, gave a talk on Serverless and <a href="https://twitter.com/openfaas?ref_src=twsrc%5Etfw">@openfaas</a> in my company to my team. Now fixing an issue with faas cli. <a href="https://t.co/2sqT9SlAEt">pic.twitter.com/2sqT9SlAEt</a></p>&mdash; Vivek Kumar Singh (@viveksyngh) <a href="https://twitter.com/viveksyngh/status/982273116293353472?ref_src=twsrc%5Etfw">April 6, 2018</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> 

*OpenFaaS workshop in Bangalore*

## 3. Use OpenFaaS

The third way to learn is to use OpenFaaS. Just deploy it on your laptop or on your favourite cloud provider and start building functions in your preferred programming language. The project can support any language - even an [existing binary or Docker container](https://blog.alexellis.io/cli-functions-with-openfaas/) can be used.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Can&#39;t get enough of <a href="https://twitter.com/hashtag/FaasFriday?src=hash&amp;ref_src=twsrc%5Etfw">#FaasFriday</a>! Eval-as-a-service --&gt; <a href="https://t.co/yMHgKZMgFO">https://t.co/yMHgKZMgFO</a> <a href="https://twitter.com/hashtag/OpenFaas?src=hash&amp;ref_src=twsrc%5Etfw">#OpenFaas</a> <a href="https://twitter.com/hashtag/Docker?src=hash&amp;ref_src=twsrc%5Etfw">#Docker</a> <a href="https://t.co/viVl28owZI">pic.twitter.com/viVl28owZI</a></p>&mdash; Michael Herman (@MikeHerman) <a href="https://twitter.com/MikeHerman/status/974803469210038272?ref_src=twsrc%5Etfw">March 17, 2018</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> 

*Pictured: an OpenFaaS "addiction"*

I'll be sharing four case-studies from the tech industry about how people are using OpenFaaS to build their applications. The next talk after DevNet Create, is at [Mountain View's Docker Meetup](https://www.meetup.com/Docker-Mountain-View/) - so if you want to know more follow [OpenFaaS on Twitter](https://twitter.com/openfaas).

While you are kicking the tyres you may have some questions that are not answered in the workshop materials, so I'd encourage you to [join our Slack community](https://docs.openfaas.com/community/) and to browse our new documentation site too.

https://docs.openfaas.com/

## Wrapping up

There are over 11k stars on the OpenFaaS organisation, 2k commits of code to the project and dozens of events happening [all over the world](https://blog.alexellis.io/openfaas-community-roadshow/) - all signs of a healthy community. Make this season the one where you learn how to take advantage of building Serverless Functions with Docker and Kubernetes without getting locked-in so a single provider.