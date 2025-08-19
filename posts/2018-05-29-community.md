---
title: "OpenFaaS round-up: CloudEvents, AWS Fargate and OpenFaaS Operator"
slug: "community"
date: "2018-05-29T22:07:29Z"
author: "Alex Ellis"
meta_title: "OpenFaaS round-up: CloudEvents, AWS Fargate and OpenFaaS Operator"
meta_description: "Read the round-up all the newest developments from the OpenFaaS Community. Find out how to join the Slack Community and get connected into the project"
tags:
  - "openfaas"
  - "kubernetes"
  - "community"
---

In this post I'll round-up the highlights of the OpenFaaS community meeting from 25th May.

The all-hands community meetings are a great way to remain connected to the project and community where we have a chance to share our finest work and importantly get face-to-face time with each other. One of the things I like the most is hearing about the various backgrounds people have with our community covering both the users, developers and operators of OpenFaaS.

## Highlights

I kicked-off the meeting with a project update and an announcement of a new core contributor [Lucas Roesler](https://twitter.com/theaxer). Lucas has shown a commitment to the project and willingness to take responsibility and ownership for features like the secrets management for functions.

> The Core contributors group helps to build and maintain OpenFaaS, taking responsibility for and pride in the project.

We then had three demos from the community.

### 1. OpenFaaS on AWS Fargate/ECS

I've known Ed Wilde for some time and it was great to see him getting into the Cloud Native world with his start-up. Ed works in London and has been putting together a Proof-of-Concept provider for OpenFaaS that allows functions to be managed on AWS Fargate/ECS. He's going to release his code when it's feature complete, but here's a preview:

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Community meeting - excited to see the progress <a href="https://twitter.com/ewilde?ref_src=twsrc%5Etfw">@ewilde</a> is making with faas-fargate - <a href="https://twitter.com/openfaas?ref_src=twsrc%5Etfw">@OpenFaaS</a> on AWS Fargate. Why is Ed interested in building this? Because he&#39;s in a small team and they want to manage all their services in the same way. <a href="https://twitter.com/hashtag/TeamServerless?src=hash&amp;ref_src=twsrc%5Etfw">#TeamServerless</a> <a href="https://twitter.com/hashtag/FaaSFriday?src=hash&amp;ref_src=twsrc%5Etfw">#FaaSFriday</a> <a href="https://t.co/zUnjx90xBe">pic.twitter.com/zUnjx90xBe</a></p>&mdash; Alex Ellis (@alexellisuk) <a href="https://twitter.com/alexellisuk/status/1000054489192202240?ref_src=twsrc%5Etfw">May 25, 2018</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> 


### 2. CloudEvents integration 

CloudEvents is a designed-by-committee spec for how clouds should publish events about their managed services such as S3 CRUD events or changes to DB rows such as when a new document is added to DynamoDB.

John McCabe gave us background on the CloudEvents 0.1 spec and showed us a demo of how he was able to integrate with events from Azure EventGrid in the CloudEvents 0.1 format without changing any code in OpenFaaS.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">We&#39;re learning about how <a href="https://twitter.com/mccabejohn?ref_src=twsrc%5Etfw">@mccabejohn</a> was able to consume CloudEvents 0.1 within <a href="https://twitter.com/openfaas?ref_src=twsrc%5Etfw">@openfaas</a> without changing any code on the <a href="https://twitter.com/hashtag/FaaSFriday?src=hash&amp;ref_src=twsrc%5Etfw">#FaaSFriday</a> community call. Good attendance for a bank-holiday weekend! <a href="https://twitter.com/hashtag/teamserverless?src=hash&amp;ref_src=twsrc%5Etfw">#teamserverless</a> <a href="https://t.co/suL29AM71Y">pic.twitter.com/suL29AM71Y</a></p>&mdash; Alex Ellis (@alexellisuk) <a href="https://twitter.com/alexellisuk/status/1000053773090349056?ref_src=twsrc%5Etfw">May 25, 2018</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> 

### 3. The OpenFaaS Operator with Weave Flux

Stefan Prodan showed us the culmination of a week's work on a blog post that combines [Flux](https://github.com/weaveworks/flux) and Weave Cloud from Weaveworks with [Heptio Contour](https://github.com/heptio/contour), [Bitnami SealedSecrets](https://github.com/bitnami-labs/sealed-secrets) and the [OpenFaaS Kubernetes Operator](https://github.com/openfaas-incubator/openfaas-operator) to deliver hardened CD with GitOps on GKE.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">In our community call for <a href="https://twitter.com/openfaas?ref_src=twsrc%5Etfw">@OpenFaaS</a> - we&#39;re getting a demo of OpenFaaS Operator, <a href="https://twitter.com/HeptioContour?ref_src=twsrc%5Etfw">@HeptioContour</a>, <a href="https://twitter.com/bitnami?ref_src=twsrc%5Etfw">@bitnami</a> SealedSecrets, <a href="https://twitter.com/weaveworks?ref_src=twsrc%5Etfw">@weaveworks</a> Flux and Cloud - for a hardened GitOps on GKE with NetworkPolicy. Thanks <a href="https://twitter.com/stefanprodan?ref_src=twsrc%5Etfw">@stefanprodan</a> <a href="https://twitter.com/hashtag/FaaSFriday?src=hash&amp;ref_src=twsrc%5Etfw">#FaaSFriday</a> <a href="https://t.co/CXDDZsPHj3">https://t.co/CXDDZsPHj3</a> <a href="https://t.co/thuSWncTtI">pic.twitter.com/thuSWncTtI</a></p>&mdash; Alex Ellis (@alexellisuk) <a href="https://twitter.com/alexellisuk/status/1000057422499676162?ref_src=twsrc%5Etfw">May 25, 2018</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> 

### Bonus community material

I want to give a shout-out for Robert Malmstein from Holberton School in San Francisco. We met in April earlier this year at Cisco's DevNet Create conference, since I've been meeting with and mentoring Robert with his studies. We got together for coffee to talk about his latest project and that got me thinking about how functions could be applied.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Great to meet up with my new friends from <a href="https://twitter.com/holbertonschool?ref_src=twsrc%5Etfw">@holbertonschool</a> <a href="https://twitter.com/fallenicicle?ref_src=twsrc%5Etfw">@fallenicicle</a> and <a href="https://twitter.com/RobertMalmstein?ref_src=twsrc%5Etfw">@RobertMalmstein</a> - we met at <a href="https://twitter.com/DevNetCreate?ref_src=twsrc%5Etfw">@DevNetCreate</a> in April. Today had coffee today, started some mentoring and hacking for Robert&#39;s project - locate a trash can in SF - keep SF tidy. <a href="https://t.co/wQ2qMPQQdB">pic.twitter.com/wQ2qMPQQdB</a></p>&mdash; Alex Ellis (@alexellisuk) <a href="https://twitter.com/alexellisuk/status/1001302111043239936?ref_src=twsrc%5Etfw">May 29, 2018</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> 

Robert's idea is simple - making public asset data available on mobile devices such as the location of the nearest trash can or park bench for some R&R in the city between busy meetings. Robert's project can be taken further to crowd-source and vote up new locations to gamify the experience.

Check out this GitHub repository for the [sample code implemented with OpenFaaS functions](https://github.com/alexellis/sf-assets).

## Video recording

You can view the whole video recording here on YouTube:

<iframe width="560" height="315" src="https://www.youtube.com/embed/a391O3l6yp8" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

## Get involved

* Try the OpenFaaS Operator

OpenFaaS supports Kubernetes through the [faas-netes project](https://github.com/openfaas/faas-netes), but the OpenFaaS Operator offers a deeper extension into the Kubernetes API meaning you can manage your functions both through the RESTful API and with `kubectl`.

[Try it out on GitHub](https://github.com/openfaas-incubator/openfaas-operator)

* Experiment with CloudEvents

If you're an Azure user then there's already support for publishing events from EventGrid in the [CloudEvents](https://cloudevents.io) JSON format with inbound webhooks. Check out [John's GitHub account](https://github.com/johnmccabe).

* Join the Community

Whether you're new to this space, have questions or want to start contributing to Open Source you're welcome to join our community.

The easiest way to get connected into the project is to join us over on the [OpenFaaS Slack workspace](https://docs.openfaas.com/support) and on GitHub: https://github.com/openfaas/