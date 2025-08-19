---
title: "inlets PRO launch day"
slug: "inlets-pro-launch"
date: "2020-08-13T10:38:11Z"
author: "Alex Ellis"
meta_title: "inlets PRO launch day"
meta_description: "inlets PRO is a secure, commercial TCP tunnel, built for connecting services. Learn what it can do for you, and how it was built from OSS roots."
feature_image: "/content/images/2020/08/spacex-shot.jpg"
tags:
  - "inlets"
  - "ingress"
  - "networking"
  - "kubernetes"
  - "docker"
  - "inlets pro"
---

inlets PRO is a secure, commercial TCP tunnel, built for connecting services in a Cloud Native way. Learn what it can do for you, and how it was built from OSS roots. At the end of the post, you'll be able to view the new landing page with both personal and commercial pricing, along with comparisons to other networking solutions.

<img src="https://inlets.dev/images/inlets-pro-purple.png" width="50%" alt="inlets PRO">

## What is inlets?

[inlets](https://github.com/inlets/inlets) is an open-source network tunnel project that I built out in late 2018/2019. After a long history of working for enterprise companies, and facing troubling network conditions on the road (captive portals), and restrictive firewalls, I sat down to write some code and try and solve the problem.

To start with, the code (written in Go) was rudimentary, and serialised raw HTTP request and response objects over the wire. I'd decided to pick websockets for the transport, because I knew that a websocket could penetrate almost any network conditions by initiating an outbound call from a client to a well-known port on a HTTP server - 80 or 443.

![inlets OSS architecture](https://github.com/inlets/inlets/raw/master/docs/inlets.png)

After the project gained traction, the proof of concept had served its purpose and I rewrote the code to use off the shelf libraries like [Gorilla's websocket library](https://github.com/gorilla/websocket).

Simply put, if you had a HTTP service on your laptop, Raspberry Pi, VM, Docker image, Windows PC, Mac, or Kubernetes cluster, using inlets you could expose it on another network, and that network was usually the Internet.

inlets 1.0 and 2.0 were released and [attracted many comments on Hacker News and the project acquired is own community](https://github.com/inlets/inlets/blob/master/docs/community.md) of personal and commercial users. As of today, it has 6.5k GitHub stars and can be used via a Docker image or a static binary.

## inlets gains automation-tooling

Despite running in conditions where tools like Ngrok were completely banned, or non-functional, the barrier to entry was still too high for some users. They were used to simply running a single command and connecting to a SaaS tunnel.

SaaS tunnels are notoriously difficult to access from corporate networks, and are hamstringed by silly limits like being active for only 7 hours, or limiting connections per minute, even to those who pay for the service.

The route I took for this was to create [inletsctl](https://github.com/inlets/inletsctl) - a tool that could bootstrap a tunnel server or (exit-server) within a few moments on your favourite cloud.

inletsctl has a [provision package](https://github.com/inlets/inletsctl/tree/master/pkg/provision) which can set up new hosts on DigitalOcean, Packet, Civo, Scaleway, AWS EC2, GCE, Azure, Linode, and Hetzner. There are five different contributors to this code, and you can think of it a little bit like a basic version of Terraform.

Here's how it works:

```bash
inletsctl create --provider digitalocean \
 --region lon1 \
 --access-token-file ~/do-access-token
```

Then after a few moments, you'll get a "connection string" for your server.

```bash
Using provider: digitalocean
Requesting host: relaxed-brahmagupta1 in lon1, from digitalocean
2020/08/13 10:02:19 Provisioning host with DigitalOcean
Host: 203721867, status: 
[1/500] Host: 203721867, status: new

[31/500] Host: 203721867, status: active
Inlets OSS exit-node summary:
  IP: 206.189.124.232
  Auth-token: sO7tIBsy7FaVXb0HiVKXejsBvt6GEUGiSHbcMlrEo6d928cUIIjgPj7nJxnwFvM6

Command:
  export UPSTREAM=http://127.0.0.1:8000
  inlets client --remote "ws://206.189.124.232:8080" \
	--token "sO7tIBsy7FaVXb0HiVKXejsBvt6GEUGiSHbcMlrEo6d928cUIIjgPj7nJxnwFvM6" \
	--upstream $UPSTREAM

To Delete:
	inletsctl delete --provider digitalocean --id "203721867"
```

How much does it cost? As little as possible, around 5 USD / mo, and you can of course, run more than one tunnel server there if you wish.

## inlets integrates directly with Kubernetes

One of the other common complaints of the incumbant SaaS tunnels are that they do not integrate natively with Kubernetes, and when they do, they are still subjected to the same limits that we talked about above.

Enter the [inlets-operator](https://github.com/inlets/inlets-operator) - the tagline is "Get Kubernetes LoadBalancers from within your private network."

It works by detecting any Service in your cluster of type "LoadBalancer" and then it acts just like inletsctl, setting up an exit-server on your favourite cloud. However, this time, rather than you running "inlets client" from your command-line, a Pod is deployed into the cluster, which connects a private service in your cluster to the new server with a public IP.

This works extremely well, and is much faster than getting an ALB for instance on Amazon's managed Kubernetes product, EKS.

![LE working behind inlets PRO](https://github.com/inlets/inlets-pro/raw/master/docs/images/inlets-pro-vip-k8s.png)

See the tutorial: [Expose Your IngressController and get TLS from LetsEncrypt](https://docs.inlets.dev/#/get-started/quickstart-ingresscontroller-cert-manager?id=expose-your-ingresscontroller-and-get-tls-from-letsencrypt)

You can even bring your own IngressController along, since inlets PRO works at the TCP-level.

<iframe width="560" height="315" src="https://www.youtube.com/embed/4wFSdNW-p4Q" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

> Walk-through: Get LetsEncrypt certificates and public IPs for your private IngressController

## Like a PRO

Shortly after introducing inlets, inletsctl, and the inlets-operator, I developed a need for more than just a HTTP tunnel and started planning and thinking how to go about this. I also wanted to make sure that the websocket itself had TLS configured automatically, with the OSS version of inlets, [it was up to the operator to add it with a reverse proxy](https://blog.alexellis.io/https-inlets-local-endpoints).

I wanted to deploy [cert-manager](https://github.com/jetstack/cert-manager), ingress-nginx and then to get TLS certificates from [LetsEncrypt](https://letsencrypt.org/), just like I would do on a public cluster. This didn't work, since the OSS version of inlets terminated TLS on the exit-server. I needed a tunnel that could pass-through TCP traffic.

![VIP](https://github.com/inlets/inlets-pro/raw/master/docs/images/inlets-pro-vip.png)

I did something a little different with inlets PRO. I didn't open-source it, I worked in private, tested with a couple of trusted friends from the community, and then released only a binary.

The binary requires a JWT license code to work, and so I set up a "start a trial page" and sat back.

> As the founder of other open-source projects like [OpenFaaS](https://www.openfaas.com/), I was used to the following conversation with companies: "We will use your stuff for our production applications, and ask you for help for free, and no we won't sponsor, contribute to the project, or hire you for support."
> 
> With inlets PRO, the conversation changed. "We think we need your thing, we're almost certain of that. How much does it cost? A proof of concept, that sounds great, what will that cost?"

As I mentioned on the [Google Kubernetes Podcast this week](https://kubernetespodcast.com/episode/116-independent-open-source/), companies don't pay for free. It's only when a pricing-gate is put in place, that value can be captured for the maintainer or vendor of software.

There's been dozens of trials issued already, and several large corporations that have expressed an interest, but not for what I expected.

Here are a couple of examples of how inlets PRO can be used:

* [Save Money by Connecting Your Local Database to the Public Cloud](https://medium.com/@burtonr/local-database-for-the-cloud-with-inlets-pro-ac0488cc54e0) by Burton Rheutan
* [Inlets Pro Homelab Awesomeness](https://blog.brewsterops.dev/post/inlets-pro-homelab/) by Matt Brewster

Most enterprise companies, it turns out have some legacy deployed on premises, and some deployed on a public cloud. They need to securely tunnel services from the private cluster to the public one, but they do not want to expose them on the Internet. Sometimes these services are also running without encryption, think of an ancient MSSQL service, that's full of key data for an API.

![Split plane, headless tunnel](https://github.com/inlets/inlets-pro/raw/master/docs/images/inlets-pro-split-plane.png)

inlets PRO provided a way for them to replace VPNs, which were complex to set up and manage. It also provided a way for the data to be encrypted over the wire, and only tunneled to the remote network, not being exposed. Think of it like a private or headless tunnel, maybe a "hybrid service mesh."

inlets PRO works much like the original open source version and shares some code. The inletsctl and inlets-operator projects both have switches to use the PRO version of inlets.

## Launch day

This journey started out as building an open-source tunnel to help developers get past the impasse of using severely-limited SaaS tunnels. The tooling that has developed subsequently, with help from the community, has made inlets even more useful and easy to use.

Today is about making inlets more sustainable as an option over the long-haul. It's about providing clear business value to companies and teams that have hybrid cloud, are tired of VPNs, or that simply need to work with customers and clients on other networks.

With the launch of the [landing page for inlets PRO](https://inlets.dev/) you'll find a personal pricing option that gives unlimited use, a commercial option, and enterprise. The commercial option is not billed per month, because to keep inlets PRO completely private, there is no tracking included. Users are trusted to buy the right license for what they are using, and in return, no usage or tracking data will be collected.

[![cloud-native-tunnel](/content/images/2020/08/cloud-native-tunnel.png)](https://inlets.dev)

* Check out the new landing page here: [inlets.dev](https://inlets.dev)
* Get a free 14-day trial: [kick the tires with a free trial](https://inlets.dev/#faq)

You can also get [inlets SWAG](https://store.openfaas.com/) - your own hoodie, t-shirt or mug for the home office in the [OpenFaaS store](https://store.openfaas.com/).