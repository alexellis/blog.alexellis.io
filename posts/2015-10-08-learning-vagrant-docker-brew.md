---
title: "Learning open-source: Vagrant/Docker/brew"
slug: "learning-vagrant-docker-brew"
date: "2015-10-08T20:52:00Z"
author: "Alex Ellis"
meta_title: "Learning open-source: Vagrant/Docker/brew"
meta_description: "I've been learning open-source tooling around development and virtualisation including: docker, brew and vagrant. Here's my take on it. "
tags:
  - "docker"
  - "journal"
  - "brew"
  - "vagrant"
---

Over the last few weeks with the darker evenings and other things coming up I have been spending less time cycling and more time on tech. Here are some thoughts on three 'new' tools I've used.

#### Vagrant
I have only scratched the surface of Vagrant and Docker but they seem like really powerful tools especially when combined together. I've used Vagrant to manage VMs on my Macbook - suddenly the ugly UI of VirtualBox becomes completely hidden and abstracted away and we are left with a clean command line that lets scripting like this happen:

```
$ vagrant init ubuntu

$ vagrant up
 
$ vagrant ssh
```
Vagrant will go to a public repository and download an official image of Ubuntu and then set up a profile in Virtual Box and log you in with a private ssh key.
This is a much nicer experience than going through things manually and feels clean. The Vagrantfile is portable and powerful allowing different scripting and provisioning to happen to the image.

Why do I want a Linux VM on my Mac when I have a complete BSD-type system available? I maintain a dozen Raspberry PIs all running Linux so I want a portable sandbox and somewhere that I can try out different tools.
I also wanted to learn Docker in my spare time and a Linux kernel is a prerequisite for it.

#### Docker
[docker.io](http://docker.io/) can do a far better job of explaining this tool than I ever could, but I have found it very intriguing and it has captured the imagination of many big players. So much so that Microsoft is looking at native support for Windows 2016.

Its primary application is for isolating a Linux-compatible application in a so called _container_.  Containers are instances of images which we can define or fetch from a repository. They are built-up from lots of different scripted instructions and are immutable meaning that they can be torn down and set up again without persisting any changes made.

I have tried a few different scenarios below: 

* Running a Selenium grid for UI automation testing
* Running unit tests in any compatible language
* A CI server, like Jenkins pre-packaged and easily deployable 
* Providing web services or databases
* Performance/compatibility testing an application in different distributions of Linux

There are limits and restrictions to what a container can do and I don't think they are intended to be direct replacements VMs. The Docker blog even goes as far to suggest that this would be a misuse of the technology recommending that you do not install a text editor or ssh server. This may seem odd initially but there are good reasons in the blog entry. 

> Link:  [Why you don't need to run ssh in docker](http://blog.docker.com/2014/06/why-you-dont-need-to-run-sshd-in-docker/)

So close to anything that can be run as an application or service can be placed in a container. A container I may build to run my [energy usage monitor in node.js](https://github.com/alexellis/pimeter) could be distributed to someone with a Windows PC, Mac or Linux server and as long as they have a suitable bare metal Linux installation or Virtual Machine they can run my application. It should run exactly the same way as when I test it on my own environment. If I provide a Dockerfile then they also have a really simple way of customising the image in a repeatable and testable way. 

#### brew
`brew` it is a tool written in Ruby which acts like a package manager on Mac OS. It can be used to install many different open source applications either from source or binaries. I was cautious when installing it (not quite knowing what was going to happen to my system). I installed one inconspicuous program and it downloaded hundreds of megabytes of code and dependencies like openssl. Needless to say I removed that package and fetched a tiny archive from the project's Github repo instead. 
 
 A few examples that I've tried are:

* watch (yes this is missing)
* wget
* gnutar (the Mac OS version couldn't handle .xz files)
* atom.io editor
* Vagrant

Custom versions of files are placed in `/usr/local/bin/` by default:

```
El:~ alex$ which watch curl wget
/usr/local/bin/watch
/usr/bin/curl
/usr/local/bin/wget
El:~ alex$  
```

If you've found any of this useful or have spotted an error please let me know in the comments.