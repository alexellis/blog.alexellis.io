---
title: "How to use multiple Docker registry mirrors"
slug: "how-to-configure-multiple-docker-registry-mirrors"
date: "2023-06-08T13:27:06Z"
author: "Alex Ellis"
meta_title: "How to use multiple Docker registry mirrors"
meta_description: "Why would you need to use a mirror for a container registry? And is there a way to use two or more? Find out from the actuated team."
tags:
  - "docker"
  - "kubernetes"
  - "buildx"
  - "registries"
---

One of the first things we ran into when building self-hosted GitHub Actions runners with Firecracker ([actuated.dev](https://actuated.dev)) was the rate limits for the Docker Hub.

We'd had a busy day updating the base image in a number of Dockerfiles due to a CVE found in Alpine Linux, and that triggered enough layers to be pulled for the [Docker Hub to hit its anonymous image pull rate-limit](https://docs.docker.com/docker-hub/download-rate-limit/). 

Why don't you see this on hosted CI?

GitHub has an agreement with Docker, whereby hosted runners can pull either an unlimited amount or such a large amount of images from the Docker Hub, that limits are not going to be met by any one user.

Through a debug session with actuated, I was surprised to see that GitHub have a credential in plain text on every runner.

![Viewing sessions via the actuated dashboard](/content/images/2023/05/sessions--1-.png)
> Viewing sessions via the actuated dashboard for hosted and self-hosted runners.

If you'd like to debug a GitHub Action with SSH, [check out my video](https://www.youtube.com/watch?v=l9VuQZ4a5pc). Reach out to me on [Twitter](https://twitter.com/alexellisuk/) if you'd like to try it out.

![The Docker Hub token pre-installed for GitHub Actions](/content/images/2023/05/Screenshot-from-2023-05-19-11-25-14--1-.png)

> The Docker Hub token pre-installed for GitHub Actions

I suspect that you could even copy this to your own machine and use it for unlimited pulls (although I'd not advise actually doing that).

The anonymous pull limit can be a thorny problem, especially when using tools like Flux or Terraform to create and re-create machines which may the same - stable IP address.

So that's where running a Docker registry and enabling its pull-through cache mode can really help.

Not only do you minimise just about all network latency when layers are already in the cache, but you defer or avoid the rate limits completely.

## A single registry

We have detailed instructions on setting up a single registry using the open source distribution. It's been fine-tuned and works well on about two dozen or more servers.

[Example: Set up a registry mirror](https://docs.actuated.dev/tasks/registry-mirror/)

Once the registry is running and either exposed on the local network with HTTP or via the Internet with HTTPS, you'll need to configure Docker and potentially buildx too.

You can see how we do this within a Firecracker VM, to access the registry over the local Ethernet bridge: [https://github.com/self-actuated/hub-mirror/blob/master/action.yml](https://github.com/self-actuated/hub-mirror/blob/master/action.yml)

For the Docker daemon, edit `/etc/docker/daemon.json`.

```json
{
  "insecure-registries" : ["192.168.128.1:5000" ],
  "registry-mirrors": ["http://192.168.128.1:5000"]
}
```

* Give each mirror under `registry-mirrors` and include the URL scheme
* If you're using HTTP, without TLS, you need to specify `insecure-registries`

Then make sure you reload Docker:

```
(
sudo systemctl daemon-reload && \
sudo systemctl restart docker
)
```

To try it out, run `docker run -ti alpine:latest`, you should see the images when you run `sudo find /var/lib/registry/`

Buildx is a little more complicated to configure.

Create a buildkit.toml

```toml
[registry."docker.io"]
  mirrors = ["192.168.128.1:5000"]
  http = true
  insecure = true

[registry."192.168.128.1:5000"]
  http = true
  insecure = true
```

You can omit `http` and `insecure` if you're using TLS and HTTPS.

Then, create a new buildx builder and tell Docker to use it:

```
docker buildx create --config ~/buildkitd.toml --name mirrored
docker buildx use mirrored
```

Finally, the buildx command will reference buildkit's configuration instead of Docker's and any base images will be pulled through the mirror.

```
docker buildx build -f Dockerfile .
```

We have a custom GitHub Action that makes all of the above just one line:

```yaml
jobs:
    build:
        runs-on: actuated
        steps:

        - uses: self-actuated/hub-mirror@master

        - name: Pull image using cache
            run: |
            docker pull alpine:latest
```

Find out more here: [Set up a registry mirror](https://docs.actuated.dev/tasks/registry-mirror/)

### TLS is better

We used HTTP for the registry as it's accessed over a kind of loopback device between the VM and the server, however I'd recommend always using TLS where you can.

Perhaps you could even setup your registry on the Internet and use free Let's Encrypt certificates. [Caddy](https://caddyserver.com) or Nginx are simple enough to configure for that.

Then, if you're worried about bandwidth charges - Linode, DigitalOcean and Hetzner all have generous amounts included with 5-10 USD / mo VMs.

And you could also set up an IP allow list, so only your servers or build machines can consume your bandwidth allowance.

## Setting up multiple mirrors

You may want multiple mirrors if you pull images from both docker.io and another registry like gcr.io, ecr.io, ghcr.io or quay.io.

The Docker documentation says that `dockerd` itself can only support a mirror of the Docker Hub itself. And any information that I found about multiple mirrors only applied to Kubernetes or to buildx.

Each registry mirror needs to run on its own HTTP port and if you're using TLS, will require its own distinct TLS certificate.

For instance, here are the things to change for a second registry mirroring ghcr.io:

```diff
storage:
  filesystem:
-    rootdirectory: /var/lib/registry
+    rootdirectory: /var/lib/registry-ghcr

proxy:
-  remoteurl: https://registry-1.docker.io
+  remoteurl: https://ghcr.io
-  username: $USERNAME

http:
-  addr: 192.168.128.1:5000
+  addr: 192.168.128.1:5001
```

So then, buildx or cri (when using Kubernetes) need to be configured to pull from either of these endpoints.

* `192.168.128.1:5000` mirrors docker.io
* `192.168.128.1:5001` mirrors ghcr.io

dockerd itself, can have two mirrors defined, but in my experience it was unable to pull from the mirror for ghcr.io.

So let's look at buildx:

```toml
[registry."docker.io"]
  mirrors = ["192.168.128.1:5000"]
  http = true
  insecure = true

[registry."192.168.128.1:5000"]
  http = true
  insecure = true
  
[registry."ghcr.io"]
  mirrors = ["192.168.128.1:5001"]
  http = true
  insecure = true

[registry."192.168.128.1:5001"]
  http = true
  insecure = true
```

There's two ways to know if the cache is being used:

1. Check the filesystem for the path set under `rootdirectory`
2. Enable the access logs for the registry itself

To enable access logs change

```diff
log:
  accesslog:
-    disabled: true
+    disabled: false   
-  level: warn
+  level: debug
  formatter: text
```

In my testing, after running `buildx create` and `buildx use`, I then needed a Dockerfile that used both the Docker Hub and GHCR:

```Dockerfile
FROM alpine:3.17 as alpine
FROM ghcr.io/openfaasltd/figlet as figlet

RUN echo -n "Mirror" | figlet
```

Running the build with `docker buildx build -t mirror-test .` gave me access logs on both registries and files under the respective `/var/lib/` folders.

For Kubernetes configuration, you need to update the CRI plugin in containerd's toml file: [Configure Image Registry](https://github.com/containerd/containerd/blob/main/docs/cri/registry.md).

Beware that CRI is an abstraction layer that sits between containerd and the kubelet, configuring this will not affect buildx, containerd or dockerd.

## Wrapping up

I hope what I've shared here will help you. It's certainly not the only way to go about things.

It seemed like nobody really knew whether it was possible to have Docker or buildx use multiple mirrors. There were fragments of information out there - and helpful, but confused people telling me that they had this working for Docker, when really they meant or Kubernetes.

If you're only using caching because of rate-limits, you can also authenticate to the Docker Hub prior to pulling images. This is similar to using a cache, but will still exhaust the rate-limit if you build a lot. I also have concerns about doing this within a public or open source repository - it would be trivial for anyone to obtain your organisation's token for the Docker Hub. We saw how easy that was with hosted runners in the introduction.

To sum up: the Docker daemon does not currently support multiple registry mirrors, but buildx and buildkit will do when properly configured.

So why do we need different ports? The Docker CLI/client doesn't send a server name when it requests an image.

Another solution I found consists of reams of bash scripts, an intercepting  (mitm) HTTPS proxy and custom CAs.. if you have the appetite for that, you can find it here: [plmshift/docker-registry-proxy](https://plmlab.math.cnrs.fr/plmshift/docker-registry-proxy/-/tree/master)

Going forward, we may add support for a custom CA on actuated servers which means you can quickly and easily get TLS certs for things like Docker registries, S3 mirrors, Npm caches and such, and then have that root of trust automatically rotated and injected into individual VMs.

Do you have any comments, questions or suggestions? Hit me up on Twitter - [@alexellisuk](https://twitter.com/alexellisuk)

You may also like:

* [How to split up multi-arch Docker builds to run natively](https://actuated.dev/blog/how-to-run-multi-arch-builds-natively)
* [Fixing the cache latency for self-hosted GitHub Actions](https://actuated.dev/blog/faster-self-hosted-cache)
* [Blazing fast CI with MicroVMs](https://blog.alexellis.io/blazing-fast-ci-with-microvms/)