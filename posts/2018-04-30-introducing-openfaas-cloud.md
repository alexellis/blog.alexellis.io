---
title: "Introducing OpenFaaS Cloud"
slug: "introducing-openfaas-cloud"
date: "2018-04-30T07:57:00Z"
author: "Alex Ellis"
meta_title: "Introducing OpenFaaS Cloud"
meta_description: "Introducing OpenFaaS Cloud - GitOps for Functions with a native integrations into GitHub. Use a familiar workflow - push code and get HTTPS endpoints - fast"
feature_image: "/content/images/2018/04/architecture-bay-bridge-417236.jpg"
tags:
  - "openfaas"
  - "cloud"
  - "community"
  - "kubernetes"
---

Today I want to share a new project with you called *OpenFaaS Cloud*.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Announcing <a href="https://twitter.com/openfaas?ref_src=twsrc%5Etfw">@openfaas</a> cloud at <a href="https://twitter.com/DevNetCreate?ref_src=twsrc%5Etfw">@DevNetCreate</a> <a href="https://twitter.com/hashtag/TeamServerless?src=hash&amp;ref_src=twsrc%5Etfw">#TeamServerless</a> <a href="https://twitter.com/hashtag/Serverless?src=hash&amp;ref_src=twsrc%5Etfw">#Serverless</a> <a href="https://t.co/n6hhcRK0I5">pic.twitter.com/n6hhcRK0I5</a></p>&mdash; Jock Reed (@JockDaRock) <a href="https://twitter.com/JockDaRock/status/983779290100613120?ref_src=twsrc%5Etfw">April 10, 2018</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> 

*Sharing my conceptual design at Cisco DevNet Create (developer conference) in Mountain View*

> OpenFaaS Cloud makes it even easier for developers to build and ship functions with Docker using a Git-based workflow with native integrations for GitHub and more integrations planned in the future.

