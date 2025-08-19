---
title: "Colorise your cat pics with Serverless!"
slug: "colorise-your-cats-with-openfaas"
date: "2019-05-16T15:37:40Z"
author: "Alex Ellis"
meta_title: "Colorise your cat pics with Serverless!"
meta_description: "In this short tutorial I'll show you how to turn any black and white photo into a colour image using a pre-packaged Machine Learning model and OpenFaaS."
feature_image: "/content/images/2019/05/animals-cats-cute-45170-2.jpg"
tags:
  - "colorisebot"
  - "openfaas"
---

In this short tutorial I'll show you how to turn any black and white photo into a colour image using a pre-packaged Machine Learning model and OpenFaaS.

> [OpenFaaS](https://www.openfaas.com/): Serverless Functions Made Simple is a platform for building and deploying code on any cloud.

In the community we packaged a machine-learning model developed by Richard Zhang from MIT. His model has been trained to "colorise" black and white images.

![cat-crop](/content/images/2019/05/cat-crop.jpg)

*Original image: [Public-Domain Cat Pictures From the Library of Congress](https://lifehacker.com/ogle-these-vintage-public-domain-cat-pictures-from-the-1834779933?utm_source=lifehacker_twitter&utm_campaign=socialflow_lifehacker_twitter&utm_medium=socialflow)*

Up until last year I helped develop and operate a [Twitter bot](https://twitter.com/colorisebot/media) which allowed anyone to see their family photos in colour. The free-tier of Twitter's API changed and unfortunately we had to shut it down, but you can see see the pictures and use the "colorise" function on your own computer or cloud.

> See also: [Project paper](https://richzhang.github.io/ideepcolor/)

Let's deploy the version which [was packaged](https://github.com/junyanz/interactive-deep-colorization) as a function.

## Get OpenFaaS

You can deploy OpenFaaS on any machine which has Docker, or you can use the cloud. In this example we'll use DigitalOcean which has a one-click image for deploying OpenFaaS.

> Use my referral link for [free credits](https://m.do.co/c/8d4e75e9886f) when you join

* Log into your [DigitalOcean dashboard](https://www.digitalocean.com/)
* Click Marketplace and OpenFaaS

![Screenshot-2019-05-16-at-16.15.08](/content/images/2019/05/Screenshot-2019-05-16-at-16.15.08.png)

I recommend using the 4GB droplet. The cost will be covered by our free credits. You should also pick your nearest region, which for me is London.

![Screenshot-2019-05-16-at-16.16.33](/content/images/2019/05/Screenshot-2019-05-16-at-16.16.33.png)

Finally enter the droplet name, I picked "openfaas-colorise".

## Access your OpenFaaS installation

DigitalOcean will start up a VM with OpenFaaS installed.

![Screenshot-2019-05-16-at-16.18.39](/content/images/2019/05/Screenshot-2019-05-16-at-16.18.39.png)

* Log into the droplet using `ssh` and the `ipv4` address given in your dashboard

In my example I typed on my Mac:

```
ssh root@134.209.185.93
```

> Note: If you forgot to configure your SSH access, then click "Access" and "Reset root password". DigitalOcean will now email you a password to use in the step above.

* You'll now be asked to provide a password, the easiest way to set a secure password is to generate a new one in your terminal. Open a new terminal and type in `head -c 16 /dev/urandom |shasum`. You can now use that value.

* Wait for the initialization script to complete

* Now get your username and password and store it for later

```
cat /root/.openfaas_password 

[Credentials]
 username: admin 
 password: 3702671c6d6647592120fa27fbd1e4b12d5c40f9
```

You can use the `faas-cli login` command at a later time if you want to deploy functions from the command-line.

> For advanced users set up [OpenFaaS on Kubernetes](https://docs.openfaas.com/deployment/kubernetes/)

## Open your dashboard

Now navigate to your OpenFaaS portal and log in, it will be the IP address on port 8080.

http://134.209.185.93:8080/

![Screenshot-2019-05-16-at-16.25.34](/content/images/2019/05/Screenshot-2019-05-16-at-16.25.34.png)

## Deploy the "Colorise" function

There are many pre-packaged functions available in the store, and you can even build your own from scratch using any binary or programming language.

![Screenshot-2019-05-16-at-16.25.54](/content/images/2019/05/Screenshot-2019-05-16-at-16.25.54.png)

![Screenshot-2019-05-16-at-16.26.11](/content/images/2019/05/Screenshot-2019-05-16-at-16.26.11.png)

Once deployed you will see the Ready button set to grey, when it becomes available to click then we're good to go and the model has been downloaded on our droplet.

## Test out your favourite cat images

I wrote this tutorial after seeing a tweet from LifeHacker where an old photograph of a black and white cat had been turned into colour.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">The Library of Congress now has a free collection of vintage cat pictures <a href="https://t.co/wf77XvCx8P">https://t.co/wf77XvCx8P</a> <a href="https://t.co/qwjZudNL9s">pic.twitter.com/qwjZudNL9s</a></p>&mdash; Lifehacker (@lifehacker) <a href="https://twitter.com/lifehacker/status/1128762995348312068?ref_src=twsrc%5Etfw">May 15, 2019</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> 

Somebody had done an excellent job of touching up the image with the "gimp" photo editing tool, but I wanted to see how OpenFaaS would do.

Let's try it.

```
https://i.kinja-img.com/gawker-media/image/upload/s--hs_50-b2--/c_scale,f_auto,fl_progressive,q_80,w_800/wv7kqqfxxtswupj2zhqi.jpg
```

Copy and paste this URL into the "Request" box and then hit "Invoke"

> Note: Make sure the "Download" button is checked, because this tells the browser to download a new image after running.

The time taken to colorise an image varies depending on the CPU being used. When using a bare metal machine from [Packet Host](https://packet.net), then the colorised kitty will appear several times faster.

For our tutorial the turn-around time is not that important, but for a service or for bulk processing it does become more relevant. OpenFaaS also allows us to run our requests asynchronously and pick up the result later on.

![Screenshot-2019-05-16-at-16.31.17](/content/images/2019/05/Screenshot-2019-05-16-at-16.31.17.png)

### Side-by-side

Here's the image that Tom painstakingly colorised by hand:

![](https://pbs.twimg.com/media/D6p_zvRXsAA9dGi?format=jpg&name=small)

Here's our version:

![](https://pbs.twimg.com/media/D6siur2XsAIpWq4.jpg)

Now there's a bit of work we can do to improve the automated version, such as [removing a colour cast using ImageMagick](https://github.com/alexellis/repaint-the-past/tree/master/normalisecolor).

Here's an outdoor scene which this model seems to do very well. It's using a photograph I took of a church in Cathedral Square in Peterborough, UK using 35mm B&W film.

![Screenshot-2019-05-17-at-13.33.35](/content/images/2019/05/Screenshot-2019-05-17-at-13.33.35.jpg)

> See also: [repainting-the-past](https://github.com/alexellis/repaint-the-past/tree/master/normalisecolor) GitHub repo.

## Inception

You may also like one of our other machine-learning functions called "inception". Inception can be deployed in exactly the same way and uses the [ImageNet dataset](http://www.image-net.org) to classify what objects are found in your source image.

![](https://github.com/openfaas/faas/raw/master/docs/inception.png)

## Find out more

There are several other functions in the store which use machine-learning, but the most interesting examples are the ones you create yourself. Whether it's a [GitHub-bot](https://github.com/alexellis/derek/), a [single-page app](https://www.openfaas.com/blog/serverless-single-page-app/) or [your corporate home-banking system](https://kccna18.sched.com/event/GraO/digital-transformation-of-vision-banco-paraguay-with-serverless-functions-alex-ellis-vmware-patricio-diaz-vision-banco-saeca).

To find out more about OpenFaaS checkout the website and try the hands-on workshop so that you can build and share your own awesome functions.

* [OpenFaaS.com](https://www.openfaas.com)
* [Free: OpenFaaS Workshop](https://github.com/openfaas/workshop)
* [OpenFaaS community Slack](https://docs.openfaas.com/community)