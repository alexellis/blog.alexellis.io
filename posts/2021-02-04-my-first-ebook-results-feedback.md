---
title: "My first eBook launch - results & feedback (10k USD in 27 days)"
slug: "my-first-ebook-results-feedback"
date: "2021-02-04T09:30:54Z"
author: "Alex Ellis"
meta_title: "My first eBook launch - results & feedback (10k USD in 27 days)"
meta_description: "After four years of building the OpenFaaS project, I sat down to write an eBook. Learn how it went, what I earned, what worked and didn't, and what's next."
feature_image: "/content/images/2021/02/social5.jpg"
tags:
  - "openfaas"
  - "self-publishing"
  - "ebook"
  - "author"
  - "indiedevs"
---

I wanted to write to you all and share that I've launched my first eBook called ["Serverless For Everyone Else"](https://gumroad.com/l/serverless-for-everyone-else) - within the first three hours of launch, nobody bought a single copy and I thought that I'd got it all wrong.

The "everyone else" is a reference to how complicated and difficult cloud-based and Kubernetes-based FaaS has become. The eBook sets out to help indie developers, and individuals within corporations build and deploy functions using a new version of OpenFaaS ([faasd](https://github.com/openfaas/faasd)) which is open source and can run on a single VM or VPS without much overhead.

The real power of functions comes in extending existing systems through webhooks, polling, or querying and updating state. I'll share some of these use-cases below including how I used functions to extend how the Gumroad marketplace worked.

## Why write an eBook anyway?

Why did I decide to write an eBook? If you've ever written about tech or spoken at a conference, then Packt has probably approached you on LinkedIn about writing for them. From what I hear, that kind of arrangement means writing in a word doc, with tight deadlines and cranking out 300+ pages. It wasn't for me.

I'd seen [Daniel Vassallo](https://twitter.com/dvassallo) create an eBook about AWS and Twitter. Daniel had really good results using Gumroad to sell his self-published eBooks. Then there's [Adam Wathan](https://twitter.com/adamwathan) who built Tailwind CSS and trained himself up as a UI designer. He wrote his own eBook and in his yearly review mentioned that it did 600k USD in passive sales, without any promotion.

Whilst I didn't expect to get anywhere close to those numbers with a specialist topic, I did want to know if people would buy something from me.

## The tiers at launch

I launched with three tiers, with names and clear differentiation:

* Minimalist - 25 USD - just the eBook
* DevOps PRO - 50 USD - the eBook, plus a Grafana dashboard and the YAML for faasd to enable it
* The learner - 99 USD - the eBook, plus a Grafana dashboard,  the YAML for faasd to enable it and a video workshop ready in 7 days
* The team player - the learner, but for 5 people in your company - for a lunch & learn, brownbag, or to better understand Serverless

As long as the options add some value, it seems that people are willing to pay a little more and enjoy the choice.

There was no pre-launch and I didn't collect email addresses. I just tweeted about the eBook on Friday afternoon, and then nothing happened for three hours.

I interpreted this as a failure because I'd been reading ["The Right It: Why So Many Ideas Fail and How to Make Sure Yours Succeed"](https://amzn.to/38N5uZy). 

> You tend to get what you focus on, like when you think of installing a satellite dish, then realise that everyone on your street has one, and can't stop seeing them.

In the same way, I saw failure to find market fit. In those first hours I convinced myself that the lack of sales was a sign that nobody wanted the material.

Then I got my first sale, and felt a little relief, maybe I was wrong?

![Sale email](https://user-images.githubusercontent.com/6358735/104810538-27b57080-57ed-11eb-905b-d042d3046adf.png)

The sales graph had one initial spike on the Friday, and kept going into the Sunday. What had happened? My Twitter audience and [GitHub Sponsors](https://github.com/sponsors/alexellis) came to lend their support.

![The initial spike at launch](https://pbs.twimg.com/media/ErzMnuOXMAA_REk?format=jpg&name=medium)

Then things died down, and over the course of the week I wondered again if I'd failed to find market fit. [Gumroad](https://gumroad.com) was sending me almost no organic traffic, and nobody was landing on the page from search engines.

Still, it was more money than I had expected to earn from the eBook within the first week, but I felt like with so much interest in OpenFaaS, that there was a broader audience to reach.

## Getting a second peak

After the first week, I released the video workshop to the people who'd purchased that tier (99USD), and to get some feedback, I offered a free upgrade to the workshop for the tier just below (50USD).

> The discount resulted in another large spike in sales.

![Video workshop](https://camo.githubusercontent.com/4e204e93dcfc33679c997c739fbf4f651fdf268d23961bae6f9b4c25ad4ec145/68747470733a2f2f7062732e7477696d672e636f6d2f6d656469612f45735a3372753258634155513451673f666f726d61743d6a7067266e616d653d6d656469756d)

Gumroad has no way to offer a discount for a single tier, or to enable upgrades. So how did I fulfil the upgrade?

I did it by writing a function and deploying it to my Raspberry Pi. Gumroad can be configured to send a webhook (also called "a ping") to a HTTPS endpoint whenever there is a sale. My code just had to validate the sender, parse the dollar amount and email address, and then send out an email to the customer. I evaluated a few email services and settled on AWS SES for its simplicity and predictable pricing. I used [inlets PRO](https://inlets.dev/blog/2021/02/11/secure-letsencrypt-tunnel.html) to receive webhooks.

![The function running](https://pbs.twimg.com/media/EscxNxbXAAEHD8z?format=jpg&name=large)

You can see the source code here: [alexellis/gumroad-responder](https://github.com/alexellis/gumroad-responder)

After the second peak, I saw a sharp drop-off in sales, again. I started to wonder why I was seeing this pattern?

At that time 99% of referrals had come from Twitter and from email. Had I exhausted my network? Had everyone who was going to buy an eBook on learning open-source serverless, already become a customer?

I went ahead and added a link on [openfaas.com](https://www.openfaas.com) and [on my blog](https://blog.alexellis.io/) at the end of each post, to try and get more eyes on the eBook. It's too early to tell if that is going to work out, but has resulted in a few conversions already.

One of the bits of feedback I got on the eBook was how users enjoyed the use-cases, and practical examples. I'd recently started video streaming, so invited a friend to my YouTube channel to talk about serverless use-cases.

![Video on use-cases](https://camo.githubusercontent.com/544dffaf339a4ff44439db1c14cd953de385640b99231688f8a49db61294a02e/68747470733a2f2f7062732e7477696d672e636f6d2f6d656469612f457378444745505841415968724c4f3f666f726d61743d6a7067266e616d653d6c61726765)

[Watch the recording](https://www.youtube.com/watch?v=mzuXVuccaqI&feature=youtu.be)

The recording generated a lot of interest and engagement for existing eBook customers, but seemed to have no obvious effect on sales.

You can get the [show notes](https://gist.github.com/alexellis/c72d7a385f801cc9b8deb7fcaa531b69) here which have lots of links for use-cases from hobbyists, indie devs and corporate users of OpenFaaS.

## My next milestone

I am pleased with the results so far, and have learned a lot along the way. I also had a few people reach out to me directly asking for help who had taken inspiration from seeing someone actually go ahead and take a calculated risk. As they say, "nothing ventured, nothing gained".

I haven't quite got to 10k USD, which is a nice round number to aim for, but I can roughly understand what each peak means here, and whether they are repeatable.

![Approaching 10k](https://pbs.twimg.com/media/EtARGclXMAg7nJ-?format=jpg&name=medium)

Once the sales do cross that threshold, I'll write-up a how to guide and share the command lines and tools I used to generate the eBook.

## What's next

I committed to providing free updates - because the eBook was partially experimental and I wanted to validate that it was useful. Using the [OpenFaaS Slack](https://slack.openfaas.io/) helped here - I opened a new channel for people who'd bought the book, and enjoyed the feedback and engagement from this.

Some people charge extra for community, but it felt too hard to enforce the access for this.

![Original cover](https://user-images.githubusercontent.com/6358735/104810333-b628f280-57eb-11eb-8be9-a2f6c773346b.png)

I generated my own eBook cover originally and then only later, got a professional designer involved.

![New design](https://static-2.gumroad.com/res/gumroad/2028406193591/asset_previews/741f2ad46ff0a08e16aaf48d21810ba7/retina/social4.png)

It turns out that the cover may not matter with Gumroad, as long as it's not awful. Since changing cover, I've only seen two new sales.

Now that I have some initial feedback and have learned that people will buy things from me, I want to let goodwill rebuild, and my audience "recover" before launching a second eBook. I've done a lot of free blog posts and writing on Kubernetes, Docker, Golang and Raspberry Pi and analytics from my blog shows me what's popular.

Just because something you give away for free is popular, doesn't mean that anyone will be willing to pay for it. OpenFaaS itself is testament to that, with many corporations using it in production, without contributing code or finances back. Part of [my 2021 goals](https://blog.alexellis.io/still-in-the-game-my-2020-year-in-review/) is to find a way to make OpenFaaS sustainable.

> "If You Always Do What You've Always Done, You'll Always Get What You've Always Got." - Henry Ford

The eBook has already brought in more revenue in a month, than the OpenFaaS GitHub Sponsors account has in a year.

[The Right It](https://amzn.to/38N5uZy) has taught me not to invest too much effort up front in any one idea, because it is likely to fail. That's just the way things go. Instead I'll be testing ideas out through small experiments that take a few hours or days, and using data to decide whether to invest more.

I'm happy to answer questions [via Twitter](https://twitter.com/alexellisuk/).

## Update (12 Feb 2021)

It took 27 days, but the eBook has now reached the milestone of 10k USD in sales! Most of the purchases being made now are from links on the OpenFaaS website, the faasd repo or my own blog. This is also known as long-tail, a slow and (mostly) steady stream of revenue.

![Launch event, offers and longtail](/content/images/2021/02/update-rev6.png)

> Visualised: Launch event, offers and longtail

I've also released revision 6 of the eBook which has a much more detailed section on CI/CD and recipes for multi-arch builds. I'm using it to deploy endpoints directly to my Raspberry Pi from GitHub Actions.

If you're curious about how Serverless functions can be of use for your next side-project or idea, why not try the eBook and / or video workshop? You can get your money back within 7 days if you're not satisfied.

Events and webhooks can be used to build custom extensions for SaaS products or existing systems. You can see an example in my [gumroad-responder](https://github.com/alexellis/gumroad-responder) which forwards messages to Slack, and sends emails via AWS SES to customers during a promotion.

> 🎁 To say thanks for reading, the next 20 people can get 20% off any tier - including the video workshop package using the discount link below:

Check the options on Gumroad: [Serverless For Everyone Else on Gumroad](https://gumroad.com/l/serverless-for-everyone-else)