---
title: "Serverless by use-case: Alexa skill for Dockercon"
slug: "serverless-alexa-skill-mobymingle"
date: "2017-05-15T08:18:00Z"
author: "Alex Ellis"
meta_title: "Serverless by use-case: Alexa skill for Dockercon"
meta_description: "Learn how to leverage Serverless functions to build an Alexa skill for a real-world data feed from Dockercon using Golang and a JSON HTTP API."
tags:
  - "golang"
  - "voice"
  - "Dockercon"
  - "alexa"
  - "docker"
---

In the Dockercon closing ceremony I showed off a range of Serverless demos with my [Functions as a Service (FaaS)](https://www.openfaas.com/) project. In this post I'll talk about one of the Alexa skills I wrote in Golang to integrate with a data-feed collected over the duration of the conference.

![](/content/images/2017/05/alexa--1-.jpg)

### Introduction

The closing session at Docker's annual conference is Moby's Cool Hacks - which is both a contest and a showcase for outstanding projects. 

> Every day, we see great new apps that are built on top of Docker. And yet, there’s always a few that stand out not just for being cool apps, but for pushing the bounds of what you can do with Docker.

> (Mano Marks [writing on the Docker blog](https://blog.docker.com/2017/04/dockercon-2017-mobys-cool-hack-sessions/))

Once it had been confirmed that my Cool Hack would be one of the contest winners I set about finding ways of relating my demos to the conference. Victor Coisne - the community marketing lead at Docker told me about a program called [MobyMingle](https://blog.docker.com/2017/04/introducing-moby-mingle-dockercon-2017/) that would allow people to arrange meet-ups at the event to share knowledge and make new friends.

I was put in touch with the team behind [MobyMingle](https://blog.docker.com/2017/04/introducing-moby-mingle-dockercon-2017/) called [E-180](https://www.e-180.com) and within a couple of weeks they exposed an API for me where I could get statistics back from the MobyMingle program.

I'm going to talk about how I integrated MobyMingle with Alexa to produce a fun demo for my Dockercon demo.

*Watch the closing keynote video*

<iframe width="560" height="315" src="https://www.youtube.com/embed/-h2VTE9WnZs?start=954" frameborder="0" allowfullscreen></iframe>


### Building an Alexa skill

Alexa is Amazon's voice assistant which launched in the UK earlier last year. At the time of writing two "Alexa" devices were available - the Echo and the cheaper Echo dot. For my demo I used an [Echo Dot](https://www.amazon.co.uk/Amazon-Echo-Dot-Generation-Black/dp/B01DFKBL68).

In order to add custom code to your Alexa you have to define a new skill which involves three things things:

* Voice commands (sample utterances)
* A voice schema (Intents and parameters)
* An AWS Lambda function or a publicly available HTTPS endpoint

> Note: Amazon will not invoke an endpoint over plain HTTP, this is for security reasons.

#### 1. Sample utterances:

```
CountBrainDatesIntent how many mingles have we had
CountBrainDatesIntent how many mingles we had
CountBrainDatesIntent how many mingles we had at dockercon
CountBrainDatesIntent how many mingles were there
FindPopularKeywordIntent what was the most popular keyword
FindPopularKeywordIntent what was popular at dockercon
```

On the left hand side we have the "Intent" and on the right hand side we can define any number of voice commands that correspond to it.

> Unlike with a regular graphical user interface such as a web-page - there is often more than one way to do something. User Experience (UX) applies just as much to voice as it does to apps and websites.

#### 2. Intent Schema

Here we define the available Intents - there are some default ones provided by Amazon which are used for utterances like "help" and "what can I say?".

```
{
  "intents": [
    {
      "intent": "CountBrainDatesIntent"
    },
    {
      "intent": "FindPopularKeywordIntent"
    },
    {
      "intent": "AMAZON.HelpIntent"
    }
  ]
}
```

In this example none of the intents take a parameter which makes them slightly easier to work with. For an example of an intent with parameters [click here](https://github.com/alexellis/faas-dockercon/blob/master/myassistant/intents.json) to view my Payroll skill (myassistant).

#### 3. Handler

We then have to provide an application to handle requests. All Alexa requests are sent as a JSON body with the Intent and any parameters. They expect a JSON response with the text your Echo should speak out.

*Example JSON:*

I find it useful to keep several of these for testing the handler during development before redeploying it. Here is an example [Request](https://github.com/alexellis/faas-dockercon/blob/master/mobymingle/test.json) and [Response](https://github.com/alexellis/faas-dockercon/blob/master/mobymingle/sample.json).

My Golang code is spread over three files, but is relatively simple.

* [types.go](https://github.com/alexellis/faas-dockercon/blob/master/mobymingle/types.go)

When parsing the JSON request and constructing the JSON response it's helpful to have a number of `struct` types available for un/marshaling.

* [proxy.go](https://github.com/alexellis/faas-dockercon/blob/master/mobymingle/proxy.go)

This file abstracts away all communication with the MobyMingle (E-180) service so that we only have one place to make changes.

These are the two functions it contains:

```
func getKeywordResponse() *BraindateTopicResponse
func getMingleResponse() *BraindateResponse
```

The URLs are hard-coded, but need an access token for authentication. I pass that in via an environmental variable `access_token`. Given enough time a [Swarm secret](http://blog.alexellis.io/swarm-secrets-in-action/) would be a better option. 

* [handler.go](https://github.com/alexellis/faas-dockercon/blob/master/mobymingle/handler.go)

This is the glue of the Alexa skill. Any FaaS function operates by reading its request through `stdin` and writing its response back to `stdout` that means that FaaS functions do not need repetitive boiler-plate code. Out of the box they can handle web requests for free.

You can find all of the code in the GitHub repository but this is probably the most interesting part - where we tell Alexa what to say back in response:

```
func buildOutput(intent *AlexaIntent) string {
	var speech string
	if intent.Name == findPopularKeywordIntent {
		keywords := getKeywords()
		speech = "The most popular keywords were: " + strings.Join(keywords, " and ")
	} else if intent.Name == countBrainDatesIntent {
		brainDates := getBraindates()
		speech = fmt.Sprintf("We've had a total of %d mingles so far", brainDates)
	} else if intent.Name == AmazonHelp {
                speech = "You can say: what was the most popular keyword. And how many mingles have we had?"
        } else {
		speech = fmt.Sprintf("You wanted the %s intent, but I can't help you with that.", intent.Name)
	}
	return speech
}
```

It's very important to support edge-cases with Alexa skills, otherwise your users will receive a vague error message. In the code above I've made sure unexpected Intents are handled well and the AmazonHelp phrase too (what can I say?).

### Building a FaaS Function

FaaS functions are packaged in Docker containers. Any process can be a FaaS function if it works with `stdin` and `stdout` - that means than even a UNIX built-in utility like `cat` can be a serverless function.

My Dockercon demo used two separate Dockerfiles to produce a tiny FaaS container image. If you were to set about that task now you could take advantage of [multi-stage builds](https://docs.docker.com/engine/userguide/eng-image/multistage-build/) and use a single Dockerfile to achieve the same result.

* [Dockerfile.build](https://github.com/alexellis/faas-dockercon/blob/master/mobymingle/Dockerfile.build)

* [Dockerfile](https://github.com/alexellis/faas-dockercon/blob/master/mobymingle/Dockerfile)

Three lines make any regular Docker container into a FaaS function. Here's an example of what you could add to the `alpine:3.5` image on the Docker hub to create an `echo function`:

```
ADD https://github.com/alexellis/faas/releases/download/0.5.5/fwatchdog /usr/bin

ENV fprocess="/bin/cat"

CMD ["fwatchdog"]
```

The `watchdog` sits between an API Gateway and your code and handles all HTTP communication so your code doesn't have to. The `fprocess` variable instructs the watchdog what process to run for each HTTP request.

One of the advantages of using my FaaS project over AWS Lambda would be that you can write your code in whatever programming language you want and run it on whatever hardware you have available.

Here's a few examples:

* Have you ever heard of COBOL? Maybe you wrote some, or have a relative who did. Well you can [write functions in COBOL](https://twitter.com/alexellisuk/status/860201991766769664).

* FaaS can also [run on a Raspberry Pi](https://gist.github.com/alexellis/665332cd8bd9657c9649d0cd6c2dc187) - maybe you're interested in IoT or want to run your code on a low-powered server at home?

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">So, it turns out you can run <a href="https://twitter.com/hashtag/FaaS?src=hash">#FaaS</a> on a <a href="https://twitter.com/docker">@docker</a> swarm on a PiZero stack in the comfort of your own home. <a href="https://t.co/hxuUoc0kXD">https://t.co/hxuUoc0kXD</a> <a href="https://t.co/i2CGuqBxt6">pic.twitter.com/i2CGuqBxt6</a></p>&mdash; Richard Gee (@rgee0) <a href="https://twitter.com/rgee0/status/857671006156148736">April 27, 2017</a></blockquote> <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

* Need to run Windows-native executables? That's supported in a mixed-OS Docker Swarm.

<blockquote class="twitter-tweet" data-lang="en-gb"><p lang="en" dir="ltr">Woot. <a href="https://twitter.com/hashtag/DockerCaptain?src=hash">#DockerCaptain</a> <a href="https://twitter.com/alexellisuk">@alexellisuk</a>’s Faas is working in cross-platform Linux + Windows swarm<a href="https://t.co/D0FXHKjBmS">https://t.co/D0FXHKjBmS</a> <a href="https://t.co/QTTGolBWMI">pic.twitter.com/QTTGolBWMI</a></p>&mdash; Stefan Scherer (@stefscherer) <a href="https://twitter.com/stefscherer/status/860484247123095552">5 May 2017</a></blockquote> <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

A step-by-step example is available in the [FaaS test-drive](https://github.com/alexellis/faas/blob/master/TestDrive.md).
 
### Wrapping up

I hope this blog post has given you a flavour of how to put an Alexa skill together for a real-world example. If you'd like to know more about my keynote or how to build an Alexa skill of your own checkout the links below:

* [Dockercon 2017 - Captain's Log](http://blog.alexellis.io/dockercon-2017-captains-log/) - my write-up and debrief of the event and activities, with more on the Cool Hack demos and talk.

* [My YouTube videos on Serverless FaaS](https://www.youtube.com/playlist?list=PLlIapFDp305DiIRhJFNzMuJXoBnzKdtpi)

* [My YouTube playlist of Alexa Skills](https://www.youtube.com/playlist?list=PLlIapFDp305CPJ3dKNb_mh0vqMz865oXT)

> You can also read up on [multi-stage builds here](https://docs.docker.com/engine/userguide/eng-image/multistage-build/).