---
title: "Serverless Kubernetes home-lab with your Raspberry Pis"
slug: "serverless-kubernetes-on-raspberry-pi"
date: "2017-10-12T07:34:00Z"
author: "Alex Ellis"
meta_title: "Serverless Kubernetes home-lab with your Raspberry Pis"
meta_description: "Learn how to bootstrap Kubernetes on Raspbian, then build your very own Serverless Kubernetes homelab. Scale by adding more $35 Raspberry Pis."
tags:
  - "raspberrypi"
  - "Raspberry PI"
  - "docker"
  - "openfaas"
  - "swarm"
  - "serverless"
  - "arm"
---

This guide shows how to build your own Serverless Kubernetes cluster with Raspberry Pi and [OpenFaaS](https://www.openfaas.com/). This post is the third in a series on building a cheap and scalable Serverless Raspberry Pi cluster. Scale by adding more $35 Raspberry Pis.

> [OpenFaaS](https://www.openfaas.com/) is a serverless framework for Docker and Kubernetes that is easy to use, deploy and built with care by a growing community of hackers.

![RPis ready for serverless](https://pbs.twimg.com/media/DKGfQ7bWkAAkGb9.jpg)

This post was updated for 2021 with new install commands and multi-arch instructions. The original post was written for Raspberry Pi 3, but today I would recommend you use Raspberry Pi 4 which has more memory and faster I/O.

You'll probably also enjoy my more recent post: [Walk-through — install Kubernetes to your Raspberry Pi in 15 minutes](https://alexellisuk.medium.com/walk-through-install-kubernetes-to-your-raspberry-pi-in-15-minutes-84a8492dc95a)

## The series so far

If you're one of the many people who are new to this space, read the introduction of our first post to find out what Serverless is and what it can do for you.

### Part 1: Install K3s and k3sup ('k3sup)

[Walk-through — install Kubernetes to your Raspberry Pi in 15 minutes](https://alexellisuk.medium.com/walk-through-install-kubernetes-to-your-raspberry-pi-in-15-minutes-84a8492dc95a)

### Part 2: Monitoring

Part 2 focuses on monitoring the cluster for disk space, CPU usage and network I/O.

[Monitor your Raspberry Pi cluster with Prometheus
](https://blog.alexellis.io/prometheus-nodeexporter-rpi/)

### Part 3: OpenFaaS

In this part we build a Kubernetes cluster with Raspberry Pis and deploy OpenFaaS to test it. You'll have access to `kubectl` - so once you've finished the tutorial you can keep learning.

## Build your cluster

**The way it was meant to be**

This guide will show you how to install Kubernetes directly on top of Raspbian - the way it was meant to be. We won't need to flash any custom images or spend time learning how to configure a new OS.

Follow the step-by-step instructions over on my Gist:

* [Install your Kubernetes cluster (Gist)](https://gist.github.com/alexellis/fdbc90de7691a1b9edb545c17da2d975)

![Kube](https://coreos.com/assets/images/svg/logos/kubernetes.svg)

### Deploy OpenFaaS

Now deploy [OpenFaaS](https://github.com/openfaas/faas). OpenFaaS stands for Functions as a Service - a hot and emerging technology which lets you focus on writing small, reusable functions. Just put together a few lines of code, say what dependencies you need - then use our CLI to build it into a Docker image and deploy it to your cluster - OpenFaaS will do the rest.

You then get full metrics made available through Prometheus and this data is used by the cluster to auto-scale your function as demand increases.

Watch my OpenFaaS introduction and demos from Cloud Native London meetup in HD on Vimeo: [FaaS and Furious - 0 to Serverless in 60 seconds, anywhere](https://skillsmatter.com/skillscasts/10813-faas-and-furious-0-to-serverless-in-60-seconds-anywhere).  

Let's clone the GitHub repository and use `kubectl` to deploy. A Helm chart is also available in the repository for if you want to deploy OpenFaaS to a cloud or your laptop.

Use the Open Source Kubernetes marketplace called `arkade`:

```
$ curl -sLS https://dl.get-arkade.dev | sudo sh

arkade install openfaas
```

The Kubernetes controller for OpenFaaS is called faas-netes.

You'll get instructions on how to connect and can get it back at any time by typing in:

```bash
arkade info openfaas
```

Now get the IP address of your master node in the cluster (i.e. 192.168.0.100) and open up the FaaS UI in a web-browser:

http://192.168.0.100:31112/

> We're using the NodePort concept in Kubernetes, but you can add an IngressController and a software load balancer such as Nginx or Traefik if you want to use a privileged port like 80.

See also: [Expose your local OpenFaaS functions to the Internet](https://inlets.dev/blog/2020/10/15/openfaas-public-endpoints.html)

### Try the OpenFaaS CLI

You can get the CLI for OpenFaaS by typing in:

```
$ curl -SL https://cli.openfaas.com/ | sudo sh

armv7l
Getting package https://github.com/alexellis/faas-cli/releases/download/0.4.14/faas-cli-armhf
Attemping to move faas-cli to /usr/local/bin
New version of faas-cli installed to /usr/local/bin
```

> We build the CLI for Windows, Linux, Linux ARM and MacOS.

You can get help from the CLI at any time or check its version with:

```sh
$ faas-cli --help
$ faas-cli <command> --help
$ faas-cli version
```

Now you can go ahead and create your first function in Python:

> Note we need to specify `python-armhf` rather than just `python`. That's because ARM needs its own templates.

```
$ faas-cli new --lang python-armhf http-ping

Folder: http-ping created.
Function created in folder: http-ping
Stack file written: http-ping.yml
```

This will create an empty hello-world style function. Let's check it out.

You'll see that the CLI created three files:

```
http-ping.yml
http-ping/handler.py
http-ping/requirements.txt
```

Edit http-ping.yml and replace `image: http-ping` with your Docker Hub account like: `image: alexellis2/http-ping`.

Since we are on Kubernetes we also need to edit the gateway port from `gateway: http://localhost:8080` to `gateway: http://localhost:31112`.

Now let's build, deploy and invoke the function:

```
$ faas-cli publish -f http-ping.yml --platforms linux/arm/v7
```

The first time you run this we'll download some Docker images, but for each subsequent build it will use a cache. The publish command is also going to upload the function's image to the Docker Hub, but if you have a local registry that may be faster.

arkade can also install a local registry, find out how here:

* [Get a TLS-enabled Docker registry in 5 minutes
](https://blog.alexellis.io/get-a-tls-enabled-docker-registry-in-5-minutes/)

```bash
$ faas-cli deploy -f http-ping.yml
```

Important note: some Linux distros have IPv6 configuration in the /etc/hosts file that causes deploying to a gateway at "localhost" to hang. The fix is to edit your YAML file or to pass the flag `--gateway http://127.0.0.1:31112`.

```bash
$ faas-cli deploy -f http-ping.yml
Deploying: http-ping.
Deployed.
202 Accepted
URL: http://127.0.0.1:31112/function/http-ping
```

Or if localhost is hanging due to the IPv6 alias:

```
$ faas-cli deploy -f http-ping.yml --gateway http://127.0.0.1:31112
```

The function will be downloaded by Kubernetes and deployed on one of your nodes (Raspberry Pis).

> This could take a couple of minutes the first time since the Raspberry Pi's network and I/O interfaces are slower than regular PCs.

Now you can invoke the function via the UI or the CLI.

* Invoke the function:

Here we can pipe in any output from another CLI command:

```
$ echo -n "Hi Kubernetes!" | faas-cli invoke http-ping -f http-ping.yml
Hi Kubernetes!
```

Or type in freestyle:

```
$ faas-cli invoke http-ping -f http-ping.yml
Reading from STDIN - hit (Control + D) to stop.
I'm writing
the tutorial
now
```

* List the functions and the invocation count:

```
$ faas-cli list -f http-ping.yml
Function                        Invocations     Replicas   
http-ping                       2               1 
```

We see the replica count is set to 1 meaning there is only one container mapped to this function (more are added by OpenFaaS if we start to generate high load).

The invocation count is now 2 which is updated live from Prometheus metrics.

### Go deeper

Here are some ways you can support our work:

**Star** our GitHub repository for [OpenFaaS and show support](https://github.com/openfaas/faas) for the work we do.

**Keep learning**

Kubernetes is easy to learn but hard to master, so start today with my blog series: 

* [Learn Kubernetes by Alex Ellis](https://blog.alexellis.io/tag/learn-k8s/)

Compare and contrast the key differences between Docker Swarm and Kubernetes in my recent analysis:

* [What you need to know: Kubernetes and Swarm](https://blog.alexellis.io/you-need-to-know-kubernetes-and-swarm/)

**Share with your network**

We'd love to see what you build with [OpenFaaS](https://github.com/openfaas/faas) and your new Kubernetes home-lab. Share and Tweet to [@openfaas](https://twitter.com/openfaas) or [@alexellisuk](https://twitter.com/alexellisuk).

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Build your own Serverless home-lab with Kubernetes and Raspbian <a href="https://twitter.com/kubernetesio?ref_src=twsrc%5Etfw">@kubernetesio</a> <a href="https://twitter.com/Raspberry_Pi?ref_src=twsrc%5Etfw">@Raspberry_Pi</a> <a href="https://twitter.com/hashtag/rpiweekly?src=hash&amp;ref_src=twsrc%5Etfw">#rpiweekly</a> <a href="https://t.co/ytDMU92wWj">https://t.co/ytDMU92wWj</a> <a href="https://t.co/SYWKWaXa6v">pic.twitter.com/SYWKWaXa6v</a></p>&mdash; Alex Ellis (@alexellisuk) <a href="https://twitter.com/alexellisuk/status/918400378147917824?ref_src=twsrc%5Etfw">October 12, 2017</a></blockquote> <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>