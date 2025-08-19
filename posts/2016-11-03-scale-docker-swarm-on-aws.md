---
title: "Deploy & scale your application on AWS with Docker Swarm"
slug: "scale-docker-swarm-on-aws"
date: "2016-11-03T23:42:33Z"
author: "Alex Ellis"
meta_title: "Scale your application on AWS with Docker Swarm"
meta_description: "Follow this hands-on guide with video to deploy and scale your application on Amazon Web Services (AWS) EC2 instances with Docker Swarm services."
tags:
  - "docker"
  - "ubuntu"
  - "Amazon Web Services"
  - "nicehash"
  - "bitcoin"
  - "aws"
  - "mining"
  - "linux"
  - "amazon"
---

In this guide we will look at how to provision a set of 16 EC2 instances on AWS (Amazon Web Services) and then deploy an application with Docker Swarm services.

![](/content/images/2016/11/button.png)

**What the guide covers**

* Creating 16 Ubuntu 16.04 nodes in the EC2 console
* An automated Docker installation
* Automatic swarm uplinks 
* Deploying an application creating 16 replicas
* Cleaning-up the AWS EC2 instances

**Use case: distributed hash calculations (for cloud mining)**

* We join our nodes into crowd-sourced pool of processing power
* Our nodes will calculate CPU-intensive hashes
* We'll get paid a small dividend for our computing power and time
* Docker Swarm's service function will handle the orchestration for us

A single node has a limited rate of calculating hashes, so we can increase that rate by joining many nodes together.

### The Video

<iframe width="560" height="315" src="https://www.youtube.com/embed/F5J8eQHlR2I" frameborder="0" allowfullscreen></iframe>

**Cloudinit hacks**

> Most cloud providers give you an opportunity to run a custom script when your node is provisioned. The script is injected through a process called *cloudinit*

One hack I use in the scripts is to have the nodes reach out to an external website to find their public IP address. This is then passed into the `docker swarm join` call.

```
site=$(curl -s https://api.ipify.org/?format=text); \
 docker swarm join --advertise-addr $site   \
 --token SWMTKN-1-2nle9d1yoocuhtchkx9m1uba0xs8uwwquj1dq1v5ipjgp4fka5-aabs7ghllav8g7wjbv62zz3tp  \
 172.31.62.216:2377
```

The second hack I used was to automatically rename the cloud node with a suffix. Here's the script I used:

```
export original=$(cat /etc/hostname)
sudo hostname $original-alexellisio
echo $original-alexellisio | sudo tee /etc/hostname
```

> Docker has a new solution for provisioning infrastructure on AWS called Docker for AWS. You can find out more about the beta program here: [docker.com/aws](http://www.docker.com/aws)

**Gists:**

Here are the gists that I used in the video:

* [Ubuntu provisioning script](https://gist.github.com/alexellis/189cfeed58e94066106b486b76b4c015)

* [Mining application](https://gist.github.com/alexellis/ff3347fa0e0c756bfecc4073f02ea452)

This gist also contains some benchmarks of various cloud instances from other providers.

### See also:

* [Quick start guide to Docker Swarm Services](http://blog.alexellis.io/tag/swarmmode/)

* [Docker Swarm on Raspberry Pi](http://blog.alexellis.io/tag/raspberry-pi/)

* [Docker mini-series for legacy Windows applications](http://blog.alexellis.io/tag/windows)