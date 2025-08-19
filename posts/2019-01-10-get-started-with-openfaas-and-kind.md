---
title: "Get started with OpenFaaS and KinD"
slug: "get-started-with-openfaas-and-kind"
date: "2019-01-10T14:48:43Z"
author: "Alex Ellis"
meta_title: "Get started with OpenFaaS and KinD"
meta_description: "Get started with OpenFaaS using Kind - a minimal Kubernetes development environment that you can setup and tear-down with ease. Try out Serverless today!"
feature_image: "/content/images/2019/01/kind-bali-bay-beach-1074442.jpg"
tags:
  - "serverless"
  - "kubernetes"
  - "openfaas"
  - "open source"
  - "kind"
---

In this post I want to show you how I've started deploying OpenFaaS with the new tool from the Kubernetes community named Kubernetes in Docker or [KinD](https://github.com/kubernetes-sigs/kind). You can read my introductory blog post [Be KinD to Yourself](https://blog.alexellis.io/be-kind-to-yourself/) here.

The mission of [OpenFaaS](https://github.com/openfaas/faas) is to Make Serverless Functions Simple. It is open-source and built by developers, for developers in the open with a growing and welcoming community. With OpenFaaS can run stateless microservices and functions with a single control-plane that focuses on ease of use on top of Kubernetes. The widely accepted OCI/Docker image format is used to package and deploy your code and can be run on any cloud.

Over the past two years [more than 160 developers have contributed to code](https://kenfdev.o6s.io/github-stats-page#/), documentation and packaging. A large number of them have also written blog posts and [held events all over the world](https://github.com/openfaas/faas/blob/master/community.md).

<img src="https://raw.githubusercontent.com/openfaas/media/master/OpenFaaS_Magnet_3_1_png.png" width="90%">

> Find out more [about OpenFaaS on the blog](https://www.openfaas.com/blog) or GitHub [openfaas/faas](https://github.com/openfaas/faas)

## Pre-reqs

Unlike prior development environments for Kubernetes such as Docker for Mac or minikube - the only requirement for your system is Docker which means you can install this almost anywhere you can get `docker` installed.

This is also a nice experience for developers because it's the same on MacOS, Linux and Windows.

On a Linux host or Linux VM type in `$ curl -sLS https://get.docker.com | sudo sh`.

Download [Docker Desktop](https://www.docker.com/products/docker-desktop) for Windows or Mac.

## Create your cluster

### Install `kubectl`

The `kubectl` command is the main CLI needed to operate Kubernetes. 

* [Install and Set Up kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)

I like to install it via the [binary release here](https://kubernetes.io/docs/tasks/tools/install-kubectl/#install-kubectl-binary-using-curl).

### Get `kind`

You can get the latest and greatest by running the following command (if you have [Go installed locally](https://golang.org/dl/))

```
$ go get sigs.k8s.io/kind
```

Or if you don't want to install Golang on your system you can grab a binary from the [release page](https://github.com/kubernetes-sigs/kind/releases).

### Create one or more clusters

Another neat feature of `kind` is the ability to create one or more named clusters. I find this useful because OpenFaaS ships plain YAML files and a helm chart and I need to test both independently on a clean and fresh cluster. Why try to remove and delete all the objects you created between tests when you can just spin up an entirely fresh cluster in about the same time?

```
$ kind create cluster --name openfaas

Creating cluster 'kind-openfaas' ...
 ✓ Ensuring node image (kindest/node:v1.12.2) 🖼 
 ✓ [kind-openfaas-control-plane] Creating node container 📦 
 ✓ [kind-openfaas-control-plane] Fixing mounts 🗻 
 ✓ [kind-openfaas-control-plane] Starting systemd 🖥
 ✓ [kind-openfaas-control-plane] Waiting for docker to be ready 🐋 
⠈⡱ [kind-openfaas-control-plane] Starting Kubernetes (this may take a minute) ☸ 

```

Now there is something you must not forget if you work with other remote clusters. Always, always switch context into your new cluster before making changes.

```
$ export KUBECONFIG="$(kind get kubeconfig-path --name="openfaas")"
```

## Install OpenFaaS with helm

### Install helm and tiller

The easiest way to install OpenFaaS is to use the `helm` client and its server-side equivalent `tiller`.

* Create a ServiceAccount for Tiller:

```
$ kubectl -n kube-system create sa tiller \
 && kubectl create clusterrolebinding tiller \
      --clusterrole cluster-admin \
      --serviceaccount=kube-system:tiller
```

* Install the helm CLI

```
$ curl -sLSf https://raw.githubusercontent.com/helm/helm/master/scripts/get | sudo bash
```

* Install the Tiller server component

```
helm init --skip-refresh --upgrade --service-account tiller
```

> Note: it may take a minute or two to download `tiller` into your cluster.

### Install the OpenFaaS CLI

```
$ curl -sLSf https://cli.openfaas.com | sudo sh
```

Or on Mac use `brew install faas-cli`.

### Install OpenFaaS

You can install OpenFaaS with authentication on or off, it's up to you. Since your cluster is running locally you may want it turned off. If you decide otherwise then [checkout the documentation](https://docs.openfaas.com/).

* Create the `openfaas` and `openfaas-fn` namespaces:

```
$ kubectl apply -f https://raw.githubusercontent.com/openfaas/faas-netes/master/namespaces.yml
```

* Install using the helm chart:

```
$ helm repo add openfaas https://openfaas.github.io/faas-netes && \
    helm repo update && \
    helm upgrade openfaas --install openfaas/openfaas \
      --namespace openfaas  \
      --set basic_auth=false \
      --set functionNamespace=openfaas-fn \
      --set operator.create=true
```

The command above adds the OpenFaaS helm repository, then updates the local helm library and then installs OpenFaaS locally without authentication.

> Note: if you see `Error: could not find a ready tiller pod` then wait a few moments then try again.

You can fine-tune the settings like the timeouts, how many replicas of each service run, what version you are using and more using the [Helm chart readme](https://github.com/openfaas/faas-netes/tree/master/chart/openfaas).

## Check OpenFaaS is ready

The helm CLI should print a message such as: `To verify that openfaas has started, run:`

```
$ kubectl --namespace=openfaas get deployments -l "release=openfaas, app=openfaas"
```

The KinD cluster will now download all the core services that make up OpenFaaS and this could take a few minutes if you're on WiFi, so run the command above and look out for "AVAILABLE" turning to 1 for everything listed.

## Access OpenFaaS

Now that you've setup a cluster and OpenFaaS it's time to access the UI and API.

First forward the port of the gateway to your local machine using `kubectl`.

```
$ kubectl port-forward svc/gateway -n openfaas 8080:8080
```

> Note: If you already have a service running on port 8080, then change the port binding to `8888:8080` for instance. You should also run `export OPENFAAS_URL=http://127.0.0.1:8888` so that the CLI knows where to point to.

You can now use the OpenFaaS CLI and UI.

Open the UI at http://127.0.0.1:8080 and deploy a function from the *Function store* - a good example is "CertInfo" which can check when a TLS certificate will expire.

Downloading your chosen image may take a few seconds or minutes to deploy depending on your connection.

* Invoke the function then see its statistics and other information via the CLI:

```
$ faas-cli list -v
```

* Deploy figlet which can generate ASCII text messages, try it out.

```
$ faas-cli store deploy figlet
$ echo Hi! | faas-cli invoke figlet
```

You can use the `describe` verb for more information and to find your URL for use with `curl` or other tools and services.

```
$ faas-cli describe figlet
```

### Use the OpenFaaS CRD

You can also use the OpenFaaS Custom Resource Definition or CRD by typing in:

```
$ kubectl get functions -n openfaas-fn
```

When you create a new function for OpenFaaS you can use the CLI which calls the RESTful API of the OpenFaaS API Gateway, or generate a CRD YAML file instead.

* Here's an example with Node.js:

Change the `--prefix` do your own Docker Hub account or private Docker registry.

```
$ mkdir -p ~/dev/kind-blog/ && \
  cd ~/dev/kind-blog/ && \
  faas-cli template store pull node10-express && \
  faas-cli new --lang node10-express --prefix=alexellis2 openfaas-loves-crds
```

Our function looks like this:

```
$ cat openfaas-loves-crds/handler.js

"use strict"

module.exports = (event, context) => {
    let err;
    const result =             {
        status: "You said: " + JSON.stringify(event.body)
    };

    context
        .status(200)
        .succeed(result);
}
```

Now let's build and push the Docker image for our function

```
$ faas-cli up --skip-deploy -f openfaas-loves-crds.yml 
```

Followed by generating a CRD file to apply via `kubectl` instead of through the OpenFaaS CLI.

```
$ faas-cli generate crd  -f openfaas-loves-crds.yml 
---
apiVersion: openfaas.com/v1alpha2
kind: Function
metadata:
  name: openfaas-loves-crds
  namespace: openfaas-fn
spec:
  name: openfaas-loves-crds
  image: alexellis2/openfaas-loves-crds:latest
```

You can then pipe this output into a file to store in Git or pipe it directly to `kubectl` like this:

```
$ faas-cli generate crd  -f openfaas-loves-crds.yml | kubectl apply -f -
function.openfaas.com "openfaas-loves-crds" created

$ faas-cli list -v
Function                      	Image                                   	Invocations    	Replicas
openfaas-loves-crds           	alexellis2/openfaas-loves-crds:latest   	0              	1    
```

## Wrapping up

KinD is not the only way to deploy Kubernetes locally, or the only way to deploy OpenFaaS, but it's quick and easy and you could even create a bash script to do everything in one shot.

* If you'd like to keep learning then checkout the [official workshop](https://github.com/openfaas/workshop) which has been followed by hundreds of developers around the world already.

* Join Slack if you'd like to chat more or contribute to the project [Slack](https://docs.openfaas.com/community)

You can also [read the docs](https://docs.openfaas.com/community) to find out how to deploy to GKE, AKS, DigitalOcean Kubernetes, minikube, Docker Swarm and more.


For a chance to win OpenFaaS Swag tweet to [@openfaas](https://twitter.com/openfaas) with your KinD cluster.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Just wrapped up 6 bags of swag for awesome community members.. t-shirts, magnets, stickers, pins and written notes. It&#39;s great to be able to show appreciation. <a href="https://twitter.com/hashtag/oss?src=hash&amp;ref_src=twsrc%5Etfw">#oss</a> <a href="https://twitter.com/hashtag/community?src=hash&amp;ref_src=twsrc%5Etfw">#community</a> <a href="https://t.co/5qYn3MuYEp">pic.twitter.com/5qYn3MuYEp</a></p>&mdash; Alex Ellis (@alexellisuk) <a href="https://twitter.com/alexellisuk/status/1082020072154165248?ref_src=twsrc%5Etfw">January 6, 2019</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>