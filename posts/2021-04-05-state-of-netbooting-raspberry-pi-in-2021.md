---
title: "State of netbooting Raspberry Pi in 2021"
slug: "state-of-netbooting-raspberry-pi-in-2021"
date: "2021-04-05T17:25:25Z"
author: "Alex Ellis"
meta_title: "State of netbooting Raspberry Pi in 2021"
meta_description: "When I tried netbooting 24 RPi3s in 2017, it failed miserably. Find out what changed when I built my private cloud with the newer Raspberry Pi 4s and K3s"
feature_image: "/content/images/2021/04/banner.jpeg"
tags:
  - "Raspberry PI"
  - "workshop"
  - "netbooting"
  - "networking"
  - "private cloud"
  - "kubernetes"
---

> TLDR; When I tried netbooting 24 RPi3s in 2017, it failed miserably. Find out what changed when I built my private cloud with the newer Raspberry Pi 4s and K3s.

Just over three years ago, [I wrote up a blog post exploring why netbooting was interesting for Raspberry Pi](https://blog.alexellis.io/the-state-of-netbooting-raspberry-pi/), and what kind of problems I ran into due to issues with the firmware available at the time.

[My original rig](https://blog.alexellis.io/the-state-of-netbooting-raspberry-pi/) had 24 early-generation Raspberry Pi 3s, which had a timing bug rendering them unreliable for netbooting.

In this post, I'll give you an update (things are much better now) and I'll also tell you about my new rig which I'm running K3s on.

![My private cloud](/content/images/2021/04/full-result.jpeg)
> My private cloud with 40GB of RAM for running K3s

You'll also find a link to [my new workshop and eBook](https://gumroad.com/l/netbooting-raspberrypi) which has a Bill of Materials and step-by-step instructions for netbooting your own Raspberry Pis.

## Why did I want to do it in 2017?

My original hopes were that I could save on the costs and management of 24 SD cards. These are notoriously unreliable due to their limited write cycles. When used in a Raspberry Pi cluster running [Kubernetes](https://kubernetes.io), the cards would be written to constantly meaning the cards will eventually fail.

![Flashing manually](/content/images/2021/04/flash-them.jpg)
> Given the bug with netbooting the variant of the RPi3 that I had, this was the only way to get it working

Even with automation, it's a time-consuming and manual process to flash, label and update 24 SD cards. I did actually go through this process and got all of the nodes functioning.

![My original rig](/content/images/2021/04/IMG_20200331_114834.jpg)
> My original rig refreshed with K3s

I ran Docker Swarm on the cluster originally, before Swarm fell out of fashion, and Kubernetes took over to bring clustering to containers. Swarm was always light-weight and fast on Raspberry Pi, and Kubernetes using kubeadm was always slow and difficult to use.

Fortunately [Darren Shepherd](https://twitter.com/ibuildthecloud) came up with a novel idea of taking way the things he didn't want in Kubernetes and created a "distro" called [K3s](https://k3s.io) (3 is less than 8).

Where [kubeadm](https://kubernetes.io/docs/reference/setup-tools/kubeadm/) created a headache for Raspberry Pi, K3s made things simple with an easy boostrap, low resource requirements and a single binary for distribution and updates.

Given how much I'd liked the Docker experience of "docker swarm init" and "docker swarm join", I decided to re-create a similar experience for K3s in the [k3sup](https://k3sup.dev) tool.

[k3sup](https://k3sup.dev) installs K3s over SSH and also makes creating a multi-server configuration easier through CLI flags.

![Conceptual architecture](https://raw.githubusercontent.com/alexellis/k3sup/master/docs/k3sup-cloud.png)
> Conceptual workflow showing the `install` and `join` commands run with a hostname or IP address over SSH.

## Why did I revisit netbooting in 2020?

I was helping the team at [Equinix Metal](https://metal.equinix.com/) get their Open Source provisioning software [Tinkerbell](https://tinkerbell.org) ready for general use. That meant going through examples to check that they worked, building new examples and giving feedback on the developer- and user-experience.

As part of the project I wrote up a feature-length article for [The New Stack](https://thenewstack.io/) to link the ideas of Cloud Native computing (a relatively new and trendy area) to bare-metal provisioning (something which has used the same basic tools for 20-25 years).

My post [Bare Metal in a Cloud Native World](https://thenewstack.io/bare-metal-in-a-cloud-native-world/) also helped me refresh my own memory on TFTP, DHCP and on NFS.

![Conceptual diagram](https://cdn.thenewstack.io/media/2020/05/b9cffb5a-alex-netboot.png)
> My conceptual diagram showing how PXE boot works

One of the other things I built out for the client was a GitHub repository collecting other Open Source awesome baremetal projects: [awesome-baremetal](https://github.com/alexellis/awesome-baremetal)

As I was kicking the tires with Tinkerbell and testing out netbooting with a few Intel NUCs, my interest in the Raspberry Pi got stirred again. With the popularity of [K3s](https://k3s.io) and my [K3s bootstrapping tool k3sup ('k3sup')](https://k3sup.dev/), it seemed like a good time to revisit the problems I'd had in 2017.

## My build in 2021

In 2021, I wanted to take what I'd learned during the previous year and bundle it up into a workshop that anyone could follow to access netbooting. It took me about two weeks to fully understand, document, automate and test the setup.

Whilst you can spend a lot of money here, I was fortunate to have an old PC I could use as a server, and the kit that BitScope had sent me. Note: the 2GB Raspberry Pi only costs 35 USD now, and you only really need one to try this out.

For the initial configuration I used an Intel NUC as the netbooting server with a four Raspberry Pi 4s with 2GB of RAM each. That would be enough to run Kubernetes and a few workloads like [OpenFaaS](https://openfaas.com/).

I used the official 32-bit Raspberry Pi Operating System which supports PXE booting. Ubuntu 20.04 (Focal Fossa), a 64-bit Operating System also works with some modifications and is needed if you want to run a project that is only made available for 64-bit Operating Systems. The Raspberry Pi is capable of running both, but the 32-bit OS is better supported and understood by the community.

After assembling the hardware, the process involves flashing a new firmware to each node, setting up a boot order, configuring a server with TFTP, NFS, a DHCP server and IP forwarding to act as a router.

![Flashing each Raspberry Pi](/content/images/2021/04/PXL_20210405_095637797.jpg)
> I flashed each of the Raspberry Pis using the same SD card, then I could close the case and take a note of each MAC address and serial number for later on.

This is the network topology, where everything runs in its own subnet, on a separate LAN and switch.

![topology](/content/images/2021/04/topology.jpeg)

> The network topology from my workshop

Once you have everything configured, it's then a case of picking a case or enclosure to host your nodes.

[BitScope](https://bitscope.com) had sent me a newer version of their product called the [Cluster Blade](https://bitscope.com/blog/JK/?p=JK38B) - this time just for 8 nodes. It was aimed at edge computing and could be rack-mounted. Do not confuse this with the previous generation product called "The BitScope Blade", which is designed for Raspberry Pi 3.

They also kindly sent over an additional 4x nodes for me so that I could fully populate the cluster with 8 nodes.

![populated](/content/images/2021/04/populated.jpeg)

This gave me a total of 40GB of RAM and 32 CPU cores. My netbooting server also had a 500GB NVMe installed and shared for NFS, so there was plenty of space available too.

With each of the nodes running, I observed around 30-31 Watts of power being drawn through the power supply. The 24-node RPi3 cluster drew ~ 21 Watts, so considering the increase in I/O speed and RAM per node, this seems reasonable.

### A private cloud for production

The use-case that BitScope see for these racks is where customers want to move off AWS EC2 and onto their own private cloud, which they can run on-premises or at the edge at a customer site.

If an application already runs in a container, then it shouldn't take too much work to port it over to K3s. One of the tricky parts is in the ecosystem, and making sure that everything that needs to run is available for an Arm CPU.

**App ecosystem**

Things are much better than they were in 2017, with the following key components available with Arm support: cert-manager, ingress-nginx, Postgresql, OpenFaaS, NATS, Prometheus, Docker registry, Grafana, Minio, Portainer, .NET Core, Node.js, Python 3, Go and many others. If you're a Kubernetes or K3s user, then you may also find [the arkade tool](https://github.com/alexellis/arkade) useful for discovering and installing apps with a single command line.

**Storage**

People often ask me about storage. Many modern microservices are built to be stateless, and not to need to read or write from a disk, but you may need underlying object storage or a SQL database. That is where I tend to need persistent storage when working with OpenFaaS functions.

Fortunately, K3s comes with a storage driver that can use the local disk of the node and is called [Local path provisioner](https://github.com/rancher/local-path-provisioner). There are other options available such as [OpenEBS](https://openebs.io/) and [Longhorn](https://github.com/longhorn/longhorn), but since we already have NFS in place, we may as well use the [NFS volume provisioner](https://github.com/kubernetes-sigs/nfs-subdir-external-provisioner).

**Ingress and remote access**

Some people are content with having no Ingress to their clusters at all, but I'm not one of those people. If I need to expose a Kubernetes LoadBalancer, then I want it to have a public and accessible IP address. For that reason I built the [inlets-operator](https://github.com/inlets/inlets-operator), a Kubernetes controller that can provision a VM and then create a network tunnel to enable TCP or HTTPS traffic to enter the cluster from behind NAT, firewalls and captive portals.

![Demo GIF](https://iximiuz.com/kubernetes-operator-pattern/kube-operator-example-opt.gif)

> Credit goes to [Ivan Velichko](https://iximiuz.com/en/posts/kubernetes-operator-pattern) for the animation.

**GitOps**

Loosely defined, GitOps (coined by [Alexis Richardson](https://twitter.com/monadic)) is storing deployment configuration in a Git repository for continuous deployment and is very much in vogue in 2021.

Johan Siebens wrote up a blog post showing how ArgoCD can be used to bring GitOps to one or more Raspberry Pi clusters, or a fleet of clusters. [ArgoCD for your private Raspberry Pi k3s cluster](https://johansiebens.dev/posts/2020/08/argo-cd-for-your-private-raspberry-pi-k3s-cluster/)

[Rancher's Fleet](https://fleet.rancher.io/multi-cluster-install/) project (another one of of Darren's inventions) is designed to manage [fleets of up to 1 Million clusters](https://rancher.com/blog/2020/scaling-fleet-kubernetes-million-clusters).

## Wrapping up

Whatever I said about netbooting in 2017 is still large correct apart from one thing. It is now much more reliable and easier than ever to get started with, whether you have one or 100 Raspberry Pis.

So however many Raspberry Pis you have, booting over the network means you can quickly provision and manage your nodes, even if they are just running PiHole, Plex, or a Ghost blog. Removing the SD cards makes the filesystem faster, and more reliable.

It should be noted that a local NVMe over USB3 is faster, by a large margin, however it is also much more costly to scale 8x NVMe drives plus their caddies, vs. one NVMe in an old PC or server that you may already own.

Let me leave you with some resources and further links so that you can keep on learning.

### Take it further

Is there something I didn't cover? It may be included in my workshop, or you can [reach out to me over Twitter](https://twitter.com/alexellisuk/status/1378998948992589830?s=20) if you already have a copy.

If you'd like to build your own private cloud with Raspberry Pis or just learn more about netbooting them, you can now purchase [my eBook and video workshop package on Gumroad](https://gumroad.com/l/netbooting-raspberrypi)

[![My Netbooting workshop for Raspberry Pi with K3s on Gumroad](https://www.alexellis.io/netboot.png)](https://gumroad.com/l/netbooting-raspberrypi)

* [Check out my netbooting eBook & video workshop](https://gumroad.com/l/netbooting-raspberrypi)

Would you like to learn more of the journey over the past 5 years of Docker and Kubernetes on Raspberry Pi? Are you curious about the costs and the real-life use-cases? [The Past, Present, and Future of Kubernetes on Raspberry Pi](https://www.youtube.com/watch?v=jfUpF40--60)

Would you like to try booting your Raspberry Pi from a local disk? [Upgrade your Raspberry Pi 4 with a NVMe boot drive](https://alexellisuk.medium.com/upgrade-your-raspberry-pi-4-with-a-nvme-boot-drive-d9ab4e8aa3c2)

Want to try K3s? You can do so with an SD card in around 15 minutes with my [K3s walk-through](https://alexellisuk.medium.com/walk-through-install-kubernetes-to-your-raspberry-pi-in-15-minutes-84a8492dc95a)