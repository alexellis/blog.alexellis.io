---
title: "The power of interfaces in OpenFaaS"
slug: "the-power-of-interfaces-openfaas"
date: "2019-05-28T11:11:39Z"
author: "Alex Ellis"
meta_title: "The power of interfaces in OpenFaaS"
meta_description: "Explore OpenFaaS extensibility with Alex Ellis, the project founder and creator. Learn about the provider model and faas-cli generate command."
feature_image: "/content/images/2019/05/adventure-alpine-climb-869258-c.jpg"
tags:
  - "openfaas"
  - "serverless"
  - "faas"
  - "srp"
  - "golang"
  - "go"
  - "api"
  - "rest"
---

In this post I'll explore how I was able to introduce the idea of interfaces to OpenFaaS to allow the project to adapt with the changing container landscape. You'll learn how to extend OpenFaaS through the *provider model* and faas-provider SDK. I'll then walk you through why we built the `faas-cli generate` command, what it does, and how you can use it to generate CRDs for Kubernetes.

## Introduction to the OpenFaaS Architecture

In the beginning, there was OpenFaaS, and OpenFaaS ran [on Docker Swarm](https://github.com/openfaas/faas-swarm).

Four months later a need arose to also target a container orchestration platform named Kubernetes, which was growing in traction and industry adoption. Looking back, it's hard to imagine that [Kubernetes](https://kubernetes.io/) was not always *the winner* of the [container wars](https://redmonk.com/jgovernor/2018/05/25/kubernetes-won-so-now-what/).

At the time, the OpenFaaS gateway and [Swarm](https://github.com/openfaas/faas-swarm) implementation of the API interface were tightly coupled.

![provider](/content/images/2019/05/provider-1.png)

*Provider model*

So I split the existing REST API of the OpenFaaS gateway into three components - a gateway, a provider interface and [faas-swarm](https://github.com/openfaas/faas-swarm). The idea was that a provider could target any container orchestrator and understand how to do CRUD, scaling and invoke without *changing the interface* or tooling. This meant that the gateway component didn't need to get bloated-up with big dependencies like those in the Kubernetes client-go package and it meant that we could follow [Single Responsibility Principle](https://en.wikipedia.org/wiki/Single_responsibility_principle) (SRP) more closely.

From here on out the [OpenFaaS Gateway](https://github.com/openfaas/faas) would only be a middleware for configuration options like auth, tracing and metrics.

### faas-provider

Today, a Golang SDK exists to allow anyone to bootstrap an OpenFaaS provider - you just fill in the "http.Handler" functions, which simplifies the whole experience. 

> A team lead by Alex Boten at OpenDNS, created their [own OpenFaaS provider in less than 24 hours](https://medium.com/@codeboten/faas-tastic-implementing-the-openfaas-provider-in-24-hours-5a1f1f2f0461).

#### faas-memory

Here's an example of the in-memory provider made by Edward Wilde.

```go
import (
	bootstrap "github.com/openfaas/faas-provider"
	bootTypes "github.com/openfaas/faas-provider/types"
)

func main() {

	bootstrapHandlers := bootTypes.FaaSHandlers{
		FunctionProxy:  handlers.MakeProxy(),
		DeleteHandler:  handlers.MakeDeleteHandler(),
		DeployHandler:  handlers.MakeDeployHandler(),
		FunctionReader: handlers.MakeFunctionReader(),
		ReplicaReader:  handlers.MakeReplicaReader(),
		ReplicaUpdater: handlers.MakeReplicaUpdater(),
		UpdateHandler:  handlers.MakeUpdateHandler(),
		HealthHandler:  handlers.MakeHealthHandler(),
		InfoHandler:    handlers.MakeInfoHandler(version.BuildVersion(), version.GitCommitSHA),
	}

	readConfig := types.ReadConfig{}
	osEnv := types.OsEnv{}
	cfg := readConfig.Read(osEnv)

	bootstrapConfig := bootTypes.FaaSConfig{
		ReadTimeout:     cfg.ReadTimeout,
		WriteTimeout:    cfg.WriteTimeout,
		TCPPort:         &cfg.Port,
		EnableHealth:    true,
		EnableBasicAuth: false,
	}

	log.Infof("listening on port %d ...", cfg.Port)
	bootstrap.Serve(&bootstrapHandlers, &bootstrapConfig)
}
```

You can see that we effectively set up our handlers in the `bootTypes.FaaSHandlers` struct and then run `bootstrap.Serve` to start up the provider.

By following the provider model, any container orchestrator or other system such as an in-memory store can be targetted and the whole OpenFaaS ecosystem remains available and compatible.

#### Keeping compliant

To keep providers compliant, we introduced the [certifier project](https://github.com/openfaas/certifier) which runs at build-time for the Swarm and Kubernetes providers to make sure they support the API interface.

When [Nic Jackson](https://twitter.com/sheriffjackson) from Hashicorp started the [faas-nomad](https://github.com/hashicorp/faas-nomad) provider, he used this tool to do a kind of test-driven development.

## An exception to the rule: Operators and CRDs

At KubeCon, Austin in 2017 [Stefan Prodan](https://github.com/stefanprodan) and I were discussing the merits of rebuilding our Kubernetes provider called [faas-netes](https://github.com/openfaas/faas-netes), as an Operator with its own CRD named `Function`.

Shortly after that Stefan put together a working Operator using the code from the faas-netes controller, it worked and it now means that users have a choice. They could use the REST API or the CRD, in fact they could use both. The REST API created CRD entries.

We already had an eco-system of OpenFaaS providers and back-ends for different container orchestrators such as: Docker Swarm, Kubernetes, [AWS Fargate](https://github.com/ewilde/faas-fargate) and [Hashicorp Nomad](https://github.com/hashicorp/faas-nomad). This meant that we now had two orthogonal ways to deploy functions in OpenFaaS.

All the existing providers used the stack.yml file and REST API, but the [OpenFaaS Operator](https://github.com/openfaas-incubator/openfaas-operator) now had a CRD in addition to that.

## Enter `faas-cli generate`

I raised the following proposal: [Feature: Generate Kubernetes CRD YAML files via CLI](https://github.com/openfaas/faas-cli/issues/426).

![create-crd](/content/images/2019/05/create-crd.png)

Imagine we have a function called `webhook-responder` which receives HTTP messages and then sends a message to an *incoming webhook URL* in Slack.

It would look like this, and because of our faas-provider interface, we can deploy it to any compliant OpenFaaS provider.

```yaml
provider:
  name: openfaas
  gateway: http://127.0.0.1:8080

functions:
  webhook-responder:
    lang: go
    handler: ./webhook-responder
    image: alexellisuk/webhook-responder:latest
    environment:
      write_debug: true
    secrets:
     - webhook-token
     - slack-incoming-url
```
*stack.yml*

We can deploy this function with `faas-cli deploy` or `faas-cli up`.

For Kubernetes operators and developers, using a REST API provides some value, but at heart, we prefer our favourite tool named `kubectl`. The `kubectl` tool allows for native Kubernetes policies and a deep integration into RBAC and other tooling.

The solution I proposed was to create a `generate` command which would take a stack.yml file as input and then generate a CRD. Here's what it looks like in action:

```sh
$ faas-cli generate
# or
$ faas-cli generate --api=openfaas.com/v1alpha2
```

> Note: you can run `faas-cli generate --help` for more options.

```yaml
---
apiVersion: openfaas.com/v1alpha2
kind: Function
metadata:
  name: webhook-responder
  namespace: openfaas-fn
spec:
  name: webhook-responder
  image: alexellisuk/webhook-responder:latest
  environment:
    write_debug: "true"
  secrets:
  - webhook-token
  - slack-incoming-url
```
*webhook-responder.yaml*

This function can be deployed with: `kubectl apply -f webhook-responder.yaml`.

If you'd like to see how `faas-cli generate` works, then check out the command file here: [generate.go](https://github.com/openfaas/faas-cli/blob/master/commands/generate.go). The original version was written by [Vivek Syngh](https://github.com/viveksyngh) from the community.

### Extending `faas-cli generate` for Knative

In Summer 2018, Google announced a new Serverless project called [Knative](https://knative.dev/). Right away I set about evaluating the new entrant to the already saturated market and found that any function built with OpenFaaS could be deployed, unmodified to their platform.

* [Portability with Knative (gist)](https://gist.github.com/alexellis/5c1587cf24b634f940764427d50719bf)

> The [OpenFaaS Function Store](https://github.com/openfaas/store/) allows the community and end-users to share, discover, and collaborate on functions.

In my gist I showed that functions from the Function Store could be deployed to Knative. This inspired [Michael Hausenblas](https://twitter.com/mhausenblas), developer advocate at RedHat to show the colorise function in [his first Knative blog post](https://itnext.io/as-we-may-kube-293b30c0a365).

![colorise](/content/images/2019/05/colorise.png)

Just before the [Serverless Practioners Summit (SPS)](https://www.openfaas.com/blog/meet-us-at-barcelona/) for [KubeCon Barcelona this year](https://events.linuxfoundation.org/events/kubecon-cloudnativecon-europe-2019/) I set about updating the faas-cli to generate the Knative serving definition.

Pull request: [Add knative serving v1alpha1 to generate CRD command](https://github.com/openfaas/faas-cli/pull/638).

Here's how it works:

```sh
$ faas-cli generate --api=serving.knative.dev/v1alpha1

---
apiVersion: serving.knative.dev/v1alpha1
kind: Service
metadata:
  name: webhook-responder
  namespace: openfaas-fn
spec:
  runLatest:
    configuration:
      revisionTemplate:
        spec:
          container:
            image: alexellisuk/webhook-responder:latest
            env:
            - name: write_debug
              value: "true"
            volumeMounts:
            - name: webhook-token
              mountPath: /var/openfaas/secrets/webhook-token
              readOnly: true
            - name: slack-incoming-url
              mountPath: /var/openfaas/secrets/slack-incoming-url
              readOnly: true
          volumes:
          - name: webhook-token
            secret:
              secretName: webhook-token
          - name: slack-incoming-url
            secret:
              secretName: slack-incoming-url
```

You can even pipe this command to `kubectl apply`, and it even works if the `stack.yml` file contains multiple functions.

```sh
faas-cli generate --api=serving.knative.dev/v1alpha1 | kubectl apply -f -
```

You can search the store like this:

```sh
$ faas-cli store list --verbose
FUNCTION                    DESCRIPTION
Colorization                Turn black and white photos to color ...
Inception                   This is a forked version of the work ...
Have I Been Pwned           The Have I Been Pwned function lets y...
SSL/TLS cert info           Returns SSL/TLS certificate informati...
Face blur by Endre Simo     Blur out faces detected in JPEGs. Inv...
Figlet                      OpenFaaS Figlet image. This repositor...
...
```

Then deploy a function from the store to Knative, such as `figlet`, to generate ASCII logos:

```sh
$ faas-cli generate --api=serving.knative.dev/v1alpha1 --from-store="figlet"
```

## Wrapping up

The OpenFaaS provider model and its REST API has meant that the project can target a wide range of container orchestrators, even proprietary SaaS products like AWS Lambda, without any additional changes to the interface.

The `faas-cli` generate command also offers us a way to integrate deeply into the Kubernetes current and future ecosystem without leaving behind the original design.

> You may be wondering if the OpenFaaS REST API and the CRDs for OpenFaaS on Kubernetes or Knative are orthogonal to each other? This may be the case, but the OpenFaaS Operator shows that we can have the best of both worlds.

This design works because OpenFaaS targets the Docker or OCI-image format and a simple HTTP interface on port 8080. I call this the "Serverless 2.0 runtime contract" or ["a Serverless workload"](https://docs.openfaas.com/reference/workloads/).

![landscape](/content/images/2019/05/landscape.png)
*Serverless 2.0 Landscape*

In a Serverless 2.0 world, you can build your functions in any of the listed template systems, and then run them on any of the chosen serving platforms and listed installable or hosted infrastructure offerings.

My other related work:

* [OpenFaaS Operator and CRD](https://github.com/openfaas-incubator/openfaas-operator)
* [First look at Knative build for OpenFaaS functions](https://blog.alexellis.io/first-look-at-knative-build-for-openfaas-functions/)
* [Run your OpenFaaS Functions on Google Cloud Run for free](https://www.openfaas.com/blog/openfaas-cloudrun/)

### Future work

The mission of OpenFaaS is to: Make Serverless Functions Simple. So the future work as I see it, is to expand the OpenFaaS provider and `CRD` ecosystem, so that the developer experience can be brought to all platforms.

In 2019, our community is doubling-down on the Kubernetes ecosystem targeting: performance, security and enterprise features. We're also going beyond Kubernetes with faas-lambda. Edward Wilde spoke at the SPS event on how he created a faas-provider which deploys to AWS Lambda directly, with no additional modifications to images built for OpenFaaS. Subscribe [to the blog for more](https://www.openfaas.com/blog).

Here's some of the future work for the community, as I see it:

* An OpenFaaS provider which targets the Knative `Service` CRD, it will be called (imaginatively) "faas-knative" and bring the OpenFaaS REST API, CLI, Function Store and UI to Knative users as well as one of the best developer-experiences in Serverless.
* [Darren Shepherd](https://twitter.com/ibuildthecloud), Chief Architect at Rancher has expressed an interest in building an OpenFaaS provider to bring the developer-experience to the new Rancher microPaaS platform named [Rio](https://rancher.com/blog/2019/introducing-rio/)
* A `faas-cli generate --api=services.rio.cattle.io` command for Rio's own `Service` definition to enable experimentation and quick feedback. [See issue](https://github.com/openfaas/faas-cli/issues/640)

### Get involved

With a strong core-team and over 200 contributors, there's never been a better time to get involved with the project. Contributions and feedback are welcomed, along with any other questions or comments you may have.

Not sure how to contribute? [Join Slack](https://docs.openfaas.com/community) and then get up to speed with our latest community video briefing: [How to Contribute, 2019](https://www.youtube.com/watch?time_continue=10&v=kOgHjU38Efg)

> Follow [@alexellisuk](https://twitter.com/alexellisuk) and [@openfaas](https://twitter.com/openfaas) on Twitter.