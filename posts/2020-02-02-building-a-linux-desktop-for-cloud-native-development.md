---
title: "Building a Linux Desktop for Cloud Native Development"
slug: "building-a-linux-desktop-for-cloud-native-development"
date: "2020-02-02T19:52:00Z"
author: "Alex Ellis"
meta_title: "Building a Linux Desktop for Cloud Native Development"
meta_description: "Find out how I use a Linux Desktop PC for Cloud Native Development and for business work. I'll cover everything from parts & peripherals to CLIs and SaaS."
tags:
  - "nuc"
  - "ubuntu"
  - "indie dev"
  - "intel nuc"
  - "linux desktop"
  - "linux"
---

This post covers the building of my Linux Desktop PC for Cloud Native Development. I'll be covering everything from parts, to peripherals, to CLIs, to SaaS software with as many links and snippets as I can manage. I hope that you enjoy reading about my experience, learn something, and possibly go on to build your own Linux Desktop.

My primary use-case is for client work and development of open-source software as part of my business [OpenFaaS Ltd](https://openfaas.com/). My work mainly covers talking with clients and community members over Zoom, working in an IDE (VSCode) with languages like Java, Go, Python and JavaScript. I also build infrastructure software for [Kubernetes](https://kubernetes.io/) and cloud - tasks like testing Kubernetes controllers and building container images with Docker.

![Business cards in 2020?](/content/images/2020/02/IMG_20200203_111036_2.jpg)

> See also: [Joining the CNCF Ambassadors](https://blog.alexellis.io/joining-the-cncf-ambassadors/)

I needed the system to be fast, efficient, quiet and most importantly fit for purpose. The aim of this post is not to convince the world that Linux is the only system that a developer may need, most folks will prefer a Mac for general purpose computing.

![The whole package](/content/images/2020/02/EPrvuc4WsAAPbYb.jpeg)

> If you already have a Linux system, or a laptop running Linux, then you can skip over the "build" section and move onto the tools and workflow section.

## It's a Linux system, I know this

I've always felt that using a Linux desktop and system gave me a faster response time than my Mac when opening a terminal, compiling a binary, or just navigating webpages. It could be entirely subjective, but if the placebo cures the lag of my Mac, then why not?

One of my primary use-cases is building code that is destined to run not on a Mac, but on a Linux host in the cloud. With the rise of cloud, microservices and serverless, who isn't shipping their applications to a Linux host somewhere?

![compare-2](/content/images/2020/02/compare-2.jpg)

> My Intel NUC Hades Canyon running silently as I edit this blog post. 2018 Mac Mini for scale.

It turns out that Kubernetes Go controllers are huge binaries, so large that the Go team had to add special extensions to the toolchain. In my experience cross-compiling a Go controller from a Mac to a Linux binary takes much longer and hurts the fast inner-loop that we crave as developers. If you take that one step further, and containerise the build with Docker for Mac, you're now having to run a much smaller Linux VM - perhaps with 1GB RAM and 2 CPU cores, which is going to adversely affect productivity.

## Picking a Linux distribution

Just like comparing MacOS to a Linux OS, something designed for tha masses, but easy to get started with, picking a Linux distribution brings up similar tradeoffs. I am not quite of the opinion that all packages need to be built from source, so [Gentoo](https://www.gentoo.org/) is too hardcore for me. [Arch Linux](https://www.archlinux.org/) finds a nice balance for me, of having a fast system that can be finely-tuned to the absolute minimum of packages, but runs a rolling update. If something doesn't work out of the box, it could take days, if not weeks of investment to fix time. Over the years it's taken some convincing, but I'm now happy to recommend the LTS version of Ubuntu. It seems to largely just work and can be installed and reinstalled at great speed. Some folks may also enjoy CentOS and Fedora, but for various reasons the Ubuntu / Debian lineage aligns better for my usage.

Ubuntu offers a relatively small ISO download that can be flashed to a USB stick and installed onto a new system in a short period of time. I'm not sure when it was added, but the new "install a minimal system" option worked very well.

## Failed attempts

Before deciding on the Intel NUC Skull Canyon, I did have a couple of false-starts.

First off, I bought something like this from eBay, as a "new old stock", with a 8th or 9th generation i5 CPU. I liked the form-factor and was quite pleased with using a 5th generation i5 NUC headless for a build server.

It had two cores, 16GB of RAM and a fast 120GB m.2 SSD, but had numerous issues. Ubuntu wouldn't boot if a USB device was plugged in, and the integrated graphics seemed to choke and lag when even doing modest scrolling. Since I couldn't return the hardware, I changed it over to a headless host which runs a Kubernetes cluster 24/7 for fast testing within my local network.

<a target="_blank"  href="https://www.amazon.com/gp/product/B083G6S7HZ/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=B083G6S7HZ&linkCode=as2&tag=alexellisuk-20&linkId=a352e546ee0cf625d98e06c35e2cb9fb"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&MarketPlace=US&ASIN=B083G6S7HZ&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=_SL160_&tag=alexellisuk-20" ></a><img src="//ir-na.amazon-adsystem.com/e/ir?t=alexellisuk-20&l=am2&o=1&a=B083G6S7HZ" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

[Intel BXNUC10i7FNK Core i7-10710U 6-Core NUC Mini PC (Slim Version)](https://www.amazon.com/gp/product/B083G6S7HZ/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=B083G6S7HZ&linkCode=as2&tag=alexellisuk-20&linkId=f507dcc9d450b5ff97674ac72f998829)

This 6-core 10th gen NUC may provide a better experience than I had given that it has newer firmware and a 6 cores vs the 2 of the i5 I bought.

The second failed attempt was to "do things properly" and to buy a mini-PC from Lenovo. I was attracted to the AMD Ryzen range and knew that the CPU offered great value for money.

I bought the [Lenovo ThinkCentre M715 Tiny M715q AMD Ryzen 5 Pro 2400GE](https://www.amazon.com/gp/product/B06X9ZKFRK/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=B06X9ZKFRK&linkCode=as2&tag=alexellisuk-20&linkId=00437cc9989d9674989039503d078839) but kitted out the RAM to 32GB and added a bigger NVMe.

<a target="_blank"  href="https://www.amazon.com/gp/product/B06X9ZKFRK/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=B06X9ZKFRK&linkCode=as2&tag=alexellisuk-20&linkId=cff0882b315c14b37c1cd04ee53ea258"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&MarketPlace=US&ASIN=B06X9ZKFRK&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=_SL160_&tag=alexellisuk-20" ></a><img src="//ir-na.amazon-adsystem.com/e/ir?t=alexellisuk-20&l=am2&o=1&a=B06X9ZKFRK" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

Whilst the device did have a high upper clock-speed, its fans span-up for whatever I did, whether that was opening a Terminal window, or just opening a new tab in Chrome. It wasn't that the system was being stressed, it was just more than I could cope with to hear the CPU fan being PVM'd up and down over and over all day. Fortunately Lenovo facilitated a return, and I found from reading reviews on Amazon, that the Intel version of the mini-PC may be better at cooling.

## The parts-list

Let's cover the hardware.

Given my poor experience with the integrated graphics in the cheapest version of the NUC, I had my eyes set on the Hades Canyon range. There were two versions on offer - one suited to Gaming (NUC8i7HNK) and one for VR (NUC8i7HVK), but with AMD graphics.

I went for the cheaper NUC8i7HNK model, which was around 150-200 USD less, one of the reasons was the lower power requirements.

You can get a pre-built version from Amazon, or shop around.

<a target="_blank"  href="https://www.amazon.com/gp/product/B07P89VZMF/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=B07P89VZMF&linkCode=as2&tag=alexellisuk-20&linkId=ba29d2187dab82c92313697282c6b30c"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&MarketPlace=US&ASIN=B07P89VZMF&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=_SL160_&tag=alexellisuk-20" ></a><img src="//ir-na.amazon-adsystem.com/e/ir?t=alexellisuk-20&l=am2&o=1&a=B07P89VZMF" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

[Intel NUC 8 VR NUC8I7HVK Gaming Mini PC - 8th Gen Intel Quad-Core i7-8809G Processor up to 4.20 GHz, 32GB DDR4 Memory, 512GB NVMe Solid State Drive, AMD Radeon RX Vega M GH Graphics, Windows 10 Pro](https://www.amazon.com/gp/product/B07P89VZMF/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=B07P89VZMF&linkCode=as2&tag=alexellisuk-20&linkId=00ddfdbaf9ac148117e4b7442e2b3623)

* RAM - I opted to kit out to 32GB of RAM

    <a target="_blank"  href="https://www.amazon.com/gp/product/B01BGZEVHU/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=B01BGZEVHU&linkCode=as2&tag=alexellisuk-20&linkId=cb1d36140a07c9dc923e98a1bf10f2ac"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&MarketPlace=US&ASIN=B01BGZEVHU&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=_SL160_&tag=alexellisuk-20" ></a><img src="//ir-na.amazon-adsystem.com/e/ir?t=alexellisuk-20&l=am2&o=1&a=B01BGZEVHU" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

    Something like [CORSAIR Vengeance Performance 32GB (2x16GB) 260-Pin DDR4 SO-DIMM DDR4 2666 (PC4 21300) Laptop Memory Model CMSX32GX4M2A2666C18](https://www.amazon.com/gp/product/B01BGZEVHU/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=B01BGZEVHU&linkCode=as2&tag=alexellisuk-20&linkId=d44578d1bc552370ed7f49c89bee3a36) provides good value.

* Storage

    ![Storage](/content/images/2020/02/EPOljtpX4AcDqaZ.jpeg)

    I decided to get Samsung Evo Plus m2 SSDs to install Windows 10 Pro on one, and Ubuntu 18.04 on the other

    <a target="_blank"  href="https://www.amazon.com/gp/product/B07MFZY2F2/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=B07MFZY2F2&linkCode=as2&tag=alexellisuk-20&linkId=a8932b815719163c74dcee1d7b6882e0"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&MarketPlace=US&ASIN=B07MFZY2F2&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=_SL160_&tag=alexellisuk-20" ></a><img src="//ir-na.amazon-adsystem.com/e/ir?t=alexellisuk-20&l=am2&o=1&a=B07MFZY2F2" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

    If you're only using Linux, then [the 1TB offers best value](https://www.amazon.com/gp/product/B07MFZY2F2/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=B07MFZY2F2&linkCode=as2&tag=alexellisuk-20&linkId=0cf6a03a7aa0be03761896f79f8edb2b). Now, you could push the boat out, and buy two and set them up in a RAID-0 array too, using [mdadm](https://linux.die.net/man/8/mdadm).

The great thing about building with the Intel Hades Canyon, is that we're basically done. We don't have to worry about picking a motherboard, an energy-efficient PSU, or what kind of graphics card to buy. Intel has made all those decisions already and we just have to pick the "fast" or "faster" model of NUC, then add RAM and storage.

The Intel NUC kit comes with an allen key to unscrew 6 individual keys on the top plate, once open, a small flat ribbon connector needs to be unplugged, and a Phillips screw undone. Then you can simply slot in any supported configuration of RAM and storage.

> I also upgraded my Mac Mini 2018 model to 32GB of RAM and the experience was terrifying in comparison and involved buying 50 USD worth of tools.

I bought this system purely for business purposes for use with my ongoing client and OSS work. If you are self-employed, or have a business, you could look into whether a system like this is partially deductible against income tax. Check with your accountant.

## Installation and first boot

I also own the previous generation Intel Hades Canyon, which is much smaller and slimmer in comparison. It was good to see the cooling reworked for this version. The first thing I did was to head into the BIOS with F2 and find the "quiet" CPU cooling setting. You may notice louder than expected CPU noise, but rather than the whine of a cheap CPU cooler, we hear a steady blow of hot air out of the generous rear vents.

<a target="_blank"  href="https://www.amazon.com/gp/product/B07C4BCH1B/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=B07C4BCH1B&linkCode=as2&tag=alexellisuk-20&linkId=e23cde03a2ce0210dd3d6bdc85cbb584"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&MarketPlace=US&ASIN=B07C4BCH1B&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=_SL160_&tag=alexellisuk-20" ></a><img src="//ir-na.amazon-adsystem.com/e/ir?t=alexellisuk-20&l=am2&o=1&a=B07C4BCH1B" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

[SanDisk 32GB Ultra Fit USB 3.1 Low-Profile Flash Drive (2 Pack Bundle) SDCZ430-032G-G46 Pen Drive with (1) Everything But Stromboli (TM) Lanyard](https://www.amazon.com/gp/product/B07C4BCH1B/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=B07C4BCH1B&linkCode=as2&tag=alexellisuk-20&linkId=356221f0820b71b687fcdf8bd862b178)

I downloaded [Ubuntu Desktop 18.04.3 LTS](https://ubuntu.com/download/desktop) and flashed it to a small USB pen-drive.

On my first attempt of installing Ubuntu, with an earlier kernel, I couldn't get into the installer due to issues with the AMD graphics driver. The work-around was lengthy and frustrating, and meant I put off finishing the built. The good news is that the 5.x Kernel which is now included has full support for the AMD graphics.

The trick I got to get into the installer was to hit ESC on the Grub menu, and then add `nomodeset` to the end of the kernel options. [My understanding is that the nomodeset prevents the hardware graphics drivers from being loaded](https://askubuntu.com/questions/1024895/why-do-i-need-to-replace-quiet-splash-with-nomodeset/1024897), it is not ideal and puts additional strain on the CPU, but can get you past this road-block.

I recommend going with a minimal install to conserve space, it will result in a system that is missing simple things like `git`, but we can add them back in a single command. Tracking down and removing unnecessary packages is much harder.

## Get some system packages

Run `sudo apt update` and `sudo apt install`

* `tmux` - a terminal multiplexer - run commands and then detach and reattach later.

    See my video tutorial [you need to know tmux](https://www.youtube.com/watch?v=JeOSpnT29go)

* `curl` - yes, this may not be installed, add it back in to make HTTP requests

* `git` - absolutely essential for any commercial or OSS work

    If you have 2FA (2-factor auth) enabled for your GitHub account (and I hope that you have), then you should start cloning git repos using ssh instead of using HTTPS, otherwise you'll have to mess about with personal access tokens.
    
    If you don't have an SSH key, then generate one:
    
    ```sh
    ssh-keygen
    ```
    
    Now log into your [GitHub](https://github.com/) profile and add a new public SSH key, paste in the contents of `~/.ssh/id_rsa.pub`.
    
    Now, you can use the `ssh` link available in the GitHub UI, or you can replace a HTTPS `git remote` with the SSH equivalent.
    
    ![clone-ssh](/content/images/2020/02/clone-ssh.png)
    
    If you need to remove an existing HTTPS "remote", run `git remote rm origin` then `git remote add origin git@github.com:alexellis/k3sup.git` for instance.

* `htop` - a beautiful way to look at system usage

* `vim` - my preferred editor for system files, if you learn some of the shortcuts, you can speed up your workflow

* `gimp` - when writing blog posts, I use gimp to resize images and to crop them, such as for the screenshot of htop you'll see later

![htop](/content/images/2020/02/htop.png)

> No surprises that when sorting by memory, it's Kubernetes that's using up the most resources.

```sh
sudo apt update && \
  sudo apt install -qy tmux curl git htop vim gimp
```

## Get your graphical apps

Now we need some graphical apps, you'll download the .deb file and then double click it. Start with Chrome and work down.

* `chrome` - https://www.google.com/intl/en_uk/chrome/

    A faster browser than Firefox, sorry, not sorry.

* `Zoom` - https://zoom.us/download#client_4meeting

    Install if you meet with clients, or attend OSS briefings. Paying for Zoom is one of the best things I've done, it is also a tax-deductible cost if used for business purposes. You can [use my referral code to join Zoom](http://bit.ly/2Uimpw9)

* `VSCode` - https://code.visualstudio.com/download

    Once you've installed VSCode, you will want to add the spelling plugin. It's essential given the pace of life, typos happen, better catch them before publishing.

* `Slack` - https://slack.com/intl/en-gb/downloads/mac?geocode=en-gb

    Log in and join your workspaces, like [OpenFaaS Slack](https://slack.openfaas.io) where you can discuss Kubernetes, Docker, ARM, Raspberry Pi, inlets, k3s and more.

![Istio, k3sup and Kubernetes example](/content/images/2020/02/EPYNxJDX0AA_48f.jpeg)

> [View the tweet](https://twitter.com/alexellisuk/status/1222179509740371968)

4k provides a decent amount of space, and the Terminal is gorgeous against a high-res landscape.

## Get your other Linux apps

Not every app is best installed via a downloaded .deb or a package manager.

* `docker` - to build, run and push images

    ```sh
    curl -sSLf https://get.docker.com | sudo sh
    
    sudo usermod -aG docker $(whoami)
    ```

* `docker-compose` - compose is a favourite with developers for local development, it can be installed with `pip` and requires python

    ```sh
    sudo apt install -qy python3 python3-pip
    
    sudo pip3 install docker-compose
    ```

* `inletsctl` - [inlets](https://inlets.dev/) is your Cloud Native tunnel to get a public IP when it counts, sharing work with clients, your team, or the community. It's like Ngrok, but for 2020, and free

    ```sh
    curl -sSLf https://inletsctl.inlets.dev | sudo sh
    inletsctl download
    inletsctl download --pro
    ```

    <img src="https://raw.githubusercontent.com/inlets/media/master/assets/inlets-monochrome.png" width="100px">

    If you'd like a free trial for inlets-pro, that can tunnel pure L4 TCP traffic, [apply here](https://github.com/inlets/inlets-pro#getting-a-license-key). Quote this blog post and I'll double the length of your license key trial for free.


* `k3d` - to run an entire Kubernetes cluster in a docker container, the fastest option available and smallest footprint, built on [k3s](https://k3s.io/)

    ```sh
    curl -s https://raw.githubusercontent.com/rancher/k3d/master/install.sh | bash
    ```
    
* `k3sup` - k3sup can be used to install k3s on remote VMs, your Raspberry Pi cluster. The second use-case for k3sup is to install apps like the Kubernetes Dashboard, Minio, Postgresql, OpenFaaS, cert-manager and more, using their helm charts.

    ```sh
    curl -sSLf https://get.k3sup.dev | sudo sh
    ```
    
* `kubectx` - kubectx is a bash script which switches quickly between Kubernetes contexts. You'll need this for pointing at either a local or a remote cluster.

    ```sh
    cd /tmp/
    git clone https://github.com/ahmetb/kubectx
    chmod +x ./kubectx/kubectx
    sudo cp ./kubectx/kubectx /usr/local/bin/
    ```

* `hub` - if you're a maintainer, or ever test PRs on OSS projects, then you'll want the ["Hub" CLI by GitHub](https://github.com/github/hub).

    ```sh
    curl -sSL https://github.com/github/hub/releases/download/v2.14.1/hub-linux-amd64-2.14.1.tgz > /tmp/hub.tgz
    sudo tar -xvf /tmp/hub.tgz -C /usr/local/ --strip-components=1
    ```
    
    My favourite commands are `hub pr list/checkout` and `hub issue`
    
    ![hub-cli](/content/images/2020/02/hub-cli.png)

* Golang - installing Go is a key part of my workflow, if you want to contribute to cloud native tooling, you should install it so that you're ready.

    ```sh
    sudo mkdir -p /usr/local/go/
    curl -sSL https://dl.google.com/go/go1.13.7.linux-amd64.tar.gz > go1.13.7.linux-amd64.tar.gz
    sudo tar -xvf go1.13.7.linux-amd64.tar.gz -C /usr/local/go --strip-components=1
    ```
    
    Now edit `~/.bashrc`:
    
    ```
    export PATH=$PATH:/usr/local/go/bin:$HOME/go/bin
    export GOPATH=$HOME/go
    ```
    
    Then make a GOPATH folder, `mkdir -p $HOME/go`

    Check it worked: `go version`
    
    Now head over to VSCode and install the "Go" plugin, followed by running the install step, which downloads each Go static analysis tool and installs it locally into your $PATH.
    

* Node.js - even if you're not a JavaScript developer, it can be very useful having node available, even as a calculator in your CLI

    ```sh
    curl -sSL https://nodejs.org/dist/v12.14.1/node-v12.14.1-linux-x64.tar.gz > node-v12.14.1-linux-x64.tar.gz
    sudo tar -xvf node-v12.14.1-linux-x64.tar.gz -C /usr/local --strip-components=1
    ```
    
    Here's a little example of how you can use `node` as a quick calculator:
    
    ````
    alex@nuc7:~$ node
    Welcome to Node.js v12.14.1.
    Type ".help" for more information.
    > day_rate=2500
    2500
    > day_rate*1.1
    2750
    >
    ```

## The whole package

For the whole package you'll need some additional hardware. This section is less prescriptive, and you may already own everything else you need like a monitor, keyboard and mouse.

![The whole package](/content/images/2020/02/EPrvuc4WsAAPbYb.jpeg)

I used to own a Dell Ultrasharp 27" monitor, which I really liked, but wanted a cheaper alternative. That's where I met the BenQ range, which appears to use the same electronics and a different casing.

<a target="_blank"  href="https://www.amazon.com/gp/product/B07H9XP92N/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=B07H9XP92N&linkCode=as2&tag=alexellisuk-20&linkId=7ca46a81eecee4d7387af9eafce8ecde"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&MarketPlace=US&ASIN=B07H9XP92N&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=_SL160_&tag=alexellisuk-20" ></a><img src="//ir-na.amazon-adsystem.com/e/ir?t=alexellisuk-20&l=am2&o=1&a=B07H9XP92N" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

[BenQ PD2700U 27 inch 4K UHD IPS Monitor | HDR | 100% sRGB and Rec. 709 | AQColor Tech for Accurate Reproduction](https://www.amazon.com/gp/product/B07H9XP92N/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=B07H9XP92N&linkCode=as2&tag=alexellisuk-20&linkId=69c1f4594f071dabf0937168ebf79d47)

The scaling in Ubuntu worked well for everything I tried, with a standard HDMI cable plugged in directly. The IPS panel is beautiful and has an anti-glare coating.

<a target="_blank"  href="https://www.amazon.com/gp/product/B075V27G2R/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=B075V27G2R&linkCode=as2&tag=alexellisuk-20&linkId=cd99075640d0952045a1e7a99d8a190d"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&MarketPlace=US&ASIN=B075V27G2R&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=_SL160_&tag=alexellisuk-20" ></a><img src="//ir-na.amazon-adsystem.com/e/ir?t=alexellisuk-20&l=am2&o=1&a=B075V27G2R" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

[USB C to DisplayPort Cable 4K@60Hz](https://www.amazon.com/gp/product/B075V27G2R/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=B075V27G2R&linkCode=as2&tag=alexellisuk-20&linkId=302d9eff922db82a804dc5c1e4fbed8b)

The monitor comes with three graphics inputs: HDMI, DisplayPort and Mini DisplayPort. I connect the NUC via HDMI and my Mac Mini via a USB-C-DisplayPort cable, both of which enable full 4k at 60Hz.

Now onto input methods - mechanical keyboard and professional mouse.

<a target="_blank"  href="https://www.amazon.com/gp/product/B07S395RWD/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=B07S395RWD&linkCode=as2&tag=alexellisuk-20&linkId=6d978be7b43418ee6af30bda327d236c"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&MarketPlace=US&ASIN=B07S395RWD&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=_SL160_&tag=alexellisuk-20" ></a><img src="//ir-na.amazon-adsystem.com/e/ir?t=alexellisuk-20&l=am2&o=1&a=B07S395RWD" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

[Logitech MX Master 3 Advanced Wireless Mouse - Graphite](https://www.amazon.com/gp/product/B07S395RWD/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=B07S395RWD&linkCode=as2&tag=alexellisuk-20&linkId=3bc61544e2e7690efc1e7a8be459a537)

I have the MX Master 2 mouse which runs over Bluetooth, fortunately the NUC packs a bluetooth chip and there was no lag in use. Today, if I bought again, I'd upgrade to the MX Master 3 which is a refresh for 2019/2020.

One of my most coveted possessions is my mechanical keyboard. I've tried many of the switches and am now convinced that the MX Silver key is the best for me - it's quiet, tacticle and fast.

<a target="_blank"  href="https://www.amazon.com/gp/product/B078H3WPHM/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=B078H3WPHM&linkCode=as2&tag=alexellisuk-20&linkId=8db056cd2d737fdb3833c28f2062b860"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&MarketPlace=US&ASIN=B078H3WPHM&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=_SL160_&tag=alexellisuk-20" ></a><img src="//ir-na.amazon-adsystem.com/e/ir?t=alexellisuk-20&l=am2&o=1&a=B078H3WPHM" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

[Durgod Taurus K320 TKL Mechanical Gaming Keyboard - 87 Keys - Double Shot PBT - NKRO - USB Type C](https://www.amazon.com/gp/product/B078H3WPHM/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=B078H3WPHM&linkCode=as2&tag=alexellisuk-20&linkId=461e3c710ce8a7eb4a877f8381561936)

Upgrading your keyboard is one of the single best things you can do for your workflow.

[Logitech C922x Pro Stream Webcam – Full 1080p HD Camera](https://www.amazon.com/gp/product/B01LXCDPPK/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=B01LXCDPPK&linkCode=as2&tag=alexellisuk-20&linkId=eb9b4bcd02af08b68a5d0b6a36d3d9a6)

The final piece of hardware I wouldn't do without is a powered USB hub, but one with enough power behind it to take a number of peripherals and support fast phone charging via iQ.

<a target="_blank"  href="https://www.amazon.com/gp/product/B00VDVCQ84/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=B00VDVCQ84&linkCode=as2&tag=alexellisuk-20&linkId=72f7ff16ec13cb2656e0c881975efddb"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&MarketPlace=US&ASIN=B00VDVCQ84&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=_SL160_&tag=alexellisuk-20" ></a><img src="//ir-na.amazon-adsystem.com/e/ir?t=alexellisuk-20&l=am2&o=1&a=B00VDVCQ84" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

[Anker 10 Port 60W Data Hub with 7 USB 3.0 Ports and 3 PowerIQ Charging Ports](https://www.amazon.com/gp/product/B00VDVCQ84/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=B00VDVCQ84&linkCode=as2&tag=alexellisuk-20&linkId=8a586bff2afe48f1791ed00aa2a7dd15)

The USB hub also allows me to switch between a Mac or the Linux host in a very short period of time with my keyboard, mouse, webcam, microphone all seamlessly appearing on either device.

### Remote work and taking calls

My webcam is from Logitech and I use it for all client calls, so that I can position it where I like it. You'll find new models come out on a regular basis, so don't use my older choice as a guide.

Many developers recommend the Blue Yeti microphone. I'm not a fan of it given that it has a very sensitive pick-up for background noise. 

<a target="_blank"  href="https://www.amazon.com/gp/product/B016YL4POK/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=B016YL4POK&linkCode=as2&tag=alexellisuk-20&linkId=264878d8bb83188183a5762b65979057"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&MarketPlace=US&ASIN=B016YL4POK&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=_SL160_&tag=alexellisuk-20" ></a><img src="//ir-na.amazon-adsystem.com/e/ir?t=alexellisuk-20&l=am2&o=1&a=B016YL4POK" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

I went for the [Audio-Technica AT2020+ Cardioid Condenser USB Microphone, Black](https://amzn.to/38iaPFN), which comes with a tripod and a carry-case. That has meant that when travelling for conferences or away for client-work, I can still record high-quality audio for a screencast. It plugs in over USB and so it is also easy to switch between computers.

<a target="_blank"  href="https://www.amazon.com/gp/product/B07ZPC9QD4/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=B07ZPC9QD4&linkCode=as2&tag=alexellisuk-20&linkId=a8cbae917151669bbf756c76a8cd8861"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&MarketPlace=US&ASIN=B07ZPC9QD4&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=_SL160_&tag=alexellisuk-20" ></a><img src="//ir-na.amazon-adsystem.com/e/ir?t=alexellisuk-20&l=am2&o=1&a=B07ZPC9QD4" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

When working remote, it's important to be able to get out for fresh air, or to get out of the home office. The [newer generation of Apple AirPods Pro](https://www.amazon.com/gp/product/B07ZPC9QD4/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=B07ZPC9QD4&linkCode=as2&tag=alexellisuk-20&linkId=ba28103125eafa1683616e0c2019c972) include excellent noise cancellation and work well over Bluetooth with my phone, my laptop, or the NUC. I'll cover "working on the go" more in a follow-up blog post.

One final piece of software that's worth mentioning is an office, or productivity suite.

![Gsuite](https://lh3.googleusercontent.com/GpoYHPdn-TU-KE2FAkll5xTAYJqmQ3NQPdj5AVH1VPrbN2xiDAt8h4ol0FRvCialUosSO8lsIHLfWXZT9tAKbus2X4ZHphy_2BXj=w1400)

I opted to use GSuite which I've bound to the company's domain name openfaas.com. I use it in the following way:

* Google Docs - to write proposals and Statements of Work (SoW) for clients or for conference CfPs / abstracts - the collaboration features are very intuitive and helpful for async work. I also track OSS meeting notes using a shared doc.
* Google Sheets - for tracking hours / days / project progress when appropriate. If you're new to consulting, do explore value vs. time-based pricing.
* Google Mail - bound to openfaas.com this allows for various inboxes like sales@ and support@ - whether as aliases or as separate user accounts. You could have a separate email address for your business accountant to log into. 
* Google Calendar - for scheduling meetings and calls. I also use this to block out time for time off and product R&D.

[Checkout GSuite](https://refergsuite.app.goo.gl/C8vM) pricing and feel free to use my referral codes: `UAE7QWH7XPQRG3C` for basic, and `V9VKLERQ3E3TDQG` for the business plan.

The added benefit of the Gsuite apps is that they're accessible from any device at any time and are enough to get most work done.

## Wrapping up

I hope you've enjoyed this post where I covered my experiences and reasoning for building a Linux Desktop machine in 2020. I tried to cover the build in detail and to also cover my workflow and software preferences, particularly around "Cloud Native" tooling.

What would you like to know next? What surprised you? What did I forget to include?

If you have questions, comments, or suggestions, feel free to reach out over Twitter [@alexellisuk](https://twitter.com/alexellisuk/).

You can find my OSS projects on GitHub, and if you're interested in using or contributing to them, or just connecting with like-minded community, then join [OpenFaaS Slack](https://slack.openfaas.io/)

> If you enjoyed this post, you can subscribe to regular email digests (`Insiders Updates`) on all my OSS projects, work and tutorials via [GitHub Sponsors](https://github.com/sponsors/alexellis) 🍻

You may also like:

* [The Five Pressures of Leadership in Open Source](https://blog.alexellis.io/the-5-pressures-of-leadership/)
* [Kubernetes Homelab with Raspberry Pi and k3sup](https://blog.alexellis.io/raspberry-pi-homelab-with-k3sup/)
* [OpenFaaS 3rd Birthday Celebrations](https://www.openfaas.com/blog/birthday-teamserverless/)