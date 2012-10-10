<?php
include 'User.php';
session_start();
if(isset($_SESSION['user'])){
  if(true){
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
      <h1>Mineload 2.0 Alpha</h1>
      <form action="login.php" method="post">
        <fieldset>
          <legend>Login</legend>
          <p>Demo login is test:pass</p>
          <label for="loginform">Username:</label><input type="text" id="loginform" name="loginform" />
          <br />
          <label for="passwordform">Password:</label><input type="password" id="passwordform" name="passwordform" />
          <br />
          <input type="submit" value="Login" />
        </fieldset>
      </form>
    </div>
  </body>
</html>
