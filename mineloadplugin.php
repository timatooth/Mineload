<?php
/* because of 'same origin access control' security reasons the data has to be proxied
 * from the bukkit server to the client because of xmlhttp request limitations.
 * 
 */
include 'config/config.php';
set_error_handler("errorHandler");
$dom = new DOMDocument('1.0', 'UTF-8');
$server = $dom->createElement("server");
$dom->appendChild($server);
session_start();

function errorHandler($code, $message){
  global $dom, $server;
  $error = $dom->createElement("error");
  $error->appendChild($dom->createTextNode($message));
  $error->setAttribute("code", $code);
  $server->appendChild($error);
}
if (isset($_SESSION['user'])) {
  $xmlData = file_get_contents("http://127.0.0.1:25500?password=$_mlp_password");
  header('Content-Type: text/xml');
  header('Cache-Control: no-cache');
  echo $xmlData;
} 
else {
  //they are not logged in.
  $error = $dom->createElement("error");
  $error->appendChild($dom->createTextNode("User not authorized."));
  $server->appendChild($error);
  echo $dom->saveXML();
}
?>
