---
title: "The state of netbooting Raspberry Pis"
slug: "the-state-of-netbooting-raspberry-pi"
date: "2017-12-26T12:20:39Z"
author: "Alex Ellis"
meta_title: "The state of netbooting Raspberry Pis"
meta_description: "Let's take a look at the state of netbooting for Raspberry Pis including how and why you'd build a cluster and how well containers play with network booting"
tags:
  - "Raspberry PI"
  - "docker"
  - "k8s"
  - "netbooting"
  - "kubernetes"
---

I'm going to walk you through a few of the pieces involved in net-booting a Raspberry Pi and then talk about the challenges of running cloud native apps on a net-booted RPi.

It's undeniable - Raspberry Pis capture the imagination of techies of all ages. Combine several Raspberry Pis into a cluster and you now have an x10 or x100 multiplier, but there are some problems with SD Cards. Netbooting is meant to fix this - but there are some limitations to its usefulness.

## The test-rig

Here's a photo I posted up on Twitter a few days before Christmas Day of a 30x node RPi cluster. Even with my 5-6K followers this quickly became a hit - checkout the thread below for some of the comments:

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">What if I told you I had a x30 RPi node cluster with 120 cores running <a href="https://twitter.com/kubernetesio?ref_src=twsrc%5Etfw">@kubernetesio</a> and <a href="https://twitter.com/openfaas?ref_src=twsrc%5Etfw">@openfaas</a> ??? <a href="https://t.co/qULW0kgf6i">pic.twitter.com/qULW0kgf6i</a></p>&mdash; Alex Ellis (@alexellisuk) <a href="https://twitter.com/alexellisuk/status/944511947101360128?ref_src=twsrc%5Etfw">December 23, 2017</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> 

This kit is the BitScope Rack 20 from BitScope based out of Australia. Despite its name it can actually house x30 RPis.

