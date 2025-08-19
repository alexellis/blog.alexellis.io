---
title: "Never too early for a Christmas IoT"
slug: "christmas-iot-tree"
date: "2016-11-28T11:53:23Z"
author: "Alex Ellis"
meta_title: "Never too early for a Christmas IoT"
meta_description: "Let's build an IoT Christmas tree with the Amazon Alexa service, an Echo Dot, a Raspberry Pi and Python. Christmas is coming with NeoPixel style!"
feature_image: "/content/images/2016/11/g.jpg"
tags:
  - "IoT"
  - "hacks"
  - "christmas"
---

It's the 28th of November but since the Christmas edition of the [MagPi magazine](https://www.raspberrypi.org/magpi/) is already out it must be OK to start decorating the house for Christmas, especially if a [Raspberry Pi](http://stockalert.alexellis.io/) and LEDs are involved.

### The video

<iframe width="560" height="315" src="https://www.youtube.com/embed/u4aIFOdGP2k" frameborder="0" allowfullscreen></iframe>

Here is the bill of materials:

* 1x Mini Christmas tree (from Wilko's) in UK - £4
* 1x Decorative plate (from Wilko's) - £2.50
* 3x dupont jumper wires
* 1x [Pi Zero](http://stockalert.alexellis.io/), SD card and Wifi
* 1x 1m strip of NeoPixels with 60 LEDs (from eBay, also goes by name of "WS2811/b")

### Schematic

Plug the DIN pin from the NeoPixel or strip into Pin 18 and then connect 5v to 5v on the Pi and GND to GND on the Pi.

![Schematic](/content/images/2016/11/schematic_b.png)

*Image created with [Fritzing](http://fritzing.org/home/)*

### Measuring the load
<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Thanks to <a href="https://twitter.com/pimoroni">@pimoroni</a> for the expert advice. My Alexa-controlled <a href="https://twitter.com/Raspberry_Pi">@Raspberry_Pi</a> Christmas is only drawing 0.5A and it&#39;s super bright <a href="https://twitter.com/hashtag/led?src=hash">#led</a> <a href="https://t.co/bTlMAxSarz">pic.twitter.com/bTlMAxSarz</a></p>&mdash; Alex Ellis (@alexellisuk) <a href="https://twitter.com/alexellisuk/status/802958305182281728">November 27, 2016</a></blockquote> <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

An engineer (and even Adafruit) would recommend that you use a logic level converter so that the Pi outputs a 5v and not a 3.3v control signal. They would also recommend using a separate 5v DC power supply. This means adding a breadboard and lots of extra wiring.

I checked with the folks at Pimoroni about how their [UnicornHAT](https://shop.pimoroni.com/products/unicorn-phat) works and it turns out that as long as the current draw is safely below 1A things will probably be OK. I connected my multi-meter in series with the NeoPixels and measured 0.85A at 100% brightness. Pimoroni's Jon said this means things will probably be OK with my 60 LED NeoPixel strip.

> You should probably measure the output of your tree with a multi-meter before attempting this build and please don't leave your lights unattended. 

### How does it work?

I've programmed my custom Alexa Skill to recognise three seasonal phrases and then send a message over MQTT to the Pi. These are defined in [speechAssets](https://github.com/alexellis/alexa-demos/tree/master/alexa-neopixels/speechAssets) - part of the Alexa Skill SDK.

* Alexa tell Christmas Tree to change to red/green/blue
* Alexa tell Christmas Tree to turn off
* Alexa tell Christmas Tree to set brightness to 60 percent


![Conceptual architecture](/content/images/2016/11/Iot.png)

Each phrase is parsed as an "utterance" and then simple Node.js [code](https://github.com/alexellis/alexa-demos/blob/master/alexa-neopixels/src/index.js) runs on Amazon Lambda's serverless system and sends a message to a specific MQTT channel. My Raspberry Pi is constantly monitoring that channel for instructions and as soon as something comes in - it will act on it.

MQTT means that there doesn't have to be a direct link to the Pi from the Alexa service. It's a common protocol for IoT and can even support two-way communication such as in my [Envirophat video](https://www.youtube.com/watch?v=wY7jueCdBg8).

The code on my Raspberry Pi runs in a Docker container which I've also pushed up to the Docker hub. To try that portion of the code out you only have to install Docker and run my image. Here's my [Dockerfile](https://github.com/alexellis/alexa-demos/blob/master/alexa-neopixels/pi/Dockerfile) and the [Python code that receives messages and drives NeoPixels](https://github.com/alexellis/alexa-demos/blob/master/alexa-neopixels/pi/app.py).

For more on Docker, check out my [Hands-on video introduction to Docker](http://blog.alexellis.io/hands-on-docker-raspberrypi/) below for the Raspberry Pi.

### Can I try it out?

Yes! You can still create an LED Christmas tree even if you don't have an Echo/Dot, it's optional but a great addition.

> My wife said: when I walk down in the morning I say "Alexa ask the christmas tree to change to red" and then ask her to turn them off when I leave the house for work!

Follow the instructions on [Github](https://github.com/alexellis/alexa-demos) or fork/star [the repo](https://github.com/alexellis/alexa-demos) for a rainy day. If you're not used to working with the Alexa SDK here are a few links into the code.

* [Speech assets](https://github.com/alexellis/alexa-demos/tree/master/alexa-neopixels/speechAssets)
* [Node.js MQTT color transmitter](https://github.com/alexellis/alexa-demos/blob/master/alexa-neopixels/src/sendColor.js)
* [Raspberry Pi - Python MQTT code](https://github.com/alexellis/alexa-demos/blob/master/alexa-neopixels/pi/app.py)
* [Dockerfile](https://github.com/alexellis/alexa-demos/blob/master/alexa-neopixels/pi/Dockerfile)

> The MagPi have written a blog post about my build over at [raspberrypi.org](https://www.raspberrypi.org/magpi/echo-dot-christmas-tree/) - thanks very much!

Follow me [@alexellisuk](https://twitter.com/alexellisuk) on [Twitter](https://twitter.com/alexellisuk) and send me a photo of your Christmas IoT hacks!

#### What's Docker?

Check out my [video introduction on Docker](http://blog.alexellis.io/hands-on-docker-raspberrypi/) which takes you from a blank SD card to running an Internet of Things doorbell. 

### This blog post in 2020

If I were writing this post again, in 2020, I would probably have hosted the function on [faasd](https://github.com/openfaas/faasd) on the Raspberry Pi itself. Then to expose it to webhooks from the Alexa service, I would have exposed the endpoint using [inlets](https://inlets.dev) which is similar to Ngrok, but self-hosted and has no artifical rate-limits.