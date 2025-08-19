---
title: "Cooling off your Raspberry Pi 4"
slug: "cooling-off-your-rpi4"
date: "2019-11-14T21:49:16Z"
author: "Alex Ellis"
meta_title: "Cooling off your Raspberry Pi 4"
meta_description: "Read up about how you can cool off your Raspberry Pi 4 and drop a few degrees. I compare several cooling solutions including firmware updates."
feature_image: "/content/images/2019/11/landscape-photography-of-mountains-covered-in-snow-691668-crop.jpg"
tags:
  - "Raspberry PI"
  - "k3sup"
  - "cooling"
  - "inlets"
---

I was very excited about the [Raspberry Pi 4](https://www.raspberrypi.org/products/raspberry-pi-4-model-b/), especially when I learned that it was available with 4GB of RAM - perfect for running a Kubernetes cluster using software like [k3s.io](https://k3s.io) and [kubeadm](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/). There's a number of options I've tried to add cooling to my Raspberry Pi and I thought I'd list them here, how effective they are, and what the cost of each option is. I'll also tell you about a firmware update that may shave off a degree or two.

## Observing the temperature

Here's a very rudimentary way to observe the temperature of the RPi

```
while [ true ] ; do sleep 2 && sudo sudo /opt/vc/bin/vcgencmd measure_temp ; done

temp=32.0'C
temp=33.0'C
temp=31.0'C
```

If you want to check how idle your system is, run `uptime` or `htop` and look at the values returned, they should be very low. If they are much over 0.1, then checkout what's eating up your CPU cycles with `htop` and sort by CPU usage.

## Cooling off

Let's look at a few of the options for cooling off. If you think I've missed something, then please [reach out over Twitter](https://twitter.com/alexellisuk/).

### The Pimoroni heatsink

Pimoroni have a very cheap heatsink which you can order when you purchase your RPi. It looks like this, and can shave off a degree or two at idle.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">I just got a TLS certificate for my RPi4 over my home network, connected to tethered WiFi and it&#39;s serving the same site with HTTPS. Some magic with cert-manager, k3s, and inlets-pro. <br><br>Find out more in San Diego 😎<a href="https://t.co/ioYDerQ52u">https://t.co/ioYDerQ52u</a> <a href="https://t.co/Fxes5KrW8V">pic.twitter.com/Fxes5KrW8V</a></p>&mdash; Alex Ellis (@alexellisuk) <a href="https://twitter.com/alexellisuk/status/1194650574320492544?ref_src=twsrc%5Etfw">November 13, 2019</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

The heat will be spread out, but not moved away from the device, so once it's hot, it will likely radiate that heat around the board.

You can't argue with 2.40 GBP - https://shop.pimoroni.com/products/raspberry-pi-4-heatsink

### Pimoroni fan shim

This option does apply a decent amount of cooling at idle and under load, it also moves the heat away from the board unlike the heatsink.

![](https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcQl6mZoKV3sNtSsSO17N6ewpJmVChT7qtn-FEbn0jaaF_CXhs1ULwXuRW8RbTt_lDsOAng_9gYF3g&usqp=CAc)

I found the assembly very fiddly, and was worried about breaking its attachments, once attached it worked fine, and I even tried it with [the custom-designed case](https://shop.pimoroni.com/products/pibow-coupe-4?variant=29210100170835).

> Checkout a detailed [thermal overview from Pimoroni](https://blog.pimoroni.com/raspberry-pi-4-thermals-and-fan-shim/) on the fan shim vs. the heatsink.

Check it out from 9.60 GBP - https://shop.pimoroni.com/products/fan-shim

### Heatsink case

This is not the most effective option, we'll see that next, but it is good at reducing the overall heat. It looks fantastic, and is practical on the go because it is also a case.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">All kitted-out for my <a href="https://twitter.com/rejektsio?ref_src=twsrc%5Etfw">@rejektsio</a> talk with this great case and heatsink for my RPi4 from <a href="https://twitter.com/pimoroni?ref_src=twsrc%5Etfw">@pimoroni</a> <br><br>See you Saturday! <a href="https://twitter.com/inletsdev?ref_src=twsrc%5Etfw">@inletsdev</a> <a href="https://t.co/ve8lQi1bGp">pic.twitter.com/ve8lQi1bGp</a></p>&mdash; Alex Ellis (@alexellisuk) <a href="https://twitter.com/alexellisuk/status/1195090213133070344?ref_src=twsrc%5Etfw">November 14, 2019</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

I feel it may be rather overpriced, but at least it comes in several colours. It's solid, and under load gets warm all over.

Check it out from 12 GBP - https://shop.pimoroni.com/products/aluminium-heatsink-case-for-raspberry-pi-4?variant=29430673178707

### ICE cooling tower

Here's my top pick, which can get a mostly idle k3s cluster down to 31c in no time. It lights up my whole office with blue light and has a subtle, but constant hum.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Keeping nice and cool, an ice tower fan from <a href="https://twitter.com/seeedstudio?ref_src=twsrc%5Etfw">@seeedstudio</a><br><br>Just 28-30.0&#39;C with <a href="https://twitter.com/hashtag/k3s?src=hash&amp;ref_src=twsrc%5Etfw">#k3s</a> installed with k3sup.<a href="https://twitter.com/Raspberry_Pi?ref_src=twsrc%5Etfw">@Raspberry_Pi</a> <a href="https://twitter.com/hashtag/rpi4?src=hash&amp;ref_src=twsrc%5Etfw">#rpi4</a> <a href="https://twitter.com/hashtag/cooling?src=hash&amp;ref_src=twsrc%5Etfw">#cooling</a> <a href="https://twitter.com/hashtag/hardware?src=hash&amp;ref_src=twsrc%5Etfw">#hardware</a> <a href="https://twitter.com/hashtag/iot?src=hash&amp;ref_src=twsrc%5Etfw">#iot</a> <a href="https://twitter.com/hashtag/edge?src=hash&amp;ref_src=twsrc%5Etfw">#edge</a> <a href="https://twitter.com/Rancher_Labs?ref_src=twsrc%5Etfw">@Rancher_Labs</a> <a href="https://t.co/vUGFMb1sJF">https://t.co/vUGFMb1sJF</a> <a href="https://t.co/YdNr814KUe">pic.twitter.com/YdNr814KUe</a></p>&mdash; Alex Ellis (@alexellisuk) <a href="https://twitter.com/alexellisuk/status/1184863177202438145?ref_src=twsrc%5Etfw">October 17, 2019</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

Check it out from 19.90 USD - https://www.seeedstudio.com/ICE-Tower-CPU-Cooling-Fan-for-Raspberry-pi-Support-Pi-4-p-4097.html

After attaching this fan and heatsink, you cannot use a case of any form or a base-plate. It probably is best left in once place for that reason. I would like to see Seeed Studio come up with something to place the RPi on.

### Try the new firmware update

You can update the RPi's [firmware as detailed here](https://www.geeks3d.com/20191101/raspberry-pi-4-new-firmware-reduces-power-consumption-and-boards-temperatures/), and it may shed a few degrees depending on what cooling solution you're already using.

> Note: you follow these instructions at your own risk.

Here's what you need to do:

* Update

```
sudo apt update && sudo apt upgrade -qy --no-install-recommends
```

* Reboot `sudo reboot` (don't skip this)

* Add the `rpi-eeprom-update` package

```
sudo apt install rpi-eeprom  -y
```

* Update

```
sudo rpi-eeprom-update
```

You should see output like "update required"

* Reboot `sudo reboot` (don't skip this)

Updating didn't appear to cause an issues for [Docker](https://docker.com/) or k3s, but I wouldn't recommend running `rpi-update` since that has usually caused issues for containers.

## Wrapping up

I've listed the ways I've tried to cool my RPi and given you some links where you can go and purchase your own solutions. The lowest temperature I observed was with the combination of the ICE Tower fan and the firmware update, after stopping k3s and containerd, the temperature got down to 28c. 

I prefer the heatsink case for its balance of form and function, here's a graph from Pimoroni showing that it may be enough to stop the RPi from applying CPU throttling in most circumstances.

<blockquote class="twitter-tweet" data-conversation="none"><p lang="en" dir="ltr">This graph should give you a decent picture. The passive cooling from these cases is enough to stop your Pi 4’s CPU throttling in most conditions. <a href="https://t.co/qBQgG79Xum">pic.twitter.com/qBQgG79Xum</a></p>&mdash; pimoroni (@pimoroni) <a href="https://twitter.com/pimoroni/status/1195240936672055296?ref_src=twsrc%5Etfw">November 15, 2019</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

Follow me on [Twitter @alexellisuk](https://twitter.com/alexellisuk/) to make sure you never miss a post.

Here's some other related content you may like with your new cooler, RPi:

* Try my new blog post - [Kubernetes Homelab with Raspberry Pi and k3sup](https://blog.alexellis.io/raspberry-pi-homelab-with-k3sup/)

* [`k3sup` ("ketchup")](https://k3sup.dev/) which can be used to install k3s to any computer, or VM and to install popular apps like Nginx, [OpenFaaS](https://www.openfaas.com) and [cert-manager](https://github.com/jetstack/cert-manager).

* [`inlets`](https://github.com/inlets/inletsctl) - [inlets OSS](https://github.com/inlets/inlets) and inlets-pro can create HTTPS/TCP tunnels from your RPi to a computer with a public IP address, think of it like a poor-man's reverse SSH tunnel, or a free, OSS version of [ngrok](https://ngrok.com).

See also: **new** [Official: Thermal testing Raspberry Pi 4](https://www.raspberrypi.org/blog/thermal-testing-raspberry-pi-4/)