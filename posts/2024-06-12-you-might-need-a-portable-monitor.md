---
title: "You might need a portable monitor"
slug: "you-might-need-a-portable-monitor"
date: "2024-06-12T13:47:26Z"
author: "Alex Ellis"
meta_title: "You might need a portable monitor"
meta_description: "I cover why as a one monitor kind of guy, I found a portable monitor essential - both for streaming and for debugging the home lab."
feature_image: "/content/images/2024/06/GPzeit7XQAAJ_OJ.jpeg"
---

I've had two monitors in the past, either two physical screens plugged into the same computer, or a laptop screen and a monitor. Neither really worked for me - it was distracting and now I had to constantly arrange, move and switch windows between screens.

Having said that, the one or two monitor choice is something of a tabs vs spaces argument for developers. To all you *two monitor* people, I'm glad it works for you.

I'll cover why you might want a portable monitor instead, and at the end I'll list out the kit I use to record streams and video demos of products.

[![](https://pbs.twimg.com/media/FWP4_MRWAAEaCJs?format=jpg&name=4096x4096)](https://x.com/alexellisuk/status/1541351079866208256/photo/1)
> I'm a *one monitor* kind of guy.

So why might you want a portable monitor instead? Isn't it the same old problems again? Taking up space, taking up extra brain cycles organising windows and straining your eyes?

My first experience with a portable monitor was when GitHub sent the GitHub Stars some pretty nice swag as part of the program. I received a Lepow branded 15.5" HD screen with a mini HDMI and USB-C input and that was at least a couple of years ago. Since then, there are a plethera of options in the 100-200 USD budget range.

## Debug that headless computer

Up until recently, I only used the screen to debug headless computers in my house, or to set up Raspberry Pis when I couldn't do it without attaching a screen for some reason or another.

[![https://pbs.twimg.com/media/FwavxWUaIAMJP6K?format=jpg&name=large](https://pbs.twimg.com/media/FwavxWUaIAMJP6K?format=jpg&name=large)](https://x.com/alexellisuk/status/1659206782525530116/photo/1)
> Performing the initial installation of an Operating System to the Ampere Altra Developer Platform.

[![What's wrong with the Raspberry Pi? Let's plug in the screen and find out.](https://pbs.twimg.com/media/GECal8QWAAAAZbh?format=jpg&name=large)](https://x.com/alexellisuk/status/1747566637455196297/photo/1)
> What's wrong with the Raspberry Pi? Let's plug in the screen and find out.

Whilst you can plug computers into your main monitor, it's always disruptive, then if you need to look up some instructions, or run some networking commands, you'd have to switch between them. A portable monitor is great for this.


## The important dashboard

When I used to work in an office, a number of years ago I set up a dedicated TV to monitor Jenkins CI pipelines.

So when I launched actuated, I set up a similar kiosk-style dashboard again to see how customers were getting on, and to resolve problems before they knew about them.

[![](https://pbs.twimg.com/media/FxEPJHXXwAsKd4i?format=jpg&name=large)](https://x.com/alexellisuk/status/1662126391704313856/photo/1)
> Not a portable monitor, but a 7" screen attached to a Raspberry Pi 4

After some time, the size and lack of space for the Raspberry Pi got annoying and I shut it down, but it served its purpose at the time, and a portable monitor might be better placed for this.

## Streaming and product demos

As a *One Monitor To Rule Them All* kind of guy, streaming was always a problem with tooling like StreamYard. You always end up having to switch into the control software or the backstage view to switch something, and now your viewers have seen behind the curtain. Not good.

So for my latest product walk-through for [inlets](https://inlets.dev), I set up the portable monitor and moved the OBS control interface over there, so I could see if my shortcuts really had started the recording, and if I really had switched scene.

[![](https://pbs.twimg.com/media/GPx5kJ9WkAAEq1i?format=jpg&name=large)](https://x.com/alexellisuk/status/1800447618105151497/photo/1)

For some of you, a [Stream Deck](https://www.elgato.com/uk/en/s/welcome-to-stream-deck) solves this problem. But I'm a Linux on the Desktop user, and so that's out of the question for me. There are some third-party tools available, but I don't want to install them.

You can watch the recording below:

<iframe width="560" height="315" src="https://www.youtube.com/embed/SdKsy35sRNw?si=kU98iuBDsG06RPEl" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## Finding the sweet spot

The 15.6" screen I had wasn't a bad size, but the magnetic folding case was a liability. Every time I had to move it, I forgot how it attached, then it would often collapse. I got it for free, and it's helped me debug a number of sticky issues so I couldn't complain.

But then I wondered what would be better?

I [ordered a 13.3" screen from Amazon](https://amzn.to/3XjtTQ9) which came with a built-in rigid stand, a much brighter panel, almost no bezels, so it ended up being a better fit.

[![https://pbs.twimg.com/media/GPzeit7XQAAJ_OJ?format=jpg&name=large](https://pbs.twimg.com/media/GPzeit7XQAAJ_OJ?format=jpg&name=large)](https://x.com/alexellisuk/status/1800558644368646575/photo/2)
> Preview of OBS during a recording

[![https://pbs.twimg.com/media/GPzeit1WwAAdYaq?format=jpg&name=large](https://pbs.twimg.com/media/GPzeit1WwAAdYaq?format=jpg&name=large)](https://x.com/alexellisuk/status/1800558644368646575/photo/1)
> The dashboard for my company's SaaS [actuated](https://actuated.dev)

## So should you get a portable screen?

The word "portable" makes it sound like you should be taking this thing on the road to use with your laptop. And I'm sure some people do that. But for me, it's about having something I can plug into a headless computer, server, or Raspberry Pi, and more recently I've found it irreplaceable for recording product demos and for live-streaming.

At 100-200 USD, and with a number of options in different sizes, most developers or homelabers should probably get a portable monitor. I've had mine for occasional use, but have now found a much better use for it.

If you're running two or more monitors, it might also help you downsize and reclaim some space on your desk.

How do you plug these in?

My Nvidia RTX 3090 only has one HDMI output, which I use for the main 27" BenQ 4k monitor. It has three other DisplayPort outputs, so I got a DisplayPort to mini HDMI cable for the additional monitor.

Another option may be to use the HDMI port on your integrated graphics card, if you have one, and the HDMI port on your discrete graphics card for the main screen.

Bear in mind the cable length. I have a sit/stand desk, and even 3m isn't necessarily enough by the time the cable has weaved its way up to the desk.

How do you power them?

The Lepow screen was able to run off a USB-A to USB-C cable for power, but the newer screen kept flashing every few seconds indicating a lack of power, so I plugged it into a DC adapter.

### A few other bits of kit

A number of people have asked on Twitter/LinkedIn about my current selection of kit, so here it is:

* Screen bar - BenQ PD2700U 4K HDR
* Webcam - Sony Alpha A6100
* Capture card - Elgato Cam Link HD 4k
* Lights - Elgato Keylight and Keylight Air
* Monitor - BenQ 27" 4k
* Audio mixer - Focusrite solo with Cloudlifter
* Microphone - Shure SM7B (cry once)
* Speakers - KEF Q150 driven by an SMSL DAC/AMP
* Keyboard - AKKO 30685 with Cherry MX Red keys
* Mouse - Logitech MX Master 2S

You can see how it all looks and works together in the video I recorded using the portable monitor for an OBS preview: [Expose HTTP services from private Kubernetes using inlets and AWS EC2](https://www.youtube.com/watch?v=SdKsy35sRNw)

* [Subscribe to my channel on YouTube](https://www.youtube.com/channel/UCJsK5Zbq0dyFZUBtMTHzxjQ)
* [View my Open Source projects and eBooks on GitHub](https://github.com/alexellis/)