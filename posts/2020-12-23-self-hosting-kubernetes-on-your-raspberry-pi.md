---
title: "Self-hosting Kubernetes on your Raspberry Pi"
slug: "self-hosting-kubernetes-on-your-raspberry-pi"
date: "2020-12-23T12:00:13Z"
author: "Alex Ellis"
meta_title: "Self-hosting Kubernetes on your Raspberry Pi"
meta_description: "Your complete guide to self-hosting applications Kubernetes on Raspberry Pi including: hardware, HA, Ingress, storage and Operating Systems."
feature_image: "/content/images/2020/12/rpi-background.jpg"
tags:
  - "k3s"
  - "kubernetes"
  - "self-hosting"
  - "inlets"
  - "linux"
---

The aim of this post is to show you how to build a Kubernetes cluster with Raspberry Pi 4s for self-hosting APIs, websites and functions so that you can expose them on the Internet and serve traffic to users. Use it to evaluate your current setup, or to plan a new build including: hardware options, HA, Ingress, storage and Operating System choices.

We'll start by addressing the usual questions, before going on to explore a number of topics in detail. These are my preferences built-up after [building clusters on Raspberry Pi for 5 years](https://www.raspberrypi.org/blog/five-years-of-raspberry-pi-clusters/). I'd also like to learn from you, so feel free to tweet to me [@alexellisuk](https://twitter.com/alexellisuk).

**Why self host?**

The only valid reason here is: because you want to. And if the idea of self-hosting something turns you off, then stop reading now and post a derisive comment on Hacker News.

[![My demo rig for the KubeCon talk](https://pbs.twimg.com/media/EnSvvQRXcAEEr1w?format=jpg&name=medium)](https://www.youtube.com/watch?v=jfUpF40--60)

> KubeCon talk: [The Past, Present, and Future of Kubernetes on Raspberry Pi](https://www.youtube.com/watch?v=jfUpF40--60)

**The costs of cloud**

> I was speaking to a friend recently that told me they were paying 7USD / mo to host 20 small projects on a well-known PaaS. That would have been costing them around 1700USD per year, moving those workloads to an RPi would save a fortune.

Running a Kubernetes cluster on one of the cheapest providers like [DigitalOcean](https://m.do.co/c/f0d7296632e4) can still set you back 60-120 USD / mo for a modest cluster. You can get much better value with your own hardware, whether that's with an old PC or some Raspberry Pis. I'm not saying that you should call your boss and give him the good news, but there is a certain crowd who enjoy building and running infrastructure, they also tend to enjoy cost savings.

**"But, I have no use-case"**

Quite often my content on Raspberry Pi can be divisive. It brings the best out of some people, and the worst out of others.

Let me put this succinctly - the Raspberry Pi is a Linux server. If you write code, or "do DevOps" for a day-job, you have a use-case. If you use a computer on a daily basis, you have a use-case.

![Meme](/content/images/2020/12/4rea8y.jpg)

> I'll just leave this here.

**Why use the Raspberry Pi?**

If you have the budget to buy some used workstations, NUCs, or servers on eBay, they will perform better, but they also take up more space and draw more power. Fortunately, most of what we'll cover will apply to Raspberry Pi and whatever Intel kit you can get your hands on.

**But, I thought SD cards were unreliable?**

Now that the [RPi 4 can boot from an SSD or NVMe over USB](https://alexellisuk.medium.com/upgrade-your-raspberry-pi-4-with-a-nvme-boot-drive-d9ab4e8aa3c2), the reliability of SD cards no longer needs to be a concern. The RPi 4 has much faster I/O, up to 8GB of RAM available along with a quad-core processor. Not only is it suitable for self-hosting many types of application, but it is likely to outperform smaller shared VPSes or EC2 instances since it's a dedicated host.

It's now trivial to build a cluster that can tolerate a node failure using K3s and its now embedded etcd mode which was introduced in K3s 1.19.

There are naturally some draw-backs to self-hosting: you have a dependency on your ISP's uptime, your significant other or children could unplug your infrastructure (yes it happens), but I think you will have fun and hone your skills.

> So whether you're building a home-lab, or looking to host websites, APIs and automation tools, I hope you'll find the recommendations useful.

## Picking tools and buying parts

![The parts from my latest build](https://pbs.twimg.com/media/Ep3STrhWMAAL7mz?format=jpg&name=small)
> The parts from my latest K3s build

### Bill of materials (hardware)

You will need at least one Raspberry Pi 4 with 2GB RAM or more. I would recommend that you buy three if you wish to run a HA cluster, that can tolerate a node failure.

**Managing costs**

Let me put this in bold: **you do not need to spend a fortune to build a cluster**. 4x RPi 4 including taxes in the UK runs to about 33 GBP per unit ~ about 130 GBP total. If you just want the experience of self-hosting, and to learn about Kubernetes without having to spend too much, you could buy a single 4GB RPi 4 for around 54 GBP including taxes.

**A note on the RPi3**

> The Raspberry Pi 3 and CM3 are both [having issues with K3s](https://github.com/k3s-io/k3s/issues/2353), particulary if you are running anything later than 1.17. If you have an existing investment (as I do), I would suggest selling them or giving them away.

**Cases and cooling off**

Whatever case you decide to use, make sure it has a fan. You can compare options in my post [Cooling off your Raspberry Pi 4](https://blog.alexellis.io/cooling-off-your-rpi4/).

The best options for cases are either one of the sets of acrylic plates and stand-offs that can be bought for 20-25 USD on Amazon, or a professional-grade [BitScope Cluster Blade](https://bitscope.com/blog/JK/?p=JK38B). Whatever you do, do not buy the original first-generation BitScope Blade which doesn't support the RPi4 or have cooling.

**Buy the best power adapter**

Do not buy a multi-charger for the RPi4, they may appear to work, however if you look into things you will find that they are "browning out". Official adapters are not expensive, my advise is not to be stingy.

**Storage**

When it comes to storage, you will need at least a 32GB SD card, but I would encourage you to go one further and buy solid state storage. Read about the performance differences in my post: [Upgrade your Raspberry Pi 4 with a NVMe boot drive](https://alexellisuk.medium.com/upgrade-your-raspberry-pi-4-with-a-nvme-boot-drive-d9ab4e8aa3c2). Some ask whether an M2 SSD is sufficient with the USB-bus of the RPi4 causing a bottleneck. They make a good point however the NVMe performs better, has a similar cost and can be used in one of your PCs at a later date.

### Kubernetes - kubeadm vs. k3s?

Until late 2019, most of us were still struggling to run [upstream Kubernetes on our RPis with kubeadm](https://github.com/alexellis/k8s-on-raspbian), and it was not a pleasant experience. Why? Because kubeadm was designed to run on high-performance Intel cloud servers, not on low-powered ARM SoCs.

<img width="30%" src="https://k3s.io/images/logo-k3s.svg" alt="k3s">

The headlines for K3s claim 500MB of RAM is required for a server, increasing 256MB when using embedded etcd. The claim for an agent is 50MB of RAM. Whatever the actual usage is, it's going to be much less than kubeadm and put less of a load on the system.

### 32-bit or 64-bit OS?

From my perspective the main limitation of a 32-bit OS is the 3GB process limit. That isn't something that I'm particularly worried about, but maybe you are? What the question really comes down to is: do you want to use Ubuntu or RaspiOS?

<img src="https://www.raspberrypi.org/wp-content/uploads/2011/10/Raspi-PGB001.png" width="30%" style="display: inline-block; left: 20%;">
<img src="https://assets.ubuntu.com/v1/fe951eda-20.10_Groovy+Gorilla_RPi_Sketch.svg" width="20%" style="display: inline-block; left: 40%;">

The Raspberry Pi Foundation do have a beta version of RaspiOS out, however it isn't the lite edition and comes with a fully-loaded desktop. 

In my experience with K3s, [Ubuntu 20.10](https://ubuntu.com/blog/ubuntu-20-10-on-raspberry-pi-delivers-the-full-linux-desktop-and-micro-clouds) works equally well as RaspiOS Lite on the RPi4. I tend to recommend with RaspiOS with its 32-bit OS because most Raspberry Pi users already use this and are comfortable with it.

### Sourcing apps and charts

Sourcing apps and charts can be tricky with ARM, as many maintainers have not yet considering porting their software to this architecture.

For that reason I built the [arkade](https://get-arkade.dev) project as an Open Source Kubernetes Marketplace. You can use it to install apps whether they are packaged as Helm charts, YAML manifests or shipped with their own CLI.

Why not use helm? Well in some instances it does, but where a package is not available for ARM, it will tell you. Where a chart has 150 configuration options, the `--help` text tells you the ones we think you'll need. The `arkade info APP` command gives you instructions on how to use the chart, and you can get that back at any time without installing the app again.

<img src="https://github.com/alexellis/arkade/raw/master/docs/arkade-logo-sm.png" width="20%"></img>
There are now over 40 packages and many contributors. Notable packages that work on Raspberry Pi are: Minio, OpenFaaS, cert-manager, ingress-nginx, Traefik 2, Linkerd, SealedSecrets and the Kubernetes dashboard.

You can install of them using arkade install:

```
arkade install APP
```

arkade also offers a fast download of CLIs to prevent breaking the flow when you're following instructions. How many times have you ran "brew update" and then instantly regretted it?

```
arkade get kubectl [--version 0.19.5]
arkade get kubectx
arkade get helm
arkade get terraform
```

Each package is downloaded as a static binary and put in your PATH. It doesn't matter if you're using Intel or ARM, Linux, MacOS or Windows, the correct binary (if available) will be downloaded.

> Warning: Whatever you do, resist the urge to run "third-party" or community builds of tools you recognise. This is asking for trouble, the code could be doing anything to your computers and network. See also: "Poison docker images"

### Ingress and LoadBalancers

There are two main ways I would expose services on Kubernetes. The first is to use a LoadBalancer, this is what you will be most used to from using managed Kubernetes clusters. By setting your Service as a `type: LoadBalancer` and giving a number of ports, a cloud load-balancer is provisioned and starts routing traffic on the given IP address.

When running at home, you can use a tool like [kube-vip](https://kube-vip.io) or [MetalLB](https://metallb.universe.tf), but they will only give you IP addresses on your local network, which external users cannot access. If you are thinking of using these tools, you may as well just use a [NodePort](https://kubernetes.io/docs/concepts/services-networking/service/) and forego the additional tooling. A NodePort makes a high port number such as 31112 available on all your nodes, which then routes traffic to the exposed service.

Many homelab'ers will be aware of port-forwarding, where your home router can be set to forward traffic on a given set of ports to hosts on your internal network. This is achieved through mapping a high non-standard port number to the internal port. Unfortunately, many home users are inadvertently giving away their location, their ISP customer number (Virgin Media, I'm looking at you), and in some instance, a good estimation of their home address. Now on top of all of that, you cannot take that IP address with you, so if you close the lid of your laptop running K3s, and open the lid on a captive portal in a coffee shop, your services will no longer be available.

Likewise, your IP is likely to change. The mitigation is to run a daemon that continually checks your IP address and updates your DNS records.

That all sounds like a lot of hard work to me.

In the early days, I used to use Ngrok which tunnels out from your internal network, but unfortunately I kept running into its connection and rate-limiting. It also has no Kubernetes integration, and it's not for lack of trying - Joe Beda (a Kubernetes co-founder) once built a project to try and fix this problem. 

Over the past year I've developed a tool called inlets which fixes the issues of port-forwarding and Ngrok: no manual configuration, no high ports, no exposing your location, the IP moves with you - even to a coffee shop and it has absolutely no artificial rate-limiting because you self host the tunnel server on your own VM.

[inlets](https://docs.inlets.dev/) is a Cloud Native Tunnel built from the ground up to work in containers, VMs, Kubernetes, Linux, Windows, MacOS, ARM - you name it.

It scales better than a VPN, since you don't have to allocate IP addresses and subnets for each host. You can have thousands of inlets tunnels and set them up within a matter of minutes, where as customers have told me they often have to send an engineer or contractor on-site to configure their VPNs. Unlike an SSH tunnel, there's no need for additional tooling just to keep it running and it doesn't require extra configuration to go over a HTTP proxy.

You run the client inside your restrictive network, and the server on a public VM. When the two are connected you get to access your private service from the public VM's IP. Since the client speaks first, it tends to "just work".

<img src="https://docs.inlets.dev/images/inlets-oss-logo.svg" width="30%">

inlets integrates into Kubernetes using the [inlets-operator](https://github.com/inlets/inlets-operator) and you can install it using arkade or helm:

```
arkade install inlets-operator \
 --provider digitalocean \
 --region lon1 \
 --token-file ~/do-api-key.json \
 --license-file ~/LICENSE
```

> In the README you'll find out the differences between inlets OSS and PRO, for self-hosting PRO is recommended and more featureful. There are around half a dozen cloud providers available now, added by community members, but I prefer [DigitalOcean](https://m.do.co/c/f0d7296632e4) for the fast boot-time and low cost (around 5 USD / mo).

After running that one command, any LoadBalancer you expose will create a VM on public cloud and deploy an inlets server. The inlets client will then be run within your cluster and you get to self-host whatever you like.

Now a well-known trick with Kubernetes is to only expose one LoadBalancer, and host all your sites on the same IP address through different DNS names. This can be done with [Kubernetes Ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/).

Unless you configure K3s otherwise, it will add Traefik 1.x for you during installation. arkade ships with several IngressController apps that you can use such as Traefik 2 and Kong, but I tend to prefer [ingress-nginx](https://kubernetes.github.io/ingress-nginx/).

So whether you're using public cloud, or the inlets-operator and self-hosting at home, you now only have to pay for one VM or Cloud LoadBalancer instead of one per service.

Using inlets you can also [get TLS certificates by running cert-manager](https://docs.inlets.dev/#/get-started/quickstart-ingresscontroller-cert-manager?id=expose-your-ingresscontroller-and-get-tls-from-letsencrypt) and tunnelling port 80 and 443 from the exit-server to your Kubernetes ingressController.

### Hosting services

You can build your own helm chart for a service and expose it via your IngressController.

For an example of a helm chart for Node.js, see my example of an Express.js microservice with a Dockerfile, Kubernetes YAMLs and a non-root user: [alexellis/expressjs-k8s](https://github.com/alexellis/expressjs-k8s).

I am biased here, but I prefer to use OpenFaaS to host microservices and APIs. The workflow looks a bit like this:

```
arkade install openfaas
arkade install openfaas \
  --domain openfaas.example.com \
  --email alex@example.com
```

That gives me https://openfaas.example.com for my admin panel and https://openfaas.example.com/functions/ for anything I deploy.

From there I can use one of the many language templates in the store to create a function and deploy it:

```
faas-cli template store pull golang-http
faas-cli new 
  --lang golang-http \
  --prefix alexellis2 \
  my-api

faas-cli publish --platforms linux/amd64,linux/arm/v7

faas-cli deploy -f https://openfaas.example.com
```

That publishes an image I can run locally or on my RPi.

I'll be able to access the API at: https://openfaas.example.com/functions/my-api

Custom domains such as `my-api.example.com` can also be deployed using the FunctionIngress add-on: [TLS and custom domains for functions](https://docs.openfaas.com/reference/ssl/kubernetes-with-cert-manager/#20-tls-and-custom-domains-for-functions)

You'll also be able to re-map your APIs and websites into a single REST style API.

OpenFaaS comes with built-in monitoring, scaling and a web UI:

![Grafana](https://pbs.twimg.com/media/C9caE6CXUAAX_64.jpg:large)
> Pictured: Grafana dashboard showing function scaling, HTTP codes and execution duration.

![OpenFaaS Portal](https://github.com/openfaas/faas/raw/master/docs/inception.png)
> Pictured: The OpenFaaS UI showing a machine-learning model being used

Find out more: [OpenFaaS docs](https://docs.openfaas.com)

### CI/CD

As far as CI/CD is concerned, if you're using OpenFaaS you can use the existing API to deploy functions and GitHub Actions to build multi-arch images, see this post by Utsav Anand: [Build and deploy OpenFaaS functions with GitHub Actions](https://www.openfaas.com/blog/openfaas-functions-with-github-actions/).

If you picked a 64-bit Operating System, then [Flux](https://fluxcd.io) may be an option to look into, but requires considerably work to configure with a configuration repository detailing which manifests to apply, and a separate job to build and deploy images.

### Remote access with kubectl

You can also expose your Kubernetes API server with a public IP, see my guide: [Get kubectl access to your private cluster from anywhere](https://blog.alexellis.io/get-private-kubectl-access-anywhere/).

Whist you won't need this to use OpenFaaS, you could use this in conjunction with a CI/CD pipeline if you are deploying with Helm or kustomize.

### Storage

You are going to need a PersistentVolume for your stateful applications like Minio, or Prometheus - where files are stored on the filesystem of the container.

K3s ships with a "local path provisioner" which uses the host's storage for [Persistent Volumes](https://kubernetes.io/docs/concepts/storage/persistent-volumes/). It does have some limitations which you can [read about here](https://github.com/rancher/local-path-provisioner).

I won't claim to be an expert on self-hosted Kubernetes block storage, but [Longhorn](https://github.com/longhorn/longhorn), NFS and [Ceph](https://ceph.io) all appear to be popular.

Just to show how quickly things are moving with ARM support, 5 days ago [Longhorn v1.1.0](https://github.com/longhorn/longhorn/releases/tag/v1.1.0) was released which adds support for 64-bit ARM OSes, like Ubuntu 20.10.

The OpenEBS project also gained beta support for 64-bit ARM in November 2020 in [version 2.3.0](https://docs.openebs.io/docs/next/releases.html#230-nov-15-2020)

For the time-being, if you're using RaspiOS, the nfs-provisioner is worth trying:

```
arkade install nfs-provisioner
```

For object storage you can use Minio, which provides an S3-like API:

```
arkade install minio
```

**Taking advantage of managed services**

If I were to host an application that required a database, S3, or a Redis cache, then I'd probably use a managed service for those parts, particulary if I cared about the data. On DigitalOcean managed databases start at a reasonable 15USD / mo, and their managed S3 equivalent "Spaces" starts at 5USD / mo.

It's easy to rebuild a cluster, and redeploy stateless microservices, what's more difficult is managing stateful applications and recovering from data loss.

### Registries

There is no doubt that hosting your own registry will be faster than using the Docker Hub's mirror on the West Coast of the USA, especially if you live in Europe like I do. This is not strictly necessary, but you should try it and see if it's for you.

With your IngressController tunneled with the inlets-operator, you can run a couple of arkade commands and get your own registry:

```bash
arkade install docker-registry
arkade install docker-registry-ingress \
  --email web@example.com \
  --domain reg.example.com \
  --ingress-class traefik
```

From there you'll get a valid TLS cert and can use it from anywhere, it also has auth:

```bash
docker login reg.example.com

docker tag alpine:3.11 reg.example.com/alpine:3.11
docker push reg.example.com/alpine:3.11
docker pull reg.example.com/alpine:3.11
```

See the full tutorial: [Get a TLS-enabled Docker registry in 5 minutes](https://blog.alexellis.io/get-a-tls-enabled-docker-registry-in-5-minutes/)

### Netbooting

Now perhaps I was a little self-deprecating in the previous section. One thing I do know a lot about is netbooting, so much so that I took a week to build a workshop for my GitHub Sponsors so that they can save themselves that time. Putting aside a dollars per month is decent value when you consider how long it took to build and test the instructions.

![b9cffb5a-alex-netboot](/content/images/2020/12/b9cffb5a-alex-netboot.png)

> Pictured: a netbooting sequence that hasn't changed in 30 years.

containerd is the usual choice for running containers on Kubernetes clusters, but it doesn't support NFS, which is the main option you'll find for netbooted machines. It's what [Mythic Beasts](https://www.mythic-beasts.com) use for their own RPi cloud, and unfortunately why users cannot run K8s or Docker there.

My lab explains the workarounds and gives you what you need to netboot on RPi3 and RPi4. The neat thing is that once you host the root filesystem on another computer, you can increase the speed by backing that with NVMe.

This is what my NFS server looks like:

```
alex@nuc7:~$ ls /nfs/
1b9a8834  1befbd15  3c104aa8  7feb56e7	a7dc46e5  c3e76471
```

Whenever I run into an issue with a node, let's say the one with the serial-number `c3e76471` - I just run `rm -rf /nfs/c3e76471` and then my provisioning script and cycle power on the unit. When using the BitScope Cluster Blade, I can even cycle the power remotely using its microcontroller.

If you'd like to learn how netbooting works, you can read more in my article on The New Stack: [Bare Metal in a Cloud Native World](https://thenewstack.io/bare-metal-in-a-cloud-native-world/)

For access to my advanced netbooting workshop for the Raspberry Pi, just sign up for my [GitHub Sponsors](https://github.com/sponsors/alexellis/) on The Treasure Trove tier and click on the Insiders Update.

## Putting it all together

Let's say that you wanted to put this all together so that you had a highly-available Kubernetes cluster with a public IP for its IngressController using K3s, Traefik, OpenfaaS and cert-manager. That's just like the setup I built for my KubeCon demo.

K3s can support two modes of multi-master / High-Availability using etcd or an external database:

* [High Availability with Embedded DB (etcd)](https://rancher.com/docs/k3s/latest/en/installation/ha-embedded/)
* [High Availability with an External DB](https://rancher.com/docs/k3s/latest/en/installation/ha/)

[k3sup](https://k3sup.dev) is a tool that I built to install k3s over SSH.

Imagine you'd purchased three RPi4s with 4GB of RAM to be your servers, and two with 8GB of RAM to run your workloads. Here's how you could use k3sup to configure them:

```bash
#!/bin/bash
set -e

CH=1.19

echo Installing Server 1
k3sup install --user pi --ip 192.168.2.147 \
  --k3s-channel $CH \
  --cluster

echo Installing Server 2
k3sup join --user pi --ip 192.168.2.141 --server-ip 192.168.2.147 \
  --k3s-channel $CH \
  --server

echo Installing Server 3
k3sup join --user pi --ip 192.168.2.123 --server-ip 192.168.2.147 \
  --k3s-channel $CH \
  --server \
  --print-command

echo Installing Agent 1
k3sup join --user pi --ip 192.168.2.129 --server-ip 192.168.2.147 \
  --k3s-channel $CH
  
echo Installing Agent 2
k3sup join --user pi --ip 192.168.2.131 --server-ip 192.168.2.147 \
  --k3s-channel $CH
```

Then we'd use arkade to install the various helm charts and Ingress records we need:

```bash
# Install cert-manager
arkade install cert-manager

# Install OpenFaaS
arkade install openfaas

# Install inlets-operator
arkade install inlets-operator --provider digitalocean \
  --region lon1 --license-file ~/LICENSE \
  --token-file ~/Downloads/do-access-token

# Get the public IP from Traefik
INGRESS_IP=$(kubectl get svc/traefik -n kube-system -o jsonpath="{.spec.loadBalancerIP}")

# Create a DNS A record for that IP
doctl domain create selfhosted.example.com --ip-address INGRESS_IP

# Generate an Ingress record for OpenFaaS
arkade install openfaas-ingress \
  --ingress-class traefik \
  --email alex@selfhosted.example.com \
  --domain selfhosted.example.com

export OPENFAAS_URL=https://selfhosted.example.com

# Log in to openfaas
faas-cli login
```

I can then create a new function and deploy it:

```bash
docker login --username alexellis2

# Deploy a function (alexellis2 is my Docker Hub name)
faas-cli new --lang node12 \
  --prefix alexellis2 \
  slashcommand

faas-cli publish --platforms linux/arm/v7,linux/arm64,linux/amd64

faas-cli deploy

# Invoke the function
curl https://selfhosted.example.com/function/slashcommand
```

## Wrapping up

Over the course of 5 years I've written many tutorials about containers and clustering on Raspberry Pi. Things are sill evolving, and support is getting better. If things were rough last time you tried it out, give it another shot.

If you enjoyed the tutorial, then try it out over the holidays and let me know [what you think of inlets](https://inlets.dev/). You can reach me on Twitter [@alexellisuk](https://twitter.com/alexellisuk/)

### My KubeCon talk

You can watch my talk from KubeCon and learn the various ways to build a cluster, see a live demo of deploying to my RPis from GitHub and learn what I am using for my own cluster.

<iframe width="560" height="315" src="https://www.youtube.com/embed/jfUpF40--60" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

[The Past, Present, and Future of Kubernetes on Raspberry Pi](https://www.youtube.com/watch?v=jfUpF40--60)

### "Kubernetes isn't for me"

Now if Kubernetes is "not for you", or your budget won't allow for a few Raspberry Pis at this time, then that's understandable and there is another way.

**Keeping costs low**

Together with the OpenFaaS community I launched a new project called [faasd](https://github.com/openfaas/faasd). faasd hosts APIs, microservices, websites and functions using a single node, instead of a whole Kubernetes cluster. That makes it much cheaper, but in the event of the node crashing, you may have some downtime. That's the main trade-off vs. cost and complexity.

Why not checkout my new faasd eBook on Gumroad?

> Within a few minutes you'll be deploying your own functions with TLS enabled. Just write a few lines of code and deploy from your laptop or your favourite CI/CD solution. Best of all, you can run it on a 5USD VM or even a Raspberry Pi.
> You'll learn how to deploy code in any language, lift and shift Dockerfiles, run requests in queues, write background jobs and to integrate with databases. faasd packages the same code as OpenFaaS, so you get built-in metrics for your HTTP endpoints, a user-friendly CLI, pre-packaged functions and templates from the store and a UI.

* [Checkout Serverless For Everyone](https://gumroad.com/l/serverless-for-everyone-else)

For me, I found that hosting my [GitHub Sponsors](https://github.com/sponsors/alexellis/) portal on a Raspberry Pi 3 worked out better than maintaining a cloud instance. So whenever you log into [The Treasure Trove](https://faasd.exit.openfaas.pro/function/trove), you're actually hitting a Raspberry Pi in my house through an inlets tunnel.

### "Self-hosting isn't for me"

That's entirely understandable - modern Cloud Native infrastructure can be hard to maintain, and you may not have anything you want to host.

Just keep an eye on your cloud costs, particulary when you're doing local development and consider whether having a machine on your local network could save you some of that spend over the course of the next one or two years.

### Learn how to build your own lab

If you'd like to build your own private cloud, or just learn more about networking, you can pick up [my eBook or video workshop package](https://gumroad.com/l/netbooting-raspberrypi) with 30 USD off until 9th April.

[![My Netbooting workshop for Raspberry Pi with K3s on Gumroad](https://static-2.gumroad.com/res/gumroad-public-storage/variants/64bucn4zp8wzqdf2dldiud3d89up/3298c3eb001bbed90f1d616da66708480096a0a1b6e81bd4f8a2d6e9b831d301)](https://gumroad.com/l/netbooting-raspberrypi)

[Check out my netbooting workshop](https://gumroad.com/l/netbooting-raspberrypi)

### You may also like

Tutorials:

* [Self-host services at home with cert-manager and Kubernetes Ingress](https://docs.inlets.dev/#/get-started/quickstart-ingresscontroller-cert-manager?id=expose-your-ingresscontroller-and-get-tls-from-letsencrypt).
* [Will it cluster? k3s on your Raspberry Pi](https://blog.alexellis.io/test-drive-k3s-on-raspberry-pi/)
* [Walk-through — install Kubernetes to your Raspberry Pi in 15 minutes](https://alexellisuk.medium.com/walk-through-install-kubernetes-to-your-raspberry-pi-in-15-minutes-84a8492dc95a)

Materials:

* [Get a free 14-day trial of inlets PRO](https://inlets.dev)
* [BitScope Cluster Blade](https://bitscope.com/blog/JK/?p=JK38B)