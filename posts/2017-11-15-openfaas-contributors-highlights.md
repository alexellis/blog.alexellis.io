---
title: "OpenFaaS November Contributor Highlights"
slug: "openfaas-contributors-highlights"
date: "2017-11-15T17:50:00Z"
author: "Alex Ellis"
meta_title: "OpenFaaS November Contributor Highlights"
meta_description: "Learn about the best enhancements to OpenFaaS by our community in november including default stack names, proper exit codes and custom language templates"
tags:
  - "docker"
  - "openfaas"
  - "community"
  - "kubernetes"
---

The [OpenFaaS](https://github.com/openfaas/) community has formed and grown rapidly over the past 10 months since I had the idea to create a [Serverless FaaS framework targeting a container orchestrator](https://blog.alexellis.io/functions-as-a-service/) like Docker Swarm or Kubernetes. Many of the new [contributions](https://github.com/openfaas/faas/pulls) we take are around the CLI - my take is that the [CLI](https://github.com/openfaas/faas-cli/pulls) is the first experience of OpenFaaS for developers so it's where they want to contribute.

Here's three community contributor highlights from the past month which really brought value to our users.

> You can download our CLI via `brew` on Mac or on Linux or Windows using the [instructions here](https://github.com/openfaas/faas-cli).

## 1. Non-zero exit codes upon error

This contribution was from a first-time contributor - Tommy and helps us with scripting, automation and CI. The early versions of the CLI returned a zero exit code for every action whether it worked out fine or errored. Tommy fixed that but it was the ground-work by John Mccabe porting from Go's flags library to Cobra which enabled the work.

Here's an example:

```
$ faas-cli new --lang python ; echo $?
Please provide a name for the function
1
```

Previously this would have ended up saying Exit Code 0, not Exit Code 1. So scripting would have been harder.

[CLI PR 207](https://github.com/openfaas/faas-cli/pull/207)

## 2. Community Templates

The community templates PR is part of a design compromise. As the project maintainer I didn't want to have to personally support exotic or esoteric language templates in the OpenFaaS Issue tracker or GitHub repository - so as a group we came up with a solution.

> [Eric Stoekl](https://twitter.com/ericstoekl) and [Minh (itscaro)](https://github.com/itscaro) worked on this together with Eric being in Seattle and Minh in Central Europe. That's more than a nine hour time-zone difference!

By default you get shipped templates which we will support and maintain as a group, but at any point you can extend this and add your own template by running a single command and hosting the template on GitHub.

You can view available templates with `faas-cli new --list`.

Pull in new templates with `faas-cli template pull`. 

Here's an example with Eric's [Rust template](https://github.com/ericstoekl/faas-custom-templates).

```
faas-cli template pull https://github.com/ericstoekl/faas-custom-templates
Fetch templates from repository: https://github.com/ericstoekl/faas-custom-templates

Fetched 2 template(s) : [bash rust] 
```

I can now create a Rust function. How cool is that?

```
$ faas-cli new --lang rust thankseric
Folder: thankseric created.

Function created in folder: thankseric
Stack file written: thankseric.yml

$ cat thankseric/handler.rs 

pub fn handler(msg: String) {
    println!("From handler, we have: {}", msg);
}
```

[CLI PR 201](https://github.com/openfaas/faas-cli/pull/201)

## 3. Default stack names

We had [David Wells](https://github.com/DavidWells) from Serverless Inc join our community to help us work on an integration with the [Serverless Inc CLI](https://github.com/openfaas/serverless-openfaas). While there he remarked on how cool it was to be able to specify the name of the YAML file used for functions.

For instance:

```
faas-cli build -f stack1.yml
faas-cli build -f my-cloud.yml
```

At the same time others suggested that we could make the UX more concise if we offered the ability to use a default name for YAML files.

[Nic Jackson from Hashicorp](https://twitter.com/sheriffjackson) stepped up and wrote the PR for this and it was shipped in our latest release.

You can now do this!

```
faas-cli build
faas-cli push
faas-cli deploy
```

> Look ma' no YAML arguments!

[CLI PR 126](https://github.com/openfaas/faas-cli/pull/126)

## 4. Basic auth

We also had a very useful addition from [Stefan Prodan](https://twitter.com/stefanprodan) who works at [WeaveWorks](https://twitter.com/weaveworks). Stefan has been evaluating OpenFaaS for use with Weave Cloud on GCP and found that after enabling Basic Auth for his API Gateway, he had to pass plaintext passwords through to the CLI. For example:

```
faas-cli list --gateway http://user:password@remote:8080/
```

Stefan added a `faas-cli login` and `faas-cli logout` command which works in the same way as the Docker CLI storing encrypted hashes in a `$HOME/.openfaas` directory. That means no-more passwords on command-lines and no reasons not to enable basic auth as a first line of defense for public cluster.


Try it out like this:

```
$ faas-cli login --gateway http://remote.site:8080 -u admin --password-stdin
```

You can then use all the `faas-cli` commands while authenticated.

[PR 182](https://github.com/openfaas/faas-cli/pull/182)

**Remember: that you absolutely must lock down OpenFaaS or any other application for use on the public internet.**

[Post: Lock-down OpenFaaS for the public Internet](https://blog.alexellis.io/lock-down-openfaas/)

### Thank-you to the community

I wanted to thank Tommy, Eric, Minh, John and Nic especially in this post. They didn't work alone though and dozens of others tested, reviewed and shaped these contributions.

## Get involved

If you'd like to get involved or to join the Slack community - here are a few practical suggestions you can do today:

* [Star our GitHub repo](https://github.com/openfaas/faas) - we have over 7k stars now, but have a target to reach 10k by the end of the year.

### Share 

We had three people speak around the world on OpenFaaS yesterday including Paris, Australia and Finland. I only found out about this after checking the Twitter account for OpenFaaS.

* Share about OpenFaaS at work, at a meet-up or a conference and we'll help you promote the event

* Write a blog about your experiences, functions or ideas and send it over to our [community file](https://github.com/openfaas/faas/blob/master/community.md).

### Join

If you'd like to join Slack and start contributing email a short intro to alex@openfaas.com

You can also order your own OpenFaaS swag with free credits from StickerMule using our [Press-Kit and media here.](https://github.com/openfaas/media)