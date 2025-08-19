---
title: "Contain Yourself! in London"
slug: "contain-yourself-in-london"
date: "2016-09-10T08:41:00Z"
author: "Alex Ellis"
meta_title: "Contain Yourself! in London"
meta_description: "Docker Captain Alex Ellis was a first-time Container Camp Speaker - see the pics, read about the great Docker talks over the two days."
feature_image: "/content/images/2016/09/charts.jpg"
tags:
  - "docker"
  - "swarm"
  - "captains"
  - "container.camp"
  - "containers"
---

I've just come back from my first Container.Camp and I loved it. I got to speak, listen, learn and meet some of the smartest people in tech. Container.Camp London started on Thursday night in Shoreditch and then the main event was on Friday - with both days being packed.

I wanted to say a big *thank you* to the organisers and sponsors - it was a top couple of days and had a relaxed atmosphere. It must have been days and weeks in the planning but it looked almost seamless.

I covered the events with live Tweeting so that you can get a flavour of the event. 

### Day Zero

Conferences, camps and field-days are quite new for me but I liked the idea of a *day zero* and it worked really well to stir up the appetite and expectation. Docker London helped organise the huge meet-up in an old Victorian Boys' school in the middle of Shoreditch - it was a cool venue with plenty of food, beer and heritage ( think Harry Potter! )

