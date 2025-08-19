---
title: "Running Falco and k3s at the edge with 64-bit ARM"
slug: "falco-at-the-edge-arm64"
date: "2020-10-13T17:01:03Z"
author: "Alex Ellis"
meta_title: "Running Falco and k3s at the edge with 64-bit ARM"
meta_description: "Falco is an open source tool that instruments and reports on syscalls directly from your kernel. Learn how to use it at the edge with k3s and 64-bit ARM."
tags:
  - "arm64"
  - "k3sup"
  - "k3s"
  - "security"
  - "arm"
  - "bare-metal"
  - "kubernetes"
---

Falco is an open source tool that peeks into the internals of your system to detect and report on syscall and network activity. It was originally built at [Sysdig](https://sysdig.com) and later donated to the [CNCF](https://www.cncf.io/) where it's doing well as an Incubator project with an active community.

My understanding of Falco from [Sysdig's CTO](https://twitter.com/lorisdegio) is that it's designed to be the last-line of defence in systems where the focus is usually put on preventative measures. Falco stands in to report on anomalies and unexpected behaviour.

When running [k3s](https://k3s.io/) at an edge location, it may be difficult to gain physical access to servers, and there may be partial connectivity available.

![cluster-board](/content/images/2020/10/cluster-board.jpg)

> Pictured above: a net-booted Raspberry Pi cluster running on a purpose-designed industrial unit "BitScope Cluster Blade" by [BitScope Designs](https://bitscope.com/blog/JK/?p=JK38B)

By default there are three possible event sources for Falco:
* The kernel and a number of syscalls
* [eBPF](https://ebpf.io/) - faster than kernel access, but not available everywhere
* Userland using [PTRACE(2)](https://man7.org/linux/man-pages/man2/ptrace.2.html) - for potential use with SaaS products like AWS Lambda

These events can be sent to a webhook such as an [OpenFaaS function](https://www.openfaas.com/) for remediation at the edge, or alerting and decision-making in a centralised action-centre in the cloud. As a generic event-sink, data can be ingested directly from the Kubernetes API, but a smart device such as a door-lock could also send data such as the current temperature, or unexpected motion picked up from an accelerometer.

![Event-detection--and-remediation-with-OpenFaaS](/content/images/2020/10/Event-detection--and-remediation-with-OpenFaaS.png)

> Conceptual architecture: event detection from the Kernel, eBPF, the k3s API with alerting and remediation via [OpenFaaS](https://www.openfaas.com/).

In this guide I'll show you how to configure Falco to run at the edge with k3s on an ARM64 host such as the [Ampere eMAG®](https://amperecomputing.com/emag/) provided by [Equinix Metal](https://blog.equinix.com/blog/2020/10/06/equinix-metal-metal-and-more/) (Equinix provide credits for open source projects hosted by the CNCF), an AWS Graviton instance, or a [Raspberry Pi 4](https://www.raspberrypi.org/products/raspberry-pi-4-model-b/).

## Tutorial

We'll start off by flashing Ubuntu Linux to the SD card, then adding k3s, finally we'll install Falco and configure k3s to send it events.

### Download the Operating System

You will need a Raspbery Pi 4. I am using a device with 4GB of RAM, but 2GB will also work.

Download the Ubuntu 20.04.01 image using the link for the Raspberry Pi 4.

You can get the image here: https://ubuntu.com/download/raspberry-pi

Now use [Etcher.io](https://etcher.io) or `dd` to write the server OS image to your Raspberry Pi's SD card.

### First boot

> Note: Unlike with RaspiOS, SSH is enabled by default.

Boot up the machine and find it on your network using `nmap`:

```bash
nmap -sP 192.168.0.0/24
```

Log in and change the password from `ubuntu` to whatever you like:

```
ssh ubuntu@192.168.0.101
```

Next, copy over your SSH key:

```
ssh-copy-id ubuntu@192.168.0.101
```

### Prepare for k3s

Edit `/firmware/boot/cmdline.txt` and add to the first line, don't add any line-breaks:

```
cgroup_enable=cpuset cgroup_memory=1 cgroup_enable=memory
```

This enables cgroups which are required to set limits for containers. The step is taken from my tutorial for Raspbian: [Will it cluster? k3s on your Raspberry Pi](https://blog.alexellis.io/test-drive-k3s-on-raspberry-pi/)

Reboot your RPi:

```bash
sudo reboot
```

### Install k3s with k3sup

Use my k3sup tool to your workstation to install k3s over SSH. Do not run this on the RPi itself.

```
curl -sLS https://get.k3sup.dev | sudo sh
```

Now install via `k3sup install`:

```
k3sup install --ip 192.168.0.101 --user ubuntu \
  --channel latest
```

The `--channel` command installs Kubernetes 1.19.

### Install Falco and its dependencies

Log back into the RPi via SSH.

A fork of the upstream project is required to run on 64-bit ARM at present, but I expect these changes to be merged back in soon. A maintainer has provided a .deb file:

```bash
sudo apt-get -y install linux-headers-$(uname -r) dkms
```

DKMS is required to build a Kernel module. This is one of the ways that Falco can instrument your system.

> You can also build from source using the `build/aarch64` branch.

Install Falco's binary and let it build its kernel module:

```bash
wget https://fs.fntlnz.wtf/falco/aarch64-builds/falco-0.26.1-48%2Bf82d905-aarch64.deb

sudo dpkg -i ./falco-0.26.1-48+f82d905-aarch64.deb
```

Silence some errors in the falco config file.

Edit `/etc/falco/falco.yaml` and replace the following:

```yaml
syscall_event_drops:
  actions:
    - log
    - alert
  rate: .03333
  max_burst: 10
```
  
With:

```yaml
syscall_event_drops:
  actions:
    - ignore
  rate: .03333
  max_burst: 10
```

This turns off some noise that I was seeing from the ARM-64 version.

Enable it upon boot-up:

```
sudo systemctl enable falco \
  && sudo systemctl start falco
```

You can find the various pre-loaded rules for falco at `/etc/falco/rules/`

```
ls /etc/falco/rules/

falco.yaml
falco_rules.local.yaml
falco_rules.yaml
k8s_audit_rules.yaml
```

### Simulate a Falco event

Before configuring Kubernetes to send events to Falco, we can send a sample event that will trigger one of the built-in alerts.

```
cat >> sample-event.json <<EOF
{"kind":"Event","apiVersion":"audit.k8s.io/v1beta1","metadata":{"creationTimestamp":"2018-10-25T13:58:49Z"},"level":"Request","timestamp":"2018-10-25T13:58:49Z","auditID":"841d3e6d-90d2-43df-8da4-684738bee3d5","stage":"ResponseComplete","requestURI":"/api/v1/namespaces","verb":"create","user":{"username":"system:anonymous","groups":["system:masters","system:authenticated"]},"sourceIPs":["192.168.99.1"],"objectRef":{"resource":"namespaces","name":"foo","apiVersion":"v1"},"responseStatus":{"metadata":{},"code":201},"requestObject":{"kind":"Namespace","apiVersion":"v1","metadata":{"name":"foo","creationTimestamp":null},"spec":{},"status":{"phase":"Active"}},"requestReceivedTimestamp":"2018-10-25T13:58:49.730588Z","stageTimestamp":"2018-10-25T13:58:49.736141Z","annotations":{"authorization.k8s.io/decision":"allow","authorization.k8s.io/reason":""}}
EOF
```

Invoke the event via Falco's REST API:

```bash
curl http://127.0.0.1:8765/k8s-audit --data-binary @sample-event.json -H "Content-Type: application/json"
```

### Trigger an event from k3s

An additional source we can add is the events from the Kubernetes audit log. This feature has to be turned on via the k3s systemd definition.

Create a folder for audit events:

```bash
sudo mkdir -p /var/lib/rancher/audit
```

Download `audit-policy.yaml` to `/var/lib/rancher/audit`

```
wget https://raw.githubusercontent.com/falcosecurity/evolution/master/examples/k8s_audit_config/audit-policy.yaml
sudo cp audit-policy.yaml /var/lib/rancher/audit/
```

Create a webhook config file:

```bash
export IP=192.168.0.23

cat << EOF | sudo tee /var/lib/rancher/audit/webhook-config.yaml
apiVersion: v1
kind: Config
clusters:
- name: falco
  cluster:
    server: http://$IP:8765/k8s-audit
contexts:
- context:
    cluster: falco
    user: ""
  name: default-context
current-context: default-context
preferences: {}
users: []
EOF
```

Edit `/etc/systemd/system/k3s.service` and add these lines to the end:

```ini
        '--kube-apiserver-arg=audit-log-path=/var/lib/rancher/audit/audit.log' \
        '--kube-apiserver-arg=audit-policy-file=/var/lib/rancher/audit/audit-policy.yaml' \
        '--kube-apiserver-arg=audit-webhook-config-file=/var/lib/rancher/audit/webhook-config.yaml' \
```

Now reload:

```bash
sudo systemctl daemon-reload && \
 sudo systemctl restart k3s
```

My favourite use-case from the docs was detecting AWS secret keys stored in ConfigMaps. Of course, we all know confidential data belongs inside Vault or Kubernetes Secrets which can be encrypted at rest.

Let's try it out?

Run this from your laptop:

```yaml
kubectl create configmap aws-creds \
  --from-literal aws_access_key_id=AKES20LNOA
```

Now check the logs from Falco:

```bash
sudo journalctl -u falco --lines 100

Oct 13 16:55:42 ubuntu falco[89818]: 16:55:24.207932928: Warning K8s configmap with private credential (user=system:admin verb=create configmap=aws-creds-1 config={"aws_access_key_id":"AKES20LNOA"})
```

You can find this example under ["Kubernetes Audit Rules" in the Falco docs](https://falco.org/docs/event-sources/kubernetes-audit/).

### Expand the k3s cluster

You can add additional nodes into the k3s cluster by installing Ubuntu as we did for the first node, then running the `k3sup join` command.

```bash
k3sup join --ip $IP -user ubuntu \
  --server-ip 192.168.0.101
```

k3s also supports High-Availability and fail-over of the master nodes using a SQL backend or an embedded version of etcd.

## Wrapping-up

> Full disclosure: Sysdig is a client of [OpenFaaS Ltd](https://www.openfaas.com/consulting/)

We now have Ubuntu 20.04.01, Kubernetes with k3s and Falco all built for 64-bit ARM running on our Raspberry Pi.

It's now over to you to [explore Falco more](https://falco.org), and to fine-tune your Kubernetes rules.

I also want to give a shout out to my friend [fntlnz](https://twitter.com/fntlnz) who is the Falco maintainer that helped me get a working build of Falco on 64-bit ARM. It took us several days to get here.

### Recommendations

It took me quite a while to figure out how to get this to work, but it was nice when everything clicked into place. So be warned, the Falco documentation still refers to "Dynamic Auditing" which was removed and deprecated in Kubernetes and the upstream instructions don't cover k3s yet, or any release newer than 1.13.

I hope to see the team at Sysdig spend some time updating the documentation and examples for newer Kubernetes releases and for an official 64-bit ARM binary to be made available soon.

### Taking it further 

The easier way to get security and other insights, just like the open source Falco project is to use Sysdig's paid product. You can find a step-by-step tutorial by Dan here: [K3s + Sysdig: Deploying and securing your cluster… in less than 8 minutes!](https://sysdig.com/blog/k3s-sysdig-falco/)

You may also like my walk-through video: [Installing Ubuntu and k3s to my Raspberry Pi 4](https://www.youtube.com/watch?v=vzZa-8oXF88&feature=youtu.be)

<iframe width="560" height="315" src="https://www.youtube.com/embed/vzZa-8oXF88" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Find out more about the tools:

* [k3sup](https://k3sup.dev/)
* [OpenFaaS](https://www.openfaas.com/)
* [Falco](https://github.com/falcosecurity/falco)