---
title: "Get storage for your Serverless Functions with Minio & Docker"
slug: "openfaas-storage-for-your-functions"
date: "2018-01-22T18:40:01Z"
author: "Alex Ellis"
meta_title: "Get storage for your Serverless Functions with Minio & Docker"
meta_description: "In this tutorial we explore Block vs Object storage and walk through how to construct serverless functions that make use of Minio, OpenFaaS and Docker."
feature_image: "/content/images/2018/01/pexels-photo-117729-crop.jpg"
tags:
  - "s3"
  - "minio"
  - "openfaas"
  - "tutorial"
  - "storage"
---

In this post I'll show you how to make use of storage for your Serverless functions with [OpenFaaS](https://www.openfaas.com/) using Minio - a lightweight [S3 alternative](https://docs.aws.amazon.com/AmazonS3/latest/dev/Welcome.html). That means you can run your functions with storage on any cloud on your own terms.

## Introduction

Let's talk a little about storage for Docker. Typically you will find two types of storage available:

* Block storage

Block storage is effectively like a disk mounted on your PC or within a container. You can read/write exactly as if it were an SDD or HDD plugged in to the physical host.

Pros:

* No changes needed to code, just pick the "path" or mount.
* Accessible over the network
* Full directory structure available
* Fast

Cons:

* Hard to access securely over the internet
* Hard to manage
* Requires drivers / plugins for Docker Swarm / Kubernetes

