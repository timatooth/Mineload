$(document).ready(function(){
  
  $('#mc_host').blur(checkMcStatus);
  $('#mc_port').blur(checkMcStatus);
  
  $('#mlp_password').blur(function(){
    $('#mlp_status').html("<img src='images/radar.gif' alt='Polling...' width='25' height='25' />");
    $.ajax({
      url: "mineloadplugin.php",
      success: updateMineloadStatus,
      error: updateMineloadError,
      timeout: 5000,
      data: {
        host: $('#mlp_host').val(),
        port: $('#mlp_port').val(),
        password: $('#mlp_password').val()
      }
    });
  });
  
  $('#jsonapi_salt').blur(function(){
    $("#jsonapi_status").attr("class", "warning");
    $('#jsonapi_status').html("Contacting JSONAPI...<img src='images/radar.gif' alt='Polling...' width='25' height='25' />\n\
      This should take less than a second.");
    var options = {
      host: $('#jsonapi_host').val(),
      port: $('#jsonapi_port').val(),
      username: $('#jsonapi_username').val(),
      password: $('#jsonapi_password').val(),
      salt: $('#jsonapi_salt').val()
    };
    
    var json = new JSONAPI(options);
    json.call("getPluginVersion", ["JSONAPI"], function(req){
      if(req.result == "success"){
        $('#jsonapi_status').attr("class", "success");
        $('#jsonapi_status').html("JSONAPI version: " + req.success);
      }
      else{
        $('#mlp_status').attr("class", "error");
        $('#mlp_status').html("<strong>There was an error contacting JSONAPI</strong> " + req.success);
      }
    });
  });
  
});

function checkMcStatus(){
  $('#mc_status').html("<img src='images/radar.gif' alt='Polling...' width='25' height='25' />");
  $.ajax({
    url: "mcpoll.php",
    success: updateMcStatus,
    error: updateMcError,
    timeout: 5000,
    data: {
      host: $('#mc_host').val(),
      port: $('#mc_port').val()
    }
  });
}

function updateMcStatus(data, textStatus, jqXHR){
  var motd = $(data).find("motd").text();
  var players = $(data).find("playercount").text();
  var maxplayers = $(data).find("maxplayers").text();
  $('#mc_status').html("<em>"+ motd + ":</em><strong> "+players+"/"+maxplayers+"</strong>");
  $('#mc_status').attr("class", "success")
  var error = $(data).find("error");
  if($(error).text().length > 0){
    $('#mc_status').attr("class", "error")
    $('#mc_status').html("Error: " + $(error).text() );
  }
}

function updateMcError(jqXHR, textStatus, errorThrown){
  $('#mc_status').html("An error occured in the minecraft poll script." +
    " Your host may not support sockets in php, or your server is down. A firewall could also" +
    " be the culpret. ErrorStatus: " +
    textStatus + " ErrorThrown: " + errorThrown);
  $('#mc_status').attr("class", "error")
}

function updateMineloadStatus(data, textStatus, jqXHR){
  var tps = $(data).find("tps").text();
  var bukkitversion = $(data).find("bukkitversion").text();
  $('#mlp_status').html("Bukkit: " + bukkitversion + " Ticks p/sec: " + tps);
  $('#mlp_status').attr("class", "success")
  $(data).find("player").each(function(){
    $('#mlp_status').append(" " + $(this).attr("name") + ",");
  });
  var error = $(data).find("error").text();
  if($(error).length > 0){
    $('#mlp_status').html("Error fetching mineload data.");
    $('#mlp_status').append("<ul><li>Is MineloadPlugin.jar Installed and enabled?</li>" +
      "<li>Is the plugin's config.yml correct?</li><li>Is the bukkit server ON? Firewall?</li>"+
      "<li>Error 406 = Invalid Password</li><li>Error 50x = May mean data isn't ready yet.. just wait</li>" +
      "<li><em>The error below should help</em></li></ul>");

    $('#mlp_status').append(error);
    $('#mlp_status').attr("class", "error")
  }
}

function updateMineloadError(jqXHR, textStatus, errorThrown){
  $('#mlp_status').html("An error occured in the Mineload poll script." +
    " Your host may not support external requests php, or your server is down. A firewall could also" +
    " be the culpret. ErrorStatus: " +
    textStatus + " ErrorThrown: " + errorThrown);
  $('#mlp_status').attr("class", "error")
}