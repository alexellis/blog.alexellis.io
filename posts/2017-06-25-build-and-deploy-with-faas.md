---
title: "Ship Serverless FaaS functions with ease"
slug: "build-and-deploy-with-faas"
date: "2017-06-25T12:28:17Z"
author: "Alex Ellis"
meta_title: "Ship Serverless FaaS functions with ease"
meta_description: "In this post we explore how to build and deploy serverless functions anywhere with the new CLI for the open-source FaaS project. Contributions are welcome."
feature_image: "/content/images/2017/06/head-faas.jpg"
tags:
  - "faas"
  - "docker"
---

In this post we'll look at how you can build and deploy functions quickly via the new FaaS CLI which is now easier than ever to install.

### Background

When I started the [Functions as a Service (FaaS) project in January 2017](http://blog.alexellis.io/functions-as-a-service/) I included a set of sample functions inside a Docker Swarm stack which meant FaaS and the sample functions could be deployed in one shot.

As the project gained momentum and interest from the community it became clear that we needed a way of templating and deploying functions that didn't involve direct access to a Docker stack. 

> I also wanted writing FaaS functions to be as easy as it was for something like AWS Lambda - where for select languages a simple handler is all that you have to write.

### What does it do?

The CLI has two goals:

* to build FaaS functions (Docker images) based upon a template
* to deploy functions (Docker images) built with or without a template to a remote FaaS server

Let's start with *building functions based upon a template*:

A template for Python can be as simple as two lines:

```
def handle(req):
    print req
```

A more useful handler would perform some action and print back the result. If you need any `pip` modules you can place them in a file called `requirements.txt`.

For Node.js your function is almost as short:

```
"use strict"

let handler = (req, callback) => {
  console.log(req);
  callback();
};

module.exports = handler;
```

From there it's up to you to define what you want your application to do and how it should work. If you need any `npm` modules you can place them in your `package.json` file and they'll be installed when you build your function.

> You can find links to more extensive examples below.

If you have multiple functions then you can define them in a YAML file along with any configuration that is needed at runtime.

```
provider:
  name: faas
  gateway: http://localhost:8080

functions:
  url_ping:
    lang: python
    handler: ./sample/url_ping
    image: alexellis2/faas-urlping

  node_info:
    lang: node
    handler: ./sample/node_info
    image: alexellis2/faas-node_info
```

*functions.yaml*

The command to build anything in a stack is:

```
$ faas-cli -action build -f ./functions.yaml
```

**Where is the magic happening?**

The templating you see is made possible through the `template/node` or `template/python` folders in the [Github repository](https://github.com/alexellis/faas-cli/tree/master/template).

![](/content/images/2017/06/faas-template.jpg)

> You can add new templates as necessary or bypass them completely and just build a Docker image with whatever binary or runtime you need.

Now let's see how you can *deploy functions built with or without a template* to a local or remote FaaS server.

> [FaaS can be launched in 60 seconds](http://docs.get-faas.com) by following the TestDrive tutorial from the docs page.

Using the same YAML file you can deploy your functions to a running instance of FaaS. Following the example above we'd type in:

```
$ faas-cli -action deploy -f ./functions.yaml
```

If you are deploying to a multi-node Swarm cluster you may need to push your images to the Docker Hub or a private registry before moving forward:

```
$ faas-cli -action push -f ./functions.yaml
```

If you want to see examples of FaaS YAML files here are two from my recent demos:

* [Twitter and ElasticSearch demo](https://github.com/alexellis/journey-expert/blob/master/tweetstash/stack.yml)

* [CLI sample stack](https://github.com/alexellis/faas-cli/blob/master/samples.yml)

### Get the CLI

There are three ways to get the CLI - we'll start off with the simplest.

* Use `brew`

If you have `brew` installed on your Mac already then you can type in `brew install faas-cli`. This support was added by [John McCabe](https://twitter.com/mccabejohn) in the community.

* Use the new utility script `curl | sh`

Whether you're on a Raspberry Pi, Linux host or Mac you can use the utility script to install the CLI. The latest binary version is downloaded from the Github release page.

```
$ curl -sSL cli.get-faas.com | sudo sh
```

As usual you'll want to checkout the contents of the script before running it. At the very least the content is served over HTTPS.

* For the code and hack on it

If you have Golang installed locally and fancy contributing to the CLI codebase you can clone it from Github and build it with a Golang build-chain. Full instructions are given in the [README](https://github.com/alexellis/faas-cli) file.

### FaaS and Furious

FaaS is designed to run on any system that supports Docker - from your laptop, to your 35 USD Raspberry Pi to a [24-core bare-metal cloud host on Equinix Metal aka Packet](https://metal.equinix.com/product/). 

> [FaaS can be launched in 60 seconds](http://docs.get-faas.com) by following the TestDrive tutorial from the docs page.

Watch the closing keynote from Dockercon Austin where I demo the ease of use, speed of deployment, metrics and auto-scaling that work together to form FaaS:

<iframe width="560" height="315" src="https://www.youtube.com/embed/-h2VTE9WnZs?start=954" frameborder="0" allowfullscreen></iframe>

Read up about why the FaaS project exists and what problems it solves here:

* [Introduction to Functions as a Service](http://blog.alexellis.io/functions-as-a-service/)

#### Help wanted! Contribute to FaaS

If you'd like to contribute code to FaaS or to port it to a new platform (such as Kubernetes or ARMv8) then please get in touch. Writing about and testing FaaS and the new CLI are just as important as contributing new features.

> 
Update: this project has a new name - OpenFaaS. Read my [introduction to OpenFaaS](https://blog.alexellis.io/introducing-functions-as-a-service/)

**Get in touch**

You can **Star** or Fork the Github repository here - [alexellis/faas](https://github.com/alexellis/faas) and I'm [@alexellisuk on Twitter](https://twitter.com/alexellisuk),

The list of [community talks and blogs](https://github.com/alexellis/faas/blob/master/community.md) is growing - feel free to ask for an invite to the FaaS Slack community - where we hang out and talk about Serverless, IoT and Raspberry Pi.