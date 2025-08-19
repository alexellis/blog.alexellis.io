---
title: "Your first serverless Python function with OpenFaaS"
slug: "first-faas-python-function"
date: "2017-08-11T12:00:00Z"
author: "Alex Ellis"
meta_title: "Your first serverless Python function with OpenFaaS"
meta_description: "In less than 10 minutes you'll have written your first Serverless function in Python with OpenFaaS & Docker Swarm and wondering what to build next."
feature_image: "/content/images/2017/08/hot-air-ballooning-balloon-cappadocia-dawn-50674.jpg"
tags:
  - "serverless"
  - "tutorial"
  - "function"
  - "faas"
  - "Python"
  - "openfaas"
---

Let's write a Python function with [OpenFaaS](https://github.com/openfaas/faas) that executes hello-world and then move onto something more. We'll start by deploying [OpenFaaS](https://github.com/openfaas/faas) on our machine and then we'll install the CLI and write the handler for our function. 

![](https://blog.alexellis.io/content/images/2017/08/clip-1.png)

*OpenFaaS is democratising serverless functions - through Docker containers.*

**Pre-requisites:**

* [Docker or Docker Desktop](https://www.docker.com/community-edition)
* Bash - if you're using Windows then install [Git bash](https://git-scm.com/downloads)
* [Brew](https://brew.sh) (optional)

> You can read my [Introduction to Functions as a Service](https://blog.alexellis.io/introducing-functions-as-a-service/) here.

### Step 1 - Install the OpenFaaS CLI

The CLI is a convenient way to interact with your functions. You can use it to build and/or deploy functions to your cluster.

On Linux type in:

```
$ curl -sSL https://cli.openfaas.com | sudo sh
```

> If you're using Windows, then you're not out of luck, you can actually find the Windows executable on the [FaaS releases page](https://github.com/openfaas/faas-cli/releases/tag/0.4.5-b).

### Step 3 - Deploy OpenFaaS

Deploy OpenFaaS with Kubernetes or with faasd, pick one and follow the instructions: [OpenFaaS Deployment](https://docs.openfaas.com/deployment/)

Use the instructions given to you to log in with `faas-cli login`

You can try out one of the sample functions from the Function Store.

For instance The function named hubstats will tell you how many Docker Hub images a user has. I typed in my user account and found out I have almost 200 already!

![](/content/images/2017/08/hubstats.png)

To deploy it yourself run:

```bash
faas-cli store list

faas-cli store deploy hubstats
```

> Note: this function is not available for Raspberry Pi at this time.

### Step 3 - Write your function

Create a new folder for your work:

```
$ mkdir -p ~/functions && \
  cd ~/functions
```

Now let's scaffold a new Python function using the CLI:

```
$ faas-cli new --lang python hello-python
```

This creates three files for you:

```
hello-python/handler.py
hello-python/requirements.txt
hello-python.yml
```

Let's edit the handler.py file:

```
def handle(req):
    print("Hello! You said: " + req)
```

*handler.py*

All your functions should be specified in a YAML file like this - it tells the CLI what to build and deploy onto your OpenFaaS cluster.

Checkout the YAML file `hello-python.yml`:

```
provider:
  name: faas
  gateway: http://localhost:8080

functions:
  hello-python:
    lang: python
    handler: ./hello-python
    image: hello-python
```

*hello-python.yml*

* `gateway`- here we can specify a remote gateway if we need to, what the programming language is and where our handler is located within the filesystem.

* `functions` - this block defines the functions in our stack

* `lang: python` - even though Docker is used behind the scenes to package your function. You don't have to write your own Dockerfile unless you want to.

* `handler` - this is the folder / path to your handler.py file and any other source code you need

* `image` - this is the Docker image name. If you are going to push to the Docker Hub change the prefix from hello-python to include your Docker Hub account - i.e. alexellis/hello-python

So let's build the function.

```
$ faas-cli build -f ./hello-python.yml
...

Successfully tagged hello-python:latest
Image: hello-python built.
```

You'll now see output from the Docker Engine as it builds your function into an image in your local Docker library. You'll see the image appear on `docker images`

For example you could run:

```
$ docker images | grep hello-python
hello-python        latest       e0344b26305f     one minute ago
```

**Testing on a single host**

If you're trying thing out on a single host, then you don't need to push your images to a registry, they'll just be used from the local Docker library.

**Remote host, or multi-node cluster**

If you are using a remote server or a multi-node cluster then you can push your function's image to a registry or the [Docker Hub](https://hub.docker.com). The Docker Hub is a free service provided by Docker Inc for sharing container images over the Internet. 

> If you are an advanced user, you can also run a *container image registry* within your own network. Link: [Docker Registry docs](https://docs.docker.com/registry/)

You'll also need to image the `image:` name to include your Hub account such as `image: alexellis2/hello-python`.

Here's how to upload the function to a remote registry (if needed):

```
$ faas-cli push -f ./hello-python.yml
```

Once you have multiple functions you can also use the `--parallel` argument to speed things up.

Let's deploy the function:

```
$ faas-cli deploy -f ./hello-python.yml
Deploying: hello-python.
No existing service to remove
Deployed.
200 OK
URL: http://localhost:8080/function/hello-python
```

And it's ready to be tested! Either open up the UI or use `curl` to call it:

```
$ curl localhost:8080/function/hello-python -d "it's Alex here"
Hello! You said: its Alex here
```

You can even use the `faas-cli` to list and invoke your functions.

Try playing with these two commands including looking at the help page with the `--help` parameter:

* `faas-cli list`
* `echo "Hello!" | faas-cli invoke hello-python`

### Step 4 - Import 3rd party dependencies

So what if you need some dependencies to add behaviour beyond the standard Python libraries? Well you can use `pip` by providing a `requirements.txt` file along with your function handler.

Let's include the popular `requests` module which we can use to interact with webpages.

You will see a file called hello-python/requirements.txt. Add the following line:

```
requests
```
*requirements.txt*

Now we can update our Python code. Let's make it so it can accept JSON request of a URL and a string we want to test for:

We'll trigger it using a JSON request, which will take this format:

```
{
 "url": "https://blog.alexellis.io/rss/",
 "term": "docker"
}
```

Now update the `hello-python/handler.py` file:

```
import requests
import json

def handle(req):
    result = {"found": False}
    json_req = json.loads(req)
    r = requests.get(json_req["url"])
    if json_req["term"] in r.text:
        result = {"found": True}

    print json.dumps(result)
```
*handler.py*

Then just rebuild, (re-push if needed) and re-deploy.

```
$ faas-cli build -f ./hello-python.yml && \
  faas-cli deploy -f ./hello-python.yml
```
*This time you'll see `pip` installing your function's modules such as `requests`.

Finally test it out!

```
$ curl localhost:8080/function/hello-python --data-binary '{
 "url": "https://blog.alexellis.io/rss/",
 "term": "docker"
}'
```

Here's the result:

```
{"found": true}
```

Let's try another site:


```
$ curl localhost:8080/function/hello-python --data-binary '{
 "url": "https://www.kubernetes.io/",
 "term": "docker"
}'
{"found": False}
```

You can also access the function just as easily via the UI.

![](/content/images/2017/08/invoke.png)

* Metrics

[Prometheus](https://prometheus.io/) is also baked into the FaaS stack, which means you can checkout the various metrics on how your functions are being used as well as how long they're taking to run. You can view the Prometheus UI at http://localhost:9090

* Troubleshooting

If you run into any errors such as `Can't reach service` check the following:

* If it's a multi-node cluster, you have to push your images to the Docker Hub or similar registry before deploying
* If you're still getting the error `docker service logs --no-trunc=true hello-python` will give a bit more info.

### Step 5 - Going further

> Please show support and **Star** the project on [Github](https://github.com/openfaas/faas)

![](/content/images/2017/08/faas_side.png)

Now that you've built your first function, why not checkout some of the examples built by the OpenFaaS community? You can share your first serverless OpenFaaS function with us on [Twitter](https://twitter.com/open_faas) or [Github](https://github.com/openfaas/faas/).

Want to know more about the OpenFaaS Serverless framework for containers?

> You can read my [Introduction to Functions as a Service here](https://blog.alexellis.io/introducing-functions-as-a-service/).

* [OpenFaaS community page - example functions, talks and blogs](https://github.com/openfaas/faas/blob/master/community.md)

**Setup FaaS with free credits**

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Who doesn&#39;t like free as in 🍻? Get 10$ on <a href="https://twitter.com/digitalocean">@digitalocean</a> to kick the tyres with FaaS just use the &quot;docker&quot; 🐳 image! <a href="https://t.co/MqpCdHQQbQ">https://t.co/MqpCdHQQbQ</a> <a href="https://t.co/LZcihReSUq">pic.twitter.com/LZcihReSUq</a></p>&mdash; Alex Ellis (@alexellisuk) <a href="https://twitter.com/alexellisuk/status/897396630282018817">August 15, 2017</a></blockquote> <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

**Learn Docker**
If you want to learn more about [Docker](https://www.docker.com/community-edition) for DevOps and developers, checkout [my Docker series](https://blog.alexellis.io/tag/docker/).