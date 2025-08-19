---
title: "The World's First Managed k3s"
slug: "the-worlds-first-managed-k3s"
date: "2019-09-26T14:47:03Z"
author: "Alex Ellis"
meta_title: "The World's First Managed k3s"
meta_description: "Read my review and walk-through of The World's First Managed k3s including an application marketplace, rich UI and CLI experience designed for developers."
feature_image: "/content/images/2019/09/greg-becker-sYzFIusQp3Q-unsplash-crop.jpg"
tags:
  - "kubernetes"
  - "cloud native"
  - "review"
  - "first impressions"
---

Yes, you read it correctly. In this post I'll kick the tires with and walk you through how you can use the world's first *managed k3s service*. k3s is a light-weight distribution of [Kubernetes](https://kubernetes.io) re-packaged by [Darren Shepherd](https://twitter.com/ibuildthecloud?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor), Chief Architect at [Rancher Labs](https://rancher.com).

I'll introduce you to [Civo](https://civo.com/) and how the idea came about. Then I will show you how to use the platform to setup a 5-node cluster with [OpenFaaS](https://www.openfaas.com), [cert-manager](https://github.com/jetstack/cert-manager), [metrics-server](https://github.com/kubernetes-incubator/metrics-server), [Minio](https://min.io), and persistent storage, all within a few minutes. At the end of the post, I'll wrap things up with a quick summary and show you how to get involved.

> Disclosure: Civo is a client of OpenFaaS Ltd

## How did this all start?

It all started when [Civo Cloud](https://civo.com) based out of Stevenage in the UK asked me to help them think through what a managed Functions and Kubernetes service would look like and what they should prioritize first. I advised the team to build their Kubernetes service first, and that a Functions platform like OpenFaaS or OpenWhisk could be hosted on it at a later date.

The team had been using Kubernetes to run their own platform for several months and had previously drawn-up plans to build a managed offering with the classic HA control-plane and hidden master. Whilst deep in discussion about IP subnets and networking drivers, their CTO Andy Jeffries asked a question:

> "Could we just use k3s?"

That's where it all started and since then I've worked with Civo as a consultant and Cloud Native coach through OpenFaaS Ltd. I gave regular feedback and advice on the developer experience and design. I've been impressed by the speed at which the team has delivered a functioning product with a simple developer-experience. The team are now seeking input from the community and have launched an early access program.

## Kicking the tires

Civo are giving early access to a limited number of developers through the `#kube100` program. Participants of `#kube100` will get a swag shipment from Civo HQ and enough credit to run a 3-node cluster for free for the duration of the program.

![SWAG](/content/images/2020/07/EFPaY5_WsAIzGqS.jpeg)

* [Sign up for #KUBE100](https://www.civo.com/?ref=0d595f) and receive free credits to get started

### Create the cluster

There are three ways to create a cluster:

1) The "Kubernetes" tab on Civo.com
2) The Civo CLI (written in Ruby, available as a gem)
3) Civo.com REST API

I'll show you how 1) and 2) work in detail.

Let's start with 1) - the UI.

![launch](/content/images/2019/09/launch.png)

> I was greeted with a friendly welcome page

Click *Launch my first cluster*.

On this page you first select how many nodes you'd like, what to call the cluster and how much memory/CPU you'd like to have for each node.

![sizing](/content/images/2019/09/sizing.png)

The cluster can be scaled at any time to add or remove nodes.

You can now select which applications you'd like to have pre-installed from the Civo Marketplace. Each *application* is added through pull-request on GitHub.com in the [k3s-marketplace](https://github.com/civo/k3s-marketplace) repo.

![marketplace](/content/images/2019/09/marketplace.png)

Your cluster will now take between 1-2 minutes to provision and then you can get hold of your KUBECONFIG and start deploying your code.

![spin-up](/content/images/2019/09/spin-up.png)

