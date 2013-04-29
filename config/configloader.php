<?php

session_start();

/**
 * Returns settings to authenticated user as a json object.
 * Saves new settins if sent in post variable.
 */
require 'config.php';

if (!isset($_SESSION['user'])) {
    header('Location: ../index.php');
    exit();
}

//stfu errors
set_error_handler("errorHandler");

function errorHandler($code, $message) {
    //tell this stupid php to stop echoing warnings.
    //return json errors instead
}

if (isset($_POST['mc_port'])) {
//not a very flash way of doing this but it works.
    $string = '<?php
/*** Mineload Minecraft connection Configuration settings ***/
$_mc_host = "' . $_POST["mc_host"] . '";
$_mc_port = ' . $_POST["mc_port"] . ';

/*** MineloadPlugin connection ***/
//Mineload Adddress - usually the same as Minecraft address
$_mlp_host = "' . $_POST["mlp_host"] . '";
//Port MineloadPlugin is listening on (Default 2500)
$_mlp_port = ' . $_POST["mlp_port"] . ';
//MineloadPlugin Password Default is changemenow539!
$_mlp_password = "' . $_POST["mlp_password"] . '";
  
/*** Mineload Web Interface Login credentials & Settings ***/
$_mlw_username = "' . $_POST["mlw_username"] . '";
$_mlw_password = "' . $_POST["mlw_password"] . '";
$_mlw_updates = ' . ($_POST['mlw_updates'] == 'on' ? 1 : 0) . ';

/*** JSONAPI Connection Settings ***/
$_jsonapi_host = "' . $_POST["jsonapi_host"] . '";
$_jsonapi_port = ' . $_POST["jsonapi_port"] . ';
$_jsonapi_username = "' . $_POST["jsonapi_username"] . '";
$_jsonapi_password = "' . $_POST["jsonapi_password"] . '";
$_jsonapi_salt = "' . $_POST["jsonapi_salt"] . '";
?>
';

    $fp = fopen("../config/config.php", "w");
    if ($fp == null) {
        //couldn't open file for writing.
        $status = Array();
        $status['status'] = "couldn't open config/config.php for writing";
        $status['success'] = false;
        echo json_encode($status);
        exit();
    }

    fwrite($fp, $string);
    fclose($fp);
    $status = Array();
    $status['status'] = "config/config.php written successfully";
    $status['success'] = true;
    echo json_encode($status);
} else {
    //get the settings and return them as a JSON object.
    $settings = Array();
    $settings["mc_host"] = $_mc_host;
    $settings["mc_port"] = $_mc_port;

    $settings["mlp_host"] = $_mlp_host;
    $settings["mlp_port"] = $_mlp_port;
    $settings['mlp_password'] = $_mlp_password;

    $settings['jsonapi_host'] = $_jsonapi_host;
    $settings['jsonapi_port'] = $_jsonapi_port;
    $settings['jsonapi_username'] = $_jsonapi_username;
    $settings['jsonapi_password'] = $_jsonapi_password;
    $settings['jsonapi_salt'] = $_jsonapi_salt;

    $settings['mlw_username'] = $_mlw_username;
    $settings['mlw_password'] = $_mlw_password;

    echo json_encode($settings);
}
?>
