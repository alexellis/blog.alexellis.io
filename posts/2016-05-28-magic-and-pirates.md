---
title: "Stowing away: Magic and Pirates"
slug: "magic-and-pirates"
date: "2016-05-28T19:40:00Z"
author: "Alex Ellis"
meta_title: "Docker Captain Stows away with Pimoroni Pirates "
meta_description: "Join a Docker Captain for a day of geeky antics in Sheffield with maker and educator: Pimoroni. We talk Raspberry Pi, Docker Swarm and clusters!"
feature_image: "/content/images/2016/05/posthead.jpg"
tags:
  - "Pimoroni"
  - "PIZero"
  - "swarm"
  - "docker"
  - "makers"
  - "Raspberry PI"
---

Yesterday I set off to the North of England for a day of geeky antics and shenanigans in Sheffield with the UK maker and educator company: [Pimoroni](https://shop.pimoroni.com/). The team is made up of makers (designers, testers, coders) and make-it-happeners (finance, packers, pickers) with 25 employees and 2 co-founders. They describe themselves as pirates (as in the Peter-Pan sense) and while entirely professional don't let that get in the way of having a great time doing what they all *clearly* love.

#### Have Pi cluster: will travel

It was only a few days ago that Jon (one of the directors) suggested I visit them in Sheffield to talk about Docker and my new Raspberry Pi Cluster which I had only finished a couple of days before that. The planets moved into alignment and before I knew it I'd said yes but didn't really know what I was getting myself into.

![Docker Swarm ready!](/content/images/2016/05/IMG_20160527_144520--2-.jpg)

The train to Sheffield from Peterborough is swift coming in at under 2 hours. Luckily having built a PiZero cluster it was tiny and I could fit everything I needed neatly into a back-pack. Paul (the other founder-director) came to pick me up from the station - unmissable with his impressive beard. I appreciated him taking the time to help me find the site which was only a short walk away.

We arrived at an unremarkable industrial estate in the middle of the city and I wondered if we'd taken wrong turn? It felt like we were stowing away onto a large ship ready for a journey on the seven seas.

#### All aboard

Once through the doors it was obvious that this was a working-space and one which had grown very quickly and organically. We were in a large warehouse with racks and racks of boxes overflowing with electronic components and products. A picker walked by smiling while putting together an Internet order to be sent out later that day to someone just like you or me. This is part of the workflow regular customers never get to see and I found it fascinating.

<a data-flickr-embed="true"  href="https://www.flickr.com/photos/alexellis/27227029942/in/album-72157666489912453" title="Stock and products"><img src="https://c7.staticflickr.com/8/7162/27227029942_e380e37b29_c.jpg" width="800" height="592" alt="Stock and products"></a><script async src="//embedr.flickr.com/assets/client-code.js" charset="utf-8"></script>

Having never been to a maker-space or workshop before I found there was so much to take in - things that were essential for producing tens of thousands of SKUs per month.

There were five huge laser cutter machines laid out which are a core part of their heritage. Pimoroni's catalyst for success was designing a colourful enclosure for the Raspberry Pi. 

I saw lots of other fascinating machinery (check out the slideshow)

* Pick and place machine
* SMDs on huge reels
* A wave solderer for bulk soldering
* A machine designed to meld components to pre-placed solder - a bit like a hotel toaster
* Soldering and testing stations

Jon explained how each machine fitted into the production process. For instance all of the 5x11 LEDs for the scroll-phat have to be picked and placed by robot making it one of the most time-consuming products to produce.

#### Slideshow

Here's a selection of all the pictures taken on my Nexus 5. I'd like to take my SLR next time.

<a data-flickr-embed="true"  href="https://www.flickr.com/photos/alexellis/albums/72157666489912453" title="PimoroniTrip"><img src="https://c3.staticflickr.com/8/7480/27290866626_b61267a0e6_c.jpg" width="800" height="592" alt="PimoroniTrip"></a><script async src="//embedr.flickr.com/assets/client-code.js" charset="utf-8"></script>

Click above to view the whole album on Flickr.

#### Upper rooms

##### R&D

Once off the *shop floor* a series of corridors leads to Engineering where Nico and Jon sit. Nico is responsible for sourcing potential product-lines from overseas and putting them through testing. As I walked in he was stress testing a LiPo to see if it would shutdown at the correct level of discharge. Nico was one of the first investors in the company.

##### BilgeTank

BilgeTank and Docker were two of driving factors of my trip. 

* BilgeTank

The live-streaming YouTube TV show BilgeTank has its own room equipped with a permanent background of a ship's hull . It seemed much bigger inside than I'd imagined from watching it online. At this point I unpacked my cluster and started Docker Swarm up to show Phil (the lead developer) exactly how it worked.

* Pimoroni and Docker

I think Docker could help Pimoroni with their software and regression testing. You can install  Python libraries and code demo code into a single image and then ship that to customers over the Internet. Some libraries that involve native C code can take a while to compile and configure. With Docker that could all be done once then uploaded as a snapshot to the free Docker Hub. As an end-user it would be as simple as:

```
$ docker run pimoroni/unicornphat rainbow-demo
```

> View the [Dockerfile](https://github.com/alexellis/docker-arm/tree/master/images/armv6/unicorn-arm).

Pimoroni now have dozens of their own hardware products and at least half a dozen Raspberry PI variants to contend with. Docker and a tool like Jenkins could ensure any issues are flagged up and corrected before customers get a chance to call in or be inconvenienced. I'm imagining a room full of Raspberry PIs and pHATS flashing away 24/7. Chaps if you're interested - let me know!

##### Kitchen

Sandy, who you may have seen on BilgeTank is one of the newer shipmates. He has taken over the kitchen worktop with a tray full of lettuces being grown live on the Internet with every detail about them being logged. The lettuce has its web-cam and is available on Twitter, too!

> Sandy's blog post [Internet of Seeds](http://blog.pimoroni.com/the-internet-of-seeds/)

##### Office #2

When entering Office #2 there was a do-not-disturb sign on the door. This was where coding happened - Phil, Sandy and Paul all work here surrounded by cool gadgets (cough.. organised chaos).

#### Afternoon session

I went with Phil to collect a lunch order the Mexican restaurant a couple of blocks away. While waiting for food I suggested we pick up a coffee and Phil showed me Tamper - a caffeine addict's dream. The smell of freshly roasted beans was pouring out through the doors and inside there were Aeropresses, V60s and all manner of gadgetry. It exceeded expectations and I wished there were more places like that Peterborough. I could tell Sheffield was a *student town* and a place I'd like to come back to.

##### Live in 10 minutes

The count-down started and we were going to be on-air. Paul started pressing buttons and calibrating cameras then started off the theme tune. Boom - live on the internet to a total of 57 viewers (I'm told that quite a few more than normal). Jon asked me a bunch of questions about Docker and we went through a detailed demo of my Cluster and how the code worked. It was only later after speaking to friends and family that I realised just how much we were geeking out. It was great to be amongst people speaking *my language*.

<a data-flickr-embed="true"  href="https://www.flickr.com/photos/alexellis/27290840796/in/album-72157666489912453/" title="Bilge Tank live in 10 mins"><img src="https://c5.staticflickr.com/8/7322/27290840796_814d15d4f2_c.jpg" width="800" height="592" alt="Bilge Tank live in 10 mins"></a><script async src="//embedr.flickr.com/assets/client-code.js" charset="utf-8"></script>

The time went much quicker than I thought and we looked at some really cool Raspberry Pi products and clusters. Shortly after I packed everything away and we headed to the local pub *The Rutland* and the guys gave me a great overview of how the business started and grew.

#### Wow. So thanks. Many though

![Doge meme](/content/images/2016/05/xiO3dQF.jpg)

So a big thanks goes out to [Pimoroni](https://shop.pimoroni.com/) from myself - thanks for inviting me along, for the tour, the hospitality and the swag! I hope we will meet up again soon and I'm really looking forward to seeing your newest products when they come into production: the *Zero Lipo* and *EnvirPhat*.

#### See also:

**Docker & Swarm on PI Zero**

> [Quick Start Docker/Swarm on PI Zero](http://blog.alexellis.io/dockerswarm-pizero/)

**What is Docker?**

> [docker.com/what-docker](https://www.docker.com/what-docker)

**Pre-visit post with cluster demo and details**

>[Pre-Visit @ Pimoroni](http://blog.alexellis.io/visiting-pimoroni/)

**Bilge Tank 039 - Clusters, Docker, Brambles & Raspberry Pi Supercomputers!**

<iframe width="560" height="315" src="https://www.youtube.com/embed/ASYnWV0Km_A" frameborder="0" allowfullscreen></iframe>

*Left to right: Alex (me) - Jon - Phil and Paul*