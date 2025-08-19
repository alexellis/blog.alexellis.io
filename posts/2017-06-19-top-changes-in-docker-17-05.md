---
title: "Top 6 changes in Docker CE 17.05"
slug: "top-changes-in-docker-17-05"
date: "2017-06-19T07:31:00Z"
author: "Alex Ellis"
meta_title: "Top 6 changes in Docker CE 17.05"
meta_description: "Released on 5th May 2017 - Docker CE 17.05. Let's walk through the changelog and highlight the top changes including multi-stage builds and CLI enhancements"
tags:
  - "docker"
  - "hacks"
  - "update"
  - "changelog"
---

On May 5th 2017 the Docker engineering team released version v17.05.0-ce of the Docker CE product. The versioning is relatively new and follows a similar pattern to the Ubuntu project - YY.MM - so the next version will be 17.06 for June. CE stands for Community Edition and differentiates between this and the commercial offering.

Like most well-managed open-source projects a high-level changelog is provided with each release - this lets us know what new features are available and sometimes these link to Pull Requests to give additional context and discussion.

In this post I'll highlight a few of the changes.

### Multi-stage builds

The long-awaited multi-stage builds were made available in the 17.05 CE release and also highlighted in the Dockercon keynote. This feature helps you separate your build-time dependencies from your runtime environment. In the case of a small Golang Dockerfile your resulting image could go from around 600MB in size to under 10MB.

