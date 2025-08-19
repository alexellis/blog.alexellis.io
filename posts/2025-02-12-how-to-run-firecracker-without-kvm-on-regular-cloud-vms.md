---
title: "How to run Firecracker without KVM on cloud VMs"
slug: "how-to-run-firecracker-without-kvm-on-regular-cloud-vms"
date: "2025-02-12T09:05:21Z"
author: "Alex Ellis"
meta_title: "How to run Firecracker without KVM on cloud VMs"
meta_description: "MicroVMs need bare-metal or nested virtualisation with /dev/kvm. But what if that's not available? The PVM virtualisation framework may be the answer."
feature_image: "/content/images/2025/02/actuated-pvm-1.jpeg"
tags:
  - "kvm"
  - "github actions"
  - "virtual machines"
  - "bare-metal"
  - "firecracker"
---

In this post I want to introduce a novel way to run virtual machines, namely microVMs on cloud VMs where KVM is not available.

When I say "where KVM is not available", I mean a virtual machine which has nested virtualisation turned off and no `/dev/kvm` device.

According to [the KVM homepage](https://linux-kvm.org/page/Main_Page):

> KVM (for Kernel-based Virtual Machine) is a full virtualization solution for Linux on x86 hardware containing virtualization extensions (Intel VT or AMD-V).

Until recently, if you wanted to run a microVM with [Firecracker](https://firecracker-microvm.github.io/), [Cloud Hypervisor](https://github.com/cloud-hypervisor/cloud-hypervisor), or QEMU, it would require KVM to be available, and there were only two options: the first was to use a bare-metal host. I've not come across a modern bare-metal machine which lacked hardware extensions.
The second option was to find a cloud VM where nested virtualisation was enabled. KVM with Nested virtualisation can be found on Azure, Digital Ocean and Google Cloud.

When we built [actuated](https://actuated.com), a solution for managed self-hosted GitHub Actions runners, on your own infrastructure, we started to run into friction. We met users who only had an account with AWS, and would not consider another vendor that provided bare-metal or nested virtualisation on their VMs.

Why didn't customers consider bare-metal directly from AWS? There are a number of generations of EC2 which offer a bare-metal option, however the cost is around 10x higher than alternatives.

Let's compare two of Hetzner's offerings with one of the smallest bare-metal hosts on AWS, with a comparable Geekbench 6 score.

Both of these have local NVMe with unlimited bandwidth included:

* Hetzner's A102 has 32vCPU 128GB RAM and 2x NVMe at ~ 100 USD / mo
* Hetzner AX162-R has 96vCPU and 256GB RAM (more can be configured) at ~ 200 USD / mo

The AWS EC2 M7i.metal-24xl instance costs 3532 USD / mo on an on-demand basis without even factoring storage costs or bandwidth. That's 30x times more expensive than the A102 which scores roughly the same on Geekbench 6 for the single-core score.

![Geekbench](/content/images/2025/02/geekbench.jpg)
> Left - 100 USD / mo vs 3.5k USD / mo, plus additional costs.

I don't know why AWS charges so much for their bare-metal when compared to other providers, however it makes it very difficult to adopt something like Firecracker within an AWS-only customer.

**Firecracker without KVM**

In February 2024, [Ant Group and Alibaba proposed PVM](https://lwn.net/Articles/963718/). PVM is a Pagetable Virtual Machine, and a new virtualization framework built upon KVM. It means that Firecracker can be run on regular cloud VMs, without the need for hardware extensions or nested virtualisation.

In 2023, Ant Group and Alibaba Cloud presented at [The 29th ACM Symposium on Operating Systems Principles](https://sosp2023.mpi-sws.org/) and shared the following figures:

* 100,000 PVM-enabled secure containers
* 500,000 vCPUs running daily
* 36% of users were able to switch from bare-metal to general purposes VMs
* "PVM offers comparable performance with bare-metal servers"

One of the slides implies that guest exit events may be quicker with PVM and traditional nested KVM.

I wasn't able to find any references to 64-bit Arm as a target for PVM, so it seems this technique may be limited to an x86_64 architecture initially.

### Why we care about PVM

When I say we, I'm talking about OpenFaaS Ltd, the software company I founded. When I say "I", I'm generally talking about my personal experience.

We have two products that use Firecracker/Cloud Hypervisor, and I maintain a third project - [a lab for learning how to get started with Firecracker](https://github.com/alexellis/firecracker-init-lab). So when I learned about PVM, I naturally wanted to try it out.

Our first product built with microVMs was created in 2022 to address short-comings with GitHub's hosted runners - lack of Arm availability, performance issues, no nested virtualisation, no GPU support, and excessive costs. It was possible to run self-hosted runners directly on a VM, but side-effects, and the risk vectors from public repositories were too much of an issue. When using Kubernetes, Docker in Docker was slow due to its use of VFS (the slowest storage backend available), and required privileged Pods. For those of you who don't know, privileged Pods are about as risky as it gets when it comes to Kubernetes security.

Read about actuated: [Blazing fast CI with MicroVMs](https://blog.alexellis.io/blazing-fast-ci-with-microvms/)

The second product was slicer, which hasn't been relased, but is used internally for development, hosting and testing. It takes a bare-metal machine and slices it up into performant, right-sized VMs. So rather than paying a premium for cloud VMs, you can take a large bare-metal host on-premises or from a bare-metal provider and bin-pack it with your workloads.

Whilst we now run a number of our production websites and APIs in this way, the initial use-case was for building giant Kubernetes clusters, in order to test OpenFaaS with thousands of functions.

See a demo of slicer: [Testing Kubernetes at Scale with bare-metal](https://www.youtube.com/watch?v=o4UxRw-Cc8c)

## Trying out KVM-PVM on AWS EC2

Whilst a [patch was proposed on 2024-02-26](https://lore.kernel.org/lkml/CABgObfaSGOt4AKRF5WEJt2fGMj_hLXd7J2x2etce2ymvT4HkpA@mail.gmail.com/T/) on the Kernel mailing list, and the technology is being used at scale in production at Alibaba Cloud, it is not yet part of any mainline Kernel version.

I learned most of what I needed to know by reading [the quickstart for Kata](https://github.com/virt-pvm/misc/blob/main/pvm-get-started-with-kata.md) containers, which is how I assume KVM-PVM is consumed within Alibaba Cloud. [Phoronix](https://www.phoronix.com/news/PVM-Hypervisor-Linux-RFC) also covered the story, but didn't add any new information.

Unfortunately, there is very little written about it anywhere else on the Internet.

**New host Kernel**

A new Kernel must be built with a patched version of the Kernel taken at version 6.7 using [this source tree](https://github.com/virt-pvm/linux). Now if you've ever built a Kernel, you'll know that configurations vary by cloud and underlying hypervisor. You cannot simply run "make all" and deploy the results.

I primarily work with Ubuntu as an Operating System, so I created an EC2 instance, then copied the active Kernel configuration from the /boot partition and copied it into the source directoy as .config.

Beware, whilst the config I took from a t2.medium worked on other t2 instances, it did not work on an m6a instance, so I had to start over with a new config file taken from a fresh m6a instance. If and when this patch is released and deployed across clouds, building a host kernel will no longer be necessary.

From there, the new PVM features need to be enabled, you need to build a Kernel, including all its modules, and a debian package for easy installation on your EC2 VM.

Once the VM is installed, you need to update the Grub configuration on the VM to use the new Kernel by editing `/etc/default/grub` and setting `GRUB_DEFAULT=` to the new option.

Once rebooted, `uname -a` will display the new Kernel version running. If the machine doesn't boot, try to access the serial console for hints.

**A new guest Kernel**

The guest that you boot within the microVM will also need a patched Kernel. I took the minimal Kernel configuration from the Firecracker repository which is usually used for CI and quickstarts, and adapted it with the new configuration options.

Once built, the vmlinux was copied over to the EC2 instance.

**A patched hypervisor**

According to the instructions, Cloud Hypervisor already has support for PVM and QEMU requires a one-line patch. I found [a fork of Firecracker by Loophole labs](https://github.com/loopholelabs/firecracker/tree/main-live-migration-pvm) which had patches for PVM and live migration. It's not clear whether they wrote the original patches or are maintaining them for their own use. The live migration support isn't needed for KVM-PVM, so you could remove those changes if you wished.

Once you have a patched hypervisor, you can deploy it to your EC2 instance and boot your VM.

For actuated, I found that I needed to alter a few settings in the cmdline for the Kernel, but it booted and I was able to run a build with Firecracker.

![actuated build running with PVM](/content/images/2025/02/actuated-pvm.jpeg)
> actuated build running with PVM

## Why is this important for microVMs and Firecracker?

Bare-metal on AWS is not just expensive, for many it is just not an option due to its cost. I find this ironic because AWS developed the Firecracker project and use it to power some of their own compute services such as Lambda and Fargate.

So KVM-PVM means that any AWS customer can now integrate with microVMs whether through Firecracker, Cloud Hypervisor or QEMU for any number of workloads.

* Kata containers using a microVM provide a more secure alternative than containers for Kubernetes Pods
* A large host can start a VM almost instantly, with a low ~ 125-2000ms cold-start-up time, depending on what is required within the Kernel and what kind of init is being used
* CI solutions like actuated can now make use of any cloud whilst retaining the benefits of microVMs
* containers cannot be customised with Kernel features like SELinux or GPU drivers, however microVMs can

## What's the performance like?

From what I have understood from the links shared, Alibaba Cloud use KVM-PVM for container hosting through Kata containers using Kubernetes. These workloads are likely to be serverless-style HTTP servers which are long lived, and may have adequate performance.

I ran a suite of benchmarks with `dd`, `fio` and `sysbench`, however due to the way Firecracker caches reads and writes, we see widly incorrect numbers even from Firecracker on bare-metal. For this reason I moved to a real world use-case, building a Kernel.

In my testing on AWS EC2 instances and on Hetzner Cloud, I noticed additional overheads whilst carrying out CI benchmarking.

I created a [GitHub Actions job for a minimal Kernel build](https://github.com/actuated-samples/kernel-builder-linux-6.0/blob/master/.github/workflows/microvm-kernel.yml) and ran it on an EC2 instance with a m6a.xlarge gp3 root volume.

Directly on the host: 1m10s
Directly on the host inside Docker (overlayfs): 1m25s
Within Firecracker PVM guest: 2m2s

Testing on a m6a.2xlarge I got slightly better results with 8x vCPU and 32GB RAM:

On the host: 42.7s
Within Firecracker PVM guest: 1m34.7s

I also reproduced the same testing on Hetzner Cloud using a dedicated AMD EPYC 4x vCPU and 16GB RAM VM.

On the host: 1m37s
Within Firecracker PVM guest: 2m49s

The Geekbench 6 scores for the m6a.xlarge instance were roughly the same on the host and inside the guest. The Kernel build may just exercise the machine in a way that Geekbench does not, maybe it causes more VM exit events or pagetable writes?

![kvm-pvm](/content/images/2025/02/kvm-pvm.jpg)
> Geekbench scores compared

In contrast to KVM-PVM, when building with an M7i.metal-24xl bare-metal host with hardware extensions enabled:

* Directly on the host: 7.418s
* Within actuated and Firecracker: 10.8s

The minor discrepancy here may be due to the way the GitHub Actions runner continually monitors processes and sends their logs off to GitHub.com.

With a Hetzner A102, I saw the following build times:

* Directly on the host: 8.7s
* Within actuated and Firecracker: 10.4s

What was interesting was that the times were so similar, even with the M7i having 96vCPU vs the 32vCPU on the A102.

The testing showed that whilst KVM-PVM can be used for CI workloads, where security and a fast boot-up time are required, it may not be optimised for them. The virtualisation overheads will be less apparent for background jobs, serverless functions, and long-lived HTTP servers which perform less I/O operations.

## What's next?

Whilst KVM-PVM is being used at scale in production within Alibaba Cloud and Ant Group, it is not merged into the Kernel, which means it requires a large amount of manual work and maintenance.

A host kernel must be built, distributed and replaced on each cloud VM, separate guest kernels need to be maintained along with patched versions of your chosen microVM hypervisor. This may be tennable if you only want to target a single cloud, such as AWS, or if you're working within your own team, but for a vendor that wants to use microVMs in a portable way across clouds, the effort is too much compared to the rewards.

For the time being, Azure, Digital Ocean, Google Cloud, amongst others have nested-virtualisation available. Some of the major clouds like AWS do offer very expensive bare-metal, but with Hetzner's offering being up to 30x cheaper, it's hard to make a business case for using it.

This reminds me of the early days of Docker, back in around 2014-2015 where I was excited about a new technology that opened new possibilities, but it involved very similar maintenance. Many of the Kernels available on cloud VMs did not have support for the features Docker needed, and Arm required even more custom work and builds of Docker itself.

My initial testing with KVM-PVM has been very positive and I'd like to see it come into the mainline Kernel. But the following highlighted in the [Phoronix coverage](https://www.phoronix.com/news/PVM-Hypervisor-Linux-RFC) may mean PVM is destined to remain an internal project:

> Currently the PVM virtualization framework code amounts to nearly seven thousand lines of new kernel code spread across 73 patches. The initial RFC patches are out for discussion on the Linux kernel mailing list.

Summing up, I'd say that KVM-PVM in its current state is best suited to early adopters, or single teams that can automate processes for a single instance type and cloud, and for whom bare-metal or nested virtualisation is out of reach.

If you do decide to play with KVM-PVM, then you have a lot of work ahead of you, and very little in the form of recent documentation to follow.

PVM resources:

* [LWN: Ant Group and Alibaba propose PVM](https://lwn.net/Articles/963718/)
* [Kernel.org mailing list: patch dated 2024-02-26](https://lore.kernel.org/lkml/CABgObfaSGOt4AKRF5WEJt2fGMj_hLXd7J2x2etce2ymvT4HkpA@mail.gmail.com/T/)
* [Quickstart for Kata on GitHub](https://github.com/virt-pvm/misc/blob/main/pvm-get-started-with-kata.md)
* [Initial Phoronix coverage](https://www.phoronix.com/news/PVM-Hypervisor-Linux-RFC)

My work with Firecracker:

* [Grab your lab coat - we're building a microVM from a container](https://actuated.com/blog/firecracker-container-lab)
* [Slicer demo - Testing Kubernetes at Scale with bare-metal](https://www.youtube.com/watch?v=o4UxRw-Cc8c)
* [Actuated blog - managed self-hosted runners for GitHub and GitLab](https://actuated.com/blog)

You may also like my walk-through, patching an AWS EC2 instance, running a Firecracker microVM with slicer, and comparing build times of a Kernel build.

<iframe width="560" height="315" src="https://www.youtube.com/embed/aUsC1sAoTCg?si=7endmaqcy3CPoSHL" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>