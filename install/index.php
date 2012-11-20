<?php
/**
 * Generate the configuration file
 */
set_error_handler("errorHandler");

function errorHandler($code, $message) {
  //do nothing
}

if (isset($_POST["Submit"])) {

$string = '<?php
/*** Mineload Minecraft connection Configuration settings ***/
$_mc_host = "' . $_POST["mc_host"] . '";
$_mc_port = ' . $_POST["mc_port"] . ';

/*** MySQL Database for logging mineload statistics. ***/
$_dbhost = "' . $_POST["dbhost"] . '";
$_dbuname = "' . $_POST["dbuname"] . '";
$_dbpass = "' . $_POST["dbpass"] . '";
$_dbname = "' . $_POST["dbname"] . '";

/*** MineloadPlugin connection ***/
//Mineload Adddress - usually the same as Minecraft address
$_mlp_host = "' . $_POST["mlp_host"] . '";
//Port MineloadPlugin is listening on (Default 2500)
$_mlp_port = ' . $_POST["mlp_port"] . ';
//MineloadPlugin Password Default is changemenow539!
$_mlp_password = "' . $_POST["mlp_password"] . '";

/*** Mineload System php settings Linux only ***/
$_mls_interface = "' . $_POST["mls_interface"] . '";
$_mls_logfile = "' . $_POST["mls_logfile"] . '";
  
/*** Mineload Web Interface Login credentials & Settings ***/
$_mlw_username = "' . $_POST["mlw_username"] . '";
$_mlw_password = "' . $_POST["mlw_password"] . '";
$_mlw_updates = ' . ($_POST['mlw_updates'] == 'on' ? 1 : 0) . ';

/*** JSONAPI Connection Settings ***/
$_jsonapi_host = "' . $_POST["jsonapi_host"] . '";
$_jsonapi_port = "' . $_POST["jsonapi_port"] . '";
$_jsonapi_username = "' . $_POST["jsonapi_username"] . '";
$_jsonapi_password = "' . $_POST["jsonapi_password"] . '";
$_jsonapi_salt = "' . $_POST["jsonapi_salt"] . '";
?>
';

  $fp = fopen("../config/config.php", "w");
  if ($fp == null) {
    echo '
      <!doctype html>
<html>
  <head>
    <title>Mineload Installation</title>
    <link rel="stylesheet" href="installer.css" media="screen">
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js"></script>
    <script src="js/installer.js" type="text/javascript"></script>
  </head>
  <body>
    <div id="content">
      ';
    echo "<h2>Can't save config file</h2>";
    echo "<ul class='states'><li class='error'>Your config folder is not writable</li></ul>";
    echo "<ul class='states'><li class='warning'>Please save this generated configuration code to config/config.php.
            Alternatively you can make it writable and try again.
            <a href='../'>Okay done that...</a></li><ul>";
    echo "<pre>" . htmlentities($string) . "</pre>";
    exit();
  }
  fwrite($fp, $string);
  fclose($fp);
  header('Location: success.php');
  exit();
}
?>

