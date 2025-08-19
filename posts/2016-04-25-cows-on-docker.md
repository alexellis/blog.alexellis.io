---
title: "Docker Fun with 400 ASCII Cows"
slug: "cows-on-docker"
date: "2016-04-25T08:29:37Z"
author: "Alex Ellis"
tags:
  - "fun"
  - "linux"
  - "github"
  - "node.js"
  - "docker"
---

My colleague turned to me and said:
> "There is a whole npm module that just shows cow ASCIIs..."

At that point we knew there was only one way forward..

#### The easy way 

Late Sunday evening I started doing things the easy way:

* I forked the repository to [alexellis/cows](https://github.com/alexellis/cows-docker)
* Added an `ENTRYPOINT` instruction and short .js file to select a *cow by number* so it made sense inside a container. 
* Added Dockerfile deriving from `alpine` linux
* Raised the Pull Request (PR) to merge to the 'cows' repository

At this point the PR would normally be approved from the repository owner with a thumbs up and I'd get a few people I knew to test it out. But my PR was rejected - I think there's a certain elegance of having a one file / 5 line repository on Github and the author wanted to keep that going.

#### Plan B

The repository owner suggested creating a brand new Github repository and hosting the Dockerfile on its own there. Here's what I did:

* I renamed the fork to `cows-docker`
* Altered the `package.json` so I could push to npm under the new name
* Added myself to the MIT license files and made references to the original project
* Built and pushed the image to `alexellis2/cows` on the [Docker hub](https://hub.docker.com/r/alexellis2/cows/). Adding a title and description through their webpage.
* Pushed a module named `showcows` to npm
* Did a final `git push` to [alexellis/cows-docker](https://github.com/alexellis/cows-docker)


#### Check it out

**With Docker**

If you don't have Docker already then head over to the official [Getting Started](https://docs.docker.com/mac/) page, otherwise `docker run` will automatically pull it from the [online Hub](https://hub.docker.com/r/alexellis2/cows/).

```
$ docker run alexellis2/cows 423
            (__)
         ___(oo)
       /-    --\/
      / |     ||
     *  ||___-||
        ^^    ^^
     Freshman Cow
After the "Freshman 15"
```

Or as suggested by *Daniel* in the comments, below.. watch Cow ASCII TV with the following neat Bash loop:

```
for i in {1..423}; do docker run --rm alexellis2/cows $i; done
```

I've added the `--rm` option to make sure each container is deleted after it exits. 

**Without Docker**

```
$ npm install --save showcows
$ var cows = require('showcows');
$ console.log(cows(1))

(__)
(__)           (oo)
(oo)     __ ___\/
-\/    /|      |
| |   * |__ ___|
| |        ||
---        --
Cow Computer
```

#### Want to learn Docker?

> Check out my tutorial [Hands-On Docker](http://blog.alexellis.io/handsondocker/)

> ..a self-paced and progressive means to learn the essentials of Docker.. written as a series of practical labs..

#### TL;DR

```
$ docker run alexellis2/cows 423
```
```
            (__)
         ___(oo)
       /-    --\/
      / |     ||
     *  ||___-||
        ^^    ^^
     Freshman Cow
After the "Freshman 15"
```

> Github: [alexellis/cows](https://github.com/alexellis/cows-docker)