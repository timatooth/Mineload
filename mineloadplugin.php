<?php

/* because of security reasons the data has to be proxied
 * from the bukkit server because of xmlhttp request limitations
 * 
 */
$xmlData = file_get_contents("http://127.0.0.1:25500");
header('Content-Type: text/xml');
header('Cache-Control: no-cache');
echo $xmlData;

?>