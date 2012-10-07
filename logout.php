<?php
session_start();
$_SESSION['user'] = null;
header("Location: index.php");
?>
