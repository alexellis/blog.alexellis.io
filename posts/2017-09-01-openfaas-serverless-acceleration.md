---
title: "OpenFaaS accelerates serverless Java with AfterBurn"
slug: "openfaas-serverless-acceleration"
date: "2017-09-01T19:12:00Z"
author: "Alex Ellis"
meta_title: "OpenFaaS accelerates JVM with AfterBurn functions"
meta_description: "Find out how OpenFaaS is accelerating serverless functions running on the JVM with the AfterBurn concept with benchmarks and load testing on bare-metal"
tags:
  - "openfaas"
  - "serverless"
  - "engineering"
  - "docker"
  - "faas"
---

## Update:

AfterBurn is now deprecated and Java is supported in the official OpenFaaS templates. [Java comes to the official OpenFaaS templates](https://blog.alexellis.io/java-comes-to-openfaas/)

Feel free to read the original blog post below.

### Original blog post

[OpenFaaS](https://github.com/openfaas/faas) is a framework for building serverless functions with the power of Docker or Kubernetes. It's cloud native and has Prometheus metrics built-in.

![](https://camo.githubusercontent.com/24915ac87ecf8a31285f273846e7a5ffe82eeceb/68747470733a2f2f7062732e7477696d672e636f6d2f6d656469612f4339636145364358554141585f36342e6a70673a6c61726765)

*Pictured: Grafana dashboard hooked-up to OpenFaaS during my Dockercon demonstration*

Since the initial versions of [OpenFaaS](https://github.com/openfaas/faas) we've been able to make anything a serverless function by use of our Function Watchdog. Even pre-cloud utilities like `ImageMagick` and `ffmpeg` that have served the Linux community for over 20 years. We do this by forking one process per request in a similar way to how CGI works. This blog post shows how AfterBurn functions can accelerate the throughput of functions with slower initialisation times or burn-in like Java on the JVM.

> New to OpenFaaS? Watch the presentation to [the CNCF Serverless Workgroup here](https://blog.alexellis.io/openfaas-cncf-workgroup/).

### Function Watchdog

First a diagram of how the OpenFaaS [Classic Watchdog](https://github.com/openfaas/classic-watchdog/) works:

![Conceptual diagram of watchdog](https://camo.githubusercontent.com/61c169ab5cd01346bc3dc7a11edc1d218f0be3b4/68747470733a2f2f7062732e7477696d672e636f6d2f6d656469612f4447536344626c554941416f34482d2e6a70673a6c61726765)

*Function Watchdog flow diagram*

The [Function Watchdog](https://github.com/alexellis/faas/tree/master/watchdog) which is written in Golang is embedded in your container and becomes the entry point or first process. The watchdog then listens for incoming requests and marshals the header and body into the function via STDIN and STDOUT.

This mechanism is what allows any process to become a function. Even `/bin/cat` or `cal` can become a function with OpenFaaS - we're working with pipes so binary data is fully supported.

Here's ImageMagick in action resizing an image to 50%:
<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Need to do image processing? Checkout this Serverless ImageMagick function from the <a href="https://twitter.com/open_faas">@open_faas</a> CLI - <a href="https://t.co/zv5DCtM98O">https://t.co/zv5DCtM98O</a> 👌 <a href="https://t.co/szZXRzAg3z">pic.twitter.com/szZXRzAg3z</a></p>&mdash; Alex Ellis (@alexellisuk) <a href="https://twitter.com/alexellisuk/status/901737554575314944">August 27, 2017</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

*Image Magick on OpenFaaS*

### How quick is this?

Well if you are running in an language with a low start-up time like Python, Golang or .Net Core then we're talking 10-30ms.

> Let's be clear - OpenFaaS runs any binary or programming language on a Windows or Linux back-end.

Let's look at some benchmarks I ran on [Packet's bare-metal servers](https://www.packet.net) with Ubuntu 16.04, Docker Swarm 17.05 and OpenFaaS 0.6.2. 

I used the FaaS sample functions to benchmark the total execution time to fork and execute a new process in various programming languages. I also included a [third-party result from a recent blog](http://www.devoperandi.com/kubernetes-faas-options-part-1/).

![](/content/images/2017/09/execute_2.png)

We see that Node.js (164ms) and Java (134ms) have the slowest start-times where as Golang (14ms) and Python (31) are much quicker. The third-party result comes in with a hefty 250ms.

I've included a result for the Java AfterBurn function - here it comes in the quickest at 12ms. It's around a 10x improvement. But what does that mean?

Well if you are running intermittent or slow functions then you may not benefit from the optimization, but if you are expecting very high throughput then it looks a bit like this:

![](/content/images/2017/09/bench.png)

No - that isn't wrong, we're seeing nearly 3000 requests per second vs around 91 from forking a Java JVM per request. 

> The results from apache-bench are single-threaded and I also turned auto-scaling off. This throughput would be even higher across a multi-node low-latency cluster.

When you begin to load a machine learning model into memory we start to take a small hit for each request. We could optimize it or just run it on the built-in queue provided by NATS Streaminig.

### AfterBurn

The Function Watchdog is going to start offering a second mode called: AfterBurn. AfterBurn is where we fork your process once then keep it around for subsequent requests meaning that you can make your functions run faster. This technique is not new and Wikipedia places it around the [1990s](https://en.wikipedia.org/wiki/FastCGI).

[FastCGI](https://en.wikipedia.org/wiki/FastCGI) did not take off and was replaced by HTTP, their site has even been taken down meaning the Internet Archives is the only way to find out about it. For historical reasons [Golang appears to have a library for it](https://golang.org/pkg/net/http/fcgi/).

So AfterBurn takes the best of FastCGI (reusing a forked process) and the best of HTTP (an easily-parsed well-known text format) and combines them to produce substantial speed boosts for slow functions or JVM-based languages like Java.

![]()

*Comparison chart*

### How do I try this?

**Get started with OpenFaaS**

You can get started with OpenFaaS with our [introductory blog post](https://blog.alexellis.io/introducing-functions-as-a-service/), [writing your first Python function](https://blog.alexellis.io/first-faas-python-function/) or heading over to [the repo to **Star** the project](https://github.com/openfaas/faas) and show your support.

If you'd like a brief *conceptual overview and demo* then you can watch the recording of the presentation to [the CNCF Serverless Workgroup here](https://blog.alexellis.io/openfaas-cncf-workgroup/).

**Optimizing with AfterBurn**

As a Computer Science student at the University of London I was taught not to optimize unless it was really necessary.

Michael A. Jackson in his book "Principles of Program Design", Academic Press, 1975 says:

> We follow two rules in the matter of optimization:

> Rule 1: Don't do it.

> Rule 2 (for experts only). Don't do it yet - that is, not until you have a perfectly clear and unoptimized solution.

Therefore once you've run benchmarks on your functions, have tried running in asynchronous mode and with [faster hardware or bare metal](https://www.packet.net) you decide to use AfterBurn.

[Nathan Goulding](https://twitter.com/NathanGoulding) who heads up [Packet's](https://www.packet.net) engineering team suggested applying CPU tuning via scaling_governor and [intel_pstate](https://github.com/pyamsoft/pstate-frequency) ramp things up even higher. With powerful hardware available at low rates in spot markets - optimizing software needn't always be the first port of call.

*AfterBurn* involves writing a small HTTP parser for your target programming language. We've started with Java, Python (for machine learning), Node.js and CSharp. If you'd like to start using AfterBurn get in touch with us on Slack or GitHub and we'll help you get up and running.

* Is HTTP the only suitable protocol?

Along with the HTTP format [JSON streaming](https://en.wikipedia.org/wiki/JSON_Streaming) is also popular as well as GRPC. For most languages a HTTP parser is already built into a standard library or you can write one easily.

**Join us on Slack and GitHub**

Start `Watching` the [OpenFaaS project on GitHub](https://github.com/alexellis/faas) for all the latest updates, releases, issues and pull requests.

The best way to get involved or ask questions is to join us on Slack. Just email: <a href="alex@openfaas.com">alex@openfaas.com</a>.