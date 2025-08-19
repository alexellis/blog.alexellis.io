---
title: "One last trip down memory lane with the Raspberry Pi Zero"
slug: "memory-lane-raspberry-pi-zero"
date: "2020-12-04T17:08:40Z"
author: "Alex Ellis"
meta_title: "One last trip down memory lane with the Raspberry Pi Zero"
meta_description: "The Raspberry Pi Zero is five years old, has limited RAM, a slow CPU, and poor I/O, but can it still handle Cloud Native workloads like containers?"
feature_image: "/content/images/2020/12/raspberry.jpg"
---

The [Raspberry Pi Zero](https://www.raspberrypi.org/products/raspberry-pi-zero/?resellerType=home) and original Raspberry Pi both have a 32-bit ARM architecture which many projects have dropped support for. So when I saw that [containerd recently merged a fix](https://github.com/containerd/containerd/pull/4530) for building containerd on armv6, started to think what I could do with it.

Earlier that month, a user of the [faasd project](http://github.com/openfaas/faasd) which runs very well on VPSes, RPi 3 and RPi4 asked me whether it could work on the Zero and I told him it was not practical or worth his time. After all, an RPi4 with 2GB of RAM, 4 Cores and much faster I/O is only 25GBP/EUR/USD.

> [faasd is OpenFaaS](https://github.com/openfaas/faasd), but for a single node, and designed for those who don't want to pay for and manage an entire Kubernetes cluster, GitOps, service-mesh, and IngressController just to deploy a few simple functions.

My past experiences told me that it would be a challenge to get the zero working. It has such a paltry amount of memory available and its I/O is really slow. Still, sometimes it's fun to do things that we shouldn't. Had I been ["nerd sniped"](https://xkcd.com/356/)?

<img src="https://www.raspberrypi.org/homepage-9df4b/static/1dfa03d09c1f3e446e8d936dfb92267f/8924f/6b0defdbbf40792b64159ab8169d97162c380b2c_raspberry-pi-zero-1-1755x1080.jpg" width="60%">
> The RPi Zero originally released in 2015.

In this post I'll show you what you need to do to deploy functions through the [OpenFaaS CLI](https://github.com/openfaas/faas-cli) and be able to invoke them, including multi-arch builds. At the end of the post I'll explain what the limitations are and whether we should leave the Raspberry Pi Zero with those fond memories we have of it when it was [released in 2015](https://en.wikipedia.org/wiki/Raspberry_Pi), 5 years ago.

## Walk-through

### Pre-reqs

You will need:
* Raspberry Pi Zero
* Ethernet adapter and USB <> USB A micro shim
* 16-32GB class 10 SD card
* MicroUSB power adapter

Flash the latest version of Raspberry Pi OS Lite to your SD card, and then create an `ssh` file in the `/boot/` folder.

Power up the Raspberry Pi and ssh to it with `ssh pi@raspberrypi.local`.

### Install go

You can install Go from a package manager, but the version is likely to be rather old. Fortunately the Go team still ship a binary for armv6:

```bash
export ARCH="armv6l"
echo "Downloading Go"

curl -SLsf https://dl.google.com/go/go1.13.15.linux-$ARCH.tar.gz --output /tmp/go.tgz
sudo rm -rf /usr/local/go/
sudo mkdir -p /usr/local/go/
sudo tar -xvf /tmp/go.tgz -C /usr/local/go/ --strip-components=1

export GOPATH=$HOME/go/
export PATH=$PATH:/usr/local/go/bin/
```

You now have Go installed, run `go version` to see it working.

### Build containerd

faasd uses containerd rather than Docker, but there are no official binaries for any of the ARM CPUs, so we have to build them from source.

For armv7 and ARM64, you can use my repo [alexellis/containerd-arm](https://github.com/alexellis/containerd-arm). It's my hope to see ARM support upstreamed, but having spoken on several occasions to the containerd team, it seems very unlikely that we will see this happen.

On my first attempt of building I got the following error:

```
+ bin/containerd
# github.com/containerd/containerd/cmd/containerd
/usr/local/go/pkg/tool/linux_arm/link: running gcc failed: fork/exec /usr/bin/gcc: cannot allocate memory
make: *** [Makefile:188: bin/containerd] Error 2
```

The RPi Zero and the largest RPi 1 only has 512MB of RAM and I slowly watched the RAM being eaten up with `watch -n "free -h"`.. I should have remembered this.

Fortunately I had the battle scars and knew what I had to do:

```bash
sudo dd if=/dev/zero of=/swapfile bs=1024 count=1M &&\
  sudo mkswap /swapfile && \
  sudo swapon /swapfile
```

This creates 1GB of swap, on the SD card.. which already has terrible I/O, but it may just work.

The other trick you may have seen me talk about is adding `gpu_mem=16` to `/boot/config.txt`. It seems pointless changing the split on an 8GB RPi4, but for our RPi Zero, we need every MB we can get.

Second time lucky?

No. It failed again due to some missing libraries. I reminded myself to read [BUILDING.md](https://github.com/containerd/containerd/blob/master/BUILDING.md#build-containerd) from the containerd repo. After adding libseccomp and a few other packages, it started to move along again.

```bash
make
+ bin/ctr
+ bin/containerd
+ bin/containerd-stress
+ bin/containerd-shim
+ bin/containerd-shim-runc-v1
+ bin/containerd-shim-runc-v2
+ binaries
```

I don't know if it was 10 minutes or over an hour, but it was slow progress.

I then ran `sudo make install` and copied the systemd unit file into place with:

```bash
sudo cp containerd.service /etc/systemd/system/containerd.service
sudo systemctl enable containerd
```

I didn't want to start containerd at this time, to save on memory for the next task.

### Build faasd

The faasd Makefile needed a patch because it was set to cross-compile to armv7, but we needed armv6.

```
.PHONY: dist
dist:
	CGO_ENABLED=0 GOOS=linux GOARCH=arm GOARM=6 go build -mod=vendor -ldflags $(LDFLAGS) -a -installsuffix cgo -o bin/faasd-armhf
```

This took so long to build on the zero that I gave up and built it on my Intel NUC. Fortunately Go is very good as cross-compiling, especially when linking into C/C++ libraries is disabled with `CGO_ENABLED=0`.

I then ran `scp` to copy the binary to the Raspberry Pi.

```
sudo cp faasd-armhf /usr/local/bin/faasd
cd go/src/github.com/openfaas/faasd
```

The final step was to install faasd which creates two systemd unit files:

* faasd - for the OpenFaaS core services
* faasd-provider - for the provider that supports CRUD and Invoke operations

```
sudo faasd install
```

![faasd-install](/content/images/2020/12/faasd-install.jpg)

### Unexpected issues

I tried to log in with `faas-cli login`, but it didn't work. I saw a number of errors in the logs `sudo systemctl journalctl -u faasd`:

```
Dec 03 23:18:49 zero-dns default:basic-auth-plugin[13218]: standard_init_linux.go:207: exec user process caused "exec format error"
Dec 03 23:18:50 zero-dns containerd[12169]: time="2020-12-03T23:18:50.338589900Z" level=info msg="starting signal loop" namespace=default path=/run/containerd/io.containerd.runtime.v2.task/default/gateway pid=13324
Dec 03 23:18:52 zero-dns default:gateway[13335]: standard_init_linux.go:207: exec user process caused "exec format error"
```

It turned out that out of nats, prometheus, and the openfaas gateway, the openfaas basic-auth plugin only nats was available for armv6. It seems that projects really have moved on and left armv6 behind.

### Then I had an idea

What if we didn't run the whole OpenFaaS stack at all, but just the `faasd-provider`? It would allow this tiny device to support all the CRUD operations on functions, and invocations, but nothing more.

The provider seemed to be running well, and responding to `faas-cli` commands:

![provider](/content/images/2020/12/provider.png)

We'd lose the queue and async invocations, lose the UI, lose the metrics, but we could still deploy functions and invoke them.

It was already very late by this point so I decided to sleep on it.

### In the morning

I powered up the RPi zero and tried deploying a container directly to the faasd endpoint, and it worked.

![deploy](/content/images/2020/12/deploy.jpg)

Now, I had to make a few changes. Rather than building with the OpenFaaS watchdog in the container, I just used a Dockerfile and a plain Go HTTP server.

Here's what I ended up with:

Dockerfile

```Dockerfile
FROM --platform=${BUILDPLATFORM:-linux/amd64} golang:1.13-alpine3.11 as build
ARG TARGETPLATFORM
ARG BUILDPLATFORM
ARG TARGETOS
ARG TARGETARCH
RUN apk --no-cache add git

ENV CGO_ENABLED=0

RUN mkdir -p /go/src/handler
WORKDIR /go/src/handler
COPY . .

# Run a gofmt and exclude all vendored code.
RUN test -z "$(gofmt -l $(find . -type f -name '*.go' -not -path "./vendor/*" -not -path "./function/vendor/*"))" || { echo "Run \"gofmt -s -w\" on your Golang code"; exit 1; }

ARG GO111MODULE="off"
ARG GOPROXY=""

RUN CGO_ENABLED=${CGO_ENABLED} GOOS=${TARGETOS} GOARCH=${TARGETARCH} \
    go build --ldflags "-s -w" -a -installsuffix cgo -o handler .
RUN GOOS=${TARGETOS} GOARCH=${TARGETARCH} go test ./... -cover

FROM --platform=${TARGETPLATFORM:-linux/amd64} alpine:3.12
# Add non root user and certs
RUN apk --no-cache add ca-certificates \
    && addgroup -S app && adduser -S -g app app \
    && mkdir -p /home/app \
    && chown app /home/app

WORKDIR /home/app

COPY --from=build /go/src/handler/handler    .

RUN chown -R app /home/app

USER app

CMD ["./handler"]
```

handler.go

```Golang
package main

import (
	"fmt"
	"net/http"
)

func main() {
	s := &http.Server{
		Addr:           fmt.Sprintf(":%d", 8080),
		MaxHeaderBytes: 1 << 20, // Max header of 1MB
	}

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Hello world"))
	})

	panic(s.ListenAndServe())
}
```

stack.yml

```yaml
version: 1.0
provider:
  name: openfaas
  gateway: http://127.0.0.1:8080
functions:
  http:
    lang: dockerfile
    handler: ./http
    image: alexellis2/http:0.1.4
    build_args:
      GO111MODULE: on
```

I ran this on my PC with the following:

```
export OPENFAAS_URL=http://192.168.0.81:8081
faas-cli publish --platform linux/arm/v6

faas-cli deploy
```

Using the PC means we can cross-compile the Go HTTP server and push a multi-arch image to the container registry. The new `faas-cli publish` command comes in handy for this and can accept a list of architectures.

The `deploy` command talks to the remote machine over REST and tells it to deploy a function. The server-side handler [deploy.go](https://github.com/openfaas/faasd/blob/master/pkg/provider/handlers/deploy.go) pulls the image into containerd and starts executing it as a container. 

### One more thing

When I say that it worked. I should clarify that I'd forgotten to deploy CNI - the networking layer required for faasd and containerd.

I saw this error by running the following:

```bash
sudo journalctl -u faasd
```

Not that long ago, [I'd documented all the steps required for a manual installation](https://github.com/openfaas/faasd/blob/master/docs/DEV.md), but somehow forgot this was needed.

```bash
export ARCH=arm
export CNI_VERSION=v0.8.5

sudo mkdir -p /opt/cni/bin
curl -sSL https://github.com/containernetworking/plugins/releases/download/${CNI_VERSION}/cni-plugins-linux-${ARCH}-${CNI_VERSION}.tgz | sudo tar -xz -C /opt/cni/bin

# Make a config folder for CNI definitions
sudo mkdir -p /etc/cni/net.d

# Make an initial loopback configuration
sudo sh -c 'cat >/etc/cni/net.d/99-loopback.conf <<-EOF
{
    "cniVersion": "0.3.1",
    "type": "loopback"
}
EOF'
```

Just changing "ARCH" to "arm" was enough to make it work. So the CNI project are still [building the plugins against armv6](https://github.com/containernetworking/plugins) for the time being.

### Final attempt

Then it was a case of simply running `faas-cli deploy` again, and finally, it actually worked.

An initial benchmark with `hey` identified that the GetFunction() code was taking around 300ms. On a PC this is so fast that it's not noticable in everyday use.

The code gets the container for the name being invoked, gets its task, reads its status, and then looks up its IP address. To improve this, I'd probably optimize the code, use a cache, or build the container status/IP information outside of the data-path.

## Wrapping up

So I now have a Raspberry Pi Zero running just the [faasd-provider](https://github.com/openfaas/faasd/tree/master/pkg/provider/handlers) code and systemd unit file.

It can create, update, delete, and list containers and their associated secrets. It can invoke functions, but not a lot more.

Earlier on Twitter a user asked me whether there was a lightweight way of being able to deploy microservices from a GitHub Action, where he was just running Docker on a single node. I think faasd, or faasd's provider could be a useful option here. It provides authentication and a REST API for deploying containers with HTTP servers inside them.

I found the experience of working on the RPi zero slow and frustrating. I can remember when they were first introduced, and I even went as far as running Docker Swarm on them.

One of the benefits of running software on vastly under-powered hardware, is that it can show bottlenecks in the code, which aren't always noticeable during everyday usage on a newer machine. To some extent, I worry about us writing code on lightning fast [Apple M1 machines](https://www.apple.com/uk/newsroom/2020/11/apple-unleashes-m1/), only to deploy it to a t1.micro and find it chokes during light usage.

<iframe width="560" height="315" src="https://www.youtube.com/embed/NzrxwsAs_Vw" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

You can see the write-up for [that project here](https://blog.alexellis.io/meet-me-at-dockercon/)

I think it's time for the container community to leave behind armv6, but I would still recommend buying an RPi Zero for something like an embedded project, or for reading values from a sensor and sending them to MQTT or InfluxDB.

I hope you found my little adventure into Raspberry Pi Zero and armv6 interesting. If you have one of your own, why don't you see if you can deploy your own microservices or functions?

If you have a Raspberry Pi 3 or 4 to hand, then you can run the fully-functioning, faster version of faasd: [faasd - lightweight Serverless for your Raspberry Pi](https://blog.alexellis.io/faasd-for-lightweight-serverless/)

### You may also like

We're celebrating the 4th OpenFaaS Birthday on 18th December, [register and join us](https://github.com/openfaas/faas/issues/1592).

Related blog posts:
* [Bring Serverless to DigitalOcean Droplets with Terraform and faasd](https://www.openfaas.com/blog/faasd-tls-terraform/)
* [Five years of Raspberry Pi Clusters](https://alexellisuk.medium.com/five-years-of-raspberry-pi-clusters-77e56e547875)
* [Add a status LED to your Raspberry Pi](https://levelup.gitconnected.com/add-a-status-led-to-your-raspberry-pi-d3718846d66b)