<?php
error_reporting(E_ALL);
include 'User.php';
session_start();
$errors = Array();
if (isset($_SESSION['user'])) {
  $username = $_SESSION['user']->getUsername();
  if (is_dir("install")) {
    $errors[] = "Please delete or rename the <strong>install</strong> folder for security purposes. Then refresh.";
  }
} else {
  //not logged in. redirect them to login page, halt script execution.
  header("Location: index.php");
  exit();
}
?>
<!DOCTYPE html>
<head>
  <meta charset="utf-8">
  <title>Mineload - AdminPanel</title>
  <link media="all" rel="stylesheet" type="text/css" href="css/all.css" />
  <link media="all" rel="stylesheet" type="text/css" href="css/dashboard.css" />
  <link media="all" rel="stylesheet" type="text/css" href="css/inventory.css" />
  <!--[if lt IE 9]><link rel="stylesheet" type="text/css" href="css/ie.css" /><![endif]-->
</head>

<body>
  <script type="text/javascript" src="js/jquery-1.8.2.min.js"></script>
  <!-- main admin page layout and buttons stuff -->
  <script type="text/javascript" src="js/admin.main.js"></script>
  <script type="text/javascript" src="js/jsonapi.js"></script>
  <!--Options for chart scale, colours, animation here-->
  <script type="text/javascript" src="js/chartoptions.js"></script>
  <script type='text/javascript' src='https://www.google.com/jsapi'></script>
  <!-- gets the mineloadplugin xml data -->
  <script type="text/javascript" src="js/Xmlget.js"></script>
  <script type='text/javascript' src="js/chartloader.js"></script>

  <!-- DataTables CSS -->
  <link rel="stylesheet" type="text/css" href="http://ajax.aspnetcdn.com/ajax/jquery.dataTables/1.9.4/css/jquery.dataTables.css">
  <!-- DataTables -->
  <script type="text/javascript" charset="utf8" src="http://ajax.aspnetcdn.com/ajax/jquery.dataTables/1.9.4/jquery.dataTables.min.js"></script>
  <script type="text/javascript" charset="utf8" src="js/playerlist.js"></script>
  <script type="text/javascript" charset="utf8" src="js/plugintable.js"></script>
  <script type="text/javascript" charset="utf8" src="js/worldmanager.js"></script>
  <script type="text/javascript" charset="utf8" src="js/updatefeed.js"></script>
  <script type="text/javascript" charset="utf8" src="js/alert.js"></script>
  <script type="text/javascript" charset="utf8" src="js/inventory.js"></script>
  
  <div id="wrapper">
    <div id="content">
      <div class="c1">
        <div class="controls">
          <nav class="links">
            <ul>
              <li><a href="editor.php" target="_blank" class="ico3">Plugin Configuration Editor <!--<span class="num"></span>--></a></li>
            </ul>
          </nav>
          <div class="profile-box">
            <span class="profile">
              <a href="#" class="section">
                <img class="image" src="images/img1.png" alt="image description" width="26" height="26" />
                <span class="text-box">
                  Welcome
                  <strong class="name"><?php echo $username ?></strong>
                </span>
              </a>
              <a href="#" class="opener">opener</a>
            </span>
            <a href="logout.php" class="btn-on">On</a>
          </div>
        </div>
        <div class="tabs">
          <div id="tab-1" class="tab">
            <article>
              <div class="text-section">
                <h1>Dashboard</h1>
                <p>Server vitals and statistics overview updated live</p>
              </div>
              <ul class="states">
                <?php
                if (sizeof($errors) > 0) {
                  foreach ($errors as $error) {
                    echo "<li class='error'>$error</li>";
                  }
                }
                ?>
                <li id="errors" class="error"></li>
              </ul>
              <div id="chart_div">
                <div class="chart" id="slots_chart"></div>
                <div class="chart" id="tps_chart"></div>
                <div class="chart" id="jvm_chart"></div>
                <div class="chart" id="tx_chart"></div>
                <div class="chart" id="rx_chart"></div>
                <div class="chart" id="heartbeat_chart"></div>
                <div class="chart" id="tpc_chart"></div>
              </div>
              <div style="clear: left"></div>
              <div class="text-section">
                <h1>Mineload Plugin Data</h1>
                <p>Data collected from the Bukkit plugin.</p>
              </div>
              <div class="datablock">
                <h3>Bukkit Vitals</h3>
                <table>
                  <tr><td>Bukkit Tickrate:</td><td id="plugin_tickrate"></td></tr>
                  <tr><td>Bukkit Version:</td><td id="plugin_bukkitversion"></td></tr>
                  <tr><td>JVM Memory Used:</td><td id="plugin_jvmused"></td></tr>
                  <tr><td>JVM Memory Allocated:</td><td id="plugin_jvmmax"></td></tr>
                </table>
              </div>
              <div class="datablock">
                <h3>Server Info</h3>
                <table>
                  <tr><td>Java Version:</td><td id="plugin_jvmversion"></td></tr>
                  <tr><td>OS Name:</td><td id="plugin_osname"></td></tr>
                  <tr><td>OS Version:</td><td id="plugin_osversion"></td></tr>
                  <tr><td>Current Dir:</td><td id="plugin_cwd"></td></tr>
                </table>
              </div>
              <div class="datablock">
                <h3>Poll Data</h3>
                <table>
                  <tr><td>Players:</td><td id="plugin_playercount"></td></tr>
                  <tr><td>MOTD:</td><td id="plugin_motd"></td></tr>
                </table>
              </div>
              <div class="datablock">
                <h3>Network Traffic</h3>
                <table>
                  <tr><td>Data transmitted: </td><td id="plugin_tx">Loading...</td><td>GB</td></tr>
                  <tr><td>Data received: </td><td id="plugin_rx">Loading...</td><td>GB</td></tr>
                  <tr><td>Transmit rate: </td><td id="plugin_txrate">Loading...</td><td>KB/s</td></tr>
                  <tr><td>Receive rate: </td><td id="plugin_rxrate">Loading...</td><td>KB/s</td></tr>
                </table>
              </div>
              <div style="clear: left"></div>
              <div class="text-section">
                <h1>Mineload Updates</h1>
                <p>Updates from my blog feed</p>
              </div>
              <div class="datablock" id="feedcontent">
                <!--Blog feed content here-->
              </div>

            </article>
          </div>
          <div id="tab-2" class="tab">
            <article>
              <div class="text-section">
                <h1>World settings</h1>
                <p>Change world settings like time/day</p>
              </div>
              <ul class="states">
                <li class="warning">The world management section is not done yet.</li>
              </ul>
              <div class="datablock">
                <div id="world_table">

                </div>
              </div>
            </article>
          </div>
          <div id="tab-3" class="tab">
            <article>
              <div class="text-section">
                <h1>Inventory Browser</h1>
                <p>Inventory Browser</p>
              </div>
              <ul class="states">
                <li class="warning">The inventory browser isn't finished yet. Test it here *danger* <a href="inventory.html">inventory.html</a></li>
              </ul>
              <div class="datablock">
                <select id="inventory_player_list">
                  <option>Playername:</option>
                </select>
                <span id="inventory_status">Load Players</span>
                <div class="inventory_container">
                </div>
              </div>
            </article>
          </div>
          <div id="tab-4" class="tab">
            <article>
              <div class="text-section">
                <h1>Server Security</h1>
                <p>Edit banlist, ip addresses and manage whitelists</p>
              </div>
              <div class="datablock">
                <div id="player_table">

                </div>
              </div>
            </article>
          </div>
          <div id="tab-5" class="tab">
            <article>
              <div class="text-section">
                <h1>Server Scheduler</h1>
                <p>Schedule commands to be executed</p>
              </div>
              <ul class="states">
                <li class="warning">This might be a tricky one!</li>
              </ul>
            </article>
          </div>
          <div id="tab-6" class="tab">
            <article>
              <div class="text-section">
                <h1>Server Console</h1>
                <p>This is a quick overview of some features</p>
              </div>
              <ul class="states">
                <!-- FrostEnergy's console viewer -->
                <?php// include 'console/console.php'; ?>
              </ul>
            </article>
          </div>
          <div id="tab-7" class="tab">
            <article>
              <div class="text-section">
                <h1>Server Plugins</h1>
                <p>View plugin versions. TODO</p>
              </div>
              <div id="plugin_table">

              </div>
            </article>
          </div>
          <div id="tab-8" class="tab">
            <article>
              <div class="text-section">
                <h1>Mineload Configuration Settings</h1>
                <p>This is a quick overview of some features</p>
              </div>
              <ul class="states">
                <li class="warning">TODO: You will be able to edit the config.php settings here.</li>
              </ul>
            </article>
          </div>
        </div>
      </div>
    </div>
    <aside id="sidebar">
      <strong class="logo"><a href="#">lg</a></strong>
      <ul class="tabset buttons">
        <li class="active">
          <a href="#tab-1" class="ico1"><span>Dashboard</span><em></em></a>
          <span class="tooltip"><span>Dashboard</span></span>
        </li>
        <li>
          <a href="#tab-2" class="ico2"><span>World Manager</span><em></em></a>
          <span class="tooltip"><span>World Manager</span></span>
        </li>
        <li>
          <a href="#tab-3" class="ico3"><span>Inventory Browser</span><em></em></a>
          <span class="tooltip"><span>Inventory Browser</span></span>
        </li>
        <li>
          <a href="#tab-4" class="ico4"><span>Player Manager</span><em></em></a>
          <span class="tooltip"><span>Player Manager</span></span>
        </li>
        <li>
          <a href="#tab-5" class="ico5"><span>Scheduler</span><em></em></a>
          <span class="tooltip"><span>Schedule tasks</span></span>
        </li>
        <li>
          <a href="#tab-6" class="ico6">
            <span>Server Console</span><em></em>
          </a>
          <span class="num">0</span>
          <span class="tooltip"><span>Server console</span></span>
        </li>
        <li>
          <a href="#tab-7" class="ico7"><span>Plugins</span><em></em></a>
          <span class="tooltip"><span>Plugins</span></span>
        </li>
        <li>
          <a href="#tab-8" class="ico8"><span>Settings</span><em></em></a>
          <span class="tooltip"><span>Mineload settings</span></span>
        </li>
      </ul>
      <span class="shadow"></span>
    </aside>
  </div>
</body>
</html>
