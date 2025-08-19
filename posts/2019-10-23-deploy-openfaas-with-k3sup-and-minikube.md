---
title: "Deploy OpenFaaS with k3sup and minikube"
slug: "deploy-openfaas-with-k3sup-and-minikube"
date: "2019-10-23T10:14:42Z"
author: "Alex Ellis"
meta_title: "Deploy OpenFaaS with k3sup and minikube"
meta_description: "Get up and running with OpenFaaS and Minikube on your Mac within a few minutes. This guide simplifies the while process through the use of k3sup (ketchup)."
feature_image: "/content/images/2019/10/kalen-emsley-Bkci_8qcdvQ-unsplash.jpg"
tags:
  - "k3sup"
  - "minikube"
  - "serverless"
  - "openfaas"
---

A couple of years ago [I wrote a blog post on how to install OpenFaaS using minikube](https://medium.com/faun/getting-started-with-openfaas-on-minikube-634502c7acdf), and since then the project has grown and been updated. The tutorial is still up to date. Today I want to show you how that process has been automated and now you can enjoy a simpler way to get started.

This tutorial is for MacOS, the instructions for Linux or Windows may vary slightly, if you need any technical support feel free to join [OpenFaaS slack](https://slack.openfaas.io/).

## Get minikube

Minikube recently had a facelift and gained emojis and reliability updates. It still requries a hypervisor like hyperkit (built into MacOS) or VirtualBox. This means that a separate Virtual Machine (VM) is run on your computer.

* Download minikube from https://minikube.sigs.k8s.io/docs/start/

    I prefer the "direct" download which is faster than using brew.

* Start a VM with Hyperkit

    In my experience Hyperkit is faster and lighter weight than VirtualBox, so you should try that first. If it doesn't work out, then fall-back to VirtualBox.
    
    Let's allocate 4GB so that we have more than enough resources:
    
    ```sh
    minikube start --vm-driver=hyperkit \
      --memory 4048mb \
      --kubernetes-version='v1.15.0'
    ```
    
    Enjoy the new emojis:

    ``` sh
    😄  minikube v1.4.0 on Darwin 10.14.6
    🔥  Creating hyperkit VM (CPUs=2, Memory=4048MB, Disk=20000MB) ...
    🐳  Preparing Kubernetes v1.15.0 on Docker 18.09.9 ...
    🚜  Pulling images ...
    🚀  Launching Kubernetes ... 
    ⌛  Waiting for: apiserver proxy etcd
    🏄  Done! kubectl is now configured to use "minikube"
    ```
    
    At time of writing, v1.15.0 is a more suitable choice than v1.16.0 since some projects are still updating for breaking changes in the latest version of Kubernetes.
    
    Your Kubernetes context should be automatically set to `minikube`, check that with `kubectl config get-contexts`.

## Get k3sup ('ketchup')

`k3sup` is a tool that can create Kubernetes clusters using `k3s`, but it can also install helm charts and applications to any Kubernetes cluster.

```sh
curl -SLfs https://get.k3sup.dev | sudo sh
```

> See also: [k3sup website](https://k3sup.dev)

## Install OpenFaaS

Run the following for an installation:

```sh
k3sup app install openfaas --load-balancer
```

The tool will use the [helm chart](https://github.com/openfaas/faas-netes/tree/master/chart/openfaas), but will bypass the use of `tiller`, which is [considered by some to be insecure](https://engineering.bitnami.com/articles/running-helm-in-production.html).

## Get up and running

The `k3sup` tool will tell you how to get your password and open the OpenFaaS UI. You're now good to go.

![portal](/content/images/2019/10/portal.png)
*Pictured: OpenFaaS Portal*

You can find out what other apps you can install using `k3sup app install --help`.

## What next?

You'll need these commands:

* `minikube start` - start your environment again
* `minikube delete` - clean-up the cluster

What else can you try?

* Run through the [OpenFaaS workshop](https://github.com/openfaas/workshop/)
* Try my latest blog post on [OpenFaaS Cloud for Deployment](https://blog.alexellis.io/openfaas-cloud-for-development/)
* [Get a public IP address for your OpenFaaS gateway with the inlets-operator](https://blog.alexellis.io/ingress-for-your-local-kubernetes-cluster/)

You may also like: [Kubernetes Homelab with Raspberry Pi and k3sup](https://blog.alexellis.io/raspberry-pi-homelab-with-k3sup/)