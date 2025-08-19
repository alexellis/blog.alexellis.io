---
title: "Secure surfing on public networks"
slug: "secure-surfing-on-public-networks"
date: "2015-12-05T20:48:41Z"
author: "Alex Ellis"
meta_title: "Secure surfing on public networks and wifi"
meta_description: "The Internet itself is not a safe network. We are under constant threat from malware and would-be hackers - protect your private surfing now."
---

As far as networks go, the _Internet_ itself is definitely not a safe one. We are under constant threat from malware and would-be hackers, they are already sniffing your computer for known vulnerabilities and open ports. Sometimes we need to go further than just installing a firewall and anti-virus software which protect against content coming into the computer, but what about out-going traffic?
Next time you are in a hotel, cafe or airport and connect your laptop to a public network take a moment to think that anyone could be eavesdropping on your web-browsing. Where could that lead?

> ..that anyone could be eavesdropping on your web-browsing.

### Is there data at the end of the tunnel?
The primary problem with connecting to an open network is the amount of unknowns and this makes our traffic vulnerable. One mitigation is to create a tunnel from that network into another network which has a lower perceived threat level. I.e. from that busy airport to your home network.

There are several ways to achieve this including creating your own VPN (Virtual Private Network), but I am opting for a quick and easy option: set up a Linux machine on your internal home network - or on a cloud service such as Azure or Amazon Web Services. A Raspberry PI is very cheap to buy and to run 24/7 so would be ideal. AWS also offer a year's Linux cloud hosting for free.

There are serval steps to go through on both your laptop and your server. Depending on the GNU/Linux distribution theses will vary and very good user guides are available.

- Enable SSH server/daemon
- Install a proxy server service such as the well-known 'Squid'
- Create a local port on our machine that maps to the remote network
- Configure the browser on our machine to point to the forwarded port.
- If the server is on your home network then set up port forwarding for the single port exposed by squid to the internal IP address of your machine. (`ifconfig`)

Steps follow.

#### Configuring an Ubuntu Linux server

```
$ sudo apt-get update && sudo apt-get install -qy squid

$ sudo systemctl enable squid
$ sudo systemctl start squid
```

#### Configuring an Arch Linux server

```
$ sudo pacman -Syu squid

$ sudo systemctl enable squid

$ sudo systemctl start squid
```

Once you've installed Squid you will need to make sure that you do not expose that port on the public internet. If you're using a cloud provider then setup the appropriate security in the control panel.

#### On the client

```
ssh -p 22 myremoteipaddress.com -N -L 3128:127.0.0.1:3128
```

`-p 22` this means connect to myremoteipaddress.com, on port 22 if you have changed the port then alter this value to match.

`-N` means that we do not want to have a prompt to accept commands, just the tunnel.

`-L` means create a local port at port 3128 pointing to 127.0.0.1 port 3128 on the remote side. You can change the port on the local side if you wish.

##### Configure the browser
Open up your favourite browser and find the settings or preferences dialog. You will be looking for *network*, *connection* or *advanced* settings. 

Enter the details for HTTP and HTTPS proxy as: `127.0.0.1` for the host/server and `3128` for the port.

Here is a quick test to make sure the proxy is working properly.

Open Google and search for 'proxy finder' this will bring up a number of sites that can indicate whether your request came via your proxy server. They do this by inspecting the headers Squid adds to all outgoing requests by default. Normally you will see an entry under `HTTP_X_FORWARDED_FOR` i.e.
````
HTTP_X_FORWARDED_FOR: 210.0.10.157
```
If you run through this both before and after you connect to the proxy - then you can make sure the IP is different. The IP address mentioned will correspond to the public IP of your Squid proxy server rather than the network you are directly connected to. 

#### Bonus points

There are bonus points available for running the proxy server in _docker_ as a virtualized service. You can check out some publicly available images for this purpose.

Now if you do not have a static IP address (which is highly likely) then it may be helpful to look into `ddclient` which helps you keep a dynamic DNS entry up to date with whatever IP address your ISP has assigned to you.

It is also highly recommended to configure your SSH service/daemon to run on a non-obvious port. I have found that as soon as a public IP address exposes port 22 - people all over the internet will start attempting to guess the password with brute force. The port is generally configured in `/etc/ssh/sshd_config` near the top of the file.

#### Wrapping up

I said 'Secure surfing' but in fact this model has only redirected our traffic to help protect against eavesdropping. Also note that this does not provide any level of anonymity - to most websites it will appear as if you are at home or at the location of the remote network. 

Let me know what you think in the comments.