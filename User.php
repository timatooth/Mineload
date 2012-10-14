<?php

class User {
  private $userId;
  private $username;
  private $password;
  private $email;
  private $isLoggedIn;
  
  public function __construct($user) {
    $this->username = $user;
    $this->password = "password";
  }
  
  public function isLoggedIn(){
    return $this->isLoggedIn;
  }
  
  public function setLoggedIn($value){
    $this->isLoggedIn = $value;
  }
  
  public function getUsername(){
    return $this->username;
  }
  

}

?>
