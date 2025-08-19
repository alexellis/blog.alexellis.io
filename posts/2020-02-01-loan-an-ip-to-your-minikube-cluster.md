---
title: "Loan a cloud IP to your minikube cluster"
slug: "loan-an-ip-to-your-minikube-cluster"
date: "2020-02-01T19:21:50Z"
author: "Alex Ellis"
meta_title: "Loan a cloud IP to your minikube cluster"
meta_description: "I'm going to show you you can loan a public cloud IP adress to your minikube cluster from your managed cloud Kubernetes cluster using AWS EKS and an ALB."
feature_image: "/content/images/2020/02/red-lights-crop.jpg"
tags:
  - "inlets-pro"
  - "inlets"
  - "kubernetes"
  - "minikube"
  - "eksctl"
---

I'm going to show you you can loan a public cloud IP adress to your minikube cluster from your managed cloud Kubernetes cluster.

After following this tutorial, you'll be able to run a local service on your laptop with [minikube](https://minikube.sigs.k8s.io/) and have it appear with a public IP through your Kubernetes cluster.

![k8s-to-k8s](/content/images/2020/02/k8s-to-k8s.png)

> Pictured: when a client connects to the public Cluster's IP, then they will be proxied to a local service running inside a minikube cluster.

This is most useful either as a freelancer when you want to share work with clients, or as part of a team or OSS community collaborating on code and services. You will also benefit from a quick dev/test loop without pushing code into a remote registry or cluster, something that's ideal when integrating with partners and services such as webhooks from Stripe, Strava, PayPal, GitHub, GitLab, you name it.

## Introducing inlets

<img src="https://raw.githubusercontent.com/inlets/media/master/assets/inlets-monochrome.png" style="max-width: 25%;">

For the tutorial we'll be using a popular Open Source networking tunnel and service proxy called [inlets](https://inlets.dev). Inlets is listed on [the CNCF landscape](https://landscape.cncf.io/category=service-proxy&format=card-mode&grouping=no&license=open-source&sort=stars).

<img src="https://camo.githubusercontent.com/2ca88a3765038f7fcad0a47f2d19f17a7c4ca254/68747470733a2f2f626c6f672e616c6578656c6c69732e696f2f636f6e74656e742f696d616765732f323031392f30392f696e6c657473696f2d2d322d2e706e67" width="800px">

> Conceptual architecture diagram showing a use-case for GitHub webhooks

