---
title: "First Impressions: Asus Tinkerboard and Docker"
slug: "first-impressions-asus-tinkerboard"
date: "2018-01-09T08:30:00Z"
author: "Alex Ellis"
meta_title: "First Impressions: Asus Tinkerboard and Docker"
meta_description: "Join me for my First Impressions of the Asus Tinkerboard with 2GB RAM and Gigabit Ethernet as I install Docker and Kubernetes on ARM for a high-end home lab"
feature_image: "/content/images/2018/01/pexels_containers_header.jpg"
tags:
  - "kubernetes"
  - "tinkerboard"
  - "soc"
  - "docker"
  - "asus"
  - "arm"
---

I've spent many hours playing with both 32-bit and 64-bit ARM System-on-Chip (SoC) boards, so you may be wondering why I ordered another - the Asus Tinkerboard. Well here are my first impressions with the board as I try to get Docker and Kubernetes up and running.

## Highlights

The Asus Tinkerboard looks like a Raspberry Pi and has a similar form-factor, but it's a much more powerful board than the Raspberry Pi with double the RAM and potentially 10x more Ethernet bandwidth available. You also get a heat-sink included and a warning that the board can run quite hot.

![](https://scontent-lhr3-1.cdninstagram.com/t51.2885-15/e35/26073975_1356665261145700_1180227102788550656_n.jpg)

These three points combined are what interested me in this board.

* 32-bit ARMv7 quad-core processor
* 2GB RAM
* Gigabit Ethernet
* Raspberry Pi form-factor

I would have also liked to have seen USB 3.0 or an on-board SATA connector. It seems like you can't quite have everything you want.. yet.

On the cost front this was around 50% more expensive than a Raspberry Pi Model 3 which is normally 30-35GBP - the Tinkerboard can be had at the moment at a reduced price of 46.99GBP but retails at 51.99GBP. That does add up quickly - imagine building an 8-node cluster at those prices.

> Note: Just like the Raspberry Pi Zero - (at Amazon UK at least) these are limited to one per person, but you can buy from multiple stores.

UK stores I used:

* [Amazon.co.uk](https://www.amazon.co.uk/ASUS-GB-SBC-Tinker-Board/dp/B01N35PQ9U) 
* [Currys / PCWorld](https://www.currys.co.uk/gbuk/computing-accessories/components-upgrades/single-board-computers/asus-tinker-board-10158412-pdt.html?istCompanyId=bec25c7e-cbcd-460d-81d5-a25372d2e3d7&istItemId=xiqqtqarlm&istBid=tztx&srcid=198)

You will probably want to buy at least two or three so that you can create a networked cluster.

For a full list of features [read Asus' site](https://www.asus.com/uk/Single-Board-Computer/Tinker-Board/) for detailed specifications.

## Operating systems

The board's standard OS is TinkerOS - a Linux variant of Debian 9. I've also read that Android is available but that doesn't interest us here. While Android may use forms of containerisation under the hood it doesn't mix with Docker containers.

Rather than trying TinkerOS I flashed Armbian's release of Ubuntu 16.04.03. The stable build on the download page contains a full desktop, but if you want to run the board headless (like I do) then you can find a smaller image on the ["other downloads"](https://www.armbian.com/tinkerboard/) link.

I initially used the stable image but had to swap to the nightly build due to a missing kernel module for Kubernetes networking. Having looked this up on Google I found the nightly build contained the fix to turn on the missing module.

## Setup

* Discovering the device

A note on discovery - it seems that mdns is not running by default. On the RPi mdns allows the address of a host to be found through "hostname.local".

So I used nmap as root to discover the Tinkerboard on my home network: `sudo nmap -sP 192.168.0.0/24` - look for the manufacturer info of "Asustek".

* Logging in

The username is `root` and the password is `1234`. Upon initial login the password is changed and you add a normal user-account i.e. `alex`.

Before we get started it is worth generating a new machine-id:

```
$ cat /etc/machine-id \
  && sudo rm -rf /var/lib/dbus/machine-id \
  && sudo rm -rf /etc/machine-id \
  && sudo dbus-uuidgen --ensure \
  && sudo systemd-machine-id-setup \
  && cat /etc/machine-id 
```

* Networking

I also found some issues with the IP addresses changing or the networking adapter going offline upon reboot. You can let network-manager manage the device instead.

```
sudo cp /etc/network/interfaces.network-manager /etc/network/interfaces
```

Now you can configure an IP address by DHCP or statically with the `nmtui` CLI tool.

* Hostname, locale etc

You can set the hostname, locale etc by using command-line utilities and hacking files in `/etc/` but Arabian provides a handy CLI tool called `armbian-config` to make this easier - it is similar to `raspi-config`.

### Docker 

Installing Docker is straight-forward and works immediately:

```
$ curl -sL https://get.docker.com | sh

...

$ docker version
Client:
 Version:	17.12.0-ce
 API version:	1.35
 Go version:	go1.9.2
 Git commit:	c97c6d6
 Built:	Wed Dec 27 20:13:32 2017
 OS/Arch:	linux/arm

Server:
 Engine:
  Version:	17.12.0-ce
  API version:	1.35 (minimum version 1.12)
  Go version:	go1.9.2
  Git commit:	c97c6d6
  Built:	Wed Dec 27 20:09:42 2017
  OS/Arch:	linux/arm
  Experimental:	false
```

### Kubernetes

Kubernetes can be installed using my [Raspbian Pi guide](https://gist.github.com/alexellis/fdbc90de7691a1b9edb545c17da2d975) but the most important step is the following which installs `kubectl` and `kubeadm`:

```
$ curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add - && \
  echo "deb http://apt.kubernetes.io/ kubernetes-xenial main" | sudo tee /etc/apt/sources.list.d/kubernetes.list && \
  sudo apt-get update -q && \
  sudo apt-get install -qy kubeadm
```

* Then turn off swap:

Kubernetes 1.8/1.9+ will not work if swap is enabled.

```
sudo systemctl disable zram-config
sudo swapoff -a
```

> Update as of 27/12/2018 it appears you need to edit `/etc/default/armbian-zram-config` and set `ENABLED=false`.

Check if you have any swap partitions in `/etc/fstab` - if you do - then comment them out too.

Now you can initialize a testing cluster with `kubeadm`

```
sudo kubeadm init --token-ttl=0
```

> Tip: I would advise setting up a static IP for Kubernetes masters and workers.

* Join workers

You'll get a join token printed out at this point, so you should keep hold of that for later. When you want to add a worker you run through the tutorial just before the `kubeadm init` step and do a `kubectl join` instead.

* Check the nodes

With the nightly image instead of the "stable" image it works!

```
$ kubectl get nodes
NAME          STATUS     ROLES     AGE       VERSION
tinkerboard   NotReady   master    25m       v1.9.1
```

Now install a networking driver for Kubernetes:

```
$ kubectl apply -f https://git.io/weave-kube-1.6
serviceaccount "weave-net" created
clusterrole "weave-net" created
clusterrolebinding "weave-net" created
role "weave-net-kube-peer" created
rolebinding "weave-net-kube-peer" created
daemonset "weave-net" created
```

You should see the master node to to "Ready" status. At this point you can start adding new nodes into the cluster or if you only have a single node [taint the master](https://kubernetes.io/docs/setup/independent/create-cluster-kubeadm/) so it can run containers.

```
$ kubectl taint nodes --all node-role.kubernetes.io/master-
node "tinkerboard" untainted
```

The cluster is now up and running with a single node and you can run a Pod:

```
$ kubectl get nodes
NAME          STATUS    ROLES     AGE       VERSION
tinkerboard   Ready     master    27m       v1.9.1
```

The `kubectl` command is slower than on a regular PC or cloud node - getting the status of a single node took 0.8s, but on an RPi3 it was around 3-5s - so we already have an improvement.

> One of the many differences between Docker Swarm and Kubernetes is that Kubernetes is memory-hungry and so it cannot run on boards with 512MB RAM. At this point I'm already seeing almost 0.5/2.0GB of memory used so that makes the Tinkerboard better suited to running a cluster than the RPi3.

* Running `kubectl` from your laptop

You can copy the .kube directory from the master to your laptop and use the `kubectl` binary to administrate the cluster.

If you have an existing .kube directory then you can create a new folder (i.e. .kube-rpi) and point `kubectl` at that:

```
$ export KUBECONFIG=$HOME/.kube-rpi/config
$ kubectl get pods -n kube-system
```

### Example Pod

For an example Pod we can use a simple example container that I developed on the [OpenFaaS](https://www.openfaas.com) function to give back info about a Node's CPU.

```
$ kubectl run nodeinfo --image functions/nodeinfo:latest-armhf --env fprocess="node main.js" --port 8080
deployment "nodeinfo" created
```

Expose a port as a service:
```
$ kubectl expose deploy/nodeinfo
service "nodeinfo" exposed
```

Now find the IP of the service:

```
$ kubectl get svc
NAME         TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)    AGE
kubernetes   ClusterIP   10.96.0.1      <none>        443/TCP    3h
nodeinfo     ClusterIP   10.96.27.153   <none>        8080/TCP   17s
```

And use `curl` to access it using its internal ClusterIP:

```
$ curl -d "verbose" 10.96.27.153:8080
Hostname: nodeinfo-76ddccb6cc-ql8h4

Platform: linux
Arch: arm
CPU count: 4
Uptime: 11814
[ { model: 'ARMv7 Processor rev 1 (v7l)',
    speed: 1608,
...
```

This function will show us the uptime, CPU architecture and core speed. To remove it type the following:

```
$ kubectl delete deploy/nodeinfo
$ kubectl delete svc/nodeinfo
```

If you want something more interesting to test on your cluster then head over to my [Serverless Kubernetes homelab guide with OpenFaaS](https://blog.alexellis.io/serverless-kubernetes-on-raspberry-pi/).

## Wrapping up

Having tested a single Asus Tinkerboard my first impressions are that this is a very capable board and a good upgrade from the Raspberry Pi. The RPi will always have a better community and third-party support - but for creating a home-lab cluster the key things we need are fast I/O and plenty of memory. Having the 32-bit ARMv7 chip means interoperability with Raspberry Pi and other ARM SoCs and while multi-arch binaries and Docker Containers are still in their infancy it's better to focus on 32-bit than a 64-bit ARM platform.

This cluster was put together by my buddy Karol Stepniewski:

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Ok, I&#39;ve got <a href="https://twitter.com/hashtag/kubernetes?src=hash&amp;ref_src=twsrc%5Etfw">#kubernetes</a> running on 4 nodes Asus Tinkerboard ARM cluster with ARMbian (with some ultra-advanced cooling), and it&#39;s a beast! Oh, did I mention it runs <a href="https://twitter.com/openfaas?ref_src=twsrc%5Etfw">@openfaas</a> like a champ?<br><br>Blog post incoming! <a href="https://t.co/CiqnSPiPb7">pic.twitter.com/CiqnSPiPb7</a></p>&mdash; Karol Stepniewski (@kars7e) <a href="https://twitter.com/kars7e/status/948122096969818113?ref_src=twsrc%5Etfw">January 2, 2018</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> 

He is really pleased with the setup and has a [312GB WD PiDrive](http://wdlabs.wd.com/category/wd-pidrive/) connected to each ARM board mounted under `/var/` so that his containers run there and don't wear down his SD card.

> Closing caveat: as of Kubernetes 1.9 we have observed some networking problems on Raspberry Pi and the Asus Tinkerboard too - where one or more node will occasionally disconnect. Check logs with `journalctl -e -u kubelet`

If you're looking to build a home-lab this is certainly a very good option!

### Follow & share

[Follow me on Twitter](https://twitter.com/alexellisuk) and share this blog post with your friends and network.

Read [my blog posts on Kubernetes](https://blog.alexellis.io/tag/kubernetes/)

Acknowledgements: Karol Stepniewski inspired me to try this SoC board after building his home-lab pictured above.