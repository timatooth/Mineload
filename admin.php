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
    <link rel="stylesheet" media="all" href="css/console.css" />
    <link rel="stylesheet" href="css/alertify.core.css" />
    <link rel="stylesheet" href="css/alertify.default.css" />
    <link rel="icon" type="image/png" href="images/mineload-logo.png">
</head>

<body>
    <script type="text/javascript" src="http://code.jquery.com/jquery-1.9.1.min.js" ></script>
    <!-- main admin page layout and buttons stuff -->
    <script type="text/javascript" src="js/admin.main.js"></script>
    <script type="text/javascript" src="js/jsonapi.js"></script>
    <!--Options for chart scale, colours, animation here-->
    <script type="text/javascript" src="js/chartoptions.js"></script>
    <!-- Google's awesome (and very large) javascript library. -->
    <script type='text/javascript' src='https://www.google.com/jsapi'></script>
    <!-- gets the mineloadplugin xml data -->
    <script type="text/javascript" src="js/Xmlget.js"></script>
    <script type='text/javascript' src="js/chartloader.js"></script>
    <!-- Server console js -->
    <script type="text/javascript" src="js/jsonapi.js"></script>
    <script type="text/javascript" src="js/alertify.min.js"></script>

    <script type="text/javascript" charset="utf8" src="js/playertable.js"></script>
    <script type="text/javascript" charset="utf8" src="js/worldtable.js"></script>
    <script type="text/javascript" charset="utf8" src="js/plugintable.js"></script>
    <script type="text/javascript" charset="utf8" src="js/updatefeed.js"></script>
    <script type="text/javascript" charset="utf8" src="js/alert.js"></script>
    <script type="text/javascript" charset="utf8" src="js/inventory.js"></script>
    <script type="text/javascript" charset="utf8" src="js/settingstable.js"></script>
    <script type="text/javascript" charset="utf8" src="js/dashboard.js"></script>
    <script type="text/javascript" charset="utf8" src="js/permissionstable.js"></script>
    <script type="text/javascript" charset="utf8" src="js/minecraft-avatar.js"></script>

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
                                    <tr><td><button id="perform_GC" title="Attempt to free memory by manually calling the JVM garbage collector">Run Garbage Collector</button></td><td></td></tr>
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
                                <h1>World Info</h1>
                                <p>View world information</p>
                            </div>
                            <div class="datablock">
                                <div id="world_table">Loading...</div>
                            </div>
                            <div class="text-section" style="clear: left">
                                <h1>Disk Space Usage</h1>
                                <p>Server file system info</p>
                            </div>
                            <div class="datablock">
                                <p id="disk_data">Disk Used: <p>
                            </div>
                        </article>
                    </div>
                    <div id="tab-3" class="tab">
                        <article>
                            <div class="text-section">
                                <h1>Inventory Browser</h1>
                                <p><em>Take care loading large amounts of players</em></p>
                            </div>
                            <div class="datablock" id="inventory_page">
                                <select id="inventory_player_list">
                                    <option>Playername:</option>
                                </select>

                                <button id="inventorys_clear">Clear Page</button>
                                <span id="inventory_status">Status</span>
                                <br />

                                <div id="inventorys_div">
                                </div>

                            </div>
                        </article>
                    </div>
                    <div id="tab-4" class="tab">
                        <article>
                            <div class="text-section">
                                <h1>Online Players</h1>
                                <p>View status of players logged in.</p>
                            </div>
                            <div class="datablock">
                                <div id="player_table"></div>
                            </div>
                            <div style="clear: left" class="text-section">
                                <h1>Player Operations</h1>
                                <p>Select a player or CTRL + Select. To perform actions.</p>
                            </div>
                            <div class="datablock" id="player_operations">
                                <ul id="selected_players"></ul>
                                <button class="player_operation_button">Kick</button>
                                <button class="player_operation_button">Ban</button>
                                <!-- TODO. Possible broken jsonapi method in banIP
                                <button class="player_operation_button">IP Ban</button>
                                <button class="player_operation_button">Toggle OP</button>
                                <button class="player_operation_button">Toggle Whitelist</button>
                                -->
                            </div>
                        </article>
                    </div>
                    <div id="tab-5" class="tab">
                        <article>
                            <div class="text-section">
                                <h1>Permissions</h1>
                                <p>
                                    View and change user and group permissions. Currently
                                    you can only edit nodes on a per-user basis. Users must be
                                    <strong>online.</strong>
                                    Groups must be edited
                                    manually e.g. the Mineload Plugin Configuration Editor. 
                                </p>
                            </div>
                            <div class="datablock">
                                <div class="permbox" id="user-permissions">
                                    <h3>User...</h3>
                                    <select id="user-permissions-select" multiple="multiple"></select>
                                </div>
                                <div class="permbox" id="group-permissions">
                                    <h3>Is member of...</h3>
                                    <select id="group-permissions-select" multiple="multiple"></select>
                                </div>
                                <div class="permbox" id="permissions-nodes">
                                    <h3>And has nodes...</h3>
                                    <select id="permissions-nodes-select" multiple="multiple"></select>
                                </div>
                            </div>
                        </article>
                    </div>
                    <div id="tab-6" class="tab">
                        <article>
                            <div id="console">
                                <iframe id="consoleframe" src="emptyConsole.html"></iframe>
                                <div id="commandarea">
                                    <input type="text" id="command_field" />
                                    <button id="send_command_button">Execute</button>
                                </div>
                                <div id="commandbuttons" style="clear: right">
                                    <p><a href="#" id="clearconsoleframebutton">Clear Console</a></p>
                                </div>
                            </div>
                            <script src="js/consolefeed.js" type="text/javascript"></script>
                        </article>
                    </div>
                    <div id="tab-7" class="tab">
                        <article>
                            <div class="text-section">
                                <h1>Server Plugins</h1>
                                <p>View plugin versions</p>
                            </div>
                            <div class="datablock">
                                <div id="plugin_table"></div>
                            </div>
                        </article>
                    </div>
                    <div id="tab-8" class="tab">
                        <article>
                            <div class="text-section">
                                <h1>Mineload Configuration Settings</h1>
                                <p>This is a quick overview of some features</p>
                            </div>
                            <div class="datablock">
                                <p>
                                    These settings are saved in config/config.php which needs
                                    to be <strong>writable</strong> on the server. You will be
                                    logged out when settings are applied and will need to re-login.
                                </p>
                                <table>
                                    <tr>
                                        <td><strong>Minecraft Server</strong></td>
                                        <td></td><td></td>
                                    </tr>
                                    <tr>
                                        <td>Minecraft Hostname:</td>
                                        <td><input id="mc_host" type="text" /></td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>Minecraft Port:</td>
                                        <td><input id="mc_port" type="text" /></td>
                                        <td>Default: 25565</td>
                                    </tr>
                                    <tr>
                                        <td><strong>MineloadPlugin Settings</strong></td>
                                        <td></td><td></td>
                                    </tr>
                                    <tr>
                                        <td>
                                            MineloadPlugin Hostname:
                                        </td>
                                        <td>
                                            <input id="mlp_host" type="text" />
                                        </td>
                                        <td>Usually same as your MC IP</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            MineloadPlugin Port:
                                        </td>
                                        <td>
                                            <input id="mlp_port" type="text" />
                                        </td>
                                        <td>Default: 25500</td>

                                    </tr>
                                    <tr>
                                        <td>MineloadPlugin Password:</td>
                                        <td>
                                            <input id="mlp_password" type="password" />
                                        </td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td><strong>JSONAPI Settings</strong></td>
                                        <td></td><td></td>
                                    </tr>
                                    <tr>
                                        <td>JSONAPI Hostname:</td>
                                        <td><input id="jsonapi_host" type="text" /></td>
                                        <td>Usually the same as your MC IP</td>
                                    </tr>
                                    <tr>
                                        <td>JSONAPI Port:</td>
                                        <td><input id="jsonapi_port" type="text" /></td>
                                        <td>Default: 20059</td>
                                    </tr>
                                    <tr>
                                        <td>JSONAPI Username:</td>
                                        <td><input id="jsonapi_username" type="text" /></td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>JSONAPI Password:</td>
                                        <td><input id="jsonapi_password" type="password" /></td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>JSONAPI Salt:</td>
                                        <td><input id="jsonapi_salt" type="password" /></td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td><strong>Mineload Web Interface Settings</strong></td>
                                        <td></td><td></td>
                                    </tr>
                                    <tr>
                                        <td>Username:</td>
                                        <td><input id="mlw_username" type="text" /></td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>Password:</td>
                                        <td><input id="mlw_password" type="password" /></td>
                                        <td></td>
                                    </tr>
                                </table>
                                <br />
                                <button id="save_settings">Save</button>
                                <span id="settings_status"></span>
                            </div>
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
                    <a href="#tab-2" class="ico2"><span>World Info</span><em></em></a>
                    <span class="tooltip"><span>World Info</span></span>
                </li>
                <li>
                    <a href="#tab-3" class="ico3"><span>Inventory Browser</span><em></em></a>
                    <span class="tooltip"><span>Inventory Browser</span></span>
                </li>
                <li>
                    <a href="#tab-4" class="ico4"><span>Player Manager</span><em></em></a>
                    <span class="tooltip"><span>Player Manager (click to refresh)</span></span>
                </li>
                <li>
                    <a href="#tab-5" class="ico5"><span>Permissions</span><em></em></a>
                    <span class="tooltip"><span>View/Edit permissions</span></span>
                </li>
                <li>
                    <a href="#tab-6" class="ico6">
                        <span>Server Console</span><em></em>
                    </a>
                    <span id ="consolmessages_num"class="num">0</span>
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
