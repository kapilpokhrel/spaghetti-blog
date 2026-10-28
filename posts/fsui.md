---
title: 'FSUI: File System as a UI'
date: '2026-10-28'
desc: 'Can a filesystem be used as a UI?'
keywords: ['filesystem', 'FUSE', 'keepass', 'fsui']
author: 'Kapil Pokhrel'
author_links: { 'twitter': 'https://x.com/k_10p', 'github': 'https://www.github.com/kapilpokhrel' }
---

This article is a short one about the idea I once had when I wanted to copy passwords to clipboard from my password manager
like i copy any files with `cat file | wl-copy`. This gave birth to [kdfs](https://github.com/kapilpokhrel/kdfs).
`kdfs` mounts a keepass password database as a file system entry and then you can
browse your accounts like directories in the file system.

Example
```
passfs
├── General
│   └── Gmail
│       ├── notes
│       ├── password
│       ├── url
│       └── username
├── Bank
....
```

Now if you need to copy password from Gamil, you just do
```
cat passfs/General/Gamil/password | wl-copy
```

You want to change the username?
```
echo -n "alice" > Gamil/username
```

Of course there are other protection mechanism like auto lock, master passwords
involved since this in a password manager but that's the whole idea behind the use of kdfs.

You can say that for this specific example, `keepass-cli` is much more intuitive
to use than this. I agree. But my main idea was to be able to browse and use the application through our 
friendly shell commands.


**Wait, but there are buttons that we click, commands we give, how do we see them? how do we use them?**

Yeah,lets address the elephent in the room. Application aren't just the source of data, we interact with it.
Taking this example of `kdfs`, a password manager. We can't just let it sit around in
a filesystem all the time unlocked and accessible.
*How do we interact?* Just write your command to a simple file. Files are your buttons.
And files are where you see the state of your application.

In kdfs, it starts locked (and gets locked after few minutes) by default, you have to explicitely give it a command to unlock it. I achieved this with two files
- **lockaction**
- **lockstate**

on the root of mounted directory

- lockstate is a read only file that reports the current protection state of underlying database
    - `t` -> locked
    - `f` -> unlocked
- lockaction is a write only file that changed the used to lock/unlock a database.
    - `echo -n "lock" >> lockaction` locks the database
    - `echo -n "<password>" >> lockaction` unlockes the locked database

in other words, `lockstate` is your visual of the button and `lockaction` is your button. It is actually a many buttons in one.

beside this,
- create new directory to create a new entry and password heirarchy
- edit file to edit your saved notes and passwords ...

---

This idea is nothing new, we have `sysfs` where we can do something like
```
echo 1 > /sys/class/gpio/gpio17/value
```
to write a value to a gpio pin.

You get your system metric from `/proc`.

It has worked and it is a valid working user interface.

My experiment with keepass password database may not have been an example that spark the feeling of `wow it makes so much sense`.
But there are projects as you have seen that actually make sense.
- [sysfs](https://en.wikipedia.org/wiki/Sysfs)
- [btfs](https://github.com/johang/btfs)
- [procfs](https://en.wikipedia.org/wiki/Procfs)
- and many more.

Yesh, that's it, that's all I wanted to say. Sometimes, an application doesn't need a face of its own.
