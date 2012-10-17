<?php

/**
 * I hope to support all server operating systems not just linux.
 * 
 * =Windows=
 * Network data can be collected in mineload plugin on windows using
 * netstat -e
 * 
 * Getting system load - ?
 * Getting memory usage - ?
 * 
 * =Mac=
 * Getting system load - uptime
 * Getting memory usage - ?
 * Getting transmit / rx - ?
 * 
 * =Linux=
 * System load - uptime
 * Memory - /proc/meminfo or free -m
 * tx/rx = /sys/class/net/eth0/statistics/tx_bytes
 */
session_start();
require("../config/config.php");
require("functions.php");
header("Content-type: text/xml");
header("Cache-Control: no-cache");

$dom = new DOMDocument('1.0', 'UTF-8');
$server = $dom->createElement("server");
$dom->appendChild($server);

set_error_handler("errorHandler");

function errorHandler($code, $message, $file, $line) {
  //this is a hacky solution to stopping undefined offset warnings
  if ($code == 8) {
    return;
  }
  global $dom, $server;
  $error = $dom->createElement("error", $message);
  $error->setAttribute("file", $file);
  $error->setAttribute("code", $code);
  $error->setAttribute("line", $line);
  $server->appendChild($error);
}

if(!isset($_SESSION['user'])){
  $error = $dom->createElement("error", "User not authorized");
  $server->appendChild($error);
  echo $dom->saveXML();
  exit();
}

if (PHP_OS == "Linux") {
  $loadaverages = sys_getloadavg();
  $memory = getSystemMemInfo();
  $poll = ping($_mc_host, $_mc_port, 10);
  $memused = (1 - $memory['MemFree'] / $memory['MemTotal']) * 100;
  $traffic = networkUsage($_mls_interface);
  $transferRate = networkRate($_mls_interface);
  $server->appendChild($dom->createElement('load', $loadaverages[0]));
  $server->appendChild($dom->createElement('memory', $memused));
  $server->appendChild($dom->createElement('players', $poll['players']));
  $server->appendChild($dom->createElement('maxplayers', $poll['max_players']));
  $server->appendChild($dom->createElement('motd', $poll['motd']));
  $server->appendChild($dom->createElement('latency', $poll['ping']));
  $server->appendChild($dom->createElement('tx', $traffic['tx']));
  $server->appendChild($dom->createElement('rx', $traffic['rx']));
  $server->appendChild($dom->createElement('txrate', $transferRate['txRate']));
  $server->appendChild($dom->createElement('rxrate', $transferRate['rxRate']));
  echo $dom->saveXML();
} else {
  $dom = new DOMDocument('1.0', 'UTF-8');
  $server = $dom->createElement("server");
  $dom->appendChild($server);
  $server->appendChild($dom->createElement("error", "OS not linux"));
  echo $dom->saveXML();
}
?>