Whilst the cluster is spinning up, I wanted to mention the third-way to create and managed clusteres: the Civo REST API. You can find API documentation with examples showing `curl`, `Node.js` and `Ruby`. As a `#kube100` participant, you can access this via [https://www.civo.com/api/kubernetes](https://www.civo.com/api/kubernetes).

The first version of the API includes:

* Create a cluster
* List clusters
* Get a cluster
* Update a cluster (can be used to scale nodes)
* List marketplace applications
* Delete a cluster
* Recycle a node

### The Marketplace for "applications"

Before writing this post I submitted PRs to add: cert-manager, openfaas, and metrics-server. I found the experience relatively straight-forward, it involved writing a YAML file and a shell script.

Here's what I wrote for OpenFaaS:

```yaml
name: OpenFaaS
version: 0.17.0
dependencies:
  - Helm
maintainer: "@openfaasltd"
description: "OpenFaaS (Functions as a Service) is a framework for building serverless functions with Docker and Kubernetes which has first class support for metrics."
url: https://www.openfaas.com/
category: architecture
configuration:
  GATEWAY_PASSWORD:
    label: "Gateway password"
    value: "CIVO:ALPHANUMERIC(20)"
```

Civo added a templating language which allows passwords and other configuration to be generated at deployment time.

```sh
#!/bin/bash

kubectl apply -f https://raw.githubusercontent.com/openfaas/faas-netes/master/namespaces.yml

helm repo add openfaas https://openfaas.github.io/faas-netes/

kubectl -n openfaas create secret generic basic-auth \
--from-literal=basic-auth-user=admin \
--from-literal=basic-auth-password="$GATEWAY_PASSWORD"

helm repo update \
 && helm upgrade openfaas --install openfaas/openfaas \
    --namespace openfaas  \
    --set basic_auth=true \
    --set functionNamespace=openfaas-fn
```

The script is almost a 1:1 reflection of the OpenFaaS helm chart instructions, which will make maintenance relatively easy.

You can also supply a markdown file which is displayed to users after they have installed your application.

### The cluster status

The cluster status is shown whilst it is being built and then the same page shows the applications added and how to access any passwords or generated configuration.

![status](/content/images/2019/09/status.png)

Each node gets its own IPv4 IP-address and can be accessed via a DNS record which has round-robin configuration for each IP.

![nodes-up](/content/images/2019/09/nodes-up.png)

```
nslookup 228e6d0a-53ba-4d5c-b237-0bc7271e613e.k8s.civo.com
Server:		1.1.1.1
Address:	1.1.1.1#53

Non-authoritative answer:
Name:	228e6d0a-53ba-4d5c-b237-0bc7271e613e.k8s.civo.com
Address: 185.136.234.160
Name:	228e6d0a-53ba-4d5c-b237-0bc7271e613e.k8s.civo.com
Address: 185.136.234.169
Name:	228e6d0a-53ba-4d5c-b237-0bc7271e613e.k8s.civo.com
Address: 185.136.234.204
Name:	228e6d0a-53ba-4d5c-b237-0bc7271e613e.k8s.civo.com
Address: 185.136.235.17
Name:	228e6d0a-53ba-4d5c-b237-0bc7271e613e.k8s.civo.com
Address: 185.136.234.100
```

This is especially useful because there is currently no Kubernetes LoadBalancer integration available for Civo yet.

Traefik comes pre-installed as your IngressController, so you can create a CNAME for the "DNS Name" to match your own domain name such as `openfaas.on-k3s.dev`

### Applications status

We can also view the status of the applications which we've installed and view the post installation guide.

![post-install-openfaas](/content/images/2019/09/post-install-openfaas.png)

I loved the way that the login password for OpenFaaS was only one click away at all times. I can just log into the dashboard and click on the application to copy it to my clipboard.

Any values which are templated at installation time will appear pinned here. I don't know if you've ever had to go searching for a command to retrieve your Postgres password from a helm chart? I have. This makes for a refreshing developer experience.

Remember that I also installed [Minio](https://min.io)?

Well you can get the access and secret key in exactly the same way 👇

![minio](/content/images/2019/09/minio.png)

### Get to `kubectl`

With every managed Kubernetes service there are normally two ways to get access a KUBECONFIG file and `kubectl`.

1) Download from the UI (a single click), then run `export KUBECONFIG=SOME_PATH`
2) Download via a CLI command

Civo's k3s is no different. You can download the KUBECONFIG file as soon as the cluster is ready.

