var json;
/*** Editor state variables ***/
var editor = ace.edit("editor");
editor.setTheme("ace/theme/idle_fingers");
editor.getSession().setMode("ace/mode/yaml");
editor.getSession().setTabSize(2);
editor.getSession().setUseSoftTabs(true);
var currentOpenFile = "";
var currentFileModified = false;
var knownFileTypes = ['yml', 'yaml', 'txt', 'conf', 'config', 'log', 'java', 'properties', 'sh', 'bat'];
var pluginBlacklist = ['dynmap'];

editor.getSession().on('change', function(e) {
  currentFileModified = true;
});

$.getJSON("jsonapi.php", null, function(options){
  json = new JSONAPI(options);
  loadFile("server.properties");
  status("Loading plugin list...");
  json.call("getPlugins", null, function(res){
    var plugins = res.success;
    $('#plugin_list').html("<option>__BUKKIT__</option>");
    for(var p = 0; p < plugins.length; p++){
      if(isIn(plugins[p].name, pluginBlacklist)){
        continue;
      }
      var choice = document.createElement("option");
      $(choice).text(plugins[p].name);
      $('#plugin_list').append(choice);
    }
    status("Done loading plugin list");
  });
});


$('#plugin_list').change(function(){
  var choice = $('#plugin_list option:selected').text();
  var args = [choice];
  status("Loading " + args[0]+" folder...");
  
  if(choice == "__BUKKIT__"){
    args = ["."]; // the bukkit root folder
    json.call("getSingleDirectory", args, function(req){
      var files = req.success;
      $('#plugin_files_list').html(""); // empty the list.
      var firstToOpen = "";
      
      if(files.length < 1){
        status(args[0] + " folder is empty or doesn't exist.");
      }
      
      for(var f = 0; f < files.length; f++){
        //I don't want folders or binary files ending up in the text editor.
        if(isIn(files[f], knownFileTypes)){
          if(firstToOpen.length < 1){
            firstToOpen = files[f];
          }
          var filechoice = document.createElement("option");
          $(filechoice).text(files[f]);
          $('#plugin_files_list').append(filechoice);
        }
      }

      //load the first file in that sub list
      status(args[0] + " folder loaded");
      if(files.length > 0){
        loadFile(firstToOpen);
      }
    })
  }
  
  else {
    json.call("getPluginFiles", args, function(req){
      var files = req.success;
      $('#plugin_files_list').html(""); // empty the list.
      var firstToOpen = "";
      if(files.length < 1){
        status(args[0] + " folder is empty or doesn't exist.");
      }
      for(var f = 0; f < files.length; f++){
        //I don't want folders or binary files ending up in the text editor.
        if(isIn(files[f], knownFileTypes)){
          if(firstToOpen.length < 1){
            firstToOpen = files[f];
          }
          var filechoice = document.createElement("option");
          $(filechoice).text(files[f]);
          $('#plugin_files_list').append(filechoice);
        }
      }
      status(args[0] + " folder loaded");
      //load the first file in that sub list
      if(files.length > 0){
        loadFile(firstToOpen);
      }
    }); //end of json callback 
  } //end of else its a plugin.
}); //end of plugin list change event.

$('#plugin_files_list').change(function(){
  loadFile($('#plugin_files_list option:selected').text());
});

$('#saveicon').click(function(){
  status("Saving " + currentOpenFile + "...");
  var args = [currentOpenFile, editor.getValue()];
  json.call("setFileContents", args, function(){
    success(currentOpenFile + " Saved successfully! " + getFormattedDate());
    currentFileModified = false;
  });
});

function loadFile(filename){
  if(currentFileModified){
    if(!confirm(currentOpenFile +" has been modified. Clicking OK will *discard* changes!")){
      status("Resumed to edit " + currentOpenFile);
      return;
    }
  }
  var args = [filename];
  status("Loading " + filename + "...");
  json.call("getFileContents", args, function(req){
    //update the text editor with the new file.
    editor.setValue(req.success);
    editor.gotoLine(1);
    status("Done loading " + filename);
    currentOpenFile = filename;
    $('#current_open_file').text(currentOpenFile);
    currentFileModified = false;
  })
}

/**
 * set the status to something good
 */
function success(string){
  $('#es').attr("class", "success");
  $('#es').text(string);
}

function fail(string){
  $('#es').attr("class", "fail");
  $('#es').text(string);
}

function status(string){
  $('#es').attr("class", "status");
  $('#es').text(string);
}

function getFormattedDate() {
  var date = new Date();
  var str = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate() + " " +  date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

  return str;
}

function isIn(needle, haystack){
  for(var i = 0; i < haystack.length; i++){
    if(needle.match(haystack[i]) != null){
      return true;
    }
  }
  return false;
}