---
title: "The Five Pressures of Leadership in OSS"
slug: "the-5-pressures-of-leadership"
date: "2019-09-17T09:05:25Z"
author: "Alex Ellis"
meta_title: "The Five Pressures of Leadership in OSS"
meta_description: "Learn The Five Pressures that I have encountered over the past five years of building, leading, and maintaining Open Source Software (OSS) with community."
tags:
  - "essay"
  - "oss"
  - "empathy"
  - "leadership"
  - "open source"
---

In this post I want to introduce the reader to five pressures that I have encountered over the past five years of building, leading, and maintaining Open Source Software (OSS) with community. This essay is primarily about being a leader in Open Source, but I believe [it applies outside of technology](https://www.amazon.co.uk/How-Survive-Thrive-Church-Leader/dp/1854247611) too.

> My aim is to foster understanding and empathy between contributors, community members, users, and maintainers. I would also like for maintainers and leaders in Open Source to feel a sense of solidarity in their shared burden.

It is often said that Open Source Software is not sustainable, because it has no inherent business model, but I believe there are other pressures that leaders experience which when left unchecked may lead to "burn-out".

I'll briefly describe what I believe leadership means before introducing each of the pressures and how they may be experienced. It's my opinion that the examples apply beyond Open Source Software and the technology industry. I will then sum up the pressures and make a case for sustainable leadership.

As a disclaimer, I've generalised my experience and what I've shared here. I am not referring to any one person, even if you can identify with what I'm saying.

## What is leadership?

The Oxford English Dictionary defines leadership as a noun:

* the action of leading a group of people or an organization.

    Synonymns: guidance, direction, authority, control, management, superintendence, supervision; organization, government, orchestration, initiative, influence

* the state or position of being a leader.

    Synonymns: headship, directorship, direction, governorship, governance, administration, jurisdiction, captaincy, superintendency, control, ascendancy, rule, command, power, mastery, domination, dominion, premiership, sovereignty

It is clear from the sheer amount of synonymns for the term, that the word itself can have many meanings and nauances. I would also suggest that the our own experiences and culture may project specific expectations and connotations.

For some Open Source maintainers, leadership may start unintentionally. A developer may become inspired to build an idea into a project and by default is the director and administrator. All of the control rests with them and at this stage the project is likely to be classed as be a Proof of Concept (PoC), an experiment or a "side-project." Other people are unlikely to be involved, but that may change quickly. The maintainer is the de factor leader in their team of one.

Some projects remain in this state, but others may draw in users and contributors who in turn volunteer their time, ideas, and energy to advance the project. The maintainer must now set a direction, communicate it, and begin to decide how to govern the project. For me mirroring the style of other maintainers and leaders I knew helped significantly. In my experience these skills can be learned "on the job", but it's easy to get things wrong.

In most companies there are two tracks for a career - either as an individual contributor or as a people-manager. Individual Contributors tend to be builders of things and have very technical work. They may also lead a team or hold responsibility depending on their level of seniority. [People managers have a very different set of skills](https://www.amazon.co.uk/Managing-Humans-Humorous-Software-Engineering/dp/1430243147) and deliver results for the business through delegation and by constantly communicating across teams.

In a corporation you are likely to have a very clearly defined role and hierarchy to fall into, but as an Open Source leader and maintainer your work will be a mixture of the two tracks.

This is an apt time to introduce the first pressure: unclear boundaries.

## 1. Unclear boundaries

What is your role? What does it say on LinkedIn, and on your business cards? Does that differ from what you actually do on a day to day basis? Do you work 1 in 3 weekends? Are you on rotation for on-call duties? Do you have reports?

As a leader of a community and an Open Source project, there is no job description and there are no set hours. One of the synomymns for leadership is governance, and that can cover how you and the project operate. I started to define a model for governance with a "Contributing Guide" which explains the process for raising an issue or requesting a change.

People who come to the project now look to me and the other primary contributors to operate within that governance model and for that reason it is important to do so. Some may not be aware of the processes and some even chose to ignore them. I believe that leaders need to be flexible, but if they say one thing and to do another continually, then it sets a confusing example for others to follow.

When I began I enjoyed the interest in my projects from users and contributors from all around the world. People would contact me at all hours of the day and night and I wanted to reply to every notification and email within minutes, if I could. I quickly found that I wouldn't be able to keep that up.

Having no clear hours means that unless you are careful, that you are actually on-call 27/4, 365 days, even when you're on vacation.

If left unchecked then unclear boundaries can lead to an intermingling of the leader's self with the project and team. I believe that this is understandable given the investment and stake the leader has, but gaining validation and self-worth through the success or failure, growth rate or decline of something outside of their control is a recipe for burning out.

Rather than being able to celebrate past achivements, the leader may start to feel pressure to grow the project to compete with similar product offerings. Those products may be built by companies with well-staffed teams and 7-figure budget, so it is not unly unatainable, but unfair.

The pressure of unclear boundaries means that users and other contributors may bring unreasonable expectations to your door and you may feel obliged to do what is asked of you.

## 2. Pay

Whilst the curve for leadership positions within a corporation inflects up steeply, this is simply a different matter in Open Source and those involved in other types of public service.

In my opinion there is no clear business model for Open Source Software, which means there is also no reason for someone to pay me for maintaining or building that software. A friend recently explained this to me in terms of "value capture", which I found immensely useful.

OSS allows companies and other OSS projects to stand on the tall shoulders of those that came before, and to either enhance or to put a new spin on prior work. That means capturing and amplifying existing value for something new.

In the same way that I cannot and will not be able to afford to pay the Golang development team for their many years of efforts that I leverage in my work. It seems equally unlikely that an end-user company will be able to pay me for the value I have created for them, that they capture and amplified in their business. 

> It is liberating to remove the unrealistic and unreasonable expectation that end-user companies should pay us for our work.

Given that maintaining and building features for OSS can take a significant amount of time, this leaves maintainers with only a few options. Such as the following:

* Work full-time for a company, and overtime for the OSS project in your evenings and weekends
* Work part-time consulting through your own company, and part-time without pay for your OSS project
* Find a co-founder, seek out investment, and build a commercial product from the project
* Don't earn a salary at all, and work for full-time without pay on the OSS project
* Close the OSS project, or pass the mantle on to someone else

There are some exceptions where developers are recruited and paid to work on Open Source projects for a variety of reasons. This is much different than a maintainer being hired specifically to maintain and build the project they lead.

You will also note that I did not include ["sponsorship" as an option](https://github.com/users/alexellis/sponsorship), this is because in my experience sponsorship is a hard sell and difficult to do meaningfully. I currently view sponsorship as a top-up mechanism to part-time consulting, rather than as a means to an end.

Whichever option a maintainer picks, there will always be a significant amount of money left on the table. This is a pressure that can build over time, especially when compared to peers working for a company.

## 3. Working with volunteers

Has anyone ever asked you to do them a favour?

It may be something as simple as getting a latte for a colleague on your coffee run, helping your neighbour move house, giving your wife a lift to work because her car is in at the mechanic's, reaching into your pocket to give change to someone on the street, going bowling for a work outing, or even setting up a new printer for a relative.

How did you feel about the ask? "It depends" you say. It depends on the relationship, how much it inconveniences you, and what you may get back in return. I know that if it's my turn to buy dinner, next time I meet my friend, he will be paying.

With the example of taking my wife to work, it's highly unlikely that I'd flake. I can't think of anything I'd rather do less than setting up a relative's printer and I would easily change my mind about the work bowling trip.

I believe that when leading an Open Source project or a community, that volunteers are essential to its success. As a maintainer, your pay is already below par and funding is unlikely to be bountiful. So relying on goodwill, favours, and external contributions become ever more important as the project grows. Not to mention that to grow and extend the impact of your project, you will need to delegate responsibility and duties to other people.

Other leaders will be quick to tell you to "just delegate". In my experience delegation is key to growing a community and for motivating others to act not only in their own interest, but for the common good.

If a maintainer starts a project on their own, then it may be hard to draw in contributors who feel the same sense of ownership and stake in it. This is where your leadership skills come in, to communicate, to attract, to set a vision, to coach, to guide, and to be available.

Delegation to volunteers can be tricky, even the most dedicated individuals can at times fail to follow-through. Some contributors even disappear without a trace after months, which can be confusing for all involved. The book [Clean Coder by Robert C. Martin](https://www.amazon.co.uk/Clean-Coder-Conduct-Professional-Programmers/dp/0137081073) outlines the differences between saying Yes and saying No as a professional. I found it useful in my career and I think it applies equally well to OSS.

> "Indeed, good managers crave someone who has the guts to say no. It’s the only way you can really get anything done." Robert C. Martin

Whenever I've brought up this topic in the business world I am frequently told that "money does not motivate" and I would agree with that sentiment, but accountability does. The reason we come into work on a Monday morning and leave at 5.30pm is because we're contractually obliged to do so and our manager and colleagues will keep us to account if we do not. If I chose to volunteer to work late or come in early to help the business, then that would be my decision and privilege.

So what model can we use for effective delegation to volunteers? Sometimes we may be delegating work that we should not and can not. Read [The Delegation Matrix of President Eisenhower](https://jamesclear.com/eisenhower-box) to find out if you can make some changes. If accountability is difficult, then set up a milestone such as a date to review a task or a demo at a meet-up or community meeting so that the volunteer has something to focus them.

The pressure for maintainers is that they can feel the full weight of the project on their shoulders because the burden isn't shared equally.

## 4. Burden of responsibility

Whether in a social-group, a family, a project team at a company, or an open source project, leaders can often feel a burden of responsibility.

The Oxford Dictionary defines "responsibility" as:

* the state or fact of having a duty to deal with something or of having control over someone.

    Synonyms: authority, control, power, leadership, management, influence; duty

* the state or fact of being accountable or to blame for something.

    Synonyms: blame, fault, guilt, culpability, liability

Can you think of the person who always organized the events in your family group? Perhaps they felt it was their duty. Was there someone who seemed to be able to direct the group in a certain way? Maybe they hold influence or simply led the way once and have continued to do so. Are you the one in the household who unblocks the sink when it gets blocked? Well, that is your responsibility, right? Who else would do it?

The above are examples of responsibility, and according to the dictionary, it is another way of saying "being held to account." In the previous section I made the case that communities rely on volunteers to make them work and grow, but that goodwill is necessary and the lack of accountability means the leader may have to pick up the pieces.

The pressure of responsibility can lead to feelings of being blamed by users who may bring unreasonable expectations. If you are the only person liabile for the project's success or failure, then it can produce a feeling of guilt. In my experience, guilt motivates an unsustainable work ethic and is not at all kind, it's certainly not the reason I began my journey.

## 5. Loneliness

There is a difference between loneliness and being alone and this time we won't consult the dictionary, but the common human experience. However much of a socialite or extrovert one may be, there can be a time where all people feel a level of isolation, misunderstood, or unable to make the grade.

The above can be particularly true when pioneering something new or moving the community and project in a direction which outwardly may not make sense.

I want to suggest that Open Source communities and development is seasonal. Over the holidays and during the summer I have noticed a lull in activity from even the most committed members. It appears to be common for very active developers to leave communities suddenly and to stop all communication. In the workplace, there would be a notice period, and a process of handing over in-progress work and knowledge transfer. I would suggest documenting a process for stepping down and making it part of the contribution guide.

If you have good individual relationships with each of your regular contributors, then you may know that they have taken a 3 week holiday, but if not, it could appear as if they have abandoned you, after all the time and energy you have invested in them.

Whilst I find it odd that someone who was vested in the project and who may developed a long friendship with me would leave that way, I've come to accept it. Changes in your role, your motivations, the project, the industry and other life-circumstances can all change the fine balance that enables a community member to contribute. 

Have you ever had to form goals at work? Perhaps they were part of the company's yearly appraisal process, or maybe you set some for your team. If that's the case then you'll be familiar with "SMART".

The website [corporatefinanceinstitute.com](https://corporatefinanceinstitute.com/resources/knowledge/other/smart-goal/) has the following definition:

> Specific, Measurable, Achievable, Realistic, and Timely. Therefore, a SMART goal incorporates all of these criteria to help focus your efforts and increase the chances of achieving that goal.

In other words SMART is a focused and sustainable strategy for getting a desire result. When someone in your community begins to increase their interest, communication, feedback and level of contribution, it can be tempting for maintainers to sigh a relief and enjoy the new status quo. This is a time that you should exercise caution, because that new level of actvity may not be sustainable or SMART, and it's on you to let them figure that out, or to guide the interaction.

To summarise, loneliness means that at times leaders may experience feelings of being misunderstood, under-appreciated, or disconnected.

## Conclusion

I have outlined five pressures of leadership: unclear boundaries, pay, working with volunteers, burden of responsibility, and loneliness.

In the introduction I wrote: 

> My aim is to foster understanding and empathy between contributors, community members, users, and maintainers. I would also like for maintainers and leaders in Open Source to feel a sense of solidarity in their shared burden.

I have focused on the pressures and have given examples where I can to relate to my own experience. I believe that to some extent these pressures are common to all leaders due to the nature of their work and calling.

For me the support of family, and friends has been essential to digging deep in the harder times and to persevering. If I could start over, or go back to offer advice to a younger self it would be to read this post and understand to start out with clear expectations.

This is what I'd say:

Boundaries may be unclear, therefore it's on you to set them and err on the more narrow and restrictive to begin with. Write down the hours or times at which you'll respond to questions, support users, blog posts, or onboard new contributors. Make those goals SMART. Check them and adjust them as needed.

Pay will be limited and there will always be money on the table, but since the business world tells us that pay doesn't motivate, work out what does and check that the cost is worth the reward. Talk to other leaders who you think may be in a similar position to see if you can help each other and learn a new perspective.

Working with volunteers can be one of the most rewarding and encouraging experiences of your life, but people are unpredictable and that is never going to change. What worked for one person one week may have a completely different effect the next. Use [The Delegation Matrix of President Eisenhower](https://jamesclear.com/eisenhower-box) as a model for increasing the impact of your project whilst lowering the risk of someone falling-through on a commitment. Get to know your contributors if you can and set an example for them to follow with your own SMART goals.

The Burden of Responsibility can be great, but it can also be imagined. If you have no paying customers, what is the worst thing that would happen if you shuttered your project tomorrow? Think it through and don't be held ransom to your own or other people's unreasonable expectations.

Loneliness can affect all people at any time, it's a normal part of the human condition. A team of volunteers may not always show up when they said they would. They may tend to prefer their own interests over the common good, and that's part of human nature. Successful leaders communicate constantly and build teams through relationships. Accept that volunteers are a help, but that they are not accountable. This mindset will help you understand what you can achieve through your own SMART goals. If you reset your expectations and size your ambition based upon what is fair, then it won't feel so lonely if you look back to see that you're running the show on your own.

> To finish I want to say to contributors and users, be kind to the leaders of your communities. And to leaders remember to be kind to yourself.

### Become an Insider

If you liked this post, you may also like "How to make PRs and influence people", "Open Source is not a zero-sum game", and "is Kubernetes right for us?" Subscribe to my Insiders Updates program to receive premium content via email, along with exclusive downloads and tips. 

[Become an Insider via GitHub Sponsors](https://github.com/sponsors/alexellis).