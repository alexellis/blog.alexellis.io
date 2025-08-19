---
title: "I Bought An N100 Mini PC, Then Another"
slug: "n100-mini-computer"
date: "2025-08-18T08:09:48Z"
meta_title: "I Bought An N100 Mini PC, Then Another"
meta_description: "Exploring the capabilities of the Intel N100 Mini PC for work and self-hosting as an alternative to public cloud."
author: "Alex Ellis"
tags:
  - "linux"
  - "self-hosting"
  - "work"
  - "firecracker"
---

I have bought dozens of Raspberry Pis over the years, but I'm now turning to the Mini PC for R&D work.

The [Intel N100](https://www.intel.com/content/www/us/en/products/sku/231803/intel-processor-n100-6m-cache-up-to-3-40-ghz/specifications.html) is a low-power processor with 4 Cores and 4 Threads with a Max. Turbo Frequency of 3.4GHz. It can usually be paired with up to 32GB of RAM (despite saying 16GB on the spec sheet) and an NVMe SSD. They've been popularised through retailers like Amazon, and AliExpress as "fanless routers" coming with 2-5 2.5Gbps Ethernet ports. The usual virtualisation extensions are supported so you'll see `/dev/kvm` appear under Linux, which means it can be used with [Firecracker](https://github.com/firecracker-microvm/firecracker) and KVM.

<blockquote class="twitter-tweet" data-media-max-width="560"><p lang="en" dir="ltr">The N100 is really cheap enough that you can buy several and test out your Kubernetes and firecracker code in a cluster. I’ve got 3 microVMs on either one running a different setup for <a href="https://twitter.com/openfaas?ref_src=twsrc%5Etfw">@openfaas</a> <a href="https://t.co/5l7RKocmit">pic.twitter.com/5l7RKocmit</a></p>&mdash; Alex Ellis (@alexellisuk) <a href="https://twitter.com/alexellisuk/status/1900629110780817659?ref_src=twsrc%5Etfw">March 14, 2025</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

> Two N100s running two different K3s clusters, each loaded up with different versions of OpenFaaS.

**Why not buy another Raspberry Pi?**

With recent developments, a Raspberry Pi 5 can now be bought with 16GB of RAM, and an official HAT with fittings for various types of NVMe SSDs. Compared to the previous generation, I found [a 3x speed increase](/first-impressions-with-the-raspberry-pi-5/) in my testing from Geekbench through to compiling a Linux Kernel in Firecracker and GitHub Actions via [actuated](https://actuated.com).

Sounds good? Yes a marked improvement, but still heavily bottlenecked on I/O, cooling solution (to prevent thermal throttling), and once all the various accessories, and adapters have been purchased, our costs are well approaching 200 GBP. Not to mention its non-standard size for its HDMI port makes finding the right cable a constant challenge.

Prices including postage: Raspberry Pi 5 16GB - 114.90 GBP, Raspberry Pi 27W USB-C Power Supply - 11.40 GBP, Argon ONE V3 M.2 NVME PCIE Case - 46 GBP, 32GB SD Card for initial installation - 8.64 GBP, postage: 5GBP.

Total: 185.94 GBP. Add a 1TB drive - Crucial P3 Plus SSD 1TB M.2 NVMe PCIe - 64.99.
Total with 1TB storage: 250.93 GBP.

Compared to the latest Ryzen processor, the N100 is no Usain Bolt - but it does come with native support for an NVMe boot drive, support for double the RAM, 4x 2.5Gbps Ethernet ports, and full-sized HDMI, and its power brick is included. You can buy it as a bare-bones kit, or pre-populated with OEM RAM and disk.

[![Factory fresh - component installation](/content/images/2025/08/n100-bare-bones.jpg)](/content/images/2025/08/n100-bare-bones.jpg)
> It costs a little more, but going bare-bones means you can get premium, and reliable kit from your usual vendor

The precise [N100 I bought was ~ 129.99 GBP](https://amzn.to/4fODE06), to which I added [32GB of Crucial DDR5 RAM ~ 65 GBP](https://amzn.to/4oJnyc6). You may not find the same model at your local Amazon site, but do look for at least i226-V on the networking side as I hear it's more stable than the alternatives.

*You can `slice` up bare-metal instead of buying multiple devices*

Where a Raspberry Pi 5 can *just about* handle a single node K3s cluster, an N100 can easily run three microVMs giving me three hosts for about the cost of one fully kitted out RPi 5. Multiple nodes simulate race conditions and networking issues better than one, and the effective 100 Pod per node limit gets multiplied per VM.

I created a tool named Slicer to quickly provision and manage microVMs - they can be permanent pets with a disk image, or backed by a storage snapshot for a near-instant boot.

## My use-cases for additional PCs in the home

Other than my main workstation and laptop for travel, every other computer I own is used headless. That's the case whether we're talking about a Raspberry Pi, Mini PC (Intel NUC, N100, etc) or custom-built ATX tower.

* I'll install Ubuntu Linux LTS
* Access it over SSH (key-based login only)
* If I want services remotely, I'll create an [Inlets tunnel](https://inlets.dev) for them

I know that many of us buy PCs to use as a hobby, for tinkering and non-commercial purposes. That's to be encouraged, and I hope you learn as much as I do when I tinker and experiment.

**Obligatory note on why I'm not using a cloud VM here**

Someone on Hacker News or Reddit is shouting: "Just use the cloud? Nobody is capable of maintaining a Linux server."

Sometimes cloud instances could provide a substitute, however they rarely support KVM, and we are penalised for needing large amounts of vCPU or RAM for workloads, in a way that we're not with mini PCs or self-built ATX towers. 
At the time of speaking, an 8vCPU, 32GB RAM, 640GB NVMe Intel VM would cost me 192USD per month on DigitalOcean. In one and a half months, I'm on a break even and own the device for its lifespan.

In terms of "maintenance", I install Ubuntu Server LTS and rarely touch it again - other than the occasional package update.

Now, if something is public facing and making revenue (or risks revenue/reputation by going down), I will absolutely run that on a popular cloud VM, or on Hetzner's bare-metal offering split up into various microVMs. If possible, I'll run it on a CDN - like my blog, a homepage, or a documentation site.

**Testing real products on real hardware**

My primary reason for PCs at home is because I work from home, and need a lab for product development, testing and support.

[OpenFaaS](https://openfaas.com) is the primary product I work on and have built a business around. OpenFaaS is a self-hosted serverless framework that feels at home just as much on AWS EC2 as it does on a bare-metal server under my desk.

* Testing new builds and features of OpenFaaS
* Reproducing customer support issues
* Benchmarking, load testing, and burn-in testing
* Long-term test environments

Inlets is a network tunnel that can be self-hosted, with TCP and HTTP support

* Coming up with new content/combinations - "Can you show me how to expose X?"
* Reproducing customer support requests
* General connectivity for services running on the internal network, for sharing draft blog posts, APIs, and docs with colleagues and customers

Actuated and Slicer are the latest in the line of products - both of which use Firecracker and microVMs

[Actuated](https://actuated.com) is a SaaS control-plane for GitHub Actions and GitLab CI, with an agent that you can install on your own hardware. Each time a job is queued up, it'll be sent to one of your servers, where a microVM will boot up in Firecracker using KVM, and run to completion. After the job is complete, it'll be wiped off the disk. Boot time is ~1s for a full guest Kernel with Docker and Systemd.

* Performing builds if/when cloud-based metal is not available, too expensive, or just overloaded with over builds
* Testing new Kernel versions - Intel/AMD (x86_64) and 64-bit Arm
* Testing new features in the agent - metrics, graceful shutdown, etc

[Slicer](https://x.com/alexellisuk/status/1905668749379645447) was spun out of actuated - it takes much of the core technology and extends it to slice up bare-metal efficiently. For instance, you can take a large server from Hetzner with 64GB of RAM, and 16 vCPU and split it up into a Kubernetes cluster with 3x servers running a HA (high availability) cluster. So far Slicer has remained an internal tool for the business.

* Create a small or large number of VMs within a few seconds - fully booted with SSH
* Run large Kubernetes clusters over multiple machines
* Used with its API to simulate addition/removal of spot instances, and autoscaling cloud (without the costs)

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">If you&#39;ve not seen a demo of my slicer tool yet..<br><br>It takes a bare-metal host and partitions it into dozens of Firecracker VMs in ~ 1-2s. From there you can do whatever you want via SSH<br><br>In my screenshot &quot;k3sup plan&quot; created a 25-node HA cluster<a href="https://t.co/WpG2v3RPK7">https://t.co/WpG2v3RPK7</a> <a href="https://t.co/Wbz5Szk1BI">pic.twitter.com/Wbz5Szk1BI</a></p>&mdash; Alex Ellis (@alexellisuk) <a href="https://twitter.com/alexellisuk/status/1716759592795885976?ref_src=twsrc%5Etfw">October 24, 2023</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

## Should you consider an N100 Mini PC?

**Heat generation**

Most of my usage has been with headless Linux - I have no idea how these perform with a screen attached, or with Windows installed. One thing needs to be mentioned - the lack of a fan is a blessing and a curse. I've come close to burning my hands by touching them when they're only been running a mostly idle 3x node Kubernetes cluster set up with Slicer/Firecracker.

The output of the `sensors` command got all the way up to 93C when I had it on a windowsill with direct sun coming in through the glass. Putting the curtain around it made it drop by roughly 10C within less than a minute.

On a cloudy 21C August afternoon, the idle temperatures look absolutely fine.

```bash
alex@n100:~$ sensors
coretemp-isa-0000
Adapter: ISA adapter
Package id 0:  +45.0°C  (high = +105.0°C, crit = +105.0°C)
Core 0:        +43.0°C  (high = +105.0°C, crit = +105.0°C)
Core 1:        +43.0°C  (high = +105.0°C, crit = +105.0°C)
Core 2:        +43.0°C  (high = +105.0°C, crit = +105.0°C)
Core 3:        +43.0°C  (high = +105.0°C, crit = +105.0°C)

acpitz-acpi-0
Adapter: ACPI interface
temp1:        +27.8°C  (crit = +110.0°C)

nvme-pci-0500
Adapter: PCI adapter
Composite:    +55.9°C  (low  = -40.1°C, high = +83.8°C)
                       (crit = +87.8°C)
Sensor 1:     +71.8°C  (low  = -273.1°C, high = +65261.8°C)
Sensor 2:     +55.9°C  (low  = -273.1°C, high = +65261.8°C)
```

For headless monitoring, you can use the open-source [node_exporter](https://github.com/prometheus/node_exporter) project which exports system information in Prometheus format. Just hook it up to a free Grafana cloud instance, or a local Grafana server running in Docker or a VM.

The marketed use-case for these machines is as a fanless router (hence the 4x on-board ethernet ports). That means taking an off-the shelf product like pfSense, OPNsense, or even doing it like I would do and installing various Linux daemons as and when required. Then, if you were to put this device in the critical path between you and the Internet - I imagine it would generate a serious amount of heat.

If you search, you'll find some people have made their own brackets to position large PC fans over the top of the heatsinks.

**Virtualisation**

I either run services directly on the host, or virtualise them with Slicer and Firecracker. When I wanted to test the mirroring of container images for OpenFaaS, I created a new VM, connected with SSH, and installed a registry, Caddy, and Inlets - then let it obtain a TLS certificate. It worked just as expected, so I terminated the VM and emailed the customer letting them know the new release of our tooling was available.

You could also install purchase [Proxmox subscription](https://www.proxmox.com/en/) and install it directly onto the host and launch your VMs that way, just don't expect it to be as quick or convenient.

**Just one drive**

Whenever I can, I'll install two NVMes into a PC - the first will take the Operating System, and the second will be used for all the wear and tear of Kubernetes, Docker or VM snapshotting - whichever makes sense. That makes it easy to replace without having to reinstall the operating system.

## What other alternatives are worth considering?

DHH is a staunch advocate for the [Minisforum MS-A2 (review by ServeTheHome)](https://www.servethehome.com/minisforum-ms-a2-review-an-almost-perfect-amd-ryzen-intel-10gbe-homelab-system/), but it is well known for having annoying and noisy fans. He also recommends the [Beelink SER mini PCs](https://www.bee-link.com/collections/product) - notably the SER8 and SER9 have the best performance, and he says they're noise free.

I was interested in a much more performant Mini PC that could take at least two NVMe SSDs, which led me to the [Acemagic F3A](https://acemagic.uk/products/acemagic-f3a-mini-pc). It supports up to 96GB of RAM, but there are reports of the AMD Ryzen™ AI 9 HX 370 Processor operating well with 2x 64GB chips for a total of 128GB RAM. The processor is so new that I couldn't get it to boot without disabling the GPU - so the later [Geekbench](https://geekbench.com) scores may be slightly lower than if it was fully accelerated.

In testing with Geekbench, I found it to be almost as fast as my AMD Ryzen 9 7950X3D in my workstation. Considering that one is the size of Big Mac and the other is full ATX - that an important space saver for use in a home office.

## Wrapping up

[![Installing Ubuntu LTS with a portable 4k monitor](/content/images/2025/08/n100-installation.jpg)](/content/images/2025/08/n100-installation.jpg)
> Installation is quick and easy, even if you purchase a bare-bones option. I used my [indispensable portable monitor](/you-might-need-a-portable-monitor).

I bought one N100, and then found it to be so useful, that I wanted to keep it dedicated to certain tasks and tests. So I got a second for more ephemeral workloads. They do get hot, but seem very stable even at high temperatures. They're exceptional value for money, and much more powerful than a Raspberry Pi - and in the same ballpark re: costs.

The Acemagic F3A is more like a full desktop replacement, but in a much smaller form-factor. All the machines mentioned run KVM and Firecracker happily.

Here's how the Geekbench scores look (single-core/multi-core):

* Raspberry Pi 4 - 291 / 657
* Raspberry Pi 5 - 777 / 1496
* N100 4x port router - 1226 / 3345
* AMD Ryzen 9 5950X - 2075 / 10735
* Acemagic F3A (GPU driver disabled) - 2454	/ 11365
* AMD Ryzen 9 7950X3D - 2561 / 15962

You can [find all my Geekbench 6 test results here](https://browser.geekbench.com/user/356106).

