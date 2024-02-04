---
title: 'How you can create a virtual serial port and null modem emulator in Linux'
date: '2024-02-01'
desc: 'A detail guide to create and use a virtual serial port/ RS232 port in Linux using socat and tty0tty'
keywords: ['serial port', 'virtual serial port in linux', 'rs232', 'socat', 'tty0tty', 'null modem', 'null modem emulator in linux', 'how to install tty0tty', 'uart', 'virtual uart port in linux']
author: 'Kapil Pokhrel'
author_links: { 'twitter': 'https://x.com/k_10p', 'github': 'https://www.github.com/kapilpokhrel' }
---


When you are doing anything involving serial ports, its good to have a virtual serial port without connecting any device so you can do your tests and develop your porgram. Now, imagine having two interconnected virtual serial ports, then you can send and receive a message on those ports and simulate your complete physical connection virtually on your device. That interconnected serial port is called `null modem`. You can create a null modem in your linux system using Socat and tty0tty kernal module. In this article I am going to discuss how exactly you can do that using these tools.

## Socat

### Introduction
In Linux, we can use [Socat](http://www.dest-unreach.org/socat/) to create a simple virtual serial port. In reality, Socat is much more than just a tool to create a virtual serial port. Socat is a Linux utility which relays data between two channels. Those channels can be anything from flies, piles, sockets, device, programs, pseudo-terminal etc.
In our case, we are interested in pseudo-terminal. Pseudo-terminal are also called pty. They are just a virtual serial terminal devices (tty). So, if we create a two ptys and connect them with each other, we get the simple serial connection. And, Socat can do just that. When we specify a pty as a channel for a socat, it creates two pseudo-terminal and connect them.

### How to Use it?
You can install Socat using your default package manager like pacman, apt, yum etc if not already installed and launch it in a command line to get two interconnected ptys as shown below.
```
socat -dd pty,raw,echo=0 pty,raw,echo=0
```
Here `-dd` is the option for socat to enable the level 2 verbosity and two `pty,raw,echo=0` are the channels with thier characteristics. `pty` tells that the channel is a pseudo-terminal, `raw` sets the PTY to raw mode, disabling any special character handline to ensures that all input/output is passed through without interpretation and `echo=0` will disable the echoing of the charcter send by the pty back to the same pty. Of course, there are much more options available which you can look for yourself if needed.

And you will get this something like this in output:

```
2024/01/14 21:07:43 socat[5296] N PTY is /dev/pts/2
2024/01/14 21:07:43 socat[5296] N PTY is /dev/pts/3
2024/01/14 21:07:43 socat[5296] N starting data transfer loop with FDs [5,5] and [7,7]
```
Above output gives the addresses of two newly created pty. In our case, they are `/dev/pts/2` and `/dev/pts/3`. Now you can open these ports like you would do normally with any other serial port and communicate between them. I am using [CoolTerm](https://freeware.the-meiers.org/) to easily show connection and flow control in this blog. You can use [minicom](https://linux.die.net/man/1/minicom) and even use `cat` and `echo` in to send and receive the data from the ptys.

<CustomImage src='pty_rxtx.png' alt='Image to show the connection between two opened ptys' w='1356' h='710' />
As you can see from the above picture that when we write something in `/dev/pts/2`, its `tx` line goes high and another port's `rx` line goes high and we see the character in another port's terminal. Now you have a simple `tx <-> rx` connected null modem.

One common thing you would wanna do is to always have a same name (address) for your pty. To do this you can pass the `link=<path>` option which will create a symlink for the pty at that location. For example, running the following command will create `/tmp/ptyVIRT1` and `/tmp/ptyVIRT2` and you can use them as you did with `/dev/pts/2` and `/dev/pts/3`.
```
socat -dd pty,raw,echo=0,link=/tmp/ptyVIRT1 pty,raw,echo=0,/tmp/ptyVIRT2
```
### Limitations

- Some porgrams may not recognize these pts as a real serial ports and refuse to work. In CoolTerm too, I got a warning like this when trying to connect to the pty.
<CustomImage src='pty_invalid.png' w='594' h='165' />
- We don't get a hardware flowcontrol capability (cts,rts and dtr,dsr line) when using a pty as a serial port as you can see in the greyed out led at the bottom of the first image.

## tty0tty module

### Introduction

If using a simple pty is not adequate for your needs, you can use a [tty0tty](https://github.com/lcgamboa/tty0tty/) kernal module. tty0tty is a null model emulator for linux. It programatically create a linux serial device which would behave exactly like any other serial device connected to a physical port. tty0tty create 8 such device where each pair are interconnected like
```
/dev/tnt0 <-> /dev/tnt1
/dev/tnt2 <-> /dev/tnt3
/dev/tnt4 <-> /dev/tnt5
/dev/tnt6 <-> /dev/tnt7
```

Unlike a simple pty, this emulates a full RS-232 connection between each pair in a given manner
```
TX   ->  RX
RX   <-  TX
RTS  ->  CTS
CTS  <-  RTS
DSR  <-  DTR
CD   <-  DTR
DTR  ->  DSR
DTR  ->  CD
```

### How to use it?
Installing process is explained in details in [tty0tty github repo](https://github.com/lcgamboa/tty0tty/) but still I will include a commands to make and install the kernal module here for your ease.
```
git clone https://github.com/lcgamboa/tty0tty.git
cd module
make
sudo make install
```

**Note:**
1. You have to have linux headers installed for your kernal which should already be installed.
2. Be sure to checkout github issues and discussion if you face any error while installing as this is depended on kernal and sometime some tiny things might have changed in your updated kernal which you will often find soulution of in the github issues.

Now when you look into your `/dev` directory, you will see 8 devices from `/dev/tnt0` to `/dev/tnt7` and you can use them like any other serial device with full RS-232 connection. To get full access to these prots from your normal user, you have to add your user to a `dialout` group. You can use a following command to do that.
```
sudo usermod -a -G dialout ${USER}
```

Here's a example to see how you can easily make use of hardware flow control when using tty0tty devices as shown by the red `tx` line and low `cts` in `tnt1` when `rts` is pulled low in `tnt0` and everything green when `rts` is high.

| rts on | rts off |
|--------| ------- |
| <CustomImage src="tnt_rtson.png" w='1040' h='245' /> |  <CustomImage src="tnt_rtsoff.png" w='1040' h='245' /> |




