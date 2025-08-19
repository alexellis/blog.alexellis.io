---
title: "OpenFaaS comes to k9s, the Kubernetes CUI"
slug: "k9s-the-kubernetes-cui-comes-to-openfaas"
date: "2020-02-14T09:16:02Z"
author: "Alex Ellis"
meta_title: "OpenFaaS comes to k9s, the Kubernetes CUI"
meta_description: "Join me as I take Fernand Galiana's new OpenFaaS integration for k9s for a test-drive. k9s is a popular open-source CUI for Kubernetes with 5k GitHub stars."
tags:
  - "kubernetes"
  - "k3sup"
  - "k9s"
  - "civo"
  - "openfaas"
  - "k3s"
---

Last night I saw a tweet from [Fernand Galiana](https://twitter.com/kitesurfer), the author of the popular open source text UI for Kubernetes named "k9s". Fernand added support for OpenFaaS Functions and Services via his project. k9s has over 5k GitHub stars and many fans in the Cloud Native community. If you've not tried it yet, you are missing out.

Here's the Pod view from the docs:

![k9s Pod view](https://github.com/derailed/k9s/raw/master/assets/screen_po.png)

And a neat way of getting logs, too:

![k9s log view](https://github.com/derailed/k9s/raw/master/assets/screen_logs.png)

This isn't just `kubectl get pods` / `kubectl logs` wrapped in a CLI, but to me that's definitely a core part of the value offering. In Fernand's OpenFaaS demo you'll see him show metrics from his Nginx IngressController.

Let's take a quick look at it, and then I'll leave his video below for his tour of the new feature.

> I'm using some free credits I have from my friends at [Civo Cloud](https://www.civo.com/), the UK's developer-cloud. Earlier in the year I helped them build out [The World's First Managed k3s](https://blog.alexellis.io/the-worlds-first-managed-k3s/) and I heard about k9s from their team.

## The video tour

<iframe width="560" height="315" src="https://www.youtube.com/embed/7Fx4XQ2ftpM" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Try it for yourself

If you don't have OpenFaaS deployed yet then you can install it via `k3sup` (ketchup), an app installer for Kubernetes and it will only take a few moments:

```bash
curl -sSLf https://dl.arkade.dev | sudo sh

arkade install openfaas
```

After following the instructions given by the output, you'll log in and port-forward the OpenFaaS gateway to your local machine on port `8080`.

If you have a remote OpenFaaS gateway, you can also set an environment variable.

```bash
# Default
kubectl port-forward -n openfaas svc/gateway 8080:8080 &
export OPENFAAS_GATEWAY=http://127.0.0.1:8080

# Remote
export OPENFAAS_GATEWAY=https://my-gateway.example.com
```

There are several ways to get `k9s` including brew, but since it's a single binary, I prefer to download it myself and put it into `/usr/local/bin`. On MacOS, this is how I did it:

```bash
curl -sSLf https://github.com/derailed/k9s/releases/download/v0.15.1/k9s_Darwin_x86_64.tar.gz > k9s.tgz

tar -xvf k9s.tgz -C /tmp/
sudo mv /tmp/k9s /usr/local/bin/
```

Then run it:

```bash
k9s
```

The navigation may take some getting used to, but once you know a few keyboard shortcuts you'll be set.

Here, we can see the OpenFaaS control-plane coming up:

![control-plane](/content/images/2020/02/control-plane.png)

Now let's deploy a function from the store:

```bash
faas-cli store deploy nodeinfo
```

> You can navigate to your OpenFaaS function view by entering command mode :openfaas or using aliases :ofaas or ofa

I'm invoking the function under a load test, [as per Lab 9 of the OpenFaaS workshop](https://github.com/openfaas/workshop/blob/master/lab9.md) and we can see it scaling up.

![scale](/content/images/2020/02/scale.png)

And here are the logs, remember you can set `write_debug` or write to STDIO for additional verbosity.

![logs](/content/images/2020/02/logs.png)

## Wrapping up

I want to thank Fernand for taking time to integrate his cool open-source project with OpenFaaS and for sharing it with us on YouTube. I hope the community will try it out and give him feedback.

One of the things I'd like to see is a little text-based graph showing invocation metrics and auto-scaling, just like we provide with the Grafana dashboard:

![OpenFaaS dashboard](https://camo.githubusercontent.com/24915ac87ecf8a31285f273846e7a5ffe82eeceb/68747470733a2f2f7062732e7477696d672e636f6d2f6d656469612f4339636145364358554141585f36342e6a70673a6c61726765)

You can follow [Fernand on Twitter](https://twitter.com/kitesurfer), and star his project on GitHub [derailed/k9s](https://github.com/derailed/k9s).

To connect with the OpenFaaS community, [join us on Slack](https://slack.openfaas.io/)

> Did you know? [We just launched a SWAG store](https://www.openfaas.com/blog/swag-store-launch/), and you can get your own super-soft cotton t-shirts shipped directly to your door. Use discount code `teamserverless-earlybird` for money off, whilst stocks last.