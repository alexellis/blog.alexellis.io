---
title: "My Seven Highlights Of 2021"
slug: "my-seven-highlights-2021"
date: "2021-12-29T18:05:39Z"
author: "Alex Ellis"
meta_title: "My Seven Highlights Of 2021"
meta_description: "Join me for a walk through seven of my highlights from 2021 - of independent business, community-building, hobbies and book recommendations."
feature_image: "/content/images/2021/12/shed.jpg"
tags:
  - "business"
  - "ebooks"
  - "software"
  - "2021"
  - "entrepreneur"
  - "summary"
---

> Join me for a walk through seven of my highlights from 2021 - of independent business, community-building, hobbies and book recommendations.

In this article I'll share my highlights of 2021, but if you don't know where I'm coming from, you can get a quick recap with 2020's edition: [Still in the game: My 2020 Year in Review](https://blog.alexellis.io/still-in-the-game-my-2020-year-in-review/).

["Still in the game"](https://blog.alexellis.io/still-in-the-game-my-2020-year-in-review/) was a reference to Simon Sinek's concept of [finite and infinite games](https://amzn.to/3eydRu5). Many corporations and large brands talk about "winning" and "loosing" - but Simon challenges this as flawed rhetoric. You can only win if there is an end to the game, and a set of rules - governed and enforced by some well defined entity. So my article was about my second year of independent business, still learning, earning and still doing business. If there is no way to win, and no game then Simon hints that following a mission and continuing to participate are what we must focus on instead.

In 2019 when I started my own company, I was hard on myself. I vastly underestimated how long it would take to start building a client base and set of customer stories. There's so much still to learn, and several unresolved problems that I'm wrestling with - like funding for my open source work and projects.

I've become more comfortable with the ebb and flow of a business that is primarily based upon non-recurring revenue. You eat what you kill. In one month I may receive next to nothing financially, yet 30 days after that, I may see as much as a quarter of that year's total revenue deposited into the company account.

This year I've also been able to slowly convert some income from high-value marketing consulting to licensing and support. Why? Because my primary goal is to serve the needs of OpenFaaS users.

![My Cloud Native shed](/content/images/2021/12/shed.jpg)
> Making plans is overrated. I insulated this space to be my Cloud Native shed, and now it's my woodworking workshop. Things change, being adaptable is important to staying in the game.

So on to this year's highlights.

* Getting paid for more of the work I'm doing
* Seeing inlets become a product people pay for
* Starting and seeing the impact of Growlab
* Rediscovering woodworking and making things with my hands
* Becoming an eBook author
* Learning the fundamentals of positioning, sales and the business mindset
* Doubling down on my strategy for staying in the business of making OpenFaaS

## Build it and they will come

As entrepreneurs, our mission is to build something of value for a group of people, so useful that they would pay money for that saving in time, that utility, that increase in status or productivity.

On the other hand: many open source projects start out of scratching our own itch. Even Apple started from Steve and Wozniak wanting to own computers and to be able to democratise them for their friends.

[![Learning through reading and note-taking](https://pbs.twimg.com/media/FGzCxeoXsAIpPCS?format=jpg&name=small)](https://twitter.com/alexellisuk/status/1471765845407895552?s=20)
> A discipline that's paid off for me this year: reading, note-taking and experimentation.

So on one hand, business books will teach that one must first deeply understand a market, their problems, their dreams, their daily routines - as much as possible, before starting to build a solution to help them. And on the other - open source and some business success stories talk about a need or pain point that we ourselves know deeply.

Whatever way you go about this, from personal experience, or observing as an outsider - I saw a common theme in what I read. Experiment, prototype, test, iterate and defer.

And the most important change for this year was to get paid for the work I was doing, the value I was creating, the service I was giving.

### inlets - network tunnels reimagined for Cloud Native

I pivoted [inlets](https://inlets.dev/) this year from open source, with a separate commercial version, to a commercial version with open-source automation and tooling. Why? The Open Source model wasn't serving the needs of my business, all the value was given away for free in the open source version and only a few people saw value in paying for my time, skill and expertise.

![Inlets](https://blog.alexellis.io/content/images/2019/09/inletsio--2-.png)
> Inlets is a network tunnel that runs in userspace, is self-contained in a single binary and integrates deeply with containers and Kubernetes.

So I flipped this around. If you only used inlets because it was free, find an alternative (there are a bunch of them, with different tradeoffs) or pay for it. Teams were happy to pay the full price for inlets, and for 12 months up front, but the other segment of users were personal users like you and me. They were less happy to pay for 12 months up front, even if the target market was developers earning well over $100k a year.

I didn't want to build a complex billing, subscription and tax collection system, but I kept hearing that monthly billing was important. [Carlos, the creator of Goreleaser](https://twitter.com/caarlos0) mentioned that he'd just started selling his software using [Gumroad's license server](https://app.gumroad.com/api). So after taking a look at the API, I added support that day.

Read about it here: [Introducing the inlets monthly subscription](https://inlets.dev/blog/2021/07/27/monthly-subscription.html)

In a short period of time, inlets gained its first two dozen subscribers.

There was a little bit of churn here and there, and I also noticed that some people started to abuse the subscription - by paying for the month, then cancelling it immediately. Then a few weeks later paying for a month and cancelling it again. Eventually I reached out to one of these developers and he told me that he was "gaming the system" and only wanted to use the product some months of the year.

This could be a sign that the price for inlets is too low and attracting people who don't value it enough.

In the past, these people used to abuse the free trial - requesting a trial whenever they needed to use the software. One of the other things I did was to remove the free trial - so that users either pay for one month and invest something of themselves, or use an alternative that they are happy also meets their needs.

I want to be in business for a long time, that means that a proportion of people who only use my things because they are free, will leave. I'm OK with that.

### Growlab

I had previously incubated seeds indoors and seen better germination rates than outdoors. I'd even recorded the process with a Raspberry Pi in the past and created videos from it. This year was a very cold and windy start. So much so that many of the seeds I'd bought and planted just didn't convert into seedlings.

I wanted an enclosure to hold soil whilst the seeds had a chance to grow in the warmth, but I also wanted to record the progress with a camera, mounted over the top. I went out into the garden and realised that I didn't have a clue what I was doing. I spoke to a few friends and eventually decided that some copper pipe glued into a wooden base might do.

![The first growlab](https://growlab.dev/images/lab.jpg)
> The first growlab, one of many.

Given that I'd invested some time and resources into the project, I decided to build a community around it. First, I started sharing my own updates and using the [`#growlab`](https://twitter.com/search?q=%23growlab) hashtag - then I noticed people asking me questions about it. The Raspberry Pi and technological aspect was interesting to other developers and with the pandemic, many people were interested in growing their own food also.

Having learned a lot about sales and value that year, I thought I'd give the people a "What's in it for me" - primarily a contest, where they could win prizes by completing a set of achievements. The gamification worked quite well, and by the end of the year, there were 30 participants.

On the growlab website, I wrote up a few benefits that I'd heard people had received from the project:

* Learning new skills
* Connecting with others
* Being mindful in the present moment
* Giving to others

Each participant was called a *technician* - a citizen scientist who had built his or her own incubator - not only growing seeds, but sharing updates and encouraging others to get involved.

Checkout the [Growlab website](https://growlab.dev/)

### Woodworking renaissance

The word "renaissance" means "rebirth" and to some extent that's what happened to me with woodworking. Growlab was the catalyst for a renewed interest in working with wood and creating things with my hands. Many British children learn how to work with wood at an early age, but without the tools or motivation, this was something that I wasn't able to continue after leaving school.

For most of the year, I'd been focused on management and marketing, rather than on making. So when I realised that creating things with my hands gave me a similar sense of satisfaction to coding, it seemed like a natural hobby to invest in.

But it's not a hobby for the sake of it. A friend of mine had made a desk using tongue and groove flooring from a local big box store and I was so impressed, that I wanted to try my own projects too.

Here's a few of my projects from this year:

![My tusked seating bench](https://pbs.twimg.com/media/E-CqB3SXoAALdvg?format=jpg&name=small)
> One of my favourite projects - an outdoor seating bench with tusked mortise and tenon joinery.

The plans:

![The plans for the bench](https://pbs.twimg.com/media/E-CqDszXoAEvIpr?format=jpg&name=small)

> The cut list and plans for the bench

I wouldn't have even known where to start with this last year.

I made my first wrist-rest for my mechanical keyboard using very primitive tools and found that other people wanted these too.

![Wrist rest](https://pbs.twimg.com/media/E8H7bHAWYAE1xJG?format=jpg&name=small)
> One of my earliest wrist rests

[You can buy one here](https://openfaas.gumroad.com/l/wrist-rest).

The highlight of my woodworking journey has to be the three Butcher Blocks that I was able to gift to family members as Christmas presents.

![Butcher Block](https://pbs.twimg.com/media/FHxSL_GXEAswlxC?format=jpg&name=small)
> My wife holding her bonus Christmas gift of a Butcher Block made by yours truly.

### Becoming an eBook author

I wrote and launched my first eBook in January 2021 - [Serverless For Everyone Else](https://openfaas.gumroad.com/l/serverless-for-everyone-else). It's a handbook for building functions in JavaScript with faasd - the version of OpenFaaS that can run on a single VM or Raspberry Pi. Reception was better than expected and I matched the total sponsorships via GitHub for the OpenFaaS account in one month of sales.

I then went back to my business plan and ideas that I'd written down in 2019 when setting up the business. I wanted to write a book about my Go blog posts that had done so well throughout the years. Refreshing, updating and extending the most popular content on crafting CLIs, unit-testing like your live depended on it and integrating metrics and monitoring. It was called [Everyday Go](https://gum.co/everyday-golang) and you can read a bit more about it here: [I wrote a book about Everyday Go](https://blog.alexellis.io/i-wrote-a-book-about-golang/)

Read more about my self-publishing journey: [I wish I'd self-published sooner](https://blog.alexellis.io/one-year-of-self-publishing/)

### All the books you can read

Around May time, [I set up an Amazon Wishlist](https://www.amazon.co.uk/hz/wishlist/ls/3N6F3YMWH6J7Q?ref_=wl_share) called "Books I'd like to read" and something unexpected happened. People started to send me books from the list and I got used to seeing an Amazon Prime driver come by the house every few days.

For each book, sent to me I write the name and date on the front cover. That means I'll think of you whenever I pick it up.

Some of my favourite books from this year:

* [The 1-Page Marketing Plan: Get New Customers, Make More Money, And Stand Out From The Crowd by Alan Dibb](https://amzn.to/3pALodu)
* [7 Strategies for Wealth & Happiness: Power Ideas from America's Foremost Business Philosopher - Jim Rohn](https://amzn.to/3qwxjgu)
* [Zig Ziglar's Secrets of Closing the Sale](https://amzn.to/316QiWa)
* [Million Dollar Consulting by Alan Weiss](https://amzn.to/3zajjg5)

Alan Dibb helped me understand pricing, premium branding, unique selling points and positioning.

[Jim Rohn](https://en.wikipedia.org/wiki/Jim_Rohn) helped me understand that seasons can apply to business in the same way that they did to growlab. He suggests going with the flow, and having a mindset of belief and action. There are many recordings on YouTube that you can listen to such as: [How to Take Charge of Your Life](https://www.youtube.com/watch?v=DGIjuVbGP_A)

[Zig Ziglar](https://en.wikipedia.org/wiki/Zig_Ziglar) helped me understand the difference between price and cost, between suspects and prospects - people ready to waste my time & resources and people who might be a good fit for my business.

Alan Weiss helped hammer home the difference between selling time and selling value. This mindset is ultimately what gave me the confidence to build a premium consulting brand and to know when to walk away from a deal.

I also found fresh inspiration for my entrepreneurial journey through [Tony Robbins' podcast](https://www.tonyrobbins.com/podcasts/). He interviews successful founders who are not afraid to share their struggle and where they've come from.

Now, someone asked me on Twitter whether I read the books people send me. For one - the books are those that I've chosen ahead of time and prioritised [on my wishlist](https://www.amazon.co.uk/hz/wishlist/ls/3N6F3YMWH6J7Q?ref_=wl_share). Many of them have a core message that you receive after reading 3-5 chapters and then go on to solidify throughout the remaining pages.

If you'd like to know my thoughts on each, you can find my reviews and insights in my Insiders' Updates Archive going back to 2019: [Insiders' Portal](https://insiders.alexellis.io/)

### Changes for OpenFaaS

A couple of weeks ago, [I wrote about Operation Getting Paid](https://insiders.alexellis.io/) - a broad strategy to move from giving away my time, expertise and knowledge for free, to being paid instead.

This has involved more investment into OpenFaaS Pro - a commercial distribution of OpenFaaS for production use. Some consulting to understand more deeply the challenges faced by OpenFaaS users and to inform the roadmap, and to automate/offload some of the support demand from the project through training materials like [Serverless For Everyone Else](https://openfaas.gumroad.com/l/serverless-for-everyone-else).

[faasd](https://github.com/openfaas/faasd) has seen its API filled out, now there's very little that it cannot do. faasd is also being used to run my social media, Gumroad and [Derek integrations](https://www.openfaas.com/blog/migrating-derek-from-docker-swarm/).

[OpenFaaS Pro](https://openfaas.com/support/) now has a function builder that can scale well for large users - where they don't want to maintain 2000-5000 GitLab jobs, but instead want an API that exchanges code for a container image. The OpenFaaS Kafka integration has been hardened and tuned with customers in production and is happily churning away at millions of records per hour for them.

We celebrated the 5th Birthday for OpenFaaS this month. Not only have we served the needs of many users in production, but we've also helped community contributors to grow and in some instances triple their salary, way above even my own earnings at the time.

Learn how OpenFaaS impacted the serverless community through the lens of its contributors.

[![GopherCon UK 2021: Alex Ellis - Zero to OpenFaas in 60 months](https://pbs.twimg.com/media/FHxYswaWQAALLAq?format=jpg&name=small)](https://www.youtube.com/watch?v=QzwBmHkP-rQ)

Watch now:

[GopherCon UK 2021: Alex Ellis - Zero to OpenFaas in 60 months](https://www.youtube.com/watch?v=QzwBmHkP-rQ)

## Wrapping up

I'd like to thank my clients for taking a risk on an independent entrepreneur and for coming back for repeat business. Thanks to [my GitHub Sponsors](https://insiders.alexellis.io/) for generating just enough recurring revenue so that I can continue to dedicate a portion of my time to open source. So if you'd like to see that continue, you can [support it here](https://github.com/sponsors/alexellis).

If you're building your own independent business or open source project and want to chat with me, I can offer you a 1:1 via [my Calendly page](https://calendly.com/alexellis). [Insiders](https://insiders.alexells.io) save around 50% on the cost and a 20% discount code for all my [eBooks on Gumroad](https://store.openfaas.com).