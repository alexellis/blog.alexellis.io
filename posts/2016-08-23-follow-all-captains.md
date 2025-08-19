---
title: "Follow all the Captains in one shot with Docker"
slug: "follow-all-captains"
date: "2016-08-23T20:24:57Z"
author: "Alex Ellis"
meta_title: "Follow all the Docker Captains in one shot"
meta_description: "There's over 67 Docker Captains right now, spread all over the world. Learn how to follow all the Captains in one shot with a Docker container."
---

Have you met the [Docker Captains](https://www.docker.com/community/docker-captains) yet? There's over 67 of us right now and we're spread all over the world. Learn how to follow all the Captains in one shot by using a Docker container, but first a bit more about us.

![](/content/images/2016/08/Cqi5xHpW8AEfZT2.jpg)

## Who are we?

Maybe you've seen the #FollowFriday campaign by Docker's Social Media Team and partners?

<blockquote class="twitter-tweet" data-lang="en"><p lang="und" dir="ltr"><a href="https://twitter.com/hashtag/FollowFriday?src=hash">#FollowFriday</a> <a href="https://twitter.com/ajeetsraina">@ajeetsraina</a> <a href="https://twitter.com/BretFisher">@BretFisher</a> <a href="https://twitter.com/vieux">@vieux</a> <a href="https://twitter.com/alexellisuk">@alexellisuk</a> <a href="https://twitter.com/arungupta">@arungupta</a> <a href="https://twitter.com/nigelpoulton">@nigelpoulton</a> <a href="https://twitter.com/EmmetOGrady">@EmmetOGrady</a> <a href="https://twitter.com/stefscherer">@stefscherer</a> <a href="https://twitter.com/tiffanyfayj">@tiffanyfayj</a></p>&mdash; Docker (@docker) <a href="https://twitter.com/docker/status/764145780223606785">August 12, 2016</a></blockquote> <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

![The Captains](https://www.docker.com/sites/default/files/docker_captian_image.png)

Here's what Docker is saying about us:

> Captains are Docker ambassadors (not Docker employees) and their genuine love of all things Docker has a huge impact on the community. That can be blogging, writing books, speaking, running workshops, creating tutorials and classes, offering support in forums, or organizing and contributing to local events. 

Technology is what we do and we love engaging with the community - whatever your level of knowledge or experience. Reach out to us with your challenges, questions, speaking requests and more.

So read-on to find out how you can follow all the Captains without having to navigate through over 67 web pages.

> As Docker's [Mano Marks](https://twitter.com/manomarks) said: "this has got to be the most Docker way to do it"

If you are a coder or just curious we've provided the source-code for the Docker images we are using.

### #1 Create a list of Captains

The first Docker image can be run like this and produces a sorted list of Twitter screen names:

```
$ docker run alexellis2/captains
adrianmouat
adrienblind
ahmetalpbalkan
ajeetsraina
akalipetis
alexellisuk
allingeek
andyjiang
armenshimoon
arungupta
benjaminwootton
...
```

If you want to **star or fork** the code it's available on Github: [alexellis/captains-list](https://github.com/alexellis/captains-list). The image is automatically built and uploaded by the Docker Cloud, check out the image here: [Docker Hub build](https://hub.docker.com/r/alexellis2/captains/).


### #2 Follow a list of Twitter handles

This is the cool bit. We can use bash pipes in the true UNIX fashion to take the list of captains from the first image and pipe it into the second image. The net effect is that we get to follow each one of the captains without touching a web-browser.

This step gets a bit more involved and involves creating a Twitter API key. If you're quite technical then you may have done this before.

> You can find a list of Captains on the Docker website and click to follow them one-by-one if you think that may be easier

> Docker.com: [Captains' Directory](https://www.docker.com/community/docker-captains)


Instructions:

* Head over to [apps.twitter.com](https://apps.twitter.com)
* Click *Create a New Application*
* Fill out the Name, Description and a Website.
* Now create a new text file and call it `config.py`
* Fill out all the fields as per the Twitter apps page:

```
config = {
    "consumer_key": "",
    "consumer_secret": "",
    "access_token": "",
    "access_token_secret": "",
    "appear_in_my_feed": "True"
}
```

> If you want to follow everyone, but don't them to appear in your own feed then set `appear_in_my_feed` to `False`.

We're going to warm things up by pulling the Docker images ahead of time **don't skip this**.

```
$ docker pull alexellis2/captains
$ docker pull alexellis2/bulk-follow
```

You're almost there..

* Open a Terminal and `cd` to the folder where you saved the `config.py` file. 
* Type this in:

```
$ docker run alexellis2/captains | docker run -i -v $PWD/config.py:/root/config.py  alexellis2/bulk-follow
```

Now wait and watch as each Captain is followed from your Twitter account. You'll also get a message about which Captains are not following you back yet.

**Star or fork** the source-code on Github now: [alexellis/bulk-twitter-follow](https://github.com/alexellis/bulk-twitter-follow).

Let us know if you run into any problems in the comments section below. We look forward to hearing from you soon!

### Want to extend it?

If you like the way we have used UNIX pipes to do something cool with the captains list, why not come up with your own twist and send us a Tweet so we can check it out? One idea may be to create a structured JSON file or geo-coded map.

## See also:
* [Plesk: 6 essentials on Docker containers](https://www.plesk.com/2016/09/18/docker-containers-explained/)

* [Create a Ghost blog in 5 mins with Docker](http://blog.alexellis.io/ghost-on-docker-5mins/)

* [My debrief of Dockercon 2016](http://blog.alexellis.io/dockercon-2016-speaker-notes/)