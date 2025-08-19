---
title: "First look: Jenkins CI with Windows Containers and Docker"
slug: "continuous-integration-docker-windows-containers"
date: "2016-10-05T08:21:12Z"
author: "Alex Ellis"
meta_title: "First look: Jenkins CI with Windows Containers and Docker"
meta_description: "First look at Windows Server Core, Docker and Powershell combined to create Jenkins CI images to build your existing business applications."
tags:
  - "windows"
  - "ci"
  - ".net"
  - "jenkins"
  - "cloudbees"
  - "docker"
  - "continuous integration"
  - "microsoft"
---

In 2014 Microsoft partnered with Docker and the results are in: Windows Containers combined with Docker give the same great experience we've gotten used to in the Linux world.

I've set up a proof of concept to convert the [Docker voting app to Windows Containers](http://blog.alexellis.io/docker-does-sql2016-aspnet/) and have [got msbuild.exe working inside a container](https://twitter.com/alexellisuk/status/782503030038097920) - now let's move on to the next step - continuous integration with [Jenkins CI](https://jenkins.io).

We'll look at creating:

* a Jenkins master Docker image running on Windows Server Core
* a Jenkins agent to run headless in a Windows Container

> Now the following is a disclaimer - the CloudBees team can tune Jenkins CI far better than I can. Keep an eye out for an official solution on [Github](https://github.com/jenkinsci/docker) from their team of hackers.

### Create a Java base image

The main pre-requisite is a JRE and fortunately [Stefan Scherer](https://github.com/StefanScherer) (a fellow Docker Captain) has come up with a base image. We'll take his Java JRE base image as a template:

```
# escape=`
FROM microsoft/windowsservercore

RUN powershell -Command `
    wget 'http://javadl.oracle.com/webapps/download/AutoDL?BundleId=210185' -Outfile 'C:\jreinstaller.exe' ; `
    Start-Process -filepath C:\jreinstaller.exe -passthru -wait -argumentlist "/s,INSTALLDIR=c:\Java\jre1.8.0_91" ; `
    del C:\jreinstaller.exe

ENV JAVA_HOME c:\\Java\\jre1.8.0_91
RUN setx PATH %PATH%;%JAVA_HOME%\bin

CMD [ "java.exe" ]

```

Build this as a local image:

```
$ docker build -t windows-java:jre1.8.0_91 .
```

> Before you share or push this image to the public Docker Hub etc bear in mind that Oracle products such as Java have their own [EULA and licensing terms](http://www.oracle.com/technetwork/java/javase/documentation/index.html).

### Create a Jenkins master image

The second pre-requisite for a Jenkins master is to download a Jenkins release as a .war file. Head over to the mirrors site and pick the release you want to work with:

[http://mirrors.jenkins-ci.org/war/](http://mirrors.jenkins-ci.org/war/)

Now add a layer to download the .war file:

```
FROM windows-java:jre1.8.0_91

ENV HOME /jenkins
ENV JENKINS_VERSION 2.0
RUN mkdir \jenkins
RUN powershell -Command "wget -Uri https://updates.jenkins-ci.org/download/war/2.0/jenkins.war -UseBasicParsing -OutFile /jenkins/jenkins.war"

EXPOSE 8080
EXPOSE 50000

CMD [ "java","-jar", "c:\jenkins\jenkins.war" ]
```

If you have issues with the `CMD` entry please try this instead:

```
CMD java -jar C:\\jenkins\\jenkins.war
```

We have used `wget` an alias in PowerShell for `Invoke-WebRequest`. This may be deprecated in the future but is concise enough for our purposes. 

* Port 50000 is used for agent/slave communication
* Port 8080 provides the web interface

Build the image:

```
docker build -t jenkins-windows:2.0 .
```

You can now run your Jenkins master:

```
$ docker run --name jenkinsci -p 8080:8080 -p 50000:50000 -d jenkins-windows:2.0
```

Since the Jenkins 2.0 release security is enabled by default and you will need to find the *initial password* from the Jenkins container before you can login.

```
$ docker logs jenkinsci
```

**Connecting to Windows Containers**

Once you have found the initial password from the logs, you will need to connect to Jenkins in a web-browser.

> Due to networking differences between the Linux and Windows Docker implementation you won't be able to access Jenkins through http://localhost:8080.

* Type in `docker inspect jenkinsci`
* Look for the (NAT) IP address of the container
* For Windows 10 - use that IP address in place of localhost. For Windows 2016 use the NAT IP address or the IP address of one of your Ethernet adapters such as http://10.95.11.1:8080.

Here's a screenshot of my initial attempt of running the master:

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">CI is coming to Windows Containers near you thanks <a href="https://twitter.com/docker">@docker</a> <a href="https://twitter.com/CloudBees">@CloudBees</a> <a href="https://twitter.com/jenkinsci">@jenkinsci</a> Get Started with this Gist! <a href="https://t.co/JHdWBTYMsd">https://t.co/JHdWBTYMsd</a> <a href="https://t.co/jTZcwSa3iO">pic.twitter.com/jTZcwSa3iO</a></p>&mdash; Alex Ellis (@alexellisuk) <a href="https://twitter.com/alexellisuk/status/782853943084941316">October 3, 2016</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

### Create a Jenkins agent image

A Jenkins agent image can be created and connected headless later on. This is really useful for running through a CLI or script.

For this image we'll derive from our Java JRE base image, but this time we don't have to fetch a .jar or .war file from the internet. We can fetch it from our running instance of a Jenkins master.

```
FROM windows-java:jre1.8.0_91

SHELL ["powershell"]
ARG BASE_URL
ARG SECRET

RUN (New-Object System.Net.WebClient).DownloadFile('{0}/jnlpJars/slave.jar' -f $env:BASE_URL, 'slave.jar') ;
ENTRYPOINT ["C:\\Java\\jre1.8.0_91\\bin\\java.exe", "-jar", ".\\slave.jar"]
```

For the build pass in the BASE_URL environmental variable like this:

```
$ docker build --build-arg BASE_URL=http://192.168.0.101:8080 -t jenkins_windows_agent:2.0 .
```

Now, add a new agent on the Jenkins UI and look for the "secret" needed to authenticate new agents to the master.

![](/content/images/2016/10/add_node.PNG)

Copy the secret and use it when you run your agent:

![](/content/images/2016/10/add_node_2.PNG)


```
$ docker run -ti jenkins_windows_agent -jnlpUrl http://192.168.0.101:8080/computer/Windows/slave-agent.jnlp -secret e9714c100fb003e2cef3609b96a255da5f488bc5f195ef6a0fafcebb2836d4e3
```

You now have a running agent and can run builds and jobs on it:

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Want to run a <a href="https://twitter.com/jenkinsci">@jenkinsci</a> master on Linux and build agents on Windows Containers? No problem! <a href="https://twitter.com/CloudBees">@CloudBees</a> <a href="https://twitter.com/docker">@docker</a> <a href="https://t.co/Czz45iQDYN">https://t.co/Czz45iQDYN</a> <a href="https://t.co/3DSiBAHU11">pic.twitter.com/3DSiBAHU11</a></p>&mdash; Alex Ellis (@alexellisuk) <a href="https://twitter.com/alexellisuk/status/783229051561541632">October 4, 2016</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

### Wrapping up

You now have a fully-functional Jenkins CI master and agent running on Windows Containers through Docker. Please treat this as a proof of concept and let me know if you have any ideas for improving the level of automation or general experience.

The source for the Dockerfiles is available on Github:

* [alexellis/windowscontainers-jenkinsci](https://github.com/alexellis/windowscontainers-jenkinsci)

Here are a few areas you could move onto with this basis:

* Installing custom software such as IIS or .NET into the Jenkins agent
* Launching agents through the Docker Swarm plugin (classical)
* Enabling the [Blue Ocean UX](http://www.businesswire.com/news/home/20160914005286/en/Jenkins-Community-Builds-Success-Jenkins-2-Powerful)
* Integrating containers into the workflow - using a custom Docker registry

### Hire me for Cloud Native / Docker / Go / CI & CD or Kubernetes

Could you use some help with a difficult problem, an external view on a new idea or project? Perhaps you would like to build a technology proof of concept before investing more? Get in touch via [sales@openfaas.com](mailto:sales@openfaas.com) or book a session with me on [calendly.com/alexellis](https://calendly.com/alexellis/).

### You may also like

* [Gist for MSBuild/ASP.NET in a Container](https://gist.github.com/alexellis/1bceff8a360515f44c566e1a0ba8885f)

* [Windows Containers Documentation](https://msdn.microsoft.com/en-gb/virtualization/windowscontainers/containers_welcome) @ MSDN

* [Run IIS + ASP.NET on Windows 10 with Docker
](http://blog.alexellis.io/run-iis-asp-net-on-windows-10-with-docker/)

* [Docker with Microsoft SQL 2016 + ASP.NET
](http://blog.alexellis.io/docker-does-sql2016-aspnet/)