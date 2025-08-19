---
title: "FaaS for the Rubyist"
slug: "faas-for-the-rubyist"
date: "2019-10-02T10:24:23Z"
author: "Alex Ellis"
meta_title: "FaaS for the Rubyist"
meta_description: "Learn how Rubyists can take advantage of portable FaaS wirth OpenFaaS and Kubernetes. Covering HTML, asynchronous functions and native Gems."
feature_image: "/content/images/2019/10/ruby-red.jpg"
tags:
  - "ruby"
  - "coding"
  - "devlife"
  - "openfaas"
  - "kubernetes"
  - "serverless"
---

We'll be using [OpenFaaS](https://www.openfaas.com) today and its ruby-http template that gives full control over the HTTP request/response for your functions. OpenFaaS is a next-generation PaaS called a FaaS which allows users to run microservices and functions on any machine.

![text670](/content/images/2019/10/text670.png)

My buddy [Paulo Arruda](https://twitter.com/alexellisuk/status/1153298652850511873?s=20) shut down his faastRuby service this month, so I wrote up this tutorial to welcome Ruby developers to the OpenFaaS community.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Great chat today with fellow software-engineer <a href="https://twitter.com/parrudanet?ref_src=twsrc%5Etfw">@parrudanet</a>. He&#39;s is building <a href="https://twitter.com/faastruby?ref_src=twsrc%5Etfw">@faastruby</a> - a first-class Ruby FaaS platform and his journey reminds me a lot of my own. Thanks <a href="https://twitter.com/thinkshiv?ref_src=twsrc%5Etfw">@thinkshiv</a> for the intro. <a href="https://twitter.com/hashtag/serverless?src=hash&amp;ref_src=twsrc%5Etfw">#serverless</a> <a href="https://twitter.com/hashtag/faas?src=hash&amp;ref_src=twsrc%5Etfw">#faas</a> <a href="https://twitter.com/hashtag/ruby?src=hash&amp;ref_src=twsrc%5Etfw">#ruby</a> <a href="https://t.co/EhNSR7tuBi">pic.twitter.com/EhNSR7tuBi</a></p>&mdash; Alex Ellis (@alexellisuk) <a href="https://twitter.com/alexellisuk/status/1153298652850511873?ref_src=twsrc%5Etfw">July 22, 2019</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

## Tutorial

We'll deploy OpenFaaS, then go on to build a series of functions using Ruby to generate text, JSON, and HTML. We'll also make use of Ruby Gems.

Want to see how OpenFaaS, Docker, and Kubernetes can all play well together? Checkout my new video from the Cloud Native London conference: [Serverless 2.0: Get Started With The PLONK Stack](https://skillsmatter.com/skillscasts/14268-serverless-2-0-get-started-with-the-plonk-stack)

### Install OpenFaaS

[OpenFaaS](https://www.openfaas.com) provides a complete platform for FaaS and microserviecs out of the box by building upon industry-standard projects from the Cloud Native Computing Foundation such as [Prometheus.io](https://prometheus.io) and [Kubernetes](https://kubernetes.io/)

![Simple-OFC-InfraLayer](/content/images/2019/10/Simple-OFC-InfraLayer.png)

A new community member [Josh Michielsen](https://twitter.com/jmickey_) wrote up a concise tutorial for installing OpenFaaS and its CLI on any machine using [k3d from Rancher](https://github.com/rancher/k3d).

* [Use Josh's tutorial](https://mickey.dev/posts/getting-started-with-openfaas/) to use k3d on your laptop
* Or [use the official docs](https://docs.openfaas.com/deployment/)

If you run into any issues, please [use the docs](https://docs.openfaas.com/deployment/troubleshooting/) and feel free to [join Slack](https://slack.openfaas.io/) and ask for help there.

### Explore the template

Each OpenFaaS function can be built from a template, or by using a Dockerfile. I created the `ruby-http` template for users who needed native compilation of Gems (using Debian as a base) and sane defaults such as a non-root user and a light-weight runtime image.

Before you get started have a look at how the [ruby-http](https://github.com/openfaas-incubator/ruby-http) template works by browsing the README.

Generate a new function named `my-website`:

```bash
faas-cli template store pull ruby-http

faas-cli new --lang ruby-http my-website
```

You'll get three files generated:

```bash
my-website.yml
my-website/handler.rb
my-website/Gemfile
```

Let's look at the YAML file (my-website.yml):

```yaml
version: 1.0
provider:
  name: openfaas
  gateway: http://127.0.0.1:8080
functions:
  my-website:
    lang: ruby-http
    handler: ./my-website
    image: my-website:latest
```

In order to deploy the function, change the `image` from `my-website:latest` to include your Docker Hub username i.e. `alexellis2/my-website:latest`. Each time we deploy the code, a new image will be pushed to the registry and our cluster will pull it down and run it for us.

Look at `my-website/handler.rb`:

```Ruby
class Handler
  def run(body, headers)
    response_headers = {"content-type": "text/plain"}
    body = "Hello world from the Ruby template"

    return body, response_headers
  end
end
```

Here we see that we can return a `body` and a map of `response_headers`. The default advertises the response as `text/plain` mime type.

We also get a Gemfile where we can provide a list of gems:

```ruby
source 'https://rubygems.org'
```

The good news is that you can include Gems here that require native compilation such as Nokogiri. They will be built and pushed up inside the image that we build.

### Deploy the example

Now deploy the example with the following:

```bash
faas-cli up -f my-website.yml
```

The `up` command does three things:

1) Builds your code into a Docker image and installs your Ruby Gems
2) Pushes the resulting image to the Docker Hub or another registry specified in your YAML file
3) Sends a REST call to the OpenFaaS gateway to deploy the function

The OpenFaaS back-end will then pull down your image and run it.

Open the OpenFaaS UI and invoke the function.

![Screenshot-2019-10-02-at-10.50.23](/content/images/2019/10/Screenshot-2019-10-02-at-10.50.23.png)

You can also invoke it via `curl`:

```bash
export OPENFAAS_URL=http://127.0.0.1:8080

curl $OPENFAAS_URL/function/my-website
```

You can also run `faas-cli describe` to view alternative URLs for the function and to read its metadata.

```bash
faas-cli describe -f my-website.yml my-website

Name:                my-website
Status:              Ready
Replicas:            1
Available replicas:  1
Invocations:         2
Image:               alexellis2/my-website:latest
Function process:    
URL:                 http://127.0.0.1:8080/function/my-website
Async URL:           http://127.0.0.1:8080/async-function/my-website
```

You can invoke any OpenFaaS function asynchronously without having to add additional software such as [resque](https://github.com/resque/resque) or [Sidekiq](https://github.com/mperham/sidekiq).

Simply change the URL, that's it. If you want to get the result then pass an `X-Callback-Url` header with where you want the result to be sent.

### Render a webpage (HTML)

Now update the example to render HTML.

Edit `my-website/handler.rb`:

```Ruby
class Handler
  def run(body, headers)
    response_headers = {"content-type": "text/html"}
    body = '<html><h2>OpenFaaS for Ruby programmers</h2><p><img src="https://cdn.iconscout.com/icon/free/png-256/ruby-44-1175099.png"/></p><p>Hello world from the Ruby template</p></html>'

    return body, response_headers
  end
end
```

Redeploy the function

```bash
faas-cli up -f my-website.yml
```

Now invoke the function and inspect the returned content type, you'll also see the HTML rendered in a browser.

```
curl -i $OPENFAAS_URL/function/my-website
```

![Screenshot-2019-10-02-at-11.15.48](/content/images/2019/10/Screenshot-2019-10-02-at-11.15.48.png)

### Use your favourite gem

We'll now write a new function to print the title of an RSS feed.

```bash
faas-cli new --lang ruby-http get-rss-title
```

Edit `get-rss-title/handler.rb`:

```ruby
require 'rubygems'
require 'simple-rss'
require 'open-uri'
require 'json'

class Handler
  def run(body, headers)
    response_headers = {"Content-Type": "application/json"}

    uri = ENV["URI"]
    rss = SimpleRSS.parse open(uri)
    body = {"title" => rss.channel.title}

    return JSON.dump(body), response_headers
  end
end
```

Now we need a couple of gems, so let's update our Gem file so that the Docker build knows what to do.

Edit `get-rss-title/Gemfile`:

```ruby
source 'https://rubygems.org'

gem 'simple-rss'
```

I've set the URI of the feed to be configured at deployment time in an environment variable. We can set these via the YAML file.

Edit `get-rss-title.yml`:

```yaml
version: 1.0
provider:
  name: openfaas
  gateway: http://127.0.0.1:8080
functions:
  get-rss-title:
    lang: ruby-http
    handler: ./get-rss-title
    image: get-rss-title:latest
    environment:
      URI: http://rss.slashdot.org/Slashdot/slashdot/to
```

> Note: remember to update `image:` to include your own Docker Hub username

This is what it looks like:

```bash
curl http://127.0.0.1:8080/function/get-rss-title; echo
{"title":"Slashdot"}
```

What could you do with the RSS feed? How about building a pretty-printer that outputted HTML for each entry?

## Wrapping up

We've now built and deployed an OpenFaaS function using Ruby to render plain-text, JSON, and HTML. We've also made use of Gems, so it's now over to you to continue learning and then to go on to build something awesome.

### Go deeper with OpenFaaS

OpenFaaS is built in the open by a community volunteers, if you'd like to contribute, the best way to start is by joining Slack. We would love to have more Ruby programmers in the community and to improve the developer-experience.

![OpenFaaS architecture](https://github.com/openfaas/faas/blob/master/docs/of-workflow.png?raw=true)

*Above: OpenFaaS has built-in auto-scaling and [detailed metrics](https://docs.openfaas.com/architecture/metrics/), meaning that you can build your own dashboard to monitor your Ruby functions and microservices*

![Dashboard with Grafana](https://camo.githubusercontent.com/24915ac87ecf8a31285f273846e7a5ffe82eeceb/68747470733a2f2f7062732e7477696d672e636f6d2f6d656469612f4339636145364358554141585f36342e6a70673a6c61726765)

*Above: Grafana Dashboard generated from built-in Prometheus metrics*

You can find out about the [OpenFaaS stack in the docs](https://docs.openfaas.com/architecture/stack/)

I also put together short set of labs for the team at [Civo.com](https://civo.com) using Ruby: [Ruby workshop for Civo](https://gist.github.com/alexellis/a6ee5f094f86987a0dc508442220c52a), you can use it to learn about secrets and authentication.

### Get in touch

Get in touch via [Slack](https://slack.openfaas.io) or [Twitter](https://twitter.com/alexellis/) and show me what you've built. 👑

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">&quot;FaaS for the Rubyist&quot; by <a href="https://twitter.com/alexellisuk?ref_src=twsrc%5Etfw">@alexellisuk</a> <a href="https://twitter.com/hashtag/ruby?src=hash&amp;ref_src=twsrc%5Etfw">#ruby</a> <a href="https://twitter.com/hashtag/rubyist?src=hash&amp;ref_src=twsrc%5Etfw">#rubyist</a> <a href="https://twitter.com/hashtag/faas?src=hash&amp;ref_src=twsrc%5Etfw">#faas</a> <a href="https://twitter.com/hashtag/serverless?src=hash&amp;ref_src=twsrc%5Etfw">#serverless</a> <a href="https://twitter.com/hashtag/cncf?src=hash&amp;ref_src=twsrc%5Etfw">#cncf</a> <a href="https://twitter.com/hashtag/k8s?src=hash&amp;ref_src=twsrc%5Etfw">#k8s</a> <a href="https://twitter.com/hashtag/k3s?src=hash&amp;ref_src=twsrc%5Etfw">#k3s</a> <a href="https://twitter.com/hashtag/devlife?src=hash&amp;ref_src=twsrc%5Etfw">#devlife</a> <a href="https://t.co/A5e7IpoQWD">https://t.co/A5e7IpoQWD</a></p>&mdash; OpenFaaS (@openfaas) <a href="https://twitter.com/openfaas/status/1179343347200208897?ref_src=twsrc%5Etfw">October 2, 2019</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>