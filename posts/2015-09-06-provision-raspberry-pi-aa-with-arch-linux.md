---
title: "Provision the Raspberry PI with Arch Linux"
slug: "provision-raspberry-pi-aa-with-arch-linux"
date: "2015-09-06T20:53:13Z"
author: "Alex Ellis"
tags:
  - "tutorial"
  - "Arch Linux ARM"
  - "provision"
  - "bare-metal"
  - "linux"
  - "Raspberry PI"
  - "Arch Linux"
---

I am primarily writing this article for the Raspberry PI A/A+ but this guide also applies to any of the other models. The PI A+ is a very cheap and powerful model and for some the most important factor is its low power consumption. Perhaps you have an original model A or are interested in a cheap second PI - they can be found for around £15 new including postage. 

Arch Linux is a great alternative to the Raspbian distribution for power users and those who want a minimal base system. The boot-up time really is impressive and it's one of the main reasons I use it for my robots.
Unfortunately as of early 2014 the distribution maintainers no longer provide a downloadable disk image. They do provide an archive of a base image which can be installed on an SD card to make it bootable. 

### Getting started
We first want to go over to the homepage of the Arch Linux ARM page (ALARM) and click 'Installation Instructions':

For PI A+/A/B/B+
http://archlinuxarm.org/platforms/armv6/raspberry-pi

For PI Model B 2
http://archlinuxarm.org/platforms/armv7/broadcom/raspberry-pi-2

An overview of the steps you will take:

* Use wget to pull down the latest base system archive
* Clear out the SD card with fdisk
* Create a boot partition with dos format and a ext4 for the rest of the space
* Create file systems on the partitions
* Mount the new partitions and expand the files
* Don't forget to populate the boot partition and type `sync` to complete the process.

At this point you could eject the SD card and boot the system - but you will find a problem arises when you try to connect to the network. There is no ethernet connection and you have no packages in the base system to configure wi-fi. Arch's base image really is _minimal_.

* Download the following packages from the Arch mirror (i.e. http://de4.mirror.archlinuxarm.org/arm/core/) and copy them to the SD card in /root/temp.
 * `dialog, libnl, wpa_supplicant, wpa_actiond`
* While you are here - get a USB hub ready because you will need to use a keyboard at the same time as your wi-fi dongle to authenticate to your router/access point.
* Optionally edit `/etc/hostname` before booting the system

Plug everything in and log in with the default username/password. Type `pacman -U /root/temp/*.xz` and let the packages get installed.

To connect to the network wifi-menu and select to your access point.

You would think that the wifi will start on the next boot -- but it won't so we can't go 'headless' yet. Type `netctl list` - find your network and type in `netctl enable network_name`.

Find your IP address with `ipconfig` and then check sshd is enabled and running with `systemctl enable sshd` followed by going to another machine and attempting to connect in. systemctl enable ensures the service will be active on next boot.

Before unplugging everything it is worth doing a quick reboot to make sure your wi-fi network profile started automatically. 

### Headless
Now that you have headless operation in place install your favourite tools and packages with: `pacman -Sy package_name` and probably once per week do a full update with `pacman -Syu` - while it is possible to leave this longer it is not advisable due to the sheer amount of updates that are released. 

#### Tasks for your PI/node
* Ambient temperature logging - through 1 wire Dallas sensor
* PIR motion sensing combined with a python script and RPi.GPIO library
* Logging of ambient temperature
* Add a USB hub and some USB disks/drives
* Run a small website with node.js or a microframework such as Python Flask
* Monitor the soil moisture levels of a plant in your house
* Database server, perhaps MongoDB if you are running a PI 2.

There are countless other possiblities - Google, Instructables and the Raspberry PI forum are all good places to browse for ideas. 

#### Packages I like to install
* nodejs and npm
* python and python-setuptools
* base-devel - development tools
* curl and wget
* cronie (cron) for scheduling tasks
* nginx to set up a quick web site

I would advise buying a small case and then you can find a permanent home for the PI - hidden away behind the TV, by your internet router or perhaps in your attic?

Any questions - let me know in the comments.