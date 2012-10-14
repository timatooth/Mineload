<?php

//The actual "poll" function returns an array
function ping($host, $port = 25565, $timeout = 1000) {
  $time_start = microtime_float();
  @$fp = fsockopen($host, $port, $errno, $errstr, $timeout);
  if (!$fp)
    return false;
  fwrite($fp, "\xFE");
  $d = fread($fp, 256);
  if ($d[0] != "\xFF")
    return false;
  $ping = microtime_float() - $time_start;
  $d = substr($d, 3);
  $d = mb_convert_encoding($d, 'auto', 'UCS-2');
  $d = explode("\xA7", $d);
  return array(
      'motd' => $d[0],
      'players' => intval($d[1]),
      'max_players' => intval($d[2]),
      'ping' => $ping
  );
}
/**
 * Linux specific
 * @return type
 */
function getSystemMemInfo() {
  $data = explode("\n", file_get_contents("/proc/meminfo"));
  $meminfo = array();
  foreach ($data as $line) {
    @list($key, $val) = explode(":", $line);
    $meminfo[$key] = (int) substr(trim($val), 0, -3);
  }
  return $meminfo;
}

function mysqlHealth() {
  $con = mysql_connect($DB_HOST, $DB_USERNAME, $DB_PASSWORD);
  $status = explode('  ', mysql_stat($con));
  foreach ($status as $stat) {
    echo $stat . "<br />";
  }
}

function microtime_float() {
  list($usec, $sec) = explode(" ", microtime());
  return ((float) $usec + (float) $sec);
}

/**
 * Linux specific
 * @param type $interface
 * @return type
 */
function networkUsage($interface) {
  $data = array(
      'tx' => (int) file_get_contents("/sys/class/net/" . $interface . "/statistics/tx_bytes"),
      'rx' => (int) file_get_contents("/sys/class/net/" . $interface . "/statistics/rx_bytes")
  );
  return $data;
}

/**
 * Linux specific
 * @param type $interface
 * @return type
 */
function networkRate($interface) {
  $initial = networkUsage($interface);
  sleep(1);
  $final = networkUsage($interface);
  $data = array
      (
      'txRate' => ($final['tx'] - $initial['tx']) / 1000,
      'rxRate' => ($final['rx'] - $initial['rx']) / 1000
  );
  return $data;
}

function sqlQueryRate($host, $user, $pass) {
  $con = mysql_connect($host, $user, $pass);
  $status = explode('  ', mysql_stat($con));
  mysql_close($con);
  $qstring = $status[7];
  $arr = explode(" ", $qstring);
  $n = count($arr);
  return $arr[$n - 1];
}

?>
