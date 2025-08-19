---
title: "Serverless sorcery with ImageMagick"
slug: "serverless-imagemagick"
date: "2017-09-20T14:55:29Z"
author: "Alex Ellis"
meta_title: "Serverless sorcery with ImageMagick"
meta_description: "What sets OpenFaaS apart in the Serverless world? Well - the ability to run any container or process at scale as a function. Learn how with ImageMagick."
feature_image: "/content/images/2017/09/pexels-photo-185933-top.jpg"
tags:
  - "serverless"
  - "openfaas"
  - "imagemagick"
---

[ImageMagick](https://en.wikipedia.org/wiki/ImageMagick) is an age-old tool (27 years old today!) for Linux which is used for image manipulation and generation. There's not much you cannot do with it, but one of the most common use-cases I've seen is reducing image size to generate thumbnails. In this blog post I want to give you a fresh take on [ImageMagick](https://en.wikipedia.org/wiki/ImageMagick) and deploy it as a scaleable serverless function with [OpenFaaS](https://www.openfaas.com) and Kubernetes, or Docker Swarm.

![](https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/ImageMagick_logo.svg/200px-ImageMagick_logo.svg.png)

> OpenFaaS is Serverless, but on your terms. Build serverless functions using Docker containers and deploy onto Kubernetes and Docker Swarm. [Star or fork the repo here](https://github.com/alexellis/faas).

### Pre-reqs

Follow the guide for setting up OpenFaaS Docker Swarm or Kubernetes below. If you already have a cluster ready or Docker on your laptop then this takes less than 60 seconds to deploy.

* [Docker Swarm](https://github.com/alexellis/faas/blob/master/guide/deployment_swarm.md) - easiest on a laptop
* [Kubernetes](https://github.com/alexellis/faas/blob/master/guide/deployment_k8s.md)

Once you've deployed OpenFaaS, we now need to install the FaaS CLI tool:

If you're on Linux or Windows type in:

```
$ curl -sL cli.openfaas.com | sudo -E sh
```

On Mac you can type in `brew install faas-cli`

Check it worked with `faas-cli version`

## Deploy the samples

Clone the CLI from GitHub which contains several samples, including ImageMagick:

```
$ git clone https://github.com/alexellis/faas-cli
```

Now let's deploy the shrink-image function:

```
$ faas-cli deploy -f samples.yml --filter=shrink-image
Deploying: shrink-image.
...
```

`shrink-image` will reduce any image to 50% of its size.

### Test it out

The ImageMagick sample is deployed as `shrink-image`. Let's grab a photo from [Pexels](https://www.pexels.com/photo/action-animal-ocean-outdoors-464376/) who provide royalty-free images and then try it out:

```
$ curl -sSL "https://images.pexels.com/photos/464376/pexels-photo-464376.jpeg?w=1260&h=750&auto=compress&cs=tinysrgb" > whale.jpg
```

If you checkout the image, you'll see it's around 1148 × 750 and 131KB in size.

Now let's shrink it to 50%:

```
$ cat whale.jpg | faas-cli invoke shrink-image > whale-small.jpg
```

![](/content/images/2017/09/shrink-image-diagram.png)

> If your server is remote, you can also pass the `--gateway` flag.

So now we can see the resulting image at 50% of the size - 817 × 500 and 115KB on disk.

### How does it work?

Well for every request that comes into the function we fork ImageMagick, feed in the bytes of the larger image via STDIN and then read the response over STDOUT and send that back to the caller. The fwatchdog (fork watchdog) binary is placed into a container as the entrypoint and is responsible for enforcing timeouts and reading/writing values to and from your function via pipes.

*sample/imagemagick/Dockerfile*

```
FROM alpine:3.6

ADD https://github.com/alexellis/faas/releases/download/0.5.8-alpha/fwatchdog > /usr/bin/fwatchdog
RUN chmod +x /usr/bin/fwatchdog

# Alternatively use ADD https:// (which will not be cached by Docker builder)
RUN apk --no-cache add imagemagick

ENV fprocess="convert - -resize 50% fd:1"
```

> Read more about the [function watchdog](https://github.com/alexellis/faas/tree/master/watchdog) here.

### How do you do something different?

Edit the `fprocess` variable in *sample/imagemagick/Dockerfile* and put 200% instead of 50% - and you can now scale-up thumbnails to double their original size.

Edit the *samples.yml* file and pick a new Docker image name and function name for your function:

```
upscale-image:
  lang: Dockerfile
  handler: ./sample/imagemagick
  image: functions/upscaler
  fprocess: "convert - -resize 200% fd:1"
```

Now we must re-build and re-deploy the functions:

```
$ faas-cli build --filter=upscale-image -f samples.yml
$ faas-cli deploy --filter=upscale-image -f samples.yml
```

You can now invoke it again:

```
$ cat whale.jpg | faas-cli invoke upscale-image > whale-bigger.jpg
```

As expected - the resulting size is 2296 × 1500 and 537KB.

### What else can I do with ImageMagick?

Checkout the ImageMagick [homepage here](https://www.imagemagick.org/script/index.php). Any ImageMagick commands can be pasted into the "fprocess" variable and re-built to make an image-processing pipeline that can scale as a Serverless function in your cluster.

Here's an example of a function which can print text (you supply) on top of an image:

[faas-and-furious/faas-contributor-stamp](https://github.com/faas-and-furious/faas-contributor-stamp)

Here's an example of what you can do once the function is deployed:

```
$ curl http://localhost:8080/function/faas-stamp --data-binary @whale-small.jpg > whale-text.jpg
```

![](/content/images/2017/09/whale-text.jpg)

You can even customise the text by passing an addition HTTP header like this:

```
$ curl http://localhost:8080/function/faas-stamp -H "X-Caption: I'm running Serverless on my own terms" --data-binary @whale-small.jpg > whale-text.jpg
```

**Task: Make polaroids**

If you fancy a challenge - why not try editing the function to apply a "Polaroid" style to your pictures?

![](http://www.imagemagick.org/Usage/thumbnails/poloroid_caption.png) 

* [Polaroid styling on imagemagick.org](http://www.imagemagick.org/Usage/thumbnails/#polaroid)

### More about OpenFaaS

[OpenFaaS](https://www.openfaas.com) is serverless on your terms. There is no need to worry about being locked-in to a complicated architecture, set of tools or a particular cloud vendor. 

> Find out more about our project by heading over to [openfaas.com](https://www.openfaas.com) and be sure to **Star** the [project on GitHub to show your support](https://github.com/alexellis/faas).

OpenFaaS is cloud native and has Prometheus metrics built-in - so you can run it on any hardware and at scale. Pick private, public, hybrid-cloud or even a Raspberry Pi cluster.

Sit back with a coffee and learn about our CLI

* [Coffee with the OpenFaaS CLI](https://blog.alexellis.io/quickstart-openfaas-cli/)

Find out what Serverless is, what the use-cases are and who's using OpenFaaS:

* [FaaS and Furious - 0 to Serverless in 60 seconds, anywhere](https://skillsmatter.com/skillscasts/10813-faas-and-furious-0-to-serverless-in-60-seconds-anywhere)