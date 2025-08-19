---
title: "Self-hosting on a Raspberry PI"
slug: "self-hosting-on-a-pi"
date: "2015-03-13T00:29:00Z"
author: "Alex Ellis"
meta_title: "Self-hosting a blog on Raspberry Pi"
meta_description: "Self-hosting a blog on a Raspberry Pi is a cheap and eco-friendly way of running your own site. I learnt loads about Linux, the Pi and Ghost."
tags:
  - "blog"
  - "Arch Linux"
  - "ghost"
  - "tryghost"
  - "self-hosting"
  - "Raspberry PI"
---

## Nice, it works
> Published: 13 Mar 15

This is the first post on my new `ghost` blog which is being hosted on a quad-core Raspberry PI Model B 2. The PI is running in my house plugged into the mains and my home router. I've measured a power draw of 1-2W meaning that this is going to be very cheap to run all year around 24/7.

**Linux Distribution**

For my OS I picked Arch Linux ARM which comes as a minimal base image with no additional UI components. It was the perfect choice for a server and I followed the instructions here: [Arch Linux ARM installation instructions](http://archlinuxarm.org/platforms/armv7/broadcom/raspberry-pi-2).

I went through these steps after preparing the SD card:

* Opened a port on my router to enable the outside world to view the blog. This may read as *port forwarding* or *NAT* on your router's admin page.
* Installed the `base-devel` package which gives a full build-chain for C. This is need to compile the Node.js module for [SQLite](https://www.sqlite.org).
* Installed the Node.js for ARMv7 binary to `/usr/local/`
* And then some of the usual tasks such as setting up a host name etc

Example installation:
```
pacman -Sy base-devel nodejs
wget https://ghost.org/zip/ghost-latest.zip
cd /var/www/
unzip ghost-latest.zip
npm install --production
npm start --production
```

**And it worked, first time!**

### But wait..
What happens if there is an exception or error and the node.js process terminates? Well: "there is an app for that" (tm).

Use Node's package manager *npm* to install either `pm2` or `forever` these tools daemonize your node process and automatically restart it if it runs into any issues.

`npm install --global pm2`

Once installed start the ghost blog like this:
```
export NODE_ENV=production
pm2 start index.js --name ghost
```
To view the status of the process ``pm2 list`` and to kill the process `pm2 kill`.

The output gives the total memory used, times the application had to restart and the total uptime. For a very cool live view similar to 'top' type in `pm2 monit`.

So once `pm2` is managing your blog, you shouldn't need to make any changes to the installation. The only other thing you may want to do is to specific a startup task in crontab/init or systemd so that if you get a power-outage the blog will restart.

### and..
Beware that self-hosting on your own hardware and connection is not without its risks.

* Someone could turn off your machine by accident (yes this happened) to me
* the SD card could become corrupted (this happened to me)
* your connection could go down (again has happened) or even the electricity during a power-cut.

While cloud hosting can provide a reliable and economical alternative, this certainly was a very educational and rewarding journey. I learnt a lot during the process and I hope you will try it out too.

#### Any questions/suggestions?

* Do you run a blog on your Raspberry PI?
* Have you got a neat suggestion?

Or for any other related topic, please post a comment.

#### Update 12 months on:

> Host your Ghost blog in 5 minutes on Raspberry PI or a regular PC/VM using Docker:

> [Ghost on Docker in 5 mins](http://blog.alexellis.io/ghost-on-docker-5mins/)