---
title: "An Overview of .NET and Containers"
slug: "docker-dotnet-containers"
date: "2016-09-29T16:26:19Z"
author: "Alex Ellis"
meta_title: "An Overview of .NET and Docker Containers"
meta_description: "There are three strong options for containerizing .NET and ASP.NET applications with C#. We explore about .NET Core, Mono and Windows Containers."
tags:
  - "docker"
  - "linux"
  - ".net core"
  - "dncore"
  - "mono"
  - "asp.net"
  - "windows"
---

This week at the [Ignite conference](https://ignite.microsoft.com) in Atlanta Microsoft announced that Windows Server 2016 GA will support containers through Docker. In this post we will look at some of the options for migration a C# application to Docker.

Whether you are working with an established C# and ASP.NET website backed by T-SQL and IIS or a highly decoupled set of microservices - running in a Docker container should be on your roadmap.

This is what [Gartner](http://blogs.gartner.com/joerg-fritsch/can-you-operationalize-docker-containers/) says on the subject: 
> Applications deployed in containers are more secure than applications deployed on the bare OS.

So let's take a few minutes to look over some of the options and the challenges presented.

## Windows

> For Windows Containers please head over to my new blog post for a full-worked example. 

> [Run IIS + ASP.NET on Windows 10 with Docker
](http://blog.alexellis.io/run-iis-asp-net-on-windows-10-with-docker/)

It's likely that you are already building and deploying your applications on a Microsoft Windows stack. With the announcement this week this is probably the natural choice.

### 1. Move to Windows 2016

The *Windows Containers* feature available in both Windows Server 2016 and Windows 10 Pro+ provides the ability to run Windows Nano Server or Server Core as a container.

#### Introducing Nano Server
Nano Server is a minimalist Operating System re-designed with running services in mind. It runs a reduced PowerShell built on .NET Core which means makes writing *Dockerfiles* harder.

The re-think means that Nano Server lacks a UI, local CMD prompt and login screen. One of the most controversial changes is the removal of support for MSI packages. Many software vendors only release their software in MSI packages which is even more so if you are using an LTS version. I was also unable to run 32-bit applications due to the lack of the WOW64 subsystem.

If you are porting an existing (potentially monolithic) product then you should look to Core rather than Nano Server.

More at: [Top 10 need to knows for Nano](http://windowsitpro.com/windows-server/top-ten-what-you-need-know-about-microsoft-nano-server)  @ windowsitpro.com.

#### Running modes

There are two running modes available for Windows Containers:

* Shared kernel (Server host only)
* Hyper-V isolation

The shared kernel model is most similar to Docker on Linux while Hyper-V isolation creates a tiny VM to enhance security and is useful for multi-tenant systems.

> More about [Windows Containers](https://msdn.microsoft.com/en-gb/virtualization/windowscontainers/containers_welcome) on MSDN.

One of the strongest advantages to Docker on Linux is the unified experience in development and production. Microsoft have made it possible to run both Windows Server editions on Windows 10 Pro. You will need to install the Anniversary update first.

> You can already download an evaluation version of Windows 2016 from [Technet](https://www.microsoft.com/en-us/evalcenter/evaluate-windows-server-2016) and a full release will be available in October.

### 2. Linux as an alternative

There are two options available for migrating an application to Docker on Linux. You don't need to have Linux on your development machine but you will need hardware or VMs running Linux in production.

* Mono
* .NET Core

Moving to Mono or .NET Core does not mean that you have to give up your Visual Studio 2015 IDE with ReSharper. Often code can be built with a Microsoft .NET SDK and then run under Mono and visa-versa.

#### Cross-platform .NET

With a development platform such as Node.js, Python or Ruby it's entirely possible to develop software on a range of platforms and deploy to only one. If you are invested in .NET then there are at least a couple of options available:

##### Mono Project

This year the Mono Project (Xamarin) was open-sourced and consolidated into Microsoft's offerings. You may know of Mono because you've developed .NET apps for mobile using Xamarin Studio. You may have already attempted to port your application.

> See also: [Mono Dockerfiles](https://github.com/mono/docker) on Github.

* Porting

There are some limitations when specific Win32 APIs are are needed or proprietary binaries are embedded in NuGet packages. 

The easiest way to try Mono is to pull down a Docker image and add your DLLs and EXEs that you've already built on your Windows machine and attempt to launch them. Now it may not be that simple to move the entire application especially if you are using IIS. 

Here are some replacements for IIS:

[IIS replacements for Mono](http://www.mono-project.com/docs/faq/aspnet/)

* Implementing CI

The Mono equivalent of MSBuild is called `xbuild` and when used with Docker provides a custom instruction called `ONBUILD`. As soon as a `docker build` instruction is issued the `ONBUILD` instructions defined in any base image are executed.

See also: [mono/docker](https://github.com/mono/docker) on github.com

* Check your toolchain

Certain versions of NUnit are compatible with Mono but you will need to check your whole toolchain.

##### .NET Core

The .NET Core project is a re-write and re-think of the .NET framework and runtime. It's being developed as an open source project with input from the community. Not all of the APIs you are used to in the full .NET runtime are available, but the [project has plans](https://github.com/dotnet/core/blob/master/roadmap.md) to bring them in over time.

* Worked example

I was given a TDD coding task which had to be done in C# and wanted to be able to use my Mac. Rather than install Mono or a VM I thought I would try out .NET Core and Visual Studio Code. Here's a few essentials I needed:

* Unit test tool + library
* Mocking framework
* Fluent assertions library

It turned out that at the time only XUnit was supported for unit testing. When it came to picking a workable version of Moq only an obscure alpha edition was available.

You can find the coding task on my [Github page](https://github.com/alexellis/dncore-market-rates) - it calculates monthly repayments on a loan.

* Libraries

At Dockercon 2016 I spoke to Microsoft's Travis Wright and asked him how I could find NuGet packages which were compatible with .NET Core. He told me to use [NuGet.org](http://www.nuget.org) and when put to the test we quickly found that many packages contained binary blobs compiled for Windows meaning that they were not compatible with the .NET Core runtime on Linux or Mac.

* Readiness

I wrote an introduction to .NET Core when RC2 was released in May 2016. While it was an exciting project and had lots of momentum - it lacked the essentials required to port a monolithic enterprise application without significant investment.

> Blog: [Instant .NET Core with Docker](http://blog.alexellis.io/instant-dotnet-core-rc2-with-docker/)

I am excited for the future of this project and I look forward to a unified .NET framework which fully supports all the usual suspects and is truly cross-platform.

### TL;DR

.NET Core 1.0 [is now in GA](https://blogs.msdn.microsoft.com/dotnet/2016/06/27/announcing-net-core-1-0/) so if you're writing a new application or highly decoupled microservices - check out .NET Core with Docker on Linux.

If you have not used the .NET Core framework yet then I'd encourage you to check out my [Instant .NET Core with Docker](http://blog.alexellis.io/instant-dotnet-core-rc2-with-docker/) tutorial.

* Enterprise / existing applications

I would point you in the direction of Windows Containers on Server 2016. You can do your development on [Windows 10 pro or enterprise](http://blog.alexellis.io/run-iis-asp-net-on-windows-10-with-docker/) and make use of MSI installers, full powershell and IIS in the Core Server edition of Windows Server 2016.

> Read my walk-through of [ASP.NET / IIS and .NET in a Windows Container](http://blog.alexellis.io/run-iis-asp-net-on-windows-10-with-docker/).

* Interoperability with Linux

If your DevOps team and organisation already have strong Linux skills and infrastructure then Mono may be a good choice while .NET Core catches up.


### See also:

* [ASP.NET / IIS and .NET in a Windows Container](http://blog.alexellis.io/run-iis-asp-net-on-windows-10-with-docker/)

* [Instant .NET Core with Docker](http://blog.alexellis.io/instant-dotnet-core-rc2-with-docker/)

* [.NET Core Roadmap](https://github.com/dotnet/core/blob/master/roadmap.md)

* [Windows Containers Welcome on MSDN](https://msdn.microsoft.com/en-gb/virtualization/windowscontainers/containers_welcome)