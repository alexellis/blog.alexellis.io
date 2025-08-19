---
title: "The Need for A Cloud Native Tunnel"
slug: "the-need-for-a-cloud-native-tunnel"
date: "2020-04-01T14:56:36Z"
author: "Alex Ellis"
meta_title: "The Need for A Cloud Native Tunnel"
meta_description: "The network was always the problem. Today even medical firms struggle to connect radiography equipment to the cloud. Find out why we need a new tunnel."
feature_image: "/content/images/2020/04/architecture-bridge.jpg"
tags:
  - "tunnels"
  - "inlets-operator"
  - "inlets pro"
  - "kubernetes"
  - "inlets"
  - "cloud native"
---

Today I spoke at at the (Virtual) [Cloud Native Rejekts conference](https://virtual.rejekts.io/) on [The Need for A Cloud Native Tunnel](https://cfp.cloud-native.rejekts.io/virtual-rejekts-2020/talk/ZJG8CL/). In this post I'll introduce the talk, the slides, and give some links for how you can get started with exploring inlets.

<img src="https://github.com/inlets/inlets/raw/master/docs/inlets-logo-sm.png" width="200" alt="Inlets logo">

In my talk I cover how the network has always been the problem, even as far back as when I was a teenager at school contenting with HTTP proxies, to the present day where medical companies contend to link to radiography machinary in remote hospital sites to obtain patient data.

One of the main challenges teams have is connecting a service on a private network to a public one, and other variations of this scenario. The talk covers the options for bridging networks and other tunnel solutions compared to inlets and why customers and the community are now picking Cloud Native.

## The slides

<iframe src="//www.slideshare.net/slideshow/embed_code/key/zLys91X0VCzYvW" width="595" height="485" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:1px solid #CCC; border-width:1px; margin-bottom:5px; max-width: 100%;" allowfullscreen> </iframe> <div style="margin-bottom:5px"> <strong> <a href="//www.slideshare.net/AlexEllis11/the-need-for-a-cloud-native-tunnel" title="The Need For A Cloud Native Tunnel" target="_blank">The Need For A Cloud Native Tunnel</a> </strong> from <strong><a href="https://www.slideshare.net/AlexEllis11" target="_blank">Alex Ellis</a></strong> </div>

You can [view the abstract here](https://cfp.cloud-native.rejekts.io/virtual-rejekts-2020/talk/ZJG8CL/).

We had some Tweets during the call, but if you follow me on [Twitter @alexellisuk](https://twitter.com/alexellisuk/) you can get the recording as soon as it's ready.

For the source code for the demo with the [Pimoroni Unicorn LED board](https://shop.pimoroni.com/products/unicorn-hat), see: [unicorn_server.py](https://gist.github.com/alexellis/deb5577b078022888274af27b3a0c70c)

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">You&#39;ll have a chance to trigger this LED panel from <a href="https://twitter.com/pimoroni?ref_src=twsrc%5Etfw">@pimoroni</a> live during my talk on <a href="https://twitter.com/inletsdev?ref_src=twsrc%5Etfw">@inletsdev</a> at <a href="https://twitter.com/rejektsio?ref_src=twsrc%5Etfw">@rejektsio</a> today - see my pinned tweet. <a href="https://t.co/Zgo4L7uAuc">pic.twitter.com/Zgo4L7uAuc</a></p>&mdash; Alex Ellis (@alexellisuk) <a href="https://twitter.com/alexellisuk/status/1245349052247691264?ref_src=twsrc%5Etfw">April 1, 2020</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Great session <a href="https://twitter.com/alexellisuk?ref_src=twsrc%5Etfw">@alexellisuk</a> <a href="https://twitter.com/rejektsio?ref_src=twsrc%5Etfw">@rejektsio</a> <a href="https://twitter.com/hashtag/VirtualRejekts?src=hash&amp;ref_src=twsrc%5Etfw">#VirtualRejekts</a> <a href="https://t.co/spzPI2bTMY">pic.twitter.com/spzPI2bTMY</a></p>&mdash; Iván Camargo (@ivanrcamargo) <a href="https://twitter.com/ivanrcamargo/status/1245392712624492545?ref_src=twsrc%5Etfw">April 1, 2020</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

The video is now live as part of the live-stream:

View now: [Cloud Native Rejekts recording at: 9:32:26](https://youtu.be/cZEcdTOwV-A?t=34346)

## inlets tooling

Let's cover the two versions of inlets which are available, how they work together and what automation exists to make things easier for you.

There are two proxies:

* inlets OSS - HTTP / L7 proxy suitable for webpages, APIs and websockets, you manage your own link encryption
* inlets PRO - TCP / L4 proxy that can proxy any TCP traffic such as SSH, MongoDB, Redis, TLS, IngressControllers for LetsEncrypt and so forth. Inlets PRO also adds automatic link encryption to any traffic.

Each tunnel has two parts:

![Tunnel parts](https://docs.inlets.dev/images/conceptual.png)

* The server - known as the exit server or exit node. It faces a public network and exposes two ports - a control port for the client end i.e. 8080 or 8123, and a data port for your customers i.e. 80/443
* The client - which acts like a router or gateway to send incoming requests to some upstream server or to localhost on a given port

You can automate the creation and running of the client and server parts with:

* [inletsctl](https://github.com/inlets/inletsctl) - a simple CLI to provision cloud hosts, a bit like what you'd expect from Terraform, which also starts the server on the new host
* [inlets-operator](https://github.com/inlets/inlets-operator) - a Kubernetes Operator with its own `Tunnel` CRD that observes `LoadBalancer` services and creates a VM or remote host and then deploys a client Pod for the uplink.

You can also run the client and server binaries yourself.

### An example of what you can do

One of the leading tutorials shows [how to get an IP address for your IngressController in Kubernetes](https://docs.inlets.dev/#/get-started/quickstart-ingresscontroller-cert-manager?id=expose-your-ingresscontroller-and-get-tls-from-letsencrypt) with inlets PRO. This means you can then get a free TLS certificate from LetsEncrypt and expose all your APIs via Ingress definitions. It works great with Minikube, k3s, KinD and even a [Raspberry Pi, if that's your thing](https://medium.com/@alexellisuk/five-years-of-raspberry-pi-clusters-77e56e547875).

When you add that all together, you can do things like [Deploy a Docker registry in around 5 minutes](https://blog.alexellis.io/get-a-tls-enabled-docker-registry-in-5-minutes/) with authentication and link-level encryption.

## Links and getting started

To download any of the tools we've tallked about here, visit the documentation site at: [https://docs.inlets.dev/](https://docs.inlets.dev/)

Join the community through [OpenFaaS Slack and the #inlets channel](https://slack.openfaas.io/)

Buy your own inlets SWAG and support the project with [the OpenFaaS Ltd Store](https://store.openfaas.com/)

Feel free to contact me about how we can help your team gain confidence in adopting Kubernetes and migrating to the cloud: [alex@openfaas.com](mailto:alex@openfaas.com)