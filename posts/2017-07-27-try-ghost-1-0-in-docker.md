---
title: "Try Ghost 1.0 in 5 minutes with Docker"
slug: "try-ghost-1-0-in-docker"
date: "2017-07-27T16:57:53Z"
author: "Alex Ellis"
meta_title: "Try Ghost 1.0 in 5 minutes with Docker"
meta_description: "Ghost 1.0 was released today and has had a complete revamp. Got 5 minutes? You can check it out with Docker without installing anything on your PC."
feature_image: "/content/images/2017/07/ghost-top.jpg"
tags:
  - "docker"
  - "ghost"
---

Today [Ghost 1.0](https://news.ycombinator.com/item?id=14864731) was released which included a new editor and a new [installation method](https://dev.ghost.org/ghost-1-0-0/). 

Trying Ghost is easy with Docker - just follow these steps and you'll have a blog up and running in less than 5 minutes.

### Build a Docker image

I put together a quick [Dockerfile](https://github.com/alexellis/ghost-on-docker/blob/master/1.0/x86_64/Dockerfile) for Ghost 1.0 which [you can read here](https://github.com/alexellis/ghost-on-docker/blob/master/1.0/x86_64/Dockerfile). It's much simpler than in previous releases due to the [Ghost CLI](https://dev.ghost.org/ghost-1-0-0/) added by the project.'

I've already pushed my image to the Docker Hub as `alexellis2/ghost:1.0`, so you can skip the next step unless you want to re-build the image yourself.

*Build it yourself (Optional)*

Type in:
```
$ git clone https://github.com/alexellis/ghost-on-docker/
$ cd ghost-on-docker/1.0/x86_64
$ docker build -t alexellis2/ghost:1.0 .
```

### Run the blog

Once your build is done - run it like this:

```
$ docker run -p 2368:2368 --name ghost -ti alexellis2/ghost:1.0
```

You can now open up the blog in a new window. http://localhost:2368

![](/content/images/2017/07/home.jpg)

**List your posts**

![](/content/images/2017/07/list.jpg)

List your posts with the new re-vamped dashboard.

**Edit a post**

![](/content/images/2017/07/edit-1.jpg)

This is the brand-new editor.

Enjoy!


### Q&A

* Is this a production-grade configuration?

There are several new configuration options including the use of systemd for process management. [Read More here](https://docs.ghost.org/v1.0.0/docs/cli-install#section-ghost-install-local).

The Docker container I've built here is using the development mode, which is much slower than you'd want to run in production. It will however let you kick the tires.

* Will this work on Raspberry Pi?

I'm not sure whether the new installer will be compatible with RPi / ARMv6/7/8. My Dockerfile can be adapted easily though.

Ghost 0.11.x works very well on Raspberry Pi Zero / 2 / 3. You can read my [ARM/Raspberry Pi and Docker instructions here](https://github.com/alexellis/ghost-on-docker/).

* Is SQLite still supported?

Yes - so this would mean very long install times on Raspberry Pi.

* How do I upgrade from 0.x?

The Ghost team state you must create a new blog and import your data. No more in-place upgrades.

### Learn more about Docker

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Try the new Ghost 1.0 release with <a href="https://twitter.com/Docker">@Docker</a> in 5 minutes - 🐳 <a href="https://t.co/1Rq9LOrDpv">https://t.co/1Rq9LOrDpv</a> <a href="https://twitter.com/TryGhost">@TryGhost</a></p>&mdash; Alex Ellis (@alexellisuk) <a href="https://twitter.com/alexellisuk/status/890618085316608000">July 27, 2017</a></blockquote> <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

You can [learn more about Docker on my blog](https://blog.alexellis.io/tag/docker) which is still running on Ghost 0.11.x!