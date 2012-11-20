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
  tps: 0,
  plugins: {},
  worlds: {}
}
//TODO - same deal, this needs abstracted. my javascript sucks.
var mineloadSystemData = {
  load: 0,
  memory: 0,
  players: 0,
  maxplayers: 0,
  motd: "",
  latency: 0,
  tx: 0,
  rx: 0,
  txrate: 0,
  rxrate: 0,
  uptime: 0,
  mysqlsql: 0
}

var requestData = {
  password: 'changemenow539'
}

//all player related stuff, eg IP, name, display name, inventory etc.
var playerDataArray;

var mineloadPluginCallback = null;
var mineloadSystemCallback = null;
  
/*Create the class inside a function (that is the constructor too) hmm ok... */
function Xmlget() {
  this.typer = "test"; //lulwut
  this.statusFunctions = {
    404: function(){
      alert('fail')
    } //alert the herp derp.
  };
  
  this.ajaxSettings = {
    statusCode: Xmlget.statusFunctions,
    timeout: 10000, //5 seconds then Xmlget.prototype.error is called to change defcon status
    data: requestData,
    error: Xmlget.prototype.error
  };
}

/**
 * who the hell came up with the idea of this prototype shit? lol
 * whatever... it works(ish). anyway this function is used to fiddle with things.
 */
Xmlget.prototype.sayHello = function(){
  alert("Hello" + this.typer + this.mineloadPluginData['maxplayers']);
}

/**
 * load the data from MineloadPlugin. once successful an array will be set with the 
 * values.
 */
Xmlget.prototype.loadMineloadPluginData = function(callback){
  mineloadPluginCallback = callback;
  this.ajaxSettings['url'] = "mineloadplugin.php";
  this.ajaxSettings['success'] = Xmlget.prototype.mineloadPluginSuccess;
  $.ajax(this.ajaxSettings);
}

/**
 *called when the ajax request was successfull yay!
 *
 *Note to self: spell SUCCESS [2 Ss] right saves hours of 
 *frustration when the code isn't working like it should
 */
Xmlget.prototype.mineloadPluginSuccess = function(data,textStatus, jqXHR){
  //now that we have the MineloadPlugin data process it
  Xmlget.prototype.processMineloadPlugin(data);
}

/**
 *Fetch the mineload system xml data *legacy*
 */
//FIXME hardcoded value for ajax herej
Xmlget.prototype.loadMineloadSystemData = function(callback){
  mineloadSystemCallback = callback;
  this.ajaxSettings['url'] = "legacy/linuxdata.php";
  this.ajaxSettings['success'] = Xmlget.prototype.mineloadSystemSuccess;
  $.ajax(this.ajaxSettings);
}

Xmlget.prototype.mineloadSystemSuccess = function(data,textStatus, jqXHR){
  //now that we have the MineloadPlugin data process it
  Xmlget.prototype.processMineloadSystem(data);
}

/**
 * called whe the attempt to get the data failed/timedout.
 * because servers go done and the user needs to know, alarm bells will
 * be triggered and red flashing lights will appear. *not kidding*
 */
Xmlget.prototype.error = function(jqXHR, textStatus, errorThrown){
  $('#errors').show();
  $('#errors').text("AJAX Error: " + textStatus + "Thrown: " + errorThrown);
}

/**
 * process the xml from the mineload Bukkit plugin text. It should only
 * be called if the request for the data was successful.
 * 
 * It will set this.mineloadPluginData array for a get method.
 */
Xmlget.prototype.processMineloadPlugin = function(data){
  //start with adding the plugins
  var plugins = mineloadPluginData['plugins'];
  var i = 0
  $(data).find("plugin").each(function()
  {
    plugins[i] = $(this).text();
    i++;
  });
  //now the worlds
  var worlds = mineloadPluginData['worlds'];
  i = 0;
  $(data).find("world").each(function(){
    worlds[i] = $(this).text();
    i++;
  })
  //setting the rest of the fields is trivial.
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
  
  //get the plugins and send them to be addeded into a shiny datatable
  var pluginList = new Array();
  $(data).find("plugin").each(function(){
    var pluginName = $(this).text();
    var pluginEnabled = $(this).attr('enabled');
    var pluginVersion = $(this).attr('version');
    var pluginAuthor;
    if((pluginAuthor = $(this).attr('author')) == null){
      pluginAuthor = "?";
    }
    var pluginWebsite;
    if((pluginWebsite = $(this).attr('website')) == null){
      pluginWebsite = "?";
    }
    var plugin = new Array();
    plugin.push(pluginName, pluginEnabled, pluginVersion, pluginAuthor, pluginWebsite);
    pluginList.push(plugin)
  })
  
  loadPluginTable(pluginList);
  
  var playerList = new Array();
  $(data).find("player").each(function(){
    var playerName = $(this).attr('name');
    var playerIP = $(this).attr('ip');
    var playerXYZ = $(this).attr('xyz');
    var playerWorld = $(this).attr('world');
    var playerHealth = $(this).attr('health');
    var playerGameMode = $(this).attr('gamemode');
    var playerCanFly = $(this).attr('allowedflight');
    var playerIsOp = $(this).attr('op');
    var playerInHand = $(this).attr('inhand');

    var player = new Array();
    player.push(playerName, playerIP, playerXYZ, playerWorld,playerHealth,playerGameMode,playerCanFly,playerIsOp,playerInHand);
    playerList.push(player)
  })
  //process the player data.
  loadPlayerTable(playerList);
  
  var worldList = new Array();
  $(data).find("world").each(function(){
    var worldName = $(this).text();
    var worldPlayers = $(this).attr('players');
    var worldEntities = $(this).attr('entities');
    var worldTime = $(this).attr('time');
    worldTime = Number(worldTime);
    if(worldTime >=0 && worldTime <= 14000 ){
      worldTime = "Day";
    } else{
      worldTime = "Night";
    }
    var worldType = $(this).attr('type');
    var worldDifficulty = $(this).attr('difficulty');
    var world = new Array();
    world.push(worldName, worldPlayers, worldEntities, worldTime, worldType, worldDifficulty);
    worldList.push(world)
  })
  
  loadWorldTable(worldList);
  
  
  mineloadPluginCallback(mineloadPluginData);
  $('#errors').hide();
}

/**
 * process the older xml produced by mineload 1 that contains linux only
 * data.
 * 
 * It will set this.mineloadSystemData array.
 */
Xmlget.prototype.processMineloadSystem = function(data){
  mineloadSystemData['load'] = $(data).find("load").text();
  mineloadSystemData['memory'] = $(data).find("memory").text();
  mineloadSystemData['players'] = $(data).find("players").text();
  mineloadSystemData['maxplayers'] = $(data).find("maxplayers").text();
  mineloadSystemData['motd'] = $(data).find("motd").text();
  mineloadSystemData['latency'] = $(data).find("latency").text();
  mineloadSystemData['tx'] = $(data).find("tx").text();
  mineloadSystemData['rx'] = $(data).find("rx").text();
  mineloadSystemData['txrate'] = $(data).find("txrate").text();
  mineloadSystemData['rxrate'] = $(data).find("rxrate").text();
  mineloadSystemData['uptime'] = $(data).find("uptime").text();
  mineloadSystemData['mysqlqps'] = $(data).find("mysqlqps").text();
  mineloadSystemCallback(mineloadSystemData);
}
