---
title: "Get kubectl access to your private cluster from anywhere"
slug: "get-private-kubectl-access-anywhere"
date: "2020-01-17T14:59:33Z"
author: "Alex Ellis"
meta_title: "Get kubectl access to your private cluster from anywhere"
meta_description: "Get kubectl access to your private on the Internet, so that you can manage your cluster from anywhere in the world, just like you would with the cloud."
feature_image: "/content/images/2020/01/desert-walking-2589010.jpg"
tags:
  - "inlets"
  - "vpn"
  - "tunnels"
  - "k8s"
  - "k3sup"
  - "inlets-pro"
  - "kubernetes"
  - "Raspberry PI"
---

This tutorial shows you how to punch out your private [Kubernetes API server](https://kubernetes.io/docs/concepts/overview/components/) to the Internet, so that you can manage your cluster from anywhere, just like you would with a cloud offering. You can also use it to punch out from one VPC to another, if the hosting VPC doesn't allow inbound connections.

So whether you're running on-premises, with minikube, Docker Desktop, K3d, K3s, Microk8s, or even on a Raspberry Pi, read on to see how it all works. At the end, you'll be able to access your cluster remotely, from anywhere on the Internet.

These steps have been tested with [kubeadm](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/install-kubeadm/), [K3s](https://k3s.io/), [K3d](https://k3d.io) and OpenShift.

You'll need:

* A host with Kubernetes running - installed via `kubeadm` or `k3s`, this will be on your private network
* An access key / API token for public cloud, where a host will be provisioned
* A laptop that will connect to your Kubernetes cluster over the public IP
* A personal license, business license or a free 14-day trial for [inlets PRO](https://inlets.dev)

On the private host behind a firewall/NAT where Kubernetes is running, you'll see two things:

* TCP traffic served on port `6443`
* A KUBECONFIG file at `$HOME/.kube/config`

Let's get started with the guide. We'll start by creating an exit-node which will run the `inlets-pro server`. Our laptop will connect to this address to access our private cluster.

## Get the inlets client binary

On the Kubernetes host install `inlets-pro` and `inletsctl`, make sure that you run this command, even if you already have the tools. It will ensure you have the latest fixes and changes.

```sh
curl -sLSf https://inletsctl.inlets.dev | sudo sh

sudo inletsctl download
```

Now provision an exit node to a cloud provider such as DigitalOcean.

* `--upstream` - find the IP of your primary Ethernet adapter, for a home network this may be something like `192.168.0.10`
* `--access-token-file` - get this from your cloud provider's dashboard
* `--provider` - run `inletsctl create --help` for a list

```sh
inletsctl create \
  --access-token-file ~/Downloads/do-access-token \
  --provider digitalocean \
  --region lon1
```

You'll see output like this when your tunnel server is provisioned. Don't run this command yet, but take a note of the token and `--url`.

```sh
inlets-pro exit-node summary:
  IP: 159.65.82.66
  Auth-token: fKuyjI4QY12zDyU6Kjwyox6sPgIf65wY1eVGTGDVK9nRWsRbBBI1pACNMRTLnJKk
  
  export PORTS="8000"
  export UPSTREAM="192.168.0.10"
  export TOKEN="fKuyjI4QY12zDyU6Kjwyox6sPgIf65wY1eVGTGDVK9nRWsRbBBI1pACNMRTLnJKk"

  inlets-pro tcp client \
    --url "wss://159.65.82.66:8123/connect" \
	--token "$TOKEN" \
	--ports $PORTS \
    --UPSTREAM $UPSTREAM

To Delete:
	  inletsctl delete --provider digitalocean --id "175227193"
```

The inletsctl project automates all of the above, and sets up a systemd unit file for your `inlets-pro tcp server` process. You can provision tunnel servres on to other clouds, just run `inletsctl create --help` to see a list of what's available.

> Alternatively, you can simply create your own server or VPS, and download the `inlets-pro` binary there instead.

## Connect your tunnel client

Now edit the parameters:

* Set `export PORTS=6443"` - the port of the apiserver in Kubernetes
* The `--upstream` variable can be set to the IP address of your computer, or you can try using `localhost`

Now run the command:

```sh
export PORTS="6443"
export TOKEN=""
export UPSTREAM="localhost"

inlets-pro tcp client \
  --url "wss://142.93.41.125:8123/connect" \
  --token "$TOKEN" \
  --ports $TCP_PORTS \
  --upstream $UPSTREAM
```

The tunnel is now established and you can use `curl` to test it.

```bash
curl -k https://142.93.41.125:6443
{
  "kind": "Status",
  "apiVersion": "v1",
  "metadata": {
    
  },
  "status": "Failure",
  "message": "forbidden: User \"system:anonymous\" cannot get path \"/\"",
  "reason": "Forbidden",
  "details": {
    
  },
  "code": 403
}
```

You'll see an error saying access denied, that's fine. It just shows that we need to get a valid kubeconfig file.

## Get the KUBECONFIG file

Copy the `~/.kube/config` file from your Kubernetes host to your laptop.

Now edit and replace its IP address with the IP of the public node.

```sh
scp 192.168.0.10:~/.kube/config config

sed -ie s/192.168.0.10/142.93.41.125/g config
```

If you're using [k3sup](https://k3sup.dev/), you can get the config with `k3sup install --skip-install --ip $IP --user $USER`, which simply reads back a remote KUBECONFIG from K3s using SSH.

## Access your cluster remotely

Now that you hvae a tunnel established between your client and the exit-server you provisioned, you can access your tunnel remotely.

```sh
export KUBECONFIG=`pwd`/config

kubectl get pods -A
```

You may see an error about the public IP not matching the TLS certificate, there are two ways you can resolve this.

The first approach involves disabling TLS verification, and is only suitable for testing, not for production use, since you will want TLS verification to avoid man-in-the-middle (MITM) attacks. The third approach is more advanced, and requires some additional setup.

Once you've picked an option, why don't you test that you can access your cluster by re-connecting from a coffee shop, a different WiFi network, or your mobile hotspot?

### Option A) Disable TLS verification for testing only

1) Use the `--insecure-skip-tls-verify` flag with kubectl
	```
	kubectl get pods -A --insecure-skip-tls-verify
	```

2) Add `insecure-skip-tls-verify` to your KUBECONFIG file

    You can edit the kubeconfig file and add insecure-skip-tls-verify to the cluster's entry, for example:
    
    ```yaml
    - cluster:
      name: my-cluster
        insecure-skip-tls-verify: true
        server: https://142.93.41.125:6443
   ```

### Option B) Add a TLS SAN address to Kubernetes

![Direct access with an additional TLS SAN](/content/images/2021/08/inlets-direct.png)

1) If you're using `k3s` instead of `kubeadm`, you can edit the TLS SAN value in the k3s system unit file and restart k3s, see `systemctl cat k3s`
	```
	ExecStart=/usr/local/bin/k3s \
	server \
        '--tls-san' \
        '142.93.41.125' \
	```
	
	Now you'll no-longer need to use `--insecure-skip-tls-verify`

