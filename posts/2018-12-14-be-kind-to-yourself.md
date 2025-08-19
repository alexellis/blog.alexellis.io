---
title: "Be KinD to yourself"
slug: "be-kind-to-yourself"
date: "2018-12-14T21:44:46Z"
author: "Alex Ellis"
meta_title: "Be KinD to yourself"
meta_description: "Alex walks us through the various options for local Kubernetes development and explores a new tool called kind which can be used for rapid testing."
feature_image: "/content/images/2018/12/wscc.jpg"
tags:
  - "open source"
  - "kubecon"
  - "kubernetes"
  - "kind"
---

It was the day before [KubeCon Seattle 2018](https://events.linuxfoundation.org/events/kubecon-cloudnativecon-north-america-2018/attend/) and we were all sitting in a huge conference hall spanning three rooms. There was barely room to move and then a series of lightning talks began including one from a friend of mine named [Marko Mudnić](https://twitter.com/xmudrii). Marko is a young engineer and student from Belgrade who has made a name for himself through his contributions to the container, Kubernetes and serverless community.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Lightning talk room is epic. <a href="https://twitter.com/CloudNativeFdn?ref_src=twsrc%5Etfw">@CloudNativeFdn</a> <a href="https://t.co/L1O51jG3js">pic.twitter.com/L1O51jG3js</a></p>&mdash; Alex Ellis @KubeCon (@alexellisuk) <a href="https://twitter.com/alexellisuk/status/1072289536397533190?ref_src=twsrc%5Etfw">December 11, 2018</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> 

Marko was introducing a new tool to us called "KinD" and said "kind" like "be kind to yourself". With `kind` you can provision a Kubernetes cluster in under a minute on any machine which supports Docker.

I had a very quick go with `kind` during the talk, but in this post we'll explore the tool in context and compare it to other options available for local Kubernetes development.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Pretty cool to get a K8s v1.12.2 cluster going on my Intel NUC in a few moments using KinD. <a href="https://t.co/LboaCwhvGz">pic.twitter.com/LboaCwhvGz</a></p>&mdash; Alex Ellis @KubeCon (@alexellisuk) <a href="https://twitter.com/alexellisuk/status/1072308999075307526?ref_src=twsrc%5Etfw">December 11, 2018</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> 

## Video introduction

<iframe width="560" height="315" src="https://www.youtube.com/embed/ZiJn7olAS1M" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Running Kubernetes locally

The name for `kind` comes from the underpinning tool `dind` or Docker in Docker. So `kind` actually means Kubernetes in Docker. Now I wrote about the various options for running Kubernetes in development early last year which are still valid today.

Let's do a quick recap. You can find the full article here: [First impressions: Docker for Mac with Kubernetes
](https://blog.alexellis.io/docker-for-mac-with-kubernetes/)

### VMs

The oldest, most flexible method to run K8s is to create a Linux VM and then to run that locally and to install the Kubernetes packages into it. It's time-consuming and the UX is not great.

### Minikube

As a variation of the "VMs" option you have Minikube which is an automated VM creation based upon "Docker Toolbox". On a Mac it's likely to use VirtualBox and can be picky about versions. It uses a lot of battery, is slow to start and has a separate Docker library to any other versions you have installed. I've had reasonably good reliability, but others [complain much](https://github.com/kubernetes/minikube/issues).

### Docker for Mac

In the last year Docker for Mac gained an option to switch into a Kubernetes mode which create a fully-compliant single-node Kubernetes cluster. The user-experience is much improved, but it takes a long time to install the first time and eats battery like there is no tomorrow. I'm sure the Docker team are on this, but if you don't believe me checkout [here](https://news.ycombinator.com/item?id=16084243) and [here](https://github.com/docker/for-mac/issues/3065). DfM does have the ability to leverage your local Docker library which is a good step forward.

### Remote cluster in cloud

One of the options I don't remember covering, but which is becoming ever-more popular for myself is the "remote cluster in cloud" option. When I want to work from my laptop without sacrificing its battery then I'll set up a 1-node GKE cluster or a cluster with [DigitalOcean](https://www.digitalocean.com) and then set a `KUBECONFIG` environmental variable.

> See also: read my [first look at DigitalOcean's Kubernetes Engine](https://blog.alexellis.io/digitalocean-kubernetes-engine/).

Your local images are not shared or available within the cluster, but you can push them remote and if you have a good Internet connection and build small images this can work well. If cloud K8s runs too expensive for you then a local machine on your LAN such as an Intel NUC or an old Xeon server works well.

### `kind`

Let's get to `kind`. This tool can provision a cluster in under a minute and is aimed at doing CI / integration tests as part of your build pipeline. It can however be useful to get Kubernetes quickly to validate something such as a helm chart. The CLI is great, but accessing the clusters which have been created involves copying Kubernetes config files around and using exposed ports on the local machine. As for battery I'm not sure if this is improved or not.

Let's try it out with OpenFaaS using `arkade`, arkade will automate everything from installing helm3 to adding the OpenFaaS helm chart repo to installing the software.

First install KinD and create a cluster

* Install `kind`

[Download a release binary for KinD](https://github.com/kubernetes-sigs/kind/releases)

> Note: this changed since the original post, where building the code with Go was required. 
 
* Create a cluster

```
$ kind create cluster --name blog
Creating cluster 'kind-blog' ...
 ✓ Ensuring node image (kindest/node:v1.12.2) 🖼 
 ✓ [kind-blog-control-plane] Creating node container 📦 
 ✓ [kind-blog-control-plane] Fixing mounts 🗻 
 ✓ [kind-blog-control-plane] Starting systemd 🖥
 ✓ [kind-blog-control-plane] Waiting for docker to be ready 🐋 
 ✓ [kind-blog-control-plane] Starting Kubernetes (this may take a minute) ☸ 
Cluster creation complete. You can now use the cluster with:

export KUBECONFIG="$(kind get kubeconfig-path --name="blog")"
kubectl cluster-info
```

* Switch context

This is really important. Don't run any commands with `kubectl` unless you are pointing at the new cluster. This counts for opening a second Terminal window, too. You may risk overwriting or deleting resources if you're pointing at another cluster already.

```
export KUBECONFIG="$(kind get kubeconfig-path --name="blog")"
```

* Install OpenFaaS with `arkade`

```bash
curl -sLS https://dl.get-arkade.dev | sudo sh

arkade install openfaas
```

Follow the output from the installation step, if in doubt run `arkade info openfaas` to get back the instructions.

* Access the OpenFaaS gateway

The easiest way to access the gateway or any other service is to use `kubectl port-forward` on a amchine which has the Kubernetes YAML. If that machine is remote then you can do some SSH tunneling or similar.

```bash
$ kubectl port-forward -n openfaas svc/gateway 8080:8080 &
[1] 3348
Forwarding from 127.0.0.1:8080 -> 8080
Forwarding from [::1]:8080 -> 8080
```

Now let's try a function that can check when an SSL cert expires:

```
$ faas-cli store deploy certinfo -g http://127.0.0.1:8080
Deployed. 202 Accepted.
URL: http://127.0.0.1:8080/function/certinfo

curl -d www.openfaas.com http://127.0.0.1:8080/function/certinfo
Handling connection for 8080
Host 185.199.110.153
Port 443
Issuer Let's Encrypt Authority X3
CommonName www.openfaas.com
NotBefore 2018-11-21 12:49:36 +0000 UTC
NotAfter 2019-02-19 12:49:36 +0000 UTC
SANs [www.openfaas.com]
TimeRemaining 2 months from now

$ faas-cli list -v -g http://127.0.0.1:8080
Function                      	Invocations    	Replicas
certinfo                      	3              	1    
```

* Clean up

You can now delete the cluster with `kind delete cluster --name blog`.

## Wrapping up

There are a number of ways to run Kubernetes for development and I think `kind` represents a promising alternative for automation, testing and potentially as a good replacement for a local development environment.

For more on Kubernetes:

* Learn how Serverless Kubernetes works with OpenFaaS [Introducing the OpenFaaS Operator](https://www.openfaas.com/blog/kubernetes-operator-crd/)
* My detailed article on Kubernetes options for development: [https://blog.alexellis.io/docker-for-mac-with-kubernetes/](https://blog.alexellis.io/docker-for-mac-with-kubernetes/)
* Build a multi-node cluster with KVM and VMs on Linux: [Get started with KVM & Kubernetes
](https://blog.alexellis.io/kvm-kubernetes-primer/)