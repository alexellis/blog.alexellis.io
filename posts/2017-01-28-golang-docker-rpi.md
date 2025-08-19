---
title: "Golang and Docker 1.13 on your Raspberry Pi"
slug: "golang-docker-rpi"
date: "2017-01-28T19:51:51Z"
author: "Alex Ellis"
meta_title: "Golang and Docker 1.13 on your Raspberry Pi"
meta_description: "Create a Golang development environment on your Raspberry Pi with Docker 1.13 and Go. Turn your RPi into a great place to hack code and learn Docker today."
tags:
  - "golang"
  - "Raspberry PI"
  - "docker"
  - "golang basics"
---

This post is a quick for getting a Golang development environment set up on your Raspberry Pi with Docker 1.13.

Golang is a compiled language which has many advantages on the Raspberry Pi over slower interpreted languages. Since many popular projects now build their solutions in Go it opens up a wide range of cool projects to the Pi.

![Docker server](https://pbs.twimg.com/media/CwnLYZgXAAEpG6A.jpg)

### Getting Docker 1.13

Docker is a single command away: `curl -sSL https://get.docker.com | sh`. The default storage driver is overlay (shown on `docker info`). This is the output of `docker version`:

```
Client:
 Version:      1.13.0
 API version:  1.25
 Go version:   go1.7.3
 Git commit:   49bf474
 Built:        Tue Jan 17 10:28:23 2017
 OS/Arch:      linux/arm

Server:
 Version:      1.13.0
 API version:  1.25 (minimum version 1.12)
 Go version:   go1.7.3
 Git commit:   49bf474
 Built:        Tue Jan 17 10:28:23 2017
 OS/Arch:      linux/arm
 Experimental: false
``` 

**Enabling experimental mode**

If you want to turn on experimental mode then edit the `ExecStart` command in `/etc/systemd/system/docker.service.d/overlay.conf` adding `--experimental=true`. Note that this is not the usual location of your Docker systemd file, the RPi has an additional drop-in file.

The cool bit about enabling experimental mode is that you can play with bleeding edge features such as Prometheus metrics. 

> Warned - the Docker team told the Captains that experimental features are likely to have breaking changes, so don't get too attached to their interfaces.

### Getting Go

There are three ways popular to get Golang on Raspbian:

**Method 1 - Raspbian repository**

This is the simplest method but is likely to be very out of date. I installed Golang with `apt-get install golang` and it came out at a very early version: 

```
$ go version
go1.3.3 linux/arm`
```

The Go team have made great strides to improve the execution of Go on ARM devices, so you should really to keep up to date to get the most out of your experience.

**Method 2 - Get binary from Golang.org**

This is a very manual installation method, but one of the quickest and is also suitable for installing and upgrading Node.js. Both projects provide pre-built binaries.

Head over to http://golang.org/dl/ and pick `go1.7.5.linux-armv6l.tar.gz` or whatever is newer with `armv6l` in the name. This is the architecture of the original Raspberry Pi meaning it will work on all models.

```
cd
curl -sSLO https://storage.googleapis.com/golang/go1.7.5.linux-armv6l.tar.gz
sudo mkdir -p /usr/local/go
sudo tar -xvf go1.7.5.linux-armv6l.tar.gz -C /usr/local/go --strip-components=1
```

**Method 3 - Use a Docker image**

The Docker method means you don't have to install any binaries onto your system directly. In fact you can even run multiple versions of Go at the same time. This is a huge plus-point for Docker and helps solve the problem of outdated repositories. 

Unfortunately the Docker Hub has no automated builds for ARM images, so use an image from a trusted source or build your own.

I was able to adapt the Golang official Dockerfile for ARM which uses Alpine Linux as a base image, this means you get a much smaller working image than with an Ubuntu or Debian base.

* Pull my Alpine Linux + Golang image (only 242MB):

```
$ docker pull alexellis2/go-armhf:1.7.4
```

* [Dockerfile for Golang on Alpine/ARM](https://github.com/alexellis/docker-arm/blob/master/images/armhf/go-1.7.3/Dockerfile)

> Note: the Golang official binary will not work in an Alpine Linux container because it's built against glibc and Alpine uses Musl instead. The above image does a clean build from Golang source.

### Build something

So you can now build some code on your Pi - pretty much anything you find in the Golang docs should build, from hello world to HTTP servers to complex image manipulation code.

Bear in mind:

* Runtime execution is fast and getting better with each Go release
* Building is slow (Docker can take a very long time)
* A swap file is sometimes needed to successfully build large applications
* Even [Minio](http://blog.alexellis.io/meet-minio/) will build - the self-hosted S3 server, but will take over 10-15 minutes on a Pi Zero and a couple on a Pi 2/3
* Sometimes projects use incompatible x86 assembly code or optimised binary blobs


### Next steps

Head over to my [Golang basics - fetch JSON from an API](http://blog.alexellis.io/golang-json-api-client/) and follow the tutorial on your Pi.

Is hardware your thing? Check out my brand new [Pimoroni and Blinkt Golang library](https://github.com/alexellis/blinkt_go_examples), I need people to help port examples from the [Pimoroni Python library](https://github.com/pimoroni/blinkt/tree/master/examples).

If you're looking for more Raspberry Pi Docker images I curate a special Github repo and contributions are welcome, especially updates.

* [alexellis/docker-arm](https://github.com/alexellis/docker-arm/blob/master/images/armhf/)