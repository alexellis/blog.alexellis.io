---
title: "Build .NET Core apps for Raspberry Pi with Docker"
slug: "dotnetcore-on-raspberrypi"
date: "2017-10-27T08:07:00Z"
author: "Alex Ellis"
meta_title: "Build .NET Core apps for Raspberry Pi with Docker"
meta_description: "There is now an official Docker image from Microsoft that can run .NET Core applications on your Raspberry Pi. Let's find out how in this hands-on guide."
tags:
  - "Raspberry PI"
  - "docker"
  - "arm"
  - "dotnet"
  - "dotnet core"
---

Did you know that there is now an official Docker image from Microsoft that can run .NET Core applications on your Raspberry Pi? Let's explore how to get started in this blog post.

#### Screen-cast

I'm also providing a live screencast for this tutorial which you can use to follow-along or watch to see everything in action.

<iframe width="560" height="315" src="https://www.youtube.com/embed/A8LVzsx9LNA" frameborder="0" allowfullscreen></iframe>

### 1.0 Pre-reqs

* PC/laptop with Docker for Mac/Windows/Linux
* Raspberry Pi 2 or 3 with Docker CE
* VSCode (Visual Studio Code)

### 1.1 Install the tooling

On your PC or laptop install the following:

* [Docker for Mac/Windows or Linux](https://store.docker.com)

* [Visual Studio Code](https://code.visualstudio.com)

* [.NET Core 2.0 SDK](https://www.microsoft.com/net/download/core)

>You can also follow [step-by-step](https://www.microsoft.com/net/download/core) installation instructions for installing .NET Core on your platform:

![](/content/images/2017/10/Screen-Shot-2017-10-27-at-09.11.29.png)

### 1.2 Create a new dotnet console app

On your PC open a new terminal or use the terminal built-into VSCode and type in:

```
$ mkdir -p ~/dev/pi-sharp \
  && cd ~/dev/pi-sharp \
```

List the available project types:

Type in `dotnet new` to see the project types available. We want a `Console Application`

```
$ dotnet new console --name pi-sharp

The template "Console Application" was created successfully.

Processing post-creation actions...
Running 'dotnet restore' on pi-sharp/pi-sharp.csproj...
  Restoring packages for /Users/alex/dev/pi-sharp/pi-sharp/pi-sharp.csproj...
  Generating MSBuild file /Users/alex/dev/pi-sharp/pi-sharp/obj/pi-sharp.csproj.nuget.g.props.
  Generating MSBuild file /Users/alex/dev/pi-sharp/pi-sharp/obj/pi-sharp.csproj.nuget.g.targets.
  Restore completed in 321.8 ms for /Users/alex/dev/pi-sharp/pi-sharp/pi-sharp.csproj.

Restore succeeded.
```

This step creates a project file, NuGet targets and also your entry point: Program.cs.

```
using System;

namespace pi_sharp
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("I <3 Raspberry Pi!");
        }
    }
}
```

> Make a small edit to the message.

Test it out on your PC:

```
$ dotnet run
I <3 Raspberry Pi
```

### 2.0 Build a Dockerfile

At this point I have to tell you the bad news. There is no way to build .NET core on your Raspberry Pi. This may change, but Scott Hanselman from the .NET team told me there are some roadblocks preventing this right now.

Fortunately we can build binaries on our PC platform then use a Docker multi-stage build to transfer them over to the Raspberry Pi. The reason we can do this is because a *runtime* Docker image does exist for the Raspberry Pi.

```
FROM microsoft/dotnet:2.0-sdk as builder  
ENV DOTNET_CLI_TELEMETRY_OPTOUT 1

RUN mkdir -p /root/src/app  
WORKDIR /root/src/app  
COPY pi-sharp     pi-sharp  
WORKDIR /root/src/app/pi-sharp

RUN dotnet restore ./pi-sharp.csproj  
RUN dotnet publish -c release -o published -r linux-arm

FROM microsoft/dotnet:2.0.0-runtime-stretch-arm32v7

WORKDIR /root/  
COPY --from=builder /root/src/app/pi-sharp/published .

CMD ["dotnet", "./pi-sharp.dll"]
```

Explained:

* We start off with `FROM microsoft/dotnet:2.0-sdk as builder` which is the PC version of the SDK
* We then add the code, do a restore and publish
* We then switch into a .NET runtime for Raspberry Pi and only add in the .DLL files without making any other changes

The resulting image can run on a Raspberry Pi.

### 2.1 Build, ship, run

Build the image. The first time you run this, there will be a large delay while the .NET SDK is downloaded.

**Build**

```
$ docker build -t alexellis2/pi-sharp:0.1 .
```

> Replace alexellis2 for your own Docker Hub name. The Docker Hub is a public repository for Docker images.

**Ship**

```
$ docker push alexellis2/pi-sharp:0.1
```

To **Run** we need to switch over to the Raspberry Pi.

### 3.0 Prepare your Raspberry Pi

Install Docker on your Raspberry Pi

* Flash Raspbian to your SD card
* Install [Docker CE using the Debian instructions]( https://docs.docker.com/engine/installation/linux/docker-ce/debian/)

### 3.1 Run .NET Core

Now type in the following on your Raspberry Pi:

```
$ docker run -ti alexellis2/pi-sharp:0.1
I <3 Raspberry Pi
```

This may take a few minutes to download the initial layers of the .NET runtime, but once they are on your device you will be able to iterate much quicker.

![](/content/images/2017/10/Screen-Shot-2017-10-27-at-10.59.45-AM.png)

So now it's over to you to rinse and repeat - make some changes to your application, build the Docker image and re-push it up to the Docker Hub.

### 3.2 Challenges

I've written up a few challenges to take this further. If you have suggestions please leave them in the comments or [Tweet to @alexellisuk](https://twitter.com/alexellisuk).

**Challenge 1:**

Build a ASP.NET Core application by passing the project type to `dotnet new`.

**Challenge 2:**

Add a third-party dependency to your project with NuGet.

**Challenge 3:**

Build a Docker Swarm or Kubernetes Cluster using [my 3-part mini-series](https://blog.alexellis.io/serverless-kubernetes-on-raspberry-pi/)

Scott Hanselman built an Kubernetes cluster to run .NET Core with OpenFaaS serverless functions. Keep an eye out for his blog post.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Fabulous Batman is pleased. <a href="https://twitter.com/openfaas?ref_src=twsrc%5Etfw">@openfaas</a> <a href="https://twitter.com/kubernetesio?ref_src=twsrc%5Etfw">@kubernetesio</a> <a href="https://twitter.com/dotnet?ref_src=twsrc%5Etfw">@dotnet</a> <a href="https://twitter.com/raspberrypi?ref_src=twsrc%5Etfw">@raspberrypi</a> <a href="https://twitter.com/AmpliFiHome?ref_src=twsrc%5Etfw">@AmpliFiHome</a> <a href="https://twitter.com/Lego?ref_src=twsrc%5Etfw">@lego</a> <a href="https://t.co/j1BJXU9ycu">pic.twitter.com/j1BJXU9ycu</a></p>&mdash; Scott Hanselman (@shanselman) <a href="https://twitter.com/shanselman/status/923115953868509185?ref_src=twsrc%5Etfw">October 25, 2017</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

### Wrapping up

Multi-stage builds and Docker helped us create a developer-workflow where the eco-system fell short. This may even be a quicker way of building code than on the Raspberry Pi when the SDK is released.

Keep learning:

* [Learn more about Docker with my tutorials and blogs](https://blog.alexellis.io/tag/docker/)

* [Build cool projects with your Raspberry Pi](https://blog.alexellis.io/tag/raspberry-pi/)

* [OpenFaaS serverless functions for Docker and Swarm](https://blog.alexellis.io/serverless-kubernetes-on-raspberry-pi/)