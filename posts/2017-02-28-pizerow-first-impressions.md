---
title: "Raspberry Pi ZeroW - First Impressions"
slug: "pizerow-first-impressions"
date: "2017-02-28T18:46:00Z"
author: "Alex Ellis"
meta_title: "Raspberry Pi ZeroW - First Impressions"
meta_description: "On the launch day I got my hands on a brand new ZeroW 1.3 with Bluetooth & WiFi. Join me as I give you a tour of the new case, camera cable and software"
tags:
  - "PIZero"
  - "Raspberry PI"
---

The inevitable has happened - the Raspberry PiZero has had not one revision, but two! I present you with the ZeroW, the next iteration of the 5USD micro-computer camera adapter, WiFi and Bluetooth all on-board.

> Here is a picture of the new board seated in its new Official case with camera cable.

![The new Zero](https://pbs.twimg.com/media/C5vomZZXQAAUGuS.jpg)

The price has increased from 5USD to 10USD, although most of us know this is not the landed price because tax and shipping bumps this up, it's still fantastic value. As you'll see in the following section - the new Official case and built-in WiFi eliminates mess and the need for dongles.

### New case

Here is the Zero seated in its brand-new official case with a new camera shim. You have three lids for the case each following the original design of the Pi 2/3 case.

* Camera eyelet
* Blanking plate
* GPIO access

Here's a photo taken with the Pi Zero inside its case while stuck to the side of my monitor.

The camera and zero friction fit themselves into the case without the need for screws.

![](https://pbs.twimg.com/media/C5xjuzUWcAAwW5_.jpg)

The lid fits snugly and keeps everything from moving around.

![](https://pbs.twimg.com/media/C5xj-QHXQAMuFCU.jpg)

This case is the missing link between a PiZero with camera connection and a usable time-lapse rig. This is what the old version looked like:

![Old PiZero with Camera Cable](https://pbs.twimg.com/media/C50fvy9WgAAZgRr.jpg:small)

### New connectivity

The main change here is the addition of a tiny reflective chip providing WiFi and Bluetooth.

![](https://pbs.twimg.com/media/C5xj1zLWMAARgJP.jpg)

This means no more dongles or USB shims. You no longer have to choose between Bluetooth or WiFi for your robot which is a huge plus.

OTG networking still works and is easy to setup, if you've not tried it yet you can use a single cable for network and power.

> [My PiZero OTG tutorial](http://blog.alexellis.io/docker-engine-in-your-pocket/)

**Set-up WiFi without a UI**

WiFi is easy to setup with the `wpa_passphrase` tool that is built-in.

```
usage: wpa_passphrase <ssid> [passphrase]

If passphrase is left out, it will be read from stdin
```

Follow the instructions, then add the output to the end of `/etc/wpa_supplicant/wpa_supplicant.conf`

Then reboot the Pi then type in `ifconfig wlan0` to see the IP address it was allocated by your router.

### New software

In order to support the new software changes Pixel and Jessie Lite both have been updated. The easiest option is to flash a new SD card with [Etcher.io](https://etcher.io)

You could try updating an existing Raspbian Jessie Lite card with:

```
$ sudo apt-get update && sudo apt-get install rpi-update
$ sudo rpi-update
$ sudo apt-get upgrade
```

You may want to run `raspi-config` to tweak your system settings and turn on the camera or increase the memory split between GPU and RAM.

The Bluetooth tool-chain is pre-installed, so if you type in `hciconfig` you should see the details of the Bluetooth adapter.

#### Black-belt stuff

Here's some black-belt level output from various system commands. Then we sum up with some next steps and talk about clusters.

**Kernel version**

```
pi@zerow:~ $ uname -a
Linux zerow 4.4.48+ #964 Mon Feb 13 16:50:25 GMT 2017 armv6l GNU/Linux
```

**lsusb**

```
Bus 001 Device 001: ID 1d6b:0002 Linux Foundation 2.0 root hub
```

**iperf**

```
iperf -c 192.168.0.x
------------------------------------------------------------
Client connecting to 192.168.0.x, TCP port 5001
TCP window size: 43.8 KByte (default)
------------------------------------------------------------
[  3] local 192.168.0.y port 35572 connected with 192.168.0.x port 5001
[ ID] Interval       Transfer     Bandwidth
[  3]  0.0-10.1 sec  34.5 MBytes  28.8 Mbits/sec
```

**/proc/cpuinfo**

```
$ cat /proc/cpuinfo 
processor	: 0
model name	: ARMv6-compatible processor rev 7 (v6l)
BogoMIPS	: 697.95
Features	: half thumb fastmult vfp edsp java tls 
CPU implementer	: 0x41
CPU architecture: 7
CPU variant	: 0x0
CPU part	: 0xb76
CPU revision	: 7

Hardware	: BCM2708
Revision	: 9000c1
Serial		: 00000000f15e7d58
```

**Temperature**

Did you know that you can find the temperature in milli-degrees through the filesystem like this? The Pi appears to be running at about 40c with the case shut and the camera module attached.

```
$ cat /sys/class/thermal/thermal_zone0/temp 
40084
```

### ZeroW cluster!

Yes the ZeroW means we can now build PiZero clusters and Docker Swarms without having extra dongles or clutter. There is still a limit of one PiZeroW per customer, but you will find there are several online stores that stock them.

If you're not sure what to run on your RPi swarm then star or fork these two projects on Github:

* [Serverless / Functions as a Service](http://github.com/alexellis/faas)

* [Docker Swarm Mode tests](http://github.com/alexellis/swarmmode-tests/)

Stay tuned for my ZeroW [Docker Swarm](https://www.youtube.com/watch?v=9m352pAoaow&index=9&list=PLlIapFDp305D06X8xaLBKPRabDM2zgAFe&t=14s) which will look a little like this..

![](https://scontent-lhr3-1.cdninstagram.com/t51.2885-15/e35/16789758_101287963735184_2000864992206782464_n.jpg)

If anyone wants to help me with this project, I'd gladly take donations of ZeroW units. Installing Docker is as simple as typing in `curl -sSL get.docker.com | sh` then follow one of my tutorials below [to get started](https://www.youtube.com/watch?v=7YlvS8YOnrY).

Here's my Docker Swarm video as featured on HiveMind and [RaspberryPi.org's blog](https://www.raspberrypi.org/blog/docker-comes-to-raspberry-pi/):

<iframe width="560" height="315" src="https://www.youtube.com/embed/9m352pAoaow?list=PLlIapFDp305D06X8xaLBKPRabDM2zgAFe" frameborder="0" allowfullscreen></iframe>

#### Next steps

Head over to the [Raspberry Pi Foundation's blog post](https://www.raspberrypi.org/blog/raspberry-pi-zero-w-joins-family/) and find a store near you.

**Learn more**

Get inspired for your next cool hack or weekend project with these tutorials suited for the Pi Zero and Docker.

* [Hands-on video Docker on Raspberry Pi](https://www.youtube.com/watch?v=7YlvS8YOnrY)

* [Create a hardened Raspberry Pi NAS](http://blog.alexellis.io/hardened-raspberry-pi-nas/)

* [Create an Environmental Monitoring Dashboard](http://blog.alexellis.io/environmental-monitoring-dashboard/)

**Subscribe and share**

[YouTube channel](https://www.youtube.com/channel/UCJsK5Zbq0dyFZUBtMTHzxjQ)

[Twitter @alexellisuk](https://twitter.com/alexellisuk)
<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">I share my first impressions as I kick the tires of the new <a href="https://twitter.com/Raspberry_Pi">@Raspberry_Pi</a> <a href="https://twitter.com/hashtag/PiZeroW?src=hash">#PiZeroW</a> and its slick official case. <a href="https://t.co/zutcFIZTU7">https://t.co/zutcFIZTU7</a> <a href="https://t.co/TUkTrrGyvZ">pic.twitter.com/TUkTrrGyvZ</a></p>&mdash; Alex Ellis (@alexellisuk) <a href="https://twitter.com/alexellisuk/status/836660008620175361">February 28, 2017</a></blockquote> <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>