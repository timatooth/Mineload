<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Mineload Editor</title>
    <link rel="stylesheet" href="css/editor.css" />
  </head>
  <body>
    <div id="controlbar">
      <ul class="editorlinks">
        <li><a href="#"><img title="Save" id="saveicon" class="icon" src="images/save.png" alt="Save" width="32" height="32" /></a></li>
        <li><select id="plugin_list"><option>Plugins:</option></select></li>
        <li><select id="plugin_files_list"><option>Files:</option></select></li>
        <li id="current_open_file"></li>
        <li id="es"></li>
      </ul>
    </div>
    <div id="editor"></div>

    <script src="http://d1n0x3qji82z53.cloudfront.net/src-min-noconflict/ace.js" type="text/javascript" charset="utf-8"></script>
    <script type="text/javascript" src="http://code.jquery.com/jquery-1.9.1.min.js"></script>
    <script type="text/javascript" src="js/jsonapi.js"></script>
    <script src="js/editor.js"></script>
  </body>
</html>