* [Multi-staged builds tutorial](http://blog.alexellis.io/mutli-stage-docker-builds/)

### --mount flag for `docker run`

The syntax for mounting volumes in `docker run` and Swarm is very different and that means learning two sets of syntax. The `--mount` change means `docker run` can now use the syntax from `docker swarm create`.

In this example I'll show the various options for mounting using the [Portainer project](http://portainer.io/) which provides a free, feature-rich UI for Docker and Swarm.

Mounting a Docker volume with `docker run`

```
$ docker run -v /var/run/docker.sock:/var/run/docker.sock \
-p 9000:9000 -d portainer/portainer -H unix:///var/run/docker.sock
```

In Swarm you would have typed in:


```
docker service create \
--publish 9000:9000 \
--mount type=bind,src=/var/run/docker.sock,dst=/var/run/docker.sock \
portainer/portainer -H unix:///var/run/docker.sock
```

You can see the syntax is much more verbose and can be harder to remember. `docker run` can now use this same syntax:

```
docker run \
-p 9000:9000 \
--mount type=bind,src=/var/run/docker.sock,dst=/var/run/docker.sock \
-d portainer/portainer -H unix:///var/run/docker.sock
```

### Dockerfile via stdin

A new change to the user experience means that you can now read a Dockerfile over `stdin`. I'm not sure this is a change everyone will need in their toolbox but advanced users may make use of it for scripting. It means that rather than reading a Dockerfile from disk - you can read it from the output of another program or the bash console.

Example:

```
$ docker build -t my-image . -f -

FROM alpine
RUN apk --no-cache add curl
CMD ["curl"]

(Control + D)
```

Did you know that the `-f` flag allows you to specify a different name or path for your Dockerfile? This can be useful when maintaining projects for different architectures. You could maintain a Dockerfile for Raspberry Pi called `Dockerfile.armhf` for instance and then build it on a RPi with `docker build -t myimage:pi. -f Dockerfile.armhf`.

### Secrets get formatting

The CLI has improvements around inspecting and listing secrets created on your swarm. 

For instance here is the regular output:

```
$ docker secret ls
ID                          NAME                        CREATED             UPDATED
180246v1yjayukr64ioxpgubw   func_accesskey              3 weeks ago         3 weeks ago
i1u0q0uhc7qxcmj6kr37kvv5a   func_secretkey              3 weeks ago         3 weeks ago
```

With a custom format you can pick whatever values you are interested in. The `--format` flag is already available for other commands like `docker network inspect` and `docker inspect` (for containers).

This gives us the `id` alone (useful for piping to `xargs` or scripts)

```
docker secret ls --format "{{.ID}}"
```

This gives the Name plus any Labels associated:

```
$ docker secret ls --format "{{.Name}}\t{{.Labels}}"
func_accesskey	com.docker.stack.namespace=func
func_secretkey	com.docker.stack.namespace=func
```

### Setting up the daemon's data root

The `--graph` flag that can be configured on the Docker daemon to specify the root folder of your Docker library has had a name change. The flag is now called `--data-root`.

If you're using `--graph` or `-G` you don't need to change just yet but if you want to then find your systemd file with `systemctl status docker`. I'm on Ubuntu here so my file is at: `/lib/systemd/system/docker.service`.

So we can change the Docker data root from `/var/lib/docker` if we want to anything else by adding `--data-root` to our systemd file:

```
ExecStart=/usr/bin/dockerd -H fd:// --data-root=/mnt/ssd/lib/docker
```

### Task logs for Docker Swarm

You can now fetch the logs for individual tasks or replicas for your Docker Swarm services. An example may be an NGinx webserver:

```
$ docker service create --name web --publish 80:80 --replicas=2 nginx
```

Your services will show up with two replicas or (tasks). 

```
$ docker service ls
ID                  NAME                MODE                REPLICAS            IMAGE               PORTS
sd86rprefd4c        web                 replicated          2/2                 nginx:latest        *:80->80/tcp
```

You can find the list of task ids from `docker service ps web`. The logs will be empty - so use `curl` to create some log entries, then review the logs.

```
$ curl http://localhost:80/page_a -4
$ curl http://localhost:80/page_b -4
```

Each replica will get one log entry.

```
$ docker service ps web
ID                  NAME                IMAGE               NODE                DESIRED STATE       CURRENT STATE            ERROR               PORTS
1qzlqimfu5fi        web.1               nginx:latest        alexx               Running             Running 13 seconds ago                       
9oq9jz40vwfy        web.2               nginx:latest        alexx               Running             Running 13 seconds ago
```

Now checkout the logs of each individual task using the value from the `ID` column:

```
$ docker service logs 1qzlqimfu5fi
web.1.1qzlqimfu5fi@alexx    | 10.255.0.2 - - [15/Jun/2017:21:07:42 +0000] "GET /page_b HTTP/1.1" 404 169 "-" "curl/7.47.0" "-"

$ docker service logs 9oq9jz40vwfy
web.2.9oq9jz40vwfy@alexx    | 10.255.0.2 - - [15/Jun/2017:21:07:38 +0000] "GET /page_a HTTP/1.1" 404 169 "-" "curl/7.47.0" "-"
```

This will definitely be a handy feature for debugging services - especially when you need targeted logs.

#### Wrapping up

There's quite a few additional changes around the Docker Swarm CLI which you can read in the [Changelog notes](https://github.com/moby/moby/releases/tag/v17.05.0-ce) over on Github.

If you found this useful then checkout my archive of Docker and Swarm tutorials below:

* [Raspberry Pi guides & tutorials](http://blog.alexellis.io/tag/raspberry-pi/)

* [Docker tutorials](http://blog.alexellis.io/tag/docker/)

* [Docker Swarm tutorials](http://blog.alexellis.io/tag/swarm/)

> Follow me on Twitter [@alexellisuk](https://twitter.com/alexellisuk)

##### Share on Twitter

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Let&#39;s take a look at the top 6 changes in Docker&#39;s May release 17.05 CE. <a href="https://twitter.com/Docker">@Docker</a> <a href="https://t.co/tV7W1DHVT8">https://t.co/tV7W1DHVT8</a></p>&mdash; Alex Ellis (@alexellisuk) <a href="https://twitter.com/alexellisuk/status/876707082304716800">June 19, 2017</a></blockquote> <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>