The traditional usage of inlets is as a client/server pair, where the client runs behind a restrictive firewall or NAT configuration and the server runs somewhere with a public IP. Exit-servers can be automated for use with inlets through [inletsctl](https://github.com/inlets/inletsctl) or [inlets-operator](https://github.com/inlets/inlets-operator) for Kubernetes services. The service in the private network then appears on the outside world through the IP of the "exit-server".

## Setup a cloud Kubernetes cluster

This step is important, you must use a managed Kubernetes offering which can give you a LoadBalancer, such as an [ALB](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/introduction.html) or [ELB](https://aws.amazon.com/elasticloadbalancing/) in the AWS ecosystem.

I'm going to use [AWS EKS](https://aws.amazon.com/eks/) because the Open Source team offered some credits to use for writing tutorials like this. Recently the [cost of the EKS control plane was halved](https://aws.amazon.com/eks/faqs/), from $0.20 USD / hour, to $0.10 / hour which makes the overall cost cheaper too.

Get eksctl, which is a CLI created by [Weaveworks](https://weave.works/) to setup the managed Kubernetes cluster:

```sh
curl --silent --location "https://github.com/weaveworks/eksctl/releases/download/latest_release/eksctl_$(uname -s)_amd64.tar.gz" | tar xz -C /tmp

sudo mv /tmp/eksctl /usr/local/bin
```

Now install the AWS CLI and configure your `~/.aws/credentials` file or environment variables.

* [aws-cli configuration](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-envvars.html)

Now authenticate:

```sh
eksctl create cluster

# Or customise

eksctl create cluster \
    --nodes 1 \
    --node-type t3.large \
    --region eu-west-1
```

Once up and running you'll have a production-grade cluster from AWS which can issue LoadBalancers, this is how we'll be getting a public IP when required.

## Run minikube, KinD, or some other local Kubernetes cluster

I'm a big fan of the speed of k3s, k3d, and KinD for local Kubernetes development, but minikube is still very popular with the community. Let's use that.

* [Install minikube for your OS](https://minikube.sigs.k8s.io/docs/start/)

* You will need [a minikube VM driver](https://minikube.sigs.k8s.io/docs/reference/drivers/), too

Once done, you can create a local cluster:

```sh
minikube start
```

## Schedule a workload on your minikube cluster

We now need to schedule a workload on our local minikube cluster. This is the service which needs a public IP.

Let's use my Express.js + Node.js microservice

```sh
git clone https://github.com/alexellis/expressjs-k8s
cd expressjs-k8s

kubectl apply -f ./yaml/dep.yaml
```

Now we have a deployment running, but need to create a service for it.

```sh
kubectl apply -f ./yaml/svc.yaml
```

You should be able to access the service via `curl` and a `port-forward`:

```sh
kubectl port-forward deploy/expressjs 8080:8080 &

curl -s 127.0.0.1:8080/links | jq
[
  {
    "name": "github",
    "url": "https://github.com/alexellis"
  },
  {
    "name": "twitter",
    "url": "https://twitter.com/alexellisuk"
  },
  {
    "name": "blog",
    "url": "https://blog.alexellis.io"
  },
  {
    "name": "sponsors",
    "url": "https://github.com/users/alexellis/sponsorship"
  }
]
```

Note that our service exposes port 8080 and is named "expressjs".

## Start an inlets-server on the cloud cluster

Now let's start an inlets-server on the cloud cluster. Normally we'd simply use the inlets-operator for this stage, and it would automate everything for us. In this tutorial we're trying to use a cloud Kubernetes cluster as our exit-node, rather than a VM.

Set your Kubernetes context to point at the remote cloud cluster.

```sh
kubectl config get-contexts
kubectl config set-context <CONTEXT>
```

Generate a token to be used by the inlets client to authenticate to the inlets server.

```sh
export TOKEN=$(head -c 16 /dev/urandom | shasum | cut -d" " -f1)
kubectl create secret generic inlets-token --from-literal token=$TOKEN

echo The token is: $TOKEN

echo $TOKEN > inlets-token.txt
```

You need to record this token and use it again in the minikube cluster.

### Create the exit-server deployment and service

Now create a deployment for the inlets-server:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: inlets-server
spec:
  replicas: 1
  selector:
    matchLabels:
      app: inlets-server
  template:
    metadata:
      labels:
        app: inlets-server
    spec:
      containers:
      - name: inlets-server
        image: inlets/inlets:2.6.3
        imagePullPolicy: Always
        command: ["inlets"]
        args:
        - "server"
        - "--control-port=8123"
        - "--port=8080"
        - "--token-from=/var/inlets/token"
        volumeMounts:
          - name: inlets-token-volume
            mountPath: /var/inlets/
      volumes:
        - name: inlets-token-volume
          secret:
            secretName: inlets-token
```

You can use `kubectl apply -f -` and then paste the text above.

We now need a LoadBalancer service, to get a public IP:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: inlets-server
  labels:
    app: inlets-server
spec:
  type: LoadBalancer
  ports:
    - name: inlets-data
      port: 8080
      protocol: TCP
      targetPort: 8080
      nodePort: 30080
    - name: inlets-control
      port: 8123
      protocol: TCP
      targetPort: 8123
      nodePort: 30023
  selector:
    app: inlets-server
```

If you've ever tried to use a LoadBalancer with EKS before, you'll remember that you get a DNS entry, and not an actual IP. That's OK, don't worry.

You'll see two ports: 8080 and 8123, the data port can be whatever you like, so you could have used port 80 if you wanted.

For the control port I've picked 8123, so that the two don't clash, you can also customise this value if you like.

If you want to create a DNS record, you can use a "CNAME" and paste in the output from the kubectl command.

```sh
kubectl get svc/inlets -o wide
NAME     TYPE           CLUSTER-IP       EXTERNAL-IP                                                              PORT(S)
inlets   LoadBalancer   10.100.146.196   a25ab4229452511eaadd40a443f60541-488879946.eu-west-1.elb.amazonaws.com   8080:30080/TCP,8128:30081/TCP
```

Note the EXTERNAL_IP down now, which is actually a DNS entry.

When completed, our users will connect to the EXTERNAL_IP using port 8080 and the inlets-client will connect in via port 8128 to establish a persistent websocket.

You can see the logs and check on the server deployment:

```sh
kubectl get deploy/inlets-server

NAME            READY   UP-TO-DATE   AVAILABLE   AGE
inlets-server   1/1     1            1           46s

kubectl logs deploy/inlets-server

2020/02/01 18:59:16 Welcome to inlets.dev! Find out more at https://github.com/inlets/inlets
2020/02/01 18:59:16 Starting server - version 2.6.3
2020/02/01 18:59:16 Server token: "3de9710abadb56509eb8e634777bcbddad194331"
2020/02/01 18:59:16 Data Plane Listening on :8080
2020/02/01 18:59:16 Control Plane Listening on :8123
```

## Start an inlets-client inside minikube

Use `kubectl get-contexts` and `kubectl set-context` to make sure that kubectl is pointing at the minikube cluster.

If you want to check that you're in the correct cluster, at any time run: `kubectl cluster-info`

Create a secret for the inlets-client to use, this must use the value entered in the public cloud cluster:

```sh
kubectl create secret generic inlets-token --from-literal token=$(cat inlets-token.txt)
```

### Start the inlets-client

The inlets-client will connect to the inlets-server and establish a bi-directional websocket. For any requests that hit the inlets-server, they will be redirected top the inlets-client inside our local minikube cluster.

We just need to set three things:

* `--remote` - the remote cluster's LoadBalancer IP (a DNS-entry, for EKS users), use ws:// for plaintext and wss:// for TLS.
* `--token` - the authentication secret name (`inlets-token`) for the authentication between inlets
* `--upstream` - the upstream address that inlets needs to point at i.e. `http://expressjs.default:8080`

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: inlets-client
spec:
  replicas: 1
  selector:
    matchLabels:
      app: inlets-client
  template:
    metadata:
      labels:
        app: inlets-client
    spec:
      containers:
      - name: inlets-client
        image: inlets/inlets:2.6.3
        imagePullPolicy: Always
        command: ["inlets"]
        args:
        - "client"
        - "--remote=ws://a25ab4229452511eaadd40a443f60541-488879946.eu-west-1.elb.amazonaws.com:8123"
        - "--upstream=http://expressjs.default:8080"
        - "--token-from=/var/inlets/token"
        volumeMounts:
          - name: inlets-token-volume
            mountPath: /var/inlets/
      volumes:
        - name: inlets-token-volume
          secret:
            secretName: inlets-token
```

Edit the above text, then paste it into `kubectl apply -f -`, or use `kubectl apply -f filename.yaml`.

You can see the logs and check on the client deployment:

```
kubectl get deploy/inlets-client
NAME            READY   UP-TO-DATE   AVAILABLE   AGE
inlets-client   1/1     1            1           46s

kubectl logs deploy/inlets-client

2020/02/01 18:56:29 Welcome to inlets.dev! Find out more at https://github.com/inlets/inlets
2020/02/01 18:56:29 Starting client - version 2.6.3
2020/02/01 18:56:29 Upstream:  => http://expressjs.default:8080
2020/02/01 18:56:29 Token: "3de9710abadb56509eb8e634777bcbddad194331"
time="2020-02-01T18:56:29Z" level=info msg="Connecting to proxy" url="ws://a25ab4229452511eaadd40a443f60541-488879946.eu-west-1.elb.amazonaws.com:8123/tunnel"
```

### Connect to your new service via the cloud cluster

You can now connect to the expressjs service via the cloud IP.

```
curl -s -i http://a25ab4229452511eaadd40a443f60541-488879946.eu-west-1.elb.amazonaws.com:8080/links
```

You can also create a [Route53 DNS](https://aws.amazon.com/route53/) record for the LoadBalancer, for instance expressjs.example.com.

![e2e](/content/images/2020/02/e2e.png)

You can see the curl working with the public URL

![lab1](/content/images/2020/02/lab1.png)

Here's the website rendered with Copyright 2019.

Let's use `kubectl` against our local cluster to change to a newer Docker image that presents Copyright 2020 instead and refresh the page:

Remember to use your minikube context for this:

```sh
kubectl get deploy -o wide
NAME            READY   UP-TO-DATE   AVAILABLE   AGE     CONTAINERS      IMAGES                     SELECTOR
expressjs       1/1     1            1           39m     expressjs       alexellis2/service:0.3.5   app=expressjs
```

I pushed a new version of the image tag as `0.3.6`, so let's update it:

```sh
kubectl set image deployment/expressjs expressjs=alexellis2/service:0.3.6
deployment.apps/expressjs image updated
```

Now check back on the public URL via our EKS cluster:

![after-2](/content/images/2020/02/after-2.png)

### Take it further

* Count the cost

    The OSS version of inlets is free for you to use, so the only cost you'll have to bear is for your cloud Kubernetes cluster, any LoadBalancers that you create and for bandwidth that you use. It goes without saying that you should setup your cloud cluster in a region that has low latency to where you're connecting from.

* Pause and resume

    If you stop minikube, you can leave the inlets-server running with its ALB, the inlets-client deployment will reconnect automatically once you start up minikube again.

* Proxy multiple services or ports

    The OSS version of inlets can use a single LB and IP to proxy to multiple different upstream services using the `--upstream` parameter repeated. To use multiple upstreams, you'll need a DNS entry for each one i.e. `--upstream=http://prometheus.example.com=prometheus:9090` followed by `--upstream=http://tekton.example.com=tekton-webhook-receiver:8080`
    
    inlets-pro supports pure TCP proxying, so you could use it to get a public IP for an IngressController such as [Traefik](https://docs.traefik.io/), [Nginx-Ingress]()https://github.com/kubernetes/ingress-nginx, or [Caddy](https://caddyserver.com/). inlets-pro also supports mapping more than one port from the external host to your internal cluster, i.e. 80 and 443. You'll be able to obtain a TLS certificate from LetsEncrypt with a DNS01 or HTTP01 challenge and serve it directly from your local cluster.

* Easy encryption with inlets-pro

    If you'd like to enable encryption out of the box, you can use inlets-pro instead, which also comes with a Docker image ready for you. Follow one of [my inlets-pro tutorials](https://github.com/inlets/inlets-pro/tree/master/docs).

* Setup an Ingress record and TLS certificate

    Rather than creating a LoadBalancer for each service we want to expose, you could use your favourite [IngressController](https://kubernetes.io/docs/concepts/services-networking/ingress-controllers/) and create a simple ingress record that points at the inlets-service. Just change it to a ClusterIP.

* Take it easy on yourself and use the inlets-operator

    The inlets-operator makes all this automated, and provisions a cheap VM for each tunnel. Life is too short, enjoy it while you can with our custom-built automation. Support exists for [Packet](https://packet.com/), [DigitalOcean](https://digitalocean.com/), [Scaleway](https://scaleway.com/), [AWS](https://aws.amazon.com/) and more. Feel free to raise a PR or suggestion if your cloud provider is missing and you'd like to request it.

### Tidy up your public Kubernetes cluster

The inlets-operator is a much cheaper way to run an exit-node than using a managed Kubernetes cluster, but if your corporate already has an account, or you get free credits, then the approach we used here could be a better option for you.

You should be able to clean up all the resources with:

```sh
# In the public cloud cluster
kubectl delete svc/inlets-server
kubectl deploy svc/inlets-server

# In the local cluster
kubectl delete svc/inlets-client
kubectl deploy svc/inlets-client

# Delete the clusters if you wish
eksctl delete cluster
minikube delete
```

## Learn inlets

![tools](/content/images/2020/02/tools.png)

> inlets on the CNCF landscape

inlets is a rich tool with its own automation, tutorials, podcasts, videos, and community.

* Get help adopting inlets from the OpenFaaS Slack in the `#inlets` channel - [Slack](https://slack.openfaas.io/)

* Apply for a free trial for [inlets-pro](https://github.com/inlets/inlets-pro)

* Try the [inlets-operator instead](https://github.com/inlets/inlets-operator)

If you'd like to explore commercial use of inlets-pro, feel free to send an email to [sales@openfaas.com](mailto:sales@openfaas.com)

For comments and suggestions, you can follow [@inletsdev on Twitter](https://twitter.com/inletsdev/)