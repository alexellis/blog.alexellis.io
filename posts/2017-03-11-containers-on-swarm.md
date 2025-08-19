---
title: "One-shot containers on Docker Swarm"
slug: "containers-on-swarm"
date: "2017-03-11T19:25:08Z"
author: "Alex Ellis"
meta_title: "One-shot containers with Docker Swarm"
meta_description: "We explore use-cases for short-lived containers and one-shot tasks on a Swarm cluster including blueprints to build your own CLI leveraging the Golang API"
tags:
  - "docker"
  - "api"
  - "swarm"
  - "tasks"
  - "golang"
---

In this post we'll look at options for scheduling a one-shot container on Docker Swarm. We'll look at some use-cases, a comparison to legacy Swarm (prior to 1.12) and then move onto some working examples of short-lived containers with Swarm Services.

![](/content/images/2017/03/docker_swarm.png)

Here are some use-cases for short-lived containers on a cluster:

**Use-cases:**

* Processing batch jobs - payrolls, SEO, crawlers
* Sharing out resources across hosts
* CI pipelines and integration/browser tests
* DB migrations
* Backups
* Serverless tasks - map/reduce, functions, etc

All of the above was possible with the previous generation of Docker Swarm which used the Docker Remote API to make a set of daemons (hosts) look like a single one.

