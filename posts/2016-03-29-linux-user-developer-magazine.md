---
title: "Docker Article in Linux magazine"
slug: "linux-user-developer-magazine"
date: "2016-03-29T08:07:48Z"
author: "Alex Ellis"
tags:
  - "Raspberry PI"
  - "tutorial"
  - "swarm"
  - "networking"
  - "cluster"
  - "docker"
  - "Linux User and Developer"
---

I've just had an updated version of my *Docker Swarm on the Raspberry PI* tutorial published in Linux User and Developer magazine issue 163. This was great timing as it co-incided with the official #DockerSwarm week. In the UK the magazine is sold on the shelf in WHSmith's, but if you've missed it you can get the 4-page tutorial in the digital PDF edition below:

Linux User and Developer: [Issue 163](https://www.imagineshop.co.uk/magazines/linuxuser/linux-user-and-developer-issue-163.html)

> [@Docker re-tweets post!](https://twitter.com/docker/status/715629498365059073)

![](/content/images/2016/03/magazine_thumbnail.png)

*Here is a taster of the first page.*

#### How did it come about?

As I mentioned in a [previous article](http://blog.alexellis.io/piwars-v2-0/), I met two people from Linux User and Developer magazine in December at PiWars in Cambridge. Gavin and Rebecca looked over my blog and asked me to adapt my initial Swarm tutorial for the magazine's "RasPI" section.

When I submitted my initial draft I thought that I would need to re-phrase certain parts and maybe work through a bunch of alterations, but most of the effort was actually adapting the tutorial into small steps. I think that breaking the tutorial down into 70-word steps made the content easier to follow and prompted me to write some shell scripts to help get everything set up.

As part of the work I produced a distributed web application using Node.js and Redis fronted by Nginx as a load balancer. You can find out more about this in the tutorial or over on Github below. 

![](/content/images/2016/03/12751465_202678110091142_997768928_n.jpg)

*My stack of 7 Raspberry PI Model 2s running Docker Swarm*

If you write for a blog already, or have some free time to invest I would recommend getting in touch with a magazine and pitching a few ideas. They may be able to offer you some kind of freelance work. I thought it was great being able to say I had something published in a glossy magazine available on the high-street. 

#### Trying Swarm on Raspberry PI

You only need two PIs to get something working, but if you put three together then it starts to become even more interesting and useful.

Note on the PI Zero: *I would recommend sticking with the PI 2, but the Zero can also be made to work with some tweaking (add swapfile) and I've uploaded some scripts and images for that too.*

>* Go to [docker-arm](https://github.com/alexellis/docker-arm) on Github for the code and write-up

>* Or Linux User and Developer [Issue 163](https://www.imagineshop.co.uk/magazines/linuxuser/linux-user-and-developer-issue-163.html) for the digital edition of the tutorial


#### See also: Hands-On Docker

> Check out my new blog post on [Hands-On Docker](http://blog.alexellis.io/handsondocker/)

Get hands-on with Docker through a dozen self-paced and progressive labs.