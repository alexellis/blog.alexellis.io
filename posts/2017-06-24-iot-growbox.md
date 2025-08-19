---
title: "Build a budget IoT Grow-box with your Raspberry Pi"
slug: "iot-growbox"
date: "2017-06-24T16:09:00Z"
author: "Alex Ellis"
meta_title: "Build a budget IoT Grow-box with your Raspberry Pi"
meta_description: "Build your own budget IoT grow-box to broadcast whatever seeds you want to grow live on Twitter. The code is in Python and open-source, what will you grow?"
feature_image: "/content/images/2017/06/green-dash.jpg"
tags:
  - "Raspberry PI"
  - "weekend build"
  - "projects"
  - "IoT"
  - "green"
  - "picamera"
---

In this guide I'll show you how to build an Internet of Things (IoT) grow-box that will share the progress of your plants growing live on the internet via Twitter.

> This is a perfect project for the summer holidays or for a weekend project for kids and adults too.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Internet of Seeds Mark II - <a href="https://t.co/S0dqewXqXD">https://t.co/S0dqewXqXD</a> <a href="https://t.co/f6CI7wc0cN">pic.twitter.com/f6CI7wc0cN</a></p>&mdash; Alex the Bot (@alexellisuk_bot) <a href="https://twitter.com/alexellisuk_bot/status/875624015494127616">June 16, 2017</a></blockquote> <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

