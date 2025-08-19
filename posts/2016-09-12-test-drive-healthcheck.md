---
title: "Test-drive Docker Healthcheck in 10 minutes"
slug: "test-drive-healthcheck"
date: "2016-09-12T20:47:30Z"
author: "Alex Ellis"
meta_title: "Test-drive Docker Healthcheck in 10 mins"
meta_description: "Did you know a container can check its own health? Let's break things as we get hands-on for 10 miutes and use failure injection with HEALTHCHECK CMD"
tags:
  - "swarm"
  - "healthcheck"
  - "swarmmode"
  - "docker"
---

Did you know that your Docker container can check-in on itself and let you know whether it's still functioning as expected? Did you know that Swarm Mode can automate the check?

If you (like me) have heard of the `HEALTHCHECK CMD` but haven't had time to try it out yet, then here's your chance.

### We're going to break things

This is not a tutorial which only explains the syntax of the CLI or what a happy path looks like - you can get that from the docs. Let's get hands-on for the next 10 minutes and as we bake a healthcheck into a microservice then inject failure and watch what happens.

![The IT Crowd](/content/images/2016/09/dont-worry-ive-sent-an-email-about-it.png)

First, let's see what the docs have to say:

> The HEALTHCHECK instruction tells Docker how to test a container to check that it is still working. This can detect cases such as a web server that is stuck in an infinite loop and unable to handle new connections, even though the server process is still running.

*- [Docker Engine documentation](https://docs.docker.com/engine/reference/builder/#/healthcheck)*

### Over the next 10 mins we'll:

* Build a microservice, with a back-door to inject failure
* Bake-in `curl` as an extra layer in our image for accessing that service
* Add the HEALTHCHECK CMD
 * See that our container is healthly
* Then we'll add the failure point
 * And check back on the health of the container

### Build a microservice

Turns out I already wrote a microservice written in Node.js that can generate UUIDs for a [Swarm Mode tutorial](http://blog.alexellis.io/microservice-swarm-mode/). We'll start with that and add the back-door, `curl` and `HEALTHCHECK CMD`

We'll start with the following project [mkguid](https://github.com/alexellis/swarmmode-tests/tree/master/mkguid/) and when we're done we'll end up with [mkguid_tester](https://github.com/alexellis/swarmmode-tests/tree/master/mkguid_tester/).

### Bake-in `curl`

Clone the repo and start editing the `Dockerfile`, add `curl` as an additional layer. We need this inside the container so that the container can check itself for a 200 response at runtime. 

Edit the `Dockerfile`:

```
RUN apk --update add curl
```

### Add a Healthcheck instruction

The health check entry lives in the Dockerfile and will execute a command checking for the exit code.

```
HEALTHCHECK CMD curl --fail http://localhost:9000/guid/ || exit 1
```

> The exit code has to be binary, which means `0` or `1` - any other value is not supported. The code `|| exit 1` makes sure we only get a binary exit code and nothing more exotic.

You're now good to go, so let's build the image and then run it up.

```
$ docker build -t mkguid_tester .
$ docker run --name tester -d -p 9000:9000 mkguid_tester 
```

### Are we healthy then?

So now the container is up and running and it feels exactly like normal. How do we check if we're healthy?

One way is to use `docker inspect`:

```
$ docker inspect --format "{{json .State.Health }}" tester

{"Status":"running","Running":true,"Paused":false,"Restarting":false,"OOMKilled":false,"Dead":false,"Pid":3152,"ExitCode":0,"Error":"","StartedAt":"2016-09-12T18:35:34.61873069Z","FinishedAt":"0001-01-01T00:00:00Z","Health":{"Status":"healthy","FailingStreak":0,"Log":[{"Start":"2016-09-12T18:36:04.663837798Z","End":"2016-09-12T18:36:04.799573072Z","ExitCode":0,"Output":"{\"guid\":\"dddef8b0-e7a5-44eb-a800-d190d4059f0f\",\"container\":\"c671d9a6bb8f\"}"}]}}
```

### Bake in the back-door

Patch the app.js file like this:

```

let state = {
    generateFailure: false
};

app.get("/guid", (req, res) => {
    if(state.generateFailure) {
        return res.status(500).end();
    }
    res.json({ "guid": uuid.v4(), "container": hostname });
});

app.post("/toggle.failure", (req, res) => {
    state.generateFailure = !state.generateFailure;  
    res.status(200).end();
});
```

It will keep some global state to check whether our failing state is activated.

### Inject failure

So how do you inject this failure? Well as far as `curl` is concerned, just return a HTTP 500 error code - or nothing at all and let the client's request timeout.

Restart & rebuild:

```
$ docker build -t mkguid_tester .
$ docker rm -f tester
$ docker run --name tester -d -p 9000:9000 mkguid_tester 
```

Let's activate that back door:

```
$ curl -X POST localhost:9000/toggle.failure
```

Now watch the output of our `docker inspect` command, before long you will see the `FailingStreak` increase from `0` to `1` and so on.

> The JSON output from this command could be prettified with a tool like [jq](https://stedolan.github.io/jq/) or even piped into a separate application.

### What next?

The next step is for you to find the best way to health-check your containers. The documentation for `HEALTHCHECK CMD` has more detail if you want to dig deeper:

* [Docker Reference: Engine](https://docs.docker.com/engine/reference/builder/#/healthcheck)

In a follow-up post we'll look at how self-healing works in a swarm where containers have a healthcheck command.

### See Also:

* [My Swarm Mode tutorials](http://blog.alexellis.io/tag/swarmmode/)

* [Use Docker to follow all the Docker Captains](http://blog.alexellis.io/follow-all-captains/)

* [Get Bash completion on Docker Mac](http://blog.alexellis.io/docker-mac-bash-completion/)