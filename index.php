<?php
include 'User.php';
//check if the app is installed.
if(!file_exists("config/config.php")){
  header('Location: install/');
  exit();
}
session_start();
if (isset($_SESSION['user'])) {
  if (true) {
    header('Location: admin.php');
  }
}
?>
<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>Mineload Login</title>
    <link media="all" rel="stylesheet" type="text/css" href="css/all.css" />
    <link media="all" rel="stylesheet" type="text/css" href="css/login.css" />
  </head>
  <body>

    <div id="loginfieldset">
      <h3>Mineload Web 0.0.2 Alpha</h3>
      
      <form action="login.php" method="post">
        <fieldset>
          <table>
            <tr><td><label for="loginform">Username:</label></td><td><input type="text" id="loginform" name="loginform" /></td></tr>
            <tr><td><label for="passwordform">Password:</label></td><td><input type="password" id="passwordform" name="passwordform" /></td></tr>
            <tr><td></td><td><input type="submit" value="Login" /></td></tr>
          </table>
          <ul class="states">
            <li><?php if(isset($_GET['error'])){echo $_GET['error'];} ?></li>
          </ul>
        </fieldset>
      </form>
    </div>
  </body>
</html>
