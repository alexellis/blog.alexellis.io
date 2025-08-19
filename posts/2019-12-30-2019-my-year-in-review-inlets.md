---
title: "2019 My year in review: inlets"
slug: "2019-my-year-in-review-inlets"
date: "2019-12-30T17:43:23Z"
author: "Alex Ellis"
meta_title: "2019 My year in review: inlets inlets proxy and tunnel"
meta_description: "inlets was a big part of my 2019 and I wanted to write up a bit of the story and how you can use it to expose and tunnel your own services."
feature_image: "/content/images/2019/12/bg-inlets.jpeg"
tags:
  - "inlets"
  - "networking"
  - "inlets-operator"
  - "tunnels"
  - "kubernetes"
---

I started a new OSS project over the holidays last year, it was a side-project and not meant to be anything big.

My team at the time needed a way to receive webhooks from GitHub to test CI/CD for [OpenFaaS Cloud](https://github.com/openfaas/openfaas-cloud/). The obvious options didn't work - we couldn't use Ngrok because it was banned by corporate policy and we couldn't use other tooling due to port blocking. I explored some of the other tooling out there, but the team had no budget. 

I wanted to create a simple solution using Golang and websockets so that we could receive webhooks through HTTP. The reason this works through private networks is that the client speaks first, and then establishes the persistent connection.

![](https://blog.alexellis.io/content/images/2019/09/inletsio--2-.png)

> The classic use-case for a tunnel is to receive webhooks from GitHub and other API providers.

The project was called inlets and the 1.0 release received [lots of comments on Hacker News](https://news.ycombinator.com/item?id=19189455), this was enough to convince me to spend more time on the project.

## inlets

inlets is a reverse-proxy and L7 HTTP tunnel that allows users behind NAT, firewalls, and those within private networks to expose their local services to the Internet.

> The project has over 5k GitHub stars and 30 contributors. Follow the official Twitter account for news and updates - [@inletsdev](https://twitter.com/inletsdev)

Inlets is formed of a server and client component. We run the client on our computer and then the server on a VM or host which has a public IP. The cheapest option would be something like a DigitalOcean droplet at 5 USD / mo.

![](https://raw.githubusercontent.com/alexellis/inlets/master/docs/inlets.png)

> You can even share local websites made with create-react-app and cloud native tools like Prometheus, Grafana, and OpenFaaS.

[Darren Shepherd](https://twitter.com/ibuildthecloud) made some contributions and replaced some of my bespoke websocket code with a library used in Rancher, that became the [2.0 release](https://news.ycombinator.com/item?id=20410552) which received even more comments and upvotes.

After the initial success of inlets I developed [inlets-pro](https://github.com/inlets/inlets-pro-pkg) which adds L4 / TCP proxying and automatic TLS. You can now expose any kind of service to the Internet such as [Caddy](https://github.com/inlets/inlets-pro-pkg/blob/master/docs/caddy-tutorial.md) or [CassandraDB](https://github.com/inlets/inlets-pro-pkg/blob/master/docs/cassandra-tutorial.md). The first thing I tried with inlets-pro was to run Kubernetes on my Intel NUC along with [cert-manager](https://github.com/jetstack/cert-manager) to get a TLS certificate directly on the computer plugged in to my home network.

Inlets also gained a logo, a GitHub org, a place on the CNCF landscape, stickers, and a t-shirt design.

Checkout the two projects on GitHub:

* [inlets](https://github.com/inlets/inlets) 
* [inlets-pro](https://github.com/inlets/inlets-pro-pkg)

As the year end on, I saw other opportunities to expand and make inlets even easier to use.

## inlets on the road

I spoke at [Cloud Native Rejekts](https://twitter.com/rejektsio?lang=en) in San Diego on inlets as a solution to the IPv6 address-space problem. You can get the slides below:

<iframe src="//www.slideshare.net/slideshow/embed_code/key/5CIkLdzheA7P1" width="595" height="485" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:1px solid #CCC; border-width:1px; margin-bottom:5px; max-width: 100%;" allowfullscreen> </iframe> <div style="margin-bottom:5px"> <strong> <a href="//www.slideshare.net/AlexEllis11/still-waiting-for-ipv6-try-the-inletsoperator" title="Still waiting for IPv6? Try the inlets-operator" target="_blank">Still waiting for IPv6? Try the inlets-operator</a> </strong> from <strong><a href="https://www.slideshare.net/AlexEllis11" target="_blank">Alex Ellis</a></strong> </div>

My live demo showed cert-manager, k3s, and OpenFaaS being served over a mobile hotspot, using a battery pack and a Raspberry Pi 4.

<blockquote class="twitter-tweet" data-conversation="none"><p lang="en" dir="ltr">Recorded demos are for wimps. <br><br>journalctl -u k3s showed the IPv6 address I got from tethering confused k3s.. here we go with IPv6 disabled <a href="https://twitter.com/inletsdev?ref_src=twsrc%5Etfw">@inletsdev</a> with TLS served from the RPi <a href="https://t.co/BgTwNoIX51">pic.twitter.com/BgTwNoIX51</a></p>&mdash; Alex Ellis (@alexellisuk) <a href="https://twitter.com/alexellisuk/status/1195889294713344001?ref_src=twsrc%5Etfw">November 17, 2019</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

Ellen Korbes included inlets in a talk titled "Kubernetes developer tooling" and spoke at several large events.

<blockquote class="twitter-tweet" data-conversation="none"><p lang="en" dir="ltr">Presenting inlets <a href="https://twitter.com/alexellisuk?ref_src=twsrc%5Etfw">@alexellisuk</a> <a href="https://t.co/WMn3uaeYv8">pic.twitter.com/WMn3uaeYv8</a></p>&mdash; Simon P (@SimonHiker) <a href="https://twitter.com/SimonHiker/status/1189505283330138113?ref_src=twsrc%5Etfw">October 30, 2019</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

Thanks to Iheb for designing the logo. I sent him a pack of free SWAG to say thank you.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Received some <a href="https://twitter.com/openfaas?ref_src=twsrc%5Etfw">@openfaas</a> <a href="https://twitter.com/hashtag/swag?src=hash&amp;ref_src=twsrc%5Etfw">#swag</a> and the new <a href="https://twitter.com/inletsdev?ref_src=twsrc%5Etfw">@inletsdev</a> t-shirt 🙂 <a href="https://twitter.com/hashtag/teamserverless?src=hash&amp;ref_src=twsrc%5Etfw">#teamserverless</a> <br>Thank you <a href="https://twitter.com/alexellisuk?ref_src=twsrc%5Etfw">@alexellisuk</a> <a href="https://t.co/KH2tuYNTg2">pic.twitter.com/KH2tuYNTg2</a></p>&mdash; Iheb ☁️ (@iboonox) <a href="https://twitter.com/iboonox/status/1191423053537927169?ref_src=twsrc%5Etfw">November 4, 2019</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

Inlets gained a place on the CNCF Landscape amongst other service proxies like MetalLB, Nginx, and Traefik

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Really excited to see <a href="https://twitter.com/inletsdev?ref_src=twsrc%5Etfw">@inletsdev</a> growing up and leaving home with its own <a href="https://twitter.com/github?ref_src=twsrc%5Etfw">@github</a> org and a place on the <a href="https://twitter.com/CloudNativeFdn?ref_src=twsrc%5Etfw">@CloudNativeFdn</a> Landscape.<br><br>A big thank you to <a href="https://twitter.com/iboonox?ref_src=twsrc%5Etfw">@iboonox</a> for providing a logo. Website will be coming soon.<br><br>Check it out, give it a ⭐️<a href="https://t.co/5pPjk2MlpH">https://t.co/5pPjk2MlpH</a> <a href="https://t.co/NuDqCgkN5g">pic.twitter.com/NuDqCgkN5g</a></p>&mdash; Alex Ellis (@alexellisuk) <a href="https://twitter.com/alexellisuk/status/1184544960198205442?ref_src=twsrc%5Etfw">October 16, 2019</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

Here's my original conceptual diagram, found in an old notepad, the current design is still very close to this.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">My original design sketch for <a href="https://twitter.com/inletsdev?ref_src=twsrc%5Etfw">@inletsdev</a> OSS, back from late last year.<br><br>Going back through old notes, some OSS features, ideas and experiments took a while to get off the ground. <a href="https://t.co/3r6ktZZgpT">pic.twitter.com/3r6ktZZgpT</a></p>&mdash; Alex Ellis (@alexellisuk) <a href="https://twitter.com/alexellisuk/status/1209085837738164225?ref_src=twsrc%5Etfw">December 23, 2019</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

## Automation for inlets / inlets-pro

Inlets and inlets-pro also has automation either through the `inletsctl` CLI which provisions a cloud host and gives you a connection string, or through the Kubernetes Operator called the inlets-operator.

The inlets-operator detects services of type LoadBalancer in your private Kubernetes cluster, provisions a cloud server and then runs a Pod with the inlets client. That means anything you run in your Kubernetes cluster can be exposed on the public Internet.

<iframe width="560" height="315" src="https://www.youtube.com/embed/LeKMSG7QFSk" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

* [inletsctl](https://github.com/inlets/inletsctl)
* [inlets-operator](https://github.com/inlets/inlets-operator)

## Wrapping up

You can run inlets using a single binary, it has two parts - `inlets server` and `inlets client`. Both parts can run on any network, you can even bridge between two private VPCs, but most users find inlets useful for connecting private networks to the Internet. 

There's been strong inital interest in [inlets-pro](https://github.com/inlets/inlets-pro-pkg), which also works with inletsctl and inlets-operator. You can get a free trial or request a demo [on the homepage](https://inlets.dev/)

The easiest way to start is to try out [inletsctl](https://github.com/inlets/inletsctl), which will provision a host on DigitalOcean, GCP, Packet, Civo, or Scaleway. You'll get a command at the end which you can customise and use to connect your local services to the Internet.

> All inlets tooling works on regular compute, Raspberry Pi and ARM64 out of the box.

What are the other use-cases?

* getting incoming network connections
* CDN & edge access to APIs and websites
* sharing work freelance websites and work with clients
* integrating APIs with partners 
* command and control of edge devices
* connecting VPCs or private networks
* port-forwarding Kubernetes services `inletsctl kfwd` and "kurun"

Add your use-case to [ADOPTERS.md](https://github.com/openfaas/faas/blob/master/ADOPTERS.md)

### Connect with the community

* Become one of [my GitHub sponsors](https://github.com/sponsors/alexellis)

* Follow [@inletsdev](https://twitter.com/inletsdev) on Twitter and help us reach 1k followers

* Discuss the project in #inlets on [OpenFaaS Slack](https://slack.openfaas.io/)