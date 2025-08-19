---
title: "Expose your private Grafana dashboards with TLS"
slug: "expose-grafana-dashboards"
date: "2020-04-03T16:33:34Z"
author: "Alex Ellis"
meta_title: "Expose your private Grafana dashboards with TLS"
meta_description: "Learn how to expose your private devops dashboards securely on the public Internet using inlets-pro, TLS and Grafana's built-in password authentication."
feature_image: "/content/images/2020/04/photo-1425141708895-60ba4a72e556.jpeg"
tags:
  - "inlets"
  - "expose"
  - "grafana"
  - "dashboard"
  - "DevOps"
  - "tunnels"
  - "tls"
  - "security"
---

[Grafana dashboards](https://grafana.com) are great for getting quick feedback on critical metrics, or just for browsing interesting statistics about user behaviour on a production system.

In this post I'll show you how to use inlets PRO as a secure tunnel to expose your private Grafana dashboards on your laptop, private datacenter or your local network. inlets PRO will use TLS to provide link-level encryption to prevent snooping on tunnel traffic. Since Grafana doesn't come with TLS by default, we'll use Caddy to obtain a certificate for Grafana by tunnelling out port 80 and 443 instead of the plaintext HTTP port 3000.

![OpenFaaS dashboard](https://camo.githubusercontent.com/24915ac87ecf8a31285f273846e7a5ffe82eeceb/68747470733a2f2f7062732e7477696d672e636f6d2f6d656469612f4339636145364358554141585f36342e6a70673a6c61726765)

Your Grafana dashboard may be deployed inside Kubernetes, or as a Docker container. I'm going to show you how to set it up with a sample dashboard, you can follow along and then adapt it for any existing deployments which you may have.

The instructions here are not strictly specific to Grafana, so if you have a flask app running on port 5000, just replace that port wherever you see `3000`. Likewise, if you are running OpenFaaS on port 8080, replace 3000 with `8080` and so on.

## Overview

Here's the workflow for the tutorial:

* Run Grafana in Docker or point at an existing installation on our network
* Install `inlets-pro` and `inletsctl`
* Create a tunnel and an exit-server with a public IP
* Get a domain or add a new sub-domain using our public IP
* Install Caddy
* Run Caddy and get a nice green lock for our dashboard

Then you get to enjoy your dashboard from anywhere.

I'll also show you how to access multiple dashboards or services from a single tunnel.

You'll need an inlets-pro license, you can buy one at [store.openfaas.com](https://store.openfaas.com) for personal use or get a free trial using the link in the [inlets documentation](https://docs.inlets.dev/)

## Quick-start for Grafana

* Install [Docker](https://docker.com/)
* Run a Grafana container

```bash
docker run -d -p 3000:3000 \
  --name grafana \
  --restart=always \
  grafana/grafana:latest
```

Taken from the [Grafana docs](https://grafana.com/docs/grafana/latest/installation/docker/)

Now you have a dashboard at [http://127.0.0.1:3000](http://127.0.0.1:3000), however you cannot access this over the Internet, and it has no TLS to secure it.

Make sure that you change the default password from admin/admin before going any further.

![Change your initial password](/content/images/2020/04/Screenshot-2020-04-03-at-16.28.37.png)

## Get a public IP

The issue with running a private dashboard is that it's just not routeable, and it's unlikely that your administrator will open a port for you. If you are at home and want to do this with your ISP and port-forwarding, think again, you could be leaking your personal information and have your home network targeted.

Let's get a public IP with no strings attached.

Download inletsctl and use it to get the `inlets-pro` client:

```
curl -sSLf https://inletsctl.inlets.dev | sudo sh

sudo inletsctl download --pro

# or run without sudo, and move the binary after
```

Now create an exit-server (aka exit-node) for your favourite cloud. I am going to use DigitalOcean, which happens to be the fastest and cheapest. Other supported providers include: packet, ec2, scaleway, civo, gce and azure.

Run the following command, and make sure you have an access token from your dashboard saved as `~/access-token.txt`

Take note of the `--remote-tcp` flag, it tells the `inlets client` where to send traffic.

```sh
inletsctl create  \
  --provider digitalocean \
  --access-token-file ~/access-token.txt \
  --region lon1 \
  --remote-tcp 127.0.0.1
```

When the program completes running you'll be presented with a command you can run to connect to the tunnel and start proxying traffic.

You need to set the `--tcp-ports` flag to a comma-delimited list of ports to punch out of the tunnel, or a single port. In our example we won't expose Grafana directly, but we'll expose Caddy (a reverse proxy) which will have TLS enabled via LetsEncrypt.

Set `export TCP_PORTS=` to `80,443` which are the two ports required for plain HTTP to serve the ACME challenge, and 443 to serve the encrypted traffic afterwards.

```bash
export TCP_PORTS="80,443"
export LICENSE=""
inlets-pro client --connect "wss://134.122.101.204:8123/connect" \
  --token "67462dccc691fd58c485ab5e631c6b69af594572" \
  --license "$LICENSE" \
  --tcp-ports $TCP_PORTS
```

Here's my client process running:

![Running the client](/content/images/2020/04/Screenshot-2020-04-03-at-16.36.36.png)

## Get a domain ready for the dashboard

We will need a domain for this step, and they cost as little as 1 USD, so no complaining please. Head over to [namecheap.com](https://namecheap.com) and get something fun, you can re-use it and it won't hurt your pocket.

If you already have a domain, we'll use a sub-domain.

Use the IP address from the exit-server and create a sub-domain with a DNS A record:

```
dashboard.example.com 134.122.101.204
```

If you're a DigitalOcean user, you can use `doctl` to create this address with: `doctl compute domain create --ip-address $IP $SUB_DOMAIN`.

## Install a reverse proxy

We need a reverse proxy that can obtain a TLS certificate. I find that Caddy 1.0 is quick and easy enough for us to use. [Caddy 2](https://caddyserver.com/v2) is also available, but you will need to learn the new Caddyfile format if you decide to use it.

Download the binary for MacOS, Linux or Windows: [v1.0.4](https://github.com/caddyserver/caddy/releases/tag/v1.0.4)

Unzip or un-tar the downloaded file, you'll find `caddy` or `caddy.exe`.

* Create a Caddyfile

```
dashboard.domain.com

proxy / 127.0.0.1:3000 {
  transparent
}
```

The first line tells Caddy which domain to use when getting the TLS certificate

The second code-block says that any requests send to this domain should be proxied to our local machine on port 3000.

## Try it out

We're almost there, all we need to do is to run Caddy and then open up our URL.

* Run caddy

If you're on MacOS, you'll need to run as `sudo` to access port 80, 443 on the local host.

```bash
sudo ./caddy -disable-tls-alpn-challenge
```

Note, you will be asked for your email for the domain, enter it then continue.

```
https://dashboard.domain.com
```

Check the green lock:

![cert-valid](/content/images/2020/04/cert-valid.png)

## Going further

Now that we have a single dashboard up, with its own domain, we can add additional dashboards and services using the same approach and our Caddy server.

Run a second dashboard on a different port:

```bash
docker run -d -p 3001:3000 \
  --name grafana \
  --restart=always \
  grafana/grafana:latest
```

Edit `Caddyfile` and restart caddy:

```
dashboard1.domain.com {
  proxy / 127.0.0.1:3000 {
    transparent
  }
}

dashboard2.domain.com {
  proxy / 127.0.0.1:3001 {
    transparent
  }
}
```

There's no need to restart the tunnel or the tunnel server.

### Putting things on hold

When you no-longer need the tunnel, simply stop the `inlets-pro client` and `caddy`, and start them again whenever you need. The exit server can remain provisioned, or you can delete it completely with the command given by `inletsctl create`.

## Wrapping up

You now have a secure tunnel since inlets-pro uses TLS for its control-plane, with additional security for the Grafana dashboard with a TLS certificate served by Caddy.

Next, why don't you try running another Docker container, and putting that behind your Caddy proxy, using a different DNS name, what about `openfaas.example.com?

* [Join the community on Slack #inlets](https://slack.openfaas.io/)

* Find find out what you can do through our other tutorials in the docs: [docs.inlets.dev](https://docs.inlets.dev/)

### Can I get some Kubernetes with that?

If you like your DevOps more automated than this, you should check out the Kubernetes operator for Inlets, which can expose your IngressController and use cert-manager to obtain TLS certs automatically.

* Tutorial: [Expose Your IngressController and get TLS from LetsEncrypt](https://docs.inlets.dev/#/get-started/quickstart-ingresscontroller-cert-manager?id=expose-your-ingresscontroller-and-get-tls-from-letsencrypt)