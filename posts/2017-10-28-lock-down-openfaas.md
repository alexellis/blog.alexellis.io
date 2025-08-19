---
title: "Lock-down OpenFaaS for the public Internet"
slug: "lock-down-openfaas"
date: "2017-10-28T16:40:46Z"
author: "Alex Ellis"
meta_title: "Lock-down OpenFaaS for the public Internet"
meta_description: "If you are running OpenFaaS on the public Internet, then you need to know how to get locked-down, fast. Let's reduce the surface area with sensible defaults"
tags:
  - "openfaas"
  - "hardening"
  - "security"
---

### Update / notice

This is an old blog-post, and OpenFaaS now has authentication enabled by default. Follow one of the guides at [docs.openfaas.com](https://docs.openfaas.com/deployment/kubernetes/).

### Original post

[OpenFaaS](https://www.openfaas.com) values simplicity for developers and operators and being an open-platform. We strive to make informed technology choices for you, but also make it easy for you to customise your deployments to suit your team and business.

*It's important* to know that OpenFaaS needs to be locked-down for use on the public Internet. We have several guides available for this ranging from a simple, batteries-included experience with Nginx to something much more customisable with Kong.

### Surface-area

Whether you are deploying OpenFaaS via Docker Swarm or Kubernetes, the API gateway and UI have the power to schedule functions on your cluster. So it's understandable that you would need to protect these endpoints from sabotage.

The following rules apply to all FaaS projects and micro-services exposed on the Internet. This is not an exhaustive list of precautions, but is designed to protect against the most common attacks by a bad actor.

#### Do turn on Basic Auth (username/password authentication)

Basic Auth means that anyone connecting to an endpoint for the first time will receive a *401 Unauthorized* error. A web-browser will then prompt you for credentials which are cached for a few minutes. When you setup Basic Auth you will need to setup a username and password on your server.

![](/content/images/2017/10/loginplease1-1.png)

Follow the guide for [Basic Auth with Nginx](https://github.com/openfaas/faas/tree/master/contrib/nginx).

The guide above enables authentication for the UI and system API endpoints. It deliberately leaves your functions open so that you can expose them to event issuers which do not use authentication. If the services consuming your functions support authentication then you can edit the `gateway.conf` settings to a cover-all.

**See also: Applying HMAC for verification with GitHub**

[HMAC](https://developer.github.com/webhooks/securing/) is a technique used by GitHub to secure outgoing HTTP calls (webhooks) from their API-tier to your OpenFaaS functions. You can read more about [HMAC with GitHub and Docker Swarm secrets here](https://blog.alexellis.io/swarm-secrets-in-action/).

#### Do enable TLS/HTTPS with free certificates from Traefik

Turning on Basic Auth will help prevent most tampering and disruptive behaviour by opportunists and restless conference attendees. However since there is very little protection for the data in transit this data can be sniffed (picked up) from public networks and used in a replay attack. TLS/HTTPS mean the data is encrypted end-to-end and is highly recommended. 

I often see people run systems without HTTPS because it's hard to automate and requires manual steps including registering and [paying for a domain name](https://community.letsencrypt.org/t/certificate-for-public-ip-without-domain-name/6082/2). [LetsEncrypt](https://letsencrypt.org) helps to automate the generation and renewal of your HTTPS certificates and is highly recommended.

[Nginx](https://www.nginx.com/), [Kong](https://getkong.org/docs/) and [Traefik](https://traefik.io/) all support TLS/HTTPS - you can follow the [guides here](https://github.com/openfaas/faas/tree/master/guide).

#### Do consider enabling rate-limiting for functions through Kong

Rate limiting is enforced by public APIs to ensure fair use and to help mitigate Denial Of Service attacks. [Rate limiting](https://getkong.org/plugins/rate-limiting/).

#### Don't give your IP address / DNS entries out for the gateway/UI

Even if your endpoints are secured with TLS, basic authentication and rate-limiting it doesn't rule out opportunistic distributed-
denial-of-service attacks, but this goes for any public API.

Your endpoint will eventually be located by a bot or IP-range scanner - at this point you may want to try using tools such as [fail2ban](https://www.fail2ban.org/wiki/index.php/Main_Page) to blacklist IP addresses.

#### How do I access the CLI/API?

The API can still be accessed programatically and by `curl` by passing additional parameters. The CLI has a community-PR in testing to enable `faas-cli login` to store credentials for locked-down gateways.

In the meantime you can also specify credentials via the gateway URL:

```
$ export TOK=217272460319b6937c5544243312012af9cc2c1765076776affaa228c4214a64eb54faedba34e0353939845b5292517fe4e14112a792a2fa98463df3fbd368e4
$ faas-cli list --gateway https://admin:$TOK@openfaas-1.lockdown.co.uk
```

> Note: This will show up in your bash history, so watch the [faas-cli](https://github.com/openfaas/faas-cli) repo for when we release the new `faas-cli login` feature soon.

### Wrapping up

Dealing with bad actors on the Internet is largely a solved problem, so you should lean on the experience of experts in this area. Wherever possible do not roll-your-own security and reduce your surface area to the absolute minimum.

**HTTP Proxies**

We have mentioned the following HTTP proxies in this post - [Nginx](https://www.nginx.com/), [Kong](https://getkong.org/docs/) and [Traefik](https://traefik.io/). [Caddy](https://caddyserver.com/) is also a popular option with the OpenFaaS community. The key here is that we want to help you make useful decisions that will work as defaults, but can be deployed with ease alongside your favourite Cloud Native stack.

Are you running an OpenFaaS cluster on the public Internet? Perhaps it's time to follow the guide for [Basic Auth with Nginx](https://github.com/openfaas/faas/tree/master/contrib/nginx) before someone finds your cluster.

**Support our project**

[OpenFaaS](https://www.openfaas.com) is an independent, community-project delivering a Portable and Simple Cloud Native Serverless framework. Show support by Contributing to the project and [Staring our main OpenFaaS repository](https://github.com/openfaas/faas).