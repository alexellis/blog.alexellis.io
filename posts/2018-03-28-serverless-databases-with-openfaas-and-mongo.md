---
title: "Serverless: Databases with OpenFaaS and Mongo"
slug: "serverless-databases-with-openfaas-and-mongo"
date: "2018-03-28T07:56:33Z"
author: "Alex Ellis"
meta_title: "Serverless: Databases with OpenFaaS and Mongo"
meta_description: "Let's explore serverless and databases by showing how to build OpenFaaS functions which use a connection pool with MongoDB to optimize latency."
---

In this post I want to show you how you can make use of common databases like [MongoDB](https://www.mongodb.com) with your [OpenFaaS](https://www.openfaas.com) Serverless Functions.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">We&#39;re (gradually) building out a dedicated docs site for <a href="https://twitter.com/openfaas?ref_src=twsrc%5Etfw">@OpenFaas</a> with mkdocs and <a href="https://twitter.com/Netlify?ref_src=twsrc%5Etfw">@Netlify</a> - is there anything you want to know? <a href="https://t.co/LsFl9EbjMm">https://t.co/LsFl9EbjMm</a> <a href="https://twitter.com/hashtag/serverless?src=hash&amp;ref_src=twsrc%5Etfw">#serverless</a> <a href="https://twitter.com/hashtag/teamserverless?src=hash&amp;ref_src=twsrc%5Etfw">#teamserverless</a></p>&mdash; Alex Ellis (@alexellisuk) <a href="https://twitter.com/alexellisuk/status/978315074933805056?ref_src=twsrc%5Etfw">March 26, 2018</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> 

I asked what topics the wider community wanted to see in our new [OpenFaaS documentation site](https://docs.openfaas.com/). One of the responses was a request from a technologist named [Scott Mebberson](https://twitter.com/smebberson/status/978525148377628672). Scott wanted to know how to make efficient use of a database connection within a serverless function.

## Serverless applied

Serverless is viewed as an evolution in architecture, but functions do not replace our existing systems such as relational databases. Functions serve us best when they combine the strengths of long-running/stateful processes with the velocity and simplicity of serverless.

![](https://blog.alexellis.io/content/images/2017/08/evolution.png)

*Pictured: Serverless evolution*

Here's an example where you could apply functions. You may have a monolithic application which is stable and running in production, but now you have to integrate with a new data-feed from a partner. Updating the monolith would take a lot of time, risk stability and require extensive regression testing.

This would be a good use-case for leveraging functions. Your functions can be developed rapidly and independently of your existing system thereby minimizing the level of risk.

## What are functions like?

![functions](/content/images/2018/03/functions.png)

Here's a refresher on the qualities of Serverless Functions:

* short-lived (seconds)
* stateless
* do not expose TCP ports
* scale for demand (ephemeral)

> You can read more on my initial blog post: [Introducing to Functions as a Service (OpenFaaS)](https://blog.alexellis.io/introducing-functions-as-a-service/).

## The problem

Connecting to a database such as [MongoDB](https://www.mongodb.com) is relatively quick and during testing I saw connections opened within milliseconds, but some relational databases such as [Microsoft SQL Server](https://www.microsoft.com/en-gb/sql-server/sql-server-2017) can take up to 5 seconds. This problem has been solved by the industry through connection pools. Connection pools maintain a set of established database connections in memory for future queries.

When it comes to functions we have a process which is short-lived and stateless, so it's hard to reconcile those properties with a connection pool used in a monolithic application which expects to be kept alive for days if not weeks at a time.

Recent engineering work within the [OpenFaaS incubator organisation](https://github.com/openfaas-incubator/) has allowed us to re-use the same process between requests in a similar way to AWS Lambda. This means we can make that we can initialize a connection pool in one request and re-use it in subsequent requests until the function is scaled down or removed. So using by OpenFaaS functions you can avoid unnecessary latency with each subsequent request.

### What are the pros/cons of maintaining a connection pool?

A property of serverless functions is that they may scale both up and down according to demand. This means that when your function scales up - each replica will initialize its own connection pool and keep that until it is no longer required. You will have to wait until the connection pool is ready to accept requests on the new replica before routing traffic to it.

Functions are also ephemeral so if we scale down from 20 replicas to 1 replica, then we don't know which of the 20 will remain. Each function replica needs to be able to manage its own health including handling a graceful shutdown when scaling down.

It should also be able to detect if the connection becomes unhealthy and signal this through the built-in health-checking mechanisms so that it can be restarted or rescheduled. Kubernetes provides [liveness and readiness probes](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-probes/) which can be used to deliver a reliable system.

### Are there alternative solutions?

For some applications the initial loading time of establishing a connection to Microsoft SQL Server may be too long, so let's consider some other approaches for reducing latency.

1. Process the work asynchronously

OpenFaaS has a system built-in for deferred execution. We have used [NATS Streaming](https://nats.io/documentation/streaming/nats-streaming-intro/) to allow us to ingest requests and execute them later. The implementation means that any function built for OpenFaaS can be executed synchronously or asynchronously without any adaptations. When a function is called asynchronously the caller gets an instant response and the work is run later on.

2. Build a microservice

Another alternative is to absorb the initial connection cost within a long-running microservice. This involves creating a simple wrapper or proxy for the connection. One of our OpenFaaS contributors built a Golang microservice which does this for T-SQL called [sqlrest](https://github.com/BurtonR/sqlrest). When taking this approach it is important to make sure a solid authentication policy is in place.

3. Use a managed DB service

This is similar to option 2 but uses a hands-off approach. You consume a database as a software offering from a third-party. Serverless functions can make use of any existing database-as-a-service offerings such as [Firebase Realtime Database](https://firebase.google.com/docs/database/) or [DynamoDB from AWS](https://aws.amazon.com/dynamodb/).

These alternative solutions work without making breaking changes to the interfaces provided by OpenFaaS - using the platform as a black box. How would you approach the problem? Do we need new patterns for providing services such as database connections and machine-learning models to functions?

## Reference architecture

I have put together an example of a reference architecture which can be deployed onto Kubernetes or Docker Swarm. The example shows how to re-use a connection pool between requests with a [Node.js](https://nodejs.org/en/) function and OpenFaaS.

> Note: You can complete the setup in around 5 minutes.

![](https://github.com/alexellis/mongodb-function/raw/master/diagram/conceptual-mongo.png)

*Pictured: three sequences or states of a function replica*

1. In the first sequence we've had no calls made to the function, so the connection pool is not yet initialized. prepareDB() was never called.

2. In the second sequence prepareDB() has been called and since there was no instance of a connection in memory, we create one and you see the dotted line shows the connection being established. This will then open a connection to [MongoDB](https://www.mongodb.com) in the network.

3. In the third sequence we see that subsequent calls detect a connection exists and go straight to the connection pool. We have one active connection and two shown with dotted lines which are about to be closed due to inactivity.

## Hands-on video

I've recorded a short hands-on video that will guide you through deploying the function and testing it.

<iframe width="560" height="315" src="https://www.youtube.com/embed/lJOck35DWhw?rel=0&amp;showinfo=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

## Try it out

You can try out the example for yourself with OpenFaaS deployed on Kubernetes or Docker Swarm.

* [alexellis/mongodb-function](https://github.com/alexellis/mongodb-function)

<img src="https://github.com/openfaas/media/raw/master/OpenFaaS_Magnet_3_1_png.png" width="600px" />

Find out more about the project on [our new documentation site](https://docs.openfaas.com) along with upcoming events and how to [join the community](https://docs.openfaas.com/community/).