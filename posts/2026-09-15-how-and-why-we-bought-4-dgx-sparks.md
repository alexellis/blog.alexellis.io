---
title: "How and Why We Bought 4x DGX Sparks"
slug: "how-and-why-we-bought-4-dgx-sparks"
date: "2026-09-15"
meta_title: "How and Why We Bought 4x DGX Sparks"
meta_description: "In June we deployed an RTX 6000 Pro into production, a few weeks later, we're now operating DGX Sparks for the team. Learn how and why."
author: "Alex Ellis"
tags:
 - "llm"
 - "localai"
 - "agents"
 - "security"
 - "red-teaming"
---

In this post I'll share how and why we (OpenFaaS Ltd) bought 4x DGX Sparks for our team, and what we've learned from it.

Having operated an RTX 6000 Pro with [Qwen 3.5-3.8 27B](https://huggingface.co/Qwen/Qwen3.8-27B) for a few months, we have experience of both fast GPUs, and extensive clusters of unified memory. Qwen is a smaller dense model that is like an attack dog - it's focused but needs careful handling, while the larger models such as DeepSeek or GLM are able to explore problems, largely unsupervised, at a slower rate and bigger context.

> Caveat: No part of this blog post has been written by AI. It is long-form because buying 2-4 DGX Sparks is a significant investment for an individual, let alone a business.

![Two DGX Sparks stacked together](/content/images/2026/09/how-why-dgx-sparks/2-sparks.jpg)
> The first two DGX Sparks purchased connected with a high speed Connect-X cable.

You'll notice the photo shows two, and not four devices. The eventual purchase of 2 additional units was painful and hard to justify, but opened a capability for us that no single consumer GPU could even hold in memory.

**An Englishman's home is his castle**

Whether using a cloud model for a casual *chat*, to develop a business plan, or to write and adapt code for your business, every token is sent to the cloud provider. Many retain the inputs and outputs from these exchanges to improve their models, and when you have the opportunity to opt-out, they may still be retained for up to 30 days. Conversations that are flagged for potential Terms of Service (ToS) violations may be retained indefinitely and could result in account suspension.

As you read this post, I want to show you that we have concrete reasons for deploying local AI for our team, and that it's not just a matter of preference. It's not at all about cost per token, and probably never will be. I am not writing a doctrine or a manifesto, I am not trying to persuade you to follow our example. However, if you do draw up the metaphorical moat of your castle, it can not only be fun, but provide tangible benefits and reduce risk.

If your data crosses the castle's portcullis, is it really yours?

I think many rightly assume that conversations with a coding agent, or a web-based AI assistant like ChatGPT or Claude.ai, are private and not subject to snooping, long-term storage, or training. The answer is more nuanced than that.

This post is a natural successor to my piece in June: [Local Qwen isn't a worse Opus, it's a different tool](/local-ai-is-not-opus/). There, we make the argument that only local would do for a subset of our core use cases in the business: customer support using [unredacted Kubernetes dumps](https://www.openfaas.com/blog/painless-support-with-diag/), and any other kind of work where we need to use AI, but data-sharing with a third-party is simply not an option. Many will argue that Zero Data Retention (ZDR) arrangements mean owning infrastructure is redundant. Others will argue that the 'tokenomics' (cost per token) would take several years to break even on the outlay.

I'm going to present two counter-arguments, which apply to our use. The first is that any kind of "data sharing" with a third-party is still data sharing, whether or not the provider pinky promises not to process or retain it. The second is a series of significant consequences of over-reliance on third-party inference services.

A [recent report from Anthropic](https://www.anthropic.com/threat-intelligence-report-september-2026) alleges that at least two vendors were routing their requests directly to Anthropic and almost certainly hiding the fact from their users, without consent. Anthropic then went on to read, digest, and publish knowledge about highly confidential internal information - the full specifications and strategic objectives of a flagship AI program, live credentials to a national defense database, surveillance archives on a tracked individual. The most worrying part of the article for me was where Anthropic demonstrates unregulated visibility that even governments lack.

> "As AI models become more widely used, providers will continue to acquire threat-relevant visibility into real-world use that even governments and intergovernmental organizations lack."

Beyond enterprise software and support, there are more subtle risks to cloud inference. A recent article in the Washington Post showed that a person's ChatGPT transcripts were used _against_ him in court: [They confided in ChatGPT. Their secrets ended up in court](https://www.washingtonpost.com/technology/2026/08/27/chatgpt-chats-are-being-swept-into-civil-criminal-court-cases/). If subpoenaed, transcripts could in principle demonstrate evidence concealment, establish premeditation, intent, or the timelines for a trial.

OpenAI claims to have used an unreleased internal AI model with 10,000 autonomous agents to solve the [Navier–Stokes existence and smoothness problem](https://www.claymath.org/millennium-problems/navier-stokes-equation) in 88 hours, inadvertently beating human mathematicians like Tristan Buckmaster at New York University who had spent a year on related work. Tristan had used Codex to explore the problem, but [OpenAI denies](https://openai.com/index/navier-stokes-solution/) reading his inputs and outputs directly, and has gone on the record to state "Following an investigation, we have confirmed that Buckmaster's Codex prompts... could not have influenced the system in any way, including through training."

This raises the question: if Buckmaster had only used local models, would he have made the same amount of progress, and would OpenAI have even had this problem on their radar?

**Glossary of local AI terms**

Anyone can get started with local AI, especially if you use a well trodden path, and lean on a coding agent to configure the system. That said, it's worth filling in any gaps in terminology.

| Term | What it is |
| --- | --- |
| Prefill | After tokenization, prefill processes all prompt tokens in one parallel pass to populate activations/KV cache before decode. 200k of context would take 100 seconds to prefill cold at 2000 tok/s |
| Decode | Also known as "generation" - the output response is generated by the model - usually measured in tens to hundreds of tokens per second |
| [Speculative decoding](https://arxiv.org/abs/2211.17192) | A smaller "drafter" model computes the most likely sequence between 1-7 tokens usually, then the main model verifies them (variants named: MTP, DSpark, DFlash) |
| Unified Memory Architecture (UMA) | The iGPU and system share the same pool of RAM |
| VRAM | The memory provided by a GPU, with bandwidth several times faster than RAM |
| KV cache | Rather than computing the prefill on each turn, the Key Value cache stores the results so they can be reused almost instantly |
| Quantization | Models are generally provided in BF16 precision and are very large, compression reduces quality but improves performance by reducing the effective size of the model |
| BF16, FP8, NVFP4 | Precision formats for the model weights, becoming progressively more efficient, but with worsening quality |
| [vLLM](https://github.com/vllm-project/vllm) | A production-ready open-source runtime for serving LLMs - written in Python |
| [llama.cpp](https://github.com/ggml-org/llama.cpp) / llama-server | Similar to vLLM, but written in C++, and generally a lot simpler for beginners |
| C1, C2, etc | Concurrent requests being made to the serving runtime. A single agent could open up 4 additional sub-agents for a task, i.e. C4 |
| Dense vs. Mixture of Experts | A dense model engages every parameter for each token generated, so its speed depends on fast memory bandwidth (VRAM). Mixture-of-Experts (MoE) models hold many small experts and activate only a few per token, so they can give usable decode speeds on ordinary RAM. |

**Expanding capabilities and responsibility of local AI**

When I finished the first post in June, we had a fairly well-tuned Qwen 3.6 27B setup running on the 6000 Pro GPU. It was able to do all the things we needed it to, and very quickly. We're talking about over 100 tokens per second decode for many agentic tasks and for coding, with very little drop-off for two concurrent streams.

We gradually started pushing Qwen to do real work that we would normally give to Claude or Codex. Where a repo had a solid AGENTS.md file such as for [arkade](https://arkade.dev) (like brew for binaries), it could produce a really good, fully tested PR within minutes. Qwen was much faster, and much more correct than the majority of community Pull Requests.

There were two niggles: that despite adopting an updated chat template, the model would often pause after a tool call - or worse still, loop indefinitely. I remember hearing the fans running hard and I thought my agent was just getting on with the task at hand. After 30 minutes I decided to check in and the terminal's scrollback was completely filled with the same repeating line.

So "local AI" for us meant supervision, and on the occasions I let it run unattended, I'd likely come back to 30 minutes of 1000W (at the wall) being burnt for no good reason.

**DeepSeek V4 Flash 0731 caught my imagination**

No small business founder wakes up and says: "I think I'll spend 10000 GBP today on a hardware experiment" but I was not the only one who'd got caught up in the results [DeepSeek V4 Flash 0731](https://huggingface.co/deepseek-ai/DeepSeek-V4-Flash-0731) brought to life for local AI.

DeepSeek presented roughly a 10x increase in parameter count, and benchmarked very well across coding and agentic tasks. On the other hand, its decode speeds were about half of that seen with Qwen on our RTX 6000 Pro. I wasn't even sure if 40 tokens per second would be tolerable, let alone usable.

So when I saw that my friend Jacopo (from the Kubernetes and KubeCon days) had just bought two units to run this same model, I reached out. He set up a community recipe for 2x DGX Sparks, and we started collaborating almost immediately over an authenticated [inlets tunnel](https://inlets.dev) I hosted for us. I added that to my [opencode](https://github.com/anomalyco/opencode) config and the initial results were really encouraging. Although I must say, we both got caught up by the claim of "65-85 tokens per second" by the [author of the recipe](https://github.com/MiaAI-Lab/DeepSeek-v4-Flash-DSpark-2x-DGX-Spark), this turned out to be "counting to 200" - a way of benchmaxxing the model's drafter. In reality, it could hit that speed for short generations of predictable tokens, but was often around 30-40 tokens per second.

Just like with Anthropic, OpenAI, or OpenCode's Zen, I knew there was a very real possibility that inputs and outputs were being logged or retained, so I treated the endpoint like any other public endpoint. Looking back, I pushed about 70-100M tokens per day (including cache hits) and kept it to working on my open source projects (where IP is already available), or driving our products using agentic skills (being careful not to leak credentials). I gave him feedback over the course of a week, and we improved and updated the serving recipe.

Unlike our Qwen setup where we were limited to a native context length of 256K tokens, the community example for DS4F came with 1M tokens per session, so we could work on larger, unsupervised tasks.

We did run into looping once, where a Korean character was outputted followed by a new line - a likely artifact of the tokenizer. Fortunately I caught it and that's not been much of an issue since.

At the time, I thought two units would do everything we needed. Stay with me, and you'll learn how they inadvertently duplicated themselves.

**Putting our money where our mouth was**

Having already bought a rather expensive RTX 6000 Pro for around 8500 GBP, then seeing it rise to 16000 GBP in a few short months, I felt a lot of tension. Two DGX Sparks in the UK with 4TB drives were going to cost us almost 10000 GBP to purchase, and the prices had increased the previous month.

I probably did more testing than was necessary with DeepSeek, but by the time I put the order in, I was completely sure this was going to be right for us. Qwen would remain our *attack dog* - fast, aggressive, highly focused, and needing careful handling. DeepSeek would be our explorer, planning product changes, building reports, combining multiple skills to test our products end-to-end, and exploring new ideas. On top of that, it could do all the things we needed from Qwen to do, just a bit slower.

The first two were ordered from [scan.co.uk](https://www.scan.co.uk/) who are an official redistributor and NVIDIA partner. At the time, the 1TB Asus GX10 device was also available at a lower cost, but we've found that the 4TB drive is essential for exploring different quantizations and models, as and when they become available. NVIDIA offers a discount program for qualifying startups called [*Inception*](https://www.nvidia.com/en-gb/startups/), and Scan was one of the vendors that allowed us to claw back about 600 GBP on the purchase.

**First boot**

The Founder's Edition Sparks are lovely to behold, made of premium materials, and extremely quiet whilst serving. The fit, finish, and sizing is very similar to a Mac Mini M1 generation device, albeit with almost 10x the RAM.

![Spark setup experience](/content/images/2026/09/how-why-dgx-sparks/setup-spark.jpg)
> Setup experience for the Sparks.

The setup is very well refined, and doesn't require a screen. The Spark advertises a WiFi hotspot, which you connect to, and type in the password from the booklet. Once fully updated, its WiFi hotspot will disappear and the machine reboots for about 10-15 minutes. The *confusing* part is that the browser stays open with the progress bar making no apparent progress.

Jacopo had set up DeepSeek on his machines using Codex, so I didn't hesitate to do the same. I know the broad concepts - the model weights, the NCCL, the fabric, KV cache, and how quantized everything is, but beyond that I have not pored over every detail. For Qwen, we installed vLLM directly onto the host, but the majority of Spark setups are heavily tied into Docker, and I managed to resist the urge to unpackage it all. Docker's not remotely isolating anything here, raw devices are passed directly to the containers, it's more about packaging assets and builds of the underlying infrastructure.

Having faced the refusals and flagged prompts by cloud models, we did try out a community checkpoint that abliterated or "uncensored" the model. It did work as expected: the modified weights accepted prompts the base refused. But a pass by Claude showed the base was already compliant - 11/12 security prompts vs 12/12 for the modified weights. However, we found that the drafter model had a very low acceptance rate due to the distributional drift between the base model and its abliterated serving path. There are also anecdotal reports of these modified weights being more prone to looping. Knowing all this, we would not run them without a very good reason.

**Operating an internal Model As A Service**

In the post about Qwen, I mention our internal LLM gateway: toilgate. It discovers the self-hosted models across various machines, records detailed usage metrics, authenticates human users using OAuth, and bots can be provided with API keys. It solved just about all the operational challenges we had with manual endpoints exposed over tunnels: the machine may change the model it's serving, it may be down, it may be hard to see _who_ is using what, when updates need to be deployed, and managing API keys. We developed a plugin for the opencode and pi harnesses, which presents all available models on start-up, including an "auto" mode for when you just need a quick response.

When a model is used only by one person - you have a pretty good idea about how much you want to use it and when, but when it's extended to your team, it becomes harder to manage maintenance, updates, and to try out newer models as they arrive. There's even variance between different community and vendor quantized models. We found that with NVFP4 quantizations for GLM 5.3 Flash (320B total, 18B active), NVIDIA's version had a 20% lead on prefill, whilst it was 7% slower at decode than [LibertAI's version](https://huggingface.co/LibertAIDAI/GLM-5.3-Flash-NVFP4).

**Lies, damn lies, and statistics**

The majority of information for serving models on DGX Spark is split between X, and [NVIDIA's user forums](https://forums.developer.nvidia.com/c/accelerated-computing/dgx-spark-gb10/719/). And whilst evaluating models, runtimes, recipes, and quantizations, we often found claims were not reproducible, or were deliberately misleading for clout.

Very few people will leave speed on the table, so speculative decoding is almost always used. A smaller drafter model generates a set of 1-7 likely next tokens, and the main model accepts or rejects them. It can mean the difference between 30 and 100 tokens per second in decode, but doesn't do much for prefill.

The issue with this space is that you don't know what you don't know. Speed claims depend on the inputs for the task, the configured context, concurrent requests being made, the model's architecture and the runtime configuration - and benchmarks skew towards one of three workload types:

* Prose - genuine novel text generation (the slowest)
* Structured output - generally tested with "Count from 1 to 200"
* Code - surprisingly repetitive, can often exceed prose by 2x

Structured output sounds very much like what agents do all day, but when you realise it's counting to 200 (one of the most predictable tasks there is for an LLM), you may be about to experience buyer's remorse.

And it's also worth saying that within benchmarks, there are ways to game the numbers, like turning thinking off, and only generating 400 tokens. We wrote [RigMark](https://github.com/alexellis/rigmark) to provide us and the community with a way to get consistent and representative figures for coding and agentic tasks. You'll find figures for 2-4 DGX Sparks across a few different models, and can send a PR to add your own.

**Why did we buy four?**

Building on the success of Qwen, and DeepSeek, we wanted to start red teaming our code, and had heard that [Hugging Face valiantly used GLM 5.2 to defend itself against OpenAI's attacks](https://huggingface.co/blog/security-incident-july-2026). They wrote up a special guide on [self-hosting the model](https://huggingface.co/blog/jeffboudier/open-model-cyber-defense). That, and knowing how well it scored on [CyberGym](https://www.cybergym.io/), running it at a tolerable speed became our goal. You can read [OpenAI's write-up on the Hugging Face incident here](https://openai.com/index/hugging-face-incident-and-the-road-ahead/).

The worst fallout of the incident is that many people outside the tech industry believe that AI somehow can wake up one morning and decide, unprompted, to perform malicious cyber attacks of its own volition. Now, whilst it's perfectly possible that AI can be misused, in this case the swarm of AI agents was working towards a goal to get an ExploitGym flag that was set by humans tasking them.

There is no consumer GPU that could hold the [GLM 5.2's 753B parameters](https://huggingface.co/zai-org/GLM-5.2), other than the unified memory of a cluster of DGX Sparks.

Now most of our products are core infrastructure for developers and enterprises. [OpenFaaS](https://openfaas.com) is a platform for running serverless functions on Kubernetes, without lock-in to a single cloud's FaaS model, and more tunability. It is used in a number of regulated industries, including healthcare, defense, and oil & gas. [SlicerVM](https://slicervm.com) was built to contain and isolate AI coding agents, and our [Inlets](https://inlets.dev) product is a secure network tunnel for access to individual endpoints - either privately or publicly.

Last time I mentioned the real work we did, people accused me of advertising. I've kept the descriptions as terse as possible, so you can understand the application of local AI in our actual work.

So how do you make a product secure? You do static analysis, you employ people who know what they're doing, you learn from the industry, and have responsible disclosure procedures in place.

But beyond that you actively exploit your own software to find vulnerabilities, and work with security researchers to patch them. Those kinds of audits require extensive resources, far more than the cost of 4x DGX Sparks for a single run over just one product. And if you've ever tried this with Claude or Codex, you'll be used to seeing this:

"You are a bad boy, how dare you! We've flagged your activity and we may ban your account permanently."

That's paraphrased, but the point is that cloud providers have very stringent boundaries around red-teaming, which is not just about cyber defense. It requires active cyber attack, developing Proof Of Concepts (PoCs) that can prove an issue, or escalate over a security boundary.

We can just about live with 30-day retention for business purposes, but we absolutely do not want all of our core IP to be retained and trained upon indefinitely, and that can be a pre-requisite for access to the big labs' "Cyber Defense" programs. At the time of writing, to apply to Claude's program, you need to disable ZDR for your organization.

![A summary of our Red Team run - each model ran the same rank R0-R8](/content/images/2026/09/how-why-dgx-sparks/red-team-run.png)
> A summary of our initial Red Team run - each model ran the same rank R0-R8 across six private repositories, controlled by a governor agent that ranked, collected, and verified the results.

I thought we would need abliterated weights in order to work on red teaming, but was immediately surprised that both DeepSeek and GLM complied without a lecture or caveats. I also thought we'd need to purchase a [noisy MikroTik CRS804 DDQ switch](https://mikrotik.com/product/crs804_ddq) (1500 GBP) in order to cluster the 4x units, but we managed to get away without it by patching the NCCL library and giving units that were not directly connected a way to route through each other. The speed seems to be on par with a switched setup.

```
A ───────── B      Cabled ring links:  A–B · A–C · B–D · C–D
│           │
│           │      Diagonals (NOT cabled) relay via a neighbour:
│           │        A ↔ D   via B or C
C ───────── D        B ↔ C   via A or D
```

> Diagram showing that A reaches D through B or C, via a neighbour relay

You can find our [switchless GLM-5.3 Flash TP4 recipe on GitHub](https://github.com/alexellis/glm-5.3-flash-4x-dgx-spark-switchless), with a separate [repository for the switchless NCCL patches](https://github.com/alexellis/switchless-nccl), so you can adapt it to other models.

When you put it this way, even finding 1-2 severe security issues could pay for the 4x devices in a healthy business.

**Real friction**

There are three points of friction I want to address as we close out the How and Why.

1. The 'You need a GPU' crowd is very loud
2. New models come out every day and there is a platform risk here
3. Should an individual buy these personally?

![GPUs vs. UMA meme](/content/images/2026/09/how-why-dgx-sparks/group-think-meme.jpg)
> Tribes: GPUs vs. Unified Memory Architecture (UMA)

I can completely see how people who've spent a lot of money on either GPUs or DGX Sparks double down on their purchasing decisions, and see the other lane as somehow invalidating their own. The "has to be a GPU" crowd is very loud, and "very right" on X. Until very recently, the DGX Spark crew were probably surviving on fumes - trying to run dense models like Qwen 27B which simply benefit from the speed that only GPUs can provide for both prefill and decode.

We've seen both sides and are in the fortunate position not to have to choose between them, but at this stage, I think the Sparks have absolutely won me over for utility, value for money, and performance. Not to mention that hosting them in a home office requires very little space compared to my huge Fractal Torrent ATX / Ryzen PC, which if I was building it new in 2026 would cost considerably more than it did.

I genuinely believe it was a lucky accident that DeepSeek V4 Flash 0731 just happened to fit perfectly on two Sparks, and run quickly. The latest model 4.1 Flash uses weights that are almost double the size of the previous generation, and require an additional "N-gram" table to fit in somewhere - offloaded to NVMe, or squeezed into RAM. The tables provide almost instant lookup speeds for tokens that are commonly used.

Buying 4x units of the same generation of product is a risk, but these units will be able to run today's models for a considerable amount of time, and a new model being released that's 2-4x the size, does not suddenly take away from our ability to run current models. If a current model is worth 10-20k GBP to our business today, it'll be worth the same tomorrow, and the day after. [NVIDIA is reportedly halting production](https://www.macnica.co.jp/en/business/semiconductor/manufacturers/nvidia/products/148912/) of the first-edition DGX Spark, but the third-party ecosystem (e.g. ASUS, Dell, MSI) will continue to supply their own variants.

AI is moving so fast, but we need to be grounded. I've taken to using DeepSeek V4 Flash 0731 or GLM-5.3 Flash for product work in place of the leading SOTA model with Claude or Codex. I want to see how far they can be pushed, and at times, bleeding edge intelligence will provide a very similar result, but with all the downsides we've explored here already.

Where I would put pause is if you want local AI at home, there really is not a cheap way to get into it. Every viable NVIDIA GPU has been increasing in cost month on month, and older community favourites like the 3090 are power hungry and sound like hairdryers. You can ask me how I know. I ran two for just as long as I could bear it, before jumping to that RTX 6000 Pro.

A card like the 5090 GPU (32GB) can serve a 27B model all day long, but leaves very little room for the KV cache. A card nobody is talking about is the 5000 Pro Blackwell (48GB) which comes in a 1.5 slot blower format, and is designed for all day use. It has enough VRAM for a 27B model at a good quality, with plenty of room for the KV cache.

## In conclusion

My journey with local AI has been a continuum, that started off with slow, and unproductive exploration - and developed into a firm part of how we operate our business and support customers. I purchased an NVIDIA RTX 3090 in 2023, and another shortly after realising that 24GB was not enough VRAM for the models that we wanted to run. That sat largely unused until Qwen 3.5 27B came along in February 24, 2026 and changed the landscape for local AI in a permanent way. Following on from that, we purchased the RTX 6000 Pro and ran Qwen like our _attack dog_ on specific, supervised tasks.

DeepSeek V4 Flash 0731 moved the goal posts again, bringing long-horizon, near state-of-the-art (SOTA) reasoning and coding to local AI. Not long after GLM 5.2 had become our target for in-house red-teaming, Z.ai caused a stir by releasing GLM-5.3 Flash, which had improved benchmarks and ran faster due to being a smaller flash model, so we switched over to it. We were able to pit Qwen, DeepSeek, and GLM-5.3 Flash against each other in a competitive local AI contest over the course of a week, which found real High, Medium, and Low vulnerabilities in our products, which we subsequently fixed.

> The irony is not lost on me that when I presented Claude with the findings of our week's work, it immediately flagged our account with Anthropic.

Local AI is not about saving pennies on the cost of tokens. It may well take you years to recoup the costs on that basis compared to coding plans. It's about the data you simply cannot share, the workflows that diverge from the blessed paths, and the sovereignty you gain from running AI without invasive data collection.

You can follow me on X: [@alexellisuk](https://x.com/alexellisuk) or [reach out for a meeting](https://alexellis.io) if you want to discuss local AI for your business. The switchless NCCL patches, recipes for serving models, along with RigMark for benchmarking are available on my [GitHub](https://github.com/alexellis) account.
