---
title: "Jenkins makes a UX splash with Blue Ocean"
slug: "jenkins-splashes-with-blue-ocean"
date: "2016-09-02T20:48:00Z"
author: "Alex Ellis"
meta_title: "Jenkins makes a UX splash with Blue Ocean"
meta_description: "Jenkins has made a splash with a huge UX overhaul and it's gorgeous. Docker Captain Alex Ellis talks to CloudBees UX manager James Dumay about Blue Ocean. "
feature_image: "/content/images/2016/08/blue_ocean.jpg"
tags:
  - "docker"
  - "DevOps"
  - "jenkins"
  - "Blue Ocean"
---

One of the teams at **CloudBees (Jenkins' corporate sponsor)** has been working on **an overhaul of the Jenkins community user experience and design**. It's in the alpha stage and they are aiming to build the best user experience around Jenkins Pipeline. I saw a screenshot on Twitter today and couldn't recognise the *functional business tool* I had been staring at for years.

If you're into DevOps then you're probably already using Jenkins at work, in an Open Source project or at home - for me it's a house-hold name and a long-time favourite. Join me in this post for a introduction to the Blue Ocean project - who's behind it, how to use it and how to get involved.

I'll be using Docker to evaluate the new design.

### Meet "Blue Ocean"

> Here's a preview of the beautiful blue colour theme and responsive UI built on top of React offering a real-time experience - no more refreshes or asking yourself is my build done yet?

![](/content/images/2016/08/Screen-Shot-2016-08-14-at-21-49-14.png)

#### Interview with UX Product Manager

I had a chat over Twitter with James Dumay the UX Product Manager at CloudBees for the Blue Ocean team who are carrying out this overhaul. I wanted to write a quick guide to show off some of the work that has been achieved already. I asked James a few questions:

* Have there been any technology upgrades in the UI?

> James: Yes, we’ve rebuilt the UI using Facebook’s React and server side events (SSE) to update the UI in real time, eliminating any need to refresh. It’s an exciting time to build web applications. The browser in 2016 is an amazing platform to build apps and we’re absolutely spoilt rotten with tools like React.

* Are the name of the Team and the Project both Blue Ocean?

> James: Yes, the team and the project share the same name.

* OK, I'm sold.. how do I get it?

> James: All you need to do is to upgrade Jenkins to 2.2 or above, configure your server to use the experimental plugin update center, install the Blue Ocean plugin. We will make it available via the regular update center soon. Watch for news at Jenkins World this September!

Check out the [Blue Ocean Team Update](https://jenkins.io/blog/2016/07/19/blue-ocean-update/) or read on for my step by step guide.

* Wait.. it doesn't work with Jenkins 2.0?

> James: Surprisingly we didn’t have to change much to start developing Blue Ocean except for Stapler the extendable web framework that Jenkins uses exclusively to build REST APIs. By the time we had finished those modifications it landed in the Jenkins 2.2 release. Jenkins releases weekly so don’t let those minor release versions worry you too much.

* I noticed that there is limited support for Freestyle jobs, why is that?

> James: We believe that Jenkins Pipeline is going to be the best way to model all automation in Jenkins, that’s why we’re designing Blue Ocean to be a first class experience for Pipeline. We recognise that many users rely on other job types such as Freestyle which is why supporting those job types is also on our roadmap. Pipeline is where all the action is - everything from new visualizations, reporting and improved Github support really shines when we build it with Pipeline in mind.

* Are you open to feedback?

> James: Yes, absolutely! Please give it a try and let us know how it worked for you. The team is very engaged in making this the best user experience possible for Jenkins, so your feedback, both positive and negative, is very useful to us.

### Quickstart

Follow the next few steps to try it out for yourself.

#### 1.0 Boot up Jenkins 2.2 in Docker

You can either install Jenkins manually or boot up an instance in Docker that you can throw away afterwards without worrying about affecting your test or development instance. This code is still in the alpha phase.

You can use my `docker-compose.yml` file to boot up a fully working Jenkins 2.2 instance. If you want an Agent/Slave combination then check out my [First Impressions of Jenkins 2.0](http://blog.alexellis.io/jenkins-2-0-first-impressions/) guide.

```
version: '2'
services:
  ci:
    image: jenkinsci/jenkins:2.2
    ports:
     - "8080:8080"
     - "50000:50000"
```
*docker-compose.yml*

#### 1.1 Opt-in to experimental updates

Now this part feels quite permanent which is one of the reasons I'm suggesting Docker for evaluating it. We need to opt into using an experimental update centre for plugins then we can add in the Blue Ocean UX experience.  

* Navigate to *Manage Jenkins -> Manage Plugins -> Advanced*
* Enter the following into the the update centre at the bottom of the screen:

```
http://updates.jenkins-ci.org/experimental/update-center.json
```

* Click `Submit` and then by the "Update information obtained" label click the `Check` button.

#### 2.0 Select the Blue Ocean UX Plugin

* Navigate to *Manage Jenkins -> Manage Plugins -> Available PLugins*

* Search for Blue Ocean and check it, then click update with restart.

> Note: when I wrote this post the plugin was called *(Alpha) BlueOcean UX* and is now called *BlueOcean beta*

Jenkins will download the new code, restart and then ask you to log in again.

#### 2.1 Opt into the new UI

If everything worked (and it did for me) you will see a blue icon at the top of the page, login and then click that button.

![](/content/images/2016/08/Screen-Shot-2016-08-14-at-12-55-17.png)

#### 3.0 Take it for a spin

I already added a Freestyle project before opting in to the Blue Ocean experience. You will notice there are no buttons to create new Freestyle projects etc. As James said - the team is really looking to provide the best experience for *Pipeline* and I think it makes sense as it was such a big part of the 2.0 release.


##### Job list

This is where I spend most of my time in the classical Jenkins theme - the job list. From here I'm used to adding jobs, starting/stopping builds and eye-balling statuses.

Guys.. where is the *Run this build* button?

![](/content/images/2016/08/Screen-Shot-2016-08-14-at-13-12-33.png)

##### Build history

Here's the screen for build history. The team has finally done away with blue/green for red/green, but at what cost? James.. maybe you need an option for the colour blind amongst us?

![](/content/images/2016/08/Screen-Shot-2016-08-14-at-21-13-20-1.png)

Clicking onto the Freestyle project you will see a summary of the latest build information and console output is also available. This part looks to me very much like the UI for Travis-CI.

![](/content/images/2016/08/nodejs_git_pull.png)

I am a hardcore fan of dark themes for code editors and terminals so this looks perfect to my eyes.

#### Changes view

The changes view shows all the commits between this and the last build. You also get to see who pushed the changes i.e. *alexellis2* in this instance.

![](/content/images/2016/08/Screen-Shot-2016-08-14-at-21-31-58.png)

#### Quick look at Pipeline

Pipeline is absolutely the use-case the team have catered for. If you want to get the best out of the new UI then it may be time to start moving jobs over to the new Pipeline format.

![](/content/images/2016/08/Screen-Shot-2016-08-14-at-21-50-29.png)
There are features I haven't been able to reach here without moving to a Pipeline build. The Tests and Artifacts tabs look interesting and I wonder what the new graph looks like for unit tests? 

![](/content/images/2016/08/test_steps.png)

### Call to action

![](/content/images/2016/08/docker-jenkins.png)

I think Blue Ocean is going to make a huge splash and if you like what you are seeing and like to keep abreast of emerging tech then take a few minutes to run up a Docker container and give some feedback to [James](https://twitter.com/i386) and his team.

With new [Docker for Windows or Mac](https://www.docker.com/products/docker) native experiences Docker has never been easier.

See Also: 

* [Jenkins 2.0 First Impressions](http://blog.alexellis.io/jenkins-2-0-first-impressions/)

* [Jenkins meets the corporate proxy](http://blog.alexellis.io/jenkins-meets-the-proxy/)