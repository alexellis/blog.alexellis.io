---
title: "Create a 3-node k3s cluster with k3sup & DigitalOcean"
slug: "create-a-3-node-k3s-cluster-with-k3sup-digitalocean"
date: "2019-08-29T09:19:17Z"
author: "Alex Ellis"
meta_title: "Create a 3-node k3s cluster with k3sup & DigitalOcean"
meta_description: "Learn how to build a 3-node Kubernetes cluster with Rancher's k3s project and k3sup (ketchup), which uses ssh to make the process simple."
feature_image: "/content/images/2019/08/christopher-flowers-zOdR2lfDyzA-unsplash.jpg"
tags:
  - "k3s"
  - "kubernetes"
  - "cloud native"
  - "digitalocean"
---

In this tutorial I want to show you how to build a 3-node Kubernetes cluster with Rancher's k3s project and k3sup (ketchup), which uses `ssh` to make the whole process quick and painless.

## Introduction

At time of writing, k3s is one of the most popular installable Kubernetes distributions on the [CNCF Landscape](https://landscape.cncf.io/category=certified-kubernetes-distribution,certified-kubernetes-installer&format=card-mode&sort=stars)

![CNCF Landscape](/content/images/2019/08/Screenshot-2019-08-29-at-10.49.02.png)

I am a fan of managed Kubernetes services, but I am also a fan of choice and there is no managed Kubernetes service for k3s on DigitalOcean at this time.

> Now you may ask me why we need [k3s](https://k3s.io), if [DigitalOcean](https://www.digitalocean.com) has its own Kubernetes service in GA. k3s takes a unique approach of stripping-down Kubernetes to its bare essentials and makes it perfect for running in edge locations. Given that less resources are needed, the spend may be lower, and a LoadBalancer (10-15 USD) is not required because of the way k3s exposes traffic through HostPorts.

The [k3sup community](https://k3sup.dev) has been building up a series of tutorials for various developer clouds and VM platforms. DigitalOcean is a great place to test both k3s and those tutorials given its fast launch time and simple user experience.

> Still not convinced that saving 10-15 USD / month is worth it? Read on, or feel free to try [k3sup](https://k3sup.dev) on another cloud using one of the other community blog posts.

## Provision the VMs

Set up three VMs using the DigitalOcean UI (control-panel).

![cpu](/content/images/2019/08/cpu.png)

I decided to get a balance of 2vCPU and 2GB RAM. You can pick whatever works for you.

Configure your SSH key, so that k3sup can use it later on to orchestrate the nodes:

![private-networking](/content/images/2019/08/private-networking.png)

I've also added private networking.

You can save a tag in this last step for easier management, or just use names that have a prefix:

![Save a tag](/content/images/2019/08/Screenshot-2019-08-29-at-09.28.08.png)


## Setup the DigitalOcean CLI

In my experience, it's easier to create your droplets using the UI and then to manage them through the CLI.

* Install [doctl](https://github.com/digitalocean/doctl)

* Create an API key in the UI with Read and Write access

* Authenticate the CLI - `doctl auth init`

List your VMs:

```sh
doctl compute droplet ls --format Name,PublicIPv4,Status

Name                     Public IPv4      Status
k3s-1                    159.65.25.233    active
k3s-2                    159.65.22.30     active
k3s-3                    159.65.29.53     active
```

## Install `k3sup`

Let's now install `k3sup` (ketchup), which has one job, to bring k3s up.

```
curl -sLSf https://get.k3sup.dev | sh
sudo install -m k3sup /usr/local/bin/
```

If you're a Windows user, then checkout the [Releases page on GitHub](https://k3sup.dev).

## Create the cluster

Here's a conceptual diagram of what we will be doing:

![](https://github.com/alexellis/k3sup/raw/master/docs/k3sup-cloud.png)

`k3sup` uses `ssh` to run commands on the remote machines, which is a similar approach to automation tooling such as [Ansible](https://www.ansible.com).

### Create the server

In Kubernetes terminology, the server is often called the master. The master node is prevented from running workloads and then an additional command is needed to "untaint" the master. k3s is designed for the edge where you may only have a single server, it can run workloads out of the box.

```sh
export SERVER_IP=159.65.25.233

k3sup install --ip $SERVER_IP --user root --local-path=./kubeconfig
```

You can alter the `--user` flag if needed.

This will save a file to the current working directory.

k3s is so fast to start up, that it may be ready for use after the command has completed.

* Test it out:

```sh
export KUBECONFIG=`pwd`/kubeconfig

kubectl get node -o wide
NAME    STATUS   ROLES    AGE   VERSION         INTERNAL-IP     EXTERNAL-IP   OS-IMAGE             KERNEL-VERSION      CONTAINER-RUNTIME
k3s-1   Ready    master   22s   v1.14.6-k3s.1   159.65.25.233   <none>        Ubuntu 18.04.3 LTS   4.15.0-58-generic   containerd://1.2.7-k3s1
```

* Run a test pod:

This pod ships with `curl` pre-installed.

```
kubectl run -t -i curl --image alexellis/curl:0.1.1 -- /bin/sh

~ $ 
~ $ curl 'https://api6.ipify.org?format=json' ; echo
{"ip":"159.65.25.233"}
```

* Type `exit`

* Delete the pod:

```
kubectl delete deploy/curl
```

If you ever lose your kubeconfig file, then you can run `k3sup install --skip-install` to simply copy it back to your computer again.

### Extend the cluster

You could stop here and run your workloads all on a single node, but adding additional hosts will expand our available capacity.

```sh
k3s-2                    159.65.22.30  
k3s-3                    159.65.29.53  
```

Run the following:

```sh
export SERVER_IP=159.65.25.233

# k3s-2
export IP=159.65.22.30
k3sup join --ip $IP --server-ip $SERVER_IP --user root

#k3s-3
export IP=159.65.29.53
k3sup join --ip $IP --server-ip $SERVER_IP --user root
```

### Check the cluster

You'll now find 3 nodes listed as "Ready"

```sh
kubectl get node

NAME    STATUS   ROLES    AGE     VERSION
k3s-1   Ready    master   6m57s   v1.14.6-k3s.1
k3s-2   Ready    worker   55s     v1.14.6-k3s.1
k3s-3   Ready    worker   7s      v1.14.6-k3s.1
```

You can find out what workloads are running on each host and how they are doing for memory/CPU/disk pressure by running: 

```sh
kubectl describe node/k3s-1
```

### Secure the cluster

Familiarise yourself with how to secure k3s for the public internet by reading the recommendations in the official documentation: [Open Ports and Network Security](https://rancher.com/docs/k3s/latest/en/configuration/#open-ports-network-security)

## Wrapping up

We now have a cluster with 3 nodes and a collective capacity of 6vCPUs and 6GB RAM. You can deploy any helm chart to the cluster and start running your workloads there. K3s comes with an IngressController called [Traefik](https://traefik.io), and from my experience it's easier to go with that than to try to install your favourite.

The `k3sup` tool works with any VM, cloud or even bare-metal like Raspberry Pi. Try one of the [community tutorials](https://k3sup.dev/), or write one for your favourite VPS.

If you liked k3sup, and want to support my work, become a [GitHub Sponsor](https://github.com/sponsors/alexellis) or [follow me on Twitter](https://twitter.com/alexellisuk).

### Take it further

In a follow-up post, I'll show you how to set up your own domain-name and how to add TLS to a HTTP API.

Here are some of my recommended charts and Kubernetes software:

Essentials:

* [openfaas](https://github.com/openfaas/faas-netes) - a next-generation FaaS / PaaS making it easy to deploy applications without having to learn all of the ins and outs of Kubernetes
* [cert-manager](https://github.com/jetstack/cert-manager) - protect your services with HTTPS/TLS
* [postgres](https://github.com/helm/charts/tree/master/stable/postgresql) - "PostgreSQL: The world's most advanced open source database"

Nice to have / advanced:

* [inlets](https://inlets.dev) - expose your local clusters and servers via the public IP addresses of your Kubernetes cluster, a bit like an Open Source version of ngrok
* [weave scope](https://github.com/helm/charts/tree/master/stable/weave-scope) - explore your network traffic and resources visually
* [jenkins](https://jenkins.io) - open source CI/CD tooling for building software releases - also useful for creating Docker images
* [longhorn](https://github.com/longhorn/longhorn) - add PersistentVolume / Block storage support to k3s
version of ngrok.

You can install most of them using the Open Source Kubernetes marketplace, [arkade](https://get-arkade.dev).

For example:

```bash
arkade install jenkins
arkade install postgres
arkade install openfaas
```

You'll get instructions on how to use each app after the installation, and can get the information back at any time with `arkade info APP`.