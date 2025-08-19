---
title: "Learn how to build your own Kubernetes Homelab with Raspberry Pi"
slug: "raspberry-pi-homelab-with-k3sup"
date: "2019-10-19T13:26:41Z"
author: "Alex Ellis"
meta_title: "Learn how to build your own Kubernetes Homelab with Raspberry Pi"
meta_description: "Learn how to build your own Kubernetes homelab on Raspberry Pi 4 with a single binary called k3sup, the new inlets-operator for Ingress and OpenFaaS."
feature_image: "/content/images/2019/10/harrison-broadbent-hSHNPyND_dU-unsplash.jpg"
tags:
  - "rpi"
  - "inlets-operator"
  - "openfaas-cloud"
  - "homelab"
  - "serverless"
  - "Raspberry PI"
  - "kubernetes"
  - "inlets"
  - "k3sup"
  - "k3s"
  - "k8s"
  - "video"
  - "course"
  - "learning"
  - "labs"
---

I recently built a tool called [k3sup or ('ketchup')](https://k3sup.dev) which installs Kubernetes on any PC, VM or [Raspberry Pi](https://www.raspberrypi.org/) using [k3s from Rancher](https://k3s.io/). k3s is a super light-weight Kubernetes distribution perfect for the edge, IoT and embedded systems.

In this post I'll share my new Insiders video with you "Kubernetes Homelab with Raspberry Pi 4" and the tools and links you need to try everything out at home.

k3sup started off as a wrapper for the k3s installation scripts, but after feedback from the community, it quickly gained a command to build clusters.

The next step for k3sup was the ability to install projects built for Kubernetes with the `k3sup app install` command. This got so popular, with 40 apps that a new CLI was spun out called [arkade](https://get-arkade.dev).

In this video I'll show you how to use a single binary to setup a Kubernetes cluster on your Raspberry Pi 4, how to install OpenFaaS, and how to get a public IP on the Internet for your RPi homelab.

You may also like: [Expose your local OpenFaaS functions to the Internet](https://inlets.dev/blog/2020/10/15/openfaas-public-endpoints.html).

> Updated: Feb 2021 - "k3sup app install" is now its own CLI called arkade, plus additional syntax was added for the inlets-operator.

## Watch the video

<iframe width="560" height="315" src="https://www.youtube.com/embed/qsy1Gwa-J5o" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Since the video was published, inlets-operator now requires a license key for inlets PRO. The "app" command in k3sup moved to the new [arkade](https://get-arkade.dev) CLI. Everything else should work as described in the video.

## `k3sup` reference

Here's a quick reference for k3sup, that you can also find on the [project homepage](https://k3sup.dev/). 

> You can use k3sup with any VM or PC, you just need SSH access. It also works with ARMHF (Raspberry Pi) and ARM64 (Equinix Metal/AWS Graviton).

* Get the tool or update

    ```sh
    curl -SLsf https://get.k3sup.dev | sudo sh
    ```

* Start a new cluster

    ```sh
    k3sup install --ip $SERVER_IP --user pi
    ```

* Join an agent/worker into the cluster

    ```sh
    k3sup join --ip $AGENT_IP --server-ip $SERVER_IP --user pi
    ```

* Install OpenFaaS on ARMHF, ARM64 or a PC/VM

    ```sh
    arkade install openfaas
    ```

    `k3sup` actually works on any Kubernetes cluster, so if you like the tool, you can use it to install OpenFaaS.

## inlets-operator

The other part of the video showed the [inlets-operator](https://github.com/inlets/inlets-operator). It gave us a public IP for our cluster within a matter of seconds.

> Having a public IP isn't strictly necessary, but it can be a great way to share your work and integrate with third-party systems and event-sources like GitHub, Strava, and Stripe.

There's simply three steps needed to get public IPs for your local cluster.

> Note these steps may have changed a little since the original video was rceorded.

The Operator obtains a public IP for you by creating a low-cost VM on [DigitalOcean](https://digitalocean.com/), [Equinix Metal](https://metal.equinix.com/) and around half a dozen other providers are also supported. The DigitalOcean Droplet costs around 5 USD / mo.

See instructions for other clouds here: [inlets-operator reference](https://docs.inlets.dev/reference/inlets-operator/)

1. Create an API key on your DigitalOcean account

    Save it as `~/Downloads/do-access-token`

2. Get an inlets-pro trial, or purchase a personal license at [inlets.dev](https://inlets.dev/pricing).

    Save your JWT to `$HOME/.inlets/LICENSE`.

2. Install the inlets-operator

    ```sh  
    curl -sSLf https://get.arkade.dev | sudo sh
    
    arkade install inlets-operator \
      --token-file=$HOME/Downloads/do-access-token \
      --license-file=$HOME/.inlets/LICENSE
    ```
    
3. Install an Ingress Controller

    If you're using k3s, you should have Traefik 1.0 installed, otherwise, install ingress-nginx with: `arkade install ingress-nginx`
    
    Look up the public IP address of ingress-nginx or traefik as created by the inlets-operator:
    
    ```sh
    # For traefik
    kubectl get svc/traefik -n kube-system -o wide 

    # For ingress-nginx
    kubectl get svc -n default -o wide
    ```
    
    Create a DNS A record from the IP address to your domain for the OpenFaaS gateway such as `openfaas.example.com`
    
4. Install cert-manager

    [cert-manager](https://cert-manager.io) will obtain free TLS certificates for your HTTP services like the OpenFaaS gateway
    
5. Get a certifcate for the OpenFaaS gateway

    ```sh
    export DOMAIN="openfaas.example.com"
    arkade install openfaas-ingress --domain $DOMAIN --email webmaster@$DOMAIN
    ```
    
    In a short period of time, you'll be able to access your OpenFaaS UI and run `faas-cli login` with the URL `https://openfaas.example.com`

### CNCF Landscape and new logo

Oh, and here's a small announcement I'm happy to share:

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Really excited to see <a href="https://twitter.com/inletsdev?ref_src=twsrc%5Etfw">@inletsdev</a> growing up and leaving home with its own <a href="https://twitter.com/github?ref_src=twsrc%5Etfw">@github</a> org and a place on the <a href="https://twitter.com/CloudNativeFdn?ref_src=twsrc%5Etfw">@CloudNativeFdn</a> Landscape.<br><br>A big thank you to <a href="https://twitter.com/iboonox?ref_src=twsrc%5Etfw">@iboonox</a> for providing a logo. Website will be coming soon.<br><br>Check it out, give it a ⭐️<a href="https://t.co/5pPjk2MlpH">https://t.co/5pPjk2MlpH</a> <a href="https://t.co/NuDqCgkN5g">pic.twitter.com/NuDqCgkN5g</a></p>&mdash; Alex Ellis (@alexellisuk) <a href="https://twitter.com/alexellisuk/status/1184544960198205442?ref_src=twsrc%5Etfw">October 16, 2019</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

The inlets project now has its own GitHub organisation: [github.com/inlets/inlets](https://github.com/inlets/inlets) and is listed on the CNCF Landscape

## Get the materials

You may already have the parts, but if you don't, feel free to check out these affiliate links on Amazon. If you're in the UK and in Europe, you may prefer to use [Pimoroni](https://shop.pimoroni.com/).

* RPi4 with 4 GB RAM

<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//ws-na.amazon-adsystem.com/widgets/q?ServiceVersion=20070822&OneJS=1&Operation=GetAdHtml&MarketPlace=US&source=ac&ref=qf_sp_asin_til&ad_type=product_link&tracking_id=alexellisuk-20&marketplace=amazon&region=US&placement=B07WBZM4K9&asins=B07WBZM4K9&linkId=c72b742b9f0f667b0144f568e45b2135&show_border=false&link_opens_in_new_window=false&price_color=333333&title_color=0066c0&bg_color=ffffff">
    </iframe>

* Wrap-around case with built-in aluminium heatsink

<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//ws-na.amazon-adsystem.com/widgets/q?ServiceVersion=20070822&OneJS=1&Operation=GetAdHtml&MarketPlace=US&source=ac&ref=qf_sp_asin_til&ad_type=product_link&tracking_id=alexellisuk-20&marketplace=amazon&region=US&placement=B07VNG884X&asins=B07VNG884X&linkId=c78d2ed4e7617181ec183e357fdae09c&show_border=false&link_opens_in_new_window=false&price_color=333333&title_color=0066c0&bg_color=ffffff">
    </iframe>

* 32GB Sandisk SD card

<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//ws-na.amazon-adsystem.com/widgets/q?ServiceVersion=20070822&OneJS=1&Operation=GetAdHtml&MarketPlace=US&source=ac&ref=qf_sp_asin_til&ad_type=product_link&tracking_id=alexellisuk-20&marketplace=amazon&region=US&placement=B00CNYV942&asins=B00CNYV942&linkId=7ef956670f5ed0d7327e5138bde24612&show_border=false&link_opens_in_new_window=false&price_color=333333&title_color=0066c0&bg_color=ffffff">
    </iframe>

## Take it further

Are there other apps or helm charts you'd like to see in `arkade`? Raise an issue, or propose it via [OpenFaaS Slack](https://slack.openfaas.io)

Want to be the first to get exclusive content from my channel and open source projects? This video was released a week early for my Insiders.

> Become an Insider via [GitHub Sponsors](https://insiders.openfaas.io)

Related posts:

* [Multi-master HA Kubernetes in < 5 minutes](https://blog.alexellis.io/multi-master-ha-kubernetes-in-5-minutes/)
* [Cooling off your Raspberry Pi 4](https://blog.alexellis.io/cooling-off-your-rpi4/)
* [Will it cluster? k3s on RPi](https://blog.alexellis.io/test-drive-k3s-on-raspberry-pi/)
* [Expose your local OpenFaaS functions to the Internet](https://inlets.dev/blog/2020/10/15/openfaas-public-endpoints.html)

Tools:

* [alexellis/k3sup](https://k3sup.dev)
* [alexellis/arkade](https://get-arkade.dev)
* [inlets/inlets-operator](https://github.com/inlets/inlets-operator)