---
title: "Introducing Functions as a Service (OpenFaaS)"
slug: "introducing-functions-as-a-service"
date: "2017-08-08T19:00:00Z"
author: "Alex Ellis"
meta_title: "Introducing Functions as a Service (FaaS)"
meta_description: "Functions as a Service is a framework for building Serverless functions with containers. Understand how FaaS is different, its highlights and what's next"
feature_image: "/content/images/2017/08/pexels-photo-295047_crop.jpg"
tags:
  - "faas"
  - "functions"
  - "serverless"
  - "k8s"
  - "openfaas"
  - "docker swarm"
  - "community"
  - "open source"
---

[Functions as a Service or (OpenFaaS)](https://blog.alexellis.io/functions-as-a-service/) is a framework for building Serverless functions on top of containers. I began the project as a proof of concept in October last year when I wanted to understand if I could run [Alexa skills](https://blog.alexellis.io/serverless-alexa-skill-mobymingle/) or Lambda functions on Docker Swarm. After some [initial success](https://github.com/alexellis/funker-dispatch) I released the first version of the code in Golang [on GitHub in the December](https://github.com/alexellis/faas/commits/master?after=235da9261746748e9ae32320dbdda19d053d7407+349).

> This post gives a straight-forward introduction to Serverless  computing, then covers my top 3 features introduced to FaaS over the last 500 commits and finishes on what's coming next and how to get involved.

![](/content/images/2017/08/prom_stars.png)

From that first commit FaaS went on to gain momentum and over 4000 stars on GitHub along with a small [community of developers and hackers](https://github.com/alexellis/faas/blob/master/community.md) who have been giving talks at meet-ups, writing their own cool functions and contributing code. The highlight for me was winning a place in [Moby's Cool Hacks keynote session](https://blog.docker.com/2017/04/dockercon-2017-mobys-cool-hack-sessions/) at Dockercon in Austin in April. The remit for entries was: *to push the boundaries of what Docker was designed to do.*

![](/content/images/2017/08/C9zvaO-VYAAL7kI_embed.jpg)

> [Star Functions as a Service (FaaS) on Github](https://github.com/alexellis/faas)

## What is Serverless?

**Architecture is evolving**

"Serverless" is a misnomer - we're talking about a new architectural pattern for event-driven systems. For this reason serverless functions are often used as connective glue between other services or in an event-driven architecture. In the days of old we called this a service bus.

![](/content/images/2017/08/evolution.png)
*Serverless is an evolution*

**Serverless functions**

A serverless function is a small, discrete and reusable chunk of code that:

* is short-lived
* is not a daemon (long-running)
* does not publish TCP services
* is not stateful
* makes use of your existing services or third-party resources
* executes in a few seconds (based upon AWS Lambda's default)

> We also need to make a distinction between *Serverless products* from IaaS providers and Open Source Software projects.

On one hand we have *Serverless products* from IaaS providers such as Lambda, Google Cloud Functions and Azure functions and on the other frameworks such as OpenFaaS which let an orchestration platform such as Docker Swarm or Kubernetes do the heavy lifting.

![](/content/images/2017/08/cloud_native.png)
*Cloud Native - bring your favourite cluster.*

A Serverless product from an IaaS vendor is completely managed so it offers a high degree of convenience and per-second/minute billing. On the flip-side you are also very much tied into their release and support cycle. Open-source FaaS exists to promote diversity and offer choice.

**What's the difference with OpenFaaS?**

OpenFaaS builds upon industry-standard Cloud Native technology:

![](https://camo.githubusercontent.com/08bc7c0c4f882ef5eadaed797388b27b1a3ca056/68747470733a2f2f7062732e7477696d672e636f6d2f6d656469612f4446726b46344e586f41414a774e322e6a7067)

*The OpenFaaS stack*

The difference with the OpenFaaS project is that any process can become a serverless function through the [watchdog](https://github.com/alexellis/faas/tree/master/watchdog) component and a Docker container. That means three things:

* You can run code in whatever language you want
* For however long you need
* Wherever you want to

> Going Serverless shouldn't have to mean re-writing your code in another programming language. Just carry on using whatever your business and team need.

**Example:**

For example `cat` or `sha512sum` can be a function without any changes since functions communicate through stdin/stdout. Windows functions are also supported through Docker CE.

> This is the primary difference between FaaS and the other open-source serverless frameworks which depend on bespoke runtimes for each supported language.

Let's look at three of the big features that have come along since Dockercon including - [CLI](https://github.com/alexellis/faas-cli) and function templating, Kubernetes support and asynchronous processing.

#### 1. The new CLI

**Easy deployments**

I added a [CLI](https://github.com/alexellis/faas-cli) to the FaaS project to making deploying functions easier and scriptable. Prior to this you could use the API Gateway's UI or `curl`. The CLI allows functions to be defined in a YAML file and then to be deployed to the API Gateway.

Finnian Anderson wrote a great intro to the FaaS CLI on [Practical Dev / dev.to](https://dev.to/developius/functions-as-a-service---deploying-functions-to-docker-swarm-via-a-cli)

**Utility script and brew**

There is an installation script available and John McCabe helped the project get a recipe on `brew`.

```
$ brew install faas-cli
```

or

```
$ curl -sL https://cli.get-faas.com/ | sudo sh
```

**Templating**

Templating in the CLI is where you only need to write a handler in your chosen programming language and the CLI will use a template to bundle it into a Docker container with FaaS magic handled for you.

> There are two templates provided for Python and Node.js, but you can create your own easily.

There are three actions the CLI supports:

* `-action build` - creates Docker images locally from your templates
* `-action push` - pushes your templates to your desired registry or the Hub. 
* `-action deploy` - deploys your FaaS functions

> If you have a single-node cluster you don't need to push your images to deploy them.


Here's an example of the CLI configuration file in YAML:

```
provider:
  name: faas
  gateway: http://localhost:8080

functions:
  url_ping:
    lang: python
    handler: ./sample/url_ping
    image: alexellis2/faas-urlping
```
*sample.yml*

Here is the bare minimum handler for a Python function:

```
def handle(req):
    print(req)
```

This is an example that `pings` a URL over HTTP for its status code:

```
import requests

def print_url(url):
    try:
        r =  requests.get(url,timeout = 1)
        print(url +" => " + str(r.status_code))
    except:
        print("Timed out trying to reach URL.")

def handle(req):
    print_url(req)
```

*./sample/url_ping/handler.py*

If you need additional `pip` modules then also place a `requirements.txt` file alongside your handler.py file.

```
$ faas-cli -action build -f ./sample.yml
```

You'll then find a Docker image called alexellis2/faas-urlping which you can push to the Docker hub with `-action push` and deploy with `-action deploy`.

> You can find the [CLI in its own repo](https://github.com/alexellis/faas-cli).

#### 2. Kubernetes support

As a [Docker Captain](https://blog.docker.com/2016/09/5-minutes-docker-captains-2/) I focus primarily on learning and writing about [Docker Swarm](https://docs.docker.com/engine/swarm/), but I have always been curious about Kubernetes. I started learning how to setup [Kubernetes](https://kubernetes.io) up on Linux and Mac and wrote [three tutorials](https://blog.alexellis.io/tag/k8s/) on it which were well-received in the community.

**Architecting Kubernetes support**

Once I had a good understanding of how to map Docker Swarm concepts over to Kubernetes I wrote a technical prototype and managed to port all the code over in a few days. I opted to create a new microservice daemon to speak to Kubernetes rather than introducing additional dependencies to the main FaaS codebase.

FaaS proxies the calls to the new daemon via a standard RESTful interface for operations such as: Deploy/List/Delete/Invoke and Scale.

Using this approach meant that the UI, the CLI and auto-scaling all worked out the box without changes. The resulting microservice is being maintained in a new GitHub repository called [FaaS-netes](https://github.com/alexellis/faas-netes) and is available on the Docker Hub. You can set it up on your cluster in around 60 seconds.

**Watch a demo of Kubernetes support**

In this demo I deploy FaaS to an empty cluster, then run through how to use the UI, [Prometheus](https://prometheus.io) and trigger auto-scaling too.

<iframe width="560" height="315" src="https://www.youtube.com/embed/0DbrLsUvaso" frameborder="0" allowfullscreen></iframe>

**But wait.. aren't there other frameworks that work on Kubernetes?**

There are probably two categories of Serverless frameworks for Kubernetes - those which rely on a highly specific runtime for each supported programming language and ones like FaaS which let any container become a function.

FaaS has bindings to the native API of Docker Swarm and Kubernetes meaning it uses first-class objects that you are already used to managing such as *Deployments* and *Services*. This means there is less magic and code to decipher when you get into the *nitty gritty* of writing your new applications.

> A consideration when picking a framework is whether you want to contribute features or fixes. OpenWhisk for instance is written in Scala most of the others are written in Golang.

* [Funktion](https://github.com/funktionio/funktion)
* [Iron Functions](https://github.com/iron-io/functions)
* [OpenWhisk](https://github.com/apache/incubator-openwhisk)
* [Kubeless](https://github.com/kubeless/kubeless)
* [Fission](https://github.com/fission/fission)
* [FaaS-netes](https://github.com/alexellis/faas-netes)

### 3. Asynchronous processing

One of the traits of a serverless function is that it's small and fast, typically completing synchronously within a few seconds. There are several reasons why you may want to process your function asynchronously:

* it's an event and the caller doesn't need a result
* it takes a long time to execute or initialize - i.e. TensorFlow / Machine Learning  
* you're ingesting a large amount of requests as a batch job
* you want to apply rate limiting

I started a prototype for asynchronous processing via a distributed queue. The implementation uses the NATS Streaming project but could be extended to use Kafka or any other abstraction that looks like a queue.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">New experimental feature! async functions for <a href="https://twitter.com/hashtag/FaaS?src=hash">#FaaS</a> with <a href="https://twitter.com/Docker">@Docker</a> Swarm and <a href="https://twitter.com/nats_io">@nats_io</a> .. want to try it out? ASCII via Figlet + <a href="https://twitter.com/jmkhael">@jmkhael</a> 🐳 <a href="https://t.co/IXIlEfBLzR">pic.twitter.com/IXIlEfBLzR</a></p>&mdash; Alex Ellis (@alexellisuk) <a href="https://twitter.com/alexellisuk/status/885248540607483904">July 12, 2017</a></blockquote> <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

Asynchronous invocation is now merged with NATS Streaming as a back-end. You can checkout the guide here: 

* [Asynchronous docs](https://docs.openfaas.com/reference/async/)

### What's next?

![](/content/images/2017/08/clip-1.png)
*OpenFaaS logo*

Thanks to our friends at [Equinix Metal](https://metal.equinix.com/) a new logo and website will be going live soon.

> Equinix Metal are automating the Internet and offer bare-metal infrastructure at an hourly rate.

**Speaking**

I'll be speaking on [Serverless and FaaS at LinuxCon North America in September](https://www.linuxfoundation.org/announcements/session-lineup-announced-for-linux-foundation-open-source-summit-north-america). Come and meet me there and if you can't make it, follow me on [Twitter @alexellisuk](https://twitter.com/alexellisuk/)

**Get started!**

Please show support for FaaS and **star** the GitHub repository and share this blog post on Twitter.

You can get started with the TestDrive over on Github:

* [Github: FaaS - a serverless framework for Docker & Kubernetes](https://github.com/alexellis/faas/)

I'm most excited about the growing [Kubernetes support](https://github.com/alexellis/faas-netes) and [asynchronous processing](https://github.com/alexellis/faas/issues/103). It would also be great to have someone take a look at running FaaS on top of [Azure Container Instances](https://github.com/alexellis/faas/issues/117).

**All contributions are welcomed**

Whether you want to help with issues, coding features, releasing the project, scripting, tests, benchmarking, documentation, updating samples or even blogging about it. 

> There is something for everyone and it all helps keep the project moving forward.

So if you have feedback, ideas or suggestions then please post them to me [@alexellisuk](https://twitter.com/alexellisuk) or via one of the project GitHub repositories.

*Not sure where to start?*

Get inspired by the [community talks and sample functions](https://github.com/alexellis/faas/blob/master/community.md) including machine learning with TensorFlow, ASCII art and easy integrations.

*Share this article on Twitter*

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Introducing Functions as a Service - what is Serverless, how is FaaS different and what&#39;s coming next? <a href="https://t.co/fqq57ZWsSt">https://t.co/fqq57ZWsSt</a> <a href="https://twitter.com/Docker">@Docker</a> <a href="https://twitter.com/moby">@moby</a></p>&mdash; Alex Ellis (@alexellisuk) <a href="https://twitter.com/alexellisuk/status/895000906546151428">August 8, 2017</a></blockquote> <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>