Most of the talks were around Orchestration, home-brewed DevOps solutions and then Ben Hall finished with a talk on the top 5 exploits for Docker Containers. He has an excellent offering in [Katacode](https://katacoda.com/learn), which lets you [learn Docker through a webpage](https://katacoda.com/learn). If you're just starting out then I'd highly recommend it.

<blockquote class="twitter-tweet" data-lang="en"><p lang="und" dir="ltr"><a href="https://twitter.com/hashtag/later?src=hash">#later</a> <a href="https://twitter.com/hashtag/dayzero?src=hash">#dayzero</a> <a href="https://twitter.com/containercamp">@containercamp</a> <a href="https://t.co/oVcGAr1D1n">pic.twitter.com/oVcGAr1D1n</a></p>&mdash; Alex Ellis (@alexellisuk) <a href="https://twitter.com/alexellisuk/status/774530896833708032">September 10, 2016</a></blockquote> <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

### Day One - containyourself

The WiFi password was `containyourself` so this was clearly a conference *for geeks by the geeks*. I eventually found my way to Piccadilly Circus and registered for my conference badge. There was a chilled area for the speakers with coffee and thinking space - very nice touch. I met [Dustin Kirkland](http://blog.dustinkirkland.com/) from Canonical and gave him a few laptop stickers. [Liz Rice](https://twitter.com/lizrice) had an interesting live coding GoLang talk which she had borrowed from an IBM employee. The code invoked Linux syscalls to show how `chroot` etc works to produce a modified process that we would call "a container".

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Everyone is listening intently <a href="https://twitter.com/containercamp">@containercamp</a> let&#39;s build a container engine (poc) in 52 lines of code <a href="https://t.co/BdjQ4YsXNR">pic.twitter.com/BdjQ4YsXNR</a></p>&mdash; Alex Ellis (@alexellisuk) <a href="https://twitter.com/alexellisuk/status/774244290390331392">September 9, 2016</a></blockquote> <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

The talk that resounded the most with me was from Docker's Engineer Nishant. Docker Swarm Mode feels refreshingly simple when compared to some of the other offerings - just enough terminology to get the points across without needing a dictionary of technical jargon.

> [Solomon Hykes](https://twitter.com/solomonstre) announced at Dockercon that making the complex simple is hard, and it takes great engineers. 

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Want a secure <a href="https://twitter.com/docker">@docker</a> cluster? No problem, it&#39;s built-in: two commands and you&#39;re set. <a href="https://twitter.com/containercamp">@containercamp</a> <a href="https://t.co/viZ3CEy47g">pic.twitter.com/viZ3CEy47g</a></p>&mdash; Alex Ellis (@alexellisuk) <a href="https://twitter.com/alexellisuk/status/774195186998140928">September 9, 2016</a></blockquote> <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

Some of the talks were very slick and well rehearsed. One of those was from [Chris Van Tuin](https://twitter.com/chrisvantuin), RedHat. While there was a focus on [Kubernetes](http://kubernetes.io) he did make some excellent points around security and silos within organisations.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Could not agree more - break the silos. <a href="https://twitter.com/containercamp">@containercamp</a> <a href="https://twitter.com/RedHatNews">@RedHatNews</a> <a href="https://t.co/usoW5PhRyI">pic.twitter.com/usoW5PhRyI</a></p>&mdash; Alex Ellis (@alexellisuk) <a href="https://twitter.com/alexellisuk/status/774260432215441408">September 9, 2016</a></blockquote> <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

I am a real proponent for developers doing their own testing before passing work onto test engineers. The book [Clean Coder](https://www.amazon.co.uk/Clean-Coder-Conduct-Professional-Programmers/dp/0137081073) suggests that test engineers should only really have to accept stories and not carry out reams and reams of manual testing. Gone are the days where code is checked-in and thrown over the wall. Let's break those silos.

#### Continuous learning

I learned so much and have a long list of tools to try and terms to look up. I'm definitely going to be writing some C code and hacking on Linux sys calls - it gave me a whole new perspective on what a container is.

> i.e. a forked process with some syscalls applied. Calls for namespaces give separation and calls around control groups impose resource limitations.

But Docker is way more than a bunch of carefully-curated syscalls. This industry wouldn't be the same without its leadership and achievements.

I got started hacking with `chroot`, check it out here:

* [Oh my Chroot!](https://gist.github.com/alexellis/cce3b566311d736f63c85b9291571503) on gist.github.com

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Going old-school with the note taking. Lots to take home. <a href="https://t.co/q3tXPpcWcz">pic.twitter.com/q3tXPpcWcz</a></p>&mdash; Alex Ellis (@alexellisuk) <a href="https://twitter.com/alexellisuk/status/774245433820516352">September 9, 2016</a></blockquote> <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

#### My talk

Keep checking back for the video recording of my whole talk. I suspect it will take a couple of weeks to materialise and if you can't wait you can see me in [Cambridge and Peterborough](http://blog.alexellis.io/dpip-ftw/).

For the deck head over to SlideShare:

<iframe src="http://www.slideshare.net/AlexEllis11/slideshelf" width="615px" height="470px" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:none;" allowfullscreen webkitallowfullscreen mozallowfullscreen></iframe>

For all the details about the talk and the source-code on Github check my [DockerCon 16 Speaker notes](http://blog.alexellis.io/dockercon-2016-speaker-notes/).

You may have heard me mention Pimoroni and the work they did to help build the hack in my talk. These are the parts (in addition to the [Pi Zero](http://stockalert.alexellis.io/) I used in the build):

* https://shop.pimoroni.com/products/enviro-phat
* https://shop.pimoroni.com/products/blinkt
* https://shop.pimoroni.com/products/unicorn-hat


<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Flashy <a href="https://twitter.com/hashtag/docker?src=hash">#docker</a> demo on <a href="https://twitter.com/hashtag/rpi?src=hash">#rpi</a>, thanks <a href="https://twitter.com/alexellisuk">@alexellisuk</a> <a href="https://t.co/7XjcDg3ayC">pic.twitter.com/7XjcDg3ayC</a></p>&mdash; Nicolas De loof (@ndeloof) <a href="https://twitter.com/ndeloof/status/774284729755500544">September 9, 2016</a></blockquote> <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

*Salut Captain Nicolas! You have a great eye for a photo.*

Watch this video snippet of the live demo from [@feelobot](https://twitter.com/feelobot).

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr"><a href="https://twitter.com/hashtag/containercamp?src=hash">#containercamp</a> <a href="https://twitter.com/alexellisuk">@alexellisuk</a> all of the lights! <a href="https://t.co/xOZUslLGp1">pic.twitter.com/xOZUslLGp1</a></p>&mdash; feelobot (@feelobot) <a href="https://twitter.com/feelobot/status/774292770215305216">September 9, 2016</a></blockquote> <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

*No time for technical rehearsal!*

If you want to know more, please follow along on Twitter [@alexellisuk](https://twitter.com/alexellisuk/). The community has done lots of work to get Docker and Swarm Mode working really well on the Pi. 

See also:

* Curated list of [all my Raspberry Pi + Docker materials](https://github.com/alexellis/docker-arm)

* [My Swarm Mode tutorials](http://blog.alexellis.io/tag/swarmmode/)

* [How I run this blog on a Pi](http://blog.alexellis.io/ghost-on-docker-5mins/)