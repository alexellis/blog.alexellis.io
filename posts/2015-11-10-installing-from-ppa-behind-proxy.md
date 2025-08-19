---
title: "Installing from PPAs behind a proxy"
slug: "installing-from-ppa-behind-proxy"
date: "2015-11-10T16:47:54Z"
author: "Alex Ellis"
meta_title: "Installing from PPAs behind a proxy"
meta_description: "You're trying to do your job but the corporate proxy is blocking that important key-server? Read on for a great workaround for installing PPAs now. "
tags:
  - "networking"
  - "ubuntu"
  - "debian"
  - "linux"
  - "proxy"
  - "ppa"
---

**Scenario:**
You are building a Dockerfile or trying to run apt-get at work, but the network policy is blocking both direct access to the keyserver and through a correctly-configured proxy.

Let's say we're trying to install mono, which has the following instruction - but it hangs inexplicably.

```
sudo apt-key adv --keyserver \
hkp://keyserver.ubuntu.com:80 \
--recv-keys 3FA7E0328081BFF6A14DA29AA6A19B38D3D831EF

```

Take note of the key specified in `--recv-keys`, this is the part we need to copy/paste into the next steps.

**The work-around (tl;dr)**:

* Step 1: Log into a computer in the free world (VPN/tunnel/mobile-hotspot/open WiFi network etc).

* Step 2: Export the key to a text file.

* Step 3: Copy the contents of the file across to the machine, and import it.

**Step 1:**

```
$ export keyid=3FA7E0328081BFF6A14DA29AA6A19B38D3D831EF
$ gpg --keyserver keyserver.ubuntu.com --recv $keyid && gpg --export --armor $keyid > key.txt

gpg: requesting key D3D831EF from hkp server keyserver.ubuntu.com
gpg: key D3D831EF: "Xamarin Public Jenkins (auto-signing) <releng@xamarin.com>" not changed
gpg: Total number processed: 1
gpg:              unchanged: 1

```
Alter the value of keyid as per your needs

**Step 2**

The file key.txt can now be copied across to your locked-down machine by email, copy/paste, etc into a file named key.txt.

**Step 3**

```
cat key_file | sudo apt-key add -
```

If you are doing this inside a Dockerfile, then you could use the `ADD` command to put the key in /tmp/.

Now continue with the rest of the instructions and the apt-repository will now be accepted by the system.