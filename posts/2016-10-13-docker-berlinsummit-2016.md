---
title: "Docker's #BerlinSummit"
slug: "docker-berlinsummit-2016"
date: "2016-10-13T20:30:36Z"
author: "Alex Ellis"
meta_title: "Docker's #BerlinSummit"
meta_description: "#BerlinSummit - get an insider's view on the Docker Distributed Systems Summit in Berlin. With talks on InfraKit, SwarmKit, TUF and Prometheus."
tags:
  - "docker"
  - "distributed systems"
  - "summit"
  - "events"
---

Between the 6th and 9th of October Docker held its Distributed Systems Summit in central Berlin at the [Kosmos club](http://www.kosmos-berlin.de/en/home.html). Docker Captains, engineering staff and hackers gathered for two days of talks, deep dives and break-out sessions.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr"><a href="https://twitter.com/hashtag/berlin?src=hash">#berlin</a> baby! <a href="https://t.co/F3nqXul5IM">pic.twitter.com/F3nqXul5IM</a></p>&mdash; Alex Ellis (@alexellisuk) <a href="https://twitter.com/alexellisuk/status/784018153915416576">October 6, 2016</a></blockquote> <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

It was a great chance to get together and hang out with the Docker team and Captains from all other the world. Some of us had met each other before and others were meeting for the first time.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">What happens when you put a bunch of your <a href="https://twitter.com/docker">@docker</a> Captains in a room together for 5 hours?? <a href="https://twitter.com/hashtag/berlinsummit?src=hash">#berlinsummit</a> <a href="https://t.co/hj9GN6qM3x">pic.twitter.com/hj9GN6qM3x</a></p>&mdash; Alex Ellis (@alexellisuk) <a href="https://twitter.com/alexellisuk/status/785067549415370752">October 9, 2016</a></blockquote> <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

The Captains started early with a kind of meta-workshop from [Jérôme Petazzoni](https://twitter.com/jpetazzo). He ran through his content pausing for feedback and wanted us to get to the point where we could deliver it out in the community - at meetup groups, conferences and the like.

* [Orchestration workshop](https://github.com/jpetazzo/orchestration-workshop)

We had a great Q&A session with Solomon Hykes and it's no surprise that a question came up three times about what we should call the old and new Swarm products. Solomon then got hands-on with drawing diagrams and explaining his vision for the future of Docker. It was awesome to get this kind of interaction with a CTO.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Q&amp;A with <a href="https://twitter.com/solomonstre">@solomonstre</a> from <a href="https://twitter.com/docker">@docker</a> <a href="https://t.co/voTALQY71Z">pic.twitter.com/voTALQY71Z</a></p>&mdash; Alex Ellis (@alexellisuk) <a href="https://twitter.com/alexellisuk/status/784051041268559872">October 6, 2016</a></blockquote> <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

**Deep dives**

There were talks on hot topics old and new - all around distributed systems such as [InfraKit](https://github.com/docker/infrakit), [unikernels/MirageOS](https://mirage.io/blog/), [SwarmKit](https://github.com/docker/swarmkit) and advanced container monitoring with [Prometheus](https://prometheus.io/).

I wasn't part of the community when the unikernels team was acquired by Docker Inc. so it was great chance to meet the team and to hear about what they were building. I even got to learn some of the basics of [OCaml](https://en.wikipedia.org/wiki/OCaml) from [Thomas Leonard](https://twitter.com/talex5). He also taught me some much needed `vim` hacks.

<blockquote class="twitter-tweet" data-lang="en"><p lang="und" dir="ltr"><a href="https://twitter.com/hashtag/berlinsummit?src=hash">#berlinsummit</a> <a href="https://twitter.com/hashtag/latergram?src=hash">#latergram</a> <a href="https://twitter.com/hashtag/unikernels?src=hash">#unikernels</a> <a href="https://twitter.com/docker">@docker</a> <a href="https://t.co/RvRSBHDj6s">pic.twitter.com/RvRSBHDj6s</a></p>&mdash; Alex Ellis (@alexellisuk) <a href="https://twitter.com/alexellisuk/status/785066320727515136">October 9, 2016</a></blockquote> <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

This is my first attempt at a loop:

```
  1 
  2 let rec print_loop ~start ~stop =
  3     Printf.printf "x=%d\n" start;
  4     if start < stop then print_loop ~start:(start+1) ~stop:stop
  5 
  6 let () =
  7     print_loop ~start:0 ~stop:50
...
x=0
x=1
...
x=50
```

InfraKit was one of the newest topics with the repository being open-sourced by Solomon during the LinuxCon keynote earlier in the week.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Getting into the plumbing of <a href="https://twitter.com/hashtag/Infrakit?src=hash">#Infrakit</a> at the <a href="https://twitter.com/hashtag/dockersummit?src=hash">#dockersummit</a> <a href="https://t.co/MNTJxjiB5q">pic.twitter.com/MNTJxjiB5q</a></p>&mdash; Alex Ellis (@alexellisuk) <a href="https://twitter.com/alexellisuk/status/784672000421859328">October 8, 2016</a></blockquote> <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

InfraKit is part of Docker's necessary plumbing to give the same experience of Docker on Mac/Windows/Amazon AWS and Azure. It can also be used separately to define a declarative architecture. 

For more - head over to the [InfraKit repo](https://github.com/docker/infrakit) or see [Gareth Rushmore's Hello World blog post here](http://www.morethanseven.net/2016/10/07/infrakit-hello-world/).

Julius Volz the co-founder of Prometheus gave a deep dive on monitoring and metrics. It was good to hear about his thought process RE: push vs. pull and the reasons for choosing PromQL over SQL for querying. There was a real collaborative spirit and on the second day we all broke out into various groups by interest and hacked together with one or two demos culminating at the end.

**Closing**

At the close of the event Solomon came onto the stage for Q&A but very few questions were asked. After all we had just spent two days listening to technical talks, picking brains and hacking.

Personally I really enjoyed the event and heard nothing but positive feedback from the other attendees - so a huge thanks to the Docker team and to everyone who made it a success.

### See also:

* [Windows Containers mini-series](http://blog.alexellis.io/tag/windows/)

* Docker + [Raspberry Pi Swarm Mode Deep Dive](http://blog.alexellis.io/live-deep-dive-pi-swarm/)

* [Container.Camp London notes](http://blog.alexellis.io/contain-yourself-in-london/)