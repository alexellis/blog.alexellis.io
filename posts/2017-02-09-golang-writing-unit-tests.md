---
title: "Golang basics - writing unit tests"
slug: "golang-writing-unit-tests"
date: "2017-02-09T23:20:39Z"
author: "Alex Ellis"
meta_title: "Golang basics - writing unit tests"
meta_description: "Learn to write unit tests in Golang as we explore the basics  then move onto isolating dependencies, fakes and code coverage with the Go's standard tools."
tags:
  - "golang"
  - "coding"
  - "basics"
  - "unit testing"
  - "golang basics"
  - "json"
---

In the previous post titled ["Grab JSON from an API"](http://blog.alexellis.io/golang-json-api-client/) we explored how to interact with a HTTP client and parse JSON. This post is a continuation of that theme, which covers unit testing.

I consider the following book as essential reference and reading for Golang, you can purchase it on Amazon: [Go Programming Language, Addison-Wesley](https://amzn.to/3biQrWJ). I'll cover some other recommendations at the end of the post.

### Read the extended version in my new eBook

This blog post was originally written in 2017, and has received hundreds of thousands of views since then. It was even referenced in the Kubernetes documentation for the kubeadm tool.

You can carry on and read this post for free, or get the updated and extended version re-written for 2021 with many more examples in my new ebook - [Everyday Golang](https://gumroad.com/l/everyday-golang).

[![](/content/images/2021/06/Learn-unit-testing-Make-lovely-CLIs-Monitor-services-Release-with-GitHub-Actions-Ship-with-Docker-Work-out-Goroutines.png)](https://gumroad.com/l/everyday-golang)

> [Check it out now](https://gumroad.com/l/everyday-golang), or read this version for free

## 1. Testing in Go

Go has a built-in testing command called `go test` and a package `testing` which combine to give a minimal but complete testing experience.

The standard tool-chain also includes benchmarking and statement-based code coverage similar to NCover (.NET) or Istanbul (Node.js).

**Share & follow on Twitter:**

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Master unit testing in <a href="https://twitter.com/golang">@golang</a> - isolating dependencies, using fakes and checking code coverage with built-in tools. <a href="https://t.co/YiuAmrupGC">https://t.co/YiuAmrupGC</a></p>&mdash; Alex Ellis (@alexellisuk) <a href="https://twitter.com/alexellisuk/status/830059602742013953">February 10, 2017</a></blockquote> <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

### 1.2 Writing tests

Unit testing in Go is just as opinionated as any other aspect of the language like formatting or naming. The syntax deliberately avoids the use of assertions and leaves the responsibility for checking values and behaviour to the developer.

Here is an example of a method we want to test in the `main` package. We have defined an exported function called `Sum` which takes in two integers and adds them together.

```go
package main

func Sum(x int, y int) int {
    return x + y
}

func main() {
    Sum(5, 5)
}
```

We then write our test in a separate file. The test file can be in a different package (and folder) or the same one (`main`). Here's a unit test to check addition:

```go
package main

import "testing"

func TestSum(t *testing.T) {
    total := Sum(5, 5)
    if total != 10 {
       t.Errorf("Sum was incorrect, got: %d, want: %d.", total, 10)
    }
}
```

Characteristics of a Golang test function:

* The first and only parameter needs to be `t *testing.T`
* It begins with the word Test followed by a word or phrase starting with a capital letter.
 *  (usually the method under test i.e. `TestValidateClient`)
* Calls `t.Error` or `t.Fail` to indicate a failure (I called t.Errorf to provide more details)
 * `t.Log` can be used to provide non-failing debug information
* Must be saved in a file named `something_test.go` such as: `addition_test.go`

> If you have code and tests in the same folder then you cannot execute your program with `go run *.go`. I tend to use `go build` to create a binary and then I run that.

You may be more used to using the `Assert` keyword to perform checking, but the authors of [The Go Programming Language](https://www.amazon.co.uk/Programming-Language-Addison-Wesley-Professional-Computing/dp/0134190440) make some good arguments for Go's style over Assertions.

When using assertions:

* tests can feel like they're written in a different language (RSpec/Mocha for instance)
* errors can be cryptic "assert: 0 == 1"
* pages of stack traces can be generated
* tests stop executing after the first assert fails - masking patterns of failure

> There are third-party libraries that replicate the feel of RSpec or Assert. See also [stretchr/testify](https://github.com/stretchr/testify).

**Test tables**

The concept of "test tables" is a set (slice array) of test input and output values. Here is an example for the `Sum` function:

```golang
package main

import "testing"

func TestSum(t *testing.T) {
	tables := []struct {
		x int
		y int
		n int
	}{
		{1, 1, 2},
		{1, 2, 3},
		{2, 2, 4},
		{5, 2, 7},
	}

	for _, table := range tables {
		total := Sum(table.x, table.y)
		if total != table.n {
			t.Errorf("Sum of (%d+%d) was incorrect, got: %d, want: %d.", table.x, table.y, total, table.n)
		}
	}
}
```

If you want to trigger the errors to break the test then alter the `Sum` function to return `x * y`.

```
$ go test -v
=== RUN   TestSum
--- FAIL: TestSum (0.00s)
	table_test.go:19: Sum of (1+1) was incorrect, got: 1, want: 2.
	table_test.go:19: Sum of (1+2) was incorrect, got: 2, want: 3.
	table_test.go:19: Sum of (5+2) was incorrect, got: 10, want: 7.
FAIL
exit status 1
FAIL	github.com/alexellis/t6	0.013s
```

**Launching tests:**

There are two ways to launch tests for a package. These methods work for unit tests and integration tests alike.

1) Within the same directory as the test:

```
go test
```

*This picks up any files matching packagename_test.go*

or

2) By fully-qualified package name

```
go test github.com/alexellis/golangbasics1
```

You have now run a unit test in Go, for a more verbose output type in `go test -v` and you will see the PASS/FAIL result of each test including any extra logging produced by `t.Log`.

> The difference between unit and integration tests is that unit tests usually isolate dependencies that communicate with network, disk etc. Unit tests normally test only one thing such as a function.

## 1.3 More on `go test`

**Statement coverage**

The `go test` tool has built-in code-coverage for statements. To try it with out example above type in:

```
$ go test -cover
PASS
coverage: 50.0% of statements
ok  	github.com/alexellis/golangbasics1	0.009s
```

High statement coverage is better than lower or no coverage, but metrics can be misleading. We want to make sure that we're not only executing statements, but that we're verifying behaviour and output values and raising errors for discrepancies. If you delete the "if" statement from our previous test it will retain 50% test coverage but lose its usefulness in verifying the behaviour of the "Sum" method.

**Generating an HTML coverage report**

If you use the following two commands you can visualise which parts of your program have been covered by the tests and which statements are lacking:

```
go test -cover -coverprofile=c.out
go tool cover -html=c.out -o coverage.html 
```

Then open coverage.html in a web-browser.

**Go doesn't ship your tests**

In addition, it may feel un-natural to leave files named `addition_test.go` in the middle of your package. Rest assured that the Go compiler and linker will not ship your test files in any binaries it produces.

Here is an example of finding the production vs test code in the net/http package we used in the previous Golang basics tutorial.

```
$ go list -f={{.GoFiles}} net/http
[client.go cookie.go doc.go filetransport.go fs.go h2_bundle.go header.go http.go jar.go method.go request.go response.go server.go sniff.go status.go transfer.go transport.go]

$ go list -f={{.TestGoFiles}} net/http
[cookie_test.go export_test.go filetransport_test.go header_test.go http_test.go proxy_test.go range_test.go readrequest_test.go requestwrite_test.go response_test.go responsewrite_test.go transfer_test.go transport_internal_test.go]
```

For more on the basics read the [Golang testing docs](https://golang.org/pkg/testing/).

### 1.4 Isolating dependencies

The key factor that defines a unit test is isolation from runtime-dependencies or collaborators.

This is achieved in Golang through interfaces, but if you're coming from a C# or Java background, they look a little different in Go. Interfaces are implied rather than enforced which means that concrete classes don't need to know about the interface ahead of time.

That means we can have very small interfaces such as [io.ReadCloser](https://golang.org/src/io/io.go?s=4977:5022#L116) which has only two methods made up of the Reader and Closer interfaces:

```
        Read(p []byte) (n int, err error)
```
*Reader interface*

```
        Close() error
```
*Closer interface*

If you are designing a package to be consumed by a third-party then it makes sense to design interfaces so that others can write unit tests to isolate your package when needed.

An interface can be substituted in a function call. So if we wanted to test this method, we'd just have to supply a fake / test-double class that implemented the Reader interface.

```
package main

import (
	"fmt"
	"io"
)

type FakeReader struct {
}

func (FakeReader) Read(p []byte) (n int, err error) {
	// return an integer and error or nil
}

func ReadAllTheBytes(reader io.Reader) []byte {
	// read from the reader..
}

func main() {
	fakeReader := FakeReader{}
	// You could create a method called SetFakeBytes which initialises canned data.
	fakeReader.SetFakeBytes([]byte("when called, return this data"))
	bytes := ReadAllTheBytes(fakeReader)
	fmt.Printf("%d bytes read.\n", len(bytes))
}
```

Before implementing your own abstractions (as above) it is a good idea to search the Golang docs to see if there is already something you can use. In the case above we could also use the standard library in the [bytes](https://golang.org/pkg/bytes/) package:

```
    func NewReader(b []byte) *Reader
```

The Golang [testing/iotest](https://golang.org/pkg/testing/iotest/) package provides some Reader implementations which are slow or which cause errors to be thrown half way through reading. These are ideal for resilience testing.

* Golang docs: [testing/iotest](https://golang.org/pkg/testing/iotest/)

### 1.5 Worked example

I'm going to refactor the code example from the [previous article](http://blog.alexellis.io/golang-json-api-client/) where we found out how many astronauts were in space.

We'll start with the test file:

```
package main

import "testing"

type testWebRequest struct {
}

func (testWebRequest) FetchBytes(url string) []byte {
	return []byte(`{"number": 2}`)
}

func TestGetAstronauts(t *testing.T) {
	amount := GetAstronauts(testWebRequest{})
	if amount != 1 {
		t.Errorf("People in space, got: %d, want: %d.", amount, 1)
	}
}
```

I have an exported method called GetAstronauts which calls into a HTTP endpoint, reads the bytes from the result and then parses this into a struct and returns the integer in the "number" property.

My fake / test-double in the test only returns the bare minimum of JSON needed to satisfy the test, and to begin with I had it return a different number so that I knew the test worked. It's hard to be sure whether a test that passes first time has worked. 

Here's the application code where we run our `main` function. The `GetAstronauts` function takes an interface as its first argument allowing us to isolate and abstract away any HTTP logic from this file and its import list.

```
package main

import (
	"encoding/json"
	"fmt"
	"log"
)

func GetAstronauts(getWebRequest GetWebRequest) int {
	url := "http://api.open-notify.org/astros.json"
	bodyBytes := getWebRequest.FetchBytes(url)
	peopleResult := people{}
	jsonErr := json.Unmarshal(bodyBytes, &peopleResult)
	if jsonErr != nil {
		log.Fatal(jsonErr)
	}
	return peopleResult.Number
}

func main() {
	liveClient := LiveGetWebRequest{}
	number := GetAstronauts(liveClient)

	fmt.Println(number)
}
```

The GetWebRequest interface specifies the following function:

```
type GetWebRequest interface {
	FetchBytes(url string) []byte
}
```

> Interfaces are inferred on rather than explicitly decorated onto a struct. This is different from languages like C# or Java.

The complete file named types.go looks like this and was extracted from the previous blog post:

```
package main

import (
	"io/ioutil"
	"log"
	"net/http"
	"time"
)

type people struct {
	Number int `json:"number"`
}

type GetWebRequest interface {
	FetchBytes(url string) []byte
}

type LiveGetWebRequest struct {
}

func (LiveGetWebRequest) FetchBytes(url string) []byte {
	spaceClient := http.Client{
		Timeout: time.Second * 2, // Maximum of 2 secs
	}

	req, err := http.NewRequest(http.MethodGet, url, nil)
	if err != nil {
		log.Fatal(err)
	}

	req.Header.Set("User-Agent", "spacecount-tutorial")

	res, getErr := spaceClient.Do(req)
	if getErr != nil {
		log.Fatal(getErr)
	}
	if body != nil {
    	defer body.Close()
    }

	body, readErr := ioutil.ReadAll(res.Body)
	if readErr != nil {
		log.Fatal(readErr)
	}

	return body
}
```

**Choosing what to abstract**

The above unit test is effectively only testing the `json.Unmarshal` function and our assumptions about what a valid HTTP response body would look like. This abstracting may be OK for our example, but our code coverage score will be low.

It is also possible to do lower level testing to make sure that the HTTP get timeout of 2 seconds is correctly enforced, or that we created a GET request instead of a POST.

Fortunately Go has set of helper functions for creating fake HTTP servers and clients. 

**Going further:**

* explore the [http/httptest package](https://golang.org/pkg/net/http/httptest/#pkg-examples) 
* and refactor the test above to use a fake HTTP client. 
* what is the test coverage percentage like before and after?

## Buy my favourite Go books

This book inspired some of my thoughts on unit testing in Go and I'd highly recommend it.

<a target="_blank"  href="https://www.amazon.com/gp/product/0134190440/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=0134190440&linkCode=as2&tag=alexellisuk-20&linkId=ebcc436a5641d92d1479adfcacd994aa"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&MarketPlace=US&ASIN=0134190440&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=_SL160_&tag=alexellisuk-20" ></a><img src="//ir-na.amazon-adsystem.com/e/ir?t=alexellisuk-20&l=am2&o=1&a=0134190440" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

I consider the following book as essential reference and reading for Golang, you can purchase it on Amazon: <a target="_blank" href="https://www.amazon.com/gp/product/0134190440/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=0134190440&linkCode=as2&tag=alexellisuk-20&linkId=37d8db88ac663a3c01d2c5b8940601d7">The Go Programming Language (Addison-Wesley Professional Computing Series)</a><img src="//ir-na.amazon-adsystem.com/e/ir?t=alexellisuk-20&l=am2&o=1&a=0134190440" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

If you're just looking for a pocket reference, I actually learned most of what I know from this little gem. My favourite sections are the background information explaining why Go is written the way it is. Importantly, that Go has a single idiomatic way of doing things, something that I find liberating.

<a target="_blank"  href="https://www.amazon.com/gp/product/0321817141/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=0321817141&linkCode=as2&tag=alexellisuk-20&linkId=dba796393bbfd6c44282ca7bef7a6ad3"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&MarketPlace=US&ASIN=0321817141&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=_SL160_&tag=alexellisuk-20" ></a><img src="//ir-na.amazon-adsystem.com/e/ir?t=alexellisuk-20&l=am2&o=1&a=0321817141" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

[Go Programming Language Phrasebook](https://amzn.to/2vcMJ0m)

You may also like my new ebook - [Everyday Golang](https://gumroad.com/l/everyday-golang) which is full of practical examples based upon my experience of Go within the open source community over the past 6 years.

### Other blog posts you may enjoy

* [Build your own lightweight Kubernetes cluster with k3s](https://blog.alexellis.io/test-drive-k3s-on-raspberry-pi/)
* [OpenFaaS](https://github.com/openfaas/faas) is written entirely in Golang and helps you manage endpoints for functions and microservices on Kubernetes
* [5 keys to create a killer CLI in Go](https://blog.alexellis.io/5-keys-to-a-killer-go-cli/)
* [Golang - fetch JSON from an API](http://blog.alexellis.io/golang-json-api-client/)