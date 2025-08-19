---
title: "Docker Stacks and Attachable networks"
slug: "docker-stacks-attachable-networks"
date: "2017-02-17T08:00:00Z"
author: "Alex Ellis"
meta_title: "Docker Stacks and Attachable networks"
meta_description: "We explore attachable networks, stacks and v3 compose format through worked examples with real use-cases to back up the content including serverless and RPi"
tags:
  - "docker"
  - "networking"
  - "stacks"
  - "swarmmode"
  - "swarm"
---

There were some exciting new features with the release of [Docker 1.13.1](https://blog.docker.com/2017/02/docker-datacenter-1-13/) including: secret management, stacks, docker-compose v3 and attachable networks.

![](/content/images/2017/02/coding_stacks.jpg)

In this post we'll look at the various ways to create an attachable overlay network and what some potential use-cases could be. We also show how to use the new `docker stack` command.

### Create an attachable network

An Docker network can be created through the Docker CLI, the API or through a definition in a Docker Compose file.

**Docker CLI**

The Docker CLI has several commands for managing networks such as `create`, `ls`, `rm` and `inspect`. An attachable network is type of swarm overlay network:

```
$ docker network create --driver=overlay --attachable core-infra
zhxv6ymxhf2u0983x132hvzxf
```

```
$ docker network ls
NETWORK ID          NAME                DRIVER              SCOPE
d1b84196c831        bridge              bridge              local
zhxv6ymxhf2u        core-infra          overlay             swarm
```

The scope column shows that the attachable network is only available for Docker hosts in a `swarm`. That could be a single-node swarm or a larger swarm and is because `attachable` is a type of overlay network.

Now you can create a Swarm service and specify the network:

```
$ docker service create --publish 80:80 --network=core-infra --name nginx nginx 
ufs0fhipmxgh4w8wdf04sbkz3 
```

This is just like would normally create a service on the default `ingress` network. The attachable option is powerful because it means we can use `docker run` to create a container within the scope of this new network.

So let's create an Alpine Linux container with `docker run` and install curl to test out the nginx instance:

```
docker run --network=core-infra -ti alpine:latest sh
/ # apk add --update curl
fetch http://dl-cdn.alpinelinux.org/alpine/v3.3/main/x86_64/APKINDEX.tar.gz
fetch http://dl-cdn.alpinelinux.org/alpine/v3.3/community/x86_64/APKINDEX.tar.gz
(1/4) Installing openssl (1.0.2k-r0)
(2/4) Installing ca-certificates (20161130-r0)
(3/4) Installing libssh2 (1.6.0-r1)
(4/4) Installing curl (7.52.1-r0)
Executing busybox-1.24.1-r7.trigger
Executing ca-certificates-20161130-r0.trigger
OK: 7 MiB in 15 packages

/ # curl -v nginx
* Rebuilt URL to: nginx/
*   Trying 10.0.1.2...
* TCP_NODELAY set
* Connected to nginx (10.0.1.2) port 80 (#0)
> GET / HTTP/1.1
> Host: nginx
> User-Agent: curl/7.52.1
> Accept: */*
> 
< HTTP/1.1 200 OK
< Server: nginx/1.11.10
< Date: Thu, 16 Feb 2017 08:37:40 GMT
```

We were able to access the `nginx` service by name which is something we couldn't have done from the host. We can also access ports which are not `published` on the swarm. This is great for debugging.

Once you've created the container `docker network inspect core-infra` will show a Subnet for the network and other diagnostic information.

**Compose / (`docker stack`)**

Docker Compose will give an error if you run `docker-compose up` while in swarm mode, but with the 1.13 release a new feature was added to the Docker core  project called *stacks*. Stacks use the tried-and-tested Docker Compose format to deploy services on a swarm.

> The `docker stack deploy` command is effectively the equivalent of Docker Compose (a Python app) re-written in Golang.

Here's an example of deploying a compose file as a stack:

```
$ docker stack deploy webtier --compose-file=./docker-compose.yml
```

* The first argument is the name of the stack i.e. webtier
* The stack file is specified through `--compose-file`
* The v3 compose format introduces new options

The stack command cannot create a new attachable network. To use an attachable network with a stack we must define it ahead of time with `docker network create` then specify the  network as `external`:

```
version: "3"
services:
  nginx:
    image: nginx
    networks:
    - core-infra

networks:
  core-infra:
    external: true
```

```
$ docker stack deploy webtier --compose-file=./docker-compose.yml
Creating service webtier_nginx

$ docker stack ls
NAME  SERVICES
webtier   1

$ docker stack ps ex1
ID            NAME         IMAGE         NODE  DESIRED STATE 
sxj04xh2z29j  webtier_nginx.1  nginx:latest  moby  Running       
```

**A note on stacks**

Stacks consist of regular Swarm Services which have been grouped together by a label. You can see this by running `docker inspect` on a service created by a stack file:

```
$ docker inspect webtier_nginx --format="{{.Spec.Labels}}"
map[com.docker.stack.namespace:webtier]
```

To update a stack which is already inflight, just type in the `docker stack deploy` command again.

For an example of a stack file checkout my [serverless functions project on Github](https://github.com/alexellis/faas).

### Use cases:

We will now look into a few quick examples for how to use attachable networks.

![](/content/images/2017/02/use-cases.jpg)

**Privileged containers / device creation**

There are a range of reasons why someone may want to create a privileged container.

* Controlling hardware with Raspberry Pi / IoT
* Creating VPNs
* Setting administration policies for the Docker host

With the example of controlling hardware - most Raspberry Pi add-ons or breakouts for sensors, LEDs and other electronics require the use of GPIO. So far I'm not aware of a method to make this work for a Swarm Service.

An attachable network offers the ability for us to schedule a privileged container separate to our swarm services and still have them communicate. For instance we could run Prometheus and AlertManager for instrumentation as Swarm Services and then start Docker containers that read temperature sensors in privileged mode.

**Co-existing with existing solutions**

Attachable networks help Docker Swarm Services interoperate with the previous version of orchestration called Swarm. This is important for customers who have established solutions with earlier releases of Docker Datacenter.

The core difference between legacy Swarm and Swarm Services is that the legacy offering allowed containers to be scheduled in an imperative manner. Declarative swarm services allow us to define a final state we want to achieve which the swarm will then apply and maintain.

This means teams can start to adopt and migrate to Swarm Services and leverage the benefits of declarative services over purely ad-hoc imperative containers.

**Serverless / Ad-hoc tasks / debugging**

* Serverless frameworks

Serverless and function-based frameworks can take advantage of a declarative set of services while still scheduling ad-hoc containers as needed for executing serverless functions.

For an example see my [Functions as a Service](https://github.com/alexellis/faas) project on Github.

* Ad-hoc tasks / debugging

Ad-hoc tasks are currently hard to schedule through Swarm Services without [using the Docker API directly](https://github.com/alexellis/jaas). This interoperability allows us to run maintenance and diagnostic jobs.

Here are a few examples:

* Disaster recovery
* Data migrations
* Debugging connectivity

### Wrapping up

![](/content/images/2017/02/ideas.jpg)

For questions, comments or suggestions - please get in touch on [Twitter: @alexellisuk](https://twitter.com/alexellisuk)

**See also:**

* [Functions as a Service (FaaS) serverless platform](https://github.com/alexellis/faas) - write-up and code

* My full [Raspberry Pi / Docker series](http://blog.alexellis.io/tag/raspberry-pi/)

* [Docker 1.13.1 release blog](https://blog.docker.com/2017/02/docker-datacenter-1-13/)

**Share and Follow on Twitter**

<blockquote class="twitter-tweet" data-cards="hidden" data-lang="en"><p lang="en" dir="ltr">Checkout Swarm stacks and attachable networks: two essential tools that landed in <a href="https://twitter.com/docker">@docker</a> 1.13 - <a href="https://t.co/Os6AB7I9iF">https://t.co/Os6AB7I9iF</a> <a href="https://twitter.com/hashtag/FridayFeeling?src=hash">#FridayFeeling</a> <a href="https://t.co/KWkOneHqYp">pic.twitter.com/KWkOneHqYp</a></p>&mdash; Alex Ellis (@alexellisuk) <a href="https://twitter.com/alexellisuk/status/832518431891193856">February 17, 2017</a></blockquote> <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>