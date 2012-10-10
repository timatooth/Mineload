# Mineload
## Monitor your Bukkit server status on anything!

Thank you for being interested in Mineload!

Mineload is a system to track the status of a bukkit server.
It generates XML which can be read by any computer or device.

The files contained here need to be uploaded to a PHP enabled
webserver.

Functions your server will need:
* MySQL - for logging data. **Not Implemented Yet**
* fopen(), fwrite(), socket() - many shared hosting companies disable these functions making php code useless. Bastards.
* Bukkit server with MineloadPlugin installed.
* Port 25500 forwarded if your server is behind a firewall.

To install simply upload this folder to your webserver and navigate to
www.your-awesome-minecraft-server.tld/mineload/install

This will begin the web installer. **Which isn't finished yet**

Please ensure the mineload/config folder is writable eg ```chmod 777 config```
but then change it back to something reasonable afterwards eg ```chmod 644 config```

**DELETE the install folder after it has completed for security reasons.**

It would be awesome if you checked out the source code, send bugs/issues 
or pull requests to my GitHub account: github.com/timatooth/Mineload

*Timatooth*