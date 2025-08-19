---
title: "Explore and debug GitHub Actions via SSH"
slug: "explore-and-debug-github-actions-via-ssh"
date: "2024-02-20T11:47:47Z"
author: "Alex Ellis"
meta_title: "Explore and debug GitHub Actions via SSH"
meta_description: "As part of actuated, we needed to debug and explore VM images for GitHub Actions via SSH. I'm now making that available to my GitHub Sponsors for free."
tags:
  - "ssh"
  - "github actions"
  - "debug"
---

When we were developing VM images for GitHub Actions for [actuated](https://actuated.dev), we often needed to get a shell to explore and debug jobs. That functionality [was also added for customers](https://docs.actuated.dev/tasks/debug-ssh/#try-out-the-action-on-your-agent) who used it to debug tricky jobs. I'm making it available for free for [my GitHub Sponsors](https://github.com/sponsors/alexellis).

## Use-cases

* You need some apt packages, but don't know which ones. You go through a red/green or (red/red/red/red/red/green) cycle and it takes a long time
* Something's going wrong - you don't know what? Out of disk? Out of RAM? CPU overloaded? There's no quick way to find out, let's open an SSH session and run `htop`, `iostat` and `df -h` in a tmux session?
* Your tests run for around 2 hours, then they crash. You're wasting hours of your time. OK pop a breakpoint in, and then look at the results in more detail
* You want to copy files in/out to the VM for quicker testing of RC releases or code that's under a lot of churn
* You're running a webservice or a Kubernetes cluster, and need to connect to it from your workstation to explore or verify something

The list goes on, and the above is only really about debugging and troubleshooting CI.

You can also use the SSH behaviour to get a short-lived ephemeral shell for up to 6 hours either on hosted runners or self-hosted ones.

## A quick video

<iframe width="560" height="315" src="https://www.youtube.com/embed/l9VuQZ4a5pc?si=BdIWkE-xX9bsCz7O" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

## How does it work?

You add the following to any job to allow the custom action to obtain an OIDC token to verify your identity, and that you are a sponsor.

```yaml
permissions:
  id-token: write
  contents: read
  actions: read
```

Then either at the start of a job, or wherever you're having trouble add:

```yaml
    steps:
    - uses: self-actuated/connect-ssh@master
```

The action installs SSH, configures it with only your SSH keys, disables root and password login, then connects itself to the SSH gateway.

Then using the actuated CLI, you can simply list sessions and connect to one of them:

```bash
actuated-cli ssh list

actuated-cli ssh connect
```

Whenever you're done, you can type in `sudo reboot` to exit the workflow, or `unblock` to continue on with whatever step comes next.

## Port-forwarding and accessing TCP ports

You can also port-forward anything running on the local host such as Nginx to visit in your browser.

Run Nginx with Docker

```bash
docker run -d --name nginx --rm -p 80:80 nginx:latest
```

Then start another SSH session, but add `-L 8080:127.0.0.1:80`

Now open up a web-browser to `http://127.0.0.1:8080` and you'll see the web-server running within the GitHub Actions VM.

## Copying files up and down

You can adapt the `ssh` command to an `scp` or `sftp` command, just change the `-p` to a `-P`.

```
scp -P PORT local-file.txt runner@remote-ip:~/
```

The same works in the opposite direction, if you need to copy a file from the runner to run or inspect locally, just reverse the order of the command:

```
scp -P PORT runner@remote-ip:~/remote-file.txt ./
```

## Wrapping up

This was a very short blog post because the actuated SSH gateway is simple. You get a remote shell into a hosted or self-hosted GitHub Actions runner just by adding a little bit of YAML to your GitHub Action.

As a sponsor you won't get access to the actuated dashboard, so instead, you should use the [actuated-cli](https://github.com/self-actuated/actuated-cli) and follow the instructions in the README file to get started.

How does this differ from XYZ solution?

* The SSH gateway only forwards TCP packets, there is no interception or decryption as with other free/SaaS solutions that may attempt to provide a similar solution.
* A 100% standard, upstream SSH server is used in the VM.
* It's [powered by inlets](https://docs.inlets.dev), so works behind restrictive networks.

Want to try it out? [Sponsor me on GitHub](https://github.com/sponsors/alexellis/) and support my Open Source tools like [arkade, k3sup and OpenFaaS](https://github.com/alexellis) at the same time.

If you have questions, suggestions or comments, feel free to email me. My contact details are available on [my GitHub profile](https://github.com/alexellis).