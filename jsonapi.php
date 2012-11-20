<?php
/**
 * the aim of this lame php script is to give the jsonapi credentials
 * to the user if they are authenticated.
 */
header('Content-Type: application/json');
include 'config/config.php';
session_start();
if(isset($_SESSION['user'])){
  $data = Array();
  $data['host'] = $_jsonapi_host;
  $data['port'] = $_jsonapi_port;
  $data['username'] = $_jsonapi_username;
  $data['password'] = $_jsonapi_password;
  $data['salt'] = $_jsonapi_salt;
  echo json_encode($data);
}

else {
  echo json_encode("not authenticated");
}
?>