> In the Tweet I am setting up my cluster to run [OpenFaaS - Serverless Functions Made Simple](https://www.openfaas.com).

Up the left and right hand-side of the housing run a power-rail that can deliver 5A per host. It's modular so you can pick between 0 and 15 "blades" where each blade can take 2x RPis.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">More on the power supplies <a href="https://t.co/7hiJ52sWLj">pic.twitter.com/7hiJ52sWLj</a></p>&mdash; Alex Ellis (@alexellisuk) <a href="https://twitter.com/alexellisuk/status/944876401328558080?ref_src=twsrc%5Etfw">December 24, 2017</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> 

The 5A rating per device means that we could easily run an external rotary hard-drive or a similar hungry device.

If you're already thinking about getting your own - then fortunately these do come in smaller sizes such as a 2x, 4x and 1-U sized enclosure. Find out more on the [products page](http://my.bitscope.com/store/?p=list&a=list&i=cat+3). Bruce mentioned on Twitter that more products will be coming out in 2018.

My favorite equipment for building clusters is low-tech - it just involves using bronze or copper stand-off screws. You really don't need to go big with this - 3-6 RPis and a decent PSU are enough.

Read more about a cluster on a budget in my blog [12 Days of Christmas for techies](https://blog.alexellis.io/your-12-days-of-tech-christmas/).

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">I&#39;m writing a blog post on <a href="https://twitter.com/Docker?ref_src=twsrc%5Etfw">@docker</a> and <a href="https://twitter.com/Raspberry_Pi?ref_src=twsrc%5Etfw">@Raspberry_Pi</a> - it&#39;s probably never been easier to create a cluster and deploy code 🐝 <a href="https://t.co/KD2MIIrAx9">pic.twitter.com/KD2MIIrAx9</a></p>&mdash; Alex Ellis (@alexellisuk) <a href="https://twitter.com/alexellisuk/status/898978596773138436?ref_src=twsrc%5Etfw">August 19, 2017</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

## What can you do with it?

There's a range of common applications for clustered computing including:

- [Beowulf clusters](https://en.wikipedia.org/wiki/Beowulf_cluster)

The original open-source super-computer project - Beowulf is now showing its age but allows you to combine multiple PCs together into a cluster

- [Linux Terminal Server Project - LTSP](http://www.ltsp.org)

Also showing its age - LTSP allows you to turn an old PC or Raspberry Pi into a "dumb terminal" or GUI Server where the compute runs on a power-powerful centralized server.

- [Python MPI](http://mpi4py.scipy.org/docs/)

MPI is a programming interface for distributed computing problems

- Controllers for external devices such as Bitcoin miners

While not powerful enough to mine - Raspberry Pis are useful for controlling or supervising USB/ethernet bitcoin miners.

- HPC testing - simulating HPC environments at a smaller scale

BitScope are helping to build a [3,000 node cluster](http://www.bitscope.com/blog/FM/?p=GF13L) for HPC testing at the University of Mexico.

- Running network services

You can run your blog, MySQL database, or whatever else you can find a binary or source-code for. If you're only exposing the RPis to the internal network then you could run DHCP, DNS, SFTP and Samba server too.

And more recently:

- [OpenFaaS - Serverless Functions Made Simple](https://www.openfaas.com)

If you follow the tutorial for [OpenFaaS](https://blog.alexellis.io/serverless-kubernetes-on-raspberry-pi/) on Docker Swarm or Kubernetes you can pool your resources together - CPU, RAM and disk to build a virtual cloud for running and learning about [Serverless Functions](https://blog.alexellis.io/introducing-functions-as-a-service/) - the project has gained over 8.8k stars over the last 12 months and has a thriving community.

> Link: [OpenFaaS on GitHub](https://github.com/openfaas/faas/)

- [Docker and Kubernetes](https://blog.alexellis.io/serverless-kubernetes-on-raspberry-pi/)

I've written 80 blog posts over the last two years on running Docker - around 40-50% of these are in combination with the Raspberry Pi. A Raspberry Pi cluster is almost identical to a cluster you could create in the cloud but the key differentiator is the CPU architecture. This often means programs need to be rebuilt from source to target the ARM CPU.

## Why is netbooting interesting?

The primary draw-back of the Raspberry Pi isn't its low powered processor - it's the reliability of the flash storage it relies upon to boot the system.

If you've been using RPis for a few months then it's likely you've logged into a system to diagnose a problem and found that the SD Card has become a "read-only" filesystem or that things just aren't working right. You may have free capacity, but if you've used up the read/write cycles then it's time to toss the card into the trash and buy another.

Imagine if you bought x30 16GB SD cards ($15 each?) and then ran something log-intensive on them like a Kubernetes cluster. You may end up shortening the lifespan considerably. That's $450 down the drain.

There are some alternatives to booting from the SD Card:

* make the filesystem read-only and write to RAM
* connect an external hard-drive or USB-flash-drive to each RPi

Both of these solutions are impractical for a distributed system which needs to run containers. Flash drives also have a limited life-time and external hard-drives are expensive.

The final option is to boot from the network which means we don't need an SD card and can use a single external hard-drive connected to a more powerful machine.

## State of netbooting

Net-booting works well on the Raspberry Pi B Model 3 without an SD Card. It also works in a more limited fashion on some of the older Raspberry Pis, but an SD card is needed to load the kernel and boot.

Here's my RPi3 booting without an SD card:

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Excited to have netbooted my first <a href="https://twitter.com/Raspberry_Pi?ref_src=twsrc%5Etfw">@Raspberry_Pi</a> - look ma&#39; no SDCards! <a href="https://t.co/7DjxAYZXhG">pic.twitter.com/7DjxAYZXhG</a></p>&mdash; Alex Ellis (@alexellisuk) <a href="https://twitter.com/alexellisuk/status/945590482452795392?ref_src=twsrc%5Etfw">December 26, 2017</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> 

I followed the [standard tutorial](https://www.raspberrypi.org/documentation/hardware/raspberrypi/bootmodes/net_tutorial.md) on the [RPi foundation website](https://www.raspberrypi.org/documentation/hardware/raspberrypi/bootmodes/net_tutorial.md) and it "just worked" - I didn't need to do anything extra. Note: I did have to power cycle several times until the system came up.

> As a pre-requisite to get our RPi to netboot we need to toggle a one-time switch through software. After doing this the RPi will take several seconds longer to boot-up, even if it's using an internal SD Card.

Three main components make up net-booting:

* [tftp server](https://en.wikipedia.org/wiki/Trivial_File_Transfer_Protocol) - serves the kernel to the remote RPi - i.e. the contents of `/boot/`
* [NFS](https://en.wikipedia.org/wiki/Network_File_System) server - serves the root partition i.e. `/` using a network file system.
* DHCP server - this is either a new DHCP server you run on the serving RPi or a "proxy" which only configures net-booting parameters. Normally a DHCP gives out IP addresses to hosts on your network.

> Note: netboot will not work over WiFi.

Let's look at some of issues the found with the setup:

### Docker

[Docker](https://www.docker.com) uses a [copy-on-write (COW) filesystem](https://en.wikipedia.org/wiki/Copy-on-write) to run [containers](https://en.wikipedia.org/wiki/Docker_(software)) such as overlay2. This will not run on a filesystem mounted by [NFS](https://en.wikipedia.org/wiki/Network_File_System) - you can't even `pull` an image. Alternatives mentioned include using VFS which duplicates all data rather than using COW - I tested it and it didn't work at all. I couldn't start a container

Another work-around for this is to create a [loopback filesystem](http://tldp.org/HOWTO/Cryptoloop-HOWTO/loopdevice-setup.html) on the NFS mount and then create an ext4 filesystem for Docker. This also didn't work. I couldn't start a container.

My last option for getting Docker to work is to add some iSCSI storage to the network and to mount that - or to [boot directly from an iSCSI target](https://stuff.drkn.ninja/post/2016/11/08/Net-boot-(PXE-iSCSI)-with-a-RaspberryPi-3). My concern is that this may be beyond `dnsmasq` and may need me to run a second full DHCP server in the network (not good).

### Reliability

It may need more testing but from my experience netbooting all morning, it appears the RPi3 only appears to boot over the network one in five or ten times that I power cycle. The blog post by the RPi foundation mentions that there may be some issues including potential problems at the network switch level.

### Multiple clients

The configuration provided by the RPi foundation will allow multiple RPis to boot - but they will share the same `cmdline.txt` as specified by the TFTP setting. That means they'll both share the same root partition. This is not ideal and means we can't apply customizations needed for containers or other clustering software.

The `dnsmasq` tool has a cryptic configuration - but there is potentially some [hope in a patch raised in April 2017](http://lists.thekelleys.org.uk/pipermail/dnsmasq-discuss/2017q2/011381.html) to allow a different TFTP root to be assigned per MAC address (the unique network identifier of each RPi).

I don't know whether the patch was merged or how old the package is for Raspbian Stretch.

There is a work-around in the Raspberry Pi bootloader which will enable unique TFTP roots per device. This isn't mentioned in [the tutorial](https://www.raspberrypi.org/documentation/hardware/raspberrypi/bootmodes/net_tutorial.md) but I found it [elsewhere on the site](https://www.raspberrypi.org/documentation/hardware/raspberrypi/bootmodes/net.md).

If you can find the serial number of the RPi it will first request `serialnumber/start.elf`.  Once I've tested it I'll update the blog. You can find the serial number in `/proc/cpuinfo`.

## Conclusion

While net-booting has obvious advantages for computers that rely on flash disks for all their storage there are more problems than solutions at the moment - especially if you want to use containers. If I can find time this year then I will look into multiple TFTP roots and iSCSI targets either for booting or mounting at run-time.

* Should you try net-booting?

Yes, if you like tinkering with things and getting into the technical details of networking. It's very cool to see the RPi booting from the network and I think it would be fun to do some benchmarking to see performance when the network filesystem is backed by an SSD or modern PC.

* So should you build a Raspberry Pi cluster?

I would say yes - absolutely. You don't need x30 nodes. I recommend starting with a minimum of x3-6 and my [Kubernetes/Docker Swarm Homelab tutorial series](https://blog.alexellis.io/serverless-kubernetes-on-raspberry-pi/).

Have you been able to get further than this? Send me a Tweet or follow me on Twitter [@alexellisuk](https://twitter.com/alexellisuk).

**You may also like:**

* [Official Raspberry Pi netbooting tutorial](https://www.raspberrypi.org/documentation/hardware/raspberrypi/bootmodes/net_tutorial.md)

* [My 12 Days of Tech Christmas - Part 1](https://blog.alexellis.io/your-12-days-of-tech-christmas/)

* [OpenFaaS - Serverless Functions Made Simple](https://github.com/openfaas/faas/) (on GitHub)

**Share on Twitter**

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">The state of netbooting Raspberry Pis - <a href="https://t.co/nT24wdXWxH">https://t.co/nT24wdXWxH</a> w/ <a href="https://twitter.com/Raspberry_Pi?ref_src=twsrc%5Etfw">@Raspberry_Pi</a> <a href="https://twitter.com/Docker?ref_src=twsrc%5Etfw">@Docker</a> <a href="https://twitter.com/BitScopeDesigns?ref_src=twsrc%5Etfw">@BitScopeDesigns</a> <a href="https://twitter.com/kubernetesio?ref_src=twsrc%5Etfw">@kubernetesio</a> <a href="https://twitter.com/kubernetesonarm?ref_src=twsrc%5Etfw">@kubernetesonarm</a> <a href="https://t.co/2XcsXl9pkG">pic.twitter.com/2XcsXl9pkG</a></p>&mdash; Alex Ellis (@alexellisuk) <a href="https://twitter.com/alexellisuk/status/945632000853135360?ref_src=twsrc%5Etfw">December 26, 2017</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>