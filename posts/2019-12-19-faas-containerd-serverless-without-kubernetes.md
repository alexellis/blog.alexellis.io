---
title: "faas-containerd - serverless without Kubernetes"
slug: "faas-containerd-serverless-without-kubernetes"
date: "2019-12-19T17:01:47Z"
author: "Alex Ellis"
meta_title: "faas-containerd - serverless without Kubernetes"
meta_description: "Learn about my new OpenFaaS provider built with containerd for a fast and lean Serverless experience at the edge and on single nodes. No Kubernetes required"
---

A little over a year ago I started an experiment to see if I could build an [OpenFaaS](https://github.com/openfaas/faas) provider for [containerd](https://github.com/containerd/containerd) that would mean a computer could run OpenFaaS functions without the need for a cluster and Kubernetes.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Thanks to some help from <a href="https://twitter.com/_AkihiroSuda_?ref_src=twsrc%5Etfw">@_AkihiroSuda_</a> 👨‍🏫 and networking expertise from <a href="https://twitter.com/bboreham?ref_src=twsrc%5Etfw">@bboreham</a> 👑, I now have a working <a href="https://twitter.com/containerd?ref_src=twsrc%5Etfw">@containerd</a> provider for <a href="https://twitter.com/openfaas?ref_src=twsrc%5Etfw">@OpenFaaS</a> 🚀<br><br>Trying it out on my Mac with multipass from <a href="https://twitter.com/Canonical?ref_src=twsrc%5Etfw">@Canonical</a> <br><br>It&#39;s early work, but super fast and lean vs. k8s<a href="https://t.co/RPHVX2QnQH">https://t.co/RPHVX2QnQH</a> <a href="https://t.co/fBkq1IkwqO">pic.twitter.com/fBkq1IkwqO</a></p>&mdash; Alex Ellis (@alexellisuk) <a href="https://twitter.com/alexellisuk/status/1207282296459595776?ref_src=twsrc%5Etfw">December 18, 2019</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

## An update - Jan 2020

faas-containerd is now part of the faasd project, which brings the OpenFaaS experience and ecosystem to containerd.

Learn more about faasd, or continue reading for the original story.

* [Serverless For Everyone Else - faasd handbook](https://gumroad.com/l/serverless-for-everyone-else)
* [faasd on GitHub](https://github.com/openfaas/faasd)

## Overview

Let's start with a quick glossary then get into the detail.

* [containerd](https://github.com/containerd/containerd) 

    If you haven't heard of containerd yet, it's a CNCF project and was spun out of the main Docker project. It runs containers, has advanced features like snapshotting and is both fast and lightweight.

* [OpenFaaS](https://github.com/openfaas/faas)
    
    A simple, modular, and extensible serverless platform for containers, the primary target for production is Kubernetes. Driven three values: developers-first, operator-friendly, and community-centric.

* [Kubernetes](https://kubernetes.io)

    A production grade container orchestrator, offered as a service by many cloud providers.

* [k3s](https://k3s.io)

    A light-weight version of Kubernetes which passes conformance tests.

* [faas-containerd](https://github.com/alexellis/faas-containerd)

    My newest OpenFaaS provider which runs functions in containerd instead of with Kubernetes.

Since my initial attempt went on hold, k3s arrived and has dramatically reduced the memory footprint of Kubernetes and even enabled the single-node use-case even further. k3s does so many smart things like replacing etcd with sqlite and packaging all the code needed into a single binary, including a network driver.

k3s is positioned for the edge, but it does need 500MB of RAM to even run hello-world, that feels like way too much, that's where faas-containerd comes in.

OpenFaaS was originally built only for Docker Swarm and was tightly coupled to its API, so when requirements changed I extracted an interface called "faas-provider", which is now a Golang SDK and has been used by dozens of developers to build different providers for functions. Read more about [The Power of Interfaces](https://blog.alexellis.io/the-power-of-interfaces-openfaas/) in OpenFaaS.

![Provider Model](https://github.com/openfaas/faas-provider/raw/master/docs/conceptual.png)

A provider implmements: CRUD on functions, secrets and logs. Functions are simply containers that serve traffic on port 8080. For bash, CLIs and other binaries, our ["watchdog"](https://docs.openfaas.com/architecture/watchdog/) can be used as a shim.

In this post I'll introduce you to [faas-containerd](https://github.com/alexellis/faas-containerd), what it does, and how you can get involved. First of all, a bit more context.

## List of OpenFaaS providers

Here's a summary from the [OpenFaaS community.md](https://github.com/openfaas/faas/blob/master/community.md) file. Not all providers are "equal" in terms of features, and support so we've included some notes and grouping.

Official providers developed and supported by the OpenFaaS project

| Project name and description                                         | Author     | Site      | Status      |
|----------------------------------------------------------------------|------------|-----------|-------------|
| **faas-netes**- Kubernetes provider | OpenFaaS | [github.com](https://github.com/openfaas/faas-netes) | Supported |
| **faas-swarm** - Docker Swarm provider | OpenFaaS | [github.com](https://github.com/openfaas/faas-swarm) | Supported |
| **openfaas-operator** - Kubernetes Operator provider | OpenFaaS | [github.com](https://github.com/openfaas-incubator/openfaas-operator) | Incubation |

Community providers actively being developed and/or supported by a third-party

| Project name and description                                         | Author     | Site      | Status      |
|----------------------------------------------------------------------|------------|-----------|-------------|
| **faas-nomad** - Nomad provider | Andrew Cornies & Nic Jackson (Hashicorp) | [github.com](https://github.com/hashicorp/faas-nomad) | Incubation  |
| **faas-memory** - In-memory provider | Ed Wilde / Alex Ellis | [github.com](https://github.com/openfaas-incubator/faas-memory) | Inception |
| **faas-federation** - federation provider to route between one or more providers | Ed Wilde / Alex Ellis | [github.com](https://github.com/openfaas-incubator/faas-federation) | Inception |
| **faas-fargate** - AWS Fargate provider | Edward Wilde | [github.com](https://github.com/ewilde/faas-fargate) | Incubation |
| **faas-lambda** - AWS Lambda provider | Ed Wilde / Alex Ellis | [sales@openfaas.com](mailto:sales@openfaas.com) | Incubation |
| **faas-containerd** - containerd provider for single node / edge | Alex Ellis | [github.com](https://github.com/alexellis/faas-containerd) | Inception |

Community providers no-longer being maintained

| Project name and description                                         | Author     | Site      | Status      |
|----------------------------------------------------------------------|------------|-----------|-------------|
| **faas-rancher** - Rancher/Cattle provider | Ken Fukuyama | [github.com](https://github.com/kenfdev/faas-rancher) | Inception |
| **faas-dcos** - DCOS provider | Alberto Quario | [github.com](https://github.com/realbot/faas-dcos) | Inception  |
| **faas-hyper** - Hyper.sh provider | Hyper | [github.com](https://github.com/hyperhq/faas-hyper) | Inception |
| **faas-guardian** - Guardian provider | Nigel Wright | [github.com](https://github.com/nwright-nz/openfaas-guardian-backend) | Inception |
| **faas-ecs** | Xicheng Chang (Huawei) | [github.com](https://github.com/stack360/faas-ecs) | Inception |
| **faas-opendns** | OpenDNS / Cisco / EC2  | [medium.com](https://medium.com/@codeboten/faas-tastic-implementing-the-openfaas-provider-in-24-hours-5a1f1f2f0461) | Inception |

## What's the role of a provider?

The OpenFaaS gateway hosts a UI and adds some important middleware like metrics, scale from zero, and authz. The provider deals with function CRUD, logs, and secret management.

![faas-provider](https://github.com/openfaas/faas-provider/raw/master/docs/conceptual.png)

From the faas-provider sample:

```golang
	timeout := 8 * time.Second
	bootstrapHandlers := bootTypes.FaaSHandlers{
		FunctionProxy:  handlers.MakeProxy(),
		DeleteHandler:  handlers.MakeDeleteHandler(clientset),
		DeployHandler:  handlers.MakeDeployHandler(clientset),
		FunctionReader: handlers.MakeFunctionReader(clientset),
		ReplicaReader:  handlers.MakeReplicaReader(clientset),
		ReplicaUpdater: handlers.MakeReplicaUpdater(clientset),
		InfoHandler:    handlers.MakeInfoHandler(),
		LogHandler: logs.NewLogHandlerFunc(requestor,timeout),
	}

	var port int
	port = 8080
	bootstrapConfig := bootTypes.FaaSConfig{
		ReadTimeout:  timeout,
		WriteTimeout: timeout,
		TCPPort:      &port,
	}

	bootstrap.Serve(&bootstrapHandlers, &bootstrapConfig)
```

To create your own provider, just head over to [faas-provider](https://github.com/openfaas/faas-provider), vendor the project and create your own HTTP handlers.

The simplest example is the [faas-memory](https://github.com/openfaas-incubator/faas-memory/) provider that I worked on with Ed Wilde. It's useful for testing.

## Introducing faas-containerd

The idea with faas-containerd is to create a provider that can run any OpenFaaS function or service using containerd, but faster and using less resources than Kubernetes or k3s.

From the repo:

> Some users could benefit from a lightweight, single-node execution environment. Using containerd and bypassing Kubernetes or Docker should reduce the start-time for functions and allow for running in resource-constrained environments.

Pros:

* Fast cold-start
* containerd features available such as pause/snapshot
* Super lightweight

Cons:
* No clustering (yet)
* No inter-service communication (yet)
* Very experimental

I was excited to share a Tweet showing the provider working with `faas-cli` and unmodified functions directly from the Function Store, a good test I think.

![Working demo](https://camo.githubusercontent.com/a140fb760a92a460ccfdb3f6cb60190b7691d1e5/68747470733a2f2f7062732e7477696d672e636f6d2f6d656469612f454d4567314f45576b41414944504f3f666f726d61743d6a7067266e616d653d6d656469756d)

### What are people saying?

There's already been some initial interest from my network.

Here's our first tester, tweeting a picture of his deployment of my ping function:

<blockquote class="twitter-tweet" data-conversation="none"><p lang="en" dir="ltr"><a href="https://twitter.com/alexellisuk?ref_src=twsrc%5Etfw">@alexellisuk</a> one more time, just awesome, check i deploy in <a href="https://twitter.com/CivoCloud?ref_src=twsrc%5Etfw">@CivoCloud</a> and work nice, and i ask, in theory i can run this in k3s? <a href="https://t.co/3z46mhyqWe">pic.twitter.com/3z46mhyqWe</a></p>&mdash; Alejandro JNM. (@alejandrojnm) <a href="https://twitter.com/alejandrojnm/status/1207659425294626818?ref_src=twsrc%5Etfw">December 19, 2019</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

Other folks in the ecosystem are also interested by the possiblities this might bring:

<blockquote class="twitter-tweet" data-conversation="none"><p lang="en" dir="ltr">Oooohhhhh! Me likey the sound of this! 🤤</p>&mdash; Michael Irwin (@mikesir87) <a href="https://twitter.com/mikesir87/status/1207326606936727558?ref_src=twsrc%5Etfw">December 18, 2019</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

<blockquote class="twitter-tweet" data-conversation="none"><p lang="en" dir="ltr">Very cool project</p>&mdash; Jeff Hollan (@jeffhollan) <a href="https://twitter.com/jeffhollan/status/1207294090057904129?ref_src=twsrc%5Etfw">December 18, 2019</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

Darren Shepherd, the creator of k3s also had some ideas about the project

<blockquote class="twitter-tweet" data-conversation="none"><p lang="en" dir="ltr">This makes way more sense to me than FaaS on k8s. I&#39;d even go as far as embed containerd in openfaas. Just make it a single executable.</p>&mdash; Darren Shepherd (@ibuildthecloud) <a href="https://twitter.com/ibuildthecloud/status/1207526865943977984?ref_src=twsrc%5Etfw">December 19, 2019</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

Darren's done great work with k3s, and I'm sure there's a lot that can be learned from his approach.

## Going further

faas-containerd has generated some initial interest and the proof of concept is working, so you can take it for a spin yourself on a Linux computer, or even a Raspberry Pi.

If you like this idea, or think it's cool, Star / Fork the project for later:

* [alexellis/faas-containerd](https://github.com/alexellis/faas-containerd) - the new provider 
* [alexellis/faasd](https://github.com/alexellis/faasd) - a Go controller to setup the provider, the Gateway UI, and Prometheus

Here's a diagram of what things might look like, if a "faasd" process was used to package and deploy everything needed:

![8XeY6Pug.jpg-large](/content/images/2019/12/8XeY6Pug.jpg-large.jpeg)

My wishlist now is to:

* Add "faasd" a controller which starts faas-containerd, the OpenFaaS gateway, and Prometheus to give a fully-functional OpenFaaS setup
* Move from [netns](https://github.com/genuinetools/netns) to using [CNI](https://kubernetes.io/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/), perhaps with [containerd/go-cni](https://github.com/containerd/go-cni)
* Find a way to make the functions run as daemons, or long-running
* Benchmark scenarios like cold-start and raw performance vs a single-node k3s cluster
* Benchmark total memory usage vs single-node k3s
* Ship official builds on GitHub releases and Docker Hub

Stretch goals are:
* To explore inter-service communication - i.e. so that Prometheus can scrape the OpenFaaS gateway
* Service discovery/look-up by name from container to container

### Contribute

I'm looking for contributors who can help me with code contributions. It turns out that low-level systems programming with containers is not well documented, but it can be learned through experimentation, which is what I've done here.

If you can help with features, improvements or testing, then please [join OpenFaaS Slack](https://slack.openfaas.io/).

### Similar projects

I wanted to highlight a few similar projects for lightweight multi-node clustering. These are alternatives to Kubernetes, but you may not want to move prod there any time soon.

* [boss](https://github.com/crosbymichael/boss) - run containers like a boss from [Michael Crosby - containerd maintainer](https://twitter.com/crosbymichael?lang=en) at Docker
* [stellar](https://github.com/ehazlett/stellar) - a re-think of container orchestration using containerd by [Evan Hazlett](https://twitter.com/ehazlett?lang=en), Docker

Both projects have some simularities and Michael/Evan are contributing to each other's projects. Guys, if you're listening, thank you for containerd :-)

### Tiny provider for a tiny devicxe

It even works on Raspberry Pi / armhf / ARM64 thanks to Golang's cross-compilation ability and the current state of dependent projects like OpenFaaS, Prometheus, NATS, and containerd itself. Given how light-weight this is, it may even open up the possibility of using the dozen of Raspberry Pi Zeros I have in my spare parts box.

<blockquote class="twitter-tweet" data-conversation="none"><p lang="en" dir="ltr">Nice! faas-containerd for <a href="https://twitter.com/openfaas?ref_src=twsrc%5Etfw">@openfaas</a> cross-compiles and runs fine on <a href="https://twitter.com/Raspberry_Pi?ref_src=twsrc%5Etfw">@Raspberry_Pi</a> 😱 <a href="https://twitter.com/hashtag/arm?src=hash&amp;ref_src=twsrc%5Etfw">#arm</a> <a href="https://twitter.com/hashtag/devops?src=hash&amp;ref_src=twsrc%5Etfw">#devops</a> <a href="https://twitter.com/hashtag/o6s?src=hash&amp;ref_src=twsrc%5Etfw">#o6s</a> <a href="https://twitter.com/hashtag/TeamServerless?src=hash&amp;ref_src=twsrc%5Etfw">#TeamServerless</a> <a href="https://twitter.com/containerd?ref_src=twsrc%5Etfw">@containerd</a> <a href="https://t.co/5mY6b6zuIa">pic.twitter.com/5mY6b6zuIa</a></p>&mdash; Alex Ellis (@alexellisuk) <a href="https://twitter.com/alexellisuk/status/1207402787828617216?ref_src=twsrc%5Etfw">December 18, 2019</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

### You may  also like

* [OpenFaaS 3rd birthday celebration recording](https://www.youtube.com/watch?v=wXnYx-wD4Zk&list=PLlIapFDp305CWYIO2t_lMTxkNRPU47rNU&index=2)
* [Multi-master HA Kubernetes in < 5 minutes](https://blog.alexellis.io/multi-master-ha-kubernetes-in-5-minutes/)
* [Kubernetes Homelab with Raspberry Pi and k3sup](https://blog.alexellis.io/raspberry-pi-homelab-with-k3sup/)