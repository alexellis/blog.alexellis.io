---
title: "A quick look at Google's Kaniko project"
slug: "quick-look-at-google-kaniko"
date: "2018-07-19T08:00:00Z"
author: "Alex Ellis"
meta_title: "A quick look at Google's Kaniko project"
meta_description: "Learn about Kaniko which builds container images without a privileged security context. See an example of building functions for OpenFaaS on Kubernetes"
feature_image: "/content/images/2018/07/architecture-blur-build-159358-3.jpg"
tags:
  - "kaniko"
  - "docker"
  - "containers"
---

In this post I'll take a quick look at Google's [Kaniko](https://github.com/GoogleContainerTools/kaniko) project which is designed to make container building easier on Kubernetes. A key difference to `docker run` is not needing a privileged security context. I'll also show you how to use Kaniko to build your [OpenFaaS](https://github.com/openfaas/faas) Functions.

![](https://github.com/GoogleContainerTools/kaniko/raw/master/logo/Kaniko-Logo.png)

From the project README on GitHub:

> kaniko is a tool to build container images from a Dockerfile, inside a container or Kubernetes cluster.

> kaniko doesn't depend on a Docker daemon and executes each command within a Dockerfile completely in userspace. This enables building container images in environments that can't easily or securely run a Docker daemon, such as a standard Kubernetes cluster.

## Background

There are several notable projects mentioned on the README file which aim to offer an alternative to `docker build` for creating Docker images in an OCI-compatible format. Top mentions go to [img](https://github.com/genuinetools/img) from [Jessie Frazelle](https://twitter.com/jessfraz), [buildah](https://github.com/projectatomic/buildah) from RedHat and [umoci](https://github.com/openSUSE/umoci) from SuSE. One of the projects I've had the most experience with is [Moby's BuildKit project from Docker Inc](https://github.com/moby/buildkit). It is conspicuous by its absence and deserves a mention.

BuildKit according to the README:

> concurrent, cache-efficient, and Dockerfile-agnostic builder toolkit 

Compared with `docker build`, BuildKit is a much more efficient tool - it creates a graph of the build then resolves it quickly giving you an OCI-compatible Docker image or tarball. A couple of the things that make BuildKit so fast are the built-in caching mechanism and the ability to seek-ahead and run some tasks in parallel - rather than running them in a serial order.

[OpenFaaS Cloud](https://docs.openfaas.com/openfaas-cloud/intro/) makes use of BuildKit, which when run alongside a local Docker registry, typically sees an OpenFaaS function built and pushed within a matter of seconds. OpenFaaS Cloud aims to enable a "git push", "get functions" experience. A [GitOps](https://www.weave.works/blog/gitops-operations-by-pull-request) workflow is used to build your functions from source via GitHub and deploy them into Kubernetes.

Browse the code or read more about [OpenFaaS Cloud](https://docs.openfaas.com/openfaas-cloud/intro/).

## Root vs non-root

One of the topics that comes up frequently is how to build untrusted code on a build-machine or within Kubernetes cluster. We should all know by now that Docker images aren't meant to be run as root - Liz Rice keynoted at KubeCon about this giving the analogy of [running with scissors](https://www.youtube.com/watch?v=ltrV-Qmh3oY).

<iframe width="560" height="315" src="https://www.youtube.com/embed/ltrV-Qmh3oY" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

So if containers shouldn't run as root, should our container builders follow that rule? It turns out that Kaniko does actually run as root (uid=0). We can see that by running the debug container and looking at the command prompt:

```
docker run -it --entrypoint=/busybox/sh gcr.io/kaniko-project/executor:debug
/ # id
uid=0 gid=0
```

> The UID of `0` has a special role: it is always the root account (i.e., the omnipotent administrative user). Although the user name can be changed on this account and additional accounts can be created with the same UID, neither action is wise from a security point of view.

*From the [Linux Information Project](http://www.linfo.org/uid.html)*

BuildKit can run as a non-root user, but it's not as simple as that. While Kaniko needs to run as root it can run as an unprivileged container. This is a good thing because privileged containers can take over the host. [BuildKit can run as a non-root user](https://github.com/moby/buildkit#running-buildkit-without-root-privileges), but cannot yet run without having a privileged security context.

Confusing? I think so.

[Akhiro Suda](https://github.com/AkihiroSuda) one of BuildKit's maintainers and OpenFaaS Cloud contributor told me that the wider community [including Jess](https://github.com/genuinetools/img) are working on a solution to run builds both as non-root and without privileges (this will involve [unprivileged mounting](https://github.com/genuinetools/img#unprivileged-mounting)). For the time being let's take a look at Kaniko in action with OpenFaaS.

See also: [Jess' take on Kaniko's security model](https://twitter.com/jessfraz/status/985947353981976576).

## Let's build something

Rather than your regular hello-world container, let's make it slightly more interesting and see if we can build an OpenFaaS Function. All OpenFaaS Functions are built out into Docker images eventually, so it should be possible.

### Use-case: OpenFaaS Go Function

You won't need to install OpenFaaS for this, but we will need the CLI and Docker running on our machine. A Docker Hub account is also needed.

Run either `brew install faas-cli` or the below:

```
curl -SLs cli.openfaas.com | sudo sh
```

#### Generate a Go function

```
mkdir -p tutorial 
cd tutorial

faas-cli new --lang go hello-world
```

You'll now see a handler.go file:

```
package function

import (
	"fmt"
)

// Handle a serverless request
func Handle(req []byte) string {
	return fmt.Sprintf("I was built with Kaniko!")
}
```

#### Build the function - part 1

Normally to build an OpenFaaS function we either use BuildKit within OpenFaaS Cloud and handle this through a CI/CD pipeline or run the `faas-cli build` command. The `faas-cli build` command does two things - combines your handler with a best-practice non-root Golang build-template and runs `docker build`.

To use Kaniko we'll suppress the second part and only do the templating by using the `--shrinkwrap` option:

```
faas-cli build -f hello-world.yml --shrinkwrap

[0] > Building hello-world.
Clearing temporary build folder: ./build/hello-world/
Preparing ./hello-world/ ./build/hello-world/function
Building: hello-world with go template. Please wait..
hello-world shrink-wrapped to ./build/hello-world/
[0] < Building hello-world done.
[0] worker done.
```

The build folder contains everything we need for a build context:

```
build/hello-world
build/hello-world/Dockerfile
build/hello-world/function
build/hello-world/function/handler.go
build/hello-world/main.go
build/hello-world/template.yml
```

#### Build the function - part 2

So now let's run a build with Kaniko.

We need to provide a `config.json` file containing our Docker Hub credentials. This normally exists at `~/.docker/config.json` and if you're using a Mac then Docker may be storing your credentials in the keychain. Using the keychain is a good thing, but Kaniko can't work with that so let's temporarily convert the `config.json` to a machine-readable format.

Edit the `config.json` file and set `credStore` to `"credStore": ""`, then run `docker login` again. Now you should have a file with a section like this:

```
"auths": {
		"https://index.docker.io/v1/": {
			"auth": "bmF1Z2h0eQo="
		}
	}
```

*Don't worry, these are _not_ my credentials.*

We are now ready to do the build. Kaniko does not run as a daemon, so the only way to get our build context to it is to either use a bind-mount or a remote AWS S3 or GCP bucket. I hope to see new options added in the future such as Minio or GitHub via HTTPS/SSH ([see GitHub issue](https://github.com/GoogleContainerTools/kaniko/issues/121)).

Run this from within the folder that contains `hello-world.yml` and the `build` folder:

```
$ docker run -v $PWD/build/hello-world:/workspace \
 -v ~/.docker/config.json:/kaniko/config.json \
 --env DOCKER_CONFIG=/kaniko \
 gcr.io/kaniko-project/executor:latest \
 -d alexellis2/hello-world:kaniko
```

* The flag `d` specifies where the image should be pushed after a successful build.
* The `-v` flag is bind-mounting the current directory into the Kaniko container, it also adds your config.json file for pushing to a remote registry

The build takes a few seconds to complete. You will now see some build output like this:

```
time="2018-07-18T19:55:12Z" level=info msg="Unpacking filesystem of golang:1.9.7-alpine3.7..."
time="2018-07-18T19:55:13Z" level=info msg="Mounted directories: [/kaniko /var/run /proc /dev /dev/pts /sys /sys/fs/cgroup /sys/fs/cgroup/cpuset /sys/fs/cgroup/cpu /sys/fs/cgroup/cpuacct /sys/fs/cgroup/blkio /sys/fs/cgroup/memory /sys/fs/cgroup/devices /sys/fs/cgroup/freezer /sys/fs/cgroup/net_cls /sys/fs/cgroup/perf_event /sys/fs/cgroup/net_prio /sys/fs/cgroup/hugetlb /sys/fs/cgroup/pids /sys/fs/cgroup/systemd /dev/mqueue /workspace /kaniko/config.json /etc/resolv.conf /etc/hostname /etc/hosts /dev/shm /proc/bus /proc/fs /proc/irq /proc/sys /proc/sysrq-trigger /proc/kcore /proc/keys /proc/timer_list /proc/sched_debug /sys/firmware]"
time="2018-07-18T19:55:13Z" level=info msg="Unpacking layer: 6"
time="2018-07-18T19:55:13Z" level=info msg="Unpacking layer: 5"
time="2018-07-18T19:55:14Z" level=info msg="Unpacking layer: 4"
...
...
2018/07/18 19:55:42 pushed blob sha256:aa2f4f06e7d20d74d26f08fbdb20e437b59607683da40af0b647f827ccb25979
2018/07/18 19:55:44 pushed blob sha256:9fdeecc25b6bec4d90f9df93d631becaa15b5476c4f0688b81457d27bcb8c778
2018/07/18 19:55:44 pushed blob sha256:406ec48b094e67afd910c1ec98eff278d8ed8289a8f327734ba95c5e45c237c4
index.docker.io/alexellis2/hello-world:kaniko: digest: sha256:fe16074938b4d7da2205a7816af15c629cde4b650d396e87faf666ba087b4a3e size: 1239
```

And at the end we can see that our OpenFaaS Go Function was pushed to the [Docker Hub](https://hub.docker.com/r/alexellis2/hello-world/tags/). If you have OpenFaaS available you can now deploy the function.

```
$ faas-cli deploy --image=index.docker.io/alexellis2/hello-world:kaniko --name=hello-world
```

Now invoke the function and check the metrics (from Prometheus) showing the invocation count increasing.

```
$ echo -n | faas-cli invoke hello-world
I was built with Kaniko!

$ faas-cli list -v
Function                      	Image                                   	Invocations    	Replicas
hello-world            	alexellis2/hello-world:kaniko           	4              	1    
```

See also: Check out [my tutorial on building Golang Functions with OpenFaaS](https://blog.alexellis.io/serverless-golang-with-openfaas/) including how to vendor third-party dependencies.

### Checking out the options

There is a debug image available from Google which contains BusyBox too. This can be used to check out the various options for the tool.

```
$ docker run --entrypoint=/busybox/sh -ti gcr.io/kaniko-project/executor:debug

/ # /kaniko/executor 
Error: please provide a valid path to a Dockerfile within the build context
Usage:
  executor [flags]

Flags:
  -b, --bucket string              Name of the GCS bucket from which to access build context as tarball.
      --build-arg build-arg type   This flag allows you to pass in ARG values at build time. Set it repeatedly for multiple values.
  -c, --context string             Path to the dockerfile build context. (default "/workspace/")
  -d, --destination string         Registry the final image should be pushed to (ex: gcr.io/test/example:latest)
  -f, --dockerfile string          Path to the dockerfile to be built. (default "Dockerfile")
      --force                      Force building outside of a container
  -h, --help                       help for executor
      --insecure-skip-tls-verify   Push to insecure registry ignoring TLS verify
      --snapshotMode string        Set this flag to change the file attributes inspected during snapshotting (default "full")
      --tarPath string             Path to save the image in as a tarball instead of pushing
  -v, --verbosity string           Log level (debug, info, warn, error, fatal, panic (default "info")

please provide a valid path to a Dockerfile within the build context
```

It looks like the `--tarPath` flag could also be useful if you want to "push" the image separately from building it. This is also a feature available with BuildKit.

### Bonus: automating it with a Kubernetes job

I want to show you how to automate the creation of the Docker image for OpenFaaS using a Kubernetes Job. The Job will make use of the Kaniko container and two init containers to fetch the code from Git and pre-process it.

First create a Kubernetes secret with your Docker config: 

```
# kubectl create secret generic docker-config --from-file $HOME/.docker/config.json
```

Now clone the Gist, change the destination username under the `args` flag from `alexellis2` to your Docker Hub username.

Then apply the job with `kubectl apply -f job`.

What happens?

Three containers run to build the function:

* First init container does a `git clone` into a shared `emptyDir` volume
* Second init container does the shrink-wrap using the contents of the volume
* The third container is the Kaniko container which has the shrink-wrapped function in its build context and the Kubernetes secret mounted for pushing to the Docker Hub. It runs the build and pushes the image.

```
$ kubectl logs job/build-job
...
index.docker.io/alexellis2/hello-world-auto:kaniko: digest: sha256:d6c8809dc65a2b6627427f7d206c04a045683516b68a7ead1d67d47a1f483a50 size: 1239
```

Get the full gist here:

https://gist.github.com/alexellis/87d732a4b5fe056f5bf903aa6e6437ed

How could we take this further? The final part of the build could involve the Docker registry firing a web-hook into OpenFaaS and from there we could deploy the function in a rolling update.

## Wrapping up

I feel like there is some work to be done to make Kaniko more useful for a broader set of use-cases, but it's great to see it in action and it worked as described for us here - building without a privileged security context.

Having to push our build context to AWS S3, GCS or needing a bind-mount feels clunky and I hope to see some other options coming up soon such as the ability to clone from a Git repository over HTTPS or SSH. Our serverless Golang function built within 10-15 seconds, but something more complex could take a lot longer and I was unsure whether Kaniko supports or may support caching. They provide a debug container and while I was able to enter a busybox shell to invoke a build, the container was stuck in an inconsistent state after the build. It looks like the Kaniko builder is currently built for one-shot usage.

Akihiro raised [an issue](https://github.com/GoogleContainerTools/kaniko/issues/106) with the Kaniko team about security and isolation, but their response was very useful.

[dlorenc](https://github.com/dlorenc) said:

> I wouldn't suggest using kaniko (or anything else available today) on untrusted builds without wrapping it inside another security boundary, like kata containers or gvisor.

> The main goal for now is to support trusted builds inside any standard cluster without requiring extra configuration (AllowPrivileged, etc.).

This is clearly a hard problem and it's not clear yet whether container-level isolation is enough to safely build untrusted code within your cluster. My advice would echo the comments above, if it's possible then use some other kind of additional isolation. Running without privileges is a welcome step forward and you could start using Kaniko within your existing CI/CD pipelines with Jenkins, GitLab or Travis.

Are you using Kaniko, BuildKit or another container builder? Let's connect on Twitter below. 

### Hire me for Cloud Native / Docker / Go / CI & CD or Kubernetes

Could you use some help with a difficult problem, an external view on a new idea or project? Perhaps you would like to build a technology proof of concept before investing more? Get in touch via [sales@openfaas.com](mailto:sales@openfaas.com) or book a session with me on [calendly.com/alexellis](https://calendly.com/alexellis/).

### Follow & share

Follow me on Twitter [@alexellisuk](https://twitter.com/alexellisuk) or show your support and add your **Star** to the [OpenFaaS project](https://github.com/openfaas/faas)

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">&quot;A quick look at Google&#39;s Kaniko project&quot; <a href="https://t.co/PxVEyHFJCG">https://t.co/PxVEyHFJCG</a> <a href="https://twitter.com/hashtag/docker?src=hash&amp;ref_src=twsrc%5Etfw">#docker</a> <a href="https://twitter.com/hashtag/containerbuilder?src=hash&amp;ref_src=twsrc%5Etfw">#containerbuilder</a> <a href="https://twitter.com/hashtag/nonroot?src=hash&amp;ref_src=twsrc%5Etfw">#nonroot</a> with <a href="https://twitter.com/lizrice?ref_src=twsrc%5Etfw">@lizrice</a> <a href="https://twitter.com/viveksyngh?ref_src=twsrc%5Etfw">@viveksyngh</a> <a href="https://twitter.com/chanezon?ref_src=twsrc%5Etfw">@chanezon</a> <a href="https://twitter.com/sebgoa?ref_src=twsrc%5Etfw">@sebgoa</a> <a href="https://twitter.com/_AkihiroSuda_?ref_src=twsrc%5Etfw">@_AkihiroSuda_</a></p>&mdash; Alex Ellis (@alexellisuk) <a href="https://twitter.com/alexellisuk/status/1019855195113652224?ref_src=twsrc%5Etfw">July 19, 2018</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> 

### See also:

I've collected some additional reading on the topic - some of these links were sent over on Twitter.

[Containerd, BuikdKit and a reflection about the enduring value of the Docker Engine](https://blog.docker.com/2018/06/containerd-buildkit-and-value-of-dockerengine/) by [Patrick Chanzeon](https://twitter.com/chanezon?lang=en)

[Unprivileged Docker Builds – A Proof of Concept](https://zwischenzugs.com/2018/04/23/unprivileged-docker-builds-a-proof-of-concept/) by [Ian Miell](https://twitter.com/ianmiell)

[Building Docker images with Kaniko](https://medium.com/@sebgoa/building-docker-images-with-kaniko-6e2421b018) by [Sebastien Goasguen](https://twitter.com/sebgoa?lang=en)

Acknowledgements: [Richard Gee](https://twitter.com/rgee0) & [Vivek Singh](http://github.com/viveksyngh/) for reviewing and collaborating on the post.