I wrote my first public commit to [OpenFaaS](https://www.openfaas.com) (then called FaaS) in late 2016, but since then I've focused on building a community and a set of stable and extensible features for *Making Serverless Functions Simple* with Docker. Feedback is important for an Open Source project and so are values. OpenFaaS now has half a dozen strong case-studies, almost 100 contributors and 11k GitHub stars.

Last year before KubeCon in Austin the community worked really hard to be *the first* Open Source FaaS project to [release a Function Store](https://blog.alexellis.io/announcing-function-store/). OpenFaaS Cloud is another example of innovation which has come about from listening to the growing community and stepping out to lead in this space.

## Back to values

I began working on OpenFaaS Cloud late last year after noticing a trend from OpenFaaS case-studies from industry. I found that DevOps engineers and early adopters had bought into functions, but wanted a way to make an accessible pipeline for their developers. Each of them had created their own version of this pipeline, but with varying levels of stability and functionality.

<img src="/content/images/2018/04/OpenFaaS_10_31_2.5_png.png" alt="OpenFaaS Sticker" width="50%" height="50%"/>

The values of the OpenFaaS community are: *developer-first*, *operational simplicity* and *community-centric*. These values align well with building OpenFaaS Cloud and provides value for existing users in industry.

**Developer-first**

> putting your needs first with a familiar UI/CLI and Docker/Git workflow

At BT Research a team of DevOps professionals in (BetaLab) are supporting research experiments for 140 research engineers. OpenFaaS provided a great way for them to make functions available at scale to the whole team, but they needed a way for functions to be built quickly from Git using Docker.

**Operational Simplicity**

> easy to use and deploy, built on battle-tested cloud-native tech

[Anisha Keshavan](http://ilabs.washington.edu/postdoctoral-fellows/bio/i-labs-anisha-keshavan) is a post-doctorate at the University of Washington and is using machine-learning with Python to push the boundaries of neuro-informatics. If you've ever used a machine-learning framework then you'll already know that it's impossible to work with a cloud functions framework due to the meagre 50-60mb file-size limit applied. One of the first things she said to me was: "Why can't this work like Heroku? I just want to push code and not worry about HTTP certificates"

**Community-centric**

> investing in people and creating an open platform together - #TeamServerless

One of the earliest requests I had from the community was for a shared cluster where functions could be deployed on OpenFaaS and left running for a period of time. Initially I pushed back on this to focus on building the platform, but there is now a great way to make exactly what they asked for available.

## GitOps a history

Some people have coined this way of working as "GitOps", but it was pioneered long ago by projects like [Heroku](https://www.heroku.com). More recently start-ups like [Weaveworks](https://weave.works) have provided CI/CD for Kubernetes in a tool called [Flux](https://github.com/weaveworks/flux). [Netlify](https://www.netlify.com/) have provided GitOps for docs - you push code to your repo and in a few minutes `mkdocs` or some other tool will generate and publish your project's documentation site.

GitOps is really about using a Git repository as a single source of truth for application code and configuration. Lifecycle events such as builds and deployments are triggered by commits to Git rather than by mouse clicks or API calls.

OpenFaaS Cloud applies the principles of GitOps to build and deploy your OpenFaaS Functions from a public GitHub repository. As soon as you type in `git push` a GitHub App on GitHub.com will receive a notification that triggers a *push event* to be sent to a pipeline in OpenFaaS. The pipeline of functions will then build your function with Docker and deploy it with a rolling update to a Kubernetes or Docker Swarm cluster. Your GitHub commit is then updated with a passed/failed status and a HTTPS URL where you can access your function will be made available.

This is the process from the moment OpenFaaS Cloud receives a message from the GitHub App hosted at GitHub.com:

* OpenFaaS Cloud verifies the JSON digest with HMAC
* Clones the repository and checks out the SHA
* Builds your functions in `stack.yml` using [buildkit](https://github.com/moby/buildkit) and publishes to a registry
 * During the build - OpenFaaS function templates such as the Golang template will execute any unit-tests present, if the tests fail then the image will not be deployed
* Deploys your functions to OpenFaaS using a rolling update
* Updates GitHub with a status of pass/fail and a URL endpoint

Let's look at an example function wihch you may be familiar with if you've already tried OpenFaaS.

## Example

I set up a public GitHub repo which I use for demos called [kubecon-tester](https://github.com/alexellis/kubecon-tester). It contains a Python and a Golang function. The Go function will echo a string back when called with a HTTP POST.

* The code as pushed to a GitHub repo

```
def handle(req):
    msg = req
    if len(req) == 0:
        msg = "pass a value to the function"

    return str.format("You said: {}", msg)
```
*handler.py*

This function was generated with the following command: `faas-cli new --lang python3 kubecon`.

We also get a `kubecon.yml` file generated which we need to rename to `stack.yml` so that OpenFaaS Cloud will know which functions to build.

```
provider:
  name: faas
  gateway: http://localhost:8080

functions:
  kubecon:
    lang: python
    handler: ./kubecon
    image: alexellis/kubecon
```

*stack.yml*

* GitHub status updates:

![](https://pbs.twimg.com/media/DbyUXt8WkAASh14.jpg)

Here we see that the function was deployed and the GitHub status was updated with a successful indicator.

* GitHub badge

You can get a GitHub badge for your functions to show the build status at a glance:

![Screen-Shot-2018-04-28-at-6.32.16-PM](/content/images/2018/04/Screen-Shot-2018-04-28-at-6.32.16-PM.png)

* User overview page

The user overview page shows your public HTTPS endpoints, the deployment date and will soon include [R.E.D. metrics](https://www.weave.works/blog/the-red-method-key-metrics-for-microservices-architecture/) from Prometheus too.

![of-cloud-fns](/content/images/2018/04/of-cloud-fns.png)

* Public endpoints

A public endpoint it set up with the following scheme where each user gets their own sub-domain with HTTPS via a [LetsEncrypt wildcard certificate](https://community.letsencrypt.org/t/acme-v2-and-wildcard-certificate-support-is-live/55579).

https://github-owner.get-faas.com/function-name

So I will now have a public URL of:

https://alexellis.get-faas.com/kubecon

The URL is subject to rate-limiting and some other policies, but this can be now invoked in the following way by `curl`:

```
$ curl --data "Let's get started" https://alexellis.get-faas.com/kubecon
You said: Let's get started
```

## Q&A

### What languages are supported?

The public trial is limited to the [official templates repository](https://github.com/openfaas/templates) which currently contains: Go, Node.js, Python, Ruby and C#. This is an artificial limit imposed along with some other policies for the trial period and can be removed with configuration at any point.

> Did you know that any existing container or binary can be turned into an OpenFaaS Function in a few minutes? [Read more here](https://blog.alexellis.io/cli-functions-with-openfaas/)

### How do I get OpenFaaS Cloud?

OpenFaaS Cloud comes in two flavours, both are free and open-source. For total control over the pipeline, or for development you can deploy it to your existing OpenFaaS cluster on Swarm or Kubernetes. There is also a fully-hosted Kubernetes cluster which I was using in the example for my kubecon-tester functions.

The public environment is free of charge subject to availibility and makes a great place for experimenting, especially if you want to run functions without having to pay for your own VMs. Having public endpoints with HTTPS enabled is really useful if you are unable to get get inbound traffic at home or at work - I've even used it to host an Alexa skill.

> If you're a contributor to OpenFaaS (there are around 100 now) then ask me about short-listed access to the public environment.

### How does this differ from rolling my own?

OpenFaaS Cloud delivers a Git-based workflow for building and deploying your Serverless Functions with a tight integration into GitHub, but you may have an existing cluster and Docker CI/CD pipeline.

The market is saturated with tooling that you can run on-premise or in the cloud to build your Docker images. Here are a few products that you could use to create a similar flow on your own: GitLab, Travis CI, CircleCI, Flux, CodeFresh, CodeShip, Visual Studio Team Services or Docker EE.

The reason this is possible is because OpenFaaS builds functions as Docker images so that you get the same result in dev, staging and production. The good news is that if you already have a cluster then you can start benefiting from functions with very little investment - either with OpenFaaS Cloud or with your own existing container pipeline.

### What about testing?

There are currently two types of testing taking place automatically, but you can expect to see support for additional types of testing in the future. Unit-tests can be executed as part of the function build. The OpenFaaS language template for Golang includes a step for running linting `gofmt` and unit tests - if either of these steps fail then your code will not be deployed. The second kind of test taking place is the rolling update provided by Docker Swarm and Kubernetes - if your Pod cannot be scheduled or started then the endpoint will not switch over.

In my personal test repo you can also see a Go function which generates and verifies [bcrypt](https://github.com/alexellis/kubecon-tester/tree/master/bcrypt) hashed passwords.

## Wrapping up

OpenFaaS Cloud is still early work, but from the example above you can see that it is functional for use on premise or with the community-hosted, public cluster. The [roadmap](https://github.com/openfaas/openfaas-cloud#road-map) is available on GitHub and the community is seeking contributions. So if you see value in your team having easy access to functions please kick the tires, contribute some fixes and help me with the wider community to build OpenFaaS Cloud into a great project.

> Let's make it even easier to deploy functions with GitOps to any cloud.

You can star or fork the project here: [openfaas/openfaas-cloud](https://github.com/openfaas/openfaas-cloud).

> If you'd like to get started with learning OpenFaaS check out: [Three ways to learn Serverless with OpenFaaS this season](https://blog.alexellis.io/three-ways-to-learn-serverless-openfaas/).

## Share with your network

Please share the post and follow OpenFaaS on Twitter [@openfaas](https://twitter.com/openfaas):

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Introducing <a href="https://twitter.com/openfaas?ref_src=twsrc%5Etfw">@OpenFaaS</a> Cloud - making it even easier to build and ship your Serverless Functions with a git-based workflow - <a href="https://t.co/C4L1REhIYq">https://t.co/C4L1REhIYq</a> <a href="https://twitter.com/github?ref_src=twsrc%5Etfw">@github</a> <a href="https://twitter.com/gitops?ref_src=twsrc%5Etfw">@GitOps</a> <a href="https://twitter.com/Docker?ref_src=twsrc%5Etfw">@docker</a> <a href="https://t.co/Frr6IawFWu">pic.twitter.com/Frr6IawFWu</a></p>&mdash; Alex Ellis (@alexellisuk) <a href="https://twitter.com/alexellisuk/status/990871177517256704?ref_src=twsrc%5Etfw">April 30, 2018</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>