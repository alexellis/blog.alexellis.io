---
title: "Two year update: Building an Open Source Marketplace for Kubernetes"
slug: "kubernetes-marketplace-two-year-update"
date: "2021-08-05T16:34:50Z"
author: "Alex Ellis"
meta_title: "Two year update: Building an Open Source Marketplace for Kubernetes"
meta_description: "It's been 22 months since I started building an open source marketplace for Kubernetes. I wanted to make discovering and installing apps less repetitive."
feature_image: "/content/images/2021/08/arkade-top-1.jpg"
tags:
  - "arkade"
  - "community"
  - "k3sup"
  - "opensource"
  - "marketplace"
---

It's 22 months since I found myself frustrated with writing boilerplate instructions to install simple, but necessary software in every tutorial I wrote for clients and for my own open source work.

> In this article post I'll walk you through the journey of the past two years from the initial creation, through to growing the community, getting the first sponsored app and what's next. There will be code snippets, and technical details, but there should be something for everyone as we celebrate the two year anniversary of the project.

[![Tools created](/content/images/2021/08/68747470733a2f2f7062732e7477696d672e636f6d2f6d656469612f45544173636a79576b4149782d396a3f666f726d61743d6a7067266e616d653d736d616c6c.jpeg)](https://github.com/alexellis/)

> A timeline of the various open source projects that I've started. They all have one thing in common: a focus on developer experience and community.

### The prototype

In 2019, [Helm](https://helm.sh) 2 was still widely used and I had set out on my own path to build independent software and help companies reach developers on a full-time basis.

But for one of my earliest clients, I wasn't supporting them with [OpenFaaS](https://www.openfaas.com/), I was building deeply technical content for their blog and finding that the [Kubernetes](https://kubernetes.io/) ecosystem made this incredibly repetitive and fragmented.

Do you want a secure, TLS-enabled registry, with [Ingress Nginx](https://kubernetes.github.io/ingress-nginx/), cert-manager and Docker's open source registry? It ended up being 5000 words, and every other tutorial tended to need K3s or Kubernetes installing, followed by ingress-nginx or traefik and [cert-manager](https://cert-manager.io/).

I thought that a dedicated CLI would remove duplication and help with sourcing applications, rather than scrolling through huge Helm chart README files and guessing good defaults.

I can still remember it now. I didn't want to create another CLI that I'd have to maintain, release and update, so asked around and [Duffie Cooley](https://twitter.com/mauilion) suggested extending k3sup, so I did.

`k3sup` is a CLI that I had written for a similar reason - to make the developer experience better for bootstrapping K3s. Installing K3s was also rather too manual and had meant I was repeating boilerplate instructions in dozens of blog posts.

```bash
commit 0b4997e408d5b2dc101f16c317f1fd946e3f91b1
Author: Alex Ellis (OpenFaaS Ltd) <alexellis2@gmail.com>
Date:   Tue Sep 24 12:35:28 2019 +0100

    Add prototype for installing apps
    
    Installs OpenFaaS, but not on armhf, optional loadbalancer
    flag.
    
    Pre-reqs are not checked i.e. helm/tiller.
    
    Signed-off-by: Alex Ellis (OpenFaaS Ltd) <alexellis2@gmail.com>

 main.go         |   3 +++
 pkg/cmd/apps.go | 128 ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
```

> The first commit to k3sup to add a prototype app for openfaas. Creating an app for OpenFaaS in k3sup meant that we didn't have to create our own installer and that was a bonus. 

k3sup was created to install K3s over an SSH connection to build Kubernetes clusters, and I wanted it to have a user-experience like Docker Swarm:

```bash
$ docker swarm init

Your join token is $SECRET

$ docker swarm join --join-token $SECRET 192.168.0.101
```

So it ended up looking like this:

```bash
k3sup install --ip 192.168.0.101 --user pi
k3sup join --server-ip 192.168.0.101 --ip 192.168.0.102 --user pi
```

Then, the app functionality just became a sub-command:

```bash
k3sup app install openfaas
k3sup app install kubernetes-dashboard
k3sup app install mongo
```

I added an `info` command printed out curated instructions on how to get started:

```bash
k3sup app info openfaas
```

If you'd installed Minio, it would tell you how to access the service, and how to obtain the generated username and password. If you'd installed Postgresql, it would explain where to find the connection string.

After a few months, a few people (including my friend [Stefan Prodan](https://twitter.com/stefanprodan) started to say: "why would I use your marketplace to install apps? I don't use a Raspberry Pi! I don't care about K3s!"

Well that was unexpected.

`k3sup app install` worked against any kind of Kubernetes cluster, even managed engines like EKS and GKE. I'd added support for Raspberry Pi clusters because that was something that other tooling neglected and I knew the community needed this.

### The creation of arkade

So arkade was born:

* `k3sup app install` -> `arkade install`
* `k3sup app info` -> `arkade info`

I wrote up why we needed arkade, and since most of the contributors were from the OpenFaaS community, published it on the blog:

[Why did the OpenFaaS community build arkade and what's in it for you?](https://www.openfaas.com/blog/openfaas-arkade/)

arkade lives at [github.com/alexellis/arkade](https://github.com/alexellis/arkade). Why isn't it in the openfaas organisation? For the same reason that the app is now called arkade instead of k3sup, I know people will assume it can only be used with openfaas.

Why isn't it in its own organisation? Because I don't want people to detach the work required to make this possible from human beings, from maintainers. Funding is required, it's not trivial to build an ecosytem and to motivate and mentor a community. You'll hear a little more on this towards the end of the article where I mention [Sponsored Apps](https://github.com/alexellis/arkade#sponsored-apps).

The main points from the blog post were:
* It was more secure than Helm 2 because it used templating instead of relying on Tiller
* It helped you discover the options you actually cared about for charts
* There was no more searching through docs and GitHub repos to find out how to install software
* It made your next action obvious through the info command
* It just worked for multi-arch
* It put everything under one roof - Apps, plus the CLIs required to drive them

The thing I was most excited about was composite apps, the ability to get a compound benefit. A blog post I wrote for [Civo](https://civo.com), a cloud provider in the UK needed 5000 words to show how to deploy a TLS-enabled registry to Kubernetes using Cert-Manager.

Arkade meant that could be condensed down to 4 commands:

```bash
arkade install ingress-nginx
arkade install cert-manager
arkade install docker-registry
arkade install docker-registry-ingress \
  --email $EMAIL \
  --domain $DOMAIN

docker login $DOMAIN
```

### But what about GitOps?

Hardcore GitOps fans couldn't quite understand why arkade was needed, they criticised it as an imperative tool. They asked why they would use it in production instead of [FluxCD](https://docs.fluxcd.io/) or [Argo](https://argoproj.github.io/)

Here's the sweet spot for arkade:

You need to install some apps, quickly. Probably in development, maybe in production. At the end of the day, it will use the official CLI of a project like Istio or Linkerd, or its official helm chart, the end result being that it installs the app in the recommended way.

GitOps tools are wonderful things, keep on using them, but it's unlikely that they will fit your needs for local development in the way that arkade can.

Don't take my word for it. I've included a few notes from SREs and DevOps engineers later on the article.

### The community - more than the sum of its parts

And with arkade, came the community, and new contributors who also wanted to make Kubernetes less repetitive.

[Ustav Anand](https://twitter.com/Utsav2Anand) designed a colourful logo for us, which is something I don't think I could have done on my own.

<img src="https://raw.githubusercontent.com/alexellis/arkade/master/docs/arkade-logo-sm.png" alt="arkade logo" width="150" height="150">

[Alistair Hey](https://github.com/waterdrips) started contributing in the early days of arkade and added an SDK to make writing apps even easier and less repetitive:

```go
	postgresql.RunE = func(command *cobra.Command, args []string) error {
		kubeConfigPath, _ := command.Flags().GetString("kubeconfig")
		updateRepo, _ := postgresql.Flags().GetBool("update-repo")

		arch := k8s.GetNodeArchitecture()
		fmt.Printf("Node architecture: %q\n", arch)

		if arch != IntelArch {
			return fmt.Errorf(OnlyIntelArch)
		}

		ns, _ := postgresql.Flags().GetString("namespace")

		if ns != "default" {
			return fmt.Errorf("please use the helm chart if you'd like to change the namespace to %s", ns)
		}

		persistence, _ := postgresql.Flags().GetBool("persistence")

		overrides := map[string]string{}

		overrides["persistence.enabled"] = strings.ToLower(strconv.FormatBool(persistence))

		customFlags, err := command.Flags().GetStringArray("set")
		if err != nil {
			return fmt.Errorf("error with --set usage: %s", err)
		}

		if err := mergeFlags(overrides, customFlags); err != nil {
			return err
		}

		postgresqlAppOptions := types.DefaultInstallOptions().
			WithNamespace(ns).
			WithHelmRepo("bitnami/postgresql").
			WithHelmURL("https://charts.bitnami.com/bitnami").
			WithOverrides(overrides).
			WithHelmUpdateRepo(updateRepo).
			WithKubeconfigPath(kubeConfigPath)

		_, err = apps.MakeInstallChart(postgresqlAppOptions)
		if err != nil {
			return err
		}

		fmt.Println(postgresqlInstallMsg)
		return nil
```

You'll notice that flags with strong types are used to populate values in helm charts, and we personally curate and bubble up what we think is going to be important, from dozens of options in the values.yaml files.

```go
func MakeInstallPostgresql() *cobra.Command {
	var postgresql = &cobra.Command{
		Use:          "postgresql",
		Short:        "Install postgresql",
		Long:         `Install postgresql`,
		Example:      `  arkade install postgresql`,
		SilenceUsage: true,
	}

	postgresql.Flags().Bool("update-repo", true, "Update the helm repo")
	postgresql.Flags().String("namespace", "default", "Kubernetes namespace for the application")

	postgresql.Flags().Bool("persistence", false, "Enable persistence")

	postgresql.Flags().StringArray("set", []string{},
		"Use custom flags or override existing flags \n(example --set persistence.enabled=true)")

```

Now it turned out that most people installing apps to Kubernetes clusters also needed dozens of CLIs - kubectl, helm, linkerd, kubectx, faas-cli to name a few.

There are die-hard fans who will refuse to use anything other than `brew`, but brew is anything but instant. Have you got 20 minutes whilst we update that catalog from GitHub? Oh you got rate-limited, better issue a personal access token and let brew use that so it can scrape the GitHub API. If you're unlucky, then brew will also download reams of dependencies and build them all from scratch, when all you wanted was a simple Go binary, like now.

That's when I came up with `arkade get`, it simply downloads CLIs from GitHub releases, but it wasn't as easy as I thought. Everyone names their CLIs a different way, and there are no standards.

I solved this by introducing Go templates, which can also be unit tested to make sure they produce the correct URLs.

arkade get also has to contend with archives like zip files and non-standard naming of binaries vs release names, when you get `/releases/v0.1.0/name_0.1.0.zip` and suddenly have to remove that extra v in the filename, despite it being the canonical release name.

Then there's multi-arch and multi-OS, arkade automates all of that for you.

Here's the code to define a multi-arch, multi-OS download for faas-cli:

```go
	tools = append(tools,
		Tool{
			Owner:       "openfaas",
			Repo:        "faas-cli",
			Name:        "faas-cli",
			Description: "Official CLI for OpenFaaS.",
			BinaryTemplate: `{{ if HasPrefix .OS "ming" -}}
{{.Name}}.exe
{{- else if eq .OS "darwin" -}}
{{.Name}}-darwin
{{- else if eq .Arch "armv6l" -}}
{{.Name}}-armhf
{{- else if eq .Arch "armv7l" -}}
{{.Name}}-armhf
{{- else if eq .Arch "aarch64" -}}
{{.Name}}-arm64
{{- else -}}
{{.Name}}
{{- end -}}`,
		})
```

And this is the Go template for Helm, which uses an archive for its download:

```go
	tools = append(tools,
		Tool{
			Owner:       "helm",
			Repo:        "helm",
			Name:        "helm",
			Version:     "v3.5.2",
			Description: "The Kubernetes Package Manager: Think of it like apt/yum/homebrew for Kubernetes.",
			URLTemplate: `{{$arch := "amd64"}}

{{- if eq .Arch "armv7l" -}}
{{$arch = "arm"}}
{{- end -}}

{{- if eq .OS "linux" -}}
	{{- if eq .Arch "aarch64" -}}
	{{$arch = "arm64"}}
	{{- end -}}
{{- end -}}

{{$os := .OS}}
{{$ext := "tar.gz"}}

{{ if HasPrefix .OS "ming" -}}
{{$os = "windows"}}
{{$ext = "zip"}}
{{- end -}}

https://get.helm.sh/helm-{{.Version}}-{{$os}}-{{$arch}}.{{$ext}}`,
		})
```

What about the unit tests? These verify that the URLs are being produced correctly. Here's how we handle `kubectl` itself, which uses a custom download URL and needs a special URL template since the binaries are not on GitHub:

```go
func Test_DownloadKubectl(t *testing.T) {
	tools := MakeTools()
	name := "kubectl"

	var tool *Tool
	for _, target := range tools {
		if name == target.Name {
			tool = &target
			break
		}
	}

	tests := []test{
		{os: "darwin",
			arch:    arch64bit,
			version: "v1.20.0",
			url:     "https://storage.googleapis.com/kubernetes-release/release/v1.20.0/bin/darwin/amd64/kubectl"},
		{os: "linux",
			arch:    arch64bit,
			version: "v1.20.0",
			url:     "https://storage.googleapis.com/kubernetes-release/release/v1.20.0/bin/linux/amd64/kubectl"},
		{os: "linux",
			arch:    archARM64,
			version: "v1.20.0",
			url:     "https://storage.googleapis.com/kubernetes-release/release/v1.20.0/bin/linux/arm64/kubectl"},
	}

	for _, tc := range tests {
		got, err := tool.GetURL(tc.os, tc.arch, tc.version)
		if err != nil {
			t.Fatal(err)
		}
		if got != tc.url {
			t.Fatalf("want: %s, got: %s", tc.url, got)
		}
	}
}
```

It's hard to say how many people contributed apps and tools to arkade, because the code used to live in K3sup, but I'll have a go:

* k3sup has 42 contributors
* arkade has 39 contributors

That's a lot of individual PRs and commits that I've merged. I like to encourage contributors to join [OpenFaaS Slack](https://slack.openfaas.io), to learn and if they are open to it, I'll coach them and get their input into how the project should work.

[Ramiro Berrelleza]() of Okteto [added a progress bar](https://github.com/alexellis/arkade/commit/af87452eca749f98bccd8848518de02122006cab) which helps with larger binaries like kubectl:

```bash
$ arkade get kubectl
Downloading kubectl
https://storage.googleapis.com/kubernetes-release/release/v1.20.0/bin/linux/amd64/kubectl
38.37 MiB / 38.37 MiB [-----------------------------] 100.00%
Tool written to: /home/alex/.arkade/bin/kubectl

# Add (kubectl) to your PATH variable
export PATH=$PATH:$HOME/.arkade/bin/

# Test the binary:
/home/alex/.arkade/bin/kubectl

# Or install with:
sudo mv /home/alex/.arkade/bin/kubectl /usr/local/bin/
```

[Yankee](https://github.com/yankeexe) came up with the idea of adding a table for downloads, and I think it looks great to see the data represented that way:

```
+------------------+--------------------------------------------------------------+
|       TOOL       |                         DESCRIPTION                          |
+------------------+--------------------------------------------------------------+
| argocd           | Declarative, GitOps continuous delivery tool for Kubernetes. |
+------------------+--------------------------------------------------------------+
| argocd-autopilot | An opinionated way of installing Argo-CD and managing GitOps |
|                  | repositories.                                                |
+------------------+--------------------------------------------------------------+
| arkade           | Portable marketplace for downloading your favourite devops   |
|                  | CLIs and installing helm charts, with a single command.      |
+------------------+--------------------------------------------------------------+
| buildx           | Docker CLI plugin for extended build capabilities with       |
|                  | BuildKit.                                                    |
+------------------+--------------------------------------------------------------+
| civo             | CLI for interacting with your Civo resources.                |
+------------------+--------------------------------------------------------------+
| cosign           | Container Signing, Verification and Storage in an OCI        |
|                  | registry.                                                    |
+------------------+--------------------------------------------------------------+
| docker-compose   | Define and run multi-container applications with Docker.     |
+------------------+--------------------------------------------------------------+
There are 63 apps, use 'arkade get NAME' to download one.
```

There are too many contributors to mention individually, but each of them has had an impact in their own way. Thanks also to [Engin Diri](https://github.com/dirien), [Carlos Panato](https://github.com/cpanato) and [Batuhan Apaydın](https://github.com/developer-guy).

## Sponsored Apps

My intent with arkade was to create something that solved pain in the Kubernetes ecosystem, and made life better for developers.

If you use arkade as an individual, [you can sponsor me via GitHub](https://github.com/sponsors/alexellis) so I can continue this work.

I also wanted to be cautious of my prior mistakes with Open Source, as [Alexis Richardson](https://twitter.com/monadic) first told me at KubeCon Austin in 2017: "if your software is too easy to use, never crashes and is feature complete, nobody will pay for support"

With arkade, I wanted to offer value to companies where I would develop a dedicated app for them, to improve the onboarding experience.

Why is that important? If you can lower the barrier to entry, it can encourage experimentation, and I believe that "mean time to dopamine" is an important measure for developer tools.

So the first Sponsored App was for [Venafi](https://www.venafi.com/), you may have heard of them when they acquired [JetStack](https://www.jetstack.io/), the authors of cert-manager. Venafi care about machine identity - that is to say, certificates for everything and have their own add-ons for cert-manager too.

Here's [the issue](https://github.com/alexellis/arkade/issues/236) and linked PR and the [press release](https://www.openfaas.com/blog/arkade-venafi/) which walks you through how the app works and what pain it solved in the onboarding process.

I'm also excited to confirm that [Kasten](https://www.kasten.io/) have purchased a Sponsored App bundle which includes their CLI apps being added to arkade, and their Kubernetes backup solution as an app. With each Sponsored App, I write up a blog post and in some circumstances will put on a webinar.

The idea is to make things easier, and then get feedback, sign-ups, leads and to be a net win for arkade and the sponsor.

## What are people saying about arkade?

Here's what [Ivan Velichko](https://twitter.com/iximiuz/status/1422605221226860548?s=20), SRE @ Booking.com has to say about arkade:

> I was setting up a new dev environment yesterday. Kind, helm, kustomize, kubectl, all this stuff. My take is - arkade is highly underappreciated.
> I'd spend an hour in the past to install such tools. With arkade it was under ten minutes.

[Greg](https://twitter.com/cactusanddove) runs Fullstack JS and is a JavaScript developer, he says:

> This is real magic get #kubernetes up and going in a second; then launch #openfaas a free better than lambda solution that uses docker images.

[@arghzero](https://twitter.com/ArghZero/status/1346097288851070983?s=20) says:

> for getting the basics installed, nothing beats arkade
> it can install commonly used cli tools like kubectl locally for you, as well as common k8s pkgs like ingress-nginx or portainer

[@Yankexe](https://twitter.com/yankexe/status/1305427718050250754?s=20) says:

> It's hard to use K8s without Arkade these days. 
> My team at @lftechnology absolutely loves it. 

From [Michael Cade @ Kasten](https://twitter.com/MichaelCade1/status/1390403831167700995?s=20)

> I finally got around to installing Arkade, super simple! 
> quicker to install this than the argocli standalone commands, but there are lots of handy little tools in there.
> also, the neat little part about arkade, not only does it make it easy to install a ton of different apps and CLIs you can also get the info on them as well pretty quickly.

Alistair and I recorded a live-stream over the summer and talked about how arkade works, and how to add new apps:

[![Hands-On with Arkade: K8s Marketplace](https://img.youtube.com/vi/K9TtrJNy90M/hqdefault.jpg)](https://www.youtube.com/watch?v=K9TtrJNy90M)

Watch now: [Hands-On with Arkade: K8s Marketplace](https://www.youtube.com/watch?v=K9TtrJNy90M)

## Wrapping up 

It's now been two years since I set out to simplify finding, configuring and installing apps for Kubernetes, I couldn't have got the project to where it is today without everyone's help.

There are 47 apps, but several open pull requests, so I expect to see that bump up to 50 by the end of the month. Are there more than 50 apps for Kubernetes? Of course, but we are building a focused marketplace, with high quality apps that are likely to be used and are driven by demand from users.

What does that demand look like? Well there are now 47,000 downloads of arkade and 108 releases and 2k GitHub Stars. Between 50 and 100 contributors, if we factor in those who hacked on the code whilst it was stil called k3sup.

The list of CLIs we can install is growing every week with 63 apps, all with unit tests and a Go template that can be extended easily when projects release an ARM binary for their software or start supporting Windows.

If you want to try out arkade, it's just one command away:

```bash
# You move the binary to $PATH
curl -sLS https://get.arkade.dev | sh
mv arkade /usr/local/bin/

# Or have the script move it for you
curl -sLS https://get.arkade.dev | sudo sh
```

Or if you're one of those people who don't like to run bash, feel free to read what the script does, or head over to the [releases page](https://arkade.dev)

### What can you learn?

* Add a progress bar to your app? Find out how using our source code.
* Print a pretty table using the code from the `arkade get` command
* Follow our example and build a community for your tools and open source projects
* Learn how k3sup and arkade can be used together: [Walk-through — install Kubernetes to your Raspberry Pi in 15 minutes](https://alexellisuk.medium.com/walk-through-install-kubernetes-to-your-raspberry-pi-in-15-minutes-84a8492dc95a)

I'd also encourage you not to rush out there and force your users to deal with YAML or JSON manifests. Arkade has shown that Go, with a suitable SDK is just as good as manifests and dynamic files, in fact it may even be better suited to the job than YAML, which everyone in DevOps loves to hate.

### Onward journey

* Star [arkade on GitHub](https://arkade.dev) or fork and browse the code
* [Join Slack, contribute, test, suggest apps](https://slack.openfaas.io)

Do you want product feedback on your developer experience? Do you want to learn how to grow a community or open source project? [Book a call with me](https://calendly.com/alexellis)