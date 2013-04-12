/**
 * Purpose is to perform ajax with jQuery to fetch data from 
 * the MineloadPlugin source and the original linux php file.
 * 
 * Warning; this file may contain biased misrepresented remarks
 * about JavaScript's OOP model.
 * 
 * Current development quality status: shit.
 */

//TODO - fix this and make it abstracted. javascript derp herp.
//This is the curret data storage for the MineloadPlugin data source
var mineloadPluginData = {
  playercount: 0,
  maxplayers: 100,
  totalplayers: 0,
  memoryused: 0,
  maxmemory: 0,
  tps: 0
};

//all player related stuff, eg IP, name, display name, inventory etc.
var playerDataArray;

var mineloadPluginCallback = null;
  
/*Create the class inside a function (that is the constructor too) hmm ok... */
function Xmlget() {
  this.ajaxSettings = {
    timeout: 10000, //5 seconds then Xmlget.prototype.error is called to change defcon status
    error: Xmlget.prototype.error
  };
}

/**
 * who the hell came up with the idea of this prototype shit? lol
 * whatever... it works(ish). anyway this function is used to fiddle with things.
 */
Xmlget.prototype.sayHello = function(){
  alert("Hello" + this.typer + this.mineloadPluginData['maxplayers']);
};

/**
 * load the data from MineloadPlugin. once successful an array will be set with the 
 * values.
 */
Xmlget.prototype.loadMineloadPluginData = function(callback){
  mineloadPluginCallback = callback;
  this.ajaxSettings['url'] = "mineloadplugin.php";
  this.ajaxSettings['success'] = Xmlget.prototype.mineloadPluginSuccess;
  $.ajax(this.ajaxSettings);
};

/**
 *called when the ajax request was successfull yay!
 *
 *Note to self: spell SUCCESS [2 Ss] right saves hours of 
 *frustration when the code isn't working like it should
 */
Xmlget.prototype.mineloadPluginSuccess = function(data,textStatus, jqXHR){
  //now that we have the MineloadPlugin data process it
  Xmlget.prototype.processMineloadPlugin(data);
};

/**
 * called whe the attempt to get the data failed/timedout.
 * because servers go done and the user needs to know, alarm bells will
 * be triggered and red flashing lights will appear. *not kidding*
 */
Xmlget.prototype.error = function(jqXHR, textStatus, errorThrown){
  $('#errors').show();
  $('#errors').text("AJAX Error: " + textStatus + "Thrown: " + errorThrown);
};

/**
 * process the xml from the mineload Bukkit plugin text. It should only
 * be called if the request for the data was successful.
 * 
 * It will set this.mineloadPluginData array for a get method.
 */
Xmlget.prototype.processMineloadPlugin = function(data){
  //TODO change this to self updating loop of xml key:value.
  mineloadPluginData['playercount'] = $(data).find("playercount").text();
  mineloadPluginData['maxplayers'] = $(data).find("maxplayers").text();
  mineloadPluginData['tps'] = $(data).find("tps").text();
  mineloadPluginData['memoryused'] = $(data).find("memoryused").text();
  mineloadPluginData['maxmemory'] = $(data).find("maxmemory").text();
  mineloadPluginData['jvmversion'] = $(data).find("jvmversion").text();
  mineloadPluginData['osname'] = $(data).find("osname").text();
  mineloadPluginData['osversion'] = $(data).find("osversion").text();
  mineloadPluginData['cwd'] = $(data).find("cwd").text();
  mineloadPluginData['bukkitversion'] = $(data).find("bukkitversion").text();
  mineloadPluginData['motd'] = $(data).find("motd").text();
  mineloadPluginData['tx'] = $(data).find("tx").text();
  mineloadPluginData['rx'] = $(data).find("rx").text();
  mineloadPluginData['heartbeat'] = $(data).find("heartbeat").text();
  mineloadPluginData['tpc'] = $(data).find("heartbeat").attr("ticktime");
  
  mineloadPluginCallback(mineloadPluginData);
  $('#errors').hide();
};
