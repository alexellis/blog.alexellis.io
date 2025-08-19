---
title: "How to fix Docker for Raspbian Buster"
slug: "how-to-fix-docker-for-raspbian-buster"
date: "2019-07-15T19:36:29Z"
author: "Alex Ellis"
meta_title: "How to fix Docker for Raspbian Buster"
meta_description: "Learn how to fix installation errors when installing Docker on your new Raspberry Pi with Raspbian Buster."
tags:
  - "Raspberry PI"
  - "kubernetes"
  - "docker"
  - "cncf"
  - "k3s"
---

You may have tried to install Docker on your Raspberry Pi using the installation script provided by Docker Inc, but you've run into a problem. I'm going to help you work around the problem in this short post.

When you tried to install `docker`, you probably got an error like this:

```sh
# curl -fSLs https://get.docker.com | sudo sh

Error cannot install / no package found.
```

What does that mean? It means that the Docker Inc. team have not yet published a package for the [Raspbian Buster](https://www.raspberrypi.org/blog/buster-the-new-version-of-raspbian/) release. You may even be following a blog post or tutorial that specifically says that you need to use Raspbian Stretch.

On June 20th 2019 I raised [an issue](https://github.com/moby/moby/issues/39417) on Docker's [*moby* repository](https://github.com/moby/moby/) and they are aware of the problem. Unfortunately we'll have to wait for Docker to publish the packages, before we can use the utility script to install it.

## Pick up a Raspberry Pi 4

At time of writing, the RPi4 with 4GB RAM is the best option for building and running Docker images. It is also well suited to running Kubernetes using k3s and [k3sup](https://k3sup.dev/)

<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//ws-na.amazon-adsystem.com/widgets/q?ServiceVersion=20070822&OneJS=1&Operation=GetAdHtml&MarketPlace=US&source=ac&ref=qf_sp_asin_til&ad_type=product_link&tracking_id=alexellisuk-20&marketplace=amazon&region=US&placement=B07WBZM4K9&asins=B07WBZM4K9&linkId=453571ae2ec3562fe90f27df19c60198&show_border=false&link_opens_in_new_window=false&price_color=333333&title_color=0066c0&bg_color=ffffff">
    </iframe>
    
[Raspberry Pi 4 - 4GB](https://www.amazon.com/gp/product/B07WBZM4K9/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=B07WBZM4K9&linkCode=as2&tag=alexellisuk-20&linkId=dca8843f922ba9d6c1c903b281bcd835)

## The workarounds

1) Revert to Raspbian Stretch - Stretch works perfectly well and I can see no reason to upgrade, unless you're using RPi4 which seems to require it.

* [Download Raspbian Stretch here](https://downloads.raspberrypi.org/raspbian_lite/images/raspbian_lite-2019-04-09/)

2) Install the Stretch packages on Buster.

It turns out that the Docker packages for Raspbian Stretch actually work without modifications on Raspbian Buster, so we can just use those and install them using `dpkg`.

```sh
wget https://download.docker.com/linux/debian/dists/buster/pool/stable/armhf/containerd.io_1.2.6-3_armhf.deb
wget https://download.docker.com/linux/debian/dists/buster/pool/stable/armhf/docker-ce-cli_18.09.7~3-0~debian-buster_armhf.deb
wget https://download.docker.com/linux/debian/dists/buster/pool/stable/armhf/docker-ce_18.09.7~3-0~debian-buster_armhf.deb

dpkg -i containerd.io_1.2.6-3_armhf.deb
dpkg -i docker-ce-cli_18.09.7~3-0~debian-buster_armhf.deb
dpkg -i docker-ce_18.09.7~3-0~debian-buster_armhf.deb
sudo usermod pi -aG docker
```

That's it, now log out and log in again.

You can [download Raspbian Buster here](https://www.raspberrypi.org/downloads/raspbian/)

## What next?

> Did you like the blog post? **Follow me on [Twitter @alexellisuk](https://twitter.com/alexellisuk)** for more.

Subscribe to [issue #39417](https://github.com/moby/moby/issues/39417) so that you can find out when this workaround is no-longer required.

> 7th August 2019: I wanted to update everyone and let you know that Docker has published an apt package for Raspbian Buster. You'll no-longer require the work-arounds.

* [Install k3s (light-weight Kubernetes) on your Raspberry Pi](https://github.com/teamserverless/k8s-on-raspbian#pick-k3s)
* [Follow me on Twitter @alexellisuk](https://twitter.com/alexellisuk)

You can hire me for advise on Cloud Native architecture, design and computing. [Schedule a drop-in session via my Calendly](https://calendly.com/alexellis).