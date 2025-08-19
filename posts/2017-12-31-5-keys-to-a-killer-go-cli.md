---
title: "5 keys to create a killer CLI in Go"
slug: "5-keys-to-a-killer-go-cli"
date: "2017-12-31T14:51:00Z"
author: "Alex Ellis"
meta_title: "5 keys to create a killer CLI in Go"
meta_description: "Learn five keys to creating your next killer CLI using Go. We'll cover lessons learned over 8 months of development from the OpenFaaS project team."
feature_image: "/content/images/2017/12/pret-top.jpg"
tags:
  - "golang"
  - "go"
  - "engineering"
  - "golang basics"
  - "CLI"
---

We're having a renaissance of CLIs - every programming language from Node.js to Go to less fashionable ones like .NET all have CLIs and developers love them. You should love them too and make sure your next CLI is a killer.

> CLIs (command-line interfaces) are text-based interfaces for your applications which are easily automated, fast to work with and can be combined with other CLIs to create workflows. 

### 1. Pick Go

Here's why I prefer the OpenFaaS CLI in Go over the Serverless Framework Inc Node.js CLI:

* Compiles to a single static binary

With Go you can easily provide a single static binary that contains your whole application or CLI for your chosen platform. To target a different CPU or OS you just pass in an environmental override when building.

Here's a binary for Windows, 64-bit Linux and Raspberry Pi:

```
GOOS=windows go build -o cli.exe
GOOS=linux go build -o cli
GOARCH=armv7 GOOS=linux go build -o cli-rpi
```

That's it - and there are more platforms available too - like FreeBSD. You won't need to install any dependencies and the final output binary can be tiny.

* Consistent style

Go is an opinionated language and while there may be some differences between which editors a project prefers - you will encounter a consistent standard for styling, formatting and build tools. Something like Node.js could involve any number of "task runners" or "transpilers" - or a more esoteric flavour of the language like TypeScript or CoffeeScript.

Go has a consistent style and was deliberately designed to be unambiguous. This makes it attractive to contributors and easy for on-boarding. 

* Fast on every platform

A statically compiled Go binary is super fast to load - compared to Node.js. For instance: Node.js on a single-core Raspberry Pi can take 1.5-3.0 seconds to load before executing any code.

* Easy to create a REST client

Go includes a no-nonsense `http` client and has built-in support for working with `xml`, `json` and binary formats. There's also a very good library for working with YAML which is used in OpenFaaS here: [stack.go](https://github.com/openfaas/faas-cli/blob/master/stack/stack.go)

There may be reasons why Node.js or another language is more suitable for your use-case. If you've already decided to build a CLI in Go - then you can reap the benefits of a fast binary that's small and easy to distribute.

### 2. Parse flags & arguments

The standard Go library includes a `flags` package that can be used to parse flags or arguments in a couple of lines of code.

```
package main

import (
	"flag"
	"fmt"
	"os"
)

func main() {
	var image string
	flag.StringVar(&image, "image", "", "Docker image")
    flag.Parse()
    
	if len(image) == 0 {
		fmt.Fprintf(os.Stderr, "You must specify a Docker image name")
	}

	fmt.Printf("Your Docker image was: %s", image)
}
```

> From my experiences in the world of enterprise development - the average C# developer would have written his own string parser and then created a ConsoleApp as an entry-point then a DLL Library for the parsing and one more for the application code. Contrast that to the snippet above.

Go is unpretentious - you can have a single file that compiles to a tiny binary and be done with that. 

I suggest you start here and then once you've stretched `flags` to the limit you can look at something more modular like [Cobra](https://github.com/spf13/cobra).

