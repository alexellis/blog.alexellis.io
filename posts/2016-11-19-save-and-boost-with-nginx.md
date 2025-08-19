---
title: "Boost your site's performance and save money with NGinx"
slug: "save-and-boost-with-nginx"
date: "2016-11-19T17:39:07Z"
author: "Alex Ellis"
meta_title: "Boost your site's performance and save money with NGinx"
meta_description: "Learn how NGinx can boost your site's performance through caching and save you money with bandwidth and hosting costs. Then  build, ship, run with Docker."
tags:
  - "DevOps"
  - "caching"
  - "tuning"
  - "proxy"
  - "blog"
  - "nginx"
  - "cache"
  - "performance"
---

[NGinx](https://www.nginx.com) is an extensible open-source HTTP server which is best known for its strong performance serving static content, acting as a reverse proxy and for its built-in caching capabilities.

> It's often used in combination with Docker and is available for most platforms.

![](/content/images/2016/11/logo.png)

Caching can boost your site's performance and you can save money on cloud instances or servers by running a reverse proxy and hosting several sites on the same machine or instance. This is a deep dive showing a practical example of using both.

### Benefits of caching

A slow or expensive API call can be cache for a near-instant response, that does come at a cost - the response could be dirty or old and so normally some sort of time-based limit is applied through configuration.

**Use-case:**

My blog http://blog.alexellis.io/ is backed by Ghost a Node.js and SQLite combination. I run that on a Raspberry Pi Model 3 which serves up around 12-18 requests per second. When I get a peak in traffic I may be dealing with 70-100 concurrent visitors, now they are not all requesting the same page over and over, but come in a burst. Even so I do want everyone to get a timely response.

I tried a cache setting but my blog was sending an explicit instruction *not to cache*. We'll come back to that shortly, but first the reverse proxy settings.

**Why use a reverse proxy?**

Ghost runs on an exotic port *2368* so it's not as simple as starting up running the software on your web-server and opening a port on the firewall. I also don't want to have to change the configuration of Ghost every time I deploy it - so how can we configure Nginx?

```
server {
    listen 80;
    server_name blog.alexellis.io;

    location / {
        proxy_set_header    X-Real-IP $remote_addr;
        proxy_set_header    Host      $http_host;
        proxy_pass          http://localhost:2368;
    }
}
```
*/etc/nginx/conf.d/alexellis.io*

So by placing a file in `/etc/nginx/conf.d` that looks a little like the above any connections to the web-server on port 80 with the host header of `blog.alexellis.io` will route through into the blog.

Now there is a neat side-effect here of defining the `server_name` - we can set up as many ghost blogs as we need all running effectively on port 80 as long as we configure a DNS entry with our Name Server provider such as NameCheap.

alexellis.io also runs in Node.js on port 3000 so here's my config file that enables both sites at once. These are very similar to virtual directories in Apache.

```
server {
    listen 80;
    server_name blog.alexellis.io;

    location / {
        proxy_set_header    X-Real-IP $remote_addr;
        proxy_set_header    Host      $http_host;
        proxy_pass          http://localhost:2368;
    }
}
server {
    listen 80;
    server_name www.alexellis.io;

    location / {
        proxy_set_header    X-Real-IP $remote_addr;
        proxy_set_header    Host      $http_host;
        proxy_pass          http://localhost:3000;
    }
}
```

**Keep a Captain's log**

Who ever cursed having too many logs when investigating an outage or a bug?

Drop these lines inside your `server { }` block to record individual access and error logs for each (virtual) site.

```
    access_log /var/log/nginx/blog.access.log;
    error_log /var/log/nginx/blog.error.log;
```

**What about the caching?**

I mentioned that I could only achieve 12-18 reqs/sec with the Node.js code and with every passing release of Ghost this number seems to decline. You may have some APIs or a similar blog which has limited throughput.

I headed over to the [NGinx documentation](https://nginx.org/en/docs/) for the open source project. There is a paid version of NGinx with some impressive featues around *cache busting* (deliberately invalidating parts of cached content) but it's beyond my budget for my non-profit blog.

These lines create a cache with a specific zone of `blog_cache` and an expiration of 5 mins.

```
proxy_cache_path /var/cache/nginx/ levels=1:2 keys_zone=blog_cache:5m max_size=250m inactive=60m;
```

Apply it to the site in this way:

```
server {
    listen 80;
    server_name blog.alexellis.io;

    location / {
        proxy_cache                 blog_cache;
        add_header X-Proxy-Cache    $upstream_cache_status;
        proxy_ignore_headers        Cache-Control;
        proxy_cache_valid any       10m;
        proxy_cache_use_stale       error timeout http_500 http_502 http_503 http_504;

        proxy_set_header    X-Real-IP $remote_addr;
        proxy_set_header    Host      $http_host;
        proxy_pass          http://localhost:2368;
    }
}
```

**Key elements:**

* `proxy_cache`

Turns out you can have more than one caching zone - useful for different sites with varying settings.

* `proxy_cache_use_stale`

This has saved me a few times when my site was briefly unavailable and NGinx cached a 503 page instead of the blog article. It means the cache will keep a version of the page just in case we get a 500/502/503 or 504 HTTP error when updating the cache.

*  `proxy_ignore_headers`

This is what allows us to bypass Ghost's instruction to *never cache* and go ahead anyway. I just bust the cache manually every time I update my page or wait 10 minutes for the page to go dirty. Now you may not need this setting - so check whether your page gets cached without it first.

**Test it out**

Let's give the cache a quick test and see whether we can see it in the HTTP headers

```
# curl -vvv blog.alexellis.io

* Connected to blog.alexellis.io (104.41.201.137) port 80 (#0)
> GET / HTTP/1.1
> Host: blog.alexellis.io
> 
< HTTP/1.1 200 OK
< Date: Sat, 19 Nov 2016 17:00:02 GMT
< Content-Type: text/html; charset=utf-8
< Connection: keep-alive
< Cache-Control: public, max-age=0
< ETag: W/"2869-OviH9rhiQdBpNNesXbR5fw"
< Content-Encoding: gzip
< X-Proxy-Cache: HIT
```

Did it surprise you to see a bunch of garbled data after the header? That's because as well as speeding up the response of the site through caching I've enabled the response to also be compressed with Gzip. The hint is: `Content-Encoding: gzip`.

To enable it for a test drop these lines into `/etc/nginx/nginx.conf` within the `http` block.

```
	gzip on;
	gzip_disable "msie6";
```

This could also help you to save money on your bandwidth costs.

**Wrapping-up**

This is only scratching the surface of what NGinx can do - there are several other noteworthy features including custom code modules, calling out to CGI scripts and load-balancing.

We have covered a basic example to get you started with reverse proxying and caching. If you want to know more head over to the [NGinx documentation](https://nginx.org/en/docs/).

### Call to action

Before adopting NGinx or editing your existing config make sure that you thoroughly test it on a staging server before you pull down your production site. Docker can help us by providing a unified environment for development/staging and production.

> The configuration parser can be really picky and a missing semi-colon `;` is enough to break your site.

**Test and then deploy with Docker**

Install Docker, Docker for Mac or Windows now and run your first NGinx container.

> [Digital Ocean](https://m.do.co/c/8d4e75e9886f) provide a 10USD credit for their Droplet hosts and have a ready-made Docker image. 10USD goes *really* far so try it out and [deploy a Droplet now.](https://m.do.co/c/8d4e75e9886f)
Grab the default configuration like this and start hacking right-away:

```
# docker create --name nginx_baseline nginx:latest
# docker cp nginx_baseline:/etc/nginx/nginx.conf ./nginx.conf
# docker rm nginx_baseline
```

When ready you can do a quick test in a Dockerfile:

```
FROM nginx:latest
COPY ./nginx.conf /etc/nginx/nginx.conf
```

If you need to test a different hostname then you can either edit your `/etc/hosts` file if using a web browser or simply pass `--header 'Host: www.example.com'` to `curl` as an argument.

> New to Docker? Short on time? Check out my [Hands-On Docker Labs](https://github.com/alexellis/handsondocker/) right now for 12 short and practical labs.