---
title: "Notes from Dockercon 2017 - Copenhagen"
slug: "dockercon-2017-copenhagen"
date: "2017-10-21T14:30:00Z"
author: "Alex Ellis"
meta_title: "Notes from Dockercon 2017 - Copenhagen"
meta_description: "My notes and experiences from Dockercon EU in Copenhagen from K8s to serverless. Docker Inc announced it would Build, Ship, Run on both Kubernetes and Swarm"
feature_image: "/content/images/2017/10/steve.jpg"
tags:
  - "Dockercon"
  - "serverless"
  - "kubernetes"
  - "k8s"
  - "speakers's notes"
  - "speaking"
  - "openfaas"
---

I'm starting this blog post in the airport at Copenhagen while drinking the most expensive coffee I've ever bought, but it doesn't matter because it's been a huge week for Docker Inc, the Dockercon attendees, myself and for the whole container community.

The last Dockercon event I attended was in Austin in May and I spent most of the time indoors practising my talk for [the closing keynote session - Moby's Cool Hacks](https://blog.docker.com/2017/04/dockercon-2017-mobys-cool-hack-sessions/). So much has changed since I announced OpenFaaS (Functions as a Service) and ran through auto-scaling and Alexa demos live on stage. I'll talk about the speaking opportunities I had this week and share some of my conference highlights too.

### Highlights

#### Build, Ship, Run - Kubernetes

The biggest announcement was that Docker will now bundle the Kubernetes orchestration platform with their enterprise product range called "EE" or "Docker Enterprise Edition". There has been some speculation that this would be inevitable since Swarm was launched last June. Personally I started learning Kubernetes a few months ago and found the transition relatively straight forward. I didn't do this to jump ship, in fact I (like many others) have dedicated many hours to teaching and writing about Docker Swarm. My motivation for blogging has always been to make seemingly complex technology accessible and digestible by the wider community. I know many of us don't all have the time or budget necessary to spend keeping up with technology.

Read more about [Docker's official announcement here](https://blog.docker.com/2017/10/docker-enterprise-edition-kubernetes/)

![](https://i1.wp.com/blog.docker.com/wp-content/uploads/ee-arch-1.png?w=1856&ssl=1)

Overnight developers and infrastructure specialists around the world have been given a decision to make about where to invest their time.

> Should I learn Docker or Kubernetes?

I've put together a short-course for bootstrapping your learning experience as well as succinct guide comparing the things you need to know about Docker and Kubernetes.

* Start my [Kubernetes mini-course](https://blog.alexellis.io/tag/learn-k8s/)

* Read [What You Need to Know: Docker and Kubernetes](https://blog.alexellis.io/you-need-to-know-kubernetes-and-swarm/).

### Docker Captains

One of the other important parts of Dockercon for me is the [Docker Captains group](https://www.docker.com/community/docker-captains). We are a bunch of 60 +/- individuals from around the world who have shown a commitment to sharing about container technology. We have grown as a group since forming and provide support for each other as well as encouragement and insight into the industry from a wide range of backgrounds.

If you're looking for a great UI to use with Kubernetes - check-out the work [Dimitris](https://twitter.com/spiddy) who I met at the conference. He built an admin UI for some of his clients and called it [Kubernetic](http://kubernetic.com) - available for Windows/Linux and Mac.

### Speaking opportunities

#### Tech Field Day

On Monday afternoon I had the privilege of being invited to join with [Stephen Foskett](https://twitter.com/SFoskett?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor) from [GestaltIT](http://gestaltit.com) as a delegate to hear from his industry sponsors about technology they were building. I was excited about the approach AppDynamics used to instrument distributed applications at the byte-code level. This means developers can be hands-off and you can retro-fit to legacy applications easily.

I was asked to present on [OpenFaaS](https://www.openfaas.com) - a serverless framework built for a cloud native eco-system. The use of containers, the Docker image format and the way we trust the orchestration platform to deliver are the key differences between OpenFaaS and any other similar project.

> Kelsey Hightower recently spoke on Twitter about how the container has to be the workload for a serverless system. I couldn't agree more.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">From the first commit until now - container images have always been the primitive for our functions. Ruby, .NET, Go.. Windows.. you name it. <a href="https://t.co/acbUj6wqkb">https://t.co/acbUj6wqkb</a></p>&mdash; OpenFaaS (@openfaas) <a href="https://twitter.com/openfaas/status/921627746106793984?ref_src=twsrc%5Etfw">October 21, 2017</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

Here's the video recording by Stephen:

<iframe width="560" height="315" src="https://www.youtube.com/embed/C3agSKv2s_w" frameborder="0" allowfullscreen></iframe>

I met Keith Townsend aka *CTO Advisor* and had the chance to talk about his journey and frustrations with other Serverless frameworks he had tried out. More from Keith below:

<blockquote class="twitter-tweet" data-lang="en"><p lang="fr" dir="ltr">On-premises <a href="https://twitter.com/hashtag/Serverless?src=hash&amp;ref_src=twsrc%5Etfw">#Serverless</a> in Docker containers. <a href="https://twitter.com/hashtag/Kubernetes?src=hash&amp;ref_src=twsrc%5Etfw">#Kubernetes</a> <a href="https://twitter.com/hashtag/OpenFaaS?src=hash&amp;ref_src=twsrc%5Etfw">#OpenFaaS</a> <a href="https://twitter.com/hashtag/Dockercon?src=hash&amp;ref_src=twsrc%5Etfw">#Dockercon</a> <a href="https://t.co/vQfSJxcTef">https://t.co/vQfSJxcTef</a></p>&mdash; Keith Townsend (@CTOAdvisor) <a href="https://twitter.com/CTOAdvisor/status/922115542118486018?ref_src=twsrc%5Etfw">October 22, 2017</a></blockquote> <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

### FaaS and Furious

During the conference I met up with old friends, influencers, industry analysts and made lots of new connections with great people. Thanks to all for the validation about what we're doing. 

**Birds-of-a-feather a.k.a. hallway track**

The next engagement on my calendar was with the "Hallway Track" - these are sessions for up to 5 people to compare notes. We had around 20 people arrive and even then turned a few away. It was very useful to hear what people are expecting from Serverless Functions and to compare notes with folks approaching the problem from different directions.

**Conference Talk in the Community Theatre**

Speaking in the Community Theatre reminded me of my [first talk at Dockercon in 2016](https://blog.alexellis.io/dockercon-2016-speaker-notes/) in a crowded expo hall. The team had created a much better space for this event - kudos. The lack of a ball-room or auditorium did not prevent the crowds from turning up for a standing-room only talk - Zero to Serverless in 60 seconds.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Super crowded <a href="https://twitter.com/alexellisuk?ref_src=twsrc%5Etfw">@alexellisuk</a> talk about <a href="https://twitter.com/openfaas?ref_src=twsrc%5Etfw">@openfaas</a> ! <a href="https://twitter.com/DockerCon?ref_src=twsrc%5Etfw">@DockerCon</a> <a href="https://twitter.com/hashtag/DockerConEU?src=hash&amp;ref_src=twsrc%5Etfw">#DockerConEU</a> <a href="https://t.co/GCQeWItnAp">pic.twitter.com/GCQeWItnAp</a></p>&mdash; Mathias Renner (@MathiasRenner) <a href="https://twitter.com/MathiasRenner/status/920291938271670272?ref_src=twsrc%5Etfw">October 17, 2017</a></blockquote> <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

The initial recording is available here via the Dockercon website:

[Video: From Zero to Serverless in 60 Seconds, Anywhere](https://dockercon.docker.com/watch/F1tJoaFWGZhCDpodtudid9)

**Mentoring**

I met [Finnian Anderson](https://twitter.com/developius?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor) (17yrs) back in February and was impressed by [a Raspberry Pi cluster he had created](https://fxapi.co.uk/2016/11/19/raspberry-pi-swarm/) from my blog content and guides. I helped him to get connected to Docker who flew him over with a parent to attend Dockercon in Austin and present a Cool Hack. This event was his second Dockercon and he built out a fascinating project with his best friend Oli.

> How can you help mentor people practically?

Well we spent time at the conference together - met up regularly and I helped review their slides. I give advice about putting the demo together and on addressing the audience, but on the day they spoke with confidence in front of a packed audience. I'm looking forward to seeing what they will do with OpenFaaS next.

In their talk they covered some of the approaches for Machine Learning they had tried. In the end they decided not to create their own model, but to use a pre-trained model and a package called ([Caffe](http://caffe.berkeleyvision.org)) from the University of Berkeley. The two of them showed us how to turn a black and white film into colour - a process that [according to Finnian](https://finnian.io/blog/colourising-video-with-openfaas-serverless-functions/) can cost up to £3000/minute. They did this for free in their hotel room on a MacBook with a collection of OpenFaaS functions - for free.

> Finnian came up with an idea for a Twitter bot called [@colorisebot](https://twitter.com/colorisebot) but the execution was a team-effort which meant investing my own time coding, testing and supporting the effort right up to the last minute.

I helped package the machine-learning model ([Caffe](http://caffe.berkeleyvision.org)) as an OpenFaaS function with Docker, arranged for sponsorship with [Packet.net](https://www.packet.net), leveraged Minio for storage, designed an asynchronous architecture using [NATS Streaming](http://nats.io) so that the bot could scale up for demand. Finnian also needed help with error handling to make sure the bot could survive unexpected issues. 

> Look out for when we release the source-code in a few weeks with full instructions for the functions, bot and video converter..

You can view the video for yourself here - [Repainting the past with Machine Learning and OpenFaaS](https://dockercon.docker.com/watch/1sEyvPTJuVUADbbLYJLpi8).

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">I colorized your image using <a href="https://twitter.com/hashtag/openfaas?src=hash&amp;ref_src=twsrc%5Etfw">#openfaas</a> in 5.8 seconds <a href="https://twitter.com/hashtag/dockercon?src=hash&amp;ref_src=twsrc%5Etfw">#dockercon</a> <a href="https://t.co/Q0fyMSQSv2">pic.twitter.com/Q0fyMSQSv2</a></p>&mdash; Colorise Bot (@colorisebot) <a href="https://twitter.com/colorisebot/status/920755785100955649?ref_src=twsrc%5Etfw">October 18, 2017</a></blockquote> <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

#### Serverless Panel

The third slot was on Wednesday where I joined with [Phil Estes (IBM)](https://twitter.com/estesp?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor), [Chad Arimura (Oracle)](https://twitter.com/chadarimura?lang=en) and [Erica Windisch from IOpipe](https://twitter.com/IOpipes) to discuss the state of serverless and to compare notes on our approach to community, architecture and user stories.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Now in Edge 10 <a href="https://twitter.com/alexellisuk?ref_src=twsrc%5Etfw">@alexellisuk</a> up representing <a href="https://twitter.com/openfaas?ref_src=twsrc%5Etfw">@openfaas</a> on the <a href="https://twitter.com/hashtag/serverless?src=hash&amp;ref_src=twsrc%5Etfw">#serverless</a> panel <a href="https://t.co/mqWQzZArpG">pic.twitter.com/mqWQzZArpG</a></p>&mdash; John McCabe (@mccabejohn) <a href="https://twitter.com/mccabejohn/status/920647245611065345?ref_src=twsrc%5Etfw">October 18, 2017</a></blockquote> <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

I only found out later that [Steve Singh](https://twitter.com/SteveSSingh?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor) - Docker's CEO had sneaked in at the back to take notes after having announced Serverless was on Docker's radar in the opening keynote the day before.

#### Moby Summit

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr"><a href="https://twitter.com/hashtag/MobySummit?src=hash&amp;ref_src=twsrc%5Etfw">#MobySummit</a> <a href="https://twitter.com/n4zs_?ref_src=twsrc%5Etfw">@n4zs_</a> the raw Linux security features as seen by regular developers and ops: making security usable is important <a href="https://t.co/RHiQtzGgwn">pic.twitter.com/RHiQtzGgwn</a></p>&mdash; Moby (@moby) <a href="https://twitter.com/moby/status/920980508846313474?ref_src=twsrc%5Etfw">October 19, 2017</a></blockquote> <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

> A Tweet showing improvements in the default container security policy for Docker Swarm.

At the end of the conference Docker ran a "Moby Summit" - [Moby](https://github.com/moby/moby) is the new name for the "open source" version of "Docker". It is also the name of an organisation or group where the Docker open-source projects are gathered together. Solomon shared that the governance model is moving from Benevolent Dictator to a committee-style panel as seen in the Kubernetes project.

> Solomon Hykes shared that a firm lead and saying no are essential for a small team which is growing fast, but that now internal teams have grown into entities which self-manage.

It's hard to pick my favourite sessions from the summit, but I'll say that they were all exceptional and will be available online soon on the Docker blog.

**Keep an eye out for:**

* [buildkit](https://github.com/moby/buildkit) - a brand new re-imagined builder for Docker images and other artefacts too. Think CI, but next-gen. I'm excited about how this can be integrated into serverless platforms.

* [cri-containerd](https://github.com/kubernetes-incubator/cri-containerd)

The [cri-containerd](https://github.com/kubernetes-incubator/cri-containerd) project is a joint venture between Google and Docker Inc which brings the new [containerd](https://github.com/containerd/containerd) runtime/daemon to Kubernetes. The vision here is that Kubernetes will swap out "Docker 1.12" for containerd which is both more modular and targeted as a container runtime.

Abhi the lead maintainer from Docker Inc demoed a set of serverless functions which allowed him to specify all the software appliances he needed in a basket and finally constructed a LinuxKit VM. This is space age stuff and both fun and exciting to see engineers adopting [OpenFaaS](https://www.openfaas.com) functions to create compelling demos.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">It&#39;s <a href="https://twitter.com/openfaas?ref_src=twsrc%5Etfw">@openfaas</a> at the <a href="https://twitter.com/hashtag/MobySummit?src=hash&amp;ref_src=twsrc%5Etfw">#MobySummit</a> with cri-containerd building <a href="https://twitter.com/hashtag/LinuxKit?src=hash&amp;ref_src=twsrc%5Etfw">#LinuxKit</a> VMs. What a technology stack! Demo by <a href="https://twitter.com/APrativadi?ref_src=twsrc%5Etfw">@APrativadi</a> <a href="https://t.co/EiTc3WikcO">pic.twitter.com/EiTc3WikcO</a></p>&mdash; Alex Ellis (@alexellisuk) <a href="https://twitter.com/alexellisuk/status/920976824938704897?ref_src=twsrc%5Etfw">October 19, 2017</a></blockquote> <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

* OpenFaaS at the summit

During my very short talk (15min) on [OpenFaaS](https://www.openfaas.com) I wanted to give you all a sense of what makes OpenFaaS different to the projects backed by corporate vendors.

> We are rocket-fuelled by a motivated and engaged community of diverse and talented people who are creating something they want to use and love building.

Take [John Mccabe](https://twitter.com/mccabejohn) who I'd only met for the second time. John has built a menu-bar integration called [openfaas-bitbar](https://twitter.com/rorpage/status/921457390528221184). He's also contributed in many other areas including migrating us from the Golang flags package to a Cobra CLI.

I then announced that OpenFaaS was added to the CNCF Landscape and spoke about how we were awarded the [Bossie award for Best Cloud Software 2017](https://twitter.com/openfaas/status/913061203106287616) along with Docker CE and Kubernetes.

![](https://github.com/cncf/landscape/raw/master/landscape/CloudNativeLandscape_latest.jpg)

The Cloud Native Landscape helps professionals navigate the emerging technology as well as providing a home for unique projects within the [Cloud Native Computing Foundation](https://www.cncf.io) - the home of Kubernetes.

### Wrapping up

Docker Inc is embracing Kubernetes - a huge project which is well-known for a thriving community but also notorious for its complexity. 

> My prediction is that Docker Inc's involvement will democratize the experience for every-day developers and that the whole ecosystem will become easier to use and more readily available.

I believe one of the ways they will do that is by taking decisions away about which networking, storage drivers to use and how to deploy and create clusters. 

The term *Serverless* is on the top of Gartner's hype curve, so beware of the promises from the dozens of projects which will emerge in this space over the coming months. Test them for yourselves and evaluate them on their approach as well as their ability to deliver a container-native solution.

Further reading:

* Read [What You Need to Know: Docker and Kubernetes](https://blog.alexellis.io/you-need-to-know-kubernetes-and-swarm/).

For a limited time only: when you [Star the OpenFaaS GitHub repository](https://github.com/openfaas/faas) we'll create a polaroid from your avatar and upload it to [Twitter](https://twitter.com/alexellisuk) using [serverless functions](https://github.com/alexellis/faas-twitter-fanclub).

* Get started with Serverless & Containers with [OpenFaaS](https://github.com/openfaas/faas/tree/master/guide)