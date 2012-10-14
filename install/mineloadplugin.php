<?php
header("Content-Type: text/xml");

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

$text = file_get_contents("http://$_GET[host]:$_GET[port]/?password=".urlencode($_GET['password']));

echo $text;


?>
