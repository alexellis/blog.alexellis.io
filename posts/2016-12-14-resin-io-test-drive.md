---
title: "Take Resin.io for a test-drive"
slug: "resin-io-test-drive"
date: "2016-12-14T12:42:10Z"
author: "Alex Ellis"
meta_title: "Take Resin.io for a test-drive"
meta_description: "Resin, based in London's East End are relentless innovators with IoT. Find out how they use Docker and IoT to provide a hands-off builds and deployments."
tags:
  - "Raspberry PI"
  - "resin"
  - "IoT"
  - "docker"
---

In this post we take [Resin.io's](https://resin.io/) platform for a test-drive. Resin provide their own Linux distribution powered by Docker containers which allows you to deploy code to a fleet of IoT devices completely hands-off.

<a href="https://resin.io/">![Resin's logo](https://workablehr.s3.amazonaws.com/uploads/account/logo/3973/large_resin_logo.png)</a>

#### Background

When I first started looking into Docker - [Resin](https://resin.io/) was one of the sites that popped up. It turns out that the start-up based out of London's east end is a serial innovator and have had IoT based demos in several of the bi-annual Dockercon US and EU events.

I saw them in person at [Dockercon](http://2017.dockercon.com/) 2016 in Seattle where they showed code being deployed live to a quadcopter and how a rolling update only caused a minor blip in uptime.

<iframe width="560" height="315" src="https://www.youtube.com/embed/75vm6rRb6K0?start=1600" frameborder="0" allowfullscreen></iframe>

*Moby's cool Hack Session DockerCon 2016*

> Make sure you sign up for [Dockercon 2017](http://2017.dockercon.com/) in Austin, Texas. Going by last year's event it's going to be amazing.

#### Test-drive

Resin.io's service is available for free for use with up to 5 devices so I decided to try it out.

> Some of the listed use-cases are: connected home, manufacturing and logistics and marketing and retail.

> Up to 25 devices will cost you $60/month.

Applications can be deployed to a Raspberry Pi 1 or 2 along with other listed boards in Node.js or Python so I decided to take a previous project and re-deploy it.

> Note: Resin's distro will not provide you with a UI and is designed to be a remotely-managed system. 

##### Flash an SD card

The first step in turning your Pi into a Resin device is to flash their custom Linux distribution. This is a small download that expands to around 2GB. 

The process is designed to be hands-off, so there's no need for manual hacking of files, this is super easy. When downloading pick whether you want ethernet and DHCP or WiFi.

I logged into Resin.io and after 10 minutes my Raspberry Pi 2 appeared and was available for tasking.

![](/content/images/2016/12/pi.png)

##### Deploying an application

I'm used to logging into Linux hosts with SSH to deploy Docker or other packages. It turns out that Resin has that covered. You don't technically even need to know the IP address and SSH is completely disabled.

To deploy an application you will need a Git repository that you've already cloned or you can start a new one.

```
$ mkdir myapp
$ cd myapp
$ git init
```
*Creating a new repository*

```
$ git remote add resin alexellis2@git.resin.io:alexellis2/resintest.git
```
*Adding a remote push location*

At this point anything we commit can be pushed to the remote side `resin` with `git push resin master`.

This fires off an intricate process which involves building your code on a remote Docker host in the cloud and then uploading it to Resin's private Docker registry.

> Check out [Resin's build process](https://resin.io/how-it-works/) here.

A `Dockerfile.template` file instructs Resin's build machines what kind of device architecture to use. The only real customisation I've seen here is `%%RESIN_MACHINE_NAME%%`.

```
FROM resin/%%RESIN_MACHINE_NAME%%-node:slim

WORKDIR /usr/src/app
COPY package.json package.json

RUN JOBS=MAX npm install --production --unsafe-perm && npm cache clean && rm -rf /tmp/*

COPY . ./
ENV INITSYSTEM on

CMD ["npm", "start"]
```

> Find out more about [Resin's templates](http://docs.resin.io/deployment/docker-templates/).

Once your image is built successfully then your Pi will begin a download and then start the image.

Here's an abridged log with the output of `git push` - the best part is the unicorn in ASCII.

```
git push resin master
Counting objects: 4, done.
Delta compression using up to 4 threads.
Compressing objects: 100% (4/4), done.
Writing objects: 100% (4/4), 478 bytes | 0 bytes/s, done.
Total 4 (delta 3), reused 0 (delta 0)

Starting build for alexellis2/resintest, user alexellis2
Building on 'local'
Pulling old image for caching purposes
       Still working...
[==================================================>]    538 B/538 B
[==================================================>]   280 kB/280 kB
[==================================================>] 233.8 kB/233.8 kB
       Still working...

Cached image pulled
-----> Dockerfile template application detected
Step 1 : FROM resin/raspberrypi2-node:slim
 ---> 8dad55ae30a4
Step 2 : WORKDIR /usr/src/app
 ---> Running in f3244aa97420
 ---> b37b391432c0
Removing intermediate container f3244aa97420
Step 3 : COPY package.json package.json
 ---> fa3bcbab4920
Removing intermediate container ac02cf3d96db
Step 4 : RUN JOBS=MAX npm install --production --unsafe-perm && npm cache clean && rm -rf /tmp/*
 ---> Running in 8a36e297ae2c
simple-server-node@1.0.0 /usr/src/app

 ---> ba99eb092b87
Removing intermediate container 8a36e297ae2c
Step 5 : COPY . ./
 ---> 65fdddcda19a
Removing intermediate container 1875bb000e4f
Step 6 : ENV INITSYSTEM on
 ---> Running in e0916d55b102
 ---> d3d736e5ec64
Removing intermediate container e0916d55b102
Step 7 : CMD npm start
 ---> Running in 8f6c14a88fcb
 ---> 199bb5445834
Removing intermediate container 8f6c14a88fcb
Successfully built 199bb5445834

-----> Image created successfully!
-----> Verifying image integrity...
-----> Image passed integrity checks!
-----> Uploading image to registry...
[==================================================>] 45.58 MB - 14% MB - 13%

[==================================================>] 4.096 kB - 0%B - 0%
[==================================================>] 1.375 MB - 0%3 MB - 0%
[==================================================>] 274.9 kB - 0%kB - 0%
       Image uploaded successfully!
       Check your dashboard for device download progress: https://dashboard.resin.io/apps/157424/devices
Build took 2 minutes and 34 seconds
			    \
			     \
			      \\
			       \\
			        >\/7
			    _.-(6'  \
			   (=___._/` \
			        )  \ |
			       /   / |
			      /    > /
			     j    < _\
			 _.-' :      ``.
			 \ r=._\        `.
			<`\\_  \         .`-.
			 \ r-7  `-. ._  ' .  `\
			  \`,      `-.`7  7)   )
			   \/         \|  \'  / `-._
			              ||    .'
			               \\  (
			                >\  >
			            ,.-' >.'
			           <.'_.''
			             <'

To git.resin.io:alexellis2/resintest.git
   ccb92ee..0974684  master -> master
```

##### Viewing the Dashboard

The dashboard allows you to remotely reboot, shutdown or redeploy your device. And if you need to, you can create an `ssh` session into the running container.

![Dashboard](/content/images/2016/12/dashboard.png)

##### Connecting to the application

In this instance we have a web-server, so just find out your device URL and open it in a browser. Resin will provide a tunnel which can punch through your NAT firewall and allow anyone with the URL to access your site.

Your public device URL has to be enabled manually through the Resin dashboard, my URL (this may not be online) was:

[https://801c29696db9c2516134f5d10c01f2a04175f522d374b015b49cd83ecf09c6.resindevice.io](https://801c29696db9c2516134f5d10c01f2a04175f522d374b015b49cd83ecf09c6.resindevice.io)

![](/content/images/2016/12/cows.png)

This is what I get from `curl` - it looks like the tunnel gives us some TLS encryption for free.

![](/content/images/2016/12/Screen-Shot-2016-12-14-at-12-31-00.png)

Now you don't have to deploy a web-service, you may have something that logs environmental data to a time-series database like in my previous blog post [Create an Environmental Monitoring Dashboard
](http://blog.alexellis.io/environmental-monitoring-dashboard/)

##### Summary

So who's this service for? A Google search shows that the Resin project is both profitable and very active in the wider community. Their demos at Dockercon show that they're doing very cool stuff and have a unique product aimed at the IoT market.

For side-projects that can be run headless the Resin solution could be a very neat way of deploying a Raspberry Pi at your home or office. You can serve content, connect to webservices or interact with physical sensors or LEDs without having to worry about `ssh` connections, firewalls and OS updates. If your SD card gets corrupted (this is likely) then just flash a new one and re-deploy your application.

So if you have a spare SD card then flash their distribution over the weekend and let me know what you think to the approach on Twitter [@alexellisuk](https://twitter.com/alexellisuk/).

**See also:**

* The code for my resin project is available on Github: [alexellis/ascii-cows-resin](https://github.com/alexellis/ascii-cows-resin)

* [Serverless functions prototype for Docker Swarm](https://www.youtube.com/watch?v=BQP67FWF1P8)

* [Docker on the Raspberry Pi Series](http://blog.alexellis.io/tag/raspberry-pi/)

* My original [blog post](http://blog.alexellis.io/cows-on-docker/) from April 2015 on [Dockerizing ASCII cows with Node.js](http://blog.alexellis.io/cows-on-docker/)