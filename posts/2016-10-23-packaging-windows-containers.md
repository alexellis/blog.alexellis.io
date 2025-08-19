---
title: "Packaging Redis for Windows Containers"
slug: "packaging-windows-containers"
date: "2016-10-23T18:34:00Z"
author: "Alex Ellis"
meta_title: "Packaging Redis for Windows Containers"
meta_description: "How do you package software like Redis for Windows Containers on Docker? Here is a step-by-step process leading to a Windows Server Image."
tags:
  - "windows containers"
  - "docker"
  - "redis"
---

While I was porting the [Docker Voting App to Windows Containers](http://blog.alexellis.io/docker-does-sql2016-aspnet/) I hit a stumbling block - there was no official image for [Redis](http://redis.io/) on Windows. I've ported several images to Windows so set about creating a new Dockerfile. Here's how I did it.

> Before we begin make sure you are running up updated edition of Windows 10 pro/enterprise or Windows 2016 Server with Docker installed.

Are you familiar with [redis](https://github.com/MSOpenTech/redis)?

> Redis is an in-memory database that persists on disk. The data model is key-value, but many different kind of values are supported: Strings, Lists, Sets, Sorted Sets, Hashes.

### Pick a Base image

There are two options for base images: Windows Server Core or Windows Nano Server. Nano server is being pitched as Microsoft's brand-new re-designed operating system - fully 64-bit with a stripped down PowerShell. 

> Nano also has no support for MSI files - the Microsoft Installer format.

```
FROM microsoft/windowsservercore
```

Nano Server makes downloading and expanding a file a lengthy and complicated process (around 15-20 lines) where as the traditional PowerShell has various *Commandlets* such as *Invoke-Webrequest* to make the complicated simple.

While we are at it - let's set the default shell from `cmd` to `powershell`:

```
SHELL ["powershell"]
```

### MSI or not to MSI?

Many Windows users are used to MSI files - they tend to include everything to configure a package and provide a way of removing it cleanly after at a later date. It is the de facto installation format and nearly all software is distributed this way.

I started off by creating a new Dockerfile - downloading the Redis MSI package and then running in the installation. Because the installation has to be run in silent we miss the fact that Redis also configures a system service overriding any custom configuration.

After an hour or so of struggling to find out why my custom config was being ignored I found out about the Windows service. The upshot was that I downloaded and expanded a zip file instead. Luckily one was available officially.

**MSOpenTech**

The MSOpenTech project provides a binary for Windows. There is a link to this project from [redis.io](https://github.com/MSOpenTech/redis) if you want to check it out. On Linux the binary can be built easily and/or installed from a distribution's package manager such as `apt-get`.

```
RUN $ErrorActionPreference = 'Stop'; \
    wget https://github.com/MSOpenTech/redis/releases/download/win-3.2.100/Redis-x64-3.2.100.zip -OutFile Redis-x64-3.2.100.zip ; \
    Expand-Archive Redis-x64-3.2.100.zip -dest 'C:\\Program Files\\Redis\\' ; \
    Remove-Item Redis-x64-3.2.100.zip -Force
```

Here I optimise things by going multi-line with the `; \` separator. I download the file, expand the archive then delete the original archive.

Now we set the `PATH` variable so that we can launch the redis executables without having to specify the whole path:

```
RUN setx PATH '%PATH%;C:\\Program Files\\Redis\\'
WORKDIR 'C:\\Program Files\\Redis\\'
```

### Turning off Protected Mode

For ease of use I needed to turn off the `protected mode` setting that secures the application but makes things hard during development.

> So where is `sed` on Windows?

Just like before I try to use a single layer to reduce the push/download/extract time. This is as close to `sed` as I could get:

```
Get-Content redis.windows.conf | Where { $_ -notmatch 'bind 127.0.0.1' } | Set-Content redis.openport.conf 
```

The above deletes all lines in the file which doesn't match a bind to localhost. The net effect is that all devices will be bound - i.e. the Docker 172.x adapter.

```
# Change to unprotected mode and open the daemon to listen on all interfaces.
RUN Get-Content redis.windows.conf | Where { $_ -notmatch 'bind 127.0.0.1' } | Set-Content redis.openport.conf ; \
  Get-Content redis.openport.conf | Where { $_ -notmatch 'protected-mode yes' } | Set-Content redis.unprotected.conf ; \
  Add-Content redis.unprotected.conf 'protected-mode no' ; \
  Add-Content redis.unprotected.conf 'bind 0.0.0.0' ; \
  Get-Content redis.unprotected.conf
```

### Expose the TCP port

This instruction matches the Docker for Linux experience and is one of the easiest lines to add.

```
EXPOSE 6379
```

### Finding a `CMD`

So here I start the `redis-server` executable specifying the port and config file. This process goes into the background so I've created a sleep-loop to keep the container running.

```
CMD .\\redis-server.exe .\\redis.unprotected.conf --port 6379 ; \
    Write-Host Redis Started... ; \
    while ($true) { Start-Sleep -Seconds 3600 }
```

### Trying it out

The new redis image containers the `redis-server` and `redis-cli` executables this means we can use the same image as the server and client. You can also use a Linux client or application library.

The final Dockerfile is available here:

* View the [redis/Dockerfile](https://github.com/alexellis/aspnet-voteservice/blob/master/images/redis/Dockerfile)

**As a server**

```shell
$ docker run --name redis-server -d -p 6379:6379 alexellisio/redis-windows:3.2
```

**As a CLI**

On Windows 10 you will need to find the IP address of the redis-server container. On Windows Server port 6379 will be mapped to your host.

```shell
$ docker inspect redis-server
IP address: 172.26.251.240

$ docker run --name redis-cli -ti alexellisio/redis-windows:3.2 .\\redis-cli.exe -h 172.26.251.240
```


There may be additional tweaks and changes needed to make this production-ready. There may even be some inspiration we could draw from the [officially maintained Linux image](https://github.com/docker-library/redis/blob/master/3.2/alpine/Dockerfile).

Do you have any other tips or tricks for packaging software in Windows Containers? I've submitted a [PR to the Docker project](https://github.com/docker-library/redis/pull/78) and subject to feedback the Redis will be officially available for Windows soon. 

## See also:

Follow up by checking out my Windows-Containers and .NET series:

* [Windows Containers series](http://blog.alexellis.io/tag/windows/)

* [Docker Voting App on Windows](https://www.youtube.com/watch?v=6ULh5RWTKz0)

* [Raspberry Docker Swarm Deep Dive](https://www.youtube.com/watch?v=9m352pAoaow)