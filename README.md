## The Mineload browser web interface.

* Therapeutically watch live updating gauges for server vital signs, slots free, network usage, tick rate, memory used etc.
* See/Stalk online players in a table and perform kick/ban operations.
* Edit plugin config YAML files in a visual text editor. No more laggy SSH connections or tedious config change uploads to your server.
* Browse player inventories and perform what I call "Reverse CNS" [Reverse Chest Name System] :D if you have LWC to see the contents and locations of their stuff. Creepy right?
* Real time server console. You need using the new WebSockets API should work on new versions of Firefox | Chrome | Safari | and... wait for it... IE10 [touch wood]
* Browse your installed plugins in a handy table with version information. Very useful to see if you're a version behind in something installed.

The files contained here need to be uploaded to a PHP enabled
web server preferably one you own **not** a free shared host due to possible restrictions.

## You will need:
* Bukkit server with MineloadPlugin & JSONAPI plugin installed.
* PHP enabled web server.
* Your web server needs to make OUTGOING connections to your Minecraft server on port 25500(MineloadPlugin default).
* The browser makes connections to JSONAPI on port 20059 for calling methods. And port 2061 for WebSocket (for the console to work).
* Therefore ports 25500, 20059, 20061 need to be forwarded if you're behind a NAT/firewall. So they are accessible from a public IP.

## Installation Instructions

1. To install simply upload contents to your web server
2. Please ensure the mineload/config folder is writable eg ```chmod 777 config``` but then change it back to something reasonable afterwards eg ```chmod 644 config```
3. Navigate to www.your-awesome-minecraft-server.net/mineload/install
4. This will begin the web installer. It should check connections as you enter them.
5. **DELETE the install folder after it has completed for security reasons.**

It would be awesome if you checked out the source code, send bugs/issues 
or pull requests to my GitHub account: http://github.com/timatooth/Mineload

You can find more stuff I have made at my new web site http://timatooth.com

*Timatooth*