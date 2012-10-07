<?php
session_start();

class Session{
  private $username = "test";
  private $password = "pass";
  
  public function __construct() {
    
  }
  
  public function validate($user, $pass){
    return $user == $this->username && $this->password == $pass;
  }
}
?>