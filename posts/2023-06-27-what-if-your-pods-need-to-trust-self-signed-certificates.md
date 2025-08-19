---
title: "What if your Pods need to trust self-signed certificates?"
slug: "what-if-your-pods-need-to-trust-self-signed-certificates"
date: "2023-06-27T11:09:18Z"
author: "Alex Ellis"
meta_title: "What if your Pods need to trust self-signed certificates?"
meta_description: "Self-signed certificates are common within enterprise companies. But how do you distribute them and enable their use in Kubernetes as a user and a vendor?"
---

The use of self-signed certificates or a custom CA is common practice within enterprise companies. What if your Pods within Kubernetes need to talk to endpoints over TLS using those certificates?

This has come up in the past with the OpenFaaS CLI where open-source users asked for that ever so precarious solution of adding a `--tls-insecure` or `--tls-no-verify` flag, which we all know is an awful compromise on security.

The most used CLI took for accessing HTTP endpoints is curl, it has a built-in flag of `-k` to bypass TLS verification.

Why? Because whilst the data may be encrypted using a TLS certificate, there is no verification - so you could be using a TLS certificate that is compromised or that was injected into the data path by an attacker.

So the usual answer for this on a Linux system is to: download the trust bundle for the certificate, add it to a set folder, and to run a command to install it.

For Ubuntu/Debian it looks like this:

```
sudo cp custom.pem /usr/local/share/ca-certificates/custom.crt

sudo update-ca-certificates
```

Note that the .pem file had to be renamed to .crt for the update process to pick it up.

And of course you can run the same within a "RUN" step in a Dockerfile.

## Options for vendors and consumers

Generally, unless you only create and consume your own work, then you'll be either a vendor or a consumer some of the time, maybe both.

As a vendor, you could:

* Update your application code
    You could write a new version of your code that loads the customer's custom bundle into a HTTP client before using in. Within Go for instance, this is a simple change to the HTTP client.
    
    ```
        cert, err := // Load certificate
        roots := x509.NewCertPool()
	    ok := roots.AppendCertsFromPEM(cert)
	    if !ok {
          panic("unable to append cert")
        }

        tr := &http.Transport{
          TLSClientConfig = &tls.Config{
            RootCAs:            certPool,
          }
        }
        
        client := http.Client{}
        client.Transport = tr
        
        res, err := client.Do(http.MethodGet, "https://self-signed/", nil)
    ```
    
    But remember, you need to somehow obtain that certificate, and you can't really fetch it over HTTP from a server which has that certificate already, because it would defeat the point.
    
    So you'll either need to server that file over an already trusted certificate, or have it available on the filesystem. In the later case, you'll need to add an extra volume mount which brings me onto the next point.
    
* Add an extra volume and mount to your Helm chart

    Whether using Helm, plain manifests or Kustomize, you could add a new section to your Helm chart to allow an extra volume to be given. In this case, the customer can directly replace the main certificate bundle held at `/etc/ssl/certs/ca-certificates.crt`
    
    For an example of this, see the values.yaml file of the [kube-prometheus-stack](https://github.com/prometheus-community/helm-charts/blob/main/charts/kube-prometheus-stack/values.yaml) chart.
    
As a consumer:

* Fork each chart and add extra volumes

    You could ask the upstream project that you consume to add extra volumes, but if they can't for some reason, you could fork the chart and add it yourself.
    
    The downside here is that you now have to maintain a fork of their chart which will be hard to keep in sync, and it's likely you'll miss important changes and updates.
    
* Mirror each image and rebuild it with your certificate

    If you're at the kind of company that uses custom CA certificates, then it's likely that you also use a private registry and mirror all container images there before deploying them.
    
    Set up a GitHub or GitLab pipeline for each image you consume, and do something like the following:
    
    ```
    FROM ghcr.io/openfaasltd/queue-worker:${VERSION:-latest}

    COPY custom.pem /usr/local/share/ca-certificates/custom.crt
    RUN update-ca-certificates
    ```
    
    With this approach, you don't rebuild the whole image, but inherit from a given image and then add the cert into the trust bundle, just like the manual Linux commands.
    
    This only works if there is a proper OS in the base image like Alpine Linux, Debian or Ubuntu. If a SCRATCH image or Distroless is being used, there may be no `update-ca-certificates` command available. In that case, we recommended the following for a customer which they now use:
    
    ```
    FROM alpine:3.18.0 as add-cert
    RUN apk add --no-cache ca-certificates
    ADD custom-ca.pem /usr/local/share/ca-certificates/custom-ca.crt
    RUN update-ca-certificates

    FROM ghcr.io/openfaasltd/openfaas-oidc-plugin:0.6.2 as ship
    COPY --from=add-cert /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/ca-certificates.crt
    ```
    
    Dan Lorenc shared a tool with me that doesn't require Docker to be installed on the CI system, it may well be quicker because it interacts with the container image directly: [dlorenc/incert](https://github.com/dlorenc/incert). As per my solution above, it also gets past the problem of needing a "update-ca-certificates" binary within the container image in the first place. 
    
* Container Storage Interface (CSI) integration

    [CSI](https://kubernetes.io/blog/2019/01/15/container-storage-interface-ga/) is used to inject files, secrets, and/or storage volumes into Pods within Kubernetes.

    There's an experimental operator being built by the cert-manager community which can introduce files into containers without needing them to be rebuilt, download from an insecure HTTP endpoint or changing Helm charts
    
    It's called the [trust-manager](https://cert-manager.io/docs/projects/trust-manager/) and is primarily used to help cert-manager act as a kind of service mesh replacement, but could potentially be used here too.
    
    It's the smartest option of the bunch, but it's not recommended for production and introduces a relatively large and complex piece of infrastructure into each of your clusters.

## Wrapping up

There are a number of ways to use a private / self-signed certificate or root authority within Kubernetes, the two most popular are - rebuilding each image consumed or mounting an extra volume to replace the default trust bundle.

Both have pros and cons - both can involve a lot of manual work, but this is where we are at the moment. I'm not sure I'm fond of either, and I'd like to hear from you if you have a better suggestion or have found something that works well for your team.

You hear other approaches people have taken, or share your own views on my [Twitter thread](https://twitter.com/alexellisuk/status/1673273323478736897?s=20)

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">If you consume OSS or commercial software within your team, but use a custom self-signed CA..<br><br>How are you adding that CA to the bundle of trust for each of the images that you need to run in Kubernetes?<br><br>And is it any different for distroless/SCRATCH?<br><br>1) You do a new build of…</p>&mdash; Alex Ellis (@alexellisuk) <a href="https://twitter.com/alexellisuk/status/1673273323478736897?ref_src=twsrc%5Etfw">June 26, 2023</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>