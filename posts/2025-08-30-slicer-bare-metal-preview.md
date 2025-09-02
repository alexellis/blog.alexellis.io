---
title: "Preview: Slice Up Bare-Metal with Slicer"
slug: "slicer-bare-metal-preview"
date: "2025-08-30T08:09:48Z"
meta_title: "Preview: Slicer Up Bare-Metal with Slicer"
meta_description: "The easiest and best supported way to learn and deploy Firecracker and microVMs."
author: "Alex Ellis"
tags:
  - "linux"
  - "self-hosting"
  - "work"
  - "firecracker"
  - "slicer"
---

By popular request, we're releasing Slicer, our much used internal tool from OpenFaaS Ltd for efficiently slicing up bare metal into microVMs.

> Since this blog post, [Slicer now has an official documentation](https://docs.slicervm.com) site with use-cases and examples.

I was on a call this week with Lingzhi Wang, of [Northwestern University](https://www.northwestern.edu/) in the USA. He told me he was doing a research project on intrusion detection with [OpenFaaS](https://openfaas.com), and had access to a powerful machine.

When I asked how powerful the machine was, his reply shocked me:

* 128 Cores
* 1.5 TB of RAM

My next question surprised him.

How many Kubernetes Pods, do you think you can run on that huge machine?

I answered: only 100. `[1]`

He was installing [K3s](https://k3s.io) ([Kubernetes](https://kubernetes.io/)) directly onto the host, which when coupled with a 100 Pod limit is a huge waste of resources.

Enter slicer, and the original reason we created it.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">If you&#39;ve not seen a demo of my slicer tool yet..<br><br>It takes a bare-metal host and partitions it into dozens of Firecracker VMs in ~ 1-2s. From there you can do whatever you want via SSH<br><br>In my screenshot &quot;k3sup plan&quot; created a 25-node HA cluster<a href="https://t.co/WpG2v3RPK7">https://t.co/WpG2v3RPK7</a> <a href="https://t.co/Wbz5Szk1BI">pic.twitter.com/Wbz5Szk1BI</a></p>&mdash; Alex Ellis (@alexellisuk) <a href="https://twitter.com/alexellisuk/status/1716759592795885976?ref_src=twsrc%5Etfw">October 24, 2023</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

The original use-case was for customer support for our line of Kubernetes products such as OpenFaaS and Inlets Uplink.

* Build a large cluster capable of running thousands of Pods on a single machine - blasting that 100 Pod per node limit
* Learn how far we can push OpenFaaS before we start to see untolerable latency on `faas-cli list` and `faas-cli deploy`, etc
* Optimise the cost of long-running burn-in tests and customer simulations
* Simulate spot-instance behaviour - node addition/removal through [Firecracker](https://firecracker-microvm.github.io)
* Chaos testing - what happens when the network disconnects? This was used to fix a mysterious production issue for a customer where informers were disconnecting after network interruptions
* Test our code on Arm and x86_64 hosts

Key features that make it ideal for running production workloads:

* Fast storage pool for instant clone of new VMs
* Run with a disk file for persistent workloads
* Boot time ~ 1s including systemd
* Proven at scale in [actuated](https://actuated.com) running millions of jobs for top-tier CNCF projects
* Serial Over SSH console to enable access when the network is down
* Disk management utilities for migration
* Multi-host support for even larger slicer deployments
* Near-instant destruction of hosts
* GPU mounting via VFIO for Ollama

What about for individuals and hobbyists?

Slicer is probably the easiest, and best supported tool for working with [Firecracker](https://firecracker-microvm.github.io/) and microVMs.

The OS images and Kernels have been specially tuned for container workloads whilst working with various CNCF projects building actuated - our managed GitHub Actions offering. The documentation site gets you from zero to Firecracker Kubernetes cluster within single digit minutes.

So you get to have fun with your lab again, an excuse to buy an [N100](/n100-mini-computer/) or Beelink - a way to to experiment and learn in an isolated environment.

## What is a preview?

Slicer is already suitable for productive R&D/support uses and long-running production workloads.

So why is this being called a preview? It's an internal tool, which we have been using since ~ 2022 along with actuated.

The preview is referring to making it consumable and useful as a public offering.

## Enough talking, I just want to see it running

You can watch a brief demo here:

<iframe width="560" height="315" src="https://www.youtube.com/embed/XCBJ0XNqpWE?si=2Py3LmT-ATbDTcI-" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

> The demo features the Serial Over SSH (SOS) console which is great for chaos testing and debugging tricky issues without relying on networking.

## Stacking value - autoscaling Kubernetes - on your own hardware

With the original versions of Slicer, we were already able to stand up a HA K3s cluster within about a minute, but with the new version, we can autoscale nodes through the upstream Kubernetes Cluster Autoscaler project.

This is the pinnacle of cool for me, but it has a real purpose - OpenFaaS customers run on spot instances, and autoscaling groups. Typically you just can't reproduce that on your own kit.

<iframe width="560" height="315" src="https://www.youtube.com/embed/MHXvhKb6PpA?si=hRxZu-BNVSVNC4Qx" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

I'll be putting up our fork of the Cluster Autoscaler project on GitHub soon. 

### K3sup Pro if you need K3s

Whilst the [K3sup](https://k3sup.dev) CE edition with its `k3sup install/join` commands is ideal for experimentation, K3sup Pro was built to satisfy long standing requests for an IaaC/GitOps experience.

K3sup Pro adds a Terraform-like `plan` and `apply` command to automate installations both small and large - running in parallel.

What's more the plan command accepts the output from Slicer's API, so you can run `slicer up` then `k3sup plan/apply` and you have a kubeconfig for a HA K3s cluster, within a minute or two.

The plan file can be customised and retained in Git for maintenance and updates.

K3sup Pro is a huge time saver, and free for my GitHub Sponsors.

[Learn more about K3sup Pro](https://github.com/alexellis/k3sup?tab=readme-ov-file#k3sup-pro)

## Everything you get for the price of a coffee

> "Oh, I expected it to be free."

OpenFaaS was one of the first projects I built, and it was open-source from the start. Many people remember me for that. But those were different times, and now we need to fund salaries to enable full-time R&D and support.

In a way this reaction is a good thing - there are so many free tools available for to you. With Slicer Home Edition, we self-select the people who really want to use the software and want to join a community of self-hosters, home-labbers, and cloud native developers.

At some point in the future, we may move Slicer Home Edition to a "Once" model, pay once and use it forever. Something like 295 USD one-off, for lifetime access.

If you're already a sponsor, you get all of the below to play with as much as you like for free. So long as it's not used at or for your work/business/dayjob.

Included for 25 USD / mo is:

* [Slicer Home Edition](https://blog.alexellis.io/slicer-bare-metal-preview/) - for developers and homelabs - slicer up bare metal into lightweight microVMs
* [K3sup Pro](https://github.com/alexellis/k3sup) - plan and apply K3s installations, with a terraform style approach - run in parallel
* [OpenFaaS Edge](https://docs.openfaas.com/edge/overview/) - includes many of the commercial features of OpenFaaS - but licensed only for your personal, use (not at/for work)
* [Debug GitHub Actions](https://docs.actuated.com/tasks/debug-ssh/) jobs over SSH using the ssh gateway by [actuated](https://actuated.com)
* Direct access to [my sponsors portal](https://insiders.alexellis.io/), with all my past sponsors emails and 20% off my eBooks
* 50% off a 1:1 meeting with me via Zoom for advice & direction in the portal
* Access to the private Discord server for help and discussion

## Quick and dirty installation of Slicer

You'll need a sponsorship as mentioned above. This is used to activate your Slicer installation.

Within the sponsorship, you *also get* free access to K3sup Pro with its plan and apply features that take the output from Slicer and install a multi-master HA K3s cluster all in parallel.

These instructions are quick - and dirty. More will follow, but the technical amongst us will have no issues overlooking this for now.

You will need a system with Linux installed - I recommend Ubuntu 22.04 or 24.04. Arch Linux and RHEL-like systems should also work but I can't support you directly. 

The point is that a host running slicer is dedicated to this one task, not a general purpose system with all kinds of other software installed.

First use the [actuated](https://actuated.com) installer to install the pre-requisites. We aren't using actuated here, but they share a lot of DNA.

In time, we'll spin out a separate installer for Slicer.

```bash
mkdir -p ~/.actuated
touch ~/.actuated/LICENSE

(
# Install arkade
curl -sLS https://get.arkade.dev | sudo sh

# Use arkade to extract the agent from its OCI container image
arkade oci install ghcr.io/openfaasltd/actuated-agent:latest --path ./agent
chmod +x ./agent/agent*
sudo mv ./agent/agent* /usr/local/bin/
)

(
cd agent
sudo -E ./install.sh
)
```

Next, get the Slicer binary itself:

```bash
sudo -E arkade octi install ghcr.io/openfaasltd/slicer:latest --path /usr/local/bin
```

Once you have the Slicer binary, activate it with your new or existing [GitHub Sponsorship](https://github.com/sponsors/alexellis).

```bash
slicer activate
```

## Any colour you want, so long as it's black

This phrase has been attributed to Henry Ford, and it applies to Slicer too.

Slicer is made for cloud development, and production workloads. It's Linux only, x86_64 and Arm64.

We use Ubuntu LTS for all of our workstation and server deployments at OpenFaaS Ltd, so the root filesystem is Ubuntu based.

There is also a Rocky Linux image for those who prefer a RHEL-like experience, or need to work with RHEL/Fedora deployments for customer support.

## A quick template for a VM

Slicer uses a YAML file to define a host group, and then a number (`count`) of VMs to create within that group. If you start it up with a count of `0`, then you can use the API or CLI (`slicer vm add`) to create hosts later.

We'll cover customisation a bit later on, but for now, let's get something working - and then you can connect via SSH and customise the VM to your heart's content.

There are various configuration options and settings for storage and networking, so I'm going to give you the most basic to get started with.

We'll start by using a plain disk image, which is slower to create, but is persistent across reboots and doesn't require us to consider a production ready configuration of i.e. ZFS.

Create `vm-image.yaml`:

```yaml
config:
  host_groups:
  - name: vm
    storage: image
    storage_size: 25G
    count: 1
    vcpu: 2
    ram_gb: 4
    network:
      bridge: brvm0
      tap_prefix: vmtap
      gateway: 192.168.137.1/24

  github_user: alexellis

  kernel_image: "ghcr.io/openfaasltd/actuated-kernel:5.10.240-x86_64-latest"
  image: "ghcr.io/openfaasltd/slicer-systemd:5.10.240-x86_64-latest"

  api:
    port: 8080
    bind_address: "127.0.0.1:"
    auth:
      enabled: true

  ssh:
    port: 2222
    bind_address: "0.0.0.0:"

  hypervisor: firecracker
```

For a Raspberry Pi 5 with an NVMe drive, or any kind of other Arm64 server, change the image and kernel as follows:

```diff
-  kernel_image: "ghcr.io/openfaasltd/actuated-kernel:5.10.240-x86_64-latest"
-  image: "ghcr.io/openfaasltd/slicer-systemd:5.10.240-x86_64-latest"
+  kernel_image: "ghcr.io/openfaasltd/actuated-kernel:6.1.90-aarch64-latest"
+  image: "ghcr.io/openfaasltd/slicer-systemd-arm64:6.1.90-aarch64-latest"
```

Run the following:

```bash
sudo -E ./slicer up ./vm-image.yaml
```

The Kernel and Root filesystem will be downloaded and unpacked into containerd. These will then be used to clone a new disk of the size set via `storage_size`.

Feel free to customise the `count` which is the number of VMs to create in the group, and the `vcpu` or `ram_gb` fields.

You can connect to the API via `http://127.0.0.1:8080` - make sure you use the `Authorization: Bearer` header along with the token generated on start-up.

The Serial Over SSH console is also available at `ssh -p 2222 user@127.0.0.1` and is exposed on all interfaces, so you can connect to it remotely.

The `github_user` field is used to pre-program an `authorized_keys` entry for your user, so make sure your SSH keys are up to date on user profile on GitHub.

You will generally not SSH into a machine on the host itself, but from your laptop or workstation, or even remotely. Make sure that you read the output when Slicer starts up as it'll show you how to add the route for Linux and MacOS.

Then whenever you're ready you can connect directly to the VM over SSH using the `ubuntu` user:

```bash
ssh ubuntu@192.168.137.2
```

You can "reset" the VM by hitting Control + C then `rm -rf vm-1.img` followed by restarting slicer.

Bear in mind that the SSH host key will have changed, so run:

```bash
ssh-keygen -R 192.168.137.2
```

## Running Slicer as a daemon

Sometimes when we're doing much longer term testing, we'll set up Slicer to run as a systemd service, so when machines are powered off for the weekend (to save power) Everything is ready and waiting exactly as we left it.

To make slicer permanent create a systemd unit file i.e. `vm.service`:

```ini
[Unit]
Description=Slicer

[Service]
User=root
Type=simple
WorkingDirectory=/home/alex
ExecStart=sudo -E /usr/local/bin/slicer up \
  /home/alex/vm-image.yaml \
  --license-file /home/alex/.slicer/LICENSE
Restart=always
RestartSec=30s
KillMode=mixed
TimeoutStopSec=30

[Install]
WantedBy=multi-user.target
```

Then enable the service and start it.

You can have multiple slicer daemons running so long as their networking and host group names do not clash.

## How do I customise the image or setup userdata?

The preferred way to customise an image is to supply a userdata script. Note this is not cloud-init, but a bash script. Formal cloud-init makes starting microVMs very slow which is a non-goal for us here.

The userdata script will run as root on first boot.

```diff
config:
  host_groups:
  - name: vm
+   userdata: |
+      #!/bin/bash
+      echo "Enabling nginx"
+      apt-get update
+      apt-get install -y nginx
+      systemctl enable nginx --now
```

Or perhaps install Docker, and make the default user able to access the daemon:

```diff
config:
  host_groups:
  - name: vm
+   userdata: |
+      #!/bin/bash
+      echo "Enabling Docker"
+      curl -sLS https://get.docker.com | sh
+      usermod -aG docker ubuntu
```

For a more permanent setup, you could simply take the root filesystem, and extend it via Docker, publish a new image and then update your YAML file.

i.e.

```
FROM ghcr.io/openfaasltd/slicer-systemd:5.10.240-x86_64-latest

RUN apt-get update && apt-get install -qy nginx && \
  systemctl enable nginx --now
```

You could publish this new image via a CI pipeline using GitLab CI, GitHub Actions, or just a regular bash script or cron job.

Then update your `vm-image.yaml` to use your new image:

```diff
config:
  host_groups:
  - name: vm
-    image: "ghcr.io/openfaasltd/slicer-systemd:5.10.240-x86_64-latest"
+    image: "docker.io/alexellis2/slicer-nginx:5.10.240-x86_64-latest"
```

You can also create hosts via API, passing along your custom userdata script, which is the technique I used in the Cluster Autoscaler demo above.

## How does Slicer compare to other tools I already know?

lxd/multipass - this was the first tool I tried to use when testing large scale deployments of Kubernetes. We had already built-up experience with multipass and recommend it for testing OpenFaaS Edge / faasd CE. But it took about 3 minutes to launch each VM, and even longer to delete them. It was so painfully slow, and we'd already built up so much operational knowledge of microVMs through [actuated](https://actuated.com), that we decided to build our own tool.

incbus - a fork of lxd with lofty ambitions - many moving parts need to be understood, configured and decisions made before you can launch a VM. It's designed to be general purpose and even covers its own internal clustering, which in my mind makes it the Kubernetes of VM tools - make of that what you want.

QEMU/libvirt - the syntax for qemu is cryptic at best, and just not built to manage multiple VMs. libvirt is living in the 90s, it requires a lot of boilerplate XML and the networking is too low level for working quickly. Unlike microVMs, QEMU can run Windows, MacOS, and other OSes.

Kata Containers - Kata Containers is a project designed to run individual Pods (workloads), not Kubernetes nodes within microVMs.

kubevirt - kubevirt is an attempt to make VMs a workload similar to Pods in Kubernetes. It is naturally slower, more cumbersome and requires a Kubernetes cluster to function. I've often seen it used in homelabs to run Windows.

Proxmox VE - the much beloved tool of the home-lab community, despite being something of a kitchen sink, and rather heavyweight. So if you cut your teeth on "click and point ops" and enjoy something that makes you feel like a VMware admin, then it's probably a good option to consider instead of Slicer.

[actuated](https://actuated.com/) - managed self-hosted runners for GitHub Actions and GitLab CI, where the runners are launched in one-shot microVMs on your own cloud.

### Slicer is to microVMs, what Docker was to Linux namespaces

Slicer is a modern alternative focused on super fast creation and deletion of microVMs. It comes with SSH preconfigured, and systemd installed, along with just enough Kernel drivers to run containers, Kubernetes, and eBPF. It's fast and lean, and only does just enough for R&D and running production applications.

Slicer was written by a developer for making efficient use of large bare-metal hosts, but is equally at home on a Hetzner Robot / Auction instance, splitting up a 16 core / 128GB A102 host into 3-5 dedicated microVMs for various production applications - or a production-ready K3s cluster.

Slicer is a daemon, and can be run with systemd so it's always there when your machine reboots.

Slicer comes with a Serial Over SSH console for easy out of band access. Its API can be used to add and remove hosts dynamically and rapidly for autoscaling.

And unlike the other tools I mentioned, Slicer is equally at home running one-shot tasks like CI jobs, autoscaled Kubernetes nodes, isolated environments for AI agents, and any other kind of serverless task.

<iframe width="560" height="315" src="https://www.youtube.com/embed/5RjtVM4bvp0?si=SbAaWwnvi7jD3pte" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

> Demo of one-shot / API mode

## Wrapping up

The Slicer Preview is strictly licensed as a "Home Edition" for use by individuals, it is not licensed for use within or for a business - this will require a [commercial agreement](mailto:contact@openfaas.com). But having said that, feel free to try it out and get back to me via Twitter [@alexellisuk](https://x.com/alexellisuk).

Get started:

1. Become a [GitHub sponsor](https://github.com/sponsors/alexellis) at 25 USD / mo or higher, if you are not already.
2. Find a machine and install Linux onto it, or go to Hetzner Robot (bare metal cloud) and set up a beefy bare-metal host for 30-40 EUR / month. The [Intel EX44](https://www.hetzner.com/dedicated-rootserver/ex44/) is fantastic value. I also talk about the [Intel N100 and other mini PCs in my recent blog post](https://blog.alexellis.io/n100-mini-computer/).
3. Email me at alex@openfaas.com and I'll send you a Discord invite so we can talk about your use-case, help you get started, and get your feedback.

In the next post we'll look at:

* How to run the same, but on Arm, i.e. a Raspberry Pi 5 or Asahi Linux on a Mac Mini M1 or M2
* How to use ZFS snapshots and clones for instant boot of new VMs, instead of static disk files
* How to use the `slicer vm list`, `slicer vm top`, `slicer vm exec` commands

We have also launched a [documentation site](https://docs.slicervm.com) with examples such as:

* Launch a large HA K3s cluster
* Chaos test a Kubernetes operator through its network whilst retaining serial access
* Run multiple isolated, production applications on a bare-metal host on Hetzner
* Autoscale a K3s cluster
* Run a K3s cluster across multiple hosts
* Mount a GPU with Ollama for LLMs
* Run Slicer on your Raspberry PI
* Run OpenFaaS Edge (Sponsors Edition) or faasd CE on a microVM

Based upon your feedback, we'll add more examples and changes to the CLI, REST API and configuration format.

Whilst you're getting into things, here are a few more videos on Slicer:

* [Cluster Autoscaling with K3s and the Headroom Controller](https://youtu.be/MHXvhKb6PpA)
* [How we use Slicer to slice up bare-metal for customer support & development](https://youtu.be/XCBJ0XNqpWE)
* [Mount GPUs into microVMs for LLMs & CI jobs with Slicer](https://youtu.be/YMgrbic-8h4)
* [Scaling to 15k OpenFaaS Functions with Slicer](https://youtu.be/VhPxqlbwoXE)
* [Grab your lab coat - we're building a microVM from a container](https://actuated.com/blog/firecracker-container-lab)

Footnotes:

* `[1]` Yes, in some Kubernetes distributions you can force the default limit above 100 slightly, but on the machine in question, even doubling that limit would not make effective use of the machine's capabilities. Exercise judgement if/when increasing the limit.
