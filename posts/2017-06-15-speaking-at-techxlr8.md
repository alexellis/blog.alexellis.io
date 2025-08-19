---
title: "Speaking at London's Tech Week"
slug: "speaking-at-techxlr8"
date: "2017-06-15T12:30:00Z"
author: "Alex Ellis"
meta_title: "Speaking at London's Tech Week & TechXLR8"
meta_description: "I joined with industry leaders to speak on the future of containers - get my take for the next few years and catch-up with my talk on Serverless functions"
feature_image: "/content/images/2017/06/stickers-1.jpeg"
tags:
  - "speaking"
  - "docker"
  - "serverless"
  - "faas"
  - "london"
  - "public speaking"
---

Yesterday I spoke and joined a panel at the ExCeL center in London's East End. This was part of London's Tech Week and the TechXLR8 event. I attended as a Docker Captain (community evangelist and advocate) carrying lots of stickers and as an engineer from [ADP](https://www.adp.com).

The track I spoke in was called [*DevOps and Cloud*](https://tmt.knect365.com/cloud-devops-world/) which covers a very wide range of the industry - but I noticed a focus on Kubernetes and Serverless in the themes.

### Panel talk: future of container landscape

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">What will the container landscape look like in 5yrs? <a href="https://twitter.com/hashtag/clouddevops?src=hash">#clouddevops</a> <a href="https://twitter.com/davidodwyer">@davidodwyer</a> <a href="https://twitter.com/_tudor_james_">@_tudor_james_</a> <a href="https://twitter.com/alexellisuk">@alexellisuk</a> <a href="https://twitter.com/ipedrazas">@ipedrazas</a> <a href="https://twitter.com/micheleorsi">@micheleorsi</a> <a href="https://twitter.com/hashtag/TechXLR8?src=hash">#TechXLR8</a> <a href="https://t.co/XNaAXrmxso">pic.twitter.com/XNaAXrmxso</a></p>&mdash; Emily Impey (@Emily_KNect365) <a href="https://twitter.com/Emily_KNect365/status/875002696805343233">June 14, 2017</a></blockquote> <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

Our panel talk was the second of the day and lead by [David O'Dwyer](https://twitter.com/davidodwyer). This was a great chance to mix with folks from Packet, Sky Scanner and LastMinute.com - all experts in their fields. I enjoyed meeting like-minded people and chatting about tech.

The questions were around the future landscape of containers and which businesses may adopt them next.

I'd say for the next 12 months:

* Look out for Windows containers becoming more mature and making their way into orchestrators like Docker Swarm. With Docker CE 17.06 it will be even easier to create a mixed cluster of Windows and Linux hosts.

* Standards are emerging which make life easier for application developers. We've seen a unified image format for container images in the [OCI Image Format Spec](https://github.com/opencontainers/image-spec), a [container runtime spec](https://github.com/opencontainers/runtime-spec) and a [storage](https://github.com/moby/moby/issues/31923) and [networking spec (CNI)](https://github.com/containernetworking/cni) are emerging.

For now there are at least 4-5 big players in orchestrator that developers should think about targeting including [Kubernetes](https://kubernetes.io), Swarm, [Nomad from Hashicorp](https://github.com/hashicorp/nomad), [Rancher's Cattle](https://github.com/rancher/cattle) and [Mesos](http://mesos.apache.org).

> Could we see a specification emerge for schedulers/orchestrators next?

* [Serverless](http://blog.alexellis.io/tag/serverless/) is on the up and over the two days of the event we saw three talks on Serverless tech and FaaS. [Serverless](http://blog.alexellis.io/tag/serverless/) can be summed up as the the idea that you can treat the Internet as your computer.

It was also asked whether there will be a replacement for containers.

* As application developers in the industry - we felt the main benefit of containers was the speed that we could iterate at - from testing to deploying rolling updates with automated health-checks.
* Patterns like the [12-factor app](https://12factor.net) have helped us build applications which are stateless and fungible (easily replaced with a similar one) - these learnings can be applied to other paradigms
* Schedulers have taught us not to run ad-hoc containers at the end of a CI pipeline, but to describe the desired state we need. This is more robust and makes it easier for your dev and ops team to understand the topology of your applications.

### XLR8 your cloud with FaaS and Docker

My conference talk was an extended version of my closing keynote for Dockercon's Cool Hacks session in Austin.

You can get latest my slides below:

<iframe src="//www.slideshare.net/slideshow/embed_code/key/fssUJhAUFwrwrq?startSlide=2" width="595" height="485" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:1px solid #CCC; border-width:1px; margin-bottom:5px; max-width: 100%;" allowfullscreen> </iframe> <div style="margin-bottom:5px"> <strong> <a href="//www.slideshare.net/AlexEllis11/techxlr8-xlr8-your-cloud-with-docker-and-serverless-faas" title="TechXLR8 - XLR8 your cloud with Docker and Serverless FaaS" target="_blank">TechXLR8 - XLR8 your cloud with Docker and Serverless FaaS</a> </strong> from <strong><a target="_blank" href="//www.slideshare.net/AlexEllis11">Alex Ellis</a></strong> </div></iframe>

<p></p>

Since Austin development has continued:

* [FaaS-CLI and YAML](https://github.com/alexellis/faas-cli)

Using a YAML file you can define a set of FaaS functions then build and deploy them with a CLI.

Here's a great [blog post from the community](https://dev.to/developius/functions-as-a-service---deploying-functions-to-docker-swarm-via-a-cli) showing how to use the new CLI to deploy FaaS functions.

* [API documentation](https://github.com/alexellis/faas/blob/master/api-docs/swagger.yml)

Documenting the FaaS API was an important step and is now available in Swagger format.

* [New features](https://github.com/alexellis/faas/releases)

You can checkout the new features over on the Releases page - including private Docker registry support and CGI-style headers in environmental variables for your functions.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Alexa helping out <a href="https://twitter.com/alexellisuk">@alexellisuk</a> with his presentation for <a href="https://twitter.com/hashtag/clouddevops?src=hash">#clouddevops</a> <a href="https://twitter.com/CloudEntTech">@CloudEntTech</a> <a href="https://twitter.com/TechXLR8">@TechXLR8</a> <a href="https://twitter.com/hashtag/docker?src=hash">#docker</a> <a href="https://twitter.com/hashtag/cloud?src=hash">#cloud</a> <a href="https://twitter.com/hashtag/Serverless?src=hash">#Serverless</a> <a href="https://twitter.com/hashtag/cloud?src=hash">#cloud</a> <a href="https://t.co/ulCzo5Tz6m">pic.twitter.com/ulCzo5Tz6m</a></p>&mdash; Emily Impey (@Emily_KNect365) <a href="https://twitter.com/Emily_KNect365/status/874985032120664064">June 14, 2017</a></blockquote> <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

The talk wasn't recorded - but you can catch my Dockercon version here on YouTube:

<iframe width="560" height="315" src="https://www.youtube.com/embed/-h2VTE9WnZs?start=954" frameborder="0" allowfullscreen></iframe>

### Get started with serverless

Getting started with Severless functions isn't hard - you can deploy FaaS in 60 seconds on your laptop or in the cloud and run through the [Test Drive](https://github.com/alexellis/faas/blob/master/TestDrive.md) using the built-in UI.

FaaS functions let you focus on writing small, discrete chunks of code that work great with webhooks and events from the web. It's perfect for building quick integrations between services like Github, Twitter and Slack. Explore the examples below:

[Tweet stash](https://github.com/alexellis/journey-expert/) - Alexa skill to query a Twitter cache ingested into Elastic Search.

[Dockercon demos](https://github.com/alexellis/faas-dockercon/) - all the demo code from the stage in Austin

If you want to checkout Functions as a Service (FaaS) later on you can watch or star the [Github repo here](http://github.com/alexellis/faas).