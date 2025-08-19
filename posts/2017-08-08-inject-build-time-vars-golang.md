---
title: "Inject build-time variables with Golang"
slug: "inject-build-time-vars-golang"
date: "2017-08-08T07:30:00Z"
author: "Alex Ellis"
meta_title: "Inject build-time variables with Golang"
meta_description: "In this blog post I'll show you how to inject variables into your Golang executable at build-time such as a Git Commit digest, then automate it with Docker"
feature_image: "/content/images/2017/08/pexels-photo-249580_crop.jpg"
tags:
  - "golang"
  - "golang-basics"
  - "docker"
---

In this blog post I'm going to show you how to inject variables into your [Golang](https://blog.alexellis.io/tag/golang/) executable at build-time. This is most useful for tagging your binary with a version or Git shasum or digest from version control.

> You may also like my new ebook - [Everyday Golang](https://gumroad.com/l/everyday-golang) which is full of practical examples and tips from open-source Go applications including JSON, HTTP servers, embedding, databases, templates and Goroutines.


Here's an example where the Docker project's CLI contains a commit ID of `77b4dce`:

```
$ docker version
Client:
 Version:      17.06.1-ce-rc1
 API version:  1.30
 Go version:   go1.8.3
 Git commit:   77b4dce
 Built:        Fri Jul 14 07:38:15 2017
 OS/Arch:      darwin/amd64
```

**Why add versioning information?**

This is a great way to support your users - you can quickly and easily identify which build they are using and how old it could be.

### Capture useful variable(s)

Before you get started, think about what makes sense to be injected at build-time? It could be anything from the hostname of the CI machine to the result of a web-service call or more commonly the last commit ID from your Git log.

Let's use the last Git commit id. 

Create a test Git project with a README

```
$ mkdir /tmp/git-tester && \
 cd /tmp/git-tester && \
 git init && \
 echo "Let's work with Git" > README && \
 git add . && \
 git commit -m "Initial" && \ 
 echo "Let's keep working" >> README && \
 git add . && \
 git commit -m "First update"
```

You'll now see two commits in your Git log:

```
$ git log
commit 67b05a31758848e1e5237ad5ae1dc11c22d4e71e
Author: Alex Ellis <alexellis2@gmail.com>
Date:   Tue Aug 8 08:37:20 2017 +0100

    First update

commit 9b906b6d02d803111250a974ed8042c4760cde7f
Author: Alex Ellis <alexellis2@gmail.com>
Date:   Tue Aug 8 08:37:20 2017 +0100

    Initial
```

Here's how you find the ID of your last commit:

```
$ git rev-list -1 HEAD
67b05a31758848e1e5237ad5ae1dc11c22d4e71e
```

Next we can capture that into an environmental variable:


```
$ export GIT_COMMIT=$(git rev-list -1 HEAD) && \
  echo $GIT_COMMIT

67b05a31758848e1e5237ad5ae1dc11c22d4e71e
```

### Prepare your code

Let's take hello world:

```
package main

import (
        "fmt"
)

func main() {
        fmt.Println("Hello world")
}
```

In order to pass a build-time variable we need to create a variable within our main package. We'll call it `var GitCommmit string`.

```
package main


import (
        "fmt"
)

var GitCommit string

func main() {
        fmt.Printf("Hello world, version: %s\n", GitCommit)
}
```

Test it out with `go build`:

```
$ go build && \
  ./git-tester 
Hello world, version: 
```

The version is empty, but we're now ready to start injecting a variable.

### Override `go build`

Now we need an additional override to our `go build` command to pass information to the linker via the `-ldflags` flag.

```
$ export GIT_COMMIT=$(git rev-list -1 HEAD) && \
  go build -ldflags "-X main.GitCommit=$GIT_COMMIT"
```

Now we see our application has a hard-coded version which we injected at build-time.

```
$ ./git-tester
Hello world, version: 67b05a31758848e1e5237ad5ae1dc11c22d4e71e
```

### Do it with Docker

Once you have worked out your build-time variables it's likely you will want to update your Dockerfile.

Write a Dockerfile:

```
FROM golang:1.7.5

WORKDIR /go/src/github.com/alexellis/git-tester
COPY .git     .
COPY app.go   .

RUN GIT_COMMIT=$(git rev-list -1 HEAD) && \
  go build -ldflags "-X main.GitCommit=$GIT_COMMIT"

CMD ["./git-tester"]
```
*Dockerfile*

Run a build and then test it out:

```
$ docker build -t git-tester .
$ docker run git-tester
Hello world, version: 67b05a31758848e1e5237ad5ae1dc11c22d4e71e
```

Now this is just a minimal example to show you how to get started with Docker and Go build-time variables. You can take it further and optimize the size of the Docker image by using [Multi-stage builds](https://blog.alexellis.io/mutli-stage-docker-builds/).

Here's an example of one of my Dockerfiles which builds a Golang application for a Raspberry Pi, MacOS and 64-bit Linux all in one file using multi-stage builds:

* [FaaS CLI Dockerfile](https://github.com/alexellis/faas-cli/blob/master/Dockerfile.redist)

### Wrapping up

If you enjoyed this blog post check out the rest of my Golang fundamentals series:

* [Golang - writing unit tests](https://blog.alexellis.io/golang-writing-unit-tests/)

* [Golang - fetch JSON from an API](https://blog.alexellis.io/golang-json-api-client/)

* [Serverless by use-case: Alexa skill for Dockercon
](https://blog.alexellis.io/serverless-alexa-skill-mobymingle/)

For an example of `-ldflags` in action - checkout the [CLI](https://github.com/alexellis/faas-cli) for my project [Functions as a Service (FaaS)](https://github.com/alexellis/faas). It's an easy-to-use framework for building serverless applications with containers.