*Official Raspberry Pi [PiNoir](http://uk.rs-online.com/web/p/video-modules/9132673/) camera shooting in infra-red*

If you already have a Raspberry Pi camera it should only cost you a couple of pounds or dollars to complete the project. I've started off growing cress in some compost and a plastic saucer, but what will you grow?

#### Where did the idea come from?

I've been making timelapses with my Raspberry Pi since the first camera module was released several years ago, but I always had the same problem - positioning. I could never find a good way to mount the RPi camera which resulted in my using copious amounts of sticky tape.

> To cut a long story short - this often left permanent marks on my windows or lots of sticky residue before falling off or moving.

Last year I tried broadcasting seeds growing on the Internet via Twitter. This worked well and was even re-tweeted by the Raspberry Pi Foundation but the camera was just propped up on a peg. It could have moved and ended up and sharing the inside of our house instead.

> I decided to hack a stackable storage box which I bought at a store in the UK called Poundland (everything costs £1 which is around a dollar).

I fixed the camera onto the storage box with screws meaning 
we get a fixed position and have created a kind of photo studio.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Hacking on <a href="https://twitter.com/hashtag/InternetOfSeeds?src=hash">#InternetOfSeeds</a> Mark II with my <a href="https://twitter.com/Raspberry_Pi">@Raspberry_Pi</a> - here&#39;s a test live-stream of my cress. 0$ approach to creating an enclosure <a href="https://t.co/hyujO6EuNV">pic.twitter.com/hyujO6EuNV</a></p>&mdash; Alex Ellis (@alexellisuk) <a href="https://twitter.com/alexellisuk/status/873987811900370945">June 11, 2017</a></blockquote> <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

This is a budget build, so there were no special jigs or colourful slices of laser-cut acrylic. I used a tiny finger drill I bought on eBay to make mounting holes for the Pi Camera and Pi Zero. Once I knew where the camera's lens was going to be positioned I drilled a hole then widened it with a pair of scissors.

> Be especially careful if you are handling scissors or a hand-held electric drill. 

#### Build your own

**Materials:**

* Stackable plastic box (£1 / $1)
* Raspberry Pi ZeroW w/ SD card
* Power adapter
* Raspberry Pi camera - colour or NoIR
* Assorted screws and nuts to fit Pi and Camera

If your power adapter doesn't reach from the plug to where you want to place your grow-box then you can use an extension lead or a power adapter with a longer cord.

**Software**

The code for the grow-box is written in *Python* using the `picamera`, `tweepy` and `PIL` (Python Imaging Library) modules.

The code does the following:

* Takes a photo in 1080p resolution
* Overlays the current CPU temperature in the top left of the image
* Saves the images to the SD card
* Tweets the photo including a short message
* Deletes the image from the SD card

> I've provided a cron configuration to run every 60 seconds between 8am and 8pm every day, but you can tweak that.

Before you can get Tweeting you'll need to sign up for a Twitter Application / Developer code so that your Pi can Tweet on your behalf. If you've ever used a project with `tweepy` before then you can re-use the same token and secret. Just fill out the details in a file called `config.py` - you'll find a sample called `config.example.py` that you can copy from.

[Fork or Star the code on Github](https://github.com/alexellis/seeds2) so you can follow the README later when you're ready to start the build.

#### What next?

**Fine-tuning**

Once you have everything up and running you may need to change the focus of the camera so that your plants look clear and sharp. There are a number of ways of changing the focus of the lens - either with a pair of pliers or a large eraser.

Apply gentle rotational pressure until you feel the glue holding the lens in position give way - you can now turn left or right to bring your plants into focus.

A good way to get a live preview of your camera is to follow my [YouTube live streaming guide](http://blog.alexellis.io/live-stream-with-docker/) - it only takes around 5-10 minutes to get started.

**Deciding what to grow**

Here's some suggestions for what you could grow indoors at any time of year:

* Dried peas
* Cress
* Lettuce or rocket (arugula in the US)
* Mustard

If you want to experiment you could also try planting pop-corn, lentils or apple seeds.

You could test compost against wet kitchen roll to see which yields a better crop.

> Update 03 July 2017: Here are pea shoots (Pea Serge variety) which produce edible leaves when young:

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Internet of Seeds Mark II - <a href="https://t.co/S0dqewFQ65">https://t.co/S0dqewFQ65</a> <a href="https://t.co/I1LoHy42Fv">pic.twitter.com/I1LoHy42Fv</a></p>&mdash; Alex the Bot (@alexellisuk_bot) <a href="https://twitter.com/alexellisuk_bot/status/881890308732203008">July 3, 2017</a></blockquote> <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

**Sharing**

When you're ready and your grow-box is busy tweeting away - you can share it with your friends and family and keep and eye on when your plant is ready.

Here's an example of a Broad Bean germinating by Richard Gee who is one of my [Twitter followers](https://twitter.com/rgee0):

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Internet of pulses <a href="https://twitter.com/hashtag/InternetOfPulses?src=hash">#InternetOfPulses</a> <a href="https://t.co/s2GlGpT8LE">pic.twitter.com/s2GlGpT8LE</a></p>&mdash; RGee0 Test (@rgee0T) <a href="https://twitter.com/rgee0T/status/881892834747527168">July 3, 2017</a></blockquote> <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

**Extending the project**

Here are a few ideas for extending the project:

* Record environmental data on each photo

If you pick up a [Pimoroni Enviro-pHat](https://shop.pimoroni.com/products/enviro-phat) you can record temperature, humidity, light and pressure at the same time. A [Bosch BME280](https://shop.pimoroni.com/products/adafruit-bme280-i2c-or-spi-temperature-humidity-pressure-sensor) sensor can be extended on dupont wires and placed inside the box to take more accurate readings.

* Automatic watering

With a [low voltage water pump](http://www.robotshop.com/uk/3v-mini-vacuum-pump.html) and a cheap rain-sensor you can create a feedback-loop and automatically water your seeds when they get dry.

* Use a grow-light

You could buy an infra-red growing light so you can take photos at night, or get your crop quicker

* Use other social media channels

If you're a member of a Slack community or have an Instagram account - maybe you extend the code to upload there instead.

#### Keep learning

If you would like to learn about more Raspberry Pi projects I have a series here:

* [Raspberry Pi projects and tutorials](http://blog.alexellis.io/tag/raspberry-pi/)

You can also [live stream to YouTube](http://blog.alexellis.io/live-stream-with-docker/) or [record a timelapse](http://blog.alexellis.io/raspberry-pi-timelapse/).

If you'd like to learn how to create your own blog and host it on a Raspberry Pi checkout my self-hosted blog series:

* [Self-host a Ghost blog](http://blog.alexellis.io/tag/blog/)

[Follow me @alexellisuk](https://twitter.com/alexellisuk) and get in touch on [Twitter](https://twitter.com/alexellisuk) or in the comments section below with your questions and suggestions.

**Share on Twitter**

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Build an IoT Grow-box on a budget for the holidays with your <a href="https://twitter.com/Raspberry_Pi">@Raspberry_Pi</a> and Python. <a href="https://t.co/gRWtDDOVGB">https://t.co/gRWtDDOVGB</a> <a href="https://t.co/3NEk5oxvIE">pic.twitter.com/3NEk5oxvIE</a></p>&mdash; Alex Ellis (@alexellisuk) <a href="https://twitter.com/alexellisuk/status/878649599593938944">June 24, 2017</a></blockquote> <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>