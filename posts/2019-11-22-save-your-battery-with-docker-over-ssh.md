---
title: "Can Docker over ssh save your battery from running out?"
slug: "save-your-battery-with-docker-over-ssh"
date: "2019-11-22T15:37:54Z"
author: "Alex Ellis"
meta_title: "Can Docker over ssh save your battery from running out?"
meta_description: "Many developers run a virtual machine on their MacBook, just so that they can build Docker images, but what if there was another way? Find out how SSH may help"
---

The primary reason I have Docker installed on my MacBook is so that I can run `docker build` - if I need `docker run`, I can do that in other ways like connecting to a remote computer or using my remote Kubernetes cluster.

Whilst this is a convenient way to build images, it can also be an unfortunate way to drain your battery life because it is necessary to run a Linux Virtual Machine. Being low on battery is inconvenient when travelling or away from a power source for extended periods of time.

My hypothesis is that if we could use a remote server for Docker builds, we could save battery. Let's look at a few ways we could do that, then try one of them out and finally review the experience.

* Expose the Docker Daemon on a port from a remote machine

    With this option the `DOCKER_HOST` variable is set followed by `tcp://` and an IP address and port. Since Docker runs as root in a privileged context, it's important to enable TLS and authentication before opening up Docker to the world. The configuration is a little tricky and time-consuming, but once in place will build relatively quickly. See also: [Protect the Docker daemon socket](https://docs.docker.com/engine/security/https/)

* Use a SaaS container builder

    Google Cloud offers [Cloud Build](https://cloud.google.com/cloud-build/) which can be triggered by pushing code up into a Git repository. The pros are no local docker, but the cons are that we're now tied into a SaaS product which we are going to need to use *a lot* and which is not free. The feedback loop is also very very slow between each change.

* Build in-cluster

    If you have a remote Kubernetes cluster, then you can use external tooling like [Jenkins](https://jenkins.io), [Tekton](https://tekton.dev), [docker buildx](https://docs.docker.com/buildx/working-with-buildx/) or a myriad of other solutions to perform a build and push into a trusted registry. This suffers from a slow feedback cycle and having a hard dependency on Kubernetes.

* Docker's new `ssh` support

    Starting with Docker 18.09, the Docker client supports connecting to a remote daemon via SSH. Using ssh is similar to the option of enabling the Docker Daemon to be accessed via a public port, but unlike that option, it doesn't need lengthy configuration of TLS because of link encryption. Using ssh also means that the Docker daemon is not exposed directly or opaquely on the Internet.

## Trying out `docker build` with `ssh`

### Create a cloud VM

You can create a cloud VM, or setup a second machine at your office or in your home. I used [DigitalOcean](https://digitalocena.com) and provisioned a machine with 1 Core and 3GB RAM for 15 USD / mo.

Log into the machine with `ssh` and install Docker:

```
curl -SLsf https://get.docker.com | sudo sh
```

Add a user which make use of Docker and which can log into the machine remotely. Assuming Ubuntu run:

```
useradd build -G docker -m -S /bin/bash
```

Copy your public SSH key info for the new user:

```
sudo -u build mkdir -p /home/build/.ssh
cp /root/.ssh/authorized_keys /home/build/.ssh/
chown -R build:docker /home/build/.ssh/
```

### Configure your client

You'll need Docker's client to be installed on your local computer, or you can install all of Docker and then stop its daemon.

From here, either use the `-H` flag or set `DOCKER_ADDR` as an environment variable.

### Use your remote Docker daemon

```
docker -H ssh://build@159.65.75.79:22 info
Client: Docker Engine - Community
 Version:           19.03.3
 API version:       1.40
 Go version:        go1.12.10
 Git commit:        a872fc2
 Built:             Tue Oct  8 00:55:12 2019
 OS/Arch:           darwin/amd64
 Experimental:      false

Server: Docker Engine - Community
 Engine:
  Version:          19.03.5
  API version:      1.40 (minimum version 1.12)
  Go version:       go1.12.12
  Git commit:       633a0ea838
  Built:            Wed Nov 13 07:28:22 2019
  OS/Arch:          linux/amd64
  Experimental:     false
 containerd:
  Version:          1.2.10
  GitCommit:        b34a5c8af56e510852c35414db4c1f4fa6172339
 runc:
  Version:          1.0.0-rc8+dev
  GitCommit:        3e425f80a8c931f88e6d94a8c831b9d5aa481657
 docker-init:
  Version:          0.18.0
  GitCommit:        fec3683
```

This matches what I see when I log in over `ssh` to my Droplet and run `docker info`

With the environment variable:

```
export DOCKER_HOST=ssh://build@159.65.75.79:22

docker info
```

Running the command over my hotel room in from San Diego with a Droplet in San Francisco, there was noticeable lag.

Remote:

```
export DOCKER_HOST=ssh://build@159.65.75.79:22

time docker info
real	0m1.410s
```

Local:

```
export DOCKER_HOST=""

time docker info
real	0m0.117s
```

Try running a container:

```
docker run --rm -ti alpine:latest ping -c 10 google.com
```

Whenever `docker run` is executed, the daemon first checks its local library for the image. If that image has to be downloaded from the Internet, then the chances are that your service provider's Internet connection is faster than your own. That could result in much quicker times to run images.

This was all rather simple to set up and much easier than using TLS for the Docker Daemon.

### Build a container

Rather than building hello-world, let's build one of my Golang projects.

```
cd /tmp/
git clone https://github.com/inlets/inlets
cd inlets

docker build -t inlets .
```

At this point you may notice some significant latency because the inlets folder is `25M` in size. Docker must first create a tarball of the contents of the folder, then copy it over the ssh connection to the remote machine to run the build. Since `ssh` is also encrypted (which we need), this will take a significant amount of time.

We may also notice that the `go build` step takes much longer on our cheap, shared VPS than it did on our quad-core 2-3k USD MacBook.

To compare the two I did a build to warm everything up and to ensure the remote machine had the base-layers available. Then I altered the `main.go` file and timed another build.

* Remote droplet - `real 2m17.292s`
* MacBook dual-core - `real 0m42.703s` (Docker for Mac - 2CPU / 8GB RAM)

Despite a slower CPU on the remote machine, the majority of our time was actually spent sending the 25MB tarball up to the remote machine over ssh. This entire build context was sent for every minor change I made.

## What did I learn?

My hypothesis was that using `docker build` over `ssh` may save battery life, and that was clearly the case. If you don't believe me, then run Docker for Mac for a few hours. I did have an unconcious assumption that the latency for the remote build would match or be close to my local one and that was not the case. Not only is there a significant penalty to uploading the build context, it doesn't appear to be uploaded in a differential or incremetnal way, so this hit is taken on every build. To get an equivalent remote CPU means paying a significant amount of money per month, even with a cheaper VPS provider like DigitalOcean.

What about BuildKit? Well it can build / pull layers in parallel and perform caching, but unfortunately it didn't help due to the context still needing to be uploaded. The total time was 2m10s and I wonder if this is something that can be optimized for in the future?

On the plus-side, the remote machine was able to download a pre-built image from the Docker Hub and execute it faster than I could with my hotel WiFi connection.

I do believe that Docker may be useful for remote builds, for some people if the latency is low and the payload (files uploaded to docker) is relatively small. Perhaps the real advantage here is that Docker created a simple and secure way to remotely manage a single Docker host using `ssh`.
 
Try it out and let me know what you think.

* Twitter - [@alexellisuk](https://twitter.com/alexellisuk)
* GitHub - [github.com/alexellis](https://github.com/alexellis)