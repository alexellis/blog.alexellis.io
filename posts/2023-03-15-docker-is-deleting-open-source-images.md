---
title: "Docker is deleting Open Source organisations - what you need to know"
slug: "docker-is-deleting-open-source-images"
date: "2023-03-15T10:56:54Z"
author: "Alex Ellis"
meta_title: "Docker is deleting Open Source organisations - what you need to know"
meta_description: "This controversial decision coupled with poor messaging has created anxiety the Open Source community. Learn what's happening and how we can move forward."
feature_image: "/content/images/2023/03/docker-search.jpg"
tags:
  - "docker"
  - "community"
  - "open source"
  - "github"
---

Coming up with a title that explains the full story here was difficult, so I'm going to try to explain quickly.

Yesterday, [Docker](https://docker.com) sent an email to any Docker Hub user who had created an "organisation", telling them their account will be deleted including all images, if they do not upgrade to a paid team plan. The email contained a link to a tersely written PDF (since, silently edited) which was missing many important details which caused significant anxiety and additional work for open source maintainers.

> As far as we know, this only affects organisation accounts that are often used by open source communities. There was no change to personal accounts. Free personal accounts have a [a 6 month retention period](https://www.docker.com/blog/scaling-dockers-business-to-serve-millions-more-developers-storage).

Why is this a problem?

1. Paid team plans cost [420 USD per year (paid monthly)](https://twitter.com/alexellisuk/status/1637942604779143168?s=20)
2. Many open source projects including ones I maintain have published images to the Docker Hub for years
3. Docker's Open Source program is hostile and out of touch

Why should you listen to me?

I was one of the biggest advocates around for Docker, [speaking at their events](https://blog.alexellis.io/dockercon-2017-captains-log/), contributing to their projects and being a loyal member of their voluntary influencer program "[Docker Captains](https://www.docker.com/blog/inside-look-docker-captains-program/)". I have written dozens if not hundreds of articles and code samples on Docker as a technology.

I'm not one of those people who think that all software and services should be free. I pay for a personal account, not because I publish images there anymore, but because I need to pull images like the base image for Go, or Node.js as part of my daily open source work.

When one of our OpenFaaS customers grumbled about paying for Docker Desktop, and wanted to spend several weeks trying to get Podman or Rancher Desktop working, I had to bite my tongue. If you're using a Mac or a Windows machine, it's worth paying for in my opinion. But that is a different matter.

Having known [Docker's new CTO](https://twitter.com/justincormack) personally for a very long time, I was surprised how out of touch the communication was.

I'm not the only one, you can read the reactions [on Twitter](https://twitter.com/alexellisuk/status/1635679295891812359?s=20) (including many quote tweets) and on [Hacker News](https://news.ycombinator.com/item?id=35154025).

Let's go over each point, then explore options for moving forward with alternatives and resolutions.

## The issues

1. The cost of an organisation that hosts public images has risen from 0 USD / year to [420 USD / year (paid monthly)](https://www.docker.com/pricing/). Many open source projects receive little to no funding. I would understand if Docker wanted to clamp down on private repos, because what open source repository needs them? I would understand if they applied this to new organisations.

2. Many open source projects have published images to the Docker Hub in this way for years, [openfaas](https://github.com/openfaas/faas) as far back as 2016. Anyone could cybersquat the image and publish malicious content. The OpenFaaS project now publishes its free Community Edition images to GitHub's Container Registry, but we still see thousands of pulls of old images from the Docker Hub. Docker is holding us hostage here, if we don't pay up, systems will break for many free users.

3. Docker has a hostile and out of touch definition of what is allowable for their Open Source program. It rules out anything other than spare-time projects, or projects that have been wholly donated to an open-source foundation.

> "Not have a pathway to commercialization. Your organization must not seek to make a profit through services or by charging for higher tiers. Accepting donations to sustain your efforts is permissible."

This language has been softened since the initial email, I assume in an attempt to reduce the backlash.

[Open Source has a funding problem](https://blog.alexellis.io/the-5-pressures-of-leadership/), and Docker was born in Open Source. We the community were their king makers, and now that they're [turning over significant revenue](https://sacra.com/c/docker/), they are only too ready to forget their roots.

## The workarounds

Docker's [CTO commented informally on Twitter](https://twitter.com/justincormack/status/1635706522419200004?s=20) that they will shut down accounts that do not pay up, and not allow anyone else to take over the name. I'd like to see that published in writing, as a written commitment.

In an ideal world, these accounts would continue to be attached to the user account, so that if for some reason we wanted to pay for them, we'd have access to restore them.

Squatting and the effects of malware and poison images is my primary concern here. For many projects I maintain, we already switched to publishing open source packages to GitHub's Container Registry. Why? Because Docker enforced [unrealistic rate limits](https://docs.actuated.dev/tasks/registry-mirror/) that means any and every user who downloads content from their Docker Hub requires a paid subscription - whether personal or corporate. I pay for one so that I can download images like Prometheus, NATS, Go, Python and Node.

### Maybe you qualify for the "open source" program?

If the project you maintain is owned by a foundation like the CNCF or Apache Foundation, you may simply be able to apply to Docker's program. However if you are independent, and have any source of funding or any way to financial sustainability, I'll paraphrase Docker's leadership: "sucks to be you."

Let's take an example? The [curl project maintained by Daniel Stenberg](https://daniel.haxx.se/) - something that is installed on every Mac and Linux computer and certainly used by Docker. Daniel has a consulting company and does custom development. Such a core piece of Internet infrastructure seems to be disqualified.

<blockquote class="twitter-tweet" data-conversation="none"><p lang="en" dir="ltr">There is an open-source exemption, but it&#39;s very strict (absolutely no &quot;pathway to commercialization&quot; - no services, no sponsors, no paid addons, and no pathway to ever do so later) and they&#39;re apparently taking &gt;1 year to process applications anyway.</p>&mdash; Tim Perry (@pimterry) <a href="https://twitter.com/pimterry/status/1635757752587829249?ref_src=twsrc%5Etfw">March 14, 2023</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

### Cybersquat before a bad actor can

If you are able to completely delete your organisation, then you could re-create it as a free personal account. That should be enough to reserve the name to prevent hostile take-over. [Has Docker forgotten Remember leftpad?](https://qz.com/646467/how-one-programmer-broke-the-internet-by-deleting-a-tiny-piece-of-code)

This is unlikely that large projects can simply delete their organisation and all its images.

If that's the case, and you can tolerate some downtime, you could try the following:

* Create a new personal user account
* Mirror all images and tags required to the new user account
* Delete the organisation
* Rename the personal user account to the name of the organisation

### Start publishing images to GitHub

[GitHub's Container Registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry) offers free storage for public images. It doesn't require service accounts or long-lived tokens to be stored as secrets in CI, because it can mint a short-lived token to access ghcr.io already.

Want to see a full example of this?

We covered it on the actuated blog: [The efficient way to publish multi-arch containers from GitHub Actions](https://actuated.dev/blog/multi-arch-docker-github-actions)

If you already have an image on GitHub and want to start publishing new tags there using GitHub's built-in GITHUB_TOKEN, you'll need to go to the Package and edit its write permissions. Add the repository with "Write" access.

Make sure you do not miss the "permissions" section of the workflow file.

![Setting up write access](/content/images/2023/03/write_access--1-.png)
> How to set up write access for an existing repository with GITHUB_TOKEN

### Migrate your existing images

The crane tool by Google's open source office is able to mirror images in a much more efficient way than running docker pull, tag and push. The pull, tag and push approach also doesn't work with multi-arch images.

Here's an example command to list tags for an image:

```
crane ls ghcr.io/openfaas/gateway | tail -n 5

0.26.1
c26ec5221e453071216f5e15c3409168446fd563
0.26.2
a128df471f406690b1021a32317340b29689c315
0.26.3
```

The `crane cp` command doesn't require a local docker daemon and copies directly from one registry to another:

```
crane cp docker.io/openfaas/gateway:0.26.3 ghcr.io/openfaas/gateway:0.26.3
```

On Twitter, a full-time employee on the CNCF's [Harbor](https://goharbor.io/) project also explained that it has a "mirroring" capability.

## Wrapping up

Many open source projects moved away from the Docker Hub already when they started rate-limiting pulls of public open-source images like Go, Prometheus and NATS. I myself still pay Docker for an account, the only reason I have it is to be able to pull those images.

I am not against Docker making money, I already pay them money and have encouraged customers to do the same. My issue is with the poor messaging, the deliberate anxiety that they've created for many of their most loyal and supportive community users and their hypocritical view of Open Source sustainability.

If you're using GitHub Actions, then it's easy to publish images to GHCR.io - you can use the example for the [inlets-operator](https://actuated.dev/blog/multi-arch-docker-github-actions) I shared.

But what about GitHub's own reliability?

I was talking to a customer for [actuated](https://actuated.dev) only yesterday. They were happy with our product and service, but in their first week of a PoC saw downtime due to GitHub's increasing number of outages and incidents.

We can only hope that whatever has caused issues almost every day since the start of the year is going to be addressed by leadership.

Is GitHub perfect?

I would have never predicted the way that Docker changed since its rebirth - from the darling of the open source community, on every developer's laptop, to where we are today. So with the recent developments on GitHub like Actions and GHCR only getting better, with them being acquired by Microsoft - it's tempting to believe that they're infallible and wouldn't make a decision that could hurt maintainers. All businesses need to work on a profit and loss basis. A prime example of how GitHub also hurt open source developers was when it cancelled all Sponsorships to maintainers that were paid over PayPal. This was done at very short notice, and it [hit my own open source work very hard](https://github.com/sponsors/alexellis) - made even worse by the global downturn.

Are there other registries that are free for open source projects?

I didn't want to state the obvious in this article, but so many people contacted me that I'm going to do it. Yes - we all know that [GitLab](https://gitlab.com) and [Quay](https://quay.io) also offer free hosting. Yes we know that [you can host your own registry](https://blog.alexellis.io/get-a-tls-enabled-docker-registry-in-5-minutes/). There may be good intentions behind these messages, but they miss point of the article.

What if GitHub "does a Docker on us"?

What if GitHub starts charging for open source Actions minutes? Or for storage of Open Source and public repositories? That is a risk that we need to be prepared for and more of a question of "when" than "if". It was only a few years ago that Travis CI was where Open Source projects built their software and collaborated. I don't think I've heard them mentioned since then.

Let's not underestimate the lengths that Open Source maintainers will go to - so that they can continue to serve their communities. They already work day and night without pay or funding, so whilst it's not convenient for anyone, we will find a way forward. Just like we did when Travis CI turned us away, and now Docker is shunning its Open Source roots.

See what people are saying on Twitter:

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Is Docker saying that the OSS openfaas organisation on Docker Hub will get deleted if we don&#39;t sign up for a paid plan?<br><br>What about Prometheus, and all the other numerous OSS orgs on the Docker Hub?<br><br>cc <a href="https://twitter.com/justincormack?ref_src=twsrc%5Etfw">@justincormack</a> <a href="https://t.co/FUCZPxHz1x">pic.twitter.com/FUCZPxHz1x</a></p>&mdash; Alex Ellis (@alexellisuk) <a href="https://twitter.com/alexellisuk/status/1635679295891812359?ref_src=twsrc%5Etfw">March 14, 2023</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

## Updates

**Update: 17 March**

There have been hundreds of comments on Hacker News, and endless tweets since I published my article. The community's response has been clear - abject disappointment and confusion.

[Docker has since published an apology](https://www.docker.com/blog/we-apologize-we-did-a-terrible-job-announcing-the-end-of-docker-free-teams/), I'll let you decide whether the resulting situation has been improved for your open source projects and for maintainers - or not.

The requirements for the "Docker-Sponsored Open Source (DSOS)" program have not changed, and remain out of touch with how Open Source is made sustainable.

**Update: 24 March**

Over 105k people read my article and hundreds of people voiced their concerns on both Hacker News and Twitter, following this pressure, Docker Inc reconsidered their decision.
 
10 days later, they emailed the same group of people - ["We’re No Longer Sunsetting the Free Team Plan"](https://www.docker.com/blog/no-longer-sunsetting-the-free-team-plan/)