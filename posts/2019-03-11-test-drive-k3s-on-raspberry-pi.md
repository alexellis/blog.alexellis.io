---
title: "Will it cluster? k3s on your Raspberry Pi"
slug: "test-drive-k3s-on-raspberry-pi"
date: "2019-03-11T08:30:00Z"
author: "Alex Ellis"
meta_title: "Will it cluster? k3s on your Raspberry Pi"
meta_description: "Join me as I test-drive the smallest ever Kubernetes distribution k3s. Find out how this runs on Raspberry Pi compared to kubeadm with Docker."
feature_image: "/content/images/2019/03/crop-bookcase-books-bookshelves-256541.jpg"
tags:
  - "kubernetes"
  - "k3s"
  - "open source"
  - "learn-k8s"
  - "k3sup"
  - "bare-metal"
  - "arm"
  - "arkade"
---

In this post we'll test-drive [k3s](https://github.com/rancher/k3s) which is a stripped-down Kubernetes distribution from [Rancher Labs](https://rancher.com/). With a single binary and a one-line bootstrap process it's even easier than before to create a light-weight cluster. So grab your [Raspberry Pi](https://raspberrypi.org) and get ready to deploy the smallest Kubernetes distribution ever.

You may have seen my previous work with Kubernetes and Docker on Raspberry Pi such as [Build your own bare-metal ARM cluster](https://blog.alexellis.io/build-your-own-bare-metal-arm-cluster/). I'm hoping that this post will be a lot simpler to follow, with fewer workarounds and even more resources left over for your projects to consume.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Yes folks, that&#39;s an x5 Raspberry Pi! <a href="https://twitter.com/Raspberry_Pi?ref_src=twsrc%5Etfw">@Raspberry_Pi</a> from <a href="https://twitter.com/miniNodes?ref_src=twsrc%5Etfw">@miniNodes</a> with full gigabit <a href="https://t.co/SuM8jaBu4k">pic.twitter.com/SuM8jaBu4k</a></p>&mdash; Alex Ellis (@alexellisuk) <a href="https://twitter.com/alexellisuk/status/1104864082329567232?ref_src=twsrc%5Etfw">March 10, 2019</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> 

*Featured: Raspberry Pi x5 Compute Module (COM) holder with Gigabit ethernet, from [mininodes.com](https://www.mininodes.com/)*

## Why k3s?

[Darren Shepherd](https://github.com/ibuildthecloud), Chief Architect at Rancher Labs is known for building simple solutions and accessible user-experiences for distributed systems. k3s is one of his latest experiements to reduce the footprint and bootstrap-process of Kubernetes to a single binary.

The k3s binary [available on GitHub](https://github.com/rancher/k3s) comes in at around 40mb and bundles all the low-level components required such as containerd, runc and even `kubectl`. `k3s` can take the place of `kubeadm` which started as part of a response from the Kubernetes community to up their game for user-experience of bootstrapping clusters.

`kubeadm` is now able to create production-ready multi-master clusters, but is not well-suited for the Raspberry Pi. This is because it assumes hosts have high CPU/memory and low-latency. When I ran through the installation for `k3s` the first time it was several times quicker to boot up than `kubeadm`, but the important part was that it worked first-time, every time without any manual hacks or troubleshooting.

> Note: k3s just like Kubernetes, also works on armhf (Raspberry Pi), ARM64 (Packet/AWS/Scaleway) and x86_64 (regular PCs/VMs).

## Pre-reqs

I'll list the pre-requisites and add some affiliate links to Amazon US.

* At least 2 of: Raspberry Pi 2B/3B/3B/4+ (ARMv7)

    > The Raspberry Pi Zero and first-gen RPi (armv6l) are not compatible with k3s. The main reason is that these devices have very low-powered and so the Kubernetes project does not publish Docker images for this CPU architecture.

    I say that you need two nodes, but one node *can* work if that is all you can spare.

    <a target="_blank" href="https://www.amazon.com/gp/product/B07BDR5PDW/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=B07BDR5PDW&linkCode=as2&tag=alexellisuk-20&linkId=c17881d2d28995ccd2b3d74be84b2b7e">Element14 Raspberry Pi 3 B+ Motherboard</a><img src="//ir-na.amazon-adsystem.com/e/ir?t=alexellisuk-20&l=am2&o=1&a=B07BDR5PDW" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

    The golden-standard is the 4GB Raspberry Pi 4, if you can afford it, I'd recommend getting several:

    <a target="_blank" href="https://www.amazon.com/gp/product/B07WBZM4K9/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=B07WBZM4K9&linkCode=as2&tag=alexellisuk-20&linkId=539a710ac83588c88aea5547b569ea9f">seeed studio Raspberry Pi 4 Computer Model B 4GB</a><img src="//ir-na.amazon-adsystem.com/e/ir?t=alexellisuk-20&l=am2&o=1&a=B07WBZM4K9" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

    <iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//ws-na.amazon-adsystem.com/widgets/q?ServiceVersion=20070822&OneJS=1&Operation=GetAdHtml&MarketPlace=US&source=ac&ref=tf_til&ad_type=product_link&tracking_id=alexellisuk-20&marketplace=amazon&region=US&placement=B07WBZM4K9&asins=B07WBZM4K9&linkId=9cd004d93929b910c2db55afdac3e1a0&show_border=false&link_opens_in_new_window=false&price_color=333333&title_color=0066c0&bg_color=ffffff">
        </iframe>

* SD card

    Whatever you do, don't buy a fake. My personal recommendation:

    <a target="_blank" href="https://www.amazon.com/gp/product/B007JTKLEK/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=B007JTKLEK&linkCode=as2&tag=alexellisuk-20&linkId=72069d86b6c70e1dc49c2f0ce35f08ef">SanDisk 32GB ULTRA microSDHC Card Class 10 (SDSDQUA-032G-A11A)</a><img src="//ir-na.amazon-adsystem.com/e/ir?t=alexellisuk-20&l=am2&o=1&a=B007JTKLEK" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

    > Note: power users may want to look into [booting from a USB stick or external storage](https://www.raspberrypi.org/documentation/hardware/raspberrypi/bootmodes/msd.md) as an alternative. This will generally work out more expensive and less portable

* 5-8 port Ethernet switch

    For something like Kubernetes that depends on low-latency I would strongly encourage against you using WiFi. A 5-port Ethernet switch is very cheap and widely available.

    <a target="_blank" href="https://www.amazon.com/gp/product/B00QR6XFHQ/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=B00QR6XFHQ&linkCode=as2&tag=alexellisuk-20&linkId=9940c9455696127006b304481fa99354">NETGEAR 5-Port Gigabit Ethernet Unmanaged Switch, Desktop, Internet Splitter, Sturdy Metal, Fanless, Plug-and-Play (GS305)</a><img src="//ir-na.amazon-adsystem.com/e/ir?t=alexellisuk-20&l=am2&o=1&a=B00QR6XFHQ" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

* Official power-supply

    You don't want to be using a random adapter or mobile phone charger. Get the official adapter so you're sure the RPi has enough power.

    <a target="_blank" href="https://www.amazon.com/gp/product/B01LCNF8FU/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=B01LCNF8FU&linkCode=as2&tag=alexellisuk-20&linkId=8105e6e3b30396738314fbefada435fe">Official Raspberry Pi Foundation 5V 2.5A Power Supply WHITE</a><img src="//ir-na.amazon-adsystem.com/e/ir?t=alexellisuk-20&l=am2&o=1&a=B01LCNF8FU" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

### Clustering parts

If you're running with more than one RPi then buying multiple cases or multiple power adapters can be a false economy.

* Power supply for multiple RPis

    [6-way USB power supply from Anker](https://www.amazon.com/gp/product/B00WI2DN4S/ref=as_li_qf_asin_il_tl?ie=UTF8&tag=alexellisuk-20&creative=9325&linkCode=as2&creativeASIN=B00WI2DN4S&linkId=b3e7cda817eeedbd26f498d14307a0f6)

* Ethernet cables

    I would recommend getting "ribbon" / "flat" cables because regular cables create tension and can pull over your stack of RPis.

    [Ethernet Cable 3 ft Shielded (STP), High Speed Flat RJ45 cable](https://www.amazon.com/gp/product/B07KX2VKCG/ref=as_li_qf_asin_il_tl?ie=UTF8&tag=alexellisuk-20&creative=9325&linkCode=as2&creativeASIN=B07KX2VKCG&linkId=6adc14f5d6f609cf871705629893312a)

* Cases

    [iUniker Raspberry Pi Cluster Case, Raspberry Pi Case with Cooling Fan](https://www.amazon.com/gp/product/B07CTG5N3V/ref=as_li_qf_asin_il_tl?ie=UTF8&tag=alexellisuk-20&creative=9325&linkCode=as2&creativeASIN=B07CTG5N3V&linkId=7dac5539af9e15517eb558913ef533e8)

    [GeauxRobot Raspberry Pi 3 Model B 7-layer Dog Bone Stack](https://www.amazon.com/gp/product/B01D916RNK/ref=as_li_qf_asin_il_tl?ie=UTF8&tag=alexellisuk-20&creative=9325&linkCode=as2&creativeASIN=B01D916RNK&linkId=03dc5521282868a605e582288f3b2187)

    [CLOUDLET CASE: For Raspberry Pi and Other Single Board Computers](https://www.amazon.com/gp/product/B07D5MJ7PQ/ref=as_li_qf_asin_il_tl?ie=UTF8&tag=alexellisuk-20&creative=9325&linkCode=as2&creativeASIN=B07D5MJ7PQ&linkId=df6534f25435a5e2aef3985272fc8447)

    <a target="_blank"  href="https://www.amazon.com/gp/product/B07D5MJ7PQ/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=B07D5MJ7PQ&linkCode=as2&tag=alexellisuk-20&linkId=f849d7b01d099ed2f7630e083d19b7bf"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&MarketPlace=US&ASIN=B07D5MJ7PQ&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=_SL160_&tag=alexellisuk-20" ></a><img src="//ir-na.amazon-adsystem.com/e/ir?t=alexellisuk-20&l=am2&o=1&a=B07D5MJ7PQ" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

## Prepare the RPi

Let's start the tutorial.

### Flash the OS to the SD card

Let's not make things complicated by messing about with bespoke operating systems. The Raspberry Pi team have done a great job with Raspbian and for a headless system Raspbian Lite is easy to use and quick to flash.

* [Download Raspbian Lite](https://www.raspberrypi.org/downloads/raspbian/) 
* Flash to your SD card using [Etcher from Balena](https://www.balena.io/etcher/)
* Mount the SD card and create a text file named "ssh" in the boot partition.

On MacOS you can usually type in: `sudo touch /Volumes/boot/ssh` for this step.

![Etcher.io in action](https://cdn-ak.f.st-hatena.com/images/fotolife/k/kenev/20190311/20190311084525.png)

### Power-up the device & customise it

Now power-up your device. It will be accessible on your network over ssh using the following command:

```
$ ssh pi@raspberrypi.local
```

Log in with the password `raspberry` and then type in `sudo raspi-config`.

Update the following:
* Set the GPU memory split to 16mb
* Set the hostname to whatever you want (write it down?)
* Change the password for the `pi` user

I also highly recommend setting a static IP for each Raspberry Pi in your cluster.

### Copy over your `ssh` key

Do you have an `ssh` key?

```
$ ls -l ~/.ssh/id_rsa.pub
```

If that says file not found, then let's generate a key-pair for use with SSH. This means you can set a complicated password, or disable password login completely and rely on your public key to log into each RPi without typing a password in.

Hit enter to everything:

```
$ ssh-keygen
```

Finally run: `ssh-copy-id pi@raspberrypi.local`

### Enable container features

We need to enable container features in the kernel, edit `/boot/cmdline.txt` and add the following to the end of the line:

```
 cgroup_enable=cpuset cgroup_memory=1 cgroup_enable=memory
```

Now reboot the device.

## Create the `k3s` cluster

Note: during installation `kubectl` will be aliased to the command `k3s kubectl` so that we can use the pre-packaged version of `kubectl`.

If you type in `docker` after the installation, you won't find the command installed. This is because `k3s` uses a low-level component called `containerd` directly.

### Bootstrap the `k3s` server

We can install k3s using a utility script which gets the latest stable version from the [releases page](https://github.com/rancher/k3s/releases) and then installs a systemd service to start k3s automatically.

On one of the nodes log-in and run the following:

```
$ curl -sfL https://get.k3s.io | sh -
```

Check that the systemd service started correctly:

```
$ sudo systemctl status k3s
```

Wait for k3s to start and to download the required images from the Kubernetes registry. This may take a few minutes.

Grab the join key from this node with:

```
$ sudo cat /var/lib/rancher/k3s/server/node-token

K1089729d4ab5e51a44b1871768c7c04ad80bc6319d7bef5d94c7caaf9b0bd29efc::node:1fcdc14840494f3ebdcad635c7b7a9b7
```

### Introducing k3sup (update)

You can now automate the installation and bootstrap of k3s onto any cloud, VM or Raspberry Pi with [k3sup](https://github.com/alexellis/k3sup).

`k3sup` gives you access to `kubectl` in under a minute:

```sh
k3sup install --ip $SERVER --user pi
k3sup join --ip $AGENT --server-ip $SERVER --user pi
```

Try it out to fetch your `KUBECONFIG` for use from your laptop.

Once you have a `KUBECONFIG` from your k3s cluster, or any Kubernetes cluster at all you can use `arkade install` to add things like OpenFaaS, inlets-operator, metrics-sever, nginx, and more. Just check which of the `apps` is available for arm.

Here's an example of how easy it becomes to install OpenFaaS for instance:

```sh
arkade install openfaas
```

You can install the Kubernetes dashboard too:

```sh
arkade install kubernetes-dashboard
```

Feel free to add your *Star* on GitHub for [arkade](https://get-arkade.dev/) and [k3sup](https://k3sup.dev).

### Join a worker

Now log into another node and download the binary as before, moving it to `/usr/local/bin/`.

Now join any number of your worker nodes to the server with the following:

```
$ export K3S_URL="https://192.168.0.32:6443"

$ export K3S_TOKEN="K1089729d4ab5e51a44b1871768c7c04ad80bc6319d7bef5d94c7caaf9b0bd29efc::node:1fcdc14840494f3ebdcad635c7b7a9b7"

$ curl -sfL https://get.k3s.io | sh -
```

If you installed k3s manually using a binary, then you can join your node to the server in this way:

```
$ sudo k3s agent --server ${K3S_URL} --token ${K3S_TOKEN}
```

### List your nodes

```
$ kubectl get node -o wide

NAME   STATUS   ROLES    AGE     VERSION         INTERNAL-IP    EXTERNAL-IP   OS-IMAGE                         KERNEL-VERSION   CONTAINER-RUNTIME
cm3    Ready    <none>   9m45s   v1.13.4-k3s.1   192.168.0.30   <none>        Raspbian GNU/Linux 9 (stretch)   4.14.79-v7+      containerd://1.2.4+unknown
cm4    Ready    <none>   13m     v1.13.4-k3s.1   192.168.0.32   <none>        Raspbian GNU/Linux 9 (stretch)   4.14.79-v7+      containerd://1.2.4+unknown
```

We can see our nodes and that they are using containerd rather than full Docker. This is part of how Darren was able to reduce the footprint.

### Deploy a microservice

We can now log into the k3s server and deploy a microservice. We'll deploy figlet which will take a body over HTTP on port 8080 and return an ASCII-formatted string.

* Create a service (with a NodePort):

Save: `openfaas-figlet-svc.yaml`.

```
cat <<EOF > openfaas-figlet-svc.yaml
apiVersion: v1
kind: Service
metadata:
  name: openfaas-figlet
  labels:
    app: openfaas-figlet
spec:
  type: NodePort
  ports:
    - port: 8080
      protocol: TCP
      targetPort: 8080
      nodePort: 31111
  selector:
    app: openfaas-figlet
EOF
```

* Now create a deployment

The deployment will be used to schedule a Pod using a Docker image published in the [OpenFaaS Function Store](https://github.com/openfaas/store/).

Save: `openfaas-figlet-dep.yaml`.

```
cat <<EOF > openfaas-figlet-dep.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: openfaas-figlet
  labels:
   app: openfaas-figlet
spec:
  replicas: 1
  selector:
    matchLabels:
      app: openfaas-figlet
  template:
    metadata:
      labels:
        app: openfaas-figlet
    spec:
      containers:
      - name: openfaas-figlet
        image: functions/figlet:latest-armhf
        imagePullPolicy: Always
        ports:
        - containerPort: 8080
          protocol: TCP
EOF
```

* Now apply the configuration:

```
$ kubectl apply -f openfaas-figlet-dep.yaml,openfaas-figlet-svc.yaml

deployment.apps/openfaas-figlet created
service/openfaas-figlet created
```

Wait for the figlet microservice to come up:

```
$ kubectl rollout status deploy/openfaas-figlet

deployment "openfaas-figlet" successfully rolled out
```

Now invoke the function:

```
echo -n "I like $(uname -m)" | curl --data-binary @- http://127.0.0.1:31111
 ___   _ _ _                                    _____ _
|_ _| | (_) | _____    __ _ _ __ _ __ _____   _|___  | |
 | |  | | | |/ / _ \  / _` | '__| '_ ` _ \ \ / /  / /| |
 | |  | | |   <  __/ | (_| | |  | | | | | \ V /  / / | |
|___| |_|_|_|\_\___|  \__,_|_|  |_| |_| |_|\_/  /_/  |_|
```

### Share your microservice with your friends

You can use [inlets - The Cloud Native Tunnel](https://docs.inlets.dev/) to create a tunnel to the public Internet for your Raspberry Pi k3s cluster. All you need to do is to create a cheap VPS or EC2 node to get a public IP address that connects back to your cluster.

Why expose your cluster?
* Deploy new versions of your code from CI/CD
* Access dashboards and UIs
* Receive webhooks
* Share the IP with your friends
* Access your APIs, services, and storage on the k3s cluster

The advantage of using inlets is that it's an open source tunnel, which comes with no limitations. You can self-host the tunnel server (exit-server) wherever you like the world and even add a custom DNS entry and TLS for free.

> A [PRO edition](https://github.com/inlets/inlets-pro) is also offered which integrates directly with your Kubernetes IngressController and can fetch TLS certificates from LetsEncrypt.

#### Tunnel to a node with `inletsctl`

You can run a tunnel on one of your nodes, which will connect to your VPS and use its allocated IP as a "Virtual IP". Anyone who hits that IP will be able to access your Raspberry Pi.

[inletsctl](https://github.com/inlets/inletsctl) automates the process of creating a VM and starting the "inlets server" which faces the Internet, but you can also setup your own server if you like.

On our RPi, we run the "inlets client" and when both are deployed, anyone can access our service.

Run this on one of the RPi nodes or the server/master:

```bash
curl -sSLf https://inletsctl.inlets.dev | sudo sh
```

Now create an exit server on DigitalOcean, or pick another provider ([see the project README](https://github.com/inlets/inletsctl)).

```bash
export ACCESS_TOKEN="obtain-from-digitalocean-dashboard"
inletsctl create --provider digitalocean \
  --region lon1 \
  --access-token $ACCESS_TOKEN
```

After the tunnel server has been created, you will receive a command to connect to the tunnel from your RPi.

Pros:
* Easy to set up
* You can set up your exit server manually and install Caddy or Nginx on it
* You can run the server command with systemd to restart it

This is the output from the command:

```bash
Inlets OSS exit-node summary:
  IP: 209.97.132.44
  Auth-token: 10fd0e6e2cdc199a1ebbdd9e78825f8b17392631

Command:
  export UPSTREAM=http://127.0.0.1:8000
  inlets client --remote "ws://209.97.132.44:8080" \
	--token "10fd0e6e2cdc199a1ebbdd9e78825f8b17392631" \
	--upstream $UPSTREAM

To Delete:
	inletsctl delete --provider digitalocean --id "183747947"
```

Now download the OSS inlets client:

```bash
sudo inletsctl download
```

Where you see `UPSTREAM`, you can change this to the NodePort from earlier i.e. `31111`

```
export UPSTREAM=http://127.0.0.1:31111
inlets client --remote "ws://209.97.132.44:8080" \
  --token "10fd0e6e2cdc199a1ebbdd9e78825f8b17392631" \
  --upstream $UPSTREAM
```

Now use the IP you were given i.e. `209.97.132.44` to connect to your service on port `80`. You can run this step from your laptop.

```
$ curl -SLs --data $(whoami) http://209.97.132.44
       _           
  __ _| | _____  __
 / _` | |/ _ \ \/ /
| (_| | |  __/>  < 
 \__,_|_|\___/_/\_\
```

You can check the logs to see if they tried it:

```
$ kubectl logs deploy/openfaas-figlet -f
```

You can even scale up the microservice:

```
$ kubectl scale deploy/openfaas-figlet --replicas=4
```

Then find out which nodes the Pods were created on:

```
$ kubectl get pods -l app=openfaas-figlet -o wide
NAME                               READY   STATUS    RESTARTS   AGE   IP          NODE
openfaas-figlet-8486c9f585-4ks2f   1/1     Running   0          26s   10.42.0.6   cm4 
openfaas-figlet-8486c9f585-d7kpk   1/1     Running   0          26s   10.42.1.3   cm3 
openfaas-figlet-8486c9f585-l7x89   1/1     Running   0          10m   10.42.1.2   cm3 
openfaas-figlet-8486c9f585-nhqj6   1/1     Running   0          25s   10.42.1.4   cm3 
```

#### Tunnel your IngressController

You can use the [inlets-operator](https://github.com/inlets/inlets-operator) project to integrate inlets OSS/PRO with your Kubernetes cluster. The operator will automate everything for you from creating and deleting cloud hosts, to making any LoadBalancer service available with its own IP.

Pros:
* Automatic encryption when using [inlets PRO](https://github.com/inlets/inlets-pro)
* The operator runs as a Deployment, so it is resilient and will restart when needed
* Tunnelling the IngressController means you can get TLS certs
* The IngressController is the native way applications are deployed to production in Kubernetes

See also:

* Video [inlets-operator walkthrough - get a public IP for Kubernetes](https://www.youtube.com/watch?v=2gdqiH2j-Og)
* [Get a LoadBalancer for your private Kubernetes cluster](https://blog.alexellis.io/ingress-for-your-local-kubernetes-cluster/)

### What else can you do with k3s?

We're only scratching the surface here. You can see Darren demo k3s and OpenFaaS in a CNCF Webinar below:

<iframe width="560" height="315" src="https://www.youtube.com/embed/5-5t672vFi4?start=2558" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

#### Try Serverless with OpenFaaS

One way of looking at your cluster is like a big computer. The cluster is your computer. With that in mind we can deploy OpenFaaS - Serverless Functions Made Simple.

It allows you to define a function or endpoint on Kubernetes in a very short period of time with minimal investment and a low learning curve.

You can deploy OpenFaaS to Kubernetes or k3s on ARM using my tutorial or the documentation:

* Blog post: [Serverless Kubernetes home-lab with your Raspberry Pis](https://blog.alexellis.io/serverless-kubernetes-on-raspberry-pi/)

* [Documentation](https://docs.openfaas.com/deployment/kubernetes/#notes-for-raspberry-pi-32-bit-arm-armhf)

You can install OpenFaaS using arkade, a Go CLI that makes installing Kubernetes applications easy.

Run this on your laptop, not on the RPi:

```sh
curl -sSL https://get-arkade.dev | sudo sh

arkade install openfaas
```

Watch for the instructions at the end for how to access OpenFaaS, if you want to see this screen again simply type in `arkade info openfaas`.

The OpenFaaS UI and REST API will be available on port `31112` on each Raspberry Pi in your cluster.

You can customise the configuration with `arkade install openfaas --help`

A [complete OpenFaaS online training workshop is available here](https://github.com/openfaas/workshop), but note that the instructions assume you are using Kubernetes on the cloud, or on a PC.

You should also note that if you create your own functions, that the Docker images need to be built on a Raspberry Pi and not on your PC.

#### See k3s & OpenFaaS auto-scaling on Raspberry Pi 4

<iframe width="560" height="315" src="https://www.youtube.com/embed/DjpVtNjiXSU" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

> In this live walkthrough with my brand new Raspberry Pi 4s, I show you how to install Kubernetes (k3s) to create a cluster and then how to deploy OpenFaaS and see it auto-scale based upon metrics.

## Tear down (optional)

Either run:

```
$ sudo /usr/local/bin/k3s-uninstall.sh
```

Or stop k3s on each node and remove the data directory.

```
$ sudo systemctl stop k3s
$ sudo systemctl disable k3s
$ sudo rm -rf /var/lib/rancher
```

For more information on k3s, see the [page on GitHub](https://github.com/rancher/k3s).

If you created any exit-servers with `inletsctl`, then you can delete them from your DigitalOcen dashboard.

## Wrapping-up

It is very early for k3s on ARM, but at this stage it's certainly more usable than the alternatives. If you're considering building a cluster for tinkering and for learning more about Kubernetes then you can't go wrong with trying k3s.

Next time you setup k3s try out my new tool [k3sup](https://github.com/alexellis/k3sup). It uses your SSH key to bring up k3s on any cloud, VM, or Raspberry Pi and then downloads a `KUBECONFIG` file so that you can use `kubectl` from your own computer.

Did you like the blog post? Follow me on [Twitter @alexellisuk](https://twitter.com/alexellisuk) for more.

### Share your cluster

It would be great to add your build my [Readers' Clusters](https://github.com/teamserverless/k8s-on-raspbian#readers-clusters).

Here's how to take part:

* Write a short blog post on your experiences, learnings or feedback.
* Or Tweet a photo

Then send a Pull Request to the [README.md](https://github.com/teamserverless/k8s-on-raspbian#readers-clusters) file of my k8s-on-raspbian repo.

### Learn how to build your own lab

If you'd like to build your own private cloud, or just learn more about networking, you can pick up [my eBook or video workshop package](https://gumroad.com/l/netbooting-raspberrypi) with 30 USD off until 9th April.

[![My Netbooting workshop for Raspberry Pi with K3s on Gumroad](https://static-2.gumroad.com/res/gumroad-public-storage/variants/64bucn4zp8wzqdf2dldiud3d89up/3298c3eb001bbed90f1d616da66708480096a0a1b6e81bd4f8a2d6e9b831d301)](https://gumroad.com/l/netbooting-raspberrypi)

[Check out my netbooting workshop](https://gumroad.com/l/netbooting-raspberrypi)

### Continue learning more about Kubernetes:

k3s is a compliant Kubernetes distribution which means if you learn k3s, you're learning Kubernetes and as I tweeted earlier last week - it's never too late to start learning Kubernetes and nobody ever got fired for that.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Nobody gets fired for learning Kubernetes. <a href="https://t.co/qI6Rsy0Fp9">https://t.co/qI6Rsy0Fp9</a></p>&mdash; Alex Ellis (@alexellisuk) <a href="https://twitter.com/alexellisuk/status/1104074916570255361?ref_src=twsrc%5Etfw">March 8, 2019</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> 

### You may also like

* If you liked playing with the figlet function then [deploy OpenFaaS](https://docs.openfaas.com/deployment/kubernetes/), the award-winning Serverless project for Kubernetes. You'll be able to create your own microservices and functions for Kubernetes in seconds.

* [k3sup ('ketchup')](https://k3sup.dev) - a tool to build Kubernetes clusters quickly
* [arkade](https://get-arkade.dev) - install Kubernetes apps, the easy way
* Kubernetes-by-example: An oldie, but a goodie from Michael Hausenblas -> [kubernetesbyexample.com](http://kubernetesbyexample.com/)
* [Five tips to move your project to Kubernetes](https://blog.alexellis.io/move-your-project-to-kubernetes/), part of my mini-series on [learn-k8s](https://blog.alexellis.io/tag/learn-k8s/)