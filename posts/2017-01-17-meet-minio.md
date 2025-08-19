---
title: "Meet Minio, an S3 server you can self-host"
slug: "meet-minio"
date: "2017-01-17T20:45:00Z"
author: "Alex Ellis"
meta_title: "Meet Minio, an S3 server you can self-host"
meta_description: "Has Minio S3 storage come up on your radar yet? It's a great project and easy to use. Join me for the 50,000ft overview and walk-through in Docker."
tags:
  - "minio"
  - "s3"
---

Minio is a project that has come up on my radar several times and caught my attention - it's an S3-compatible object-storage server that you can run on your own kit and has first-class Docker and Raspberry Pi support.

![](/content/images/2017/01/minio_light_cir_sm-1.png)

> This tutorial is a walk-through for deploying and using Minio. I hope you find it useful and do follow me on [Twitter](https://twitter.com/alexellisuk) and [YouTube](https://www.alexellis.io/).

#### 50,000ft

> What does Minio mean for me?

If you deploy Minio onto one of your PCs or Raspberry Pis you can leverage that machine for storing data in your applications, photos, videos or even [backing up your blog](http://blog.alexellis.io/tag/blog/). Minio even has a very attractive UI and a test site available at http://play.minio.io:9000/

> Tell me about the moving parts

Well Minio comes in two parts - the client portion and the server portion which also includes a web-ui / file-browser. They've both easy to setup and if you're familiar with command-lines I think you will like working with it.

I found Minio easy to setup and liked the fact that it comes with sensible defaults. This means that if you were thinking of [building a Raspberry Pi NAS](http://blog.alexellis.io/hardened-raspberry-pi-nas/) - it can be even easier to get started than with NFS or Samba.

#### Walk-through

Let's start with the client. If you're on a Mac then you can install it with brew:

```
# brew install minio-mc
```

Now you have a choice of running Minio in Docker or on your bare-metal. Since I'm a Docker Captain I'm going to opt for containers.

```
# docker run -p 9000:9000 --name minio -d minio/minio server /export
```

The simplest set of overrides (above) would store all of your data inside the container, but we could probably use a bind-mount or Docker volume for that. Let's imagine you have an SSD mounted at `/mnt/sdd`, then we can run the following to use it instead:

```
# docker run -v /mnt/ssd:/export -p 9000:9000 --name minio -d minio/minio server /export
```

When you run Minio you will be issued a key and a secret. These are used by the client or the web front-end to connect securely. I found my codes by typing in `docker logs minio`.

```
Created minio configuration file at /root/.minio

Endpoint:  http://172.17.0.2:9000  http://127.0.0.1:9000
AccessKey: accessCode
SecretKey: secretCode
Region:    us-east-1
SQS ARNs:  <none>

Browser Access:
   http://172.17.0.2:9000  http://127.0.0.1:9000

Command-line Access: https://docs.minio.io/docs/minio-client-quickstart-guide
   $ mc config host add myminio http://172.17.0.2:9000 accessCode secretCode

Object API (Amazon S3 compatible):
   Go:         https://docs.minio.io/docs/golang-client-quickstart-guide
   Java:       https://docs.minio.io/docs/java-client-quickstart-guide
   Python:     https://docs.minio.io/docs/python-client-quickstart-guide
   JavaScript: https://docs.minio.io/docs/javascript-client-quickstart-guide

Drive Capacity: 55 GiB Free, 63 GiB Total
```

You get a bit of help with configuring the client - but be careful because the IP address belongs to the container and you'll have to change that to localhost or the IP of an interface on your machine.

#### Upload a file

Configure your minio instance with the `mc` client like this:

```
# mc config host add myminio http://127.0.0.1:9000 accessCode secretCode
```

Now in order to upload some data we need to create a `bucket` which roughly corresponds to a mount point or a drive on Windows. `mb` stands for make bucket.

```
# mc mb myminio/photos
```

Now that you've created a bucket with `mb` let's upload a photo. Why not grab an image from my blog post on a [building a Raspberry Pi NAS](http://blog.alexellis.io/hardened-raspberry-pi-nas/)?

You can use Minio to upload the image just like you would if you were using `scp` or `sftp`.

```
# mc cp ~/Downloads/IMG_20161203_151921-2.jpg myminio/photos
IMG_20161203_151921-2.jpg:  164.98 KB / 164.98 KB  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  100.00% 9.02 MB/s 0s
```

At any point you can use the `mc` command to list the files in a bucket like this:

```
# mc ls myminio/photos 
[2017-01-17 21:00:58 GMT] 165KiB IMG_20161203_151921-2.jpg
[2017-01-17 21:10:50 GMT]     0B Downloads/
```

#### Checkout your files in the browser

Minio's browser will ask you to login with your access codes we found earlier. Then you can navigate all the files you've uploaded and download them remotely. You could even tunnel Minio over an SSH tunnel to access it remotely.

![](/content/images/2017/01/Screen-Shot-2017-01-17-at-9.03.35-PM.png)

#### Learning more

If you'd like to learn more then most of the Minio client commands support a help flag or give info on the command line:

```
NAME:
  mc - Minio Client for cloud storage and filesystems.

USAGE:
  mc [FLAGS] COMMAND [COMMAND FLAGS | -h] [ARGUMENTS...]

COMMANDS:
  ls       List files and folders.
  mb       Make a bucket or a folder.
  cat      Display file and object contents.
  pipe     Redirect STDIN to an object or file or STDOUT.
  share    Generate URL for sharing.
  cp       Copy files and objects.
  mirror   Mirror buckets and folders.
  diff     Show differences between two folders or buckets.
  rm       Remove files and objects.
  events   Manage object notifications.
  watch    Watch for files and objects events.
  policy   Manage anonymous access to objects.
  session  Manage saved sessions for cp and mirror commands.
  config   Manage mc configuration file.
  update   Check for new mc update.
  version  Print version info.
  help, h  Shows a list of commands or help for one command
```

Detailed documentation is also available on the website at http://docs.minio.io


#### More advanced options

You can have your client point to multiple Minio servers, which is really neat especially if you're working on a distributed team. 

Minio's test-server called "play" is already configured in the default client, you can see all the servers you have configured with `mc config host list`.

To upload the photo to Minio's "play" S3 server just type in:

```
# mc mb play/somebucketname
# mc cp ~/Downloads/IMG_20161203_151921-2.jpg play/somebucketname 
```

**Recursive uploads:**

If you want to test something larger out you could try uploading your entire Downloads photo, and then you should use the `--recursive` flag to make sure nothing's missed:

```
# mc cp --recursive ~/Downloads/IMG_20161203_151921-2.jpg myminio/photos
```

#### See also

Minio supports integration at an API level, this is very exciting for integrating object storage into your business applications, side-projects and even CI processes.

The Raspberry Pi is supported natively with a download available for the Pi 2/3 and a Docker container recipe here: 

* [Minio on ARM](https://github.com/alexellis/docker-arm/blob/master/images/armhf/minio/README.md)

![](https://camo.githubusercontent.com/f15ae64ae1c66e1d1a2f327a49ceb1a20e0a6e66/68747470733a2f2f7062732e7477696d672e636f6d2f6d656469612f43313763444b34586341414b4c6f6b2e706e673a6c61726765)