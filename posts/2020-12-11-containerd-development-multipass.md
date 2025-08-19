---
title: "containerd development with multipass"
slug: "containerd-development-multipass"
date: "2020-12-11T16:22:49Z"
author: "Alex Ellis"
meta_title: "containerd development with multipass"
meta_description: "As new contributors came on board, we needed a way for them to build code against containerd on a Mac or Windows computer. Learn how Multipass fit the bill."
tags:
  - "containerd"
  - "faasd"
  - "openfaas"
  - "go"
  - "golang"
---

About 18 months ago [I started a project](https://blog.alexellis.io/faas-containerd-serverless-without-kubernetes/) which developed directly against containerd. This presented a problem which I'd not really encountered before - [Docker](https://www.docker.com/) and [Kubernetes](https://kubernetes.io/) on my Mac were no longer enough, I needed a Linux environment.

To begin with I just used an old 2016 model Dell XPS which gave me everyting I needed, but when others started to contribute, they were using Macs and so we had a problem. [Multipass](https://multipass.run/) was the answer to our woes and we were pleasantly surprised by it and wondered why more people weren't using it every day.

I want to tell you a bit about our experience in the [OpenFaaS community](http://github.com/openfaas/) developing [faasd](https://github.com/openfaas/faasd) - a portable FaaS framework, just like OpenFaaS, but without the complexity and overheads of a Kubernetes cluster.

## What's containerd ever done for us?

Some time ago the original version of Docker was actually written in Python, and then morphed over time into a Go re-write. The Go version was seen as monolithic by some consumers, particularly the Kubernetes community.

> Docker did many things, and at one point clustering and multi-node orchestration was even added to that list (think Docker Swarm and Docker EE)

As the codebase was refactored two projects emmerged: containerd and runc.

* [runc](https://github.com/opencontainers/runc) was a tiny Go binary that had one job: run a container based upon a spec. runc was also the driver for the [OCI specification](https://opencontainers.org/)
* [containerd](https://github.com/containerd/containerd)'s job was to get things ready for runc - such as pulling images and defining specs

Docker then remained as a thiner layer on top of both of these tools to bring a user-friendly developer-experience, networking, high-level API and CLI.

Over time containerd has shifted into the lime-light and in Kubernetes 1.20, it will take over duties for running containers in Kubernetes clusters. Now not a lot changes, because containerd was always there along with runc, we just skip a few levels of indirection.

containerd doesn't provide networking out of the box, and that was one of the hardest challenges.

> Not because it's technically complex, but there was a severe lack of documentation.

[Container Network Initiative (CNI)](https://github.com/containernetworking/cni) filled a gap for us and enabled us to build a network between our containers.

When you squint at faasd, you see something that looks a lot like a single-node Kubernetes cluster, using the same projects you'd find on most nodes: containerd, runc and CNI.

## Why would you develop with containerd?

There were two main reasons for creating "faasd" - the first was that we were hearing from users that they didn't want to run an entire Kubernetes cluster just to run a handful of functions, APIS or webpages. The second was that I fancied doing some learning and low-level coding.

Whilst containerd has a socket available, and can be mounted or forwarded, it doesn't work as you would expect. The containerd client tries to run containers on the host it's executing on and just synchronises state with the containerd socket. I found that very confusing, but was reassured that is the way it was designed to work.

You can see our code which has developed into two main services shipped in a single binary.

* [faasd](https://github.com/openfaas/faasd/blob/master/cmd/up.go) - starts all the core services for OpenFaaS: the gateway, NATS, Prometheus and our queue worker. [A docker-compose file](https://github.com/openfaas/faasd/blob/master/docker-compose.yaml) is used to define versions of images, and the dependency graph for starting up services.
* [faasd-provider](https://github.com/openfaas/faasd/tree/master/pkg/provider) - a HTTP interface that performs invoke and CRUD for functions and secrets

Both are installed with systemd unit files, it was refreshing to lean on the host system for once, instead of using abstractions.

### The short-version

[multipass](https://multipass.run) is a [Canonical](https://canonical.com/) and its open source components and usage instructions are [available on GitHub](https://github.com/canonical/multipass).

> Multipass is a lightweight VM manager for Linux, Windows and macOS. It's designed for developers who want a fresh Ubuntu environment with a single command.
>  
> Since it supports metadata for cloud-init, you can simulate a small cloud deployment on your laptop or workstation.

On MacOS it is currently using hyperkit to run VMs, which is another thing we can thank Docker for building. On Windows and Linux it uses different virtualization technology, but has the same simple user-experience which means we get to write one tutorial and to be done with it. As a busy maintainer, I see that as a big win.

Here's how you get a VM launched with the latest version of Ubuntu Server:

```bash
multipass launch --name faasd
```

Shell into the VM:

```bash
multipass exec faasd /bin/bash
```

We then realised that multipass supported cloud-init, so morphed our README to the following:

```bash
curl -sSLO https://raw.githubusercontent.com/openfaas/faasd/master/cloud-config.txt
multipass launch --cloud-init cloud-config.txt  --name faasd
```

I had the pleasure of speaking to the engineering manager and PM for multipass on Zoom today and they told me you can even pass the cloud-init file as a URL, so our tutorial becomes even simpler:

```bash
multipass launch --cloud-init https://raw.githubusercontent.com/openfaas/faasd/master/cloud-config.txt  --name faasd
```

From there, you have a full Linux system with a working version of containerd and Container Network Initiative (CNI) plugins running, and most importantly faasd is up and running.

```bash
faas-cli list
faas-cli store deploy figlet
faas-cli invoke figlet <<< "faasd"
```

Whilst I've not used it yet, I'm told you can also mount folders from your base system to synchronise your GOPATH. So you could write code using VSCode and have the built-in terminal pane running "multipass exec /bin/bash" or an ssh session.

I recently wrote a post on [One last trip down memory lane with the Raspberry Pi Zero](https://blog.alexellis.io/memory-lane-raspberry-pi-zero/) where I tried to port faasd to a Raspberry Pi Zero. The Go build for faasd was taking so long that I gave up, opened multipass and cross-compiled it. That whole process was quicker than waiting for the poor little armv6 service to finish its work.


### multipass for Kubernetes

You can also use multipass to run other workloads, I tried to deploy Kubernetes with microk8s, but ran into some issues with the default limits.

First of all: there was not enough RAM alloacted, then there was not enough disk, finally there were not enough vCPUs. After working all that out I came up with the following:

```bash
multipass launch --name microk8s -m 8G -c 2 -d 80G
```

Now it's not that much of a surprise that we never ran into that issue, because faasd is designed to be ridicuously lean. It even runs on a Raspberry Pi 3 which only has 1GB of RAM.

## Wrapping up

> faasd and containerd are written in Go. Checkout my new book [Everday Go](https://gumroad.com/l/everyday-golang) for practical tips and hands-on examples.

multipass has been useful for us whenever we need to access a Linux VM from a Mac. It could even be used for running a Kubernetes cluster, but I would usually prefer to deploy Kubernetes in a Docker container using either [KinD](https://kind.sigs.k8s.io/) or [k3d](https://github.com/rancher/k3d) for the sheer speed and efficiency of it.

multipass is a much leaner alternative to tooling like VirtualBox and Vagrant. The team are looking for feedback and are already planning for a way to launch custom images. Think: `multipass launch openfaas` or `multipass launch gitlab` for instance.

> We see multipass being an important part of enabling collaboration with users from all-over the world, whether they use Linux, MacOS or Windows on their desktop.

Around 20 people have contributed to faasd directly, and many more indirectly. It worked very well for us and we believe that multipass deserves more attention.

Go and try it out, let them know what works for you and where it can be improved for your workflow.

> Users have already suggested using [qemu on MacOS](https://github.com/canonical/multipass/issues?q=is%3Aissue+is%3Aopen+qemu), and the new [Virtualization.Framework](https://developer.apple.com/documentation/virtualization) introduced in Big Sur could also have some impact on the future roadmap and M1 support.

* [multipass.run](https://multipass.run)

### What about faasd vs. OpenFaaS on Kubernetes?

faasd now fills a nice gap where Docker Swarm used to live in the OpenFaaS ecosystem. If you're working your way up to production with Kubernetes, or already have experience then you may benefit from a cluster and installing OpenFaaS to it.

If you're wanting to run a few functions, start small, keep costs down, then faasd may be a better fit. Managing and keeping up with Kubernetes versions can be its own challenge. So if you want to deploy code for a customer and barely give it another thought, then package faasd as a VM or cloud-init script and be done with it.

faasd can be run for 5-10 USD on a cloud VPS, or on your Raspberry Pi for free using [an inlets tunnel](https://docs.inlets.dev/) to get it a public IP address.