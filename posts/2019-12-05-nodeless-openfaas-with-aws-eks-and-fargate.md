---
title: "Nodeless OpenFaaS with AWS EKS and Fargate"
slug: "nodeless-openfaas-with-aws-eks-and-fargate"
date: "2019-12-05T13:34:21Z"
author: "Alex Ellis"
meta_title: "Nodeless OpenFaaS with AWS EKS and Fargate"
meta_description: "Learn how to apply AWS EKS, Fargate and OpenFaaS for the most serverless experience ever seen on Kubernetes. We'll need eksctl, k3sup and your AWS account."
tags:
  - "eksctl"
  - "eks"
  - "aws"
  - "weaveworks"
  - "kubernetes"
---

Up until recently, running [OpenFaaS](https://www.openfaas.com) has meant either your platform engineering team running a Kubernetes cluster, or making use of our managed offering [OpenFaaS Cloud](https://docs.openfaas.com/openfaas-cloud/user-guide/). Today I'll show you how to deploy to a "nodeless" architecture.

<img src="/content/images/2019/12/logos.png" width="350px">

With the release of [AWS Fargate as a target for AWS EKS](https://aws.amazon.com/blogs/aws/amazon-eks-on-aws-fargate-now-generally-available/) (managed Kubernetes), you can now deploy applications to a cluster which effectively has no nodes to manage. I'll walk you through what you need to do, to try OpenFaaS out on this platform and then summarise the experience and how it stacks up to other options like spot instances.

## Pre-reqs

* eksctl from [Weaveworks](https://weave.works/)

The team at Weaveworks built `eksctl` for creating and managing the lifecyle of EKS clusters, it's been get.so popular at AWS adopted it as their official CLI.

[Download eksctl](https://github.com/weaveworks/eksctl) and configure it as per the documentation.

* An AWS account

Check the regions available for creating your EKS cluster, not all of them are availabl at launch. [Launch page](https://aws.amazon.com/blogs/aws/amazon-eks-on-aws-fargate-now-generally-available/)

* arkade

We'll use [arkade](https://get-arkade.dev) to get OpenFaaS, it's a new Golang tool that acts as a user-friendly wrapper for helm.

```sh
# You can also run this command without sudo and move the
# resulting binary to /usr/local/bin/ yourself
curl -SLfs https://dl.get-arkade.dev | sudo sh
```

* [faas-cli](https://github.com/openfaas/faas-cli/)

Get the OpenFaaS CLI:

```sh
# You can also run this command without sudo and move the
# resulting binary to /usr/local/bin/ yourself
curl -SLfs https://cli.openfaas.com | sudo sh
```

## Tutorial

After installing the pre-reqs, continue with the tutorial. We'll create an EKS cluster with a fargate profile, configure the OpenFaaS namespaces, and then deploy a function and invoke it.

Afterwards you'll get a chance to clean the resources up if you want to, or follow the links for setting up TLS and a domain-name for your OpenFaaS cluster.

### Create your EKS cluster:

```sh
eksctl create cluster --fargate \
  --name openfaas-fargate \
  --region us-east-2
```

Note that this could take some time, expect it to be around 10-15 mins +/-.

### Create a fargate profile for openfaas

The [openfaas helm chart](https://github.com/openfaas/faas-netes/tree/master/chart/openfaas) installs components into two different namespaces to enable isolation between your services and the control-plane.

This is not well documented, and I would have expected eksctl to have enabled fargate for all of my namespaces, but it doesn't. Only `kube-system` and `default` are configured out of the box.

```sh
eksctl create fargateprofile --region us-east-2 --cluster openfaas-fargate --namespace openfaas

eksctl create fargateprofile --region us-east-2 --cluster openfaas-fargate --
namespace openfaas-fn
```

### Install OpenFaaS

Use `arkade install` to configure OpenFaaS with a cloud LoadBalancer, in this instance an "ALB" will be created.

> Some users prefer to use Host Ports in combination with an IngressController to avoid paying for an ALB. In this configuration port 80 and 443 are exposed on every node's IP. Unfortunately this use-case is not supported by Fargate. This limitation and others are [covered under the product announcement](https://aws.amazon.com/blogs/aws/amazon-eks-on-aws-fargate-now-generally-available/)

```sh
arkade install openfaas --load-balancer

=======================================================================
= OpenFaaS has been installed.                                        =
=======================================================================

# Get the faas-cli
curl -SLsf https://cli.openfaas.com | sudo sh

# Forward the gateway to your machine
kubectl rollout status -n openfaas deploy/gateway
kubectl port-forward -n openfaas svc/gateway 8080:8080 &

# If basic auth is enabled, you can now log into your gateway:
PASSWORD=$(kubectl get secret -n openfaas basic-auth -o jsonpath="{.data.basic-auth-password}" | base64 --decode; echo)
echo -n $PASSWORD | faas-cli login --username admin --password-stdin

faas-cli store deploy figlet
faas-cli list

# For Raspberry Pi
faas-cli store list \
 --platform armhf

faas-cli store deploy figlet \
 --platform armhf

# Find out more at:
# https://github.com/openfaas/faas

Thanks for using arkade!
```

### Log into OpenFaaS

Note that it takes considerably longer for a Fargate container to start than a Pod on a normal EC2 node.

If you're impatient, then watch the events in a new terminal window, you'll see the Pod events and Fargate containers being registered as if they were Kubernetes Nodes:

```
kubectl get event -A -w

default       0s          Normal    RegisteredNode            node/fargate-ip-192-168-152-0.us-east-2.compute.internal     Node fargate-ip-192-168-152-0.us-east-2.compute.internal event: Registered Node fargate-ip-192-168-152-0.us-east-2.compute.internal in Controller
```

Then run the following:

```sh
kubectl rollout status -n openfaas deploy/gateway
kubectl port-forward -n openfaas svc/gateway 8080:8080 &

# If basic auth is enabled, you can now log into your gateway:
PASSWORD=$(kubectl get secret -n openfaas basic-auth -o jsonpath="{.data.basic-auth-password}" | base64 --decode; echo)
echo -n $PASSWORD | faas-cli login --username admin --password-stdin
```

### Deploy a sample function

We can deploy Yahoo's machine-learning model for checking if images are nudes, or safe for use at work.

```sh
faas-cli store list

faas-cli store deploy "Open NSFW Model"

# Check for the Pod to become available ("Status: Ready")

faas-cli describe openfaas-opennsfw
```

### Invoke the function

For a tasteful image that will trigger the model, use an ancient Roman/Greek statue, or an artwork. I'm using [David by Michelangelo, available on Wikipedia](https://en.wikipedia.org/wiki/David_(Michelangelo))

```
export IMG="https://upload.wikimedia.org/wikipedia/commons/a/a0/%27David%27_by_Michelangelo_Fir_JBU002.jpg"

echo $IMG | faas-cli invoke openfaas-opennsfw

{"sfw_score": 0.29027253389358521, "nsfw_score": 0.70972746610641479}
```

The result is returned in JSON, we can see that this image was detected as 70% not safe for use at work.

### Get your public endpoint

Now obtain your public endpoint for the OpenFaaS gateway, look for the `EXTERNAL-IP`:

```sh
kubectl get svc -n openfaas

NAME                TYPE           CLUSTER-IP       EXTERNAL-IP                                                               PORT(S)          AGE
gateway-external    LoadBalancer   10.100.71.191    aee6c6255176111ea9ec90a45ec9e4c9-2078812308.us-east-2.elb.amazonaws.com   8080:31079/TCP   10m
```

This corresponds to the LoadBalancer created by the helm chart, the EKS control-plane observes this and creates an [ALB](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/introduction.html) in response. You can use it with `faas-cli login` and for accessing the web UI.

If you want to use the environment for more than development, then you can install an IngressController and configure TLS with this tutorial: [Get TLS for OpenFaaS the easy way with arkade](https://blog.alexellis.io/tls-the-easy-way-with-openfaas-and-k3sup/).

### Tear it down

You can now tear down everything using `eksctl`:

```sh
eksctl delete cluster --name openfaas-fargate --region us-east-2
```

## Wrapping up

We were able to deploy OpenFaaS and its functions to Fargate containers instead of adding nodes. We also got to take advantage of Amazon's managed Kubernetes service (EKS). Note that at time of writing, each cluster will cost you 0.20 USD / hour or (150USD / mo).

With Fargate for EKS, you can decide whether to use only Fargate containers, only EC2 nodes, or a mixture of the two through profiles. You should note that each Fargate container is billed separately, and could work out more expensive than using EC2 instances and packing them densely.

Fargate for EKS is convenient, but I'd like to see some projections on cost, particularly if bursty workloads are taken into account. Alternatives like [Spotinst](https://spotinst.com/) provide a good balance between cheap EC2 instances and treating nodes as emphemeral entities.

### Hire me for Cloud Native / Docker / Go / CI & CD or Kubernetes

Could you use some help with a difficult problem, an external view on a new idea or project? Perhaps you would like to build a technology proof of concept before investing more? Get in touch via [sales@openfaas.com](mailto:sales@openfaas.com) or book a session with me on [calendly.com/alexellis](https://calendly.com/alexellis/).

### You may also like

* [Deploy OpenFaaS on Amazon EKS](https://aws.amazon.com/blogs/opensource/deploy-openfaas-aws-eks/)
* [Get TLS for OpenFaaS the easy way with arkade](https://blog.alexellis.io/tls-the-easy-way-with-openfaas-and-k3sup/)
* [Getting started with The PLONK Stack for Cloud Native developers](https://blog.alexellis.io/getting-started-with-the-plonk-stack-and-serverless/)