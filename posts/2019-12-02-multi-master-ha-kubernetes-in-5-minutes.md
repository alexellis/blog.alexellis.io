---
title: "Multi-master HA Kubernetes in < 5 minutes"
slug: "multi-master-ha-kubernetes-in-5-minutes"
date: "2019-12-02T21:01:36Z"
author: "Alex Ellis"
meta_title: "Multi-master HA Kubernetes in < 5 minutes"
meta_description: "This is a short tutorial on how to setup multi-master HA Kubernetes in < 5 minutes with k3s. This must be the easiest way out there to get up and running."
tags:
  - "k3s"
  - "labs"
  - "cloud native"
  - "kubernetes"
  - "k3sup"
  - "workshop"
---

This is a short tutorial on how to setup multi-master HA Kubernetes in < 5 minutes. I think it has to be one of the easiest ways out there to get up and running.

Up until recently, the primary way to create multi-master Kubernetes clusters would have been through using `kubeadm`: [Creating Highly Available clusters with kubeadm](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/high-availability/). kubeadm is used by popular tools like [kops](https://github.com/kubernetes/kops) as an alternative to managed Kubernetes.

![k3sup](https://github.com/alexellis/k3sup/raw/master/docs/k3sup-cloud.png)

Today we'll be using k3s from [Rancher Labs](https://rancher.com) and [`k3sup`](https://k3sup.dev/) to bootstrap. The 1.0 release of k3s ships with a fully conformant version of [Kubernetes 1.16](https://kubernetes.io/blog/2019/09/18/kubernetes-1-16-release-announcement/).

So why may k3s be preferrable to kubeadm? It only uses 300MB RAM for a server and 50MB of RAM for an agent node. This makes it ideal for edge, but also great for local development or use for production workloads.

## Pre-reqs

You'll need some VMs somewhere. You can get these however you like - from public cloud, via Vagrant, KVM, VirtualBox, or whatever you prefer.

> Note: until these two upstream issues are fixed in k3s: [#1155](https://github.com/rancher/k3s/issues/1155) and [#1115](https://github.com/rancher/k3s/issues/1115), you won't be able to use a Raspberry Pi for a multi-master setup. A single-master works fine and is more than suitable for a homelab.

I decided to create three 10 USD/mo VMs on DigitalOcean in the London region with the `18.04.3 (LTS) x64` image. Each VM comes with 2GB RAM and 1 vCPU.

Make sure that you click `SSH keys` and add your SSH key during this step. This is because `k3sup` will automate the Kubernetes installation using `ssh`.

* Create three VMS by clicking the `+` symbol.

![create-three](/content/images/2019/12/create-three.png)

* Get k3sup now:

k3sup is a tool I built to automate the creation of k3s clusters and to install apps with helm.

```sh
curl -sSLf https://k3sup.dev | sudo sh

New version of k3sup installed to /usr/local/bin
 _    _____                 
| | _|___ / ___ _   _ _ __  
| |/ / |_ \/ __| | | | '_ \ 
|   < ___) \__ \ |_| | |_) |
|_|\_\____/|___/\__,_| .__/ 
                     |_|    
Version: 0.6.7
Git Commit: 4de4848a7542d41e2dc828b2a6b2533ade1a71e1
```

You'll need at least version: 0.6.7.

> Note: you can also run this without `sudo` and then move over the binary to `/usr/local/bin/` afterwards.

## Go!

Right now it's time to actually set up Kubernetes.

Get the IPs of your nodes.

Now create a bash script `bootstrap.sh` as follows:

```sh
#!/bin/bash
set -e

export NODE_1=""
export NODE_2=""
export NODE_3=""
export USER=root

# The first server starts the cluster
k3sup install \
  --cluster \
  --user $USER \
  --ip $NODE_1

# The second node joins
k3sup join \
  --server \
  --ip $NODE_2 \
  --user $USER \
  --server-user $USER \
  --server-ip $NODE_1

# The third node joins
k3sup join \
  --server \
  --ip $NODE_3 \
  --user $USER \
  --server-user $USER \
  --server-ip $NODE_1
```

Then `chmod +x bootstrap.sh` and run the script:

```
./bootstrap.sh
```

Your `kubeconfig` file will be saved to your local directory, but you can customise this. Check `k3sup install --help` for more options.

Check your nodes are up and running:

```sh
export KUBECONFIG=`pwd`/kubeconfig

kubectl get node

NAME            STATUS   ROLES    AGE   VERSION
k3s-server-02   Ready    master   47s   v1.16.3-k3s.2
k3s-server-01   Ready    master   64s   v1.16.3-k3s.2
k3s-server-03   Ready    master   14s   v1.16.3-k3s.2
```

With k3s the masters are also able to run workloads. You can now install a helm chart using: `k3sup app install`. Run `k3sup app install` to find out what you want to try.

```h
k3sup app install --help
Install a Kubernetes app

Usage:
  k3sup app install [flags]
  k3sup app install [command]

Examples:
  k3sup app install [APP]
  k3sup app install openfaas --help
  k3sup app install inlets-operator --token-file $HOME/do
  k3sup app install --help

Available Commands:
  cert-manager     Install cert-manager
  chart            Install the specified helm chart
  inlets-operator  Install inlets-operator
  linkerd          Install linkerd
  metrics-server   Install metrics-server
  nginx-ingress    Install nginx-ingress
  openfaas         Install openfaas
  openfaas-ingress Install openfaas ingress with TLS
  tiller           Install tiller

Flags:
  -h, --help                help for install
      --kubeconfig string   Local path for your kubeconfig file (default "kubeconfig")

Use "k3sup app install [command] --help" for more information about a command.
```

This is how `nginx-ingress` would work if we wanted to use host-mode networking, where each node in the cluster serves traffic.

```sh
k3sup app install nginx-ingress --host-mode
```

Then try `curl` against the hosts:

```sh
export NODE_1=""
curl -i $NODE_1

<html>
<head><title>404 Not Found</title></head>
<body>
<center><h1>404 Not Found</h1></center>
<hr><center>openresty/1.15.8.2</center>
</body>
</html>
```

You can see the Nginx IngressController ready and waiting to serve requests. You just need to setup an Ingress record and you're all set.

Try out the other apps or feel free to suggest one if you think it's missing.

## Wrapping up

We created a 3-node HA Kubernetes cluster and it should have taken well under 5 minutes to complete. I'm excited by how easy this is compared to several years ago. Within a short period of time this should also be workable for your Raspberry Pi cluster too.

If k3s is new to you, I'd recommend watching Darren Shepherd's KubeCon session. It will help demystify the project and hopefully bust any myths that you may have heard about it: [K3s Under the Hood: Building a Product-grade Lightweight Kubernetes Distro](https://www.youtube.com/watch?v=-HchRyqNtkU)

Go and checkout [k3sup](https://k3sup.dev/) on GitHub - it can do far more than just install Kubernetes, it can also install apps from helm charts making it even easier for new users to get started.

Tutorials:

* [Kubernetes Homelab with Raspberry Pi and k3sup](https://blog.alexellis.io/raspberry-pi-homelab-with-k3sup/) - my hands-on tutorial and video for k3s
* [Kubernetes on bare-metal in 10 minutes](https://blog.alexellis.io/kubernetes-in-10-minutes/) - an in-depth tutorial using `kubeadm` for a single master setup using bare metal compute

Tooling:

* [k3s](https://k3s.io/) - k3s from Rancher
* [k3sup](https://k3sup.dev/) - the tool we used today

You may also like the [KubeWeekly email newsletter](https://kubeweekly.io) curated by the CNCF.