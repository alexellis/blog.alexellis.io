---
title: "Do your demos like a boss at KubeCon"
slug: "kubecon-demos-like-a-boss"
date: "2021-10-03T10:37:19Z"
author: "Alex Ellis"
meta_title: "Do your demos like a boss at KubeCon"
meta_description: "What is the best live demo you've ever seen? Do you still remember it now? Learn how the best do it and how to get an IP address that will travel with you."
feature_image: "/content/images/2021/10/maxresdefault--1-.jpg"
tags:
  - "kubecon"
  - "ingress"
  - "kubernetes"
  - "livedemo"
  - "networking"
  - "demos"
---

I don't think that I heard the term "live demo" until I went to my first [Dockercon](https://twitter.com/dockercon) event in 2016. The implication was that *some demos* wouldn't be run live and would be staged, rehearsed or faked.

For some reason it had never occured to me that using a recorded demo would be the first option people would go for. I'd always had the naivety to *go live or bust* and to make sure that I'd had ample preparation because we all know the 5 Ps - Prior Planning Prevents Poor Performance.

Let's take a quick look at the origins of live conference demos, some of the people who do them best, why having traffic to localhost may be beneficial to your talk and how you could go about getting real traffic into your local applications.

## The demo gods

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">.<a href="https://twitter.com/golubbe?ref_src=twsrc%5Etfw">@golubbe</a> explains the tradition of sacrifices to the demo gods at <a href="https://twitter.com/hashtag/DockerCon?src=hash&amp;ref_src=twsrc%5Etfw">#DockerCon</a> - this year is espresso ☕️☕️☕️☕️☕️🐳🐳 <a href="https://t.co/ID4X0W3mB5">pic.twitter.com/ID4X0W3mB5</a></p>&mdash; Docker (@Docker) <a href="https://twitter.com/Docker/status/744931332313088000?ref_src=twsrc%5Etfw">June 20, 2016</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

I don't know if team [Dockercon](https://docker.com) started the "demo Gods" concept or sacrificing a stage prop, but they certainly made it entertaining. We saw them eat grapes, drink espresso and rub the horn of a buffalo skull.

