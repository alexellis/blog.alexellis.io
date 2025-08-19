---
title: "Jenkins meets the corporate proxy"
slug: "jenkins-meets-the-proxy"
date: "2016-07-26T19:41:00Z"
author: "Alex Ellis"
meta_title: "Jenkins meets: the corporate proxy"
meta_description: "Jenkins and Docker are the go-to combination for open source and the enterprise. Learn how to configure your HTTP proxies automatically with Docker"
tags:
  - "jenkins"
  - "docker"
  - "linux"
  - "ci"
---

It seems like so much time has already passed since I wrote my [first impressions to the Jenkins 2.0](http://blog.alexellis.io/jenkins-2-0-first-impressions/) release back in May. Including all the preparations for [speaking at Dockercon 2016](http://blog.alexellis.io/dockercon-2016-speaker-notes/), [visiting Pimoroni and going on their YouTube stream](http://blog.alexellis.io/magic-and-pirates/) and Docker 1.12 coming into RC with the awesome new [Swarm Mode](http://blog.alexellis.io/tag/swarmmode/).

Now everyone has work to do and sometimes that means overcoming obstacles like a HTTP proxy.

![Jenkins and Docker, perfect combination](/content/images/2016/07/jenkins_docker.png)

### The enterprise uses Jenkins

Jenkins is very popular in the open-source community and has been a go-to solution for developers for years, especially for building free software projects. It turns out that Jenkins also solves CI in a really agile way for the enterprise too.

I make use of Jenkins on a daily basis to build .NET code on Windows, Node.js on Linux and to run integration tests with Ruby. Plug-ins mean that I can build code out of traditional TFS 2013 or remote Git repositories just as easily.

With the advent of *[Pipeline as code](https://wiki.jenkins-ci.org/display/JENKINS/2.0+Pipeline+as+Code)* in the 2.0 release we can even store our build definitions in source-control, so the case for using Jenkins is getting stronger.

#### HTTP_PROXY vs developer

Imagine yourself sitting at a PC where you have absolutely no connection to any other computer or service on the Internet unless it first travelled through a content filtering, LDAP authenticated proxy server?

You can't use `git`, `npm`, `docker`, `bower`, `apt-get`, `brew` or any of the other tools we know and love without arduous and highly specific settings and commands. You have to memorise and learn each one-by-one and to top it off you can only access services on port 80 and 443.

If this is sounding familiar, then you probably work in the enterprise and it affects Jenkins, too.

A `http_proxy` environmental variable can fix everything right?

#### Environment

Jenkins is a Java application which is neatly packaged up in a *.WAR* file containing everything for the application - just add a JDK. As we know Java is cross-platform so could be run *neat* on Windows, Linux or macOS providing a JDK is available.

Until discovering Docker last year I used to run Jenkins on a sandbox or VM with whichever JDK happened to be installed. Each time I set up Jenkins I'd have to enter the proxy information manually and go through some other hoops we won't mention here.

> [cntlm](http://cntlm.sourceforge.net)

More recently I've been experimenting with running a Jenkins master from a Docker container and then attaching Linux or Windows agents (previously known as slaves) for carrying out build tasks. This model means the master almost never has to change and agents can be thrown away or re-imaged with little impact. When that is coupled with `Pipeline as code` CI has never been easier.

#### The Docker part

In my [first impressions with Jenkins 2.0](http://blog.alexellis.io/jenkins-2-0-first-impressions/) I used Docker to give the new version a test-drive and to run through start-up process several times without having to pollute my host system. The Jenkins project has an official Docker repository with instructions for a number of lengthy runtime flags. In my test-drive I used their image and parameters but made it so much easier to launch through a `docker-compose.yml` file.

#### On to the proxy

Most applications will honour a `http_proxy` or `https_proxy` environmental variable, but with Jenkins (at least in a Docker container) it appears to be an exception to the rule. Once loaded up you have to set the proxy configuration manually in a separate screen. Steps like that prevent us from automating our CI deployments.

* Manual configuration
 * Slow, repetitive, hard to automate
* http_proxy Environmental variables
 * Fails to translate to the plug-in manager
* `-Dopts` passed into the JDK
 * This final option is where I finally had success.

With the appropriate overrides to `docker run` or our `docker-compose.yml` file we can have Jenkins act like it has a fully open internet connection. If you navigate to the *Manage Plugins* page there will be no proxy listed yet you will be able to connect to the Internet and download plugins.

Here is an example set of options for `docker-compose.yml`:

```
version: '2'
services:
  ci:
    image: jenkins:2.0
    ports:
     - "8000:8080"
     - "50000:50000"
    environment:
      - JAVA_OPTS=-Dhttp.proxyHost=192.168.0.101 -Dhttp.proxyPort=3128 -Dhttps.proxyHost=192.168.0.101 -Dhttps.proxyPort=3128
```
#### Wrapping up

If you have any cool hacks for Docker and Jenkins please let me know in the comments or over on Twitter [@alexellisuk](https://www.twitter.com/alexellisuk/)

I've also included a bonus hack and a few words on Gitlab CI too.

##### Plugins.txt hack

If you include a `plugins.txt` file and add that into your Jenkins instance it will install your favourite plug-ins and make an automated deployment of Jenkins even easier. 

> Note: when using a *plugins.txt* file Jenkins won't create an administrative user and password so your server will be left open to anyone with access to the IP address.

```
credentials:1.18
```

Example plugins.txt file

```
FROM jenkins:latest

COPY plugins.txt /usr/share/jenkins/ref/
```
Dockerfile for automatic installation of plugins

##### Gitlab CI

There are some exciting alternatives to Jenkins such as Gitlab's CI service which combines source-control, a web dashboard and CI all within one system. It can also be hosted on-prem which is important for highly regulated companies.

[Building an app on Gitlab CI](https://about.gitlab.com/2016/07/22/building-our-web-app-on-gitlab-ci/)