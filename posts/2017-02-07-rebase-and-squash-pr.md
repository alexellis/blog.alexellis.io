---
title: "Merging an Open-Source Pull Request"
slug: "rebase-and-squash-pr"
date: "2017-02-07T21:34:11Z"
author: "Alex Ellis"
meta_title: "Merging an Open-Source Pull Request with the CLI"
meta_description: "Watch my video where we merge an open-source PR on Github using advanced CLI techniques to provide an alternative to the web-UI or git merge operation."
tags:
  - "github"
  - "golang"
  - "Raspberry PI"
  - "golang basics"
  - "pull request"
  - "git"
  - "merge"
---

I'm going to share a video with you where I merge a PR on Github where I use two more advanced techniques to provide an alternative to a straight `git merge`. Don't miss this if you are going to start maintaining or contributing to an open-source project.

### A new open-source project

A couple of weeks ago I started an open-source project to create a Golang port of the [Pimoroni Blinkt](http://blog.pimoroni.com/blinkt/) library. The [Blinkt](http://blog.pimoroni.com/blinkt/) is a hardware add-on for the Raspberry Pi with 8 RGB LEDs.

My aim for [the Golang library](https://github.com/alexellis/blinkt_go_examples) was to match the Python interface and API as closely as possible and then to port the examples one-by-one. Before sharing the library I wrote two blog posts to help people get started with Golang and the Raspberry Pi:

* [Golang basics - fetch JSON from an API](http://blog.alexellis.io/golang-json-api-client/)

* [Golang and Docker 1.13 on your Raspberry Pi](http://blog.alexellis.io/golang-docker-rpi/)

### The video

> In this video I checkout a pull request from `rgee0`, test the code and then rebase and squash his commits before pushing them back to the master branch on Github.

<iframe width="560" height="315" src="https://www.youtube.com/embed/a2uoVnIHwMk" frameborder="0" allowfullscreen></iframe>

#### Additional notes

I wanted to highlight a few points about merging pull requests on an open-source project:

**Checking out a PR for testing/editing**

Once you have eye-balled a Pull Request on Github you will probably want to pull the code down onto your laptop or device to test it out. In the video we used `git fetch`. Read more on the Github documentation page:

* [Checking out pull requests locally](https://help.github.com/articles/checking-out-pull-requests-locally/)

**Merge vs. rebase**

Using `git rebase` overlays someone else's work over the top of your repository. If you have any pending changes you will need to commit them or stash them away with `git stash` prior to running the command. It saves spamming your log with messages produced by `git merge` like: `Merging branch xyz into master`.

The Github UI has recently added a feature to help maintainers for when squashing and rebasing is not practical for the contributors.

![](/content/images/2017/02/Screen-Shot-2017-02-07-at-21.13.03-1.png)

**Communicating with your contributors**

Contributions to open-source projects could come from anyone, anywhere and at any time - so communication tends to be asynchronous and sporadic. Leaving specific and objective feedback will help with communication as will a paragraph or two on what kind of contributions are wanted.

* Are you looking for specific help? Mention features / roadmap items
* Do you have goals and non-goals? It would be better for someone to know up front whether there vision aligns with yours
* Is there a contribution process? This could be anything from "No contributions wanted" to a paragraph about process or even a separate page with a checklist.
* Mention your project's license - so contributors can check if this is suitable for them.


**Example: Contributing guide**

The [docker/docker](https://github.com/docker/docker/blob/master/CONTRIBUTING.md) project has a detailed set of guidelines. Before a pull request is raised they recommend you first create a  Github issue. By raising an issue before your PR it promotes discussion and increases the visibility of incoming changes.

Check out [Docker's contributing guide](https://github.com/docker/docker/blob/master/CONTRIBUTING.md) for some more info on best practices for using Git to contribute to a large successful project.

#### See also:

* [Golang basics - writing unit tests](http://blog.alexellis.io/golang-writing-unit-tests/)

* [Golang basics - fetch JSON from an API](http://blog.alexellis.io/golang-json-api-client/)

* [Blinkt examples in Golang](https://github.com/alexellis/blinkt_go_examples)