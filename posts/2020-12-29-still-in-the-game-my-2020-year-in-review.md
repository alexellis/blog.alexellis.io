---
title: "Still in the game: My 2020 Year in Review"
slug: "still-in-the-game-my-2020-year-in-review"
date: "2020-12-29T14:57:15Z"
author: "Alex Ellis"
meta_title: "Still in the game - My 2020 Year in Review"
meta_description: "After two years of independence, I'm still in the game. Join me as I explore the highlights of a second year of independent business and creating OSS."
feature_image: "/content/images/2020/12/harris-vo-ZX6BPboJrYk-unsplash.jpg"
tags:
  - "open source"
  - "openfaas"
  - "kubernetes"
  - "inlets"
  - "arkade"
  - "k3sup"
---

I'm *still in the game*, so join me as I explore the highlights of a second year of independent business and creating Open Source software. I'll share my top blog posts by views, top interviews, books that have influenced me and a little about each project I maintain. At the end of the post I'll talk about what 2021 has in store.

> I had a lot of help this year, so I want to thank all my company's customers, [my GitHub Sponsors](https://github.com/sponsors/alexellis), and everyone who contributed or helped to share.

## Most popular blog posts of 2020

Over the past year, I've focused on developing the OpenFaaS and inlets brands, and I've also experimented with Medium's Partner Program. These are the four blogs where you would have seen me:

