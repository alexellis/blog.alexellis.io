---
title: "Golang basics - fetch JSON from an API"
slug: "golang-json-api-client"
date: "2017-01-26T20:46:51Z"
author: "Alex Ellis"
meta_title: "Golang basics - grab JSON from an API"
meta_description: "Learn a Golang recipe for parsing JSON from a remote API on the Internet over HTTP. This is beginner/intermediate content in the Golang basics series"
tags:
  - "golang"
  - "golang basics"
  - "programming"
  - "go"
  - "coding"
---

This is a recipe in Golang for making a "GET" request over HTTP to an API on the Internet. We will be querying an endpoint provided for free that tells us how many astronauts are currently in space and what their names are.

> Updated: June 2020 - newer Go version, updated the introduction and code example.

You may also like my new ebook - [Everyday Golang](https://gumroad.com/l/everyday-golang) which is full of practical examples and tips from open-source Go applications including JSON, HTTP servers, embedding, databases, templates and Goroutines.

### Pre-requisites

* Install Go from https://golang.org/dl/
* Check your Go installation with `go version`
 * I'm using go1.13.3

Set a GOPATH - this was a required step in 2017 when the post was original written, and is still my preferred style, so we will stick with it.

* Set your GOPATH to $HOME/go/
 * i.e. run: `export GOPATH=$HOME/go/`
 * If you want the change to stick, add the line to `.bash_rc` or `.profile`.

We are going to use the Golang standard library which has a number of useful components for HTTP and JSON, so no external dependencies will be required.

### A blank template

I have had good experiences using `nano` and `vim`, but [Visual Studio Code](https://code.visualstudio.com) is probably the easiest to setup with a good Go experience.

> If you're using Visual Studio Code, let it install the plugins it suggests such as `gofmt` because they will ensure your code looks good.

Make yourself a folder for a new project (you can use your Github username here):

```shell
mkdir -p $GOPATH/src/github.com/alexellis/blank/
```

Now save a new file named `app.go`:

```golang
package main

func main() {

}
```

This program is effectively hello-world without any print statements.

Go ahead and run the program, you have two ways to do this:

```shell
go run app.go
```

Or build a binary, then run it.

```shell
go build
./blank
```

Now add a print statement:

```golang
package main

import "fmt"

func main() {
	fmt.Println("Hello world")
}
```

Now you can build and run the code again, note that you can also change the output of the binary when compiled:

```shell
go build -o hello-world
./hello-world
```

Go offers a convention-based formatting of files, you can format a file and its indentation with:

```shell
gofmt -s -w app.go
```

The `-w` command writes the change to the file.

Go applications can also be cross-compiled for other operating systems without any further changes, here's how you can build the above code for Windows:

```shell
GOOS=windows go build -o hello-world.exe
```

### Parsing JSON

Let's go on to parse some JSON, in Go we can turn a JSON document into a struct which is useful for accessing the data in a structured way. If a document doesn't fit into the structure it will throw an error.

Let's take an API from the Open Notify group - it shows the of people in space and their names.

[People in Space JSON](http://api.open-notify.org/astros.json)

It looks a bit like this:

```json
{"people": [{"craft": "ISS", "name": "Sergey Rizhikov"}, {"craft": "ISS", "name": "Andrey Borisenko"}, {"craft": "ISS", "name": "Shane Kimbrough"}, {"craft": "ISS", "name": "Oleg Novitskiy"}, {"craft": "ISS", "name": "Thomas Pesquet"}, {"craft": "ISS", "name": "Peggy Whitson"}], "message": "success", "number": 6}
```

Create a new project:

```
mkdir -p $GOPATH/src/github.com/alexellis/json1/

cd $GOPATH/src/github.com/alexellis/json1/
```

We will be import the `fmt` package for the `Println` function and the `encoding/json` package so that we can `Unmarshal` the JSON text into a struct. 
> If you're coming from Python, Ruby or Node Unmarshal is similar to JSON.parse() but with type checking.

Create main.go:

```golang
package main

import (
	"encoding/json"
	"fmt"
)

type people struct {
	Number int `json:"number"`
}

func main() {
	text := `{"people": [{"craft": "ISS", "name": "Sergey Rizhikov"}, {"craft": "ISS", "name": "Andrey Borisenko"}, {"craft": "ISS", "name": "Shane Kimbrough"}, {"craft": "ISS", "name": "Oleg Novitskiy"}, {"craft": "ISS", "name": "Thomas Pesquet"}, {"craft": "ISS", "name": "Peggy Whitson"}], "message": "success", "number": 6}`
	textBytes := []byte(text)

	people1 := people{}
	err := json.Unmarshal(textBytes, &people1)
	if err != nil {
		fmt.Println(err)
		return
	}
	fmt.Println(people1.Number)
}
```

We have hard-coded the JSON response from Open Notify so that we can work on one chunk of behaviour at a time.

The `json.Unmarshal` function works with a `[]byte` type instead of a string so we use `[]byte(stringHere)` to create the format we need.

In order to make use of a `struct` to unmarshal the JSON text we normally need to decorate it with some tags that help the std library understand how to map the properties:

```golang
type people struct {
	Number int `json:"number"`
}
```

> The property names need to begin with a capital letter which marks them as *exportable* or *public*. If your struct's property is the same in the JSON you should be able to skip the annotation.

Another thing to notice is that we pass the address of the new / empty people struct into the method. You can try removing the `&` symbol, but the value will be set in a different copy of the empty struct.

> This may seem odd if you are coming from languages that pass parameters *by reference*.

### Putting it together with HTTP

Now we can parse a JSON document matching that of our API, let's go on and write a HTTP client to fetch the text from the Internet.

Go has a built-in HTTP client in the `net/http` package, but it has a problem with long timeouts and there are [some well-known articles](https://medium.com/@nate510/don-t-use-go-s-default-http-client-4804cb19f779#.m1ailtazu) recommending that you set a timeout on your request explicitly.

There are more concise ways of creating a HTTP request in Go, but by adding a custom timeout we will harden our application.

Create a new project:

```
mkdir -p $GOPATH/src/github.com/alexellis/spacecount/
cd $GOPATH/src/github.com/alexellis/spacecount/
```

Now create main.go:

```golang
package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"time"
)

type people struct {
	Number int `json:"number"`
}

func main() {

	url := "http://api.open-notify.org/astros.json"

	spaceClient := http.Client{
		Timeout: time.Second * 2, // Timeout after 2 seconds
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

	if res.Body != nil {
		defer res.Body.Close()
	}

	body, readErr := ioutil.ReadAll(res.Body)
	if readErr != nil {
		log.Fatal(readErr)
	}

	people1 := people{}
	jsonErr := json.Unmarshal(body, &people1)
	if jsonErr != nil {
		log.Fatal(jsonErr)
	}

	fmt.Println(people1.Number)
}
```

If you're used to writing Node.js, then you will be used to most I/O operations returning a nullable error. The same is the case in Go and checking for errors here has made the code quite verbose. You may want to refactor elements of the code into separate methods - one to download and one unmarshal the JSON data.

It may not always make sense to attempt to parse the HTTP response, one case is if the HTTP code returned is a non-200 number. Here's how you can access the HTTP code from the response:

```
	fmt.Printf("HTTP: %s\n", res.Status)

```

If you are unsure whether the JSON schema is stable and expect it to at times, return invalid JSON, then you could extend the parsing code so that it prints out the value received. This is helpful if you want to find out why the text was unable to parse.

```golang
	jsonErr := json.Unmarshal(body, &people1)
	if jsonErr != nil {
		log.Fatalf("unable to parse value: %q, error: %s", string(body), jsonErr.Error())
	}
```

How to be a good citizen on the Internet

There's one more important line I wanted to highlight. I've set a User-Agent in the HTTP request's header. This lets remote servers understand what kind of traffic it is receiving. Some sites will even reject empty or generic User-Agent strings.

```
	req.Header.Set("User-Agent", "spacecount-tutorial")
```

### Taking it further

I wanted to keep this post focused to the original goal of fetching JSON from an API and parsing it. You can extend this example by enhancing its error checking, and by extracting a `struct` with a method for instance, but that is beyond the scope of this introduction.

If you were to extract a method, you could return an error instead of calling `log.Fatal` from multiple lines, but again this is beyond the scope of the post.

#### Enjoyed the tutorial? 🤓💻

**Follow me on [Twitter @alexellisuk](https://twitter.com/alexellisuk)** to keep up to date with new content.

<iframe src="https://github.com/sponsors/alexellis/card" title="Sponsor alexellis" height="225" width="600" style="border: 0;"></iframe>

#### Next up

In the next post we'll approach the problem again with TDD (Test Driven Development) and unit testing in mind. We will also build out a Dockerfile using the Official `golang` Docker image.

* Read my next tutorial: [Golang basics - writing unit tests](https://blog.alexellis.io/golang-writing-unit-tests/)

#### Additional reading

If you're starting out with Golang and are already familiar with other languages then I'd recommend [The Go Programming Language Phrasebook by David Chisnall](https://www.amazon.co.uk/d/cka/Go-Programming-Language-Phrasebook-Developers-Library/0321817141).

Why not checkout my new book [Everday Go](https://gumroad.com/l/everyday-golang) for practical tips and hands-on examples. Unlike most Go books on the market, it's not the equivalent of War and Peace, it's just the things you'll need to know, with working examples and nothing more.

And finally there are the [Golang docs](https://golang.org/doc/), which you may have found already. I personally like having a book but found [this site essential](https://golang.org/doc/).