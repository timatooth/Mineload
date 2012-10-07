<?php

class User {
  private $userId;
  private $username;
  private $password;
  private $email;
  private $isLoggedIn;
  
  public function __construct($id) {
    $this->userId = $id;
    $this->username = "test";
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