An issue was opened on docker/docker on June 23rd 2016 discussing ad-hoc / one-shot tasks on Swarm which provides some additional background. [Issue 23880](https://github.com/docker/docker/issues/23880)

> Today Swarm mode allows users to specify a group of homogenous containers which are meant to be kept running with the docker service CLI. This abstraction, while powerful, may not be the right fit for containers which are intended to eventually terminate or only run periodically. - Nathan Leclaire

I will outline a couple of strategies for running containers which will *eventually terminate* while leveraging the benefits of Swarm Services.

**Example program - SEO analysis**

I've created a small program as an examples which you can use in this tutorial. Given a URL it will fetch a HTML page and provide the count of anchor tags to the internal site (self-referring) or external sites. This could used to create a rudimentary SEO score for a webpage. It's self-contained and doesn't maintain state and could be run sporadically.

**Docker prior to 1.12**

Using the remote API you could do things like this:

```
$ export DOCKER_HOST=tcp://swarm_ip:2376

$ docker run --name crawler1 -e url=http://blog.alexellis.io -d crawl_site alexellis2/href-counter
```

Providing that at least one of the hosts in the Swarm had alexellis2/href-counter available then it would execute and show up on `docker ps` etc.

**Differences between Remote API and Swarm Mode**

In the legacy version of Swarm containers were scheduled via `docker run` or `docker-compose` and we pointed our CLI to a swarm manager. The way we ran containers can be referred to as *imperative* or ad-hoc This is still a viable option for running the one-shot workloads listed above.

Swarm Mode introduced the concept of Services - these are defined declaratively either through a CLI entry or API request. Instead of asking the daemon to `run` a container - we set the final state we want the Swarm to achieve:

```
$ export DOCKER_HOST=tcp://swarm_ip:2376

$ docker run -p 80:80 nginx
```

Becomes:

```
$ docker service create nginx --publish 80:80 nginx
```

The net effect is a long running web-server daemon via nginx, but there are some key differences such as the way the port 80 is published. In legacy Swarm you would have needed to have known which node had the container scheduled onto it - but with Swarm Mode you can point to any host on port 80 to access the server.

**Running our container as a service**

So there are two primary approaches that can utilise Docker to provide this experience:

* CLI - Through the existing Docker CLI (surprisingly enough)
* API - Via the Docker / Swarm HTTP API

Another option is to create a long running service and to have it receive work via a queue or to host a HTTP server within it. The options below allow you make use of existing container images without alterations.

**Using the Docker CLI**

While declaring the Swarm service there are many different options available. These can be specified in a command line or in a `docker-compose.yml` file to be used via the *stack* feature.

Swarm is designed primarily to apply and maintain a desired state for long-running services. This means that if your container exits a new container will be scheduled with all the same options - we clearly don't want this for a one-shot task.

The option we're looking for is `--restart-policy`:

```
$ docker service create --restart-policy=none --name crawler1 -e url=http://blog.alexellis.io -d crawl_site alexellis2/href-counter
```

So by setting a restart policy of 0, the container will be scheduled somewhere in the swarm as a (task). The container will execute and then when ready - it will exit. If the container fails to start for a valid reason then the restart policy will mean the application code never executes. It would also be ideal if we could immediately return the exit code (if non-zero) and the accompanying log output, too. It does not provide a good user experience. The other question is about the service which is now "cluttering" our list of services on `docker service ls`.

Running one-shot tasks with a specific name is also going to scale - we would be better off using a UUID.

Some bash scripting could probably improve on the experience, but since the Docker project maintains a first-class Golang API it may be a better choice. 

**Scheduling containers by the Docker API**

I wrote a small Golang application (Job as a Service / JaaS) which does the same thing as the CLI, but with some added functionality.

* Creates desired service with a restart policy of 0 restarts.
* Gets the dynamic ID and ensures the service was created successfully
* Polls the service until it gets a status of 'exited'
* Fetches the containers stdout/stderr logs using an experimental/edge feature called `service logs`.

The JaaS binary can be invoked by `cron` from a Swarm manager. Since we are still creating a regular service we have the opportunity to specify essential options:

* Volumes that need to be mounted
* The network name - if we need to access long running services such as a DB to migrate/back-up
* Access to secure sensitive data or [Swarm secrets](https://docs.docker.com/engine/swarm/secrets/)

**Exploring the Docker API**

If we import the following packages it gives us what we need:

```
import(
     "github.com/docker/docker/api/types"
     "github.com/docker/docker/api/types/filters"
     "github.com/docker/docker/api/types/swarm"
     "github.com/docker/docker/client"
    
     "golang.org/x/net/context"
)
```

This is the simplest way to create a Docker client to talk to the Docker API. Only a manager can create services on a Swarm.

```
	var c *client.Client
	var err error
	c, err = client.NewEnvClient()
```

From here we can interact with the API representing the local Docker node in a similar way to `docker run` or `docker build`. JaaS makes use of the `ServiceCreate/ServiceList` and `TaskList` methods which are attached to `client.Client`.

I won't go into depth here, but here is the general program flow:

```
	spec := makeSpec(image)
	createOptions := types.ServiceCreateOptions{}
	createResponse, _ := c.ServiceCreate(context.Background(), spec, createOptions)
	fmt.Printf("Service created: %s\n", createResponse.ID)

	pollTask(c, createResponse.ID, timeout, showlogs)
```

We create a spec which is Swarm's terminology for a *Service declaration*. 

These lines build up the `ServiceSpec` request setting the restart policy mentioned above:

```
	max := uint64(1)

	spec := swarm.ServiceSpec{
		TaskTemplate: swarm.TaskSpec{
			RestartPolicy: &swarm.RestartPolicy{
				MaxAttempts: &max,
				Condition:   swarm.RestartPolicyConditionNone,
			},
```

We then check that the service was created properly and fetch its ID. After that we poll the task until it results in a completion and then fetch its logs.

Running [JaaS](https://github.com/alexellis/jaas) looks a bit like this:

```
$ jaas -image alexellis2/href-counter:latest --env url=http://blog.alexellis.io/ --showlogs=true

Service created: fervent_bartik (ba0cermll96aqbwu2sma0q7w7)
ID:  ba0cermll96aqbwu2sma0q7w7  Update at:  2017-03-11 18:04:00.404841013 +0000 UTC
...........

Printing service logs
Exit code: 0
State: complete

?2017-03-11T18:04:05.383172605Z com.docker.swarm.node.id=6ehcqb287l63v3oan4ybai7i9,com.docker.swarm.service.id=ba0cermll96aqbwu2sma0q7w7,com.docker.swarm.task.id=xb6lgthlnuozs3qvpqnwi01oo

{"internal":9,"external":5}
```

I didn't want to take the name of the CLI too seriously here and you have to be careful not to infringe on trademarks by including 'swarm' or 'docker' in the name. My main goal here is to show that tasks can be orchestrated through the Docker API.

The current implementation includes passing in:

* a network
* environmental variables
* image name
* whether to show logs
* an optional timeout value to stop polling

When Swarm emits an event stream it will no longer be necessary to poll the API via the `TaskList` endpoint.

It's also worth thinking about house-keeping and what to do with all the Swarm services after their single task has executed. One approach could be to apply a label and to prune the completed services back based on this criteria. 

> Fork and star the JaaS source-code here:

* [alexellis/jaas](https://github.com/alexellis/jaas)

I'll leave you with a couple of related blog posts. If you have further suggestions for JaaS or one-shot containers get in touch [@alexellisuk](https://twitter.com/alexellisuk) on Twitter:

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">I&#39;ve just published: &quot;One-shot containers on <a href="https://twitter.com/docker">@docker</a> Swarm&quot; exploring the options such as the existing API/CLI <a href="https://t.co/VbtsgnlN1u">https://t.co/VbtsgnlN1u</a></p>&mdash; Alex Ellis (@alexellisuk) <a href="https://twitter.com/alexellisuk/status/840645162355298309">March 11, 2017</a></blockquote> <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

### See also:

**Serverless functions**

Functions as a Service is the next in the evolution and pinning down of what the term *serverless* means. Find out more about FaaS in this blog post: 

* [Functions As a Service](http://blog.alexellis.io/functions-as-a-service/).

**Attachable networks**

Attachable networks can allow regular containers to access Swarm services via `docker run`. For more information on this approach read my blog-post: 

* [Attachable networks and swarm stacks](http://blog.alexellis.io/docker-stacks-attachable-networks/)