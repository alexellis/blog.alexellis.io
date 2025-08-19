---
title: "Raspberry PI Collection"
slug: "raspberry-pi-collection"
date: "2015-04-01T12:31:08Z"
author: "Alex Ellis"
tags:
  - "Raspberry PI"
  - "Arch Linux"
  - "PiWars"
  - "IoT"
  - "UNIX"
  - "sensors"
  - "robotics"
---

The other day I had a conversation with a colleague in the US who had never heard of a Raspberry PI - so if that's you then this won't make a lot of sense. Go over to the: [Raspberry PI Foundation](http://raspberrypi.org/).

### My First PI
My first PI was an original Model B with 256mb of RAM. I loaded it up with the de facto Raspbian Linux distribution then plugged it into my TV and started exploring the system. I started up the UI with the familiar `startx` command and in the timeless words of the Jurassic Park film:
> It's a UNIX system, I know this!

My introduction to Linux came in 1999 when I loaded RedHat 6.0 onto the family computer from a 'free CD' that was sent to me from the US. Since then I've always had at least one computer with Linux running. 

I was expecting to be able to browse my favourite websites like: Facebook, Flickr, Strava and Gmail - it didn't take me long to realise that this wasn't going to happen. Everything took dozens of seconds to load up and scrolling was near impossible - I was disappointed and after playing a bit with the command line put it away in a drawer. 
It sat there unused for around a year until one day I bought the GPIO expander kit with some LEDs/resistors and connected to the PI over SSH, bypassing the UI. I followed a simple exercise on Adafruit's website for switching on and off LEDs - it was really empowering to be able to control electronics from code. 
>Something clicked, the LEDs were like a gateway-drug 

Something clicked, the LEDs were like a gateway-drug and I'd found an awesome use for my PI. This lead on to buying many more sensors and electronic components such as infra-red sensors, ultrasonic rangefinders, motor controllers and temperature sensors. Many of these can be bought for £1-2 on eBay from China, or locally in the UK for 2-3 times the price. 
#### My collection grew:

* Robo PI - a robot built around an old repurposed-RC car. I used a Model A, python and a wiimote to drive it around. It debuted at the first Pi Wars and won the prize for best non-competing robot.
![Version 1 of the Robo PI](/content/images/2015/03/10670272_10154918246430593_1459713529662451915_n.jpg)

* Rover PI - after being inspired by the Dagu Rover robot platform at PI Wars I bought one of my own for Christmas and this is driven by a Model A+. It also features the official infrared camera. 

* Gateway PI - a Model B+ acts as a secure gateway to my home network with a large 2TB HDD running 24/7. It has the standard camera attached for timelapse photography. 

* My original Model B is connected to a PIR at my mother's house and gets triggered by the cat. It also has a USB pen-drive attached where I can have off-site backups of files.

* Lounge PI - I connected a PIR and a Dallas 1-wire temperature sensor to an original Model A Raspberry PI, this has been running 24/7 for about 18 months. I extended it to use an ultrasonic sensor mounted on a pan/tilt sensor - making it look like it had a little face and two huge eyes. After playing with this setup and trying out 'sonar room scans' I bought a stackable acrylic case and downsized to just the PIR and temperature sensor. It's now very neat and tidy.

![The Lounge PI](/content/images/2015/03/10420363_10155278612165593_736573479382156174_n.jpg)

* Quad PI Web Server - this website  [is currently hosted on a quad-core Raspberry PI Model B 2](http://quad.ae24.space/welcome-to-ghost/) - I also tried installing the software onto the original Model B - it was very slow so I'd recommended the newer model. 


I also have a spare Model A+ PI which I have run for up to 12 hours on batteries for various experiments like measuring temperature in my garage/shed. Most recently I used it for a night-sky timelapse where I captured Orion's belt and then the Big Dipper, see below.
![Big dipper as seen from my pond](/content/images/2015/03/2015_3_22_23_1427067151674-copy.jpg)

#### Too many PIs?
How many PIs are too many? I'm not sure, but I'm not at the limit yet. With each of the PIs drawing 1-2W+ of power depending on the activity the cost of running one 24/7 is very low and that means it's cheap and easy to add more. 
Now with great PIs comes great responsibility: I now have the prospect of maintaining, updating and processing the data from half a dozen computers. I've started to branch out and look into Arduino micro-controllers for some of my experimentation and project ideas. They take much less power to run 20mA @ 5v vs 150-200mA at 5v and are much cheaper to buy, £1.50 vs £15-30. Keep up to date with the blog to see what's coming next.