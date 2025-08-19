---
title: "Turn Any CLI into a Function with OpenFaaS"
slug: "cli-functions-with-openfaas"
date: "2018-02-06T09:01:56Z"
author: "Alex Ellis"
meta_title: "Turn Any CLI into a Function with OpenFaaS"
meta_description: "Logging into servers to run CLIs is manual and slow. Let's show how you work smart by turning your favourite CLIs into Functions with an API via OpenFaaS"
feature_image: "/content/images/2018/02/pexels-command-center.jpg"
tags:
  - "serverless"
  - "docker"
  - "kubernetes"
  - "openfaas"
  - "CLI"
  - "functions"
---

In this blog post I will show you how to make some of my favourite CLIs such as `nmap`, `imagemagick` and `awscli` into Serverless Functions with OpenFaaS. Why would you do this?

>Logging into servers to run CLIs is manual and slow. Let's show how you can work smarter by turning your favourite CLIs into Functions with their own API via OpenFaaS

Turning a CLI into a function means it gets support for binary inputs/outputs, logging, metrics and control over timeouts. You can also run it asynchronously on a queue with no additional work required.

> OpenFaaS makes Serverless Functions Simple through Docker & Kubernetes. You can build and run functions on your own terms on any platform.

## 1. Pre-amble 

Before going into how to turn CLIs into functions, let's look at the normal way to create a function with a cloud-based (Lambda, Azure Functions etc) or Open Source FaaS project such as OpenFaaS:

1. Template or scaffold a function
2. Build it with Docker or zip it
3. Deploy it or upload it
4. Get an endpoint or route
5. Invoke the function with a payload

I've provided a Quickstart guide for the OpenFaaS CLI that let's you create your own functions in common programming languages in just a few seconds such as: Node.js, CSharp C#, Python, Ruby, PHP, Go and Java.

