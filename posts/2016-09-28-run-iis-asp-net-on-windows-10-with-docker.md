---
title: "Run IIS + ASP.NET on Windows 10 with Docker"
slug: "run-iis-asp-net-on-windows-10-with-docker"
date: "2016-09-28T20:24:00Z"
author: "Alex Ellis"
meta_title: "Run IIS + ASP.NET on Windows 10 with Docker"
meta_description: "Learn how to build your existing .NET applications into Windows Containers with Powershell and official Microsoft IIS images. Even better: use Windows 10."
tags:
  - "windows"
  - "asp.net"
  - "webapi"
  - "docker"
---

In this tutorial we will create a WebAPI application with the full version of [ASP.NET](https://www.asp.net). We will then host it with IIS in a Windows Server Core instance using Windows Containers and [Docker](https://www.docker.com/).

![](/content/images/2016/09/clip.PNG)

If you have Windows 10 Pro or Enterprise installed on your PC or laptop then there's some [great news](https://blog.docker.com/2016/09/dockerforws2016/) for you. You can run Windows Nano Server and Windows Server Core without having to set up Windows Server 2016 in a virtual machine!

If you're following along now then you'll need Windows 10 to hand and will have already installed Docker with the instructions available here:

[Docker for Windows installation](https://msdn.microsoft.com/en-us/virtualization/windowscontainers/quick_start/quick_start_windows_10?f=255&MSPPError=-2147217396) from MSDN

Microsoft has provided two images for the new Windows Server editions: Server Core and Nano Server. Nano Server is being pitched as a minimalist OS - so minimal that it lacks a full version of PowerShell and cannot install programs using MSI files.

We will pull down a Windows Server Core image as a basis for our container.

## docker run

Let's start a command prompt in a docker container to check that everything worked. If it's the first time you've run this command then Docker will pull down around a 4GB download.

```
PS C:\WINDOWS\system32> docker run -ti microsoft/windowsservercore cmd
```

![](/content/images/2016/09/container.PNG)

My system has started a Windows Server Core container and has given me a minimal filesystem. How long did this take? For me it was around 5 seconds and that's because Windows 10 uses Hyper-V isolation to launch each container.

> If you want to clean up your containers then it turns out PowerShell has the same syntax as bash: `docker rm -vf $(docker ps -qa)`

### Visual Studio 15

In the meantime install Visual Studio 15 Community edition so that we can create an ASP.NET application.

[Visual Studio 15 download](https://www.visualstudio.com/vs/community/)

The download and installation will take some time. You can skip the next step if you want to but will still need to build the code through Visual Studio or `msbuild`.

Github repository [alexellis/guidgenerator-aspnet](https://github.com/alexellis/guidgenerator-aspnet)

### Create a WebAPI application

Create a WebAPI application, build it and save it.

![](/content/images/2016/09/new_project.PNG)

Click Web and then .NET 4.5.1.

![](/content/images/2016/09/webapi.PNG)

Pick Web API.

I didn't spend too long here - I just edited the ValuesController so that it will create a GUID for us. See below:

![](/content/images/2016/09/hack_edit.PNG)

This is what I got from running the code on my own machine in debug mode (hit F5 in Visual Studio).

```
$ curl -s http://localhost:52428/api/values/
"35abbaa7-6924-40d4-b979-a12ae24d0731"
```

Next we'll create a Dockerfile for IIS and .NET and then finally run the code in a Windows Container through Docker.

### .NET Dockerfile?

Let's create an outline for a .NET + IIS Dockerfile then enhance it.

There is a base image provided by Microsoft which already contains IIS, we'll use that as a template. As best practices would have use do - we'll pin ourselves to a specific tag or *version* of the image. 

> You can see all the tags on the [Microsoft repo](https://hub.docker.com/r/microsoft/iis/tags/) on the Docker Hub.

We'll introduce a new Dockerfile instruction called `SHELL` which allows us to specify which shell or command line interpreter to use for each `RUN` step. The `SHELL` value could be `cmd` or `powershell` or something completely different.

> Read about the SHELL instruction in the [Dockerfile reference](https://docs.docker.com/engine/reference/builder/#shell).

To make sure we only get a single layer for .NET and ASP.NET features we will use a `;` to separate each command and then a `\` to go multi-line.

```
FROM microsoft/iis:10.0.14393.206
SHELL ["powershell"]

RUN Install-WindowsFeature NET-Framework-45-ASPNET ; \
    Install-WindowsFeature Web-Asp-Net45

EXPOSE 80
```

When you start to build this Docker image, you'll get useful information back from Powershell telling you what's going on:

```
PS C:\alex> docker build -t iis .
Sending build context to Docker daemon 2.048 kB
Step 1/5 : FROM microsoft/iis:10.0.14393.206
 ---> e4525dda8206
Step 2/5 : SHELL powershell
 ---> Running in 367d5890f81e
 ---> a30ac5167e6c
Removing intermediate container 367d5890f81e
Step 3/5 : RUN Install-WindowsFeature NET-Framework-45-ASPNET ;     Install-WindowsFeature Web-Asp-Net45
 ---> Running in e87db5ce5678

Success Restart Needed Exit Code      Feature Result
------- -------------- ---------      --------------
True    No             Success        {ASP.NET 4.6}
True    No             Success        {Application Development, ASP.NET 4.6,...
```

### Edit the Dockerfile

At this point we'll add the code to the container and create a new site in IIS along with an application pool. We also want to remove the default website because *less is more*.

```
FROM microsoft/iis:10.0.14393.206
SHELL ["powershell"]

RUN Install-WindowsFeature NET-Framework-45-ASPNET ; \
    Install-WindowsFeature Web-Asp-Net45

COPY GuidGenerator GuidGenerator
RUN Remove-WebSite -Name 'Default Web Site'
RUN New-Website -Name 'guidgenerator' -Port 80 \
    -PhysicalPath 'c:\GuidGenerator' -ApplicationPool '.NET v4.5'
EXPOSE 80

CMD ["ping", "-t", "localhost"]
```

> If you think the `CMD` instruction looks out of place then you're right. We need to give the container a long-running task otherwise it will quit immediately.

Docker's [Michael Friis](https://twitter.com/friism) suggested that the `ping` command may fill up the container logs and suggested using a wait loop instead. It would look a bit like this:

```
CMD Write-Host IIS Started... ; \
    while ($true) { Start-Sleep -Seconds 3600 }
```

> Update 6th Jan 2017: Microsoft has started to bundle ServiceMonitor.exe with the IIS container which means you no longer need the above while/sleep loop.

### Create an image

Now build the image and run it:

```
PS C:\alex> docker build -t guidgenerator .
```

Use `-p 80:80` to expose port 80 from IIS.

```
PS C:\alex> docker run --name guids -d -p 80:80 guidgenerator
```

Once the container is running we'll need to find its IP address. This command can help us pick it out of the metadata supplied by `docker inspect`.

```
PS C:\alex> docker inspect --format="{{.NetworkSettings.Networks.nat.IPAddress}}" guids
172.26.214.174
```

Use the container's IP address in a web browser or with curl to generate as many Guids as you like:

```
$ curl -s 172.26.214.174/api/values/
"86b21dd1-7668-44a5-a517-7905cc75d402"
```

### Run metrics

You can even use Apache Bench to generate some metrics. If you have the *Ubuntu Subsystem for Windows* then install the package and run some tests:

```
$ sudo apt-get install apache2-utils
$ ab -c 10 -n 1000 http://172.22.202.88/api/values/

Server Software:        Microsoft-IIS/10.0
Server Hostname:        172.22.202.88
Server Port:            80

Document Path:          /api/values/
Document Length:        38 bytes

Concurrency Level:      10
Time taken for tests:   1.281 seconds
Complete requests:      1000
Failed requests:        0
Total transferred:      316000 bytes
HTML transferred:       38000 bytes
Requests per second:    780.37 [#/sec] (mean)
Time per request:       12.814 [ms] (mean)
Time per request:       1.281 [ms] (mean, across all concurrent requests)
Transfer rate:          240.82 [Kbytes/sec] received
```

### Wrapping up

So to wrap up, we've just:

* Started the new Windows Server Core edition on Windows 10
* Used Hyper-V isolation
* Built a full WebAPI / ASP.NET application on Windows with Visual Studio 15
* Built a new container with IIS
* Ran metrics on our WebAPI application

> Update 6th Jan 2017: Microsoft has started to bundle ServiceMonitor.exe with the IIS container which means you no longer need the above while/sleep loop.

The GUID generator source code is available here on my Github repository [alexellis/guidgenerator-aspnet](https://github.com/alexellis/guidgenerator-aspnet).

> You can use this sample if you did not create a brand new project of your own, but make sure you build the code and carry out a NuGet restore.

#### Enjoyed the tutorial? 🤓💻

**Follow me on [Twitter @alexellisuk](https://twitter.com/alexellisuk)** to keep up to date with new content. Feel free to reach out if you have any questions, comments, suggestions.

### Enjoyed the tutorial? 🤓💻

**Follow me on [Twitter @alexellisuk](https://twitter.com/alexellisuk)** to keep up to date with new content. Feel free to reach out if you have any questions, comments, suggestions.

### Hire me to help you with Kubernetes / Cloud Native

Hire me via OpenFaaS Ltd by emailing [sales@openfaas.com](mailto:sales@openfaas.com), or through [my work calendar](https://calendly.com/alexellis). Let me know whether you need help with Windows Containers .NET/.NET Core migration, Jenkins or something else.

### See also

* [Microsoft images on Docker hub](https://hub.docker.com/r/microsoft/)

* [Docker announces partnership with Microsoft](https://blog.docker.com/2016/09/docker-microsoft-partnership/)

* [5 things about Docker on Raspberry Pi](http://blog.alexellis.io/5-things-docker-rpi/)