---
title: "Docker with Microsoft SQL 2016 + ASP.NET"
slug: "docker-does-sql2016-aspnet"
date: "2016-10-03T16:19:00Z"
author: "Alex Ellis"
meta_title: "Docker does Windows Containers with SQL 2016 + ASP.NET"
meta_description: "Learn how I converted Docker's Voting App to Windows Containers with: SQL Server 2016, IIS, .NET 4.5 and ASP.NET. Docker build, ship, run!"
tags:
  - "docker"
  - "microsoft"
  - "windows containers"
  - ".net"
  - "windows"
  - "sql"
  - "asp.net"
---

Right off the heels of the Microsoft Ignite event in Atlanta the SQL Server team have a great announcement

> SQL Server 2016 released on June 1st 2016 is ready for Docker on Windows!

Docker and Microsoft partnered in 2014 and after over two years of hard work they've now brought Windows Server Core to the Windows 10 desktop which means you can run your existing business workloads in containers.

### Windows does the Docker Voting app

I've re-written the Docker Voting app which was demonstrated at Dockercon 2016 and used in Docker's birthday contest as a hackathon.

This is what it looks like now:

![](/content/images/2016/10/windows_containers.png)

Every container is running on Windows 10 through Windows Server Core including:

* IIS
* ASP.NET
* .NET 4.5.1
* Microsoft SQL Server (2016)

I have worked with this stack for over 10 years and over the last few weeks all the pieces are falling into place to allow businesses invested in a Microsoft stack to start taking advantage of Docker and containers. For me, it's really exciting to see the familiar Docker CLI bringing power to the Microsoft development stack.

##### Get the code:

The code along with Dockerfiles are available on Github: [alexellis/aspnet-voteservice](https://github.com/alexellis/aspnet-voteservice)

### SELECT * FROM DEMO

This is a quick overview of how everything works:

<iframe width="560" height="315" src="https://www.youtube.com/embed/6ULh5RWTKz0" frameborder="0" allowfullscreen></iframe>

I've also recorded a longer deep-dive, so check back later or subscribe to me on YouTube to get notified when it goes up.

### What does this mean?

It's never been easier to evaluate a new version of Microsoft SQL Server. All I did was pull down a container and run it and when I'm done, I can remove it in seconds.

Containers are coming to Windows and they're bringing the power and ease we've grown accustomed to on a Linux platform.

> To install Docker on Windows right now check out this post by Michael Friis:

* [Build your first Windows Container](https://blog.docker.com/2016/09/build-your-first-docker-windows-server-container/)

### Want the deep dive?

If you want the deep dive then check out the longer edit of the video right here:

<iframe width="560" height="315" src="https://www.youtube.com/embed/c1AT2JeX56A" frameborder="0" allowfullscreen></iframe>

### See also:

* The code along with Dockerfiles are available on Github: [alexellis/aspnet-voteservice](https://github.com/alexellis/aspnet-voteservice)

* [SQL 2016 Express in Containers announcement](https://blogs.technet.microsoft.com/dataplatforminsider/2016/10/13/sql-server-2016-express-edition-in-windows-containers/) on Technet

* [Scott Hanselman](https://twitter.com/shanselman) shared my initial look at ASP.NET + IIS, it's a great starting point:

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Learn how to Run <a href="https://t.co/GyPzkz2heg">https://t.co/GyPzkz2heg</a> + IIS on Windows 10 with Docker - <a href="https://t.co/soP4EHYwkF">https://t.co/soP4EHYwkF</a> <a href="https://twitter.com/docker">@docker</a> <a href="https://twitter.com/Windows">@Windows</a> <a href="https://twitter.com/aspnet">@aspnet</a></p>&mdash; Alex Ellis (@alexellisuk) <a href="https://twitter.com/alexellisuk/status/781251188763262976">September 28, 2016</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>