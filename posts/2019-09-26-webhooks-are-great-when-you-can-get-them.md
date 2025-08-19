---
title: "Webhooks... Great when you can get them."
slug: "webhooks-are-great-when-you-can-get-them"
date: "2019-09-26T20:16:59Z"
author: "Alex Ellis"
meta_title: "Webhooks... Great when you can get them."
meta_description: "Webhooks are great, but often it is hard to receive them when behind NAT, a firewall, or on a restrictive network. Learn how inlets can solve this problem."
feature_image: "/content/images/2019/09/get-em.jpg"
tags:
  - "webhooks"
  - "devlife"
  - "coding"
  - "inlets"
  - "caddy"
---

There are traditionally two ways to get data from third-party systems: polling and pub-sub. In a polling method, your code has to continually ask another system: "is there any news?" What's wrong with that? Well, it's inefficent, because you'll have to pick an checking interval that's either too long or too short and you'll generate noise/work for both your system and their system.

## Why pub/sub is better

Pub/sub is the classic solution to polling. You set up a subscription for an event, then another system can publish a message at any time and you'll be notified of that. It's how push notifications work on modern smart-phones.

One of the most common and popular ways to achieve pub-sub over the internet is through the use of webhooks. Ahead of time you'll register a URL for the system to call into with messages, and you'll say which kind you care about. If you've ever tried to integrate with GitHub, Slack, Stripe, or another system that exposes webhooks, you'll be familiar with how this works.

## Building a webhook

You build a simple HTTP server that can receive the webhook and then configure the remote system with that URL.

![Screenshot-2019-09-26-at-20.45.25](/content/images/2019/09/Screenshot-2019-09-26-at-20.45.25.png)

*A webhook subscription for a GitHub repository*

## The problem with webhooks

Now back to the title of this post. "Webhooks are great when you can get them." What do I mean? Well, webhooks rely on the system of record being able to directly address your webhook receiver.

If you're deploying to an EC2 instance or a DigitalOcean Droplet, then you'll have a public IPv4 address, but when you're working behind a corporate firewall, NAT, or within a VM or container, this just doesn't work. Your code has no routable IP address and GitHub simply has no way to send you the message.

## A solution

The "Keep It Simple" (KISS) principle would advocate for a simple solution: just test your code on a remote server, or use polling. This is a valid solution, but very rough around the edges.

Ever since I started building integrations for third-party APIs, I've wanted a way to get incoming webhooks to my work laptop, my Raspberry Pi cluster and to my homelab. I'd had some limited success with [Ngrok](https://ngrok.com) and do still use it from time to time. The first issue for me, was that it was closed source, and the second was the limitations enforced to convince users to buy a subscription plan.

For instance, with the free version of Ngrok you can get only 20 connections per minute for free which doesn't suit the continual dev/test cycle of writing new integrations. The Ngrok public address changes every 7 hours or every time you shut the lid on your laptop. That means that you need to reconfigure your GitHub repo every time you want to use it. I believe that the best kind of developer experience eliminates friction and alleviates pain points.

I set about creating an OSS replacement, which would allow me and members of my team and community to work with webhooks for local development. I called it "inlets" and it has around 8k GitHub stars at time of writing.

The [inlets.dev](https://inlets.dev) project has two parts:

* Server (exit node)
* Client (on your local side)

Here's the flow at a high-level:

![inletsio--2-](/content/images/2019/09/inletsio--2-.png)

1) The client, running on your local computer, network or inside your Kubernetes cluster as a Pod, makes an outbound connection to the server.
2) The server accepts the connectionm, validates an auth token and then a bi-directional tunnel becomes established and we have ingress.
3) The publishing system such as GitHub then sends a webhook to the server's IP
4) The message goes down the tunnel, from the server to the client. After entering our local network, the client forwards the message on to our local webhook receiver

But, how does it work? Computers which have no incoming networking (ingress), can usually make outgoing connections (egress) either directly or through a HTTP proxy. Inlets initiates a connection from within the client network to the server, then establishes a permanent encrypted websocket using TLS, this is how we can get incoming webhooks.

## Watch a quick CLI demo

Here's a quick demo of me setting up an exit-server on DigitalOcean, which only takes a few seconds. From there I run a local HTTP server and access it over the tunnel.

<a href="https://asciinema.org/a/q8vqJ0Fwug47T62biscp7cJ5O" target="_blank"><img src="https://asciinema.org/a/q8vqJ0Fwug47T62biscp7cJ5O.svg" /></a>

You can also run Caddy or Nginx on your laptop and set up various custom domains at no extra cost.

See also: [Quick-start: expose a local websites with HTTPS using Caddy](https://docs.inlets.dev/#/get-started/quickstart-caddy)

## Wrapping up

[inlets.dev](https://inlets.dev) can use a cheap cloud VPS, VM, or EC2 instance as a replacement for having a public IP address. You get to have the best of both worlds - pub/sub with webhooks and a great local development experience.

You may be wondering how inlets is different from using a VPN, an SSH tunnel, or your favourite bespoke tool. Check out [the README](https://inlets.dev) where I've spent some time covering this and the upcoming backlog.

Inlets also offers integrations and recipes for making use of Kubernetes clusters, you'll also see what users are saying about the project.

A final note: see the disclaimer on the [inlets.dev](https://inlets.dev) README file on GitHub before considering using inlets within a corporate environment.

If you enjoyed this post, follow me on [Twitter @alexellisuk](https://twitter.com/alexellisuk/) for more.

### Share with your network

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">I was asked today by a lead developer at IBM how he could avoid polling <a href="https://twitter.com/github?ref_src=twsrc%5Etfw">@GitHub</a> and get webhooks his for <a href="https://twitter.com/tektoncd?ref_src=twsrc%5Etfw">@tektoncd</a> pipelines, directly to his laptop.<br><br>&quot;Webhooks... Great when you can get them&quot; <a href="https://twitter.com/hashtag/devlife?src=hash&amp;ref_src=twsrc%5Etfw">#devlife</a> <a href="https://twitter.com/hashtag/cicd?src=hash&amp;ref_src=twsrc%5Etfw">#cicd</a> <a href="https://twitter.com/hashtag/github?src=hash&amp;ref_src=twsrc%5Etfw">#github</a> <a href="https://twitter.com/hashtag/stripe?src=hash&amp;ref_src=twsrc%5Etfw">#stripe</a> <a href="https://twitter.com/hashtag/strava?src=hash&amp;ref_src=twsrc%5Etfw">#strava</a> <a href="https://twitter.com/hashtag/inletsdev?src=hash&amp;ref_src=twsrc%5Etfw">#inletsdev</a><a href="https://t.co/wQu470ilS0">https://t.co/wQu470ilS0</a></p>&mdash; Alex Ellis (@alexellisuk) <a href="https://twitter.com/alexellisuk/status/1177316833063591937?ref_src=twsrc%5Etfw">September 26, 2019</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>