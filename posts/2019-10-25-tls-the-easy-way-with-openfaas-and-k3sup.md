---
title: "Get TLS for OpenFaaS the easy way with arkade"
slug: "tls-the-easy-way-with-openfaas-and-k3sup"
date: "2019-10-25T12:17:13Z"
author: "Alex Ellis"
meta_title: "Get TLS for OpenFaaS the easy way with arkade"
meta_description: "Get free TLS certificates for your OpenFaaS installation, the easy way with arkade - a new tool that can automate all the repetitive and confusing tasks."
feature_image: "/content/images/2019/10/thor-alvis-sgrCLKYdw5g-unsplash.jpg"
---

TLS certificates are offered for free by LetsEncrypt and cert-manager, a popular tool from Jetstack makes the management and renewal automatic. The tooling changes often and even experienced Kubernetes users find the process confusing.

> Last Updated: September 2020 - to include ingress-nginx rename, and inlets-operator to run these instructions at home or on-premises.

<img src="https://raw.githubusercontent.com/jetstack/cert-manager/ed2c0e0b3df1d10c3ad219348ed7b1ba56771655/logo/logo.svg?sanitize=true" width="200px"></img>

For that reason there is [documentation on the OpenFaaS website](https://docs.openfaas.com/reference/ssl/kubernetes-with-cert-manager/) for how to configure a TLS certificate for your OpenFaaS Gateway. Once in place, traffic between your users and your Kubernetes cluster is encrypted.

<img src="https://avatars0.githubusercontent.com/u/27013154?s=200&v=4" width="200px"></img>

Today I'll show you how to bootstrap everything from scratch on a managed Kubernetes service using the OSS `arkade` tool.

### Provision your Kubernetes cluster

You can provision a cluster wherever you want, whether that be Google Kubernetes Engine, DigitalOcean Kubernetes, AWS EKS or somewhere else.

I suggest you create a cluster with DigitalOcean since it's fast, cheap, and a fully managed cluster. Once you have everything working, move on to your preferred choice for your company or team.

Product page for: [DOKS](https://www.digitalocean.com/products/kubernetes/)

* Setup a cluster in your preferred region with around 2-4GB RAM total and at least 2x vCPUs.
* Download your KUBECONFIG file and run `export KUBECONFIG=~/Downloads/kube.config` (replace the path with the actual name)

### Get arkade

`arkade` can be used to install `apps` to Kubernetes clusters. The way an `app` is installed is by using its [helm](https://helm.sh) chart to generate YAML manifest files and then apply them. This process bypasses `tiller` completely, something which will be [deprecated in helm 3](https://v3.helm.sh).

Install arkade, which is a Kubernetes app installer.

```sh
curl -sLS https://get.arkade.dev | sh
sudo install arkade /usr/local/bin/

arkade --help
```

### Install nginx IngressController

We need an [IngressController](https://kubernetes.io/docs/concepts/services-networking/ingress-controllers/) to use with cert-manager, so let's install [nginx-ingress](https://github.com/kubernetes/ingress-nginx).

```sh
arkade install ingress-nginx
```

### Install cert-manager

```sh
arkade install cert-manager
```

This command installs [JetStack's cert-manager](https://github.com/jetstack/cert-manager) using the helm chart, but without `tiller`.

### Install openfaas

```sh
arkade install openfaas
```

This command [installs OpenFaaS](https://www.openfaas.com/) using the helm chart.

### Are you on public cloud?

If you're running in your homelab, on-premises or with a Raspberry Pi cluster, then it's likely that you don't have a Public IP.

> Before creating an IP forwarding rule on your router, remember that you are exposing your location and ISP information to the world, there's a better way

Get a public IP for ingress-nginx through inlets PRO and the inlets-operator:

```bash
arkade install inlets-operator \
 --provider digitalocean \
 --region lon1 \
 --token-file ~/Downloads/digitalocean-api-key
```

The inlets-operator will create a public IP for you, and you can continue as if you were running on Public Cloud.

> Get a [free trial or purchase inlets PRO here](https://inlets.dev/)
 
### Configure your Ingress

Let's say that you have a domain called `example.com`. If you don't have a domain yet, just buy one from Google Domains or from [Namecheap.com](https://www.namecheap.com/). They start at under 2 USD, so there is no reason not to.

We'll use a sub-domain of `openfaas` so the full address would be: `openfaas.example.com`.

```sh
export TOP_DOMAIN=example.com
export DOMAIN=openfaas.$TOP_DOMAIN

export EMAIL=webmaster@$DOMAIN
arkade install openfaas-ingress \
 --domain $DOMAIN \
 --email $EMAIL
```

This creates an Issuer with your email address and an Ingress record, which cert-manager will use to create your TLS certificate automatically.


### Update your DNS record

In order for the certificate to be issued, your new LoadBalancer created for Nginx needs to point at the domain name you used in the previous step i.e. `echo $DOMAIN`.

Now find the IP with `kubectl get svc` - you'll see Nginx has an EXTERNAL-IP.

* For EKS create a DNS CNAME record for the DNS entry given
* For all other cluster create a DNS A record with the IP given

If you have the DigitalOcean CLI installed [doctl](https://github.com/digitalocean/doctl) then you can run:

```
export IP="" # populate from above
doctl compute domain create $DOMAIN --ip-address $IP
```

### Wait a little

You now need to wait for your DNS entry to propagate and for cert-manager to obtain a certificate.

Check how things are going with:

```
kubectl logs deploy/cert-manager -n cert-manager -f
```

### Log-in to OpenFaaS with TLS

```sh
export OPENFAAS_URL=https://$DOMAIN

PASSWORD=$(kubectl get secret -n openfaas basic-auth -o jsonpath="{.data.basic-auth-password}" | base64 --decode; echo)

echo $PASSWORD | faas-cli login -s

faas-cli store deploy nodeinfo
faas-cli list -v

faas-cli invoke figlet
```

You can also open the OpenFaaS UI over an encrypted connection:

```
echo Open a browser at https://$DOMAIN
```

![Screenshot-2019-10-25-at-14.12.43](/content/images/2019/10/Screenshot-2019-10-25-at-14.12.43.png)

## Wrapping up

When I proposed that `arkade` should configure TLS for OpenFaaS in a single command, it was because I wanted to make the whole process less painful and repetitive, and to guard users from the many breaking changes we've seen in cert-manager over the course of the last 12 months.

I think I achieved that aim, but make up your own mind. Compare the following with the single line we typed in above:

* Full docs: [Add TLS to OpenFaaS with cert-manager](https://docs.openfaas.com/reference/ssl/kubernetes-with-cert-manager/)

Interest in OpenFaaS and `arkade` is growing rapidly, so for me it's even more important that users have easy access to TLS certificates to encrypt their traffic.

If you'd like to see new "apps" (helm charts) supported in arkade, then let me know on the GitHub repository [https://get-arkade.dev](https://get-arkade.dev) and add your ⭐️ to show support.

Keep on learning:

* [OpenFaaS hands-on workshop](https://github.com/openfaas/workshop)
* [Enable Single Sign-on (SSO) for OpenFaaS with Okta and OpenID Connect](https://www.openfaas.com/blog/openfaas-oidc-okta/)

Connect with the [community on Slack](https://slack.openfaas.io)