---
title: "Docker's 4th Birthday in London"
slug: "dockers-4th-birthday"
date: "2017-03-22T08:06:00Z"
author: "Alex Ellis"
meta_title: "Docker's 4th Birthday in London"
meta_description: "The Docker London meet-up group celebrated Docker's 4th birthday in style at HPEs head office in the City. Get my take as a mentor and Captain."
tags:
  - "docker"
  - "birthday event"
  - "meetup"
---

Docker has been [celebrating its 4th birthday](https://blog.docker.com/2017/03/thank-you-docker-community-2/) all over the world with meet-up groups having parties, birthday cakes, stickers and open events for learning about containers.

![](https://i2.wp.com/blog.docker.com/wp-content/uploads/Docker-bday-4.jpg?resize=275%2C300&ssl=1)

You can follow Tweets and pictures via the [#dockerbday](https://twitter.com/hashtag/dockerbday) hashtag.

I went along to the London meet-up as a Docker Captain and mentor and several other developers from the office joined me too.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">ADP devs on the way to London for 4th <a href="https://twitter.com/docker">@docker</a> birthday <a href="https://twitter.com/hashtag/dockerselfie?src=hash">#dockerselfie</a> <a href="https://twitter.com/hashtag/dockerbday?src=hash">#dockerbday</a> <a href="https://twitter.com/hashtag/dockercaptain?src=hash">#dockercaptain</a> <a href="https://t.co/U34fKchb1j">pic.twitter.com/U34fKchb1j</a></p>&mdash; Alex Ellis (@alexellisuk) <a href="https://twitter.com/alexellisuk/status/843864522461003779">March 20, 2017</a></blockquote> <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

[Ali Shaw](https://twitter.com/alishaw_) from HPE was hosting the event at their head-office in the City and put on the drinks. It was an impressive office and a great venue for a large meet-up. [Ben Hall](https://twitter.com/Ben_Hall) who has been running the meet up for 12 months worked with sponsors to provide food and snacks. All that was left was for people to arrive and start learning Docker through the [on-line labs](http://birthday.play-with-docker.com).

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">At the <a href="https://twitter.com/docker">@docker</a> birthday meet-up in London with loads of keen Dockers!! Lets get started <a href="https://twitter.com/hashtag/DockerLondon?src=hash">#DockerLondon</a> <a href="https://t.co/DaqT4zpI0T">pic.twitter.com/DaqT4zpI0T</a></p> Alex Ellis (@alexellisuk) <a href="https://twitter.com/alexellisuk/status/843896691971514368">March 20, 2017</a></blockquote> <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

**Docker mentor**

As soon as I put a Docker mentor badge on people started asking me questions about networking, CI, security, Windows and everything in-between.

This was great and showed how keen people were to understand how to apply Docker to their workflows.

> There were a few questions asked that I had already written about on the [blog](http://blog.alexellis.io/tag/docker) or [my Hands-on Docker Labs](https://github.com/alexellis/HandsOnDocker) tutorial.

Here's a key question that came up about getting containers to talk to each other:

* What's the difference between links, Docker Compose and Stacks?

One thing that I think everyone notices with Docker is that the project keeps innovating and finding new, more efficient ways to solve problems.

Linking was the original way to have multiple containers talk to each other. I wrote in detail about it in my Hands-on Docker Labs tutorial about 12 months ago. Links involved complex command-line arguments and environmental variables - it did the job but we have better alternatives now.

Docker Compose which is written in Python originated as a tool called Fig and grew in popularity until the project was acquired by Docker. Compose and Docker grew together and was widely used to deploy inter-connected containers in development environments. Some people even used it in production or in combination with the pre-Docker 1.12 swarm offering.

In June 2016 Docker released 1.12 which introduced Swarm services. This was the next step in the evolution of linking containers together. You could now define a set of containers declaratively and have Docker Swarm realise the setup on your cluster of Docker hosts. A software-defined overlay network meant you didn't have to worry about links or dynamically-allocated ports - services could reach each other by name.

With Docker 1.13 parts of Docker Compose were ported from Python into the Docker CLI and daemon codebase taking on a new name of "stacks". A traditional Compose file could be upgraded to version 3 and then be deployed onto a swarm.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Thats a wrap! Great to meet everyone tonight - thanks for coming up and saying hi <a href="https://twitter.com/hashtag/dockerbirthday?src=hash">#dockerbirthday</a> <a href="https://twitter.com/hashtag/dockerlondon?src=hash">#dockerlondon</a> <a href="https://twitter.com/hashtag/docker?src=hash">#docker</a> <a href="https://t.co/DuFd1NLfmx">pic.twitter.com/DuFd1NLfmx</a></p>&mdash; Alex Ellis (@alexellisuk) <a href="https://twitter.com/alexellisuk/status/843938081053052932">March 20, 2017</a></blockquote> <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

For more on stacks, read my tutorial: [Docker Stacks and Attachable networks
](http://blog.alexellis.io/docker-stacks-attachable-networks/)

#### Wrapping up

As you can see from the photos, we all had a great time and our team came away inspired. Well done to  

Don't worry if you missed a birthday event, you can still continue learning online.

* [Docker Birthday labs](http://birthday.play-with-docker.com)

If you have questions you could ask them in the Docker Slack community.

* Join [Docker Slack Community](https://dockr.ly/community)

* Watch [Dockercon Tips](https://www.youtube.com/playlist?list=PLkA60AVN3hh9snsnvLxkg4hLyEx52gm4L) from the Captains and Docker team