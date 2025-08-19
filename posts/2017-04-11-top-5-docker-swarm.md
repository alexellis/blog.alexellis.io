---
title: "Top 5 Docker Swarm tutorials"
slug: "top-5-docker-swarm"
date: "2017-04-11T11:38:21Z"
author: "Alex Ellis"
meta_title: "Top 5 of Docker Swarm"
meta_description: "Join me as I review my top 5 Docker Swarm tutorials since the 1.12 release in Dockercon Seattle last year. Get to scale in 5 minutes even on a Raspberry Pi"
tags:
  - "docker"
  - "swarm"
  - "overview"
  - "top5"
  - "tutorials"
---

At [Dockercon '16](http://blog.alexellis.io/dockercon-2016-speaker-notes/) in Seattle last June Docker released a complete re-think on their orchestration offering called Swarm. Swarm has been gaining momentum and key features ever since.

> Get ready for Dockercon 2017 with my top 5 Docker Swarm tutorials

![](https://pbs.twimg.com/media/C7bkgnhX0AApdHY.jpg)
*Pictured - [Serverless FaaS on Raspberry Pi with Swarm](https://twitter.com/alexellisuk/status/844113564734504960)*

You can read more about Dockercon in Seattle in my [Dockercon 2016 speaker notes](http://blog.alexellis.io/dockercon-2016-speaker-notes/).

### 1. Get to scale in 5 minutes

My first tutorial on the new Swarm offering (also called Swarm Mode) was written and tested with a pre-release candidate of Docker. I wrote this the night before the official announcement in Seattle.

> It's still as relevant today as it was last year. Get started in 5 minutes.

[Learn Docker Swarm Mode - scale in 5 minutes!](http://blog.alexellis.io/docker-swarm-mode-part1/)

### 2. Work with a real micro-service

My second tutorial on Swarm mode focused on a small microservice written in Node.js. If you're wondering how to get started with Node and Swarm then you will find everything you need here.

[Scale a real microservice with Docker 1.12 Swarm Mode](http://blog.alexellis.io/microservice-swarm-mode/)

### 3. Swarm Deep dive on Raspberry Pi

Installing Docker on a Raspberry Pi has never been easier. The Raspberry Pi foundation covered Docker on their official blog earlier last year and this generated a lot of interest in Swarm on the Pi.
 
> The Raspberry Pi is effectively a very cheap, networkable PC and whatever applies to a PC or cloud server can normally be run on a Pi too.

[Docker comes to Raspberry Pi](https://www.raspberrypi.org/blog/docker-comes-to-raspberry-pi/)

The Pi is an accessible platform for teaching and demonstrating distributed computing. In this blog post I go into deeper detail on how to set up your RPi swarm and how to test different aspects of inter-container communication.

[Live Deep Dive - Docker Swarm Mode on the Pi
](http://blog.alexellis.io/live-deep-dive-pi-swarm/)

The video uses a set of tests that cover everything from scaling to inter-container communication via DNS.

[Swarm Mode test scenarios](https://github.com/alexellis/swarmmode-tests/tree/master/arm) 

### 4. Test-drive Docker Healthchecks

Healthchecks are an essential feature for deploying your production application. They provide a way for your container to check itself periodically. Swarm's self-healing mechanism can then intervene and help resolve issues automatically.

[Test-drive Docker Healthcheck in 10 minutes](http://blog.alexellis.io/test-drive-healthcheck/)

### 5. Secret management

Swarm now provides a built-in and secure method to manage confidential secrets, tokens and keys. This blog post goes into detail on how to apply secret management to an integration with a real-world service.

[Docker Secrets in action: Github integration](http://blog.alexellis.io/swarm-secrets-in-action/)

## Subscribe for more

Don't miss out on announcements, reviews, tutorials and blog posts. Fill out your email below or subscribe with the Feedly blog reader.

### You might also like:

**Multi-stage builds**

Multi-stage builds are a game changer for CI/CD pipelines that rely on containers. Find out how to ship leaner images spending less time doing it.

[Builder pattern vs. Multi-stage builds in Docker
](http://blog.alexellis.io/mutli-stage-docker-builds/)

**Functions as a Service (FaaS)**
Functions as a Service (FaaS) is an easy-to-use framework for doing serverless with Docker. It is ideal for integrating with Webhooks and events from third-party or internal services with minimal effort.

It recently reached 1k Github stars. Take it for a test-drive online in less than 60 seconds:

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Wow my serverless FaaS project is almost at 1k Github stars. Thanks to everyone who&#39;s helped along the way! <a href="https://t.co/2xkJKvjosi">https://t.co/2xkJKvjosi</a> <a href="https://t.co/t9OL8zJHfi">pic.twitter.com/t9OL8zJHfi</a></p>&mdash; Alex Ellis (@alexellisuk) <a href="https://twitter.com/alexellisuk/status/850730367434670080">April 8, 2017</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>