Cobra is used by Docker, Kubernetes and the OpenFaaS projects and means that handlers/commands can live in separate files or modules. It also makes documenting each command really simple. [Checkout the code here for our 'list functions' command](https://github.com/openfaas/faas-cli/blob/master/commands/list.go).

Another advantage of using "cobra" is that it has a verb noun syntax. This helped us when designing our user experience. We went from a somewhat jarring experience to something more fluid:

```
faas-cli -deploy -image=functions/alpine -name=cat -fprocess=/bin/cat
```

To:

```
faas-cli deploy --image=functions/alpine --name=cat --fprocess=/bin/cat
```

We also took feedback about managing multiple functions and created a YAML format which meant the CLI command could be as simple as:

```
faas deploy -f stack.yml
```

Or

```
faas deploy -f https://git.raw/stack.yml
```

> Tip: pick verbs / commands carefully and ask other people if they make sense. If something jars with you then it's probably wrong. It can take several iterations but what you're aiming for is an intuitive experience.

### 3. Automate everything

Create an automated build using a free and public CI platform like Travis so that contributors or collaborators know whether their changes can be integrated.

Use GitHub releases to track changes in the project and milestones. You can set up a post-build action in Travis to publish binary artifacts automatically for every platform you target.

If you have a Docker image - publish that on the Docker store at the same time as pushing a new release artifact. Tools like Travis can obfuscate credentials and keys so that they do not show up in logs.

Go projects are very easy to build in Docker. Here's an example from one of our projects:

* [Dockerfile for API Gateway](https://github.com/openfaas/faas/blob/master/gateway/Dockerfile)

Make sure you use [multi-stage builds](https://docs.docker.com/engine/userguide/eng-image/multistage-build/) so you ship a lean image.

* [OpenFaaS main project CI .travis.yml file](https://github.com/openfaas/faas/blob/master/.travis.yml)

While it's easy to start with - you do not want to be building 3-5 binary files on your own machine for every release then uploading them to a web-form every time you need an update.

### 4. Integrate with package managers

If you want to make it easy for your target audience to be able get hold of your CLI then you need to make that as easy as possible. This means integrating with package managers.

* `brew` - if your target audience is the developer - then a large percentage of them may have a Mac. brew is a package manage which means most CLIs are only one command away `brew install faas` for instance
* Linux - for Linux there are many package managers so I've chosen to build a download utility which can be run as root or as a regular user. To get the OpenFaaS CLI: `curl -sL https://cli.openfaas.com | sh` - or to get hold of Docker: `curl -sL https://get.docker.com | sh`.
* Windows - Windows users have good options available for shells including Git Bash (my preferred option) and the Windows Subsystem for Linux. WSL can use the Linux `curl` utility, but if you are targeting "point and click" developers you may want to create a "double-click" installer.

Whatever you do - make sure it's automated and evaluate each package manager you support. Will you have time to maintain the integration? Is it provided by the project or by the community? What if it breaks? For instance - we maintain a guide on how to [upgrade our brew formula](https://github.com/openfaas/faas-cli/blob/master/CONTRIBUTING.md#how-to-update-the-brew-formula).

> Tip: Make sure the update/release cycle of chosen packages can match the cadence of your project. How many times have you had to install Ubuntu packages from a third-party PPA due to them being out of date?

### 5. Accept contributions and gather feedback

Provide an easy way for people to provide feedback and contributions. A CLI should be designed for its operators - so make it easy for them to submit code changes or suggestions.

User feedback is essential, but when running an Open Source Software project I often hear people struggle to understand how or if their software is being used.

Basic feedback can be gathered from the download statistics on GitHub or `brew`. Several key projects have started gathering usage data automatically using an analytics platform - examples include: `brew`, Visual Studio Code, Atom and Docker for Mac/Windows. If you go down this route make sure you provide a privacy policy and comply with any potential data-protection regulations.

Here's some things we're looking at collecting for [OpenFaaS in issue #108](https://github.com/openfaas/faas-cli/issues/108):

* which commands were used
* what programming languages functions are being scaffolded for
* operating system / CLI version / location in the world etc

> OpenFaaS contributor John McCabe has been leading this initiative for the project.

### Wrapping up

There are many reasons to use Go to build your next killer CLI - from the speed of compilation and execution, the availability of built-in or high-quality packages, to the ease of automation. It may not be right for everyone and other languages and platforms do have different pros and cons.

If you're starting out wanting to take your CLI to the next level then take inspiration from this post and the experience we've built up over the last 8 months building the [OpenFaaS CLI](https://github.com/openfaas/faas-cli). *If you would like to contribute to the code-base we're always looking for help and have an thriving community.*

**Follow and share on Twitter**

Do you have questions, comments and suggestions? Follow me on [Twitter](https://twitter.com/alexellisuk) and never miss a post again.

<blockquote class="twitter-tweet">
<p>5 keys to create a killer CLI in Go - <a href="https://t.co/AoHfHgv5w3">https://t.co/AoHfHgv5w3</a> @golang @docker @kubernetesio @openfaas</p>&mdash; Alex Ellis (@alexellisuk) <a href="https://twitter.com/alexellisuk/status/947487509533085696">December 31, 2017</a>
</blockquote>

#### See also:

[OpenFaaS.com](https://www.openfaas.com/) - Serverless Functions Made Simple

<img src="https://raw.githubusercontent.com/openfaas/media/master/OpenFaaS_logo_stacked_opaque.png" width="450px" height="450px"></img>

With OpenFaaS you can build serverless functions in any language in seconds and run them anywhere at scale.

> Serverless functions are small, discrete, reusable chunks of code that can be built once and deployed the same way everywhere. They do one thing and do it really well - the best uses for functions are integrating event driven systems or building integrations between existing microservices.

Find out more on the [project website](https://www.openfaas.com) or read [the code on GitHub](https://github.com/openfaas/faas). 

> Acknowledgements - thanks to John McCabe and Richard Gee for reviewing the post and for all their [contributions to the OpenFaaS CLI](https://github.com/openfaas/faas-cli/graphs/contributors) through code, testing and feedback.