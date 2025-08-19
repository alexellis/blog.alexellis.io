---
title: "Jenkins 2.0 First Impressions"
slug: "jenkins-2-0-first-impressions"
date: "2016-04-30T22:31:00Z"
author: "Alex Ellis"
meta_title: "Jenkins 2.0 : First Impressions"
meta_description: "I'm a huge fan of Jenkins for CI, so really wanted to test-drive the new 2.0 release. Read my first impressions along with how I use Docker Compose. "
featured: true
tags:
  - "docker"
  - "nodejs"
  - "continuous integration"
  - "docker compose"
  - "jenkins"
  - "git"
  - "ci"
---

I am a huge fan of Jenkins for Continuous Integration (CI) and the other uses people have found for it as a task/batch file runner and cron substitute. It has a wide range of community-supported plugins which also cater for .NET and Node.js (my main software stacks) making it a great choice at work and at home.

![](/content/images/2016/04/226px-Jenkins_logo-svg.png)
*Jenkins logo*

I promote the use of Jenkins for internal projects at work and have helped several teams move from occasional manual builds to full CI. So I wanted to share some first impressions of the recent release by the Jenkins team.

#### Docker, perfect for test-driving Jenkins

When Jenkins 2.0 was released I wanted to take it for a test drive, the perfect way to do this was through Docker. Docker means zero commitment to installing packages and configuring your system. Even installing Java could take you on a 30-60min hour detour, Official prebuilt images in the Docker Hub completely eliminates that latency and gives you near instant access to pre-packaged software from the vendor.

I started off by looking at the official instructions for starting a Jenkins 2.0 container. They give 3-4 variations of the `docker run` command but this can be made much simpler through the use of Docker Compose and a `docker-compose.yml` file. Here's my initial version:

```
version: '2'
services:
  ci:
    image: jenkins:2.0
    ports:
     - "8080:8080"
     - "50000:50000"
```
*docker-compose.yml*

Port *8080* exposes the web interface and port *50000* gives you access to a remote Java (JIRA) API.

The following `docker run` command-line may appear short, but `docker-compose up` is even shorter and easier to remember. Docker Compose can also automate creation of virtual networks, ports and volumes for persistence. 

```
docker run --name jenkinsci -p 8080:8080 -p 50000:50000 jenkins:2.0
```

> All the post's resources can be found on Github: [alexellis/jenkins2-docker](https://github.com/alexellis/jenkins2docker)


#### Starting the services

The initial start-up of the Jenkins 2.0 container took 18 seconds to load on my Intel NUC Core i5 running on bare metal with Arch Linux and the latest version of Docker. Starting jenkins:1.565.3 took 22 seconds, which is a negligible difference.

