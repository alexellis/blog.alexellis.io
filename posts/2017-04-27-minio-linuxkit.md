---
title: "Package Minio S3 as an appliance with LinuxKit"
slug: "minio-linuxkit"
date: "2017-04-27T12:56:27Z"
author: "Alex Ellis"
meta_title: "Package Minio S3 as an appliance with LinuxKit"
meta_description: "Follow this deep dive into packaging an application as an appliance using LinuxKit and the Moby CLI. Minio is an S3 server you can host yourself."
feature_image: "/content/images/2017/04/breakout.jpg"
tags:
  - "docker"
  - "containerd"
  - "minio"
  - "linuxkit"
---

In my previous blog post I wrote how to build, boot and connect to an OpenSSH server with Docker's [LinuxKit](https://github.com/linuxkit/linuxkit) toolchain. We now take that to the next logical step which is to package an application with a secure, immutable OS to create an appliance.

An appliance is an application in a box that can be deployed to a hypervisor. In this case we get a bootable image that will work on the cloud, bare metal, our laptop or Docker itself. It can be deployed and booted up in seconds.

**Pre-requisites**

I suggest running through [my LinuxKit OpenSSH tutorial](http://blog.alexellis.io/boot-linuxkit-in-10-mins/) (which takes 10 minutes) before proceeding. *This will build the Moby and LinuxKit toolchain that is required for the tutorial.*

> This tutorial is designed to be run on Docker for Mac.

![](https://cdn-images-1.medium.com/max/87/1*lO-76yklVXuzigit3nOciA.png)

**Minio**

Minio is an open-source object storage offering which has an API compatible with S3. This means you can take advantage of existing on-prem resources or just bring portability to your storage solutions.

Minio can also be used as a back-end to store [Docker images in a registry](https://medium.com/@enne/use-minio-as-docker-registry-storage-driver-c9c72c72cc87).

If you'd like an introduction on how to deploy and use Minio, read my tutorial: [Meet Minio](http://blog.alexellis.io/meet-minio/)

### Putting together the pieces

Minio already packages and maintains the server component through their Docker Hub account. We'll use the `edge` release for all the latest features.

If you've not seen Minio before, you can run an S3 server in Docker like this:

```
# docker run --name s3 -p 9000:9000 -v /exports/exports -d minio/minio:latest server /exports
```

You can then use the Minio client utility or your normal S3 client libraries to read/write objects. A UI is also exposed on port 9000.

Login/authentication is done through a secret and access key printed to the console when the Minio assembly boots up. You can find the start-up logs like this:

```
# docker logs s3
```

#### 1. Build a YAML file

Step one is building a YAML file for a base system. We'll start with the `test/test.yml` file from the LinuxKit repo and just add in the parts we need for Minio.

The LinuxKit format is a technical specification and it's very new - so as a community I'd say we're still getting used to how to read and edit it.

The following configuration sections are used in our example:

Init components:

* init (to act as PID 1 and start containerd)
* containerd (to manage containers)
* runc (to run containers)
* ca-certificates (for SSL)

On boot components:

* format (to create a disk image, for persistence)
* mount (to mount the disk image and make it available under /var/exports)

System components:

* dhcpcd (to get an IP)
* (not included here, but you could add SSHD from previous example)

Runtime services:

* minio (our application)

I added the following under the `services` section:

```
  - name: minio
    image: "minio/minio:edge"
    net: host
    pid: host
    binds:
     - /var/exports:/var/exports
     - /etc/resolv.conf:/etc/resolv.conf
     - /tmp:/tmp
    command: ["minio", "server", "/var/exports"]
```

If we follow the principle of least privileges then we need to give the minimum set of Kernel capabilities to the image. It turns out that Minio will run without any additional privileges, so to specify "none" leave out the `capabilities` section completely.

A good way to test for if a Docker container needs additional privileges is with the `--cap-drop=all` flag passed into `docker run`:

```
# docker run --cap-drop=all minio/minio:edge
```

Let's clone the miniokit GitHub repo:

```
# git clone https://github.com/alexellis/miniokit/
# cd miniokit
```

### 2. Build the bootable image

Now we need to build an image (ISO etc), which will output the artifacts we need into the current folder.

```
# moby build -name minio minio.yml
```

This is the output you should see:

```
Extract kernel image: linuxkit/kernel:4.9.x
Add init containers:
Process init image: linuxkit/init:63eed9ca7a09d2ce4c0c5e7238ac005fa44f564b
Process init image: linuxkit/runc:b0fb122e10dbb7e4e45115177a61a3f8d68c19a9
Process init image: linuxkit/containerd:18eaf72f3f4f9a9f29ca1951f66df701f873060b
Process init image: linuxkit/ca-certificates:eabc5a6e59f05aa91529d80e9a595b85b046f935
Add onboot containers:
  Create OCI config for linuxkit/dhcpcd:48e249ebef6a521eed886b3bce032db69fbb4afa
Add service containers:
  Create OCI config for minio/minio:edge
Add files:
Create outputs:
  minio-bzImage minio-initrd.img minio-cmdline
  minio.iso
  minio-efi.iso
```

### 3. Boot the image

The easiest way to boot the image is with the `linuxkit` tool (installed in the pre-requisites section). We will also assign a static IP address as we go along. We'll also need to pass an additional flag to create and mount a disk image so that the VM can keep persistent data for the S3 objects and buckets we create through the application.

```
# linuxkit run -disk-size 4096 -disk disk1.img -ip 192.168.65.101 minio
```

* `-disk-size 4096` will create a 4GB permanent disk image
* `-disk disk1.img` refers to the image which if pre-existing will not be overwritten next time we boot the VM 

Now when Minio server starts up it generates an access key and secret key, we need those for use with the client or our API.

We can then execute a couple of `grep` commands on the VM's console to find the access keys required.

On the VM shell, type in the following.

```
# / runc exec minio grep "access" /root/.minio/config.json
# / runc exec minio grep "secret" /root/.minio/config.json
```

> Spoiler: don't worry that I am sharing a key here. This is not a live exposed site on the internet and Minio generates a new key each time you run a new container/image.

```
"accessKey": "BPLPLXNA6O9HFT0KOA15",
"secretKey": "kaX6fvkUgfZ2YM8atymxu3kULEkQn8FPH0PcUS6n",
```

This can be used later with the Minio client.

### 4. Connect to the S3 server

The easiest way to connect to exposed services running on HyperKit/VPNKit (packaged with Docker for Mac) is to run a Docker container. We can then access the IP specified in part 3.

```
# docker run -v $HOME/Downloads:/root/Downloads --entrypoint=sh -ti minio/mc
```

Now set up a remote S3 host called `s3` and create your first bucket:

```
# mc config host add s3 http://192.168.65.101:9000 BPLPLXNA6O9HFT0KOA15 kaX6fvkUgfZ2YM8atymxu3kULEkQn8FPH0PcUS6n
# mc mb s3/downloads
```

In the `docker run` command we bind mounted the Downloads folder. So why don't we use Minio's mirror capability to sync the downloads folder into the VM?

```
# mc mirror --watch /root/Downloads s3/downloads
```

When the mirror is finished, download another file and you'll see it get synced up automatically because of the `--watch` flag.

To pull down the data into another Docker container, `cd` to the `tmp` folder:

```
# mkdir -p /tmp/downloads
# cd /tmp/downloads
# mc mirror s3/downloads ./
```

### Wrapping up

It's extremely useful to be able to build and boot systems produced with LinuxKit on Docker for Mac, but in production you'd do something slightly different:

* Boot a bare-metal image on a host provider like [Equinix Metal](https://metal.equinix.com/)

* Boot the VM in a hypervisor and rely on that to provide and export an IP address

Since publishing I've managed to get a LinuxKit system booting on a vSphere cluster using the ISO image and a disk created through the administration UI. It also worked very well through VirtualBox:

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">How about that? An OpenSSH server on <a href="https://twitter.com/virtualbox">@virtualbox</a> built with <a href="https://twitter.com/hashtag/LinuxKit?src=hash">#LinuxKit</a>.. next stop on-prem mega-hypervisor? <a href="https://t.co/tTocWVEJRI">https://t.co/tTocWVEJRI</a> <a href="https://t.co/xta1HG2U2g">pic.twitter.com/xta1HG2U2g</a></p>&mdash; Alex Ellis (@alexellisuk) <a href="https://twitter.com/alexellisuk/status/856796653164130304">April 25, 2017</a></blockquote> <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

The LinuxKit authors have provided examples for Google Cloud and Equinix Metal here: [LinuxKit examples](https://github.com/linuxkit/linuxkit/tree/master/examples)

I hope this post piqued your interest for LinuxKit. If you'd like to get involved with the project or start building your own bootable VMs then - head over to the Docker Slack community and join the discussion.

[Join Docker Community Slack](https://dockr.ly/community)