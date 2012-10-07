<?php
include 'Session.php';
include 'User.php';
session_start();
$username = $_POST['loginform'];
$password = $_POST['passwordform'];

$session = new Session();
if($session->validate($username, $password)){
  $_SESSION['user'] = new User(0);
  header("Location: admin.php"); 
}
else{
  echo 'invalid login';
}
?>