* [openfaas.com/blog](https://openfaas.com/blog) - OpenFaaS tutorials and news
* [inlets.dev/blog](https://inlets.dev/blog) - case-studies, tutorials and news on inlets
* [blog.alexellis.io](https://blog.alexellis.io) - my original blog for experiments, technical writing, tutorials that don't fit with one of the other brands.
* [medium.com/@alexellisuk](https://medium.com/@alexellisuk) - blog posts that I think can be monetized

It's been encouraging to see my posts trending on Hacker News, Reddit and Twitter, along with being included in newsletters like [KubeWeekly](https://kubeweekly.io/) and [cron.weekly](https://ma.ttias.be/cronweekly/).

Here are the most popular blog posts from the year ranked by views:

* [Five years of Raspberry Pi Clusters (2020)](https://alexellisuk.medium.com/five-years-of-raspberry-pi-clusters-77e56e547875) (Medium.com)
* [Then he asked me “Is Kubernetes right for us?” (2020)](https://alexellisuk.medium.com/then-he-asked-me-is-kubernetes-right-for-us-78695ee35289) (Medium.com)
* [Golang basics - writing unit tests (2017)](https://blog.alexellis.io/golang-writing-unit-tests/) (alexellis.io)
* [Will it cluster? k3s on your Raspberry Pi (2019)](https://blog.alexellis.io/test-drive-k3s-on-raspberry-pi/) (alexellis.io)

From openfaas/inlets:

* [Web scraping that just works with OpenFaaS with Puppeteer (2020)](https://www.openfaas.com/blog/puppeteer-scraping/) (OpenFaaS.com)
* [How to monitor multi-cloud Kubernetes with Prometheus and Grafana (2020)](https://inlets.dev/blog/2020/12/15/multi-cluster-monitoring.html) (inlets.dev)

I now have hundreds of blog posts going back several years, so it's difficult to read too much into the numbers, as it depends on how much traffic the site gets and where it has trended. A post on Hacker News could get 15k views overnight, and another more impactful post could get a steady stream of 3k per day from organic searches.

This year I've mainly focused on use-cases, and on capturing the imagination. In 2021, you'll see more of the same along with more guest posts on the blogs.

## Best interviews / features

As part of [GitHub's readme program](https://github.com/readme), I was invited to write a feature-length piece on independent business and Open Source development

* [Balancing open source sacrifice and success](https://github.com/readme/alex-ellis)

I hope this gives you a deeper perspective on what it's like to be on the hook for a large OSS project.

[Craig Box](https://twitter.com/craigbox?lang=en) from Google reached out to me and asked me: "Why aren't you working for a FAANG company for 350K USD / year"?

Before I knew it, Craig had sketched out a brief history of my career in a Google Doc, and we were recording a podcast with his co-host

* [Kubernetes Podcast #116 - Independent Open Source](https://kubernetespodcast.com/episode/116-independent-open-source/)

Learn how a developer at a payroll company became a Docker Captain, caused a stir with a prototype, and quit his job to create an independent software business.

## Influential reads

I've read a number of books this year that have had an influence on me. I can't say that I finished them all, but I did get something from each that has helped me with my journey.

* [Don't just roll the dice](http://neildavidson.com/downloads/dont-just-roll-the-dice-2.0.0.pdf) - a short guide to software pricing by Neil Davidson - this book taught me about the "pricing curve" - and how once a price rises above 0USD (think open source), you lose part of your potential market. There is a sweet spot on the curve. It also taught me about "price anchoring" - where a similar product becomes the way people expect your offering to be priced.

* [Before The Exit: Thought Experiments For Entrepreneurs by Dan Andrews](https://amzn.to/3hoCFpb) - this book showed me that a product or project gives a platform and outlet, that once taken away can leave a void. It also challenged the idea that selling a business is the only successful outcome. And that receiving a windfall of cash, isn't necessarily as fulfilling as we would hope.

* [The Irresistible Consultant's Guide to Winning Clients by David A. Fields](https://amzn.to/38H5okY) - the main learning in this book is that success is found not in selling what you think you are able to, but in finding what pain a customer might have, and offering a solution that could help. Likewise, they need to sense urgency and enough pain to buy the solution. It also has to be simple enough to make sense to them.

> A good example of this would be Tailwind UI - a series of HTML and CSS snippets built by a designer and marketed to developers. Most backend developers are hopeless at making things look nice on a webpage.

* [The Visual MBA by Jason Barron](https://amzn.to/3oaFQU5) - having spent so much of my life giving all of the value I was creating away for free, this book helped me understand a framework for testing business ideas and iterating on them.

> Ultimately, from a business and sustainability perspective, Open Source software fails its creators and only benefits its users.

* [Start with Why by Simon Sinek](https://amzn.to/3hoG0Vd) - the premise of this book was enough for me to stop and question things. When you're responsible for picking what you're working on, then asking Why? becomes even more important. Why did I start OpenFaaS? Why am I still working on it? 

> Having a why and challenging it over time could save us all a lot of wasted time.

A common theme in all of these books was that customers buy ways to reduce and remove pain. It needn't be a 10x improvement, but it should be an obvious solution, and they need to have a sense urgency about fixing the problem.

I would also say that I've become more aware of "Indie Hackers" - these are solo developers who come up with what's usually a very trivial idea, but execute on it hard. One example that caught my attention was a service that just [makes banner images for blog posts](https://www.bannerbear.com/). That was it. That was the product. From the outside, it looks like a simple idea that is easily copied, but by pressing in, he is now earning 8k USD per month from a platform, which I imagine costs very little to run.

When I compare this to my journey with OpenFaaS, and consider that its [recurring revenue on GitHub Sponsors](https://github.com/sponsors/openfaas) is only around 500 USD / mo, from one end-user company, it makes me question the ideology of Open Source Software.

## Project highlights

### inlets - Cloud Native tunnels

* [inlets](https://inlets.dev)

> inlets was created to make tunnels something we could self-host, to get away from the limitations of SaaS products, and to integrate deeply with VMs, containers and Kubernetes.

This year I launched a landing page and blog for [inlets PRO](https://inlets.dev). To begin with it was just a few pieces of Tailwind UI tied together that showed pricing and features. It was a starting-point, but then over time it's evolved and now even has its own blog with guest posts.

Highlights for inlets:

* inlets blog launched - the first post was about my inlets presentation on ["Advanced cloud patterns" at cert-manager's community day](https://inlets.dev/blog/2020/10/08/advanced-cloud-patterns.html). Since then I've seen several guest posts and an uptick in visits to the domain because of SEO and social sharing.

* Business customers - inlets PRO has seen lots of customer interest over the year, and had its first business customers. I've got used to qualifying leads, following-up on free trials and more used to rejection.

* [inletsctl](https://github.com/inlets/inletsctl)/[inlets-operator](https://github.com/inlets/inlets-operator) providers - both gained new cloud providers like Hetzner, Azure and Vultr. I couldn't have done this without the support of the community

* [inlets OSS + PRO syntax](https://github.com/inlets/inlets-pro/releases/tag/0.7.0) - both were quite different and are now almost identical to help with adoption and to make it more intuitive for new users

* Personal customers - some customers feel the price is fair, others expect it to be free. This is just the pricing curve doing its thing.

Most personal customers are choosing inlets PRO to enable their local development, self-hosting needs or to get [Ingress into their homelabs](https://blog.alexellis.io/self-hosting-kubernetes-on-your-raspberry-pi/).

> It only takes a few seconds to create a tunnel server with inletsctl, but next year, if there's enough interest then I may look into building a managed inlets service.

### OpenFaaS - Serverless Functions Made Simple

* [OpenFaaS](https://www.openfaas.com)

My top highlights:

* [faasd](https://github.com/openfaas/faasd) adoption and reception
* Writing [Introduction to Serverless Kubernetes for the LinuxFoundation](https://www.openfaas.com/blog/introduction-to-serverless-linuxfoundation/)
* Going fully multi-arch for all OpenFaaS projects
* [Moving the templates to multi-arch with buildx](https://www.openfaas.com/blog/openfaas-functions-with-github-actions/)
* [Celebrating the 4th Birthday with the community](https://www.openfaas.com/blog/birthday-invite/)

For OpenFaaS my highlight would be [faasd](https://github.com/openfaas/faasd). faasd was initially an experiment to see if [containerd](https://containerd.io) would make a good back-end for functions instead of Kubernetes. By removing the support for clusters which have natural latency through their event-drive nature, things like cold-starts got so rapid, that they stopped existing. The cost to run OpenFaaS dropped from "a Kubernetes cluster" to a 3 EUR / mo VPS.

> We're still only scratching the surface of what faasd will mean for the community.

You end up with something that costs less than cloud functions, and has a much better developer experience, with the ability to "scale-up" into Kubernetes in the future.

* [Meet faasd. Look Ma’ No Kubernetes!](https://www.youtube.com/watch?v=ZnZJXI377ak) - a 10 minute video overview of the use-case, the differences, and how people are using it in production already.

See it in action in this community blog post: [Tracking Stripe Payments with Slack and faasd](https://myedes.io/stripe-serverless-webhook-faasd/)

### arkade - portable Kubernetes marketplace

* [arkade](https://get-arkade.dev/)

arkade now has 40 apps that you can install with one command, and dozens of CLIs that you can install much quicker than using brew or apt-get. This year I've seen around half a dozen projects copy the approach arkade uses to fetch binaries, so I think we're on to something there.

Its real value comes in compounding - when you need several CLIs or Apps for a tutorial or cluster, the speed-up in getting something deployed is huge.

Want self-hosted OpenFaaS, with a public IP and TLS certificate, but running on your laptop, with KinD?

```bash
# Get your CLIs
arkade get kind
arkade get kubectl
arkade get faas-cli

# Create that cluster
kind create cluster

# Deploy inlets-operator to get a public IP for your IngressController
arkade install inlets-operator \
  --token-file $HOME/digitalocean-token \
  --region lon1 \
  --license-from $HOME/license.txt

# Install a HTTP and TLS stack
arkade install ingress-nginx
arkade install cert-manager

# Install OpenFaaS and generate an ingress record
arkade install openfaas
arkade install openfaas-ingress \
  --email web@example.com \
  --domain reg.example.com
```

You'd then have a TLS cert for OpenFaaS gateway running on your laptop at `https://reg.example.com`

The same can be done with other combinations Apps and CLIs too.

arkade also gained [its first Sponsored App for Venafi](https://www.openfaas.com/blog/arkade-venafi/)

### k3sup ("ketchup") - bootstrap K3s over SSH

* [k3sup](https://k3sup.dev/)

k3sup gained support for K3s' new HA mode using etcd and was used in several of my newest tutorials:

* [Set up Your K3s Cluster for High Availability on DigitalOcean](https://rancher.com/blog/2020/k3s-high-availability)
* [Bare-metal Kubernetes with K3s](https://blog.alexellis.io/bare-metal-kubernetes-with-k3s/)

If you've not seen it yet, it looks a bit like this:

<img src="https://github.com/alexellis/k3sup/blob/master/docs/k3sup-cloud.png?raw=true" width="95%">

Through the `k3sup install` command you can create a cluster with an initial server, then use the `k3sup join` command and the server's IP to join in your nodes.

For example, provision two hosts, then install k3s to one as a server, and join the second to it. You'll be able to merge the resulting configuration to your local Kubernetes config file too.

```bash
k3sup install --host k3sup-server1.ec2.example \
 --merge \
 --path $HOME/.kube/config \
 --context k3s-ec2

k3sup join --server-host k3sup-server1.ec2.example \
 --host k3sup-agent1.ec2.example
```

Then make use of your new cluster:

```bash
kubectl config set-context k3s-ec2
kubectl get nodes
```

I continue to see lots of tutorials appearing for the project, and launched a range of SWAG which was popular with the community.

You can still [buy a t-shirt, mug or hoodie](https://store.openfaas.com/collections/the-k3sup-collection) and support the project.

## 2021 outlook

> I had a lot of help this year, so I want to thank all my company's customers, [my GitHub Sponsors](https://github.com/sponsors/alexellis), and everyone who contributed or helped to share.

Many of you will be aware of the challenges of developing and maintaining Open Source Software for free, without any form of compensation or value capture. Popularity, contributions and traction are all encouraging, but compound the problem.

> I still don't know the solution to making OpenFaaS sustainable in the long-term, but it's clear that giving everything away for free makes for an extremely difficult path to walk.

For that reason I want to thank [my GitHub Sponsors](https://github.com/sponsors/alexellis) who have taken the hardest step of reaching into their pockets. Through your weekly Insiders' Updates, you've got a personal view into the peaks and troughs of my year.

<a href="https://faasd.exit.openfaas.pro/function/trove/login/"><img src="/content/images/2020/12/trove.png" alt="The Treasure Trove Portal" width="60%"></a>

I also created [The Treasure Trove](https://faasd.exit.openfaas.pro/function/trove/login) for you, where you can go back in time and see over 18 month's worth of updates, tips and private downloads. Did you know that it's built as a Go function, deployed to a faasd instance on a Raspberry Pi 3, linked to the Internet through inlets?

Over the past year I've helped several companies [reach and engage developers](https://www.alexellis.io/) through engineering as marketing, writing, social media and my expansive network of maintainers and influencers. I want to thank Equinix Metal, Dialog exe AS, The LinuxFoundation, Sysdig, Venafi, Rancher, Civo and others who worked with my company this year. We are just getting started here.

I don't know what 2021 will hold for us all, but I am ready for the challenge and still in the game.

### How you can help

Has my work helped you in some way? Have I inspired you on some level? Did you ever think: *If Alex can do it, then maybe I can too?* Maybe you needed to get some help at work, and when you Googled Kubernetes, Golang, or Docker, my name kept coming up. Maybe you use multi-stage Docker builds, did you know I wrote that tutorial you used?

You can support my continued Open Source and community activities in one of these ways:

* Join my Insiders' program via [GitHub sponsor](https://github.com/sponsors/alexellis) - you'll get weekly emails and updates from me, but more than that - enable me to invest more of my time in Open Source
* Buy my new eBook - [Serverless For Everyone Else](https://gumroad.com/l/serverless-for-everyone-else) - a great starting point - especially if you've ever said *Serverless isn't for me*
* If you use OpenFaaS, k3sup, arkade or inlets at work - whether for testing, pre-production or with customers then [Sponsor the OpenFaaS account](https://github.com/sponsors/openfaas)

If you're building your own thing, and know how important developer-experience and community are, then check out [OpenFaaS Ltd consulting services](https://openfaas.com/consulting) and reach out to the company. We have helped brands big and small to drive up engagement and expand their reach.

Did you know that I write tutorials about Kubernetes and Docker and build cloud native applications for a living? I now offer my time to companies to help them understand how to fit together a Cloud Native architecture. We have a lot to talk about, you can start today with a [one-off call](https://calendly.com/alexellis) - 

### Connect with me

<a href="https://store.openfaas.com/collections/hoodies/products/openfaas-embroidered-hoodie"><img src="/content/images/2020/12/EFE70gsWwAIs2xh_1_1024x1024@2x.jpg" width="40%"></a>

> Here I am with my wife Erin wearing our OpenFaaS hoodies

Every professional can benefit from a coach, someone to help you find the answers, to suggest ideas and to keep you accountable. [Book a 1:1 session with me via Zoom](https://calendly.com/alexellis/1-1-discounted-coaching).

* Hear from me personally, every week via my regular [GitHub sponsors](https://github.com/sponsors/alexellis) emails

* Buy OpenFaaS, k3sup, arkade and inlets SWAG and merchandise: [from mugs, to backpacks, to hoodies to t-shirts](https://store.openfaas.com/)