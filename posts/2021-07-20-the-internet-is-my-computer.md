---
title: "The Internet is my computer"
slug: "the-internet-is-my-computer"
date: "2021-07-20T08:23:10Z"
author: "Alex Ellis"
meta_title: "The Internet is my computer"
meta_description: "In 1984 John Gage said \"The Network is the Computer\", but four decades later, what does that mean for developers and their IDEs?"
tags:
  - "bare metal"
  - "github"
  - "ide"
  - "vsocde"
  - "cloud native"
  - "kubernetes"
---

In 1984 [John Gage](https://en.wikipedia.org/wiki/John_Gage) of [Sun Microsystems](https://en.wikipedia.org/wiki/Sun_Microsystems) was credited as saying *"The Network is the computer."* Almost four decades ago, John had a vision of distributed systems working together to be greater than the sum of their parts.

In this article, I'll introduce I want to dig a little deeper into John's words and what that means for us today. We'll also look at a very practical use-case for *the Internet is my computer* through hosted IDEs which have a number of different benefits and users. As a [CNCF Ambassador](https://www.cncf.io/people/ambassadors/), I'll also be asking what role Kubernetes has to play here and giving my personal take on hosted IDEs.

## More than the sum of its parts

The core idea was that, if you had your own computer or terminal, then you could tap into the resources such as CPU, memory and storage of others on the network. This would allow for individuals to process computationally hard problems without owning the necessary hardware.

Today, the Internet has opened possibilities that may have seemed like science-fiction in the 1980s. Public cloud has all but removed issues around capacity planning and server management, whilst retaining many of the benefits, and going as far as to offer per millisecond billing for resources that would have previously involved serious capital investment.

### Moving Closer to Users, and to Hardware

I’ve known the [Equinix Metal](https://equinixmetal.com/) (formerly Packet) folks for a while. Our worlds crossed back when my interest in Docker and [Raspberry Pi](https://www.raspberrypi.org/) overlapped with their early entrance into bare-metal and Arm CPUs. Since then, Packet has joined Equinix, which is where much of the underlying infrastructure of the Internet — think fiber optic cables, hyperscaler networks, and wireless carriers — connects. I caught up with [Jacob Smith](https://metal.equinix.com/blog/author/jacob-smith/) (he co-founded Packet and now runs bare metal engagement and marketing for Equinix) on this concept of the internet as a my computer. Here’s what he shared:

> "As workloads scale and interact with users distributed all over the world, we see them reach down and out. Down to get closer to the hardware, and out to get closer to users. This is made possible by better tooling and the rising tide of open source, which have abstracted complexity while still allowing developers to do increasingly powerful things."

"For instance, building and running your own IDE," added Jacob.

![Hacking from my shed](/content/images/2021/07/PXL_20210720_080841146-s.jpg)
> Hacking on the k3sup project from my shed with an 11" iPad Pro, but there is more promise to hosted IDEs than this.

While we’re talking about bare-metal servers, this is not the "rack and stack it" of the 1990s and early 2000s. Packet developed an API-driven system to automate server provisioning and management for bare-metal. The culimation of this work is the [Tinkerbell project](https://tinkerbell.org/), which Equinix has contributed to the [Cloud Native Computing Foundation (CNCF)'s Sandbox](https://www.cncf.io/sandbox-projects/), building upon other support they’ve quietly given to open source, like the [CNCF Community Infrastructure Lab](https://www.cncf.io/community-infrastructure-lab).

> "The CNCF Community Infrastructure Lab (CIL) provides free access to state-of-the-art computing resources for open source developers working to advance cloud native computing."

As we explore use-cases for a hosted IDE, bare-metal servers present an attractive opportunity: fully dedicated infrastructure that is hosted at the edge of the network paired with the automation and "cheap to get started" benefits of on-demand and API-driven cloud.

As a [CNCF Ambassador](https://www.cncf.io/people/ambassadors/) and [maintainer of various OSS projects for Kubernetes](https://github.com/alexellis), I was also curious what role Kubernetes had to play here.

## The most popular IDE

According to [PYPL's index of IDE popularity](https://www.infoworld.com/article/3217008/the-most-popular-ides-visual-studio-and-eclipse.html), VSCode, which first appeared in 2015, was ranked as the most popular editor.

> Features include support for debugging, syntax highlighting, intelligent code completion, snippets, code refactoring, and embedded Git. Users can change the theme, keyboard shortcuts, preferences, and install extensions that add additional functionality.
> 
> [via Wikipedia](https://en.wikipedia.org/wiki/Visual_Studio_Code)

I started my career using *Visual Studio* and continued on for 10 years, before discovering alternative light-weight IDEs like Atom and VSCode. Visual Studio was *the way* to build and develop .NET applications with C# and there was no real alternative.

The lightweight IDEs were more similar to a text editor, and initial versions lacked many features of the more traditional products. I was attracted to the simplicity and responsiveness of working on a single file or folder at a time vs. an entire multi-project solution.

VSCode is built with the [Electron framework](https://www.electronjs.org). With electron, you can build cross-platform desktop apps with JavaScript, HTML, and CSS.

Can you see where this is going? Where else does JavaScript, HTML and CSS run particularly well? In a web browser. The Internet is my IDE.

## The Internet is my IDE

I asked my Twitter followers what value they saw in a hosted IDE and fully expected to hear responses similar to John's initial vision in 1984 - gaining access to fast hardware and the near unlimited resources of the Internet.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">What value do you see in hosted IDEs vs. local dev environments? I&#39;m exploring the space would like to hear from converts. <br><br>Think: <a href="https://twitter.com/gitpod?ref_src=twsrc%5Etfw">@gitpod</a> and <a href="https://twitter.com/github?ref_src=twsrc%5Etfw">@github</a> codespaces.</p>&mdash; Alex Ellis (@alexellisuk) <a href="https://twitter.com/alexellisuk/status/1415612874106589185?ref_src=twsrc%5Etfw">July 15, 2021</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

It seems like there are a number of different personas for hosted IDEs ranging from the individual hacker, to the engineering manage, to large open source projects.

A hosted IDE immediately opens up possibitilies like working on an iPad, Chromebook or other thin terminal like a 35 USD Raspberry Pi. You can find out more in Joe Previte's article: [What I learned from coding on an iPad for two weeks](https://coder.com/blog/i-developed-on-an-ipad-for-two-weeks). Joe works at [Coder](https://coder.com), a company that specialises in hosted VSCode solutions.

A CTO of a small European business DM'd me and told me that using a hosted IDE for his remote team would reduce the Total Cost of Ownership (TCO) vs. sending out 2500 USD laptops to each new joiner.

[Chris Aniszczyk, CTO of the CNCF](https://twitter.com/cra) told me that the [Prometheus monitoring project](https://prometheus.io/) has been using hosted IDEs as a way of launching a code-review environment. Here, we start to see convenience of a pre-built environment augmented with the vast resources of the Internet.

I've had my own prior experience of combining hosted IDEs with open source. In 2018, before the pandemic, a number of us from the OpenFaaS community were putting on free in-person events at conferences to teach our [community workshop on serverless](https://github.com/openfaas/workshop).

> I will never forget the one event where it took the whole class 3 hours to deploy a Kubernetes cluster and install a couple of CLIs.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr"><a href="https://twitter.com/openfaas?ref_src=twsrc%5Etfw">@openfaas</a> workshop in action by <a href="https://twitter.com/viveksyngh?ref_src=twsrc%5Etfw">@viveksyngh</a> <a href="https://twitter.com/hashtag/openfaas?src=hash&amp;ref_src=twsrc%5Etfw">#openfaas</a> <a href="https://twitter.com/hashtag/python?src=hash&amp;ref_src=twsrc%5Etfw">#python</a> <a href="https://twitter.com/hashtag/workshop?src=hash&amp;ref_src=twsrc%5Etfw">#workshop</a> <a href="https://twitter.com/hashtag/meetup?src=hash&amp;ref_src=twsrc%5Etfw">#meetup</a> <a href="https://twitter.com/hashtag/bangalore?src=hash&amp;ref_src=twsrc%5Etfw">#bangalore</a> <a href="https://t.co/ngarmqRqMQ">pic.twitter.com/ngarmqRqMQ</a></p>&mdash; Saiyam Pathak (@SaiyamPathak) <a href="https://twitter.com/SaiyamPathak/status/1172771743728988161?ref_src=twsrc%5Etfw">September 14, 2019</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

The setup was repetitive, and whilst it was a necessary skill, it detracted from the purpose of the event - to teach the capabilities and use-cases of OpenFaaS. So I used Coder's VSCode Docker image and a number of scripts so that we could give preinstalled VMs to students: [workshop-vscode](https://github.com/openfaas-incubator/workshop-vscode). The repo shows how to pre-install Docker and Kubernetes, and can be customised to your own projects too.

As a [GitHub Star](https://stars.github.com), I was given early access to GitHub's Codespaces program. For any given repository, I can launch a VM with Docker and other common developer tools preinstalled and start hacking immediately.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">So seamless launching <a href="https://twitter.com/github?ref_src=twsrc%5Etfw">@GitHub</a> codespaces to hack on arkade apps. +1 for knowing that I wanted a dark theme. <a href="https://t.co/2cxHyo7iaQ">pic.twitter.com/2cxHyo7iaQ</a></p>&mdash; Alex Ellis (@alexellisuk) <a href="https://twitter.com/alexellisuk/status/1415306926221574144?ref_src=twsrc%5Etfw">July 14, 2021</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

> My first use of Codespaces on [arkade Kubernetes marketplace](https://github.com/alexellis/arkade)

There are a couple of my friends that work for [GitPod](https://www.gitpod.io) so I reached out to the founders to ask them more about their customers. Johannes told me that a number of their clients use costly Virtual Desktop Interfaces (VDIs) to make a locked-down environment available to their developers, to work comply with various regulations. GitPod runs in containers and means that it scales well for this use-case.

## Augmented solutions

[Marc Campbell of Replicated](https://twitter.com/mccode) messaged me and told me how much of a fan his team were of hosted IDEs, but that they did things differently.

For Marc, a local IDE provides the best experience when it comes to responsiveness and keyboard bindings. Instead of hosting the IDE in the browser, Marc provisions a beefy VM or bare-metal host on public cloud and then plumbs the terminal to that machine. So he gets the best of both worlds - that initial promise of *The Network is my Computer* - bandwidth, CPU and memory, coupled with a responsive and native application.

<blockquote class="twitter-tweet" data-conversation="none"><p lang="en" dir="ltr">But, how do you suppress Control + W from closing the browser? I love using this command to clear text in the terminal.<a href="https://twitter.com/martinwoodward?ref_src=twsrc%5Etfw">@martinwoodward</a> ? <a href="https://t.co/GwjHSGfa6u">pic.twitter.com/GwjHSGfa6u</a></p>&mdash; Alex Ellis (@alexellisuk) <a href="https://twitter.com/alexellisuk/status/1415307119310655490?ref_src=twsrc%5Etfw">July 14, 2021</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

> Pictured: I love my bash keyboard shortcuts, but the browser wouldn't allow me to type in *Control + W*

[David Flanagan (né McKay) of Equinix Metal](https://twitter.com/rawkode) invited me to record a live-stream and to hack on a [Kubernetes Operator](https://github.com/inlets/inlets-operator) together. If you've ever used software like Zoom, then you know how it goes - you spend most of the time calling out line numbers and saying *go up a bit, go down a bit, no there!*

[![Watch now](https://img.youtube.com/vi/jfHRDAG9ncU/hqdefault.jpg)](https://www.youtube.com/watch?v=jfHRDAG9ncU)

> Jump to 00:21:00 in the video to see our plan of action, then the shared editor experience. 

This time was different - David enabled VSCode's live sharing setting and we both worked on an IDE running on our local computers, but we could both edit and scroll at once and keep in sync.

## Your computer is the Internet

We are seeing increasing commoditisation of hardware and with that comes both lower costs and a more accessible user experience. This new wave of use-cases and value proposition for hosted IDEs is a refelection of that progress and from the responses I've seen, it looks like we are only just getting started.

If you'd like to try out a hosted IDE (like GitPod / Coder), or running a powerful on the cloud and a local browser (like Marc), then I've compiled some up to date links for you:

* [Coder's code-server](https://github.com/cdr/code-server) - an open source Docker image that hosts VSCode and has easy password/TLS configuration
* [VScode docs: Remote Development using SSH](https://code.visualstudio.com/docs/remote/ssh) - work like Marc's team with a local editor and a remote host for checking out and running code
* [GitPod - self-hosted](https://www.gitpod.io/self-hosted) - the self-hosted option for GitPod is free, but is best suited to a team than individuals and requires a Kubernetes cluster to run
* [GitHub Codespaces](https://github.com/features/codespaces) - closed public beta, but you can apply for the waitlist today
* [Eclipse Che](https://www.eclipse.org/che/) - billed as "The Kubernetes-Native IDE" - there is a hosted service provided by Red Hat and an option for [local Kubernetes clusters](https://www.eclipse.org/che/docs/che-7/installation-guide/installing-che-locally/).

### Kubernetes, the Operating System

VScode can be run as a stand alone process, or within a container using Docker, but things really start to get interesting when we scale and move to multi-user environments. As I mentioned earlier, GitPod, Coder and others are using Kubernetes to orchestrate containers and VMs to share resources efficiently.

I was told that Kubernetes not only helped slice up hardware more efficiently, but cutting edge projects like [stargz](https://github.com/containerd/stargz-snapshotter) can improve load times by starting a container before it has been fully downloaded. Projects like [Falco](https://falco.org/) integrate with [eBPF](https://ebpf.io/) and can be used to detect abuse or misuse within multi-tenant systems.

### Try it out with bare-metal

Until the end of the year, new customers to Equinix Metal can get 200 USD of free credits to spin up their own cloud native IDE. Just use the code `johngage`, which Jacob created for this article. You'll be able to run the IDE 24/7 for a week (7 days x 24 hours x 1.00 USD/hr = $168) and see if it's for you. Not only can you find servers with hundreds of GB of RAM, but their bonded 2 x 10 Gbps uplink is faster than most of us could ever hope to afford for a home connection.

I'd recommend trying out Coder's solution and have included a micro-tutorial for you to try out today. I used their utility script and had everything working for Go development within 10 minutes. And if you can't get used to the keyboard shortcuts in the browser, you try the remote SSH approach linked above.

If you have plenty of time on your hands, then you could install [K3s and self-hosted GitPod](https://www.gitpod.io/docs/self-hosted/latest/install/install-on-kubernetes/) which would enable multiple people in your team to share a single dedicated host, making the cost / efficiency ratio work out better.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">In less than 10 minutes I launched an instance of hosted VSCode with 48 threads, 64GB of RAM and 2x 10 Gbps bonded uplink to the Internet 🤩 <a href="https://twitter.com/CoderHQ?ref_src=twsrc%5Etfw">@CoderHQ</a> even automated TLS, authentication and a public URL.. So no more taking the laptop on vacation? WDYT<a href="https://t.co/KOTxLL6lW9">https://t.co/KOTxLL6lW9</a> <a href="https://t.co/2fOkiUjudT">pic.twitter.com/2fOkiUjudT</a></p>&mdash; Alex Ellis (@alexellisuk) <a href="https://twitter.com/alexellisuk/status/1417079259043139585?ref_src=twsrc%5Etfw">July 19, 2021</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

Just bear in mind that you'll need to install any development software you plan to use via the integrated terminal such as Go, Docker, K8s or Node.js.

* [Microtutorial: Equinix Metal is my computer](https://gist.github.com/alexellis/245411dfe8222283a6f536d9413aac58)

> Disclosure: [Equinix Metal](https://metal.equinix.com) is a client of [OpenFaaS Ltd](https://openfaas.com/consulting).

### My take for 2021

As the maintainer of several large open source projects, you may be wondering what my take is? You may remember my blog post about [building a local Linux computer for work and development](https://blog.alexellis.io/building-a-linux-desktop-for-cloud-native-development/). My prediction is that we'll continue to see IDEs running in a browser, but for me, this innovation is not about that. Developers are quick to point out that a fast Internet connection is not always available or guaranteed.

So for me, it's not about replacing my workstation or laptop, which provides a great development experience today. What excites me is the opportunity for collaboration, live coding, sharing and making open source contributions more accessible. A prime example was the OpenFaaS in-person workshop, where we were able to remove that initial 3-hour setup time for new users of Kubernetes and Docker by having everything [primed ahead of time](https://github.com/openfaas-incubator/workshop-vscode). We are only just getting started here.

### You may also like

* [Bare-metal Kubernetes with K3s](https://blog.alexellis.io/bare-metal-kubernetes-with-k3s/)
* [Bare Metal in a Cloud Native World - The New Stack](https://thenewstack.io/bare-metal-in-a-cloud-native-world/)
* [State of netbooting Raspberry Pi in 2021](https://blog.alexellis.io/state-of-netbooting-raspberry-pi-in-2021/)
* [Running Falco and k3s at the edge with 64-bit ARM](https://blog.alexellis.io/falco-at-the-edge-arm64/)