<!doctype html>
<html>
  <head>
    <title>Mineload Installation</title>
    <link rel="stylesheet" href="installer.css" media="screen">
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js"></script>
    <script src="js/installer.js" type="text/javascript"></script>
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
          <input name="mc_host" type="text" class="input" id="mc_host">
          Minecraft server IP
        </p>

        <p>
          <input name="mc_port" type="text" value="25565" class="input" id="mc_port">
          Minecraft port: (Default is 25565)

        </p>
        <ul class="states">
          <li id="mc_status"></li>
        </ul>

        <h2>Database Settings</h2>
        <p>
          MySQL is used to log history of your minecraft server to draw pretty graphs of the past.
          It is not required or implemented yet. 
        </p>
        <p>
          <input name="dbhost" type="text" value="localhost" class="input" id="dbhost" value="localhost"> 
          DB Host usually localhost.
        </p>
        <p>
          <input name="dbuname" type="text" class="input" id="dbuname"> 
          DB Username
        </p>
        <p>
          <input name="dbpass" type="password" class="input" id="dbpass">
          DB Pass 
        </p>
        <p>
          <input name="dbname" type="text" class="input" id="dbname">
          DB Name 
        </p>

        <h2>MineloadPlugin Settings</h2>
        <p>
          Settings related to the Bukkit plugin. By now you should have installed MineloadPlugin.jar
          into your bukkit plugins/ folder. Configuration is contained in plugins/MineloadPlugin/config.yml.
          Please take the time to edit that first.
        </p>

        <p>
          <input name="mlp_host" type="text" class="input" id="mlp_host">
          MineloadPlugin Host IP eg. mc.forgottendynasties.net
        </p>

        <p>
          <input name="mlp_port" type="text" class="input" value="25500" id="mlp_port">
          MineloadPlugin Port: 25500 default is fine.
        </p>

        <p>
          <input name="mlp_password" type="text" class="input" value="" id="mlp_password">
          MineloadPlugin Password: (Default: changemenow539)

        </p>
        <ul class="states">
          <li id="mlp_status"></li>
        </ul>

        <h2>Linux Specific Settings - To be Deprecated!</h2>
        <p>
          This section specifies special linux functions. It uses the old php script. It
          will only work well for systems that host the website on the minecraft server.
          <strong>This will be be deprecated soon and will be replaced into the plugin hopefully.</strong>
        </p>
        <h3>Network Interface</h3>
        <p>
          Your network interface on a dedicated machine is usually 'eth0'. Virtual machines
          are usually 'venet0'
        </p>
        <p>
          <input name="mls_interface" type="text" class="input" value="eth0" id="mls_interface">
          Network Interface: (Default: eth0)
        </p>
        <p>
          Full path to log file. If your craftbukkit.jar is operating in /home/mc/, Your path will
          be /home/mc/server.log
        </p>

        <p>
          <input name="mls_logfile" type="text" class="input" value="/home/mc/server.log" id="mls_logfile">
          Log Path: (Default: /home/mc/server.log)
        </p>
        <h2>JSONAPI Connection Settings</h2>
        <p>
          You must have the JSONAPI.jar plugin installed. This plugin provides a secure
          way to send and receive various commands, functions, data etc. It is now
          <strong>required! </strong><a href="http://dev.bukkit.org/server-mods/jsonapi/" target="_blank">JSONAPI BukkitDev Page</a>
        </p>
        <p>
          <input name="jsonapi_host" type="text" class="input" value="" id="jsonapi_host">
          JSONAPI address (Same as Minecraft server IP 99% of the time)
        </p>
        <p>
          <input name="jsonapi_port" type="text" class="input" value="20059" id="jsonapi_port">
          JSONAPI port (Default is: 20059)
        </p>
        <p>
          <input name="jsonapi_username" type="text" class="input" id="jsonapi_username">
          JSONAPI Username
        </p>
        <p>
          <input name="jsonapi_password" type="password" class="input" id="jsonapi_password">
          JSONAPI password
        </p>
        <p>
          <input name="jsonapi_salt" type="text" class="input" id="jsonapi_salt">
          JSONAPI salt
        </p>
        <h2>Mineload Web Interface Settings</h2>
        <p>
          Be sure to remember your super administrator login details. Keeping the check
          for updates option set is highly recommended to keep you informed of critical updates.
        </p>
        <p>
          <input name="mlw_username" type="text" class="input" value="admin" id="mlw_username">
          Web Interface User: (Default: admin)
        </p>
        <p>
          <input name="mlw_password" type="password" class="input" id="mlw_password">
          Web Interface Password
        </p>
        <p>
          <input name="mlw_updates" type="checkbox" checked="checked" id="mlw_updates">
          Check for updates (Highly Recommended for security fixes and general awesomeness)
        <p>
          <input type="submit" name="Submit" value="Install">
        </p>
      </form>
    </div>
  </body>
</html>
