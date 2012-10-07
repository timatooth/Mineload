<?php
/**
 * Generate the configuration file
 */
if (isset($_POST["Submit"])) {

  $string = '<?php 
/* Mineload Configuration settings */
$_mc_host = "' . $_POST["mc_host"] . '";
$_mc_port = "' . $_POST["mc_port"] . '";
//Database for logging mineload statistics.
$dbhost = "' . $_POST["dbhost"] . '";
$dbuname = "' . $_POST["dbuname"] . '";
$dbpass = "' . $_POST["dbpass"] . '";
$dbname = "' . $_POST["dbname"] . '";

/*MineloadPlugin connection */
//Minecraft server IP
$_mlp_host = "' . $_POST["mlp_host"] . '";
//Port MineloadPlugin is listening on (Default 2500)
$_mlp_port = "' . $_POST["mlp_port"] . '";
//MineloadPlugin Password Default is changeme123noSeriouslyChangeMe!
$_mlp_password = "changeme123noSeriouslyChangeMe!";

/*Mineload System php settings Linux only */
$_mls_interface = "' . $_POST["mls_interface"] . '";
$_mls_logfile = "' . $_POST["mls_logfile"] . '";
?>';

  $fp = fopen("configuration.php", "w");
  if ($fp == null) {
    die("cant open file for writing");
  }
  fwrite($fp, $string);
  fclose($fp);
}
?>
<!doctype html>
<html>
  <head>
    <title>Mineload Installation</title>
    <link rel="stylesheet" href="installer.css" media="screen">
  </head>
  <body>
    <div id="content">
      <h1>Mineload Installation</h1>
      <p>
        Thank you for being interested in Mineload! This 'installer' will setup your Mineload
        web interface.
      </p>
      <form action="" method="post" name="install" id="install">
        <h2>Global Settings</h2>
        <p>
          <input name="mc_host" type="text" id="mc_host">
          Minecraft server IP
        </p>

        <p>
          <input name="mc_port" type="text" value="25565" id="mc_port">
          Minecraft port: (Default is 25565)
        </p>
        <h2>Database Settings</h2>
        <p>
          MySQL is used to log history of your minecraft server to draw pretty graphs of the past.
          It is not required or implemented yet. 
        </p>
        <p>
          <input name="dbhost" type="text" value="localhost" id="dbhost" value=""> 
          DB Host usually localhost.
        </p>
        <p>
          <input name="dbuname" type="text" id="dbuname"> 
          DB Username
        </p>
        <p>
          <input name="dbpass" type="password" id="dbpass">
          DB Pass 
        </p>
        <p>
          <input name="dbname" type="text" id="dbname">
          DB Name 
        </p>

        <h2>MineloadPlugin Settings</h2>
        <p>
          Settings related to the Bukkit plugin. By now you should have installed MineloadPlugin.jar
          into your bukkit plugins/ folder. Configuration is contained in plugins/MineloadPlugin/config.yml.
          Please take the time to edit that first.
        </p>

        <p>
          <input name="mlp_host" type="text" id="mlp_host">
          MineloadPlugin Host IP eg. mc.forgottendynasties.net
        </p>

        <p>
          <input name="mlp_port" type="text" value="25500" id="mlp_port">
          MineloadPlugin Port: 25500 default is fine.
        </p>

        <p>
          <input name="mlp_password" type="text" value="changeme123noSeriouslyChangeMe!" id="mlp_password">
          MineloadPlugin Password: (Default: changeme123noSeriouslyChangeMe!)
        </p>

        <h2>Linux Specific Settings</h2>
        <p>
          This section specifies special linux functions. It uses the old php script. It
          will only work well for systems that host the website on the minecraft server.
          <strong>This will be be deprecated soon and will be replaced into the plugin hopefully.</strong>
        </p>
        <h3>Network Interface</h3>
        <p>
          Your network interface on a dedicated machine is usually 'eth0'. Virtual machines
          are usually 'venet0'</p>
        </p>
        <p>
          <input name="mls_interface" type="text" value="eth0" id="mls_interface">
          Network Interface: (Default: eth0)
        </p>
        <p>
          Full path to log file. If your craftbukkit.jar is operating in /home/mc/, Your path will
          be /home/mc/server.log
        </p>

        <p>
          <input name="mls_logfile" type="text" value="/home/mc/server.log" id="mls_logfile">
          Log Path: (Default: /home/mc/server.log)
        </p>
        <p>
          <input type="submit" name="Submit" value="Install">
        </p>
      </form>
    </div>
  </body>
</html>