You can install the Civo CLI with Ruby via `sudo gem install civo civo_cli`, then [follow the instructions](https://github.com/civo/cli) to add an API key.

For the CLI there are a set of commands which the team added for Kubernetes:

```sh
# List clusters
civo kubernetes ls

...
serverless-apps
...

# Save and merge a kubeconfig to ~/.kube/config
civo kubernetes config --save CLUSTER_NAME

Merged config into ~/.kube/config
```

> Note: the context does not change by default, so use `kubectl config set-context` to do that.

There are also we useful aliases: `civo k3s` and `civo k8s`.

A feature I really liked was being able to type in `civo k8s create` with no parameters, node sizes or even a name, and to be able to get a working cluster within a minute or two.

See it in action here:

<iframe width="560" height="315" src="https://www.youtube.com/embed/Syijq_XYvJI" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

To set up a cluster with OpenFaaS or some other applications, just add `--applications` to `civo k8s create`.

### Try an application - OpenFaaS

Since we installed OpenFaaS earlier as an *application*, all I have to do is to copy the gateway password and then find the link for the gateway.

`DNS Name: 228e6d0a-53ba-4d5c-b237-0bc7271e613e.k8s.civo.com`

So it will be the following:

```sh
export DNS=228e6d0a-53ba-4d5c-b237-0bc7271e613e.k8s.civo.com
export NODE_PORT=31112
export OPENFAAS_URL=http://$DNS:$NODE_PORT

echo $OPENFAAS_URL

http://228e6d0a-53ba-4d5c-b237-0bc7271e613e.k8s.civo.com:31112
```

![login](/content/images/2019/09/login.png)

I can also log into OpenFaaS using the `faas-cli`:

```sh
cat | faas-cli login --password-stdin

# Now enter the password, followed by Control+D

Calling the OpenFaaS server to validate the credentials...
WARNING! Communication is not secure, please consider using HTTPS. Letsencrypt.org offers free SSL/TLS certificates.
credentials saved for admin http://228e6d0a-53ba-4d5c-b237-0bc7271e613e.k8s.civo.com:31112
```

> Note the warning on TLS, by default the OpenFaaS chart comes without TLS enabled.

You can add SSL/TLS through an IngressController and cert-manager [using this guide for SSL](https://docs.openfaas.com/reference/ssl/kubernetes-with-cert-manager/).

Now you can deploy a Function from the OpenFaaS Function Store:

![of-store](/content/images/2019/09/of-store.png)

You can pick from a mixture of samples, machine learning models, and utilities. I've deployed the "haveibeenpwned" function

The haveibeenpwned function finds out whether a password was used in a breach. The code is [available here](https://github.com/openfaas/faas/tree/master/sample-functions/haveibeenpwned) and is written with the [Go template](https://www.openfaas.com/blog/golang-serverless/).

Let's try the word `kubernetes`:

![deployed](/content/images/2019/09/deployed-1.png)

haveibeenpwned showed us that it was only used 6 times. Let's try the same with the command line and `password`.

```sh
curl --data "password" http://228e6d0a-53ba-4d5c-b237-0bc7271e613e.k8s.civo.com:31112/function/haveibeenpwned

{"found":3730471}

# or use the CLI

echo password | faas-cli invoke
```

Can you believe that so many people actually use `password` for their login credentials?!

If you'd like to learn how to build microservices, web-pages, and functions with OpenFaaS, then try the [hands-on OpenFaaS workshop](https://github.com/openfaas/workshop/).

### Try an application - metrics-server

The post install guide that I wrote for the metrics-server application shows how to test and make use of `kubectl` to interrogate node and Pod usage across your cluster.

![Screenshot-2019-09-16-at-16.41.01](/content/images/2019/09/Screenshot-2019-09-16-at-16.41.01.png)

Node usage:

```
kubectl top node
NAME               CPU(cores)   CPU%   MEMORY(bytes)   MEMORY%   
kube-master-4897   133m         6%     849Mi           21%       
kube-node-9ad1     62m          3%     563Mi           14%       
kube-node-b07c     74m          3%     621Mi           15%       
kube-node-b160     87m          4%     519Mi           13%       
kube-node-fd85     81m          4%     550Mi           13% 
```

Pod usage:

```
kubectl top pod --all-namespaces
NAMESPACE         NAME                                       CPU(cores)   MEMORY(bytes)   
cert-manager      cert-manager-79d7495f47-vd9zd              3m           10Mi            
cert-manager      cert-manager-cainjector-6f868ccdf6-fqsp4   3m           16Mi            
cert-manager      cert-manager-webhook-5896b5fb5c-f9999      1m           7Mi             
kube-system       coredns-b7464766c-mjm9j                    3m           8Mi             
kube-system       metrics-server-7f7ffff45b-94rbj            2m           15Mi            
kube-system       svclb-traefik-972t2                        0m           1Mi             
kube-system       svclb-traefik-c957l                        0m           1Mi             
kube-system       svclb-traefik-g6rt6                        0m           1Mi             
kube-system       svclb-traefik-lklt8                        0m           1Mi             
kube-system       svclb-traefik-qhgs8                        0m           1Mi             
kube-system       tiller-deploy-7f4d76c4b6-6wl4b             1m           9Mi             
kube-system       traefik-5c79b789c5-hzw22                   4m           17Mi            
longhorn-system   csi-attacher-684954f579-9kvn2              1m           4Mi             
longhorn-system   csi-attacher-684954f579-vldq6              1m           4Mi             
longhorn-system   csi-attacher-684954f579-zjz5l              2m           7Mi             
longhorn-system   csi-provisioner-589c467bb6-5wc7z           3m           7Mi             
longhorn-system   csi-provisioner-589c467bb6-895n2           1m           4Mi             
longhorn-system   csi-provisioner-589c467bb6-94crn           1m           5Mi             
longhorn-system   engine-image-ei-9bea8a9c-8pdkf             2m           10Mi            
longhorn-system   engine-image-ei-9bea8a9c-9dwmr             2m           1Mi             
longhorn-system   engine-image-ei-9bea8a9c-jqzjg             2m           1Mi             
longhorn-system   engine-image-ei-9bea8a9c-snjcv             2m           1Mi             
longhorn-system   engine-image-ei-9bea8a9c-xn69h             2m           1Mi             
longhorn-system   longhorn-csi-plugin-9ph88                  1m           9Mi             
longhorn-system   longhorn-csi-plugin-b4h28                  1m           9Mi             
longhorn-system   longhorn-csi-plugin-x8xqv                  1m           9Mi             
longhorn-system   longhorn-csi-plugin-xzxfg                  1m           9Mi             
longhorn-system   longhorn-csi-plugin-z5q7t                  1m           8Mi             
longhorn-system   longhorn-driver-deployer-5df9b9c4b-6zcnx   0m           7Mi             
longhorn-system   longhorn-manager-7rlbl                     5m           21Mi            
longhorn-system   longhorn-manager-96lqh                     3m           21Mi            
longhorn-system   longhorn-manager-blxxw                     6m           21Mi            
longhorn-system   longhorn-manager-x25gr                     7m           22Mi            
longhorn-system   longhorn-manager-z6qcb                     5m           21Mi            
longhorn-system   longhorn-ui-58c8f5d577-nqml8               0m           2Mi             
openfaas          alertmanager-78cb768565-c8mql              1m           7Mi             
openfaas          basic-auth-plugin-85994747dd-5zk5v         1m           6Mi             
openfaas          faas-idler-6568bb4c9b-ssx4c                1m           4Mi             
openfaas          gateway-5b68979d6b-rkbc5                   2m           17Mi            
openfaas          nats-d4c9d8d95-qg6h2                       1m           4Mi             
openfaas          prometheus-7b4598df45-r6p7t                3m           30Mi            
openfaas          queue-worker-56b64d6848-wfql6              1m           1Mi             
openfaas-fn       haveibeenpwned-68b798f9c9-959tm            1m           4Mi 
```

The majority of the workloads we can see were crearted by [Longhorn](https://rancher.com/project-longhorn-now-available-kubernetes/). Rancher's Longhorn project adds [PersistentVolume](https://kubernetes.io/docs/concepts/storage/persistent-volumes/) capabilities to k3s.

### Can I get TLS for that?

I would like to add TLS to my OpenFaaS installation, so I'm going to create an Ingress record with annotations that cert-manager will respond to and a TLS issuer for the ACME HTTP01 challenge.

*ingress.yaml*

```yaml
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: openfaas-gateway
  namespace: openfaas
  annotations:
    certmanager.k8s.io/acme-challenge-type: http01
    certmanager.k8s.io/issuer: letsencrypt-prod
    kubernetes.io/ingress.class: traefik
spec:
  rules:
  - host: gw.openfaas.on-k3s.dev
    http:
      paths:
      - backend:
          serviceName: gateway
          servicePort: 8080
        path: /
  tls:
  - hosts:
    - gw.openfaas.on-k3s.dev
    secretName: gw-openfaas-on-k3s-dev-tls-cert
```

*issuer.yaml*

```yaml
apiVersion: certmanager.k8s.io/v1alpha1
kind: Issuer
metadata: 
  name: letsencrypt-prod
  namespace: openfaas
spec:
  acme:
    email: your-email@domain.com
    http01: {}
    privateKeySecretRef:
      key: ""
      name: letsencrypt-prod
    server: https://acme-v02.api.letsencrypt.org/directory
```

I then used `kubectl apply -f` to create both files and created a DNS CNAME to the record found in the Civo dashboard earlier.

This is what the DNS config looks like with Google Domains:

![domains](/content/images/2019/09/domains.png)

We can now log in with TLS enabled and have end-to-end encryption for our functions and micro-services deployed on OpenFaaS.

```sh
export OPENFAAS_URL=https://gw.openfaas.on-k3s.dev
echo $OPENFAAS_URL

https://gw.openfaas.on-k3s.dev

cat | faas-cli login --password-stdin

# Now enter the password, followed by Control+D

Calling the OpenFaaS server to validate the credentials...
credentials saved for admin https://gw.openfaas.on-k3s.dev
```

Now let's list our endpoints:

```sh
faas-cli list -v

Function                      	Image                                   	Invocations    	Replicas
haveibeenpwned                	functions/haveibeenpwned:0.13.0         	2              	1    
```

Notice that the insecure warning has now disappeared, and we can now use OpenFaaS with TLS encryption between our clients and our cluster.

### What about scaling?

Civo k3s clusters can be resized at any time, and providing there is capacity, then your new workloads will be rescheduled in the cluster. The `kubectl top node/pod` command can help you estimate how densely you can pack the cluster.

Here's how much the cluster will cost me if I resize down to 3 nodes, instead of 5.

![right-sizing](/content/images/2019/09/right-sizing.png)

Right-sizing can be hard and auto-scaling groups or the [Kubernetes Cluster auto-scaler](https://github.com/kubernetes/autoscaler/tree/master/cluster-autoscaler) can help here. At time of writing Civo is not supported, but this may be subject to change. I would encourage Civo to add support.

What I do like is that Civo go to lengths to help the user and to explain what each screen does.

You can create multiple clusters and view them on the overview page. For development, you can even create a cluster with a single server node.

![server-node](/content/images/2019/09/server-node.png)

## Wrapping up

The Civo team are pioneering the world's first k3s service and seeking feedback from potential users and customers to shape it and add the remaining features to make it ready for development teams.

* The marketplace means that maintainers can package applications with ease
* The attention to detail and design of the UI and CLI bring a intuitive experience
* k3s makes for an accessible and light-weight Kubernetes experience

This is probably the easiest way to get OpenFaaS up and running on Kubernetes to date and adding TLS with cert-manager wasn't much harder either.

This Hacker News post on k3s shows that developers are [very excited](https://news.ycombinator.com/item?id=19261324) about any efforts we can make as an industry to level the barrier to entry for Kubernetes. I think that Civo's work represents a significant move forward in this area.

This post shared my first impressions with you today, but I've been leaning on my sense of developer experience and my experience as a [CNCF Ambassador](https://blog.alexellis.io/joining-the-cncf-ambassadors/) to guide and direct the vision for the k3s service and marketplace.

Here are some items I'd like to see next:

* A new [cloudprovider](https://github.com/kubernetes/autoscaler/tree/master/cluster-autoscaler/cloudprovider) for Civo in the Cluster Autoscaler
* Support for `LoadBalancer` either through the Civo LoadBalancer offering, or with the DNS Name populated there
* HA master - the Rancher master node (called a server) is only running a single instance, this is fine for development, but a HA-mode as an option would be ideal
* Additional applications: a registry, Postgres, Redis, and [SealedSecrets](https://github.com/bitnami-labs/sealed-secrets)
* Support for multiple node pools of differing sizes
* Built-in support for PersistentVolumes and [CSI](https://kubernetes.io/blog/2019/01/15/container-storage-interface-ga/) without hosting Longhorn

Creating applications for the marketplace was straight-forward and a painless experience, the UI integration is the best I've seen so far. For General Availability (GA), the team will also need to think through the lifecycle problem of updating and removing applications which is not covered yet.

You may have your own wishlist of items, so in the spirit of being fair and impartial, I think that *you* should sign up for `#kube100`. Use my blog post as a guide or tour of the features, but test it out for yourself and make up your own mind. I know the team will be keen to hear your feedback on the new Slack workspace and via GitHub.

* [Sign up for #KUBE100](https://www.civo.com/?ref=0d595f) and receive free credits to get started

### Coming up next

In the next post I'll use OpenFaaS to build an example Cloud Native app by taking advantage of the applications in the Civo marketplace. [Follow me on Twitter @alexellisuk](https://twitter.com/alexellisuk/) so you don't miss it.

You may also like:

* [First Impressions of 'Managed K3s'](https://rancher.com/blog/2019/first-impressions-managed-k3s) on rancher.com
* [k3s vs. k8s](https://www.civo.com/blog/k8s-vs-k3s) on Civo.com
* [Walk-through — install Kubernetes with k3s to your Raspberry Pi in 15 minutes](https://medium.com/@alexellisuk/walk-through-install-kubernetes-to-your-raspberry-pi-in-15-minutes-84a8492dc95a)