Checkout the [CLI Quickstart guide](https://blog.alexellis.io/quickstart-openfaas-cli/) or read on to find out how to make CLIs into functions.

## 2. CLI Magic

This is where we go off the map into unchartered territory. We're actually going to make a CLI or binary the function. Every web request will fork the process, enter the request body via STDIN and return the process' output from STDOUT back to the caller. You can find out how this works at the end of the post.

Here's some things you could try turning into a function:

* Built-in bash utilities such as `sha512sum`, `cat` or even `cal`
* Bash scripts to perform multiple tasks
* CLIs for administrating the cloud like the *Azure CLI*
* Well-known CLI tools and utilities such as `nmap`, `nslookup` or `imagemagick`

Before you run through the examples below you should follow the [CLI Quickstart](https://blog.alexellis.io/quickstart-openfaas-cli/) which shows you how to install OpenFaaS and the CLI.

> Note: when you deploy your function you may need to wait for it to start before invoking it. If you're working on a remote cluster you may also need to run `faas-cli push` and enter your *own* Docker Hub account in the "image" field i.e. `alexellis2/nmap`

## 2.1 nmap

Let's start with something simple, but powerful - the popular network scanning tool: [nmap](https://nmap.org). `nmap` can be used for a myriad of purposes including finding open ports on your VPS or IP addresses on your home/work network.

* Scaffold a new function using the "Dockerfile" language:

```
$ faas new --lang dockerfile nmap
```

We have to add the `nmap` package into the Docker image so edit `nmap/Dockerfile`:

```
RUN apk add --no-cache nmap
```

Change the following line in nmap/Dockerfile and put the command you want to run as your function into the line `ENV fprocess=""`.

Now if you want to hard-code the `nmap` command do it like this:

```
ENV fprocess="nmap -sP 192.168.0.0/24"
```

> Note this command will scan a home network for hosts

If you want to pass in the parameters when you invoke the command then use `xargs` before the command.

```
ENV fprocess="xargs nmap"
```

Now let's extend the timeout for the function since `nmap` can take a little while to run. We'll pick 60 seconds:

```
ENV read_timeout="60"
ENV write_timeout="60"
```

Now Build/Deploy/Invoke:

```
$ faas build -f nmap.yml \
 && faas deploy -f nmap.yml

$ echo -n "-sP 192.168.0.0/24" | faas invoke nmap
```

`nmap` is available pre-packaged from the OpenFaaS [Function Store](https://blog.alexellis.io/announcing-function-store/). You can deploy it in 1-click via the built-in OpenFaaS UI portal.

## 2.2 imagemagick

This example uses [imagemagick](https://www.imagemagick.org/) which has been the go-to tool for resizing and manipulating images for decades.

In this example we'll resize an image to 50% of its original size. OpenFaaS will pass in the body of a request via `stdin` and the result will be written to `stdout`.

* Scaffold a new CLI / binary function:

```
$ faas new --lang dockerfile shrink
```

Now we have to do one more thing here - we need to install a package via `apk`.

* Edit `shrink/Dockerfile` and add the line:

```
RUN apk add --no-cache imagemagick
```

I copied this from the ImageMagick documentation and then replaced the input and output file with `stdin` and `stdout`.
  
```
ENV fprocess="convert - -resize 50% fd:1"
```

* Download or find a JPEG, copy it to the current directory and rename it to `image.jpg`.

* Now build/deploy/invoke:

```
$ faas build -f shrink.yml \
 && faas deploy -f shrink.yml

$ cat ./image.jpg | faas invoke shrink > image_smaller.jpg
```

Now open up `image_smaller.jpg` in Finder or a photo editor.

Find out more in my blog post: [Serverless sorcery with ImageMagick](https://blog.alexellis.io/serverless-imagemagick/).

Here's an example from my Twitter feed:

![](/content/images/2018/02/before_after_img.jpg)

## 2.3. awscli

Now let's package up the AWS CLI as a function, so that you can call it like an API.

> In order to build a Dockerfile I just followed the instructions in the [AWSCLI documentation](https://docs.aws.amazon.com/cli/latest/userguide/installing.html) for Linux.

* First scaffold the function:

```
$ faas new --lang dockerfile awscli
```

* Now edit the base image because we need to use Python as a base image instead of `alpine:3.6`.

* Edit awscli/Dockerfile:

Change the first line to: `FROM python:2.7.14-alpine3.7`

* Install `awscli` into the container via `pip`

Add this line to the Dockerfile:

```
RUN pip install awscli --upgrade --user
RUN apk add --no-cache less groff
```

* Change the `fprocess` and add a PATH variable for the new AWS CLI too:

```
ENV PATH=$PATH:/root/.local/bin/

ENV fprocess="xargs aws"
```

* Build/deploy/invoke

```
$ faas build -f awscli.yml \
&& faas deploy -f awscli.yml

$ echo -n "help" | faas invoke awscli
```

Here's what you get:

```
NAME
       aws -

DESCRIPTION
       The  AWS  Command  Line  Interface is a unified tool to manage your AWS
       services.

SYNOPSIS
          aws [options] <command> <subcommand> [parameters]

       Use aws command help for information on a  specific  command.  Use  aws
       help  topics  to view a list of available help topics. The synopsis for
       each command shows its parameters and their usage. Optional  parameters
       are shown in square brackets.
```

If you need to pass environmental variables then edit the YAML file for awscli.yml and add a new section:

``` 
provider:
  name: faas
  gateway: http://localhost:8080

functions:
  awscli:
    lang: Dockerfile
    handler: ./awscli
    image: alexellis2/awscli
    environment:
      AWS_ACCESS_KEY_ID: value_1
      AWS_SECRET_ACCESS_KEY: value_2
      AWS_SESSION_TOKEN: value_3
```

That's the end of the examples, I've picked these to give you a taste of what you could do. If you're wondering just how this works under the hood then checkout my latest video at [openfaas.com](https://www.openfaas.com/) or the [Function watchdog reference](https://github.com/openfaas/faas/tree/master/watchdog).

## 4. Profit

You now have three examples of common CLIs, binaries or executables that you can deploy as functions with OpenFaaS. This is not just limited to Linux, you can also build out functions from Windows binaries too - I'm just not sure which you'd choose - maybe some proprietary .NET tooling your company uses?

If you need to fine-tune timeouts or configure the output or logging of your function then checkout the documentation below:

* [OpenFaaS guides & documentation](https://github.com/openfaas/faas/tree/master/guide)

* [Function watchdog reference](https://github.com/openfaas/faas/tree/master/watchdog)

* [faas-and-furious/cli-blog-examples](https://github.com/faas-and-furious/cli-blog-examples.git) - the examples from this blog post

## 5. Help the community

You can **star** the project on [GitHub openfaas/faas](https://github.com/openfaas/faas), follow us on [Twitter @openfaas](https://twitter.com/openfaas) or [donate via Patreon](https://patreon.com/alexellis).

> Acknowledgements: I'd like to thank [Richard Gee](https://twitter.com/rgee0) and [Eric Stoekl](https://twitter.com/ericstoekl) from the OpenFaaS core contributors group for feedback and testing on this blog post.