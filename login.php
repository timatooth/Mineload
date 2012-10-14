<?php
session_start();
include 'config/config.php';
include 'User.php';
$user = $_POST['loginform'];
$pass = $_POST['passwordform'];

if($_mlw_username == $user && $_mlw_password == $pass){
  $newuser = new User($user);
  $newuser->setLoggedIn(true);
  $_SESSION['user'] = $newuser;
  header('Location: admin.php');
}
else{
  header('Location: index.php?error=Invalid Login');
}

?>
