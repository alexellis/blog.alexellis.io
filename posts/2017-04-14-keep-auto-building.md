---
title: "Keep shipping with Docker auto-build"
slug: "keep-auto-building"
date: "2017-04-14T21:11:02Z"
author: "Alex Ellis"
meta_title: "Keep shipping with Docker auto-build"
meta_description: "Keep shipping by getting the most out of Docker's free auto-build service on the public hub. This is great for open source projects - get my best tips now"
tags:
  - "ci"
  - "docker"
  - "containers"
  - "auto-build"
  - "docker hub"
---

This post outlines some Docker tips for getting the most of the Docker Hub's free auto-build service.

> The Docker Hub provides an auto-build mechanism which can build your images as soon as you commit code to a Github or Bitbucket repo.

My first experience of the Docker Hub involved building my own Docker image on my laptop and pushing it up manually to the Docker Hub. This was fine for the first few ad-hoc builds, but you quickly realise that things get out of date and we need a better way to keep shipping.

> Here are my top tips for getting your ship in order.

### Do: Create automated builds

**Step 1 - select auto-build**

![](/content/images/2017/04/Screen-Shot-2017-04-12-at-16.11.18.png)

**Step 2 - select Github or Bitbucket repository**

You may need to link your account for this step. After that you'll see a list of Git repos to pick from.

![](/content/images/2017/04/Screen-Shot-2017-04-12-at-16.11.32.png)

**Step 3 - enter a good name and description**

The image name is normally the same as your repo or project's name.

![](/content/images/2017/04/Screen-Shot-2017-04-12-at-16.12.16.png)

**Step 4 - configure your tags**

By default the Hub will look for a Dockerfile in the root of your repo. That will generate a build trigger for any future code commits.

**Step 5 - trigger your first build**

The default tag is "latest" - trigger a build by committing code or clicking "Trigger".

![](/content/images/2017/04/Screen-Shot-2017-04-12-at-16.15.04.png)

### Do: Use multiple branches

If you have an edge and a master branch in your Git repo, you can setup builds against both, so that as you and your team commit into dev or test branches, your images get re-generated.

In the example we'd have two primary tags people could pull at any time:

* `alexellis2/href-counter:latest`
* `alexellis2/href-counter:edge`

![](/content/images/2017/04/Screen-Shot-2017-04-12-at-16.18.49.png)
*Set up multiple tags for your branches*

### Do: delete your manual builds

Log into the Docker hub and delete your old manual builds. Especially if they are building from a Github repository.

![](/content/images/2017/04/Screen-Shot-2017-04-12-at-16.08.59.png)

This might feel ruthless, but you should never trust an image that has been pushed manually to the Docker hub and neither should anyone else.

### Do: Use webhooks to create a CD pipeline

The Docker Hub will perform continuous integration for you by building new images for code changes, but you may also want to redeploy code continuously through Continous Delivery (CD).

![](/content/images/2017/04/Screen-Shot-2017-04-12-at-16.21.58.png)

*Adding a new webhook*

As soon as your new image is created and available on the Docker Hub your public endpoint will receive a HTTP POST.

You can use a service like Paste.bin to setup a temporary public endpoint to receive a post.

Here are a few things you could do with the message:

* Notify your team on Slack
* Redeploy your staging or production server with the new image
* Raise a card on your Trello board to manually redeploy or check the image on a staging server

### Do: pay for what you need

**Docker Security Scanning**

If you upgrade to a paid plan then the Docker Hub can scan your images for vulnerabilities automatically.

* Find out more about [security scanning](https://docs.docker.com/docker-cloud/builds/image-scan/#what-do-i-do-next)

**Multiple accounts**

The Docker Hub allows you to create your own organizations which are like new username aliases. For my recent serverless project I created a free organisation called "functions" where I keep builds for that project.

This also helps people find what is relevant to them under your account.

Once you've created an organization you can collaborate with your team.

![](/content/images/2017/04/Screen-Shot-2017-04-12-at-16.11.18.png)

### Do: create a mono-repo

You can experiment with a Google-style mono-repo where all your Dockerfiles are kept in separate folders under the same Github or Bitbucket repo.

Your images will all be built under the same name, but they will have different tags. I recently used this trick with my FaaS (serverless framework) sample images for getting started with my project.

I have a single Docker image called `functions/base` and then each programming language has its own tag.

### Don't: make everything public

For a small fee you can pay to keep some or all of your Docker repos private. This can be important for collaboration or early access.

### Wrapping up

I hope you could walk away with at least one new trick under your belt. Let me know your best Docker Hub hacks on Twitter [@alexellisuk](https://twitter.com/alexellisuk).

**Alternatives to the free Docker Hub service**

You could run your own Docker CI pipeline with a tool like Jenkins or a cloud hosted service like Travis, but it may be harder for users to trust your images since they will not be marked as "auto-build". If this matters to you then a Docker-backed solution may be your best option. 

The Docker Hub is provided on a best effort basis, without a formal service-level agreement. Resources are shared and you may find that over time your needs change.

If you're starting out, for a modest service charge you can get up and running with [Docker Cloud](https://cloud.docker.com) and build, ship, run on your own cloud servers.

> Whatever option you decide fits best for you, my final comment would be to automate as much of the workflow as possible.