---
title: "Get Bash completion on Docker Mac"
slug: "docker-mac-bash-completion"
date: "2016-07-07T21:34:21Z"
author: "Alex Ellis"
meta_title: "Get Bash completion for Docker Mac"
meta_description: "Bash completion lets you auto-complete or auto-suggest what to type in next by hitting tab. Set it up for Docker now with a few quick scripts."
---

I don't know how I've managed without this for so long. *Bash completion* is a kind of plug-in for your terminal that lets you auto-complete or auto-suggest what to type in next by hitting *tab*. 

> Here's the kicker - it works for Docker too after running a few quick scripts.

If you are using a terminal every day then you probably hit tab after every few characters.. like this:

```
$ docker-com[tab]
docker-compose
$ 
```

I use this for laziness, so I get to type less and make fewer mistakes. You also have *bash completion* for when you're not sure what commands are available.

> Do I have bzip? What was it called again?

```
$ bz[tab]
bzcat         bzdiff        bzfgrep       bzip2         bzless
bzcmp         bzegrep       bzgrep        bzip2recover  bzmore
```

#### On to Docker

Now if you're running the Docker Mac beta and you have [brew](https://brew.sh) installed too, then it only takes a few moments. I learned this information by reading all the way to the bottom of the new Docker for Mac getting started page. This little nugget was hidden away there.

> [Docker: Installing bash completion](https://docs.docker.com/docker-for-mac/#/installing-bash-completion)

We will run through the instructions here and show a couple of examples of what it looks like when configured. 

* Set up Bash competition through brew

```
$ brew install bash-completion
$ brew tap homebrew/completions
```

* Update your .bashrc or .bash_profile

This snippet will update your .bashrc file that is executed every time you open a terminal.

> If you don't have a `.bashrc` file already then you may want to use `chmod +x` and to add an extra line at the top of the file `#!/bin/bash`

```
cat >> ~/.bashrc <<EOL
if [ -f $(brew --prefix)/etc/bash_completion ]; then
. $(brew --prefix)/etc/bash_completion
fi
EOL
```

* Add Docker-specific completions

```
cd /usr/local/etc/bash_completion.d
ln -s /Applications/Docker.app/Contents/Resources/etc/docker.bash-completion
ln -s /Applications/Docker.app/Contents/Resources/etc/docker-machine.bash-completion
ln -s /Applications/Docker.app/Contents/Resources/etc/docker-compose.bash-completion
```

#### Profit

Now you can profit from doing things like this:

* Figuring out commands

```
$ docker [tab]
attach   events   info     network  rename   service  unpause
build    exec     inspect  node     restart  start    update
commit   export   kill     pause    rm       stats    version
cp       help     load     port     rmi      stop     volume
create   history  login    ps       run      swarm    wait
daemon   images   logout   pull     save     tag      
diff     import   logs     push     search   top  
```

Having done this myself I saw `docker top` - something brand new for me.

> Display the running processes of a container

* Auto-completing container names

Here I run an *nginx* container and then forget to give it a name.

```
$ docker run -d -P nginx
99b9505c7c18e51b1154e7d95f0e034eac4c9264ff2196501208ffd35644c37c
```

Commands like `docker inspect` or `docker kill` take an ID or name as an input, so if you're new to Docker you would probably copy/paste the whole container ID. Fortunately these commands also work with a few unique characters like below:

> **99b9**505c7c18e51b1154e7d95f0e034eac4c9264ff2196501208f**fd3564**4c37c

```
$ docker inspect 99b9
$ docker inspect fd3564
```

For when you want to be *explicit* about naming then tab-completion helps you out and will attempt to finish off the name or ID you started typing in.

Here I type just the first letter and hit tab. This even works with some of the *crazy* automatically generated container names that Docker can create. 

```
$ docker inspect 9[tab]
$ docker inspect 99b9505c7c18e51b1154e7d95f0e034eac4c9264ff2196501208ffd35644c37c 
```

Using names:

```
$ docker rm -f goof[tab]
$ docker rm -f goofy_curie
```

So I hope you found this useful - and I'm sure there are lots more ways you can take advantage of this. If you have more hints and hacks for completion let me know in the comments.

##### See also - swarm mode:

In Docker 1.12RC we get a native, built-in orchestration model called *Swarm Mode*. Check out my quick tutorials below:

> [Getting started with Swarm Mode](http://blog.alexellis.io/tag/swarmmode/)