I only started going to [Dockercon](https://twitter.com/dockercon) events in 2016, but thoroughly enjoyed the experience and theatre. Around mid to late 2017 interest in Docker slowly gave way to Kubernetes, and the [Cloud Native Computing Foundation (CNCF)'s](https://www.cncf.io/) event [KubeCon](https://www.cncf.io/kubecon-cloudnativecon-events/) gained massive popularity and attendance.

Whilst [Solomon Hykes](https://twitter.com/solomonstre) captured the imagination of Dockercon attendees, it was [Kelsey Hightower](https://twitter.com/kelseyhightower) that entertained us at KubeCon.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">“Thanks, demo gods” <a href="https://twitter.com/kelseyhightower?ref_src=twsrc%5Etfw">@kelseyhightower</a> ☁️ [LIVE from <a href="https://twitter.com/hashtag/KubeCon?src=hash&amp;ref_src=twsrc%5Etfw">#KubeCon</a> + <a href="https://twitter.com/hashtag/CloudNativeCon?src=hash&amp;ref_src=twsrc%5Etfw">#CloudNativeCon</a>] <a href="https://t.co/QXxZXIMumh">pic.twitter.com/QXxZXIMumh</a></p>&mdash; CNCF (@CloudNativeFdn) <a href="https://twitter.com/CloudNativeFdn/status/938789110193455105?ref_src=twsrc%5Etfw">December 7, 2017</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

## Live traffic to localhost

In one of Kesley's demos, he showed code that was deployed to AWS and GCP services. When you're using managed services, that's probably your only option because you cannot run the same tools and integrations locally.

<iframe width="560" height="315" src="https://www.youtube.com/embed/oNa3xK2GFKY" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

But if you're giving a talk at KubeCon + CloudNativeCon, the chances are that you have some software to show off that runs on Kubernetes or within a virtual machine using a CNCF project like containerd.

When I gave a demo to serveral thousand people as part of the closing keynote at Dockercon, I ran [OpenFaaS](https://github.com/openfaas/) on a few bare-metal machines provided by [Equinix Metal (Packet)](https://metal.equinix.com/). I could have run that demo locally, but I wanted to keep the environment up and running before and after the demo.

<iframe width="560" height="315" src="https://www.youtube.com/embed/-h2VTE9WnZs?start=954" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Demos don't always work, but it's how you handle it that matters. I would much rather have a go and explain what the audience was meant to see and keep the session flowing. Most of my Dockercon talk was live, but we had a few issues with Alexa's WiFi connection during rehearsal, so parts of the audio responses were recorded in case we needed them.

At other times times I've [run a Kubernetes cluster on my own laptop](https://github.com/kubernetes-sigs/kind) or [on a Raspberry Pi](https://k3sup.dev) that's been on stage with me for the demo.

<iframe width="560" height="315" src="https://www.youtube.com/embed/ZyTLMnzehyU" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

[Scott Hanselman](https://www.hanselman.com/) is one of the best when it comes to showmanship and live demos. He knows the importance of preparation.

We had a chance to go through the demo and what we each wanted to say the night before. We were running Pods that showed an LED sequence, but wanted that Pod to be moved quickly to another Raspberry Pi if a network cable was pulled out. The default timeout meant this took more than 5 minutes and wouldn't work in a live presentation.

> Just like a boss, Scott said: "I'll phone Kelsey" and within a few minutes we had set up a new kubelet flag and the demo worked exactly how we wanted.

### So why would you want live traffic to localhost?

Audience participation can make your presentation more engaging. You can share a URL and have attendees interact with your demo to prove a point or to make it more memorable. I can clearly remember the [Emojivoto demo](https://github.com/BuoyantIO/emojivoto) by the [Linkerd team](https://linkerd.io/) at KubeCon where we had to click various emojis like donuts or ice-creams and they were then able to simulate network latency and show the various HTTP codes coming in.

Sometimes you may be [running a demo like Kelsey's](https://www.youtube.com/embed/oNa3xK2GFKY) where you want to augment a cloud service or SaaS with code running on your laptop. An example might be where I invited the audience to star the alexellis/faas repository, and for each of them a webhook was sent to my function from GitHub. It then caused their avatar to be displayed on the big screen.

I've also seen demos of OpenFaaS at KubeCon where code running within a [KinD cluster](https://kind.sigs.k8s.io/docs/user/quick-start/) was sending request to services like Twillio and receiving webhooks back in response. Sending an image to an object detection service and receiving a JSON response back to one of your APIs or functions would be another example.

So receiving traffic could make your demo more integrated with a cloud service or SaaS, it could also be more engaging and memorable for your audience. You do not have to run your code locally, but it could be more convenient if you did, because if you're anything like me, you're probably tweaking things until the last minute.

### Making your Kubernetes cluster reachable

There's a few things you may want to do:

* Get [kubectl access to your private cluster from anywhere](https://blog.alexellis.io/get-private-kubectl-access-anywhere/)
* Expose a service and [get a working LoadBalancer](https://github.com/inlets/inlets-operator)
* [Route traffic to your IngressController and get HTTPS certificates](https://docs.inlets.dev/#/get-started/quickstart-ingresscontroller-cert-manager?id=expose-your-ingresscontroller-and-get-tls-from-letsencrypt)

For the first use-case, the idea may be that you are running a Kubernetes cluster on a homelab, your laptop or on a Raspberry Pi. You need access to the Kubernetes API server, why? Perhaps you're showing off a new multi-cluster dashboard, or a vulnerability scanning tool. Maybe you just want a convenient endpoint with a stable IP address.

For the second use-case, you want to demonstrate how to install software and access it, without resorting to messy workarounds like port-forwarding and NodePorts. You expose a service as a type of LoadBalancer, and you get an IP address that won't change, even if you close the lid on your laptop in the UK and fly to San Francisco and open it again on a tethered connection.

The third use-case is a belt-and-braces approach - you want to show off a fully-fledged TLS certificate using Let's Encrypt or maybe you're demoing a new feature of Istio. Here you can expose the API Gateway or IngressController and start serving real traffic with a stable IP address.

* [Route traffic to your IngressController and get HTTPS certificates](https://docs.inlets.dev/#/get-started/quickstart-ingresscontroller-cert-manager?id=expose-your-ingresscontroller-and-get-tls-from-letsencrypt)
* [A bit of Istio before tea-time](https://blog.alexellis.io/a-bit-of-istio-before-tea-time/)

### Sometimes things go wrong

I combined the two approaches above with inlets. I installed Traefik on a Raspberry Pi in my home in the UK, then got TLS certificates using cert-manager and shut everything down. I flew to San Diego and connected the Raspberry Pi to the Internet in the hotel. The endpoint worked immediately and was serving traffic over HTTPS.

I then headed down to T-Mobile, bought a SIM card and went to the conference to show off the demo. 

<blockquote class="twitter-tweet" data-conversation="none"><p lang="en" dir="ltr">Recorded demos are for wimps. <br><br>journalctl -u k3s showed the IPv6 address I got from tethering confused k3s.. here we go with IPv6 disabled <a href="https://twitter.com/inletsdev?ref_src=twsrc%5Etfw">@inletsdev</a> with TLS served from the RPi <a href="https://t.co/BgTwNoIX51">pic.twitter.com/BgTwNoIX51</a></p>&mdash; Alex Ellis (@alexellisuk) <a href="https://twitter.com/alexellisuk/status/1195889294713344001?ref_src=twsrc%5Etfw">November 17, 2019</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

But it didn't work. The T-Mobile network had IPv6 enabled, which make [K3s](https://k3s.io/) choke and fail to start. The result was that I couldn't show my demo, but I was able to tweet about it and learn from it later on. Here's my RPi4 running on battery power with the same IP, DNS entry and TLS cert that was issued when I set it up in my home town in England.

[Cheryl Hung](https://twitter.com/oicheryl), then VP of Ecosystem at the CNCF gave a live demo and shared Kubernetes knowledge. It didn't go exactly to plan, showing that it's OK to make mistakes. We all do this and it makes us more relatable to our audiences.

<blockquote class="twitter-tweet" data-conversation="none"><p lang="en" dir="ltr"><a href="https://twitter.com/oicheryl?ref_src=twsrc%5Etfw">@oicheryl</a> showing that it is ok to make mistakes in a live demo and dishing out Kubernetes knowledge at the same time. Congrats to <a href="https://twitter.com/SpotifyEng?ref_src=twsrc%5Etfw">@SpotifyEng</a> for winning the top end user award <a href="https://t.co/wkY23H7XWs">pic.twitter.com/wkY23H7XWs</a></p>&mdash; Bill Mulligan (@breakawaybilly) <a href="https://twitter.com/breakawaybilly/status/1389862910856400896?ref_src=twsrc%5Etfw">May 5, 2021</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

## Go live or go home

Of course it's fine if you want to record your demo and play it back to your audience. Sometimes that's just the most convenient or practical way to go about things. I'll always try to demo live and prepare as much as possible beforehand. As a bonus, you will be so used to running the demo, that you could probably write it up as a tutorial so that others can try it out for themselves afterwards.

[inlets](https://inlets.dev/) is my tool of choice for Kubernetes LoadBalancers, Ingress and for a stable IP address that will travel with me. Other tools are available, and you can also run your code on a public cloud.

![K8s CLI commands](https://inlets.dev/images/k8s-cli.png)
> The [inlets-operator](https://github.com/inlets/inlets-operator) can be a very quick way to get started with just a few commands. The IP you are given will stay with you for as long as you need it.

The operator converts services of type LoadBalancer into real IP addresses by automating tunnel servers on your favourite clouds. There's also a helm chart that works well with [a GitOps approach](https://www.weave.works/technologies/gitops/).

* [inlets/inlets-operator](https://github.com/inlets/inlets-operator)
* [Fixing Ingress for short-lived local Kubernetes clusters](https://inlets.dev/blog/2021/07/08/short-lived-clusters.html)

As a bonus, [inlets now ships with Prometheus metrics](https://inlets.dev/blog/2021/08/18/measure-and-monitor.html), so even if you haven't instrumented your demo apps, you can get Rate, Error, Duration (RED) metrics for free just by using a tunnel.

KubeCon + CloudNativeCon also features projects and products that do not have to run on Kubernetes or in containers. For those projects, you may like to [set up a simple HTTPS tunnel](https://inlets.dev/blog/2021/08/08/private-tunnel.html) or a [quick TCP tunnel](https://docs.inlets.dev/#/get-started/quickstart-tcp-database?id=quick-start-tunnel-a-private-database-over-inlets-pro).

You may also like:

* [How to get to speak at KubeCon](https://blog.alexellis.io/how-to-speak-at-kubecon)
* [The Past, Present, and Future of Kubernetes on Raspberry Pi - Alex Ellis, OpenFaaS Ltd](https://www.youtube.com/watch?v=jfUpF40--60)
* [Getting Beyond FaaS: The PLONK Stack for Kubernetes Developers - Alex Ellis, OpenFaaS Ltd](https://www.youtube.com/watch?v=NckMekZXRt8)