Examples: [Ceph](https://ceph.com), [Infinit](https://infinit.sh)


* Object storage

Object storage as popularised by [AWS S3](https://docs.aws.amazon.com/AmazonS3/latest/dev/Welcome.html) provides an API where a binary object or file can be stored or retrieved. 

Pros:

* Self-contained and easy to setup 
* Easier to secure over a network or the Internet
* Client API libraries available for common languages
* Commonly used with cloud/web-applications when targeting AWS S3 buckets
* The backing server can be switched easily between AWS, Ceph, Minio and other providers whether self-hosted or in the cloud

Cons:

* Only a basic file structure is available - i.e. you cannot have files in the root of the server
* When running on your own infrastructure several hosts are required for high availability/replication
* Additional dependency on a client library or command-line utility

Examples: [minio.io](https://minio.io), [Ceph](https://ceph.com)

Block storage is usually attached through mounting a volume from the host directly to the running container. This often causes unexpected behaviour with file permissions. When you start to do this across a cluster mounting a volume from a ephemeral host doesn't make much sense. Network-distributed block storage like Ceph aims to solve this problem. A good example of where you would want this kind of block storage is with an existing application such as a Postgres DB or legacy system.

Given that Serverless functions are:

* short-lived (seconds)
* stateless (no in-memory state/direct storage)
* single-purpose

It should be considered an anti-pattern to attach permanent storage volumes to a function. That means we should evaluate the other options such as using APIs and Object storage.

In this tutorial we will setup Minio and write two Serverless Functions for OpenFaaS that work together to process images in a pipeline. You can then take that template and make it do whatever you need.

## Pre-requisites

These are the pre-requisites for the tutorial, you'll need to configure OpenFaaS before you start.

* [OpenFaaS](https://github.com/openfaas/faas) on Swarm or Kubernetes
* [OpenFaaS CLI](https://github.com/openfaas/faas-cli) installed via brew or curl script
* [Minio](https://minio.io) server component
* [Minio client](https://www.minio.io/downloads.html#download-client) component

We will build up the code as we walk through the tutorial but you can grab [the full example here](https://github.com/alexellis/function-storage-example) from GitHub.

## Setup Minio

You can setup Minio in a few minutes by following the official guides for Docker Swarm or Kubernetes.

![](https://blog.alexellis.io/content/images/2017/01/minio_light_cir_sm-1.png)
[https://minio.io](https://minio.io)

Important you must take note of your AccessKey and SecretKey which are used to access storage.

When working with Minio it's useful to install the `mc` (minio-client) CLI. You can use it to copy files in/out of buckets and access remote servers.

Please download the [Minio Client  (mc) here](https://www.minio.io/downloads.html#download-client) before continuing.

When you run the Minio Server for the first time it will print out a command for configuring your `mc` client - i.e.

```
mc config host add myminio http://192.168.0.35:9000 67L5FZ4DGF58HG7SR5FY W9HYUC03qIRJb06qENoZZ6ZXUGP9Z3DrGkK49dRY
```

> Note: If you see a private IP from your Docker container you may need to change it for the service IP such as the public or private network IP i.e. http://192.168.0.35:9000

Make the two initial buckets. You could also do this through code:

```
$ mc mb docker/incoming
$ mc mb docker/processed
```

## Write the functions

Let's write two short Python functions:

LoadImages

* Passed a JSON map of URLs
* Download the images and puts them into an `incoming` bucket
* Calls ProcessImages with the filenames and paths of the images

ProcessImages

* Downloads the images from the bucket
* Converts to black and white
* Uploads to a new `processed` bucket

### Scaffold the functions

You can scaffold the functions with `faas-cli new`:

```
faas-cli new --lang python loadimages
faas-cli new --lang python processimages
```

Each Python function you create gets its own folder for the handler.py and requirements.txt.

Update the requirements.txt as used by `pip` during the building of the functions:

loadimages/requirements.txt

```
requests
minio
```

processimages/requirements.txt
```
requests
minio
```

This installs a HTTP client and the Minio client into the function.

### LoadImages function

Let's work on the loadimages function. The input will be a JSON payload with the URLs we need to download and process in the function.

* Input: 

```
{
 "urls": [
   "https://images.pexels.com/photos/72161/pexels-photo-72161.jpeg?dl&fit=crop&w=640&h=318",
   "https://images.pexels.com/photos/382167/pexels-photo-382167.jpeg?dl&fit=crop&w=640&h=337"]
}
```

* Output:

The output is an array of filenames in the `incoming` bucket:

```
["filename1", "filename2"]
```

> These URLS point to two colour images from Pexels.com - free stock art images.

Let's now look at the handler which:

* Downloads each file
* Creates a UUID as a filename
* Copies the file to the Minio bucket
* Finally returns a list of filenames for the next step

loadimages/handler.py.

```
from minio import Minio
import requests
import json
import uuid
import os

def handle(st):
    req = json.loads(st)

    mc = Minio(os.environ['minio_hostname'],
                  access_key=os.environ['minio_access_key'],
                  secret_key=os.environ['minio_secret_key'],
                  secure=False)

    names = []
    for url in req["urls"]:
        names.append(download_push(url, mc))
    print(json.dumps(names))

def download_push(url, mc):
    # download file
    r = requests.get(url)

    # write to temporary file
    file_name = get_temp_file()
    f = open("/tmp/" + file_name, "wb")
    f.write(r.content)
    f.close()

    # sync to Minio
    mc.fput_object("incoming", file_name, "/tmp/"+file_name)
    return file_name

def get_temp_file():
    uuid_value = str(uuid.uuid4())
    return uuid_value
```

Now update the YML file for your function with the environmental variables needed for accessing Minio. These can also be put through secure Kubernetes or Docker secrets at a later date.

loadimages.yml
```
provider:
  name: faas
  gateway: http://localhost:8080

functions:
  loadimages:
    lang: python
    handler: ./loadimages
    image: loadimages
    environment:
      minio_hostname: "192.168.0.35:9000"
      minio_access_key: "67L5FZ4DGF58HG7SR5FY"
      minio_secret_key: "W9HYUC03qIRJb06qENoZZ6ZXUGP9Z3DrGkK49dRY"
      write_debug: true
```

Now we need to build, deploy and invoke the function. If you're using a single-node cluster or your laptop you shouldn't need to push the images to the Docker Hub.

```
$ faas-cli build -f loadimages.yml

# Remote clusters or multi-node
$ faas-cli push -f loadimages.yml

$ faas-cli deploy -f loadimages.yml
```

Invoke the function:

```
$ echo '{
 "urls": [
   "https://images.pexels.com/photos/72161/pexels-photo-72161.jpeg?dl&fit=crop&w=640&h=318",
   "https://images.pexels.com/photos/382167/pexels-photo-382167.jpeg?dl&fit=crop&w=640&h=337"]
}' | faas invoke loadimages

["761ac85c-ec76-4114-9790-ce9fa2a772f9", "64d080ec-5685-44cc-9c70-5d5886823707"]
```

You'll see the two image filenames which were uploaded are returned to you on the console in a JSON array. These files will now be available in the "incoming" bucket in Minio.

Here's one of the files I copied back to my computer from Minio:

![](/content/images/2018/01/pexels-photo-72161.jpeg)

You can open the UI at http://localhost:9000 or whatever IP address you used.

![](/content/images/2018/01/Screen-Shot-2018-01-22-at-18.33.42.png)

*Above: Minio UI*

### ProcessImages

Let's work on the `processimages` function.

* Fetch image from Minio in the `incoming` bucket
* Convert to black and white using a third-party ImageMagick function
* Push back to the `processed` bucket

Now we could add a dependency to ImageMagick to do the B&W conversion, but OpenFaaS already has a function that we can deploy for this and then call it from our function.

* Input:

The input is an array of filenames to be fetched from the `incoming` bucket:

```
["filename1", "filename2"]
```

* Output:

The output is an array of filenames in the `processed` bucket:

```
["filename3", "filename4"]
```

Edit `processimages.yml`

* Add Minio config
* Add a section for the "convertbw" function

processimages.yml

```
provider:
  name: faas
  gateway: http://localhost:8080

functions:
  processimages:
    lang: python
    handler: ./processimages
    image: processimages
    environment:
      minio_hostname: "192.168.0.35:9000"
      minio_access_key: "67L5FZ4DGF58HG7SR5FY"
      minio_secret_key: "W9HYUC03qIRJb06qENoZZ6ZXUGP9Z3DrGkK49dRY"
      write_debug: true

  convertbw:
    skip_build: true
    image: functions/resizer:latest
    fprocess: "convert - -colorspace Gray fd:1"
```

You'll see that the convertbw function is using an image from the Docker hub so we can add a `skip_build` entry. It also doesn't need access to Minio so we don't provide the environmental variables for it.

processimages/requirements.txt

```
minio
requests
```

Our handler for `processimages` is very similar to the one we made for `loadimages`. It does the following:

* Parses the input as JSON
* Downloads each file from a Minio bucket - one-by-one
* Sends each file as a binary HTTP POST to the convertbw function and saves the result to disk
* The result is then pushed into the Minio bucket called `processed`
* The resulting filenames are printed back to the caller

processimages/handler.py
```
from minio import Minio
import requests
import json
import uuid
import os

def handle(st):
    req = json.loads(st)

    mc = Minio(os.environ['minio_hostname'],
                  access_key=os.environ['minio_access_key'],
                  secret_key=os.environ['minio_secret_key'],
                  secure=False)

    names = []
    source_bucket = "incoming"
    dest_bucket = "processed"

    for file_name in req:
        names.append(convert_push(source_bucket, dest_bucket, file_name, mc))

    print(json.dumps(names))

def convert_push(source_bucket, dest_bucket, file_name, mc):
    mc.fget_object(source_bucket, file_name, "/tmp/" + file_name)

    f = open("/tmp/" + file_name, "rb")
    input_image = f.read()

    # download file
    r = requests.post("http://gateway:8080/function/convertbw", input_image)

    # write to temporary file
    dest_file_name = get_temp_file()
    f = open("/tmp/" + dest_file_name, "wb")
    f.write(r.content)
    f.close()

    # sync to Minio
    mc.fput_object(dest_bucket, dest_file_name, "/tmp/"+dest_file_name)

    return dest_file_name

def get_temp_file():
    uuid_value = str(uuid.uuid4())
    return uuid_value
```

Build and deploy the new function using the new .yml file:

```
$ faas-cli build -f processimages.yml

# Remote clusters or multi-node
$ faas-cli push -f processimages.yml

$ faas-cli deploy -f processimages.yml
```

Now let's invoke the `processimages` function using the output of the previous function.

```
$ echo '["761ac85c-ec76-4114-9790-ce9fa2a772f9", "64d080ec-5685-44cc-9c70-5d5886823707"]' | faas invoke processimages

["6b70561c-35a4-410c-a216-5582c6da6afe", "2f3a9741-4e63-4d03-966c-c40813d084b9"]
```

The output from the ProcessImages function gives the new location in the `processed` bucket of the black and white photos.

You can copy them back to your computer using `mc cp` or view them with the Minio UI at localhost:9000 (or wherever you have set this up). For instance:

```
$ mc cp myminio/processed/6b70561c-35a4-410c-a216-5582c6da6afe .
```

![](/content/images/2018/01/838e393f-c314-43a7-8454-7286125ff984.jpg)

In our instance if you add a .jpg extension to the file you should be able to open it in Finder / Windows Explorer etc.

## Summing up

We now have two functions which form part of a pipe-line so that we can separate the downloading of files with the processing of them. Object storage is provided by Minio which means we can store the results of the functions easily and pass them along from one function to another by filename.

Grab the code from GitHub: [alexellis/function-storage-example](https://github.com/alexellis/function-storage-example)

This example is not a finished product, that's where you come in - so here are some ideas for enhancements you could make.

Make it yours:

* Perform your own transformation or analysis on the files - perhaps use audio files or videos instead of plain JPEG images.
* You could have the resulting processed images sent over to your [Slack channel](https://api.slack.com/incoming-webhooks) via a HTTP POST.

Make it secure:

* Use Swarm or Docker secrets through OpenFaaS's secret support so you can encrypt the API tokens for Minio
* [Lock down the OpenFaaS gateway for the Internet](https://blog.alexellis.io/lock-down-openfaas/)

Go "pro":

* Copy your functions into a single .yml file instead of using one .yml file per function
* Rename your .yml file to `stack.yml` so that you don't need to specify the `-f` argument
* Open the Minio UI on http://localhost:9000 to browse the results of your pipeline
* Create a "director function" which creates a workflow between the LoadImages and ProcessImages functions.

### Get involved with OpenFaaS

![](https://cdn-images-1.medium.com/max/1600/1*C9845SlyaaT1_xrAGOBURg.png)

Head over to [GitHub](https://github.com/openfaas/) or the [project website](https://www.openfaas.com/) to keep learning.

* [Read Community tutorials](https://github.com/openfaas/faas/blob/master/community.md)

* [Get OpenFaaS SWAG and free sticker credits](http://github.com/openfaas/media)

If you'd like to contribute please check out our [contributing guide](https://github.com/openfaas/faas/blob/master/CONTRIBUTING.md) for all the ways you can help.