---
title: "Build a Serverless appliance with faasd"
slug: "deploy-serverless-faasd-with-cloud-init"
date: "2020-02-06T09:16:45Z"
author: "Alex Ellis"
meta_title: "Deploy your own faasd appliance with cloud-init"
meta_description: "In less than 5 minutes flat, we'll deploy our own faasd appliance to DigitalOcean and start deploying containers built for OpenFaaS, but without Kubernetes"
feature_image: "/content/images/2020/02/takeaway.jpg"
tags:
  - "openfaas"
  - "kubernetes"
  - "faasd"
  - "containerd"
  - "faas"
  - "serverless"
  - "teams"
  - "webhooks"
  - "digitalocean"
---

Have you heard of faasd, [the new provider](https://docs.openfaas.com/architecture/faas-provider/) for OpenFaaS? It's just like OpenFaaS on Kubernetes, the same API, same UI, CLI and ecosystem, but without the complexity and stress of running a scale-out distributed system.

In this short tutorial I'll show you how to leverage cloud-init, a standard way to install packages and to configure cloud hosts to get a faasd host in less than 5 minutes flat. Or your money back.

## What can I use faasd for?

You can use faasd's API to deploy containers, which conform to the [OpenFaaS serverless workload definition](https://docs.openfaas.com/reference/workloads/).

* Deploy a microservice (accepting HTTP on port 8080)
* Get a HTTP API for any binary or CLI through the use of the [Classic Watchdog](https://docs.openfaas.com/architecture/watchdog/)
* Or deploy a function written in any language [from our templates or the template store](https://docs.openfaas.com/cli/templates/#templates)

## What sort of use-cases might work well for faasd?

faasd works well for the same kinds of use-cases as OpenFaaS on Kubernetes, but is much simpler to manage. You can think of it like "faas in a box" or "faas to go".

* As a consultancy, you want to deploy something simple for a client, with little maintenance or after-care
* A blog, or static site built with Hugo, Jekyll, Ruby, etc
* An API written in Node.js, ASP.NET, or Vert.x for instance
* A single-page app
* A stripe webhook receiver
* An ecommerce site
* A Slackbot
* An integration for a data-feed from third-parties
* Batch jobs, overnight processing via cron

faasd does not ship with clustering support, but instead I recommend that teams running critical services use redundancy, and deploy multiple faasd hosts. This is similar to how RAID-1 would work in storage - rather than having to pay for the unnecessary complexity of distributed systems and scheduling.

If you're a Kubernetes user, then you may prefer to use OpenFaaS on Kubernetes which is my recommendation for most teams. Learn how with the free [OpenFaaS workshop](https://github.com/openfaas/workshop).

## How does it work?

Faasd uses the same battle-tested components as Kubernetes such as [containerd](https://github.com/containerd/containerd) and runc to execute and isolate containers, and Container Networking Interface Plugins (CNI)

### Sign up for a DigitalOcean account

Head over to [DigitalOcean.com](https://m.do.co/c/8d4e75e9886f) and use my referral code to gain some free credits. After signing-up, or logging in with your existing account, head over to the Droplets page.

> Note: you can run these instructions for other cloud providers, and even run them against your own laptop whether using MacOS, Windows, or Linux using a tool like Multipass.run, you'll see a link at the end of the post for the main faasd repo which contains other tutorials.

### Create a new Droplet

Pick these settings:

Image: [Ubuntu 18.04.3 (LTS) x64](https://wiki.ubuntu.com/LTS)
Plan: Starter, 10 USD - 2 GB RAM / 1 CPU

Click your nearest region, mine is London

Now, click "Select additional options" and "User data". We'll use user-data to configure the Droplet with faasd on first boot.

Head over to the [faasd](https://github.com/alexellis/faasd) GitHub repo and download the [cloud-config file](https://github.com/alexellis/faasd/blob/master/cloud-config.txt).

Now edit the first line so that it has your own ssh-key, if you don't have an ssh-key, then run `ssh-keygen` and answer all the questions with the defaults.

Populate the text under `ssh_authorized_keys:` with the contents of `$HOME/.ssh/id_rsa.pub`:

```yaml
#cloud-config
ssh_authorized_keys:
  - ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC8Q/aUYUr3P1XKVucnO9mlWxOjJm+K01lHJR90MkHC9zbfTqlp8P7C3J26zKAuzHXOeF+VFxETRr6YedQKW9zp5oP7sN+F2gr/pO7GV3VmOqHMV7uKfyUQfq7H1aVzLfCcI7FwN2Zekv3yB7kj35pbsMa1Za58aF6oHRctZU6UWgXXbRxP+B04DoVU7jTstQ4GMoOCaqYhgPHyjEAS3DW0kkPW6HzsvJHkxvVcVlZ/wNJa1Ie/yGpzOzWIN0Ol0t2QT/RSWOhfzO1A2P0XbPuZ04NmriBonO9zR7T1fMNmmtTuK7WazKjQT3inmYRAqU6pe8wfX8WIWNV7OowUjUsv alex@alexr.local
```

Now paste the whole content into the UI:

![faasd-init](/content/images/2020/02/faasd-init.png)

Finally, give the droplet a name and create it.

![create](/content/images/2020/02/create.png)

### First login

After a few moments, sometimes as little as a 30 seconds you'll be given an IP address by DigitalOcean.

![get-ip](/content/images/2020/02/get-ip.png)

OpenFaaS has authentication turned on by default, so by the time you type this in, it should be up and running.

Log in via SSH to obtain your password for the OpenFaaS gateway.

```sh
export IP="178.128.163.199"
export PASSWORD=$(ssh root@$IP "sudo cat /var/lib/faasd/secrets/basic-auth-password")

echo Your gateway password is: $PASSWORD

echo Navigate to your gateway at http://$IP:8080/ and login as "admin"
```

![login-1](/content/images/2020/02/login-1.png)

Congratulations! You now have OpenFaaS deployed with faasd running on a 10 USD DigitalOcean droplet and Ubuntu 18.04.

You can then use the Function Store pop-up to deploy a sample from the community. Here's the "certinfo" function by contributor Stefan Prodan.

It shows that I have two months left on the TLS certificate for my blog at [blog.alexellis.io](https://blog.alexellis.io/).

![certinfo-invoke](/content/images/2020/02/certinfo-invoke.png)

#### Meet sub-second scale from zero

Since faasd trims the fat and cuts away excess, it can do some special things like scaling down to zero and back again in less than a second.

Here's a quick example of how that might look using `faas-cli`:

First let's log in so that we can deploy a test function:

```sh
export IP="178.128.163.199"
export PASSWORD=$(ssh root@$IP "sudo cat /var/lib/faasd/secrets/basic-auth-password")

export OPENFAAS_URL=http://$IP:8080
echo $PASSWORD | faas-cli login --password-stdin
```

Since each function deployed in OpenFaaS always has one replica available to serve traffic, we can see that the response time is already low:

```sh
faas-cli store deploy figlet --env write_timeout=1s
time curl $OPENFAAS_URL/function/figlet -d HOT

 _   _  ___ _____ 
| | | |/ _ \_   _|
| |_| | | | || |  
|  _  | |_| || |  
|_| |_|\___/ |_|  

real	0m0.082s
```

We have built-in metrics that will show the replica count and invocations:

```sh
faas-cli list
Function                      	Invocations    	Replicas
certinfo                      	1              	1    
figlet                        	2              	1    
```

Now let's use the OpenFaaS REST API to scale the function down to zero replicas:

```sh
curl http://admin:$PASSWORD@$IP:8080/system/scale-function/figlet -d '{"serviceName":"figlet", "replicas": 0}'
```

See how it's now scaled to 0 replicas?

```sh
faas-cli list
Function                      	Invocations    	Replicas
certinfo                      	1              	1    
figlet                        	2              	0    
```

Now invoke it again, this time we have a "cold start", something which can take seconds on public Cloud FaaS products and on Kubernetes projects too.

```sh
time curl $OPENFAAS_URL/function/figlet -d COLD;echo
  ____ ___  _     ____  
 / ___/ _ \| |   |  _ \ 
| |  | | | | |   | | | |
| |__| |_| | |___| |_| |
 \____\___/|_____|____/ 
                        

real	0m0.109s
```

Now we see 109s there right? And you're thinking that means it took 100ms to cold-start. You're wrong, it took that long to do a round-trip from my home ISP, through containerd, to cold-start, execute the code and then get back again.

The faasd logs show the true cold-start metric:

```
ssh root@$IP "sudo journalctl -u faasd --no-pager"


Feb 06 09:05:16 faasd-alexellis faasd[1666]: 2020/02/06 09:05:16 [Scale 0] function=figlet 0 => 1 requested
Feb 06 09:05:16 faasd-alexellis faasd[1666]: 2020/02/06 09:05:16 SetReplicas [figlet.] took: 0.024264s
Feb 06 09:05:16 faasd-alexellis faasd[1666]: 2020/02/06 09:05:16 GetReplicas [figlet.] took: 0.006854s
Feb 06 09:05:16 faasd-alexellis faasd[1666]: 2020/02/06 09:05:16 GetReplicas [figlet.] took: 0.006891s
Feb 06 09:05:16 faasd-alexellis faasd[1666]: 2020/02/06 09:05:16 [Scale] function=figlet 0 => 1 successful - 0.044395 seconds
Feb 06 09:05:16 faasd-alexellis faasd[1666]: 2020/02/06 09:05:16 Forwarded [POST] to /function/figlet - [200] - 0.008921 seconds
```

Looks like it took `0.04s`, which is not bad considering that we're running on a shared-use VPS that costs us 10 USD / month and a function that's not even optimized yet.

A 40ms cold-start, that's hardly worth calling "COLD", is it?

If you want to, you can delete your Droplet now via the DigitalOcean dashboard and start over again at any time. You could even automate this with very simple tooling like [Ansible](https://www.ansible.com/) or bash.

## Wrapping up and next steps

For a walk-through of some of the fun and interesting things you can do with faasd, see my tutorial ["faasd - lightweight Serverless for your Raspberry Pi"](https://blog.alexellis.io/faasd-for-lightweight-serverless/), it covers the following:

* the function store
* installing the OpenFaaS CLI
* asynchronous functions and callbacks
* building your own function and deploying it
* adding TLS and encryption with Caddy

I hope you've enjoyed this tutorial and that you may go on to try other parts of faasd and OpenFaaS. [faasd started as a scratch I wanted to itch](https://blog.alexellis.io/faas-containerd-serverless-without-kubernetes/), but now has become more, with customer interest around VM appliances, and simple CaaS without the headaches of cluster management.

If you have comments, suggestions or questions, please reach out to the community, or Tweet to me [@alexellisuk](https://twitter.com/alexellisuk)

### Connect with the community

* Contribute, star and fork [faasd](https://github.com/alexellis/faasd) and [OpenFaaS](https://github.com/openfaas/faas) on GitHub
* Join the [Slack Community](https://slack.openfaas.io)
* Subscribe to my [premium OSS and Cloud Native newsletter](https://insiders.openfaas.io/)