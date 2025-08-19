---
title: "Scale a real microservice with Docker 1.12 Swarm Mode"
slug: "microservice-swarm-mode"
date: "2016-06-22T22:14:46Z"
author: "Alex Ellis"
meta_description: "Create a real microservice and scale it with the new Swarm Mode in Docker 1.12. We will use Node.js to create GUIDs and then scale that out."
tags:
  - "docker"
  - "replicas"
  - "microservices"
  - "swarmmode"
  - "scale"
  - "swarm"
  - "1.12"
---

In the [previous tutorial](http://blog.alexellis.io/docker-swarm-mode-part1/) we used Docker for Mac to create a ping service and scale it up on our single host. In part two we go on step further and build a quick GUID generator and scale that up.

#### GUID generator in Node.js

We will use Node.js which is well suited to a micro service and can be containerised easily.

There is an npm module called `uuid` which will generate GUIDs. Let's use that as the basis of a our restful microservice.

* Create a folder for the code
```
$ mkdir -p swarm-mode-guid/guid
```

* We will need a `package.json` file which is used by Node.js store its dependencies. You can create one through `npm` if Node.js is installed on your host.

> Alternatively run up an instance of the `mhart/alpine-node:4` container and use `npm` without installing Node.js on your host. See the footnotes for an example.

* Create a `package.json` file and register the dependency for *express.js* (a RESTful web-server)
```
$ npm init -y
$ npm i --save uuid express
```

`package.json` will now have a *dependencies* section like this:

```
  "dependencies": {
    "express": "^4.14.0",
    "uuid": "^2.0.2"
  }
```
 
**The program code:**

Now let's create a quick *express.js* app to serve up a guid for any HTTP GET requests coming in at */guid/*. 

*app.js*

```
"use strict"

const express = require('express');
const uuid = require('uuid');
const os = require('os');

let app = express();

let hostname = os.hostname();

app.get("/guid", (req, res) => {
    res.json({ "guid": uuid.v4(), "container": hostname });
});

app.listen(9000, () => {
    console.log("listening on port 9000");
});
```

> The style of JavaScript used here is a hybrid of ES6 and ES5. More details of features supported from ES6 can be [found here](http://node.green).

Now let's create a quick `Dockerfile` and build an image named `swarm-mode-guid`. We are using *Alpine Linux* because of its minimal size.

> Alpine Linux is a core component of Docker for Mac and Windows beta versions.

```
FROM mhart/alpine-node:4
ADD ./package.json ./
RUN npm i
ADD ./app.js ./
EXPOSE 9000

CMD ["node", "./app.js"]
```

We have exposed port `9000` in the Dockerfile which will be used to access the service once deployed.

* Now build an image named `swarm-mode-guid`:

```
$ docker build -t swarm-mode-guid .
```

#### Set up Swarm Mode

We can get our local machine to be a Swarm Manager which can also act as a worker. If we were using multiple hosts we would have one manager and several workers.

Use the following command to initialise the swarm:

```
$ docker swarm init
Swarm initialized: current node (80spdc187zgd55tfb9dpfsqky) is now a manager.
```

At this point we can create a task for the swarm and start our first microservice. While you do not need to name your service - it makes using the CLI easier later on.

```
$ docker service create --publish 9000:9000 --name guid swarm-mode-guid
8ib6nzt6arn931pka0j35rc71
```

> We can bind a specific port on the host with: `--publish 9000:9000`. This is similar to `docker run -p 9000:9000`

We can now check on the service and see it running like this:

```
$ docker service ls
ID            NAME  REPLICAS  IMAGE
86xss7jywvwi  guid  1/1       swarm-mode-guid
```

Let's then access it on our local machine using `curl`. A web-browser would work in the same way.

```
$ curl localhost:9000/guid
{"guid":"27db30bb-eb38-450d-8bd0-81a7babe109d","container":"aeb58d70abc4"}
```

Note that the container name is returned in the JSON package. This will help us see which container is serving up the request after we scale the service up with more replicas.

#### Adding replicas

We can then scale up that service to run with three replicas:

```
$ docker service scale guid=3
guid scaled to 3
```

Now `curl localhost:9000` will use a kind of round-robbin system to load balance between the containers.

```
$ curl localhost:9000/guid
{"guid":"e39ddbf7-de1e-4761-8aa1-678677c73475","container":"4e75097bd1eb"}
$ curl localhost:9000/guid
{"guid":"ed0792b4-a7ec-4cb8-ad18-fb52448c54ee","container":"7588ee8b3c55"}
$ curl localhost:9000/guid
{"guid":"f56bc920-11e1-429d-914a-a6cb3ad5fb67","container":"aeb58d70abc4"}
$ curl localhost:9000/guid
{"guid":"5b73b1cd-7ae8-47e1-9ea6-7f6b0b8b8beb","container":"4e75097bd1eb"}
$ 
```

#### Stopping / removing replicas

If you run `docker kill` against on of the containers it will be terminated but will then restart automatically. This happens because the swarm self-heals itself. You can also reduce the instances of the service all the way to zero without removing the service definition as a whole.

```
$ docker service scale guid=0
guid scaled to 0
```

Or if you are sure you do not need the service anymore you can completely remove it with:

```
$ docker service rm guid
```

#### Next steps

It's now over to you to try this out for one of your own applications. In a third part of this tutorial we will look at how to link the microservice to a `redis` datastore.

> Read more on the Docker [blog](https://blog.docker.com/2016/06/docker-1-12-built-in-orchestration/)

###### Footnotes:

I highly recommend installing Node.js on your host. I cannot think of a reason why this would be undesirable. To generate a `package.json` file without installing Node.js you have two options

* Run `npm init -y` in the container and never add the package.json file to source control. This will cause issues with versioning and tracking changes over time.

* The second option is to run `npm init -y` in a container and then retrieve the result and save it into a file on your host. This script will run a container and save a `package.json` file into `/tmp/guid/`.

```
$ docker run -v /tmp/:/tmp/ mhart/alpine-node:4 mkdir -p /tmp/guid && cd /tmp/guid && npm init -y && npm i --save uuid express && rm -rf node_modules
```