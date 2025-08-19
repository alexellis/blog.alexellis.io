---
title: "Node.js vs Bash"
slug: "april-1st-node-js-vs-bash"
date: "2016-04-08T22:01:01Z"
author: "Alex Ellis"
meta_title: "The competitors: Node.js vs. Bash"
meta_description: "On April 1st the Raspberry Pi foundation unleashed a challenge: find all the servers. Node.js and Bash went head-to-head and here's what happened."
tags:
  - "node.js"
  - "coding"
  - "Raspberry PI"
  - "bash"
  - "linux"
---

On April 1st the Raspberry PI foundation published a blog post [The little computer that could](https://www.raspberrypi.org/blog/the-little-computer-that-could/) where they described in detail how Raspberry PI Model 3s were now serving all the traffic for the site.

#### The challenge

There were an unspecified number of PIs each hidden behind a load-balancer. 

>The first person to tweet all the hex identifiers to Mythic Beasts wins absolutely nothing other than the respect of the Raspberry Pi community.

Each web request would give away a clue to its hex identifier through an additional property in the HTTP header when fetched (X-Served-By).

With the challenge set in place, I opened a text editor (Atom) and started typing in some code in Node.js.

```
var request = require('request')
var async = require('async')
```

Without realising I'd decided to solve the problem with the programming language I was currently using on a daily basis.

#### Node.js solution #1

<script src="https://gist.github.com/alexellis/571f47491a91894f50b2ac58e298fd2c.js"></script>

I posted this solution into the comments along with the results.. They were:

```
Raspberry Pi a
Raspberry Pi e
Raspberry Pi 6
Raspberry Pi 12
Raspberry Pi 1a
Raspberry Pi 2
Raspberry Pi 16
Raspberry Pi 1e
```

Pros:

* `async.while()` gives a clean way to solve the problem of running asynchronous loops.
* node.js is highly portable running on Windows, Linux 64-bit, ARM v6 and v7 with many binaries available
* Uses only one process/thread
* Easy to extend for timing or additional logic

Cons:

* Async is hard to understand, especially without having been exposed to it
* Callbacks are kind of verbose too
* Runs to infinity.. Control+C when satisfied.

Do you use Docker? You can run the example through the two scripts *build_docker.sh* and *run_docker.sh* held in the Github repo. Just remember to hit Control + C!

#### Bash solution #1
Then someone posted this, followed up by a comment saying it was 'way nicer' than the node code.

```
for i in {1..100} ; do HEAD -E https://www.raspberrypi.org/ ; done | grep X-Served-By | sort | uniq
```

Pros:

* I have to admit that this code is really concise
* Bash is trendy at the moment with Bash on Windows coming soon
* Human-readable pipes like `sort` and `uniq`

Cons:

* Lack of portability
 * Does not run on a Raspberry PI.. well only if you run Raspbian. `HEAD` is a command available in a Perl package that needs to be fetched separately
 * Doesn't work on vanilla Mac OS
 * Doesn't work on vanilla Windows
* Creates 100 processes!!
* Still leaves in the text "X-Served-By

#### Bash solution #2

I had a Mac to hand so I wondered if I could convert the code to run through curl easily.

`HEAD` became `curl` and portable to Git for Windows and Mac OS.

```
curl -s -I https://www.raspberrypi.org/
```

I then used the `cut` command to select all the text to the right of the `:` symbol. The separator is defined with `-d":"` and `-f 2` means (field) 2.

```
for i in {1..100} ; do curl -s -I https://www.raspberrypi.org/ ; done | grep X-Served-By | cut -d”:” -f 2 | sort | uniq
```

Pros

* Gives the correct formatted text
* Is true to the original solution
* Much more portable, Raspbian although a wonderful thing is not the only OS being used by developers.

Cons

* Still runs with 100 processes

#### What would you do?

Can you suggest a way of doing this in pure bash without creating so many processes? How about in your favourite programming language?

Head over to [Github](https://github.com/alexellis/xservedbyfinder) and fork the code now. I'll merge in PRs adding your solution to the public repository.

* [xservedbyfinder repo](https://github.com/alexellis/xservedbyfinder)

**Important update:** You may find that running the code results in two VMs being returned instead of the full set. I've also included a fake endpoint in the Github repo. You can test against this without going to the public Internet.

You will find a tiny Node.js web-server in the `fakeendpoint` folder - it will run on port 3000 - i.e. http://localhost:3000/ in a web browser.

```
$ cd fakeendpoint/
$ node app.js 
Listening on port 3000
```