---
title: "Smart cycling with Arduino"
slug: "arduino-for-bikes"
date: "2015-09-18T08:07:33Z"
author: "Alex Ellis"
tags:
  - "arduino"
  - "sensors"
---

I enjoy cycling regularly whether it is to get around town, commuting, for leisure or for fitness. Occasionally I think about combining this with a microcontroller such as the Arduino Nano or a Raspberry PI.

The obvious place to go with this theme is a bike 'speedometer' and GPS. I'm sure this would be a fun exercise and opens up lots of possibilities for taking the concept beyond what is provided commercially.

* Speedo/GPS

A magnetic hall effect sensor can be bought for under a pound and would allow us to read wheel rotation speed and crank revolutions - so cadence.

A relatively cheap GPS is available which can be connected over the serial lines - RX/TX. In this case I'd try the Neo 6M - which I have seen for £7-9. 

A small 2-3" OLED display or 16x2 Hitachi LCD could be used for up-front information on the cockpit. Or LEDs and vibration motors could provide an alternative form of feedback.

Here is my version of a speedo with audio feedback on every rotation of the wheel and a pulsing LED. 

<blockquote class="instagram-media" data-instgrm-captioned data-instgrm-version="4" style=" background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:658px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);"><div style="padding:8px;"> <div style=" background:#F8F8F8; line-height:0; margin-top:40px; padding:50.0% 0; text-align:center; width:100%;"> <div style=" background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAMAAAApWqozAAAAGFBMVEUiIiI9PT0eHh4gIB4hIBkcHBwcHBwcHBydr+JQAAAACHRSTlMABA4YHyQsM5jtaMwAAADfSURBVDjL7ZVBEgMhCAQBAf//42xcNbpAqakcM0ftUmFAAIBE81IqBJdS3lS6zs3bIpB9WED3YYXFPmHRfT8sgyrCP1x8uEUxLMzNWElFOYCV6mHWWwMzdPEKHlhLw7NWJqkHc4uIZphavDzA2JPzUDsBZziNae2S6owH8xPmX8G7zzgKEOPUoYHvGz1TBCxMkd3kwNVbU0gKHkx+iZILf77IofhrY1nYFnB/lQPb79drWOyJVa/DAvg9B/rLB4cC+Nqgdz/TvBbBnr6GBReqn/nRmDgaQEej7WhonozjF+Y2I/fZou/qAAAAAElFTkSuQmCC); display:block; height:44px; margin:0 auto -44px; position:relative; top:-22px; width:44px;"></div></div> <p style=" margin:8px 0 0 0; padding:0 4px;"> <a href="https://instagram.com/p/7TMlozgvCF/" style=" color:#000; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:normal; line-height:17px; text-decoration:none; word-wrap:break-word;" target="_top">More #Arduino and electronics bike speedo and led pulse to speed</a></p> <p style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; line-height:17px; margin-bottom:0; margin-top:8px; overflow:hidden; padding:8px 0 7px; text-align:center; text-overflow:ellipsis; white-space:nowrap;">A video posted by Alex Ellis (@alexellis2) on <time style=" font-family:Arial,sans-serif; font-size:14px; line-height:17px;" datetime="2015-09-06T18:54:50+00:00">Sep 6, 2015 at 11:54am PDT</time></p></div></blockquote>
<script async defer src="//platform.instagram.com/en_US/embeds.js"></script>

* LED strip lighting

I suspect this may violate some regional or local bi-laws or restrictions so best look into this idea before going for a test ride.

Adhesive and waterproof LED strip-lighting can be bought relatively cheaply from the far east. It could be wrapped around the top tube, down tube, rear stays or even the seat tube - maybe all of them at once. The drawback is that the cheaper LED strips run at 12V and can draw a fair amount of current meaning you may need to carry a high current battery on your bike. 

* Sonar for safety

A HC-SR04 ultrasonic sensor can be bought for £1-2 and will give a measurement and reading between around 2cm and 250cm. The concept would be to mount the sensor either side facing or rear facing.

A rear facing range-finder provides a warning about cars coming up behind you about to overtake or riding too close. The low tech alternative would be a wing mirror.

<blockquote class="instagram-media" data-instgrm-captioned data-instgrm-version="4" style=" background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:658px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);"><div style="padding:8px;"> <div style=" background:#F8F8F8; line-height:0; margin-top:40px; padding:50.0% 0; text-align:center; width:100%;"> <div style=" background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAMAAAApWqozAAAAGFBMVEUiIiI9PT0eHh4gIB4hIBkcHBwcHBwcHBydr+JQAAAACHRSTlMABA4YHyQsM5jtaMwAAADfSURBVDjL7ZVBEgMhCAQBAf//42xcNbpAqakcM0ftUmFAAIBE81IqBJdS3lS6zs3bIpB9WED3YYXFPmHRfT8sgyrCP1x8uEUxLMzNWElFOYCV6mHWWwMzdPEKHlhLw7NWJqkHc4uIZphavDzA2JPzUDsBZziNae2S6owH8xPmX8G7zzgKEOPUoYHvGz1TBCxMkd3kwNVbU0gKHkx+iZILf77IofhrY1nYFnB/lQPb79drWOyJVa/DAvg9B/rLB4cC+Nqgdz/TvBbBnr6GBReqn/nRmDgaQEej7WhonozjF+Y2I/fZou/qAAAAAElFTkSuQmCC); display:block; height:44px; margin:0 auto -44px; position:relative; top:-22px; width:44px;"></div></div> <p style=" margin:8px 0 0 0; padding:0 4px;"> <a href="https://instagram.com/p/7S1a1DgvFK/" style=" color:#000; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:normal; line-height:17px; text-decoration:none; word-wrap:break-word;" target="_top">#cycling sensor to warn rider of close vehicles #arduino #iot #sensors</a></p> <p style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; line-height:17px; margin-bottom:0; margin-top:8px; overflow:hidden; padding:8px 0 7px; text-align:center; text-overflow:ellipsis; white-space:nowrap;">A video posted by Alex Ellis (@alexellis2) on <time style=" font-family:Arial,sans-serif; font-size:14px; line-height:17px;" datetime="2015-09-06T15:32:23+00:00">Sep 6, 2015 at 8:32am PDT</time></p></div></blockquote>
<script async defer src="//platform.instagram.com/en_US/embeds.js"></script>

I attached this version to my bike and went for a test ride - a van approached behind me and followed me for 200ft but the sensor did not go off. This made me think that the 2.5m range is not enough especially if on a country lane or noisy road. 

The side facing version is not going to provide the same advance warning of an overtake but could be useful in conjunction with a camera for capturing dangerous manoeuvres.

Do you have any other ideas? Let me know in the comments.