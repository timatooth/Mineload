<?php
header("Content-Type: text/xml");
/*
 * https://gist.github.com/1235274
 */
set_error_handler("errorHandler");

function errorHandler($code, $message){
  //shit has hit the fan. present this in xml
  $doc = new DOMDocument('1.0', 'UTF-8');
  
  $root = $doc->createElement("minecraft");
  $doc->appendChild($root);
  
  $error = $doc->createElement("error");
  $error->appendChild($doc->createTextNode($message));
  $error->setAttribute("code", htmlentities($code));
  $root->appendChild($error);
  echo $doc->saveXML();
  exit();
}


function ping($host, $port = 25565, $timeout = 30) {
//Set up our socket
  $fp = fsockopen($host, $port, $errno, $errstr, $timeout);
  if (!$fp)
    return false;

//Send 0xFE: Server list ping
  fwrite($fp, "\xFE");

//Read as much data as we can (max packet size: 241 bytes)
  $d = fread($fp, 256);

//Check we've got a 0xFF Disconnect
  if ($d[0] != "\xFF")
    return false;

//Remove the packet ident (0xFF) and the short containing the length of the string
  $d = substr($d, 3);

//Decode UCS-2 string
  $d = mb_convert_encoding($d, 'auto', 'UCS-2');

//Split into array
  $d = explode("\xA7", $d);
  fclose($fp);
//Return an associative array of values
  return array(
      'motd' => $d[0],
      'players' => intval($d[1]),
      'max_players' => intval($d[2]));
}



/*
 * Generate the xml response 
 */

$server = ping($_GET['host'], $_GET['port']);
$doc = new DOMDocument('1.0', 'UTF-8');

$root = $doc->createElement("minecraft");
$doc->appendChild($root);

$motd = $doc->createElement("motd");
$motd->appendChild($doc->createTextNode($server['motd']));
$root->appendChild($motd);

$playercount = $doc->createElement("playercount");
$playercount->appendChild($doc->createTextNode($server['players']));
$root->appendChild($playercount);

$maxplayers = $doc->createElement("maxplayers");
$maxplayers->appendChild($doc->createTextNode($server['max_players']));
$root->appendChild($maxplayers);
echo $doc->saveXML();
?>