2) Run `kubeadm init` again and supply the public IP via `--apiserver-cert-extra-sans`

	See `kubeadm init --help` for more information.

3) Update your `kubeadm` config without reinstalling - advanced [Adding a Name to the Kubernetes API Server Certificate](https://blog.scottlowe.org/2019/07/30/adding-a-name-to-kubernetes-api-server-certificate/)

### Option C) Use the inlets-connect proxy instead

![inlets-connect proxy without changing the TLS SAN](/content/images/2021/08/inlets-connect.png)

The [inlets-connect proxy](https://github.com/alexellis/inlets-connect) is a single-purpose HTTP proxy that can be used instead of turning off TLS verification or updating the Kubernetes API Server's TLS SAN names.

You can prefix `kubectl` commands with `HTTP_PROXY=http://127.0.0.1:3128`, set up an environment variable, or edit your KUBECONFIG file for convenience:

```yaml
    - cluster:
      name: my-cluster
        insecure-skip-tls-verify: false
        server: https://kubernetes.svc.443
        proxy-url: http://127.0.0.1:3128
```

Note that the `server` has been changed to `https://kubernetes.svc.443` which is the default address of the Kubernetes API server within Kubernetes.

How does this configuration work?

1) Run the inlets-connect proxy inside the private cluster
2) Run an inlets-pro tcp server with client forwarding enabled
3) Run an inlets-pro tcp client in the private cluster to make the proxy available on the server, but only on loopback, to prevent anyone accessing it publicly
4) Run an inlets-pro tcp client with local fowarding on your laptop, which will give you access to the inlets-connect proxy server
5) Set the `HTTP_PROXY` to `http://127.0.0.1:3128` and then use kubectl as required

### Appendix

For k3d run:

```sh
k3d cluster create --api-port 0.0.0.0:6443
```

Get the config via:

```sh
k3d kubeconfig get --all > kubeconfig
```

Replace `0.0.0.0` with the public IP of the exit-server.

## Wrapping up

In much the same way as AWS or GKE provide a public endpoint for your Kubernetes API Server, we've been able to achieve the same using inlets-pro for your Kubernetes cluster running on your private network.

Who's using this in production? Several customers are using inlets to proxy API servers to give technical support and to run managed services for clients. Read a case-study: [How Riskfuel is using Inlets to build machine learning models at scale](https://inlets.dev/blog/2021/07/22/riskfuel.html)

There's also a LoadBalancer integration that inlets-pro offers for Kubernetes users, so that you can get ingress for TCP and HTTP services. See the [inlets-operator](https://github.com/inlets/inlets-operator) for more.

### Would you like to know more?

* Follow [@inletsdev on Twitter](https://twitter.com/inletsdev/)
* Join the community - we use the `#inlets` channel on [OpenFaaS Slack](https://slack.openfaas.io/).
* Follow the latest blog posts on the [inlets website](https://inlets.dev/)