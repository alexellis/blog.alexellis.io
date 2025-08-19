---
title: "learnyounode in Docker"
slug: "learnyounode-in-a-docker-container"
date: "2015-11-01T15:22:55Z"
author: "Alex Ellis"
tags:
  - "docker"
  - "nodejs"
  - "learnyounode"
---

I was introduced to *learnyounode* a few months ago by a colleague and I've been coming back to it ever since.

**Update:**

>learnyounode in Docker is now featured in my Hands-on Docker tutorial and has been downloaded by 133 people. Check it out:

> [Hands-on Docker](http://blog.alexellis.io/dockerlabs/)

It is an interactive command line utility for learning node.js/javascript which comes with practically everything you should need to complete the exercises. One command gives a list of exercises, another gives the instructions and *verify* lets you run your solution against a range of inputs and outputs. Its name sounds like an internet meme and that is because it's a reference to a book on Erlang called _Learn you some Erlang for great good_. 

The material can be used to run a day-long workshop without almost no additional overhead or preparation. It is similar to a set of labs or tutorials if you have ever taken a computer Science course.

I helped to run three sessions with various groups of colleagues and really enjoyed seeing the exercises being approached in different ways. In-house the main stack is .NET so when the exercises started to introduce callbacks and anonymous functions - lots of heads were scratched followed by AH-A moments.

### Enter docker

learnyounode can be installed within minutes on Windows/Mac or Linux. Just install the node.js runtime and then type in `npm install -g learnyounode`. Corporate proxies can make this more difficult as can not being 'Local Admin' in Windows.

I decided to create a docker image that be used to launch `learnyounode` and work through the exercises as if the code was installed on the local machine. It is arguable whether there are any benefits in doing this, but it seemed like a worthy challenge for someone learning how to structure his Dockerfiles.

Initially I set about installing OpenSSH server, git and nano - because then I could effectively spin up a dozen instances of the image each allowing someone to log in from a remote computer, hack a solution with a text editor and then push the changes up to a Github repo. The resulting image had lots of dependencies which didn't have much to do with the course, so I went back to the drawing board and came up with a new Dockerfile with two simple instructions:

* Install nodejs from [nodejs.org](https://nodejs.org/en/) along with npm
* Install learnyounode module
* Run the code
 
I changed the entry point of my image from SSHD to `/usr/local/bin/learnyounode` and fired it up. The blue menu appeared and started asking for keyboard input. That just wasn't going to work - because it still meant using the container interactively.

![](/content/images/2015/11/Screen-Shot-2015-11-01-at-14-52-41.png)

I looked into code of the [official repo](https://github.com/workshopper/learnyounode) to find a way of selecting the exercise non-interactively. It turned out the program creates a .config/learnyounode directory in your home folder. That has a file named config.json with the name of the exercise in capitals as it appears in the menu.

My next step involved redirecting the arguments passed to the container on the command line to a bash script, so I could override the default behaviour. I ended up with this:

* To list all available lessons type in 

`./learnyounode.sh`

* To see the instructions for a lesson: 

`./learnyounode.sh "HELLO WOLRD"`

* To try out your solution save your file as i.e. `ex1.js` and drop it in 
`exercises` then type: 

`./learnyounode.sh "HELLO WORLD" "ex1.js"`

The container was only receiving one argument, even when I passed two in through the command line. I needed to find out whether one or two parameters had been passed in to my script and then call the module in different ways. This is what I used to detect whether one or two parameters had been passed. 

```

#!/bin/bash

if [ -z $1 ];
then
   echo No parameters at all so list the various exercises
else
   echo "At least one parameter, let's show the detail for the course in $2."
fi
```

Learning Bash programming is a useful skill when dealing with (Linux/UNIX)es.. the included man pages probably have all the information and detail I could ever want but when in doubt StackOverflow is almost always much quicker for finding commands. 

The next problem I had was: how to pass in the code so the module could verify it. In retrospect I could have probably used STDIN - but decided to use a Host:Container volume mapping with a command like this: ` $(pwd)/exercises:/home/learn/testcases/`

I do this on the `docker run` command-line rather than in the Dockerfile to make it more portable. pwd takes care of this for us. The container will then be able to look in `/home/learn/testcases` for the javascript code.

### Try it out

The base image is ~~*ubuntu* so it's likely you already have this image in your library~~ is tiny and based on Alpine Linux. It will download very quickly from the hub, so why not try it out or **Star** it for later?

> Github repo: [learnyounode in Docker](https://github.com/alexellis/learnyounodedocker)