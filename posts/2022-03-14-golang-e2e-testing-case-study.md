---
title: "A case-study in end-to-end testing with Golang"
slug: "golang-e2e-testing-case-study"
date: "2022-03-14T14:33:31Z"
author: "Alex Ellis"
meta_title: "A case-study in end-to-end testing with Golang"
meta_description: "Through a case-study, Alex demonstrates real life unit tests and end to end tests, along with how to overcome challenges around speed and brittleness."
feature_image: "/content/images/2022/03/Untitled-design.png"
tags:
  - "unit testing"
  - "everyday go"
  - "everyday golang"
  - "golang-basics"
  - "golang"
---

Unit tests form a key part of modern software testing, however we tend to neglect end to end tests for various reasons. Through a case-study, I'll show you how these were added to an open source project, so you can adapt the approach and techniques for your own work.

## The testing pyramid

In "[Test Driven Development by Example](https://amzn.to/36jEqSM)", [Kent Beck](https://en.wikipedia.org/wiki/Kent_Beck) defines the concept of "unit tests":

> "Unit tests test individual units (modules, functions, classes) in isolation from the rest of the program."

I spend most of my time writing unit tests, because their isolated nature means that they're relatively stable, quick to run and don't need to change often.

Now, there are other types of tests that can be useful, but they come with their own tradeoffs. They also come with advisory proportions, we can visualise that through the use of a "Testing Pyramid"

![The Testing Pyramid](/content/images/2022/03/pyramid.png)

> My take on a "Testing Pyramid"

Unit tests, at the bottom of the diagram are easy to maintain, quick to write and verify only one thing, they test something in isolation.

As we progress up the diagram, the tests involve more and more components of our system, and even reach out to external servers and resources, finally recruiting a web browser and automation tooling like Selenium.

The perils of unit testing are a lack of context. Without testing components together, we rely purely upon assumptions about interactions.

<iframe width="560" height="315" src="https://www.youtube.com/embed/mC3KO47tuG0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

> Above: a meme of an umbrella that passes unit tests, but fails on integration testing.

At some companies that I've worked at, UI tests may be carried out by hand, making them error prone and extremely expensive to exercise. That said, I've seen first hand how valuable it can be to have a skilled QA tester try to break your work in creative ways.

So how do we apply this to Go?

## A case-study

I started [arkade](https://github.com/alexellis/arkade) to be a marketplace for [Kubernetes](https://kubernetes.io/) applications and charts. It makes them easier to discover and install with a single command. I was having to write the same instructions, over and over and knew that setting up a local development environment could be made faster and more efficient through automation.

Here's an example of what that looks like:

```bash
arkade install kubernetes-dashboard
arkade install argocd
```

But we are not going to talk about installing apps here.

Shortly after arkade launched, it turned out that most Kubernetes developers also needed a core set of CLIs on their machines like terraform, kubectl, kubectx, kind, k3d, kail, k9s, the list goes on. Arkade could also help here, by making any of these binaries just one command away:

```bash
arkade get kubectl@v1.21.1 \
  faas-cli \
  k9s \
  helm \
  k3d \
  kind@v0.12.0
```

Arkade does something different to other tooling like apt-get or brew. It inspects your system, then downloads the correct binary for your Operating system and CPU.

### Unit testing URL templates

For each tool, we add a Go template that executes and generates a download URL. How do you unit test that?

An abridged sample from tools.go to provide the `k3sup` binary:

```golang
func MakeTools() Tools {
	tools := []Tool{}

	tools = append(tools,
		Tool{
			Owner:       "alexellis",
			Repo:        "k3sup",
			Name:        "k3sup",
			Description: "Bootstrap Kubernetes with k3s over SSH < 1 min.",
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
    return tools
```

So, when this template executes with an input of "darwin", we'll get the binary of `k3sup` combined with the GitHub download URL.

Here's what the unit test looks like in `get_test.go`:

```golang
func Test_DownloadK3sup(t *testing.T) {
	tools := MakeTools()
	name := "k3sup"

	var tool *Tool
	for _, target := range tools {
		if name == target.Name {
			tool = &target
			break
		}
	}

	tests := []test{
		{os: "mingw64_nt-10.0-18362",
			arch:    arch64bit,
			version: "0.9.2",
			url:     "https://github.com/alexellis/k3sup/releases/download/0.9.2/k3sup.exe"},
		{os: "linux",
			arch:    arch64bit,
			version: "0.9.2",
			url:     "https://github.com/alexellis/k3sup/releases/download/0.9.2/k3sup"},
		{os: "darwin",
			arch:    arch64bit,
			version: "0.9.2",
			url:     "https://github.com/alexellis/k3sup/releases/download/0.9.2/k3sup-darwin"},
		{os: "linux",
			arch:    "armv7l",
			version: "0.9.2",
			url:     "https://github.com/alexellis/k3sup/releases/download/0.9.2/k3sup-armhf"},
		{os: "linux",
			arch:    "aarch64",
			version: "0.9.2",
			url:     "https://github.com/alexellis/k3sup/releases/download/0.9.2/k3sup-arm64"},
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

This test is extremely quick to execute, because it only exercises the `GetURL` function, with a set of predefined arguments. When running through a normal user interaction, the version may be obtained from GitHub via a HTTP call, but we don't do that for the unit test.

We're just testing that the URL is being formed correctly, for each CPU/OS architecture that is offered. Recently, some tools added a binary for Apple M1 Macs, so all open source contributors needed to do was to add a test case and update the template.

### So where do end to end tests fit in here?

At time of writing, running `arkade get` outputs an ASCII table showing 76 different tools that can be downloaded, for up to 4-8 different OS and CPU combinations.

That could mean up to 608 different binaries to check, and even by doing these in parallel, it would be time consuming and expensive to run.

After working with the community, we decided to only check the Linux operating system for Intel/AMD CPUs. It's not fool proof, but it does give a good indication of whether the URLs are likely to be broken. We have the benefit of knowing how a system can break, so we're testing that.

A project may introduce a `v` somewhere in their URL, so `v0.1.0` has a URL that ends with: `helm_0.1.0` and the next release has: `helm_v0.1.0` - or maybe they started adding a suffix like `helm_linux_amd64` - or perhaps they changed from `_` underscores to `-` dashes?

Even with this reduced scope for our test, it still takes a really long time because any tool that depends on Kubernetes Go library gets severely bloated to 30-100MB+.

The approach we took was to send a HTTP HEAD request instead of downloading the whole binary. This should let us know whether the latest version is still available for Linux on an Intel/AMD platform, and stay one step ahead of indecisive upstream project maintainers.

### Friction with e2e tests

There was an open Pull Request to contribute a new "main.go" that could be run manually to check for downloads, but the Go unit testing framework provides a much more versatile platform and is purpose built for the task.

I wrote a test table like the one you saw above, but even when running a HTTP HEAD, the test was taking 30-60 seconds on my machine, and I knew it would get in the way of anyone like me who just clones a Go project and expects to run `go test`.

I wanted to be able to separate out the end to end test, but also, running them sequentially took too long.

Given that these could break at any time, I wanted them to run on a schedule, and not to block new, contributions which may be unrelated to breakages.

Here's how we went about it, and you may be able to benefit from the approach too:

```go
//go:build e2e
// +build e2e

package get

import (
	"net/http"
	"testing"
)

// Test_CheckTools runs end to end tests to verify the URLS for various tools using a HTTP head request.

func Test_CheckTools(t *testing.T) {
	tools := MakeTools()

	os := "linux"
	arch := "x86_64"

	for _, toolV := range tools {
		tool := toolV
		t.Run("Download of "+tool.Name, func(t *testing.T) {
			t.Parallel()

			url, err := tool.GetURL(os, arch, tool.Version)
			if err != nil {
				t.Fatalf("Error getting url for %s: %s", tool.Name, err)
			}
			t.Logf("Checking %s via %s", tool.Name, url)

			status, body, headers, err := tool.Head(url)
			if err != nil {
				t.Fatalf("Error with HTTP HEAD for %s, %s: %s", tool.Name, url, err)
			}

			if status != http.StatusOK {
				t.Fatalf("Error with HTTP HEAD for %s, %s: status code: %d, body: %s", tool.Name, url, status, body)
			}

			if headers.Get("Content-Length") == "" {
				t.Fatalf("Error with HTTP HEAD for %s, %s: content-length zero", tool.Name, url)
			}
		})
	}
}
```

Here are the take aways:

By adding `go:build e2e` to the top of the file, these tests do not run with `go test`, but are invoked with `go test -tags e2e`. This means maintainers and contributors can continue to do their daily work, with fast iterations.

The tests are sped up dramatically by running in parallel using the `t.Parallel()` command.

Although not covered in detail here, the code above runs nightly using a cron schedule in a GitHub Action: [arkade/.github/workflows/e2e-url-checker.yml](https://github.com/alexellis/arkade/blob/master/.github/workflows/e2e-url-checker.yml)

This shows the difference between unit testing and e2e testing, using the same Go unit testing framework, and test tables.

## Wrapping up

We took a brief look at what unit testing is and isn't, and why end to end tests can be slow to run and brittle. We walked through a real-world example from the arkade project - used by various companies and individuals around the world to work with Cloud Native systems like Kubernetes.

You can star arkade, try it out and view the source code we reviewed above on GitHub: [alexellis/arkade](https://github.com/alexellis/arkade)

I believe that the best way to learn is through real examples used in production and open source projects. That's why I wrote Everyday Go - you can learn about test tables, and all the various party tricks that Go has like testing HTTP servers in [my eBook](https://gumroad.com/l/everyday-golang).

Feel free to check out the table of contents, and what other people are saying about the material on Gumroad: [Everyday Golang](https://gumroad.com/l/everyday-golang)

You may also like:

* [I wrote a book about Everyday Go](https://blog.alexellis.io/i-wrote-a-book-about-golang/)
* [Two year update: Building an Open Source Marketplace for Kubernetes](https://blog.alexellis.io/kubernetes-marketplace-two-year-update/)
* [Free video: Introduction to Serverless Golang with OpenFaaS](https://www.youtube.com/watch?v=kFnTiRCYzCM)