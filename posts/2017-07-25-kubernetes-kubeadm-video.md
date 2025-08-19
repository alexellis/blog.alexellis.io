---
title: "Video: Create a 2-node Kubernetes cluster"
slug: "kubernetes-kubeadm-video"
date: "2017-07-25T06:51:23Z"
author: "Alex Ellis"
meta_title: "Video: Create a 2-node Kubernetes cluster"
meta_description: "In the video we'll walk-through my tutorial on Kubernetes in 10 mins. At the end you'll have a working cluster across 2 nodes - so I'm ready when you are!"
tags:
  - "k8s"
  - "video"
  - "tutorial"
  - "learn-k8s"
---

In this video tutorial we walk-through my [latest blog on Kubernetes](https://blog.alexellis.io/kubernetes-in-10-minutes/) - we'll set up a cluster with the [kubeadm](https://kubernetes.io/docs/admin/kubeadm/) tool on two Ubuntu hosts running 16.04, we'll then use the join token to bring the worker into the cluster. Once we have a healthy 2-node cluster we'll deploy a micro-service to generate GUIDs, expose it as a Kubernetes service and scale it up.

> At the end you'll have a working multi-node cluster.

**Pre-requisites:**

You'll need two VMs or bare-metal machines running Ubuntu. The original blog post showed how to quickly provision two machines on [Equinix Metal](https://metal.equinix.com/) for bare-metal hosts.

As I am based in the UK I can also recommend [Civo](https://www.civo.com/?ref=0d595f) which gives very low latency for London and Europe. Rather than using bare-metal Civo are building a brand new offering based upon OpenStack with features and tweaks added by user suggestions and feedback. If you [join their KUBE100 program](https://www.civo.com/?ref=0d595f) you can get free credit each month and launch managed k3s clusters.

> Your cluster will be up and running in about 10 minutes - so this won't cost much on whichever servers you set it up on.

**The video**

The video starts with two hosts provisioned on [Civo](https://www.civo.com) with an Ubuntu 16.04 LTS image. I'm logged in with `tmux` so I can switch between the two VMs.

<iframe width="560" height="315" src="https://www.youtube.com/embed/6xJwQgDnMFE" frameborder="0" allowfullscreen></iframe>

You can follow along with the video or head over to the [original tutorial here](https://blog.alexellis.io/kubernetes-in-10-minutes/).

If you'd like more Docker and Kubernetes material you can subscribe on [YouTube](https://www.youtube.com/channel/UCJsK5Zbq0dyFZUBtMTHzxjQ), [Twitter @alexellisuk](https://twitter.com/alexellisuk).

My blog series:

* [Docker and Swarm](https://blog.alexellis.io/tag/docker)


* [Kubernetes series](https://blog.alexellis.io/tag/docker)