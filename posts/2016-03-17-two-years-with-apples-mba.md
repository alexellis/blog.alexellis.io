---
title: "Two years with Apple's MBA"
slug: "two-years-with-apples-mba"
date: "2016-03-17T21:16:34Z"
author: "Alex Ellis"
---

#### Finally bought one
Two years ago I clicked 'Buy' on an Apple Macbook Air and I don't think that I've missed Windows since. Apple isn't perfect and there has been a rumbling lately on Hacker News about their software quality and focus on bringing out new hardware over fixing problems with their HFS filesystem or unmatched version of OpenSSL. I have enjoyed the change of scenery and wanted to write down a few thoughts.

Since I can remember... using a PC has always meant "Microsoft Windows" - starting with 3.11 on our family computer, through all the upgrades (95/98/XP/7). Don't get me wrong - along the way I was never far from a Linux installation, it was just not the first port of call for desktop use.

Work has primarily meant .NET, Windows and MSSQL - but around three years ago I started learning Python, Node.JS and bash. I was finding that there was a viable and popular alternative to Microsoft tooling for development and I couldn't get enough of it. Something that boosted the interest in open source and UNIX/Linux was my acquisition of a Raspberry PI. The PI community's de facto programming language is Python.

#### it's a UNIX system, I know this

When the MBA arrived the first thing I did was to open the *Terminal app* and to log into my Raspberry PI remotely with *SSH*. I loved that this experience was so seamless and that the terminal emulator compared to windows *cmd* was fully featured and that copy and paste just worked. I used *sftp* to push some changes to one of my Python programs and to take a backup of the code in a tarsal. Nothing I needed was missing.

I found the underlying UNIX system intriguing. Many of the [original utilities](http://www.opensource.apple.com/source/shell_cmds/shell_cmds-187/printf/printf.c) from System V (created up to 30 years ago) were pre-installed and fully functional. They hadn't lost their usefulness even if some of them had been re-written or enhanced by the GNU-team or BSD community. In fact if you browse the source for Darwin you can find date and time stamps going back decades.

[UNIX Power Tools](http://www.amazon.co.uk/Unix-Power-Tools-Jerry-Peek/dp/0596003307/ref=sr_1_1?ie=UTF8&qid=1458248473&sr=8-1&keywords=unix+power+tools)

(I've found this book really useful, having found an older copy for much less than the list price. I've learnt a lot from it.)

Having operated exclusively in the .NET ecosystem for so long meant I had no idea how to use anything apart from TFS for source control. I realised that had to change and so I took a crash course on the git CLI.

At the time I pushed my first git repo to Github: [phototimer](https://github.com/alexellis/phototimer), but now I've contributed to open-source projects such as the Pimoroni [scrollphat](http://github.com/alexellis/scrollphat) and the Docker/Swarm projects. With the scrollphat I started by forking the project, then adding some samples to the library, after that I refactored the code and added unit tests. My changes then got included back upstream by raising a pull-request with the manufacturer of the product. 

Part of using Github and having a blog running on [Ghost](http://blog.alexellis.io/self-hosting-on-a-pi/) has meant learning Markdown. It took a little while to get to grips with the formatting but it's now second-nature and I find it very readable even in plain text format.

#### Wrapping up

I'm not saying that you can't do all of this on a Linux laptop, but I found the Apple hardware and user interface a pleasure to work with. The claims on the battery life are true - I can take the MBA out for a day and forget about the charger.

The weight and form-factor of the MBA are perfect for being on the go and because I am not putting a heavy load on the system, the fan is rarely audible and never noticeable.

When I bought this machine originally I was cheap and only went for 4GB of RAM, this is a decision I now regret whenever I try to edit a RAW photo from my digital camera, or feel the urge to spin up a Virtual Machine. The apps I use the most are fine with 4GB: [atom](http://atom.io/) text-editor, terminal for bash/ssh/sftp, Arduino IDE, VS Code and Safari. I also use brew to add additional packages like *watch*, *nmap*, *mpd* and *killall*.

Macs are not as prohibitively expensive as they once were and if you like programming and are considering a new computer that is fast, sleek and will give you great battery life then I would suggest looking into one.