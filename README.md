# Mineload
## The Mineload browser web interface.

The files contained here need to be uploaded to a PHP enabled
web server preferably one you own now a free shared host.

## You will need:
* Bukkit server with MineloadPlugin installed. It appears others have it working on Spigot, Tekkit etc too.
* Your web server needs to make outgoing connections to your Minecraft server
  on port 25500 and 25565. Check that its firewall allows this. You'll have a hard
  time with this on a free hosting provider.
* Port 25500 forwarded if your Bukkit server is behind a firewall.
* Ensure JSONAPI is installed on your server with it's ports forwarded too.

## Installation Instructions

1. To install simply upload contents to your web server
2. Please ensure the mineload/config folder is writable eg ```chmod 777 config``` but then change it back to something reasonable afterwards eg ```chmod 644 config```
3. Navigate to www.your-awesome-minecraft-server.net/mineload/install
4. This will begin the web installer.
5. **DELETE the install folder after it has completed for security reasons.**

It would be awesome if you checked out the source code, send bugs/issues 
or pull requests to my GitHub account: http://github.com/timatooth/Mineload

You can find more stuff I have made at my new web site http://timatooth.com

*Timatooth*