When using `docker-compose` `start` and `stop` Jenkins will shutdown in less than a second and re-start within 7 seconds and your changes are persisted as long as you do not delete the container. When you want your changes to live on longer than this then look into [Docker volumes](https://docs.docker.com/engine/userguide/containers/dockervolumes/).

What about image size?

**Jenkins 1.565.3**

* Start time: 22 seconds
* Base JDK: openjdk-7-jdk
* Total size: 661.3mb

**Jenkins 2.0**

* Start time: 18 seconds
* Restart time: 7 seconds
* Base JDK: java-8-openjdk-amd64
* Total size: 711.8mb

There has been about a 50mb increase in size, but the JDK has also been upgraded to version 8. 

**Docker Hack:**

You can find this information through `docker history --no-trunc jenkins:2.0` or by viewing the `Dockerfile` in the official repository.

#### Connecting to the dashboard

If you've used Jenkins before, such as in the 1.5 release you would run the container and immediately start using it from a web browser. That process has changed and you are now presented with a password protected login screen and user registration. I can understand that there was concern about unprotected Jenkins instances, but a forced password/registration feels like it could get in the way of automation.

![](/content/images/2016/04/Screen-Shot-2016-04-30-at-21-18-05.png)

From the perspective of using Docker or docker-compose the best way to find out the initial password is by watching the Jenkins logs as the instance starts up. There may be work-arounds to find the password, but I think it will make automating Jenkins instances harder than with 1.5. Previously you could start a Jenkins container and immediately start interacting with it from any machine with network access.

```
ci_1  | Jenkins initial setup is required.
ci_1  | An admin user has been created and a password generated.
ci_1  | Please use the following password to proceed to installation:
ci_1  | 
ci_1  | (33 character pass-code will appear here)
ci_1  | 
ci_1  | This may also be found at: 
ci_1  | /var/jenkins_home/secrets/initialAdminPassword
```
*docker-compose logs mid-way through loading of Jenkins*

**Docker hack:**

Use `docker exec` to run the cat command and retrieve the password.
```
$ docker exec jenkinsdocker_ci_1 cat /var/jenkins_home/secrets/initialAdminPassword

(33 character pass-code will appear here)
```

Now that the password has been accepted you will see a plugins screen, you can either install recommended plugins or pick and choose. The default plug-in list with 1.5 did not include `git`, `msbuild` or `Team Foundation Server` so it was always the first thing I needed to install. Git is now part of the default configuration and now that the plug-ins are installed on-boot they are always up to date. It feels like Jenkins has listened to its users with the new workflow.

![](/content/images/2016/04/Screen-Shot-2016-04-30-at-21-23-45.png)
*Choose your path - or cancel if you need to set a HTTP proxy*

![](/content/images/2016/04/Screen-Shot-2016-04-30-at-22-17-46.png)
*Plugin installation could take several minutes*

I didn't see an opportunity to enter a HTTP/S proxy, so if you work for a corporation with a HTTP proxy, you will need to close the plugin wizard and navigate to Manage > Manage Plugins > Advanced. Here you can define the proxy and start adding plugins. An alternative may be to introduce a HTTP_PROXY environmental variable through the docker-compose file.

> Update from @danielbeck at CloudBees: proxy configuration appears if no connection is detected. To bypass the plugin wizard pass `-Djenkins.install.runSetupWizard=false` as an argument to Java.

![](/content/images/2016/04/Screen-Shot-2016-04-30-at-21-04-15.png)
*Connect from another machine, and you will need a password*

#### Setting up a build

I wanted a build or (job) for my tutorial [Unit testing Express.js with Sinon](https://github.com/alexellis/express-middleware-sinon). Here is the first problem: we don't have Node.js on the Docker master image.

Options:

* Derive from the Jenkins 2.0 docker image adding Node.js

Deriving a new image from the Jenkins master image looks like the easy option, but it may also be bulky and less less maintainable. We don't want to have to re-create a Jenkins master image every time we have to install new software such as Ruby or a new .NET version.

* Add a Jenkins slave with install Node.js pre-installed

This feels like the right option from a Single Responsibility (SRP) point of view. As a bonus we can configure the containers to talk to each other through docker-compose and a virtual network.

The only requirements for a Jenkins slave image is to have both Java and SSH installed. I have used [evarga/jenkins-slave](https://hub.docker.com/r/evarga/jenkins-slave/~/dockerfile/) in the past but this is quite heavy-weight at 610mb - with Alpine Linux we can reduce that down to 154.6mb. 

Take a look at the Dockerfile for the Jenkins slave below:

> alexellis2/jenkins\_nodejs\_slave [Dockerfile](https://github.com/alexellis/jenkins2docker/blob/master/slave_node_alpine/Dockerfile)

It includes Node 4.x LTS, but you could modify the Dockerfile and add something else like Ruby, Python or Node 6.0. if you are evaluating bleeding-edge features.

> Slave image comparison:
>
> * evarga/jenkins-slave without Node.js (610mb)
> * alexellis2/jenkins2slave_nodejs with Node.js (154mb)

I have also updated the previous `docker-compose` file to bring up the slave at the same time as the master:

```
version: '2'
services:
  ci:
    image: jenkins:2.0
    ports:
     - "8080:8080"
     - "50000:50000"
    links:
    - node_ci
  node_ci:
   build: ./slave_node_alpine
   ports:
    - 22
```

The networking feature of Docker Compose allows us to reference the slave from the master by port 22 and the name node_ci. The hosts file will be updated automatically meaning we don't have to hard-code IP addresses.

#### Connecting the slave

* Before you attempt to connect the slave to the master, make sure the *SSH Slave Plug-In* is installed on the Jenkins Master.
* Click on Manage Jenkins then Manage Nodes.
* Add a new node as below:

![](/content/images/2016/04/Screen-Shot-2016-04-30-at-22-31-00.png)

*Adding the slave*

Now the slave is connected we can create a new job to build the [Node.js application](https://github.com/alexellis/express-middleware-sinon).

![](/content/images/2016/04/Screen-Shot-2016-04-30-at-23-30-25-1.png)

Here's how to set up the job:

* Create a new Freestyle job
* Configure Git plugin to fetch from https://github.com/alexellis/express-middleware-sinon
* Add a *Build Step* for *npm install*
* Let *mocha* output test results as xUnit (--reporter xunit)
* Add a *Post-build Step* for the *JUnit test reporter* and specify *.out
* Restrict the build to run on labelled slaves of 'nodejs'

*For builds producing compiled/transpiled output, I would suggest using the Archive Artifacts plug-in.*


![](/content/images/2016/04/Screen-Shot-2016-04-30-at-22-48-06.png)
*Here is the overview of the build complete with test result trend graph*

**Docker hack:**

Jenkins stores each job's configuration in a `config.xml` file. A quick way to download the configuration from the container is with this command:

```
docker exec jenkinsdocker_ci_1 cat /var/jenkins_home/jobs/express-middleware-sinon/config.xml > config.xml
```

You can re-create builds at a later date with the saved XML config file. I've exported the job for the example project and placed it in the article's Github repository.

#### Wrapping up

Once I got past the new plugin workflow and additional security I found that setting up my build, configuring my favorite plugins and a Linux slave felt exactly the same as before. There were no unexpected failures or broken plugins for my Git and Node.js workflow. I still need to test out the *Team Foundation Server* and *MSBuild* plugins, but I'd be happy to recommend this new version to both my colleagues and readers.

The Jenkins team have added many more features than I can mention in this write-up including *Pipeline as Code* which looks like it's going to be big. If you want to know more I've included a link to their wiki below.

**Star** the Github repository to keep track of:

* The easy to use docker-compose.yml 
* Light-weight Jenkins slave image (shaving off 500mb)
* and the sample .xml job configuration file:

> View on Github [alexellis/jenkins2-docker](https://github.com/alexellis/jenkins2docker)

If you have any questions or requests for follow-up material please post a comment here.

### Hire me for Cloud Native / Docker / Go / CI & CD or Kubernetes

Could you use some help with a difficult problem, an external view on a new idea or project? Perhaps you would like to build a technology proof of concept before investing more? Get in touch via [sales@openfaas.com](mailto:sales@openfaas.com) or book a session with me on [calendly.com/alexellis](https://calendly.com/alexellis/).

### Learn more

> For a practical tutorial and progressive set of labs from an official [Docker Captain](http://www.alexellis.io) try my 
[Hands-on Docker Tutorial](http://blog.alexellis.io/handsondocker/)

> Jenkins official [Docker image](https://hub.docker.com/_/jenkins/)

> Jekins Release [2.0 Wiki page](https://wiki.jenkins-ci.org/display/JENKINS/Jenkins+2.0)


*This blog is [hosted on a Raspberry PI for free](http://blog.alexellis.io/ghost-on-docker-5mins/) using Ghost blogging platform, start your own blog through Docker in 5 minutes.*