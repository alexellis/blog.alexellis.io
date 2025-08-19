---
title: "Keeping Shipping your blog with Docker volumes"
slug: "keeping-shipping-your-blog"
date: "2016-10-14T09:49:00Z"
author: "Alex Ellis"
meta_title: "Keep Shipping your blog with Docker Volumes"
meta_description: "Learn how I use Docker volumes to keep shipping updates to my Ghost blog without losing any data. Backup your blog posts and images now!"
tags:
  - "blog"
  - "docker"
  - "tryghost"
  - "ghost"
  - "volumes"
  - "backups"
---

I've been running my blog on a Raspberry Pi for over a year now and for most of that time it's been running inside a Docker container. The [Ghost team](https://github.com/tryghost/ghost) have released updates a bunch of times, but I wasn't always keen to risk losing my data.

> Here's how I used Docker volumes to make sure the posts and images stayed permanent, even when I upgraded my container image.

[Docker volumes](https://docs.docker.com/engine/tutorials/dockervolumes/) can be defined in your Dockerfile and let the Docker engine know which parts of the filesystem can be hot swapped.

### Define volumes

Here's a snippet of the directories a Ghost blog needs - this includes the SQLite database for posts, images you've uploaded and any configuration setup through the admin page. There may be more directories you need depending on your use-case.

```
VOLUME ["/var/www/ghost/content/apps"]
VOLUME ["/var/www/ghost/content/data"]
VOLUME ["/var/www/ghost/content/images"]
```

When using `docker-compose` to launch the blog these volumes are created externally and maintained separately from the container. That's means that moving from version 0.10.8 to 0.10.10 is as quick as removing the old container and running a new one.

### Inspecting volumes

To look at all your volumes type in `docker volume ls` and then you can inspect individual ones with `docker volume inspect` allow you to drill down into the volume and see or edit the files.

```
DRIVER              VOLUME NAME
local               358ffce1e8aaa516da30f0f1cdba524f55b3
local               5a9ec98a259e58985a34e8685f5308f66ffd
local               blog_ghost_apps
local               blog_ghost_data
local               blog_ghost_images
local               blog_ghost_themes
```

All of these volumes are using a local driver which means I'm responsible for backing up the data and managing it. Various projects such as [Flocker](https://clusterhq.com/2015/12/09/difference-docker-volumes-flocker-volumes/) have provided their own volume plug-ins allowing NFS, Amazon S3 or other cloud storage systems to back the filesystem.

```
$ docker volume inspect blog_ghost_images
[
    {
        "Name": "blog_ghost_images",
        "Driver": "local",
        "Mountpoint": "/var/lib/docker/volumes/blog_ghost_images/_data",
        "Labels": null
    }
]
```

From here you can create a tarball of the `/var/lib/docker/volumes/blog_ghost_images/_data` image and back it up to your usual locations such as [Rsync.net](http://rsync.net/).

### My setup

I'll provide my default setup and then you can edit and tune it as you need. Whether you are running on a Raspberry Pi or cloud instance - you just need to edit the base image of the Dockerfile

```bash
version: "2.0"
services:
  blog:
    ports:
      - "2368:2368"
    build: "./blog.alexellis.io/"
    volumes:
      - ghost_apps:/var/www/ghost/content/apps
      - ghost_data:/var/www/ghost/content/data
      - ghost_images:/var/www/ghost/content/images
      - ghost_themes:/var/www/ghost/content/themes
    restart: always

volumes:
   ghost_apps:
      driver: local
   ghost_data:
      driver: local
   ghost_images:
      driver: local
   ghost_themes:
      driver: local
```

The full example with `docker-compose` is available here: https://github.com/alexellis/ghost-on-docker/tree/master/blog

### What next?

Pick out a Docker image or Dockerfile from my previous tutorial and try migrating to a newer version of the blog. After all - you don't know if your backup strategy works until you actually use it.

* [Setting up Ghost in 5 mins with Docker](http://blog.alexellis.io/ghost-on-docker-5mins/)

### See also:

* [Self-hosting on a Pi](http://blog.alexellis.io/self-hosting-on-a-pi/)

* [Get Started with Docker 1.12 on Raspberry Pi](http://blog.alexellis.io/getting-started-with-docker-on-raspberry-pi/)