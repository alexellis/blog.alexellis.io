---
title: "The 90s UNIX Utility That Fell Out of Favour"
slug: "the-90s-unix-command-fell-out-of-favour"
date: "2025-08-15T08:09:48Z"
author: "Alex Ellis"
meta_title: "The 90s UNIX Utility That Fell Out of Favour"
meta_description: "I reminisce of the days of i386, Slackware Linux, and forgotten plaintext UNIX utilities that are still on modern Macs today."
tags:
  - "linux"
  - "UNIX"
---

The classic command `finger` is still found on MacOS and various other BSDs even today, but has fallen out of favour. Why?

For us over here in the UK, the term *finger* is rather loaded - and not in a good way, but I think it was rather innocuous in American English - perhaps like "fanny" which sounds profane to us, but only means *bottom* over there. Les Earnest coined the term whilst at the Stanford Artificial Intelligence Laboratory (SAIL) in 1971. You could be forgiven with today's hype for everything AI you'd misread that date - yes there was a AI lab even back then.

In Les' day, UNIX was born inside a lab - [Bell Labs](https://en.wikipedia.org/wiki/Bell_Labs) in a high trust environment, where network traffic was sent in plaintext, HTTPS wasn't a thing. Personal information about colleagues like their home phone numbers, and how long their terminal had been idle was not considered confidential. He wanted a way to enhance collaboration in the context of this environment.

**It's a UNIX system! I know this!**

When I grew up on very early versions of Linux - RedHat, [Slackware](http://www.slackware.com/), [LTSP](https://en.wikipedia.org/wiki/Linux_Terminal_Server_Project), and various others, we were using i386 and i486 machines, and *Pentium Inside* was just a glint in Intel's eye. There was even a "turbo" button on the front of them and I wondered why it wasn't always enabled at the time.

Everyone I knew used Windows, including the school where I had access to several large labs filled with networked machines. But somehow my curiosity led me to Linux, and I sent off for a free CDROM to install it on the old kit I had available. It goes without saying that I wrecked the family computer on a number of occasions - dual-booting Linux was not as seamless as it is today.

Before I knew it, I'd been given permission to run a bulky old i386 in a backroom at school, and named the host "abx.net" - Alex's box. I installed Linux, along with a custom Multi-User Dungeon (a kind of text role-playing game) server and used telnet from the various machines in the school to gain remote access and cut my teeth on bash.

**How a MUD taught me about finger**

My interest in MUDs - taught me about the finger command. You could run it, along with `who` to see who was logged into the server - for how long, if they were idle, if they had in-game email and when they last connected. Along with this, you could define a plan that would be printed out when someone ran the command.

I must have tried `finger` on abx.net, but my main usage was through the game - to see if my friends had been on that day.

Back on the Linux/UNIX world, finger was a daemon installed by default listening on port 79. It would reply with user info much like in the MUD.

**We've been watching you**

One day, one of the IT administration team at the school came to me and said: "I've been reading all your personal messages." At first I didn't believe him, then he called me by my "handle" (login name) for the MUD server I like to play using telnet. It turned out that they'd installed the equivalent of Wireshark and had been sifting through everyone's packets and snooping.

It felt like such an invasion of privacy, but was a wake-up call. I'm sure many others had this experience. Now what if that wasn't an indifferent IT admin, but someone with malicious intent?

**Your Mac is a UNIX**

Many developers write code that targets cloud servers running Linux, so having a similar environment locally is invaluable. MacOS is a certified UNIX, and whilst it has diverged significantly from those of old, it follows the classic approach of being pre-populated with bash and and all the utilities of old - some of which have been long deprecated.

One of those preinstalled, and deprecated utilities is `finger`, which joins the ranks of `write` - a way to send a message to other users logged onto the same machine.

Linux has become so cheap to access, so ubiquitous, that anyone who wants to run workloads can buy a computer. If you ever find yourself adding new user accounts, it's to run daemons like Nginx in a more defined scope, and not because you're sharing resources with other users. In the days of old, UNIX computers were too expensive for individuals to own.

Back to `finger` - here's what it looks like today on my MacBook Air M2:

```bash
alex@ae-m2 ~ % finger alex
Login: alex           			Name: alex
Directory: /Users/alex              	Shell: /bin/zsh
On since Fri  1 Aug 20:29 (BST) on console,       idle 13 days 11:43 (messages off)
On since Fri 15 Aug 07:54 (BST) on ttys000,       idle 0:10
On since Fri 15 Aug 07:52 (BST) on ttys001,       idle 0:11
On since Fri 15 Aug 08:13 (BST) on ttys002
No Mail.
```

If I create a .plan file in my home directory, it'll also be printed out:

```
Plan:
Replace all mass produced furniture with hand-made,
solid-wood, with a Shaker style.
```

The idea of the plan was to show others where we'd be, what we'd be working on - like an early version of a pinned Tweet/X post.

Now even back then, when people used rlogin and telnet and sent passwords in plaintext over the network, they still had some forms of cryptography.

And so you could define a `.publickey` - on my Mac I just copied in the contents of my `.ssh/id_rsa.pub` file.

```
Public key:
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQCz9jXsjtduAl5HelEOU3Fcrn/WjrkPV2waZfOKGgg6oycBOKEdy5FyJxB8jLTQ41m0H4Ht5tKIPa1KFrYs2MXkDDAyZiJD2fewhkEthLMX+1eu0SXWoH/Ei3S2TXeHKCQQsRzRzj7PNV/n0gcTzSpJdJjQUDTd7qct3dj4jhE+LYeJEBahEWIUR0o+E+XHfU8FQNL2iOTt7QBsceWR9A3C32vHA7Q9212g4VvWANwq6BhLFyUFWrdzhZL/Z/41TNyKNLCp02K6PxrheW6/OUoAjXQ93b27lle/KB9Uiv9M7oYnCnDhyrr/aaJ+p9QsD4UuQYBt6V2ELs+6lI2LMH/vQJrXhHVVu+Sma+1vPtcLM/PYOvYheEKAU1SMZijEVhytHQGX09BrbH1fskG1XBlONgjVfy4CXu6HnlSWOVIN3pPG+UYxm5u6XClJoMUvX0nmlUG5Czd7CtDb7aNNTNx+VG4vl0AUGd1vJM5+z6QYR+drVeBQbculroWQycy1p98= alex@ae-m2.broadband
```

Today, GitHub has a modern version of this, and so I can get the public SSH keys of any user (who has configured them to be shared):

```bash
curl https://github.com/alexellis.key
```

I often use this with colleagues and customers for support, or to set up shared access to Linux servers. 

Modern Ubuntu has a utility built into its installer that relies on this feature to prepopulate your SSH keys onto a new host, and if you forget, a utility named `ssh-import-id-gh`.

If you've ever run `adduser`, then you may also wonder why you get prompted for the following, on a machine designed for a single human user?

* Office
* Home Phone Number
* Office Phone Number
* Location

This goes back to the original designation of UNIX systems within labs and educational institutions as multi-user, and collaborative, high-trust environments.

Those fields get saved in the /etc/passwd file and are known as [GECOS](https://en.wikipedia.org/wiki/Gecos_field) - harking back to mainframe systems that even predate UNIX - General Comprehensive Operating System.

And guess what? If you populate them, they'll show up on `finger`.

**Is finger alive and well?**

Sadly, for various reasons, finger (like my beloved [GeoCities](https://en.wikipedia.org/wiki/GeoCities)) fell out of fashion. Today, each computer tends to only run one user account and is not exposed directly on the Internet. We live in a low-trust environment, where personal information can and will be used for malice, and social media or messaging apps have replaced our need to share updates, and contact information.

HTTP could have also been for the chopping block, but having been enhanced with TLS encryption, it's remained a key part of our daily workflow, along with other protocols that also gained TLS or modern equivalents. Telnet was replaced by SSH, SMTP gained encryption. The mail utility got switched out for web-based clients.

But adding encryption to finger, wouldn't have fixed the personal data it was leaking. And having said that - I'm sure many people leak far worse than their plans and last login time on social media platforms today.

So what are we left with? As I mentioned earlier, if I want to share my SSH key, I'll set it on GitHub and send someone to `https://github.com/alexellis.keys`. If I want to share my plans - like "I'm attending this conference on these days" - I'll Tweet and pin it to my profile. [GitHub even allows for a custom README](https://docs.github.com/en/account-and-profile/how-tos/setting-up-and-managing-your-github-profile/customizing-your-profile) - a bit like a .plan or .project file to display custom information on your profile.

There are many other utilities like `finger` which are now considered obsolete, but are kept around for prosperity. Here are just a few:

* `chfn` - change your GECOS data for finger
* `write` - send a message to another user logged into the same host
* `mail` - this can send emails, but is also used to mail users on the same host. Try mailing yourself on your Mac? `mail $(whoami)` - type in some text, then hit Control + D... then type `mail` and read it back
* `uucp` - UNIX to UNIX `cp` copy - a way to queue up file transfers for parital avaiability such as over a dial-up model
* `telnet` - similar to netcat, connect to another host using plaintext on a set port - we used this for remote administration and to connect to MUD games

Linux systems such as Ubuntu LTS have already dropped `finger`, but it's only an `apt install` away. MacOS ships finger which is already obsolete and insecure for various reasons, but funnily enough `telnet` is not available.

As a side note `w` and `last` are handy tools on Linux servers to check to see who else is logged in, or who has logged in recently.

**Why did I write this blog post?**

I'm not trying to show how old I am, or to brag that I used Linux as a youth. No, I feel privileged for having had Linux and GNU utilities in my life in those early, formative years. I wanted to connect you back to the past - those of you who are younger than me, or even older but have used Windows exclusively.

`finger` is a part of the past, and its deprecation a reflection of how our times have changed. For now it's still available on your Mac, so try it out if you're curious. Write a .plan file, dream for a moment of how this could replace your Twitter addiction, how the `mail` command could replace endless Slack notifications. Dream about running telnet over the Internet, and typing in your password in plaintext, and nothing had happening!

Mastodon users may also be quick to remind us of a new project named [WebFinger](https://en.wikipedia.org/wiki/WebFinger) for federating users between different decentralised social media platforms. I don't see it as the same thing.

**If GitHub is the new finger, then let's do this thing right**

As I indulge myself with this blog post, I used an LLM to scaffold a finger server in Golang, and instead of sourcing personal information from your computer, it regurgitates handy information that's already publicly available via your GitHub Profile. All on the console - and in the day of AI agents, and our connection back to bash scripting, perhaps it's time to play with `finger` again, and to close those Chrome tabs?

> It's not too hard to implement the good old protocols of old like HTTP, POP3, and Finger. Just read their respective [RFCs](https://datatracker.ietf.org/doc/html/rfc1288)

![finger-github](/content/images/2025/08/finger-github.jpg)

I'll probably have to take down the finger server because we can't have nice things on the Internet these days. But whilst it's up, you can install a finger client, or use the built-in one, and run `finger alexellis@f.o6s.io` replacing `alexellis` with a GitHub user of your choice.

To try it out run the following:

```bash
# Get my profile
finger alexellis@f.o6s.io

# Look up Linus Torvalds
finger torvalds@f.o6s.io
```

The data is publicly available on GitHub and read from [https://github.com/alexellis](https://github.com/alexellis) and [https://github.com/alexellis.keys](https://github.com/alexellis.keys).

Last of all, I was surprised and a little disappointed at how suspicious folks are today of running a built-in, 54-year old UNIX utility, that's already on your computer. If you're worried about a command or don't know what it does - you can of course just Google it, ask an LLM, or simply go old-fashioned and use a man page, it's much quicker: `man finger`.

*Addendum*

John Carmack is a legend. He wrote Doom and founded id software. As a special privilege, a few of us were allowed to clean down the beige computers and equipment in the IT labs, then after as a treat we could play a multi-player LAN deathmatch of Doom. And yes just like those [old photos you'll find on Wikipedia](https://en.wikipedia.org/wiki/LAN_party).

[In a Slashdot interview](https://games.slashdot.org/story/99/10/15/1012230/john-carmack-answers), he explained how he used Windows NT for development and that other platforms at the time weren't up to scratch. So it's surprising that he's known for his .plan files. The files were a kind of progress-tracker for him (like Jira/Notion), you can [find some highlights here under a post named "The Carmack Plan"](https://garbagecollected.org/2017/10/24/the-carmack-plan/) and in [a GitHub repository](https://github.com/oliverbenns/john-carmack-plan) that claims to have his entire collection from 1996-2010. From reading a few samples - it reads like a modern git commit log, or a changelog attached to a new release of a product. He kept colleagues and the community up to date with what he was working on.

I find this kind of terminal-based workflow really attractive. Who needs Trello when you have a .plan file?

For comments, questions and suggestions, hit me up on Twitter/X: [https://x.com/alexellisuk](https://x.com/alexellisuk)

**You may also like:**

[GitHub Actions as a time-sharing supercomputer](https://blog.alexellis.io/github-actions-timesharing-supercomputer/) - including an OSS tool to run batch jobs on GitHub Actions using hosted or self-hosted runners.

For my eBooks on Go, Serverless and Netbooting the Raspberry Pi, see the [OpenFaaS Gumroad Store](https://store.openfaas.com)

For my various Open Source tools and projects: [https://github.com/alexellis](https://github.com/alexellis)