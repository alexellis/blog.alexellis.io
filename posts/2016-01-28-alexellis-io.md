---
title: "alexellis.io registered"
slug: "alexellis-io"
date: "2016-01-28T23:54:03Z"
author: "Alex Ellis"
meta_title: "How I registered alexellis.io"
meta_description: "Learn how I registered alexellis.io with namecheap and went on to self-host my own technical blog about Docker and Linux."
tags:
  - "hosting"
  - "ghost"
  - "blog"
  - "domain name"
  - "namecheap"
  - "tryghost"
  - "dns"
---

### New domain
When I started this blog I registered a domain over at [Namecheap](http://www.namecheap.com) of ae24.space and set up the blog to point to quad.ae24.space. I wanted specifically because it was:

* very cheap - .space costs around £2.50/year
* very short for scripts and typing on the command line
* Namecheap provides dynamic DNS for the Raspberry PI hosting the blog

> See also: [Tutorial self-hosting your blog on a Raspberry PI](http://blog.alexellis.io/self-hosting-on-a-pi/)

The problem was that the address was also quite obscure, so I registered a new domain of **[alexellis.io](http://alexellis.io)**. From a technical background we may connect I/O with input/output, but in this instance the top-level-domain (TLD) belongs to the territory of the Indian Ocean. You may a premium for this where Namecheap works out at around £25/year but other registrars are selling .io addresses at three times this price.

#### Namecheap experiences

So far I've found Namecheap to be reliable and easy to configure for sub-domains. The main thing that drew me to them was the **Dynamic DNS** feature which works well with *ddclient* and other tools.

I've not invested any time in becoming an affiliate, but if you are considering setting up a domain do take a look at their prices when shopping around. 

#### Plans for the address

**[alexellis.io](http://alexellis.io)** will be a landing page with a click through to this site and to my Github page.

**[blog.alexellis.io](http://blog.alexellis.io/)** will provide the address for this blog.

The Raspberry PI is still hosting the Ghost blog software. I may look at running it through a Docker image - this would help get something running quickly if the SD card were to fail.

A single PI itself cannot handle many requests per second and the newest releases of Node.js for ARM give quite poor performance on ARM [Ghost issue #6258](https://github.com/TryGhost/Ghost/issues/6258). I am planning on writing up a blog entry on this soon showing a comparison across different Node binaries.