---
title: "Hello dotnet Core RC2"
slug: "instant-dotnet-core-rc2-with-docker"
date: "2016-05-23T21:00:24Z"
author: "Alex Ellis"
meta_title: "Hello dotnet Core RC2: Docker calling"
meta_description: "Say Hello to dotnet Core RC2 through Docker as reviewed by Mano Marks. Explore the new dotnet CLI as we restore, build and run Hello World."
tags:
  - "linux"
  - "dotnet"
  - "dncore"
  - "rc2"
  - "microsoft"
---

On the 16th May 2016 Microsoft released .NET Core RC2 which comes with a brand-new simplified CLI. .NET Core is the regular .NET framework re-thought from the ground up to be cross-platform across Windows, Linux and Mac.

![.NET Foundation](/content/images/2016/05/Logo_DotNet.png)

#### Hello
On release day Docker's [Mano Marks blogged](https://blog.docker.com/2016/05/docker-net-core-clr-rc2/) showing us a .NET Core RC2 application running in Docker while being debugged through Visual Studio. In this post we take a step back and say **Hello** to dotnet Core RC2.

#### You'll need
* [Docker installation](https://docs.docker.com/mac/) (I'm using MacOS)
* A text editor like [VS Code](https://code.visualstudio.com/) or [Atom](https//atom.io/).
* 5-10 minutes

#### Making a start

A DNCore console application needs both a project file (project.json) and an entrypoint (Program.cs). Normally a heavy-weight IDE like Visual Studio 2013/2015 would be needed to create these template files. I'm going to show you a new CLI command:`dotnet new` which feels a lot like `npm init` in the Node.js space.

**Generate the code through `dotnet` cli**

* Make a new directory
* Run the following container making sure you update the `-v` volume mount to match your working directory. This means that whatever files the container creates in `/root/` will automatically be transferred to the host machine.

```
$ mkdir -p hello-dncore/app
$ docker run -v \
 /Users/alex/hello-dncore/app:/root/ \
 -it microsoft/dotnet:latest
```

The `microsoft/dotnet` image will be pulled from the Docker Hub and then started.

* Change directory to `/root/`
* Type in `dotnet new` and exit the container.

```
root@a0b44ebbd8e3:/# cd /root/
root@a0b44ebbd8e3:~# dotnet new
Created new C# project in /root.
root@a0b44ebbd8e3:~# ls
Program.cs  project.json
root@a0b44ebbd8e3:~# exit
```

On your host you will now see the files we need appear in your *app* folder: `Program.cs` and `project.json`.

**Alternative: clone the repository**

If you want to skip that step then you can go ahead and clone a pre-generated repository.

```
$ git clone https://github.com/alexellis/hello-dncore.git
$ ls hello-dncore/app/
Program.cs  project.json
$ 
```

#### Building it

To run the code we need a Dockerfile.

```
FROM microsoft/dotnet:latest
```
This is the same image as before and contains the ability to both build and run DNCore applications.

```
WORKDIR /root/
```

This image runs as root by default which may be flagged up by container vulnerability scanners. You could also try adding a regular user at this step. From looking at `/etc/issue` the image appears to be based upon *Debian GNU/Linux 8* meaning the `adduser` utility could be used.

```
ADD ./app/ /app/
```

Add the Project.cs file and project.json into the image.

```
RUN dotnet restore
```

This step downloads all the dependencies and libraries required to make your application run. It will output a lot of text and download around half a gigabyte of files.


```
RUN dotnet build
```

At this point we could use `dotnet run` which invokes a build but I've chosen to build beforehand so that the container will start quicker.


```
CMD ["dotnet", "run"]
``` 

And finally we have the entrypoint or CMD to the container itself. This will execute the .NET code which was built in the previous step.

**Here is a summary of the Dockerfile**

```
FROM microsoft/dotnet:latest

WORKDIR /root/
ADD ./app/ ./app/
WORKDIR /root/app/

RUN dotnet restore
RUN dotnet build

CMD ["dotnet", "run"]
```

* Build the docker image

```
docker build -t hello-dotnet .
```

* Run the image:

```
docker run -ti hello-dotnet
```

#### Running it

Now edit `Program.cs` to change the `Console.WriteLine` message. After each edit repeat the `docker build/run` steps.

Here is what I got from my test-run of the container.
```
$ docker run -ti hello-dotnet
Project app (.NETCoreApp,Version=v1.0) was previously compiled. Skipping compilation.
Hello World!
```
*If you want to skip straight to this step you can pull my container from `alexellis2/hello-dotnet`.*

As you may have noticed the `dotnet restore` step takes a while to download everything needed. I found that `dotnet restore` alone added over 470mb of libraries. Check your image with `docker history hello-dotnet`.

```
CREATED BY                                      SIZE
/bin/sh -c #(nop) CMD ["dotnet" "run"]          0 B
/bin/sh -c dotnet build                         129.6 kB
/bin/sh -c dotnet restore                       471.6 MB
```

If we add the project.json file separately from the rest of the code we could potentially benefit from Docker's layer caching.

#### Wrapping up

Without having to install any runtimes or IDEs (other than Docker) we were able to:

* Create a DNCore RC2 Console Application
* Build the application and download its dependencies
* Run the application and view its output

After having played with the previous version of the CLI (dnvm dnx, dnu) I'm impressed with how simple and cohesive the new `dotnet` command appears to be.

For my use-case as a .NET web developer there is still a lot of work to be done on the project before it can be a viable alternative to a full .NET framework. I'm looking forward to being able to connect to MongoDB, Redis and SQLite but it's still too new to support all of these back-ends. For a good idea of what is available check out the [Official Github Repo](https://github.com/dotnet/core).

In the meantime the [Mono project](http://www.mono-project.com) is doing some really amazing work and can run a full cross-platform .NET version. Check out my Hands-On Docker tutorial for more on using Mono with Docker.

> [Hands-On Docker](https://github.com/alexellis/HandsOnDocker)

Have you tried the tutorial? Do you you want to share what you've built? Let's chat in the Disqus comments below.