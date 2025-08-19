---
title: "Setup OpenFaaS Cloud for local development"
slug: "openfaas-cloud-for-development"
date: "2019-10-17T20:43:48Z"
author: "Alex Ellis"
meta_title: "Setup OpenFaaS Cloud for local development"
meta_description: "You can deploy OpenFaaS Cloud for development in a relatively short period of time by turning OAuth and TLS off and using the inlets-operator."
feature_image: "/content/images/2019/10/yannis-papanastasopoulos-U6dnImauDAE-unsplash.jpg"
tags:
  - "openfaas-cloud"
  - "openfaas"
  - "inlets"
  - "kubernetes"
---

OpenFaaS Cloud is a complete and portable platform which can be deployed to Kubernetes. It offers built-in CI/CD (GitOps), auto-scaling compute, and free TLS. OpenFaaS Cloud can be installed to any local or remote, managed Kubernetes cluster.

> A production-ready installation on Amazon's managed Kubernetes service (EKS) may take a first-timer several hours to configure properly, especially if they get something wrong.

I wrote this guide to reduce the learning curve and "mean-time-to-dopamine", so you don't need to feel like you're in deep waters or re-creating expensive cloud infrastructure.

This guide is for development and shows how you can deploy [OpenFaaS Cloud](https://github.com/openfaas/openfaas-cloud) for in a relatively short period of time by turning off OAuth and TLS. The OpenFaaS deployment still retains authentication by default and you don't have to worry about being rate-limited by LetsEncrypt if you get things wrong.

Updates:

> (3rd March 2020) to cover the new overrides files and `ofc-bootstrap create-github-app` functionality
> (1st Dec 2020) cover new k3d syntax and add domain deletion step
 
## Tutorial

You'll need Docker if you don't have it already and a Docker Hub account. Once that's ready, you'll setup Kubernetes using k3d (it takes 1-2 mins), install the inlets-operator to provide a public IP, setup the GitHub app, create an `init.yaml` file and finally run the tool.

![Conceptual diagram for ofc-bootstrap](https://github.com/openfaas-incubator/ofc-bootstrap/raw/master/docs/ofc-bootstrap.png)

> Pictured: ofc-bootstrap bundles a number of tools to deploy OpenFaaS Cloud with a known-configuration.

### Get Docker locally

You should use a Mac, a Linux machine or a Windows computer with [Git bash](https://git-scm.com/downloads). Although OpenFaaS supports Raspberry Pi, OpenFaaS Cloud does not at this time.

* Install Docker for Mac/Windows or Linux.

    https://docker.com/

* Install [k3d](https://github.com/rancher/k3d)

    k3d runs Kubernetes with k3s within a tiny Docker container, which makes it portable and fast. If you've not tried it, then I think that you really should.

    ```sh
    curl -s https://raw.githubusercontent.com/rancher/k3d/master/install.sh | bash
    ```

* Create a cluster

    ```sh
    k3d cluster create \
      --k3s-server-arg "--no-deploy=traefik" \
      --k3s-server-arg "--no-deploy=servicelb"
    ```

k3s ships with Traefik, but ofc-bootstrap installs nginx-ingress instead, therefore we need to disable traefik with an additional flag.

k3d will now switch your kubeconfig and context to point at the new cluster, to check run: `kubectl config get-contexts`, you should see: `*k3d-k3s-default`

### Install the inlets-operator

The [inlets-operator](https://github.com/inlets/inlets-operator) will give you a public IP so that GitHub can contact your cluster for CI/CD. GitHub will send an event when repositories are added/removed and when there is a push event for a repo.

The Operator obtains a public IP for you by creating a low-cost VM on a cloud such as [DigitalOcean](https://digitalocean.com/) or [Equinix Metal (Packet)](https://metal.equinix.com/).

The VM on DigitalOcean will cost you around 5 USD / mo, which is cheaper than an ALB, but will work from under almost any network conditions.

* Create an API key on your DigitalOcean account

    Save it as `~/Downloads/do-access-token`

* Install the operator

    arkade is a CLI tool that can install helm charts with easy flags, we'll use it to install the operator

    ```sh
    
    curl -sSLf https://dl.get-arkade.dev | sudo sh
    
    arkade install inlets-operator \
      --token-file=$HOME/Downloads/do-access-token
    ```

This uses the open source of inlets, if you wish, you can also use inlets PRO and have automatic encryption and working TLS certificates with cert-manager.

### Register your domain name

You will need a domain name to setup OFC, even for development. You cannot edit your `/etc/hosts` file since GitHub needs to send you webhooks.

You can buy a .dev domain from [Google Domains](https://domains.google/) or go cheap with something more exotic from [Namecheap.com](https://www.namecheap.com)  where a .xyz or .space will only set you back a few dollars.

If you registered `example.com`, then we'll use a sub-domain for convenience.

Later when you have a public IP from this tutorial, you'll create these DNS entries:

* `system.k3d.example.com`
* `*.k3d.example.com`

If you cannot create a wildcard domain for the second entry, then create a domain for each user or GitHub org that you will deploy from. i.e. if your name is `alexellis` then create `alexellis.k3d.example.com`

You don't have to include the sub-domain of `.k3d.`, but I've done so for convenience and to separate this from any production clusters I may run on the same domain.

### Prepare to run the ofc-bootstrap tool

* Clone the repo

    ```sh
    git clone https://github.com/openfaas-incubator/ofc-bootstrap
    cd ofc-bootstrap
    ```

* Now install the `ofc-bootstrap` binary or download it from the repo's releases page:

    ```sh
    curl -sLfS https://raw.githubusercontent.com/openfaas/ofc-bootstrap/master/get.sh | sudo sh
    ```

* Setup your GitHub App with `ofc-bootstrap create-github-app`

    Replace `https://` with `http://` wherever you see it.

    ```bash
    export DOMAIN="ofc.example.com"
    export GH_APP_NAME="Our Team OFC"

    ofc-bootstrap create-github-app \
      --name "$GH_APP_NAME" \
      --root-domain $DOMAIN \
      --insecure
    ```

> The `--insecure` flag sets the various URLs to use `http://` instead of `https://`

Example of what you get when using the GitHub App generator:

![Screenshot-2019-11-03-at-15.25.30](/content/images/2019/11/Screenshot-2019-11-03-at-15.25.30.png)

Save the results of the command to a file named `init.yaml`

* Or create the GitHub App manually

    Follow [these instructions](https://docs.openfaas.com/openfaas-cloud/self-hosted/github/) and ignore the steps for the OAuth app which are not using today.

    Enter a webhook secret on GitHub on the screen and update `init.yaml` with the value in the `github-webhook-secret` secret. If you used the generator, then it will tell you what value to save for `github-webhook-secret` in the final step.
    
    If you create the app manually, create a new `init.yaml` file and copy the parts you want to override from `example.init.yaml` into it.


### Edit `init.yaml`

For each setting you want to override, copy this from the `example.init.yaml` file.

```bash
cp example.init.yaml init.yaml
```

For example to set the `root_domain` and `app_id`, you would add these lines:

**init.yaml**
```
root_domain: example.com
app_id: example-value
```

To override a secret, just add a new item to the array of secrets created by `ofc-bootstrap create-github-app`.

* Set your domain in the `root_domain` field i.e. `k3d.example.com`
* Set the GitHub App ID in the `app_id` field
* Set the path to your GitHub private key
* Set the value for your `registry`, use your Docker Hub account
* Check your `~/.docker/config.json` file and make sure that it's base64-encoded, it will not work if your password is stored in the keychain. If in doubt, see the extended instructions in the [README](https://github.com/openfaas-incubator/ofc-bootstrap)

### Deploy OpenFaaS cloud

Run the tool in the folder you cloned:

```sh
# Make helm available in the $PATH
export $PATH=$PATH:$HOME/.arkade/bin/

ofc-bootstrap apply -f example.init.yaml -f init.yaml
```

We can specify any number of YAML files with `-f filename.yaml`. Here we use the example file and our own init.yaml file with our overrides.

Why use two files? This means that you only need to keep track of what you've changed, making merges and updates easier over time.

> Note: when I ran this at home it took < 100 seconds and was up and running. If you're connected to hotel WiFi or low-speed broadband then it could take longer.

### Find your public IP

```sh
kubectl get svc
```

Find the public IP for Nginx and create your DNS A records:

You can use two static entries:

* `system.k3d.example.com`
* `username.k3d.example.com`

If you're using DigitalOcean, then you could create these entries via the CLI:

```bash
export IP="public-ip"
doctl compute domain create --ip-address $IP system.k3d.example.com
doctl compute domain create --ip-address $IP alexellis.k3d.example.com
```

Or create a wildcard A record, which you can create through your DNS control panel. I couldn't find a way to create a wildcard entry via the `doctl` CLI.

* `*.k3d.example.com`

### Deploy a function

OpenFaaS Cloud is configured to build from a single named branch by default. So for new GitHub repos: you may need to update your branch to *master* from the new default of *main*.

Your functions YAML file must be called `stack.yml` so rename that if necessary.

* Go to the settings for your GitHub App and click "Install App"
* Install it onto a repo or your whole account
* Now trigger a build by doing a commit

The function will appear on:

```sh
http://system.k3d.example.com/dashboard/username
```

View your function on the dashboard a few seconds after hitting "git push"

![Overview](https://docs.openfaas.com/images/openfaas-cloud/welcome-09.png)

Get function details and metrics

![Details view](https://docs.openfaas.com/images/openfaas-cloud/welcome-10.png)

Or view the logs of the function at runtime:

![Runtime logs](https://docs.openfaas.com/images/openfaas-cloud/welcome-13.png)

You can now follow the [User guide for OpenFaaS Cloud](https://docs.openfaas.com/openfaas-cloud/user-guide/) where you will deploy a function using Node.js.

### Did anything go wrong?

The first port of call should be to try the steps in the [Troubleshooting guide](https://docs.openfaas.com/openfaas-cloud/self-hosted/troubleshoot/)

### Tear-down

k3d is very light-weight and you don't have to tear it down at all, you can keep everything running or run `k3d cluster stop`. The tunnel will retain its public IP address and everything will reconnect next time you re-start k3d or Docker.

Here's OpenFaaS Cloud which I installed using k3d earlier at home, reconnecting at a coffee shop through public WiFi.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">inlets-operator brings a Service LoadBalancer with public IP to any Kubernetes cluster i.e. minikube/k3d/KinD/kubeadm<br><br>I set up <a href="https://twitter.com/OpenFaaSCloud?ref_src=twsrc%5Etfw">@openfaascloud</a> on my laptop at home, when I got to a coffee shop it reconnected with the same public IP from <a href="https://twitter.com/digitalocean?ref_src=twsrc%5Etfw">@digitalocean</a>😱<a href="https://t.co/PanfWfMRlT">https://t.co/PanfWfMRlT</a> <a href="https://t.co/hHCeMRW7z2">pic.twitter.com/hHCeMRW7z2</a></p>&mdash; Alex Ellis (@alexellisuk) <a href="https://twitter.com/alexellisuk/status/1185179594040717312?ref_src=twsrc%5Etfw">October 18, 2019</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

If you really do want to tear things down, then just run the following:

```sh
# This causes the inlets-operator to delete the VM it created as an exit-server
kubectl delete svc --all

# This removes the k3d cluster
k3d cluster delete
```

The first command ensures that the inlets-operator removes the VM created for your public IP. The second deletes the k3d cluster.

If you created DNS records, you should delete those too.

## Wrapping up

Since we turned off TLS and OAuth, the time to get OpenFaaS Cloud running in this way should be just a few minutes. Adding TLS and OAuth can take additional time due to the learning curve about how certificates and DNS works. OAuth can add additional time to setting up due to configuration in GitHub.

This configuration is suitable for testing and development. The [inlets-operator](https://github.com/inlets/inlets-operator)inlets-operator gave us a tunnel so that we could expose the site to other users and to GitHub in order to receive webhooks.

You can get help with OpenFaaS Cloud from [OpenFaaS Ltd](mailto:sales@openfaas.com) or via [OpenFaaS Community Slack](https://slack.openfaas.io/)

If you want to go to production with TLS and OAuth checkout one of these tutorials:

* [Create your own private cloud with OpenFaaS Cloud](https://www.openfaas.com/blog/ofc-private-cloud/)
* [Build your own OpenFaaS Cloud with AWS EKS](https://www.openfaas.com/blog/eks-openfaas-cloud-build-guide/)
* [Introducing OpenFaaS Cloud with GitLab](https://www.openfaas.com/blog/openfaas-cloud-gitlab/)

See also:

* [openfaas/cloud](https://github.com/openfaas/openfaas-cloud)
* [inlets-operator](https://github.com/inlets/inlets-operator)
* [Create a self-hosted Docker Registry with TLS](https://github.com/alexellis/k8s-tls-registry)