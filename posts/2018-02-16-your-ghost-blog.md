---
title: "Run your blog with Ghost, Docker and LetsEncrypt"
slug: "your-ghost-blog"
date: "2018-02-16T19:58:08Z"
author: "Alex Ellis"
meta_title: "Run your blog with Ghost, Docker and LetsEncrypt"
meta_description: "Host your own blog just like mine with Ghost, Docker, Nginx and LetsEncrypt for HTTPS. Find out about key Day 2 operations like backup and analytics too."
feature_image: "/content/images/2018/02/pexels-photo-414630.jpg"
tags:
  - "blog"
  - "nginx"
  - "docker"
  - "cloud"
  - "linux"
---

In this blog post I'll show you how to set up your own blog just like mine with Ghost, Docker, Nginx and LetsEncrypt for HTTPS. You can follow these instructions to kick-start your own blog or find some alternative approaches in the conclusion.

When I decided to start my blog I knew that I wanted it to have a clean and uncluttered theme, no dependencies on an external relational database and that it should allow me to write in Markdown. Markdown is a kind of structured text for writing documentation which gets turned into HTML for viewing.

I heard about *Ghost* - a blogging platform written in Node.js that used [SQLite](https://www.sqlite.org/index.html) as a back-end. After trying it out I set it up on my Raspberry Pi and registered a domain name that allowed dynamic DNS updates. From there I started writing 1-3 times per week about the various open-source technologies I was learning.

## Background

I used to self-host my blog at home with a domain-name from [namecheap.com](https://namecheap.com). Their free dynamic-DNS service allowed me to serve up web content without a static IP address. I ran the blog on my Raspberry Pi which involved producing and maintaining a Dockerfile for ARM. This setup served me well but the uptime started to suffer every time the ISP had a "hiccup" in their network. So I moved it over to a public cloud host to ensure a better uptime.

## Follow my current setup

In the next section I'll tell you how my blog is running today and you can follow these steps to set up your own in the same way.

### Set up a cloud host

The first step is to set up a cloud host. If you already have a blog or website and you are using a log analyzer or analytics platform then find out where most of your readers are based. For me, the majority of my readers are based in North America on the East Coast so that's where I provisioned a cloud host.

> [Google Analytics](http://google.com/analytics) is a good option for analytics and real-time insights.

Here are some good options for hosting providers:

* [Digital Ocean](https://www.digitalocean.com)
* [Scaleway](https://www.scaleway.com)
* [Packet.net](https://www.packet.net) - bare metal servers

The cheapest options will cost you around 5-10 USD / month with Packet costing around 36 USD / month. I do not advise going any cheaper than this. The first two providers listed use VMs so also offer the ability to make snapshots of your host at any time for a small fee. This is a quick way of doing a backup.

### Pick an OS

I picked Ubuntu Linux 16.04 LTS. All of the providers above support this flavour at time of writing. Ubuntu 17.10 is also a valid option but some command line steps may be different.

### Lock down the configuration

Some providers offer a *cloud firewall* which should be enough to close off incoming connections. The advantage of a cloud firewall is that if you mess things up you can turn it off easily. Be careful configuring a firewall in software - you don't want to get locked out inadvertently.

I used [ufw](https://wiki.ubuntu.com/UncomplicatedFirewall) *Uncomplicated Firewall* to close incoming connections from the Internet and allow outgoing ones.

* Install `ufw`:

```
$ sudo apt install ufw
```

* Setup a basic configuration to allow SSH, HTTPS and HTTP incoming

Create `setup_firewall.sh` and run `chmod +x ./setup_firewall.sh`:

```
#!/bin/sh
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

Then run the script: `sudo ./setup_firewall.sh`.

You can check the config at any time with:

```
$ sudo ufw status verbose
```

You can disable the `ufw` configuration at any time with:

```
$ sudo ufw disable
```

In a new terminal window check that you can still access your host via `ssh`.

### Install Docker

The simplest way to install Docker CE on Ubuntu is via the official utility script:

```
curl -sL https://get.docker.com | sh
```

If you're using a regular user-account then run `usermod` i.e.:

```
$ sudo usermod -aG docker alex
```

Log out and in again so that your user can access the `docker` command.

### Install Nginx on the host - part 1

Nginx is a load-balancer and reverse proxy. We will use it to stand in front of Ghost and offer HTTPS. If you want to run more than one blog later on you can also use Nginx to help with that.

This is a two-part process.

We're installing Nginx directly onto the host for simplicity and lower latency.

```
$ sudo apt install nginx
```

You can take my configuration file and use it as a template - just change the domain name values for your own host.

This configuration does two things:

* Prepares a static folder for LetsEncrypt to use later on port 80
* Sets up a redirect to the HTTPS-enabled version of your site for any calls on port 80

```
server {
	listen 80;
	server_name blog.alexellis.io;
	location /.well-known/ {
		root /var/www/blog.alexellis.io/.well-known/;
	}

	location / {
		return 301 https://$server_name$request_uri;
	}
}
```

Change the hostname etc and place it at /etc/nginx/conf.d/default

### Obtain a HTTPS certificate from LetsEncrypt

Before we enable Nginx we'll need to obtain a certificate for your domain. HTTPS encrypts the HTTP connection between your users and your blog. It is essential for when you use the admin page. 

> Note: if you avoid this step your password will be sent in clear-text over the Internet.

Use certbot to get a certificate.

```
sudo apt-get install software-properties-common
sudo add-apt-repository ppa:certbot/certbot
sudo apt update
sudo apt-get install python-certbot-nginx 
sudo certbot --authenticator webroot --installer nginx
```

> You can also use alternative for HTTPS such as Cloudflare's free tier, but this will not give you a green lock and only encrypts a user's traffic from their device up to the Cloudflare server. The last hop is left open and vulnerable.

### Install Nginx on the host - part 2

Now that you have a certificate in `/etc/letsencrypt/live` for your blog you can finish adding the configuration for Nginx.

These lines enable HTTPS for your blog, but remember to personalise the domain replacing `blog.alexellis.io` with your own domain name.

Edit `/etc/nginx/conf.d/default`:

```
server {
	server_name blog.alexellis.io;
	listen 443 ssl;

	location / {
		proxy_pass	http://127.0.0.1:2368;
	        proxy_set_header    X-Real-IP $remote_addr;
	        proxy_set_header    Host      $http_host;
		proxy_set_header X-Forwarded-Proto https;
	        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

	}

	ssl_certificate     /etc/letsencrypt/live/blog.alexellis.io/fullchain.pem;
	ssl_certificate_key /etc/letsencrypt/live/blog.alexellis.io/privkey.pem;
	ssl on;

}
```

### Run the blog with Ghost and Docker

In this step we will run the blog software in a container and configure it with a URL.

Save *create.sh* and run `chmod +x ./create.sh`

```
#!/bin/sh
docker rm -f ghost

docker run --name ghost \
 -p 127.0.0.1:2368:2368 \
 -e url=https://blog.alexellis.io \
 -v /home/alex/ghost/content:/var/lib/ghost/content \
 --restart=always \
  -d ghost:1.21.1-alpine

```

* Replace `/home/alex` with your home directory
* Replace `url=` with the URL of your website

> Note that the line `-p 127.0.0.1:2368:2368` means Docker won't interfere with the configuration of `ufw` and expose the Ghost blog directly.

You can run the shell script now called `./create.sh` and check that the site came up with `docker ps`. If something appears to have gone wrong then type in `docker logs ghost` to check on the container. The `create.sh` shell-script is re-runnable but you only need to run it once - when you restart the machine Docker will automatically restart the container.

Attempt to access the site from the host's shell:

```
$ curl 127.0.0.1:2368 -H "Host: blog.alexellis.io"
```

### Enable Nginx

You can now start and enable Nginx, then head over to your URL in a web-browser to test that everything worked.

```
$ sudo systemctl enable nginx
$ sudo systemctl start nginx
```

If you see an error then type in `sudo systemctl status nginx -l` to view the logs. A common error is to miss a `;` semi-colon from the end of a line in a configuration file.

### Register your admin account

You now need to register the admin account on your blog so that you can write new posts.

Head over to the URL of your blog adding the suffix `/admin` and follow the new user flow.

### Set up the classic theme (optional)

If you have used Ghost before then you may remember the classic theme (LTS) which I use on my blog. If you would like that instead of the default then you can find it on the [Ghost GitHub site](https://github.com/TryGhost/Casper/tree/lts) in the lts branch. Click "Clone or Download" then "Download Zip". You can then install it via the Ghost admin page.

## Day 2 operations

Here are some "Day 2" operations that relate to how I run my blog on a day-to-day basis.

### Setup a backup regime

You need to back up your blog posts. Here's two simple ideas:

* Take snapshots

The easiest way to make a backup is to take a snapshot of your host through the cloud provider's control-panel feature. These snapshots do cost money and it's often not a one-off cost - it will be recurring, so bear that in mind if picking this option. If you lose the host you can restore the machine and the blog posts at once.

* Store an archive off-site

Take a tar or zip of the *content* directory and store it in a private AWS S3 bucket using CLI tools. This is a cheaper option that taking snapshots. If you lose your host then you'll have to rebuild the whole machine using this blog post, but your blog posts will be restored.

* Export data from the UI

You can also export your data as a .json file from the admin panel. This is a manual task, but simple to do. It can be used to restore your data if you set up Ghost again.

> Pro-tip: Backup regimes need to be tested - don't wait until you have important posts to test out recovering from a failure.

### Update Ghost

The Docker team host an official image for ghost on [the Docker Hub](https://hub.docker.com/r/library/ghost/). When you want to update to a newer version then check the tags listed and edit the `create.sh` script and run it again.

### Use analytics

You can install [Google Analytics](http://google.com/analytics) on any site you set up for free. It will show you where your audience is located and which pages they are most interested in. I use this data to drive what to blog about next. It also gives you clues as to where your traffic is coming from - was it Docker Weekly? Or that post on Reddit that got me that spike in traffic?

If you have objections to using Google Analytics, then I'd suggest using some kind of log analyzer or aggregator instead such as the [ELK stack](https://www.elastic.co/webinars/introduction-elk-stack) or [matomo](https://matomo.org).

Use the insights from the analytics to make your blog better.

### Renew your HTTPS certificates

Every three months you will need to renew your HTTPS certificates with LetsEncrypt. This is a caveat of using a free service - they will also send you emails when the certificate is close to its expiry date.

You can automate this with a shell-script and cron.

### Enable comments (or don't)

I enable comments on my site via Disqus. This gives people a quick way to get in touch with me avoiding unnecessary emails or Tweets which are out of context. They can also see a thread of discussion and what other people have said about the post. Sometimes one person will post a question and someone else will answer it before I have a chance to get there.

If you don't want to enable comments then that's OK too, my advice is to make sure it's super easy for people to get in touch with you with questions, comments and suggestions.

### Run a second blog

If you have several blogs you can run them all on the same system providing it has enough RAM and disk available. Just follow the steps above on the same host for each blog.

## Wrapping up

I've been using Ghost as my primary blogging platform for several years and find it easy to write a blog post in one sitting or over several by using the *draft* post feature. My blog post today does not offer the only way to set up Ghost - it offers my current method and there is always room for automation and improvement.

If setting up your own blog seems like too much work (maybe it is) then there are some short-cuts available:

* [Medium.com](https://www.medium.com) offers free blogs and a WYSIWYG editor, it's very popular with developers.

* [Ghost](https://ghost.org) offer a hosted option for their blog - be warned they do charge per page-view, so if you have a popular site it could be expensive

* [DigitalOcean](https://www.digitalocean.com) offer a VM image which has Ghost and `ufw` set up already, but without LetsEncrypt configured. It could be a good starting point if you want to host on DigitalOcean.

### Share on Twitter

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Run your blog with Ghost, Docker and LetsEncrypt <a href="https://t.co/zzbvvv4UWP">https://t.co/zzbvvv4UWP</a> <a href="https://twitter.com/TryGhost?ref_src=twsrc%5Etfw">@TryGhost</a> <a href="https://twitter.com/Docker?ref_src=twsrc%5Etfw">@docker</a> <a href="https://twitter.com/letsencrypt?ref_src=twsrc%5Etfw">@letsencrypt</a></p>&mdash; Alex Ellis (@alexellisuk) <a href="https://twitter.com/alexellisuk/status/964590135781285888?ref_src=twsrc%5Etfw">February 16, 2018</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> 

[Follow me on Twitter @alexellisuk](https://twitter.com/alexellisuk)

> Acknowledgements: thanks to [Richard Gee](https://twitter.com/rgee0) for proof reading this post. Lead image [from Pexels](https://www.pexels.com/photo/beverage-break-breakfast-brown-414630).