---
title: "How I test OpenFaaS changes with Kubernetes"
slug: "how-i-test-openfaas-with-kubernetes"
date: "2021-03-16T09:53:04Z"
author: "Alex Ellis"
meta_title: "How I test OpenFaaS changes with Kubernetes"
meta_description: "Learn what makes up the OpenFaaS core services, and how to create and test your own patches when you want to contribute."
tags:
  - "openfaas"
  - "golang"
  - "kubernetes"
  - "kind"
---

There are several ways to test changes in [OpenFaaS](https://openfaas.com/) with [Kubernetes](https://kubernetes.io/). I wanted to outline an approach that I find useful, so that new and potential contributors can get started quickly and experiment. I'll also give you a very brief overview of what OpenFaaS is, and what gets deployed when you install it.

If you work with Kubernetes controllers or open-source projects that are written in Go, feel free to read on and send comments, questions and suggestions my way [on Twitter](https://twitter.com/alexellisuk/status/1371763471650598913?s=20).

## First of all, what is OpenFaaS?

OpenFaaS is an open-source project which I started in 2016 so that I could run serverless functions on my own infrastructure using containers. Since then, it's become much more. It has a much larger community of users and contributors than I could have ever imagined.

> Despite the misconceptions, this project is not backed by Venture Capitalists (VCs), or an external company. So the community relies upon volunteers (including myself) to do the heavy lifting.

![How it started](/content/images/2021/03/EwJYydzXIAUktgL.jpeg)

> OpenFaaS has over 26k GitHub stars across 40 repositories and ~ 350 contributors.

When you add OpenFaaS to Kubernetes, you get a number of components installed to your cluster, each performing a different task. There are components which we have built, and some that come from the [CNCF](https://cncf.io). To date, every OpenFaaS component is written in [Go](https://golang.org/).

![Conceptual architecture](https://github.com/openfaas/faas/blob/master/docs/of-workflow.png?raw=true)
> Pictured: Conceptual architecture

These core components can be found in the [openfaas organisation](https://github.com/openfaas/):

* The [gateway](https://github.com/openfaas/faas/tree/master/gateway) - UI and REST API, which uses Prometheus for auto-scaling
* The [basic-auth plugin](https://github.com/openfaas/faas/tree/master/auth), or [commercial SSO plugin](https://openfaas.com/support)
* The [queue-worker](https://github.com/openfaas/nats-queue-worker) which dequeues asynchronous requests from NATS and executes them

Then, the following CNCF projects are installed as dependencies:

* [Prometheus](https://prometheus.io/) is used to monitor Rate, Error and Duration (RED) metrics for each function and for the core services.
* [AlertManager](https://prometheus.io/docs/alerting/latest/alertmanager/) is used to monitor functions for high rates of invocation, and then triggers auto-scaling. When any alert is resolved, the function will scale back to its original minimum replica count.
* [NATS](https://nats.io/) provides a way to execute tasks in the background through a queue.

From there, they are configured through environment variables for any non-confidential configuration data, for things such as:

* Timeouts
* Concurrency levels
* How many times to retry something
* A feature flag
* Log verbosity

Secrets are used to inject confidential data like API keys, the main example is the authentication token used to authenticate to the gateway.

These configuration items can be altered through the helm chart, or through the [arkade](https://get-arkade.dev) Kubernetes marketplace, which abstracts away the mechanics of the chart, to make it look like a one-line installation.

The functions that OpenFaaS can deploy to Kubernetes are not magic, they are actually very similar to these services known as "core services" or the "openfaas stack"

## How do I deploy OpenFaaS?

The way I deploy OpenFaaS tends to be using `kind` - Kubernetes in Docker. [KinD](https://kind.sigs.k8s.io/) is a community project led by [Ben Elder, at Google](https://twitter.com/BenTheElder).

There are dozens of ways to run Kubernetes, you can run it on your local computer, or on the cloud. Running locally tends to be the cheapest option, and using a local Kubernetes distribution that runs inside a Docker container means that the same instructions work for Linux, MacOS and Windows users.

Meet arkade. arkade is an open-source Kubernetes marketplace - it offers apps and also offers CLIs - around 60 combined.

```bash
# Note: you can also run without `sudo` and move the binary yourself
curl -sLS https://dl.get-arkade.dev | sudo sh

# Windows users with Git Bash
curl -sLS https://dl.get-arkade.dev | sh
```

Download kind with arkade:

```bash
arkade get kind
```

Make sure that you have Docker installed, then create a cluster:

```bash
kind create cluster
```

The context for `kubectl` will be set to the new kind cluster. It can support multiple, but I tend to create/delete when needed rather than managing more than one local kind cluster.

Next install OpenFaaS using its helm chart, and all the defaults:

```bash
arkade install openfaas
```

The arkade app has a number of flags that you can use, which translate to helm chart options.

* `--gateways 2` converts to `--set gateway.replicas=2`
* `--load-balancer` generates `--set serviceType=LoadBalancer`

See what options are available in the [helm chart README](https://github.com/openfaas/faas-netes/tree/master/chart/openfaas)

From there, the app will tell you how to port-forward the gateway and UI to your local computer. If you want to see this information again at any time, then run `arkade info openfaas`.

The easiest way to access OpenFaaS will through the CLI, where you can discover sample functions and deploy something.

```bash
faas-cli store list | grep nodeinfo
faas-cli store describe nodeinfo
faas-cli store deploy nodeinfo
```

You'll get a URL that's accesible on your gateway via `http://127.0.0.1` and you can invoke it via `curl`.

## Making the first patch

In this example, we'll make a patch to the Kubernetes controller for OpenFaaS. If you just need to test a patch for the helm chart, you can see instructions in [the chart README](https://github.com/openfaas/faas-netes/tree/master/chart/openfaas).

### Fork and branch

Fork the repository you want to change such as [faas-netes](https://github.com/openfaas/faas-netes).

Clone your fork of the project, into the GOPATH

```bash
mkdir -p $GOPATH/src/github.com/openfaas/
cd $GOPATH/src/github.com/openfaas/
git clone https://github.com/openfaas/faas-netes
cd faas-netes
```

If you want to avoid pulling in all the history, add `--depth=1` to the `git clone` statement.

Now create a branch to start working in. We'll make the Kubernetes operator print the text "Hello World" upon start-up.

```bash
git checkout -b alexellis/print-hello
```

Now, edit `main.go` and add to `func main() {`

```go
log.Println("Hello world")
```

> Would you like to improve your Go skills? Checkout my new book [Everday Go](https://gumroad.com/l/everyday-golang) for practical tips and hands-on examples.

### Test out the new version

We will build a new container image, push it to a registry, then install openfaas again using its helm chart, and the new image reference. Some components need to be developed this way, due to the way they reference internal components, or are bundled as part of a Pod.

This workflow may not be the most optimized, but it's good enough for me. 

Check the Makefile to see if it has a target like `make local` or `make docker` that you can use, if not, just go ahead and build your own image:

```bash
export USERNAME="alexellis"
docker build -t $USERNAME/faas-netes:print-hello .
docker push $USERNAME/faas-netes:print-hello
```

Then you can deploy the new version to the cluster using `arkade install` again:

```bash
export USERNAME="alexellis"

arkade install openfaas \
  --set faasnetes.image=$USERNAME/faas-netes:print-hello
```

If you are working on the gateway, then you should stop the port-forwarding and run the command again, since the pod will be updated.

Now check the logs for the component you updated. In this instance, the Kubernetes controller is bundled in the same Pod as the gateway, so you need to pick the specific container:

```bash
kubectl logs -n openfaas deploy/gateway \
  -c faas-netes
```

At the time of writing, the OpenFaaS Kubernetes controller can run in two modes: as a controller or [CRD operator](https://github.com/openfaas/faas-netes/blob/master/README-OPERATOR.md).

The CRD operator allows for someone to use `kubectl apply` to create functions, instead of using `faas-cli`. For instance:

```yaml
# nodeinfo.yaml
apiVersion: openfaas.com/v1
kind: Function
metadata:
  name: nodeinfo
  namespace: openfaas-fn
spec:
  name: nodeinfo
  image: ghcr.io/openfaas/nodeinfo:75d61698aaaa14345c7983f5a5db91f6da80e5bb
```

This may change in the future, but for now, there are often two codepaths that you need to update. An example would be adding custom runtime support for gVisor and kata containers. We had to edit the HTTP handlers for the Controller, then for the Operator afterwards.

To change the image for the CRD operator add:

```bash
export USERNAME="alexellis"

# Add the operator.create flag:
arkade install openfaas \
  --set operator.image=$USERNAME/faas-netes:print-hello \
  --set operator.create=true
  
# Check its logs:
kubectl logs -n openfaas deploy/gateway \
  -c operator
```

How do you rinse and repeat this?

After each change, build a new image tag such as `alexellis/faas-netes:print-hello1`, push it, and run the `arkade install` command.

When you are done, you can run `kind delete cluster` or leave the cluster running for further testing.

### Send a Pull Request

Providing that you have raised and Issue, and someone from the team has approved your change, you should send a Pull Request (PR). It's important that we fill out the whole PR template to avoid causing unnecessary work for everyone involved.

Part of the PR template asks: "How has this been tested?". You will be surprised how many people leave this field out. Copy and paste the arkade command you used, along with the output you got.

Why? So that the person verifying your patch can do so quickly. You may also want to share the container image so that someone else could test out your code without having to do a local build of their own.

## Wrapping up

We took a look at the OpenFaaS core components, and what gets deployed when you install the project to your cluster. We covered the `kind` tool for a local Kubernetes cluster and `arkade` to install OpenFaaS without having to think deeply about helm. Using `docker`, we build and pushed a test version of our code and verified that it worked.

This approach can be used for most of the components in the project: fork, clone, edit, docker build, docker push, arkade install with a `--set` flag, then send a PR.

The techique of building, pushing and deploying a container to a cluster should work all the time, but sometimes you can build and run a controller on your own computer, and make the feedback loop even faster.

I use both techniques for other projects that target Kubernetes like the [inlets-operator](https://github.com/inlets/inlets-operator). It can add cloud-style LoadBalancers to KinD and private clusters by creating VMs in a cloud provider and starting a tunnel server there. Whenever we add a new cloud like Azure or AWS EC2, it can be easier to test the controller on my own computer, and have it point at the cluster, instead of running inside the cluster.

### Get involved

Do you want to help, but cant't contribute code or time? Check out the options for becoming a [GitHub Sponsor](https://github.com/sponsors/openfaas)

Here are some further links for learning and contributing:

* Browse the [openfaas](https://github.com/openfaas) repositories
* Join [OpenFaaS Slack](https://slack.openfaas.io/) to meet the community, and help us develop the project

> Would you like to improve your Go skills? Checkout my new book [Everday Go](https://gumroad.com/l/everyday-golang) for practical tips and hands-on examples.

### Is there an alternative to OpenFaaS on Kubernetes?

If are left wondering whether there's an easier alternative to OpenFaaS, that doesn't require any Kubernetes knowledge, then you may be in luck. Check out the [faasd project](https://github.com/openfaas/faasd), which uses the same components, on a single VM or host.