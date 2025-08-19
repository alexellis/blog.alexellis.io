---
title: "Get a TLS-enabled Docker registry in 5 minutes"
slug: "get-a-tls-enabled-docker-registry-in-5-minutes"
date: "2020-02-13T10:00:14Z"
author: "Alex Ellis"
meta_title: "Get a TLS-enabled Docker registry in 5 minutes"
meta_description: "Learn how you can bootstrap a Docker registry with TLS on public cloud or private infrastructure in less than 5 minutes using OSS tooling and Kubernetes."
feature_image: "/content/images/2020/02/benjamin-voros-phIFdC6lA4E-unsplash-small.jpg"
tags:
  - "kubernetes"
  - "cloud native"
  - "cert-manager"
  - "docker registry"
  - "tls"
  - "inlets"
  - "arkade"
---

Some tasks in DevOps are repetitive and boring, setting up a TLS-enabled Docker registry is one of those things, however today I'm going to show you just how easy it can be thanks to open-source automation tools like `arkade`.

["arkade"](https://get-arkade.dev/) is a portable Kubernetes marketplace, which is also open-source and has around 40 apps available.

It works as CLI that can be used to install a dozen of the most popular Kubernetes apps with a single command. Each app wraps a helm chart, or a templated Kubernetes manifest file crafted for the job at hand.

> arkade uses CLI flags, so that you don't have to waste time contending with README files and values.yaml files.

First decide whether you want to set this up locally, or on a cluster with a public IP address. Both are fair-game and can get a TLS certificate, the public cluster can use a NodePort, or a LoadBalancer, and private clusters can use the [inlets](https://inlets.dev/) project to provide an IP from a VM in the cloud.

## Bill of materials

![registry](/content/images/2020/02/registry.png)

> Pictured: a registry on public cloud using an IngressController with a LoadBalancer.

* A Kubernetes cluster, local, remote or on public cloud - this also works on a Raspberry Pi
* An existing domain-name - or buy one from 1 USD
* nginx-ingress, Traefik, or another [IngressController](https://kubernetes.io/docs/concepts/services-networking/ingress-controllers/) - to serve HTTPS traffic
* [cert-manager](https://docs.cert-manager.io/en/latest/) - to obtain TLS certificates
* [docker-registry](https://github.com/helm/charts/tree/master/stable/docker-registry) - an open source Docker registry
* [inlets-operator (optional)](https://github.com/inlets/inlets-operator) - required if running on-premises or on your laptop

## Get arkade

Install arkade:

```sh
curl -sLS https://dl.get-arkade.dev | sh
sudo install arkade /usr/local/bin/

arkade --help
```

> Note: Windows users should use Git Bash

### Get a domain

You may already have a domain, if you don't you can pay between 1 USD and 10 USD for this and then it's yours for a year. 

My favourites are:

* [namecheap.com](https://namecheap.com) - by from 1 USD
* [domains.google.com](https://domains.google.com) - for a .dev domain

You can also bring your own existing domain. Why is that needed? It's how TLS certificates work, and a proper Docker registry needs a certificate for encryption.

### All-in-one for cloud users

```sh
arkade install nginx-ingress
arkade install cert-manager
arkade install docker-registry
arkade install docker-registry-ingress \
  --email web@example.com \
  --domain reg.example.com
```

Each command installs the upstream helm chart using defaults and provides several popular overrides, just run `arkade install APP --help` for more.

The `docker-registry-ingress` app generates a cert-manager ClusterIssuer and an Ingress record for the Registry.

Did you know? You can [read the arkade code on GitHub, and star/fork the project](https://get-arkade.dev/).

What if you use Traefik instead? That's fine, just add your `--ingress-class` to the `docker-registry-ingress` app.

```sh
arkade install docker-registry-ingress \
  --email webmaster@example.com  \
  --domain reg.example.com \
  --ingress-class traefik
```

Does your cloud not support `LoadBalancer`? Install Nginx in host mode to make use of the node's IP address, try `arkade install nginx-ingress --help` for more settings.

### Private clusters / local use

If you're running a cluster on your Raspberry Pi cluster, laptop with Minikube, KinD, or k3d, or in the lab, then don't worry, you can still use the steps above, but you'll need to create a tunnel for your IngressController.

You can use the [inlets-operator](https://github.com/inlets/inlets-operator) to create a cloud host and a secure Cloud Native tunnel between your local Kubernetes Services and the Internet. Any service of type LoadBalancer will be exposed automatically on the cheapest VM available from your IaaS provider. For DigitalOcean that's as low as 5 USD / mo.

![registry-on-prem-2](/content/images/2020/02/registry-on-prem-2.png)

> Pictured: a registry running on a private cluster using a secure Cloud Native Tunnel to obtain a public IP address.

If you want to use TLS, and that's what this tutorial is about, then you'll need [inlets-pro](https://docs.inlets.dev/), inlets OSS can be used if you want an insecure tunnel, or if you are happy to configure everything on your own.

Get [a free 14-day trial for inlets-pro](https://inlets.dev/) or purchase a discounted license for personal use.

Set your licence in `.bash_rc` as `export LICENSE="VALUE_HERE"` or use `--license-from ~/LICENSE`

Get an encrypted tunnel and public IP for your cluster by using a cloud host/VM as an exit-node

Create an access token for one of the supported cloud providers such as DigitalOcean. [Get free DigitalOcean credits here](https://m.do.co/c/8d4e75e9886f) if you don't have an account yet.

Save your access token as a file: `~/access-token.txt` - you can create this in your dashboard under "API".

Set the region to your closest, for me that's `lon1`:

```sh
arkade install inlets-operator \
 --license $LICENSE \
 --provider digitalocean \
 --acces-token-file ~/access-token.txt \
 --region lon1
```

> Alternatively use `--license-from ~/LICENSE` to read from a file.

You'll now be able to see your IP address go from "Pending" to a real IP for any LoadBalancer in your cluster.

```sh
kubectl get svc -n kube-system
NAME       TYPE           CLUSTER-IP      EXTERNAL-IP                                                PORT(S)
traefik    LoadBalancer   10.43.217.239   189.85.134.151   80:31563/TCP,443:32156/TCP
```

In my example the IP for use is `189.85.134.151`, which will route through to my Raspberry Pi in my house.

> If you want to use GCP or another cloud, find out the flags and options [in the helm chart](https://github.com/inlets/inlets-operator) and use `--set key=value` or run `arkade install NAME --help`. For instance, the provider for Packet.com also requires a `--project-id` flag.

### Setup your DNS

Next, set up a DNS A record between the IP address of Nginx, or your custom IngressController and the domain you used for the `docker-registry-ingress` app i.e. `reg.example.com`.

### Profit

Well, that's it, we're done now and there's nothing more to see. Enjoy your Docker registry.

```sh
docker tag alpine:3.11 reg.example.com/alpine:3.11
docker push reg.example.com/alpine:3.11
docker pull reg.example.com/alpine:3.11
```

If you're planning on using the registry with Kubernetes, then you will need to [configure an ImagePullSecret for your Pods](https://kubernetes.io/docs/tasks/configure-pod-container/pull-image-private-registry/), you can also [configure this at the namespace-level for a ServiceAccount](https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/).

If you run into any issues, then feel free to join the `#arkade` channel on [OpenFaaS Slack](https://slack.openfaas.io/)

### What else can I do?

Check out the other apps for arkade, or feel free to suggest your own additionals. Most of the apps are multi-arch which means they can run on Intel and ARM (think Raspberry Pi, Ampere, or AWS Graviton).

We're adding new apps all the time, so checkout the list and keep up to date with `arkade update`.

```bash
arkade install --help
```

arkade also bootstraps Kubernetes clusters using `ssh`, it can be a great way of getting up and running in a short period of time. You can find a list of blog posts and tutorials in the [arkade repo](https://get-arkade.dev/)

Try one of my other tutorials for inlets or inlets-pro:

* [Share work with clients using inlets](https://blog.alexellis.io/share-work-using-inlets/)
* [Get kubectl access to your private cluster from anywhere](https://blog.alexellis.io/get-private-kubectl-access-anywhere/)
* [Build a 10 USD Raspberry Pi Tunnel Gateway](https://blog.alexellis.io/raspberry-pi-zero-tunnel-gateway/)

Connect with me:

* [Subscribe to my premium newsletter for more exclusive content and news](https://github.com/sponsors/alexellis/)
* [Hire OpenFaaS Ltd to consult for you on Cloud Native](https://calendly.com/alexellis/)