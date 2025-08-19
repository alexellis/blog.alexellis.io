---
title: "Learn Docker Swarm Mode - scale in 5 minutes!"
slug: "docker-swarm-mode-part1"
date: "2016-06-20T17:26:45Z"
author: "Alex Ellis"
tags:
  - "docker"
  - "swarm"
  - "Dockercon"
  - "swarmmode"
  - "1.12"
---

Wow, sitting in the second row of the Dockercon Keynote today - there is so much new stuff in Docker 1.12! As a member of the Docker for Mac Beta program I got early access to Docker 1.12RC and pulled it down and updated my machine last night while waiting for Dockercon to start in Seattle. It was a 100MB update and my hotel WiFi is really fast (said nobody ever).

> After updating I was still able to point at Docker 1.11 servers and run my [previous workloads](https://github.com/alexellis/datacenter-sensor) with the legacy Swarm version. YMMV, but do try the update.

I wanted to look at the new `docker service` command. I'd seen a sneak preview of this from [Mike Goelzer](https://twitter.com/mikegoelzer) and tried to re-create from memory what he'd shown me about a week earlier.

#### Starting with a service

Let's pick a `service` or a long running container. This could be the `sleep 500` command, but we can just as easily make it `ping docker.com`.

Have a look at the new `docker service` command's help page:

```
$ docker service

Usage:	docker service COMMAND

Manage Docker services

Options:
      --help   Print usage

Commands:
  create      Create a new service
  inspect     Inspect a service
  tasks       List the tasks of a service
  ls          List services
  rm          Remove a service
  scale       Scale one or multiple services
  update      Update a service

Run 'docker service COMMAND --help' for more information on a command.
```

##### docker service create
`docker service create` is synonymous with `docker run`, so anything we can do with `docker run` should work the same.

```
$ docker run busybox ping google.com
PING google.com (216.58.193.110): 56 data bytes
64 bytes from 216.58.193.110: seq=0 ttl=37 time=0.527 ms
64 bytes from 216.58.193.110: seq=1 ttl=37 time=0.629 ms
```

Here's the equivalent command with `docker service create`:

```
$ docker service create --name ping1 busybox ping docker.com
1hakvrpkl01zque7u17dxox41
```

I've assigned a name to the service so that we can reference it easily, but Docker has also generated a GUID of `1hakvrpkl01zque7u17dxox41`. 

##### docker service ls

To check which services we have running/created type in `docker service ls` as below:

```
$ docker service ls
ID            NAME            REPLICAS  IMAGE    COMMAND
1hakvrpkl01z  ping1           1/1       busybox  ping docker.com
```

##### docker service scale

Scaling this has never been easier, we just type in the name of the service and how many replicas we want.

```
$ docker service scale ping1=5
ping1 scaled to 5
```

We will now see that the `docker service ls` command gives `5/5` replicas as running and `docker ps` will show 5 unique containers running, too.

```
$ docker service ls
ID            NAME            REPLICAS  IMAGE    COMMAND
1hakvrpkl01z  ping1           5/5       busybox  ping docker.com
```

##### docker scale rm

Once you have finished your work either scale back to 0 or remove the service with `docker service rm ping1`

##### And so much more

Head over to [part 2](http://blog.alexellis.io/microservice-swarm-mode/) now where we will scale up a microservice across the new Swarm Mode. Check out more of the exciting new features over on the [Docker blog](https://blog.docker.com) now.

> [Part 2: scale a real GUID-generating microservice](http://blog.alexellis.io/microservice-swarm-mode/)


See also:

> [My Dockercon 2016 Speaker notes, recap + IoT Swarm demo](http://blog.alexellis.io/dockercon-2016-speaker-notes/)