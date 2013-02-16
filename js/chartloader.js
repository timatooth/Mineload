/*
 *Starting point for chart drawing.
 *google will start init once its loaded.
 */
var DELAY = 4000; //update the charts every DELAY ms.
google.load('visualization', '1', {
  packages:['gauge']
});
google.setOnLoadCallback(init);

/*
 *global variables that all methods can access
 */
var data;
var options;
var chart;

//MineloadPlugin sourced charts
var mPlayerChart;
var mJvmChart;
var mTpsChart;
var mTxChart;
var mRxChart;


//data for charts from mineloadPlugin
var mPlayerData;
var mJvmData;
var mTpsData;
var mHeartbeatChart;
var mTimePerTickChart;

//data for charts from php script
var sysTxData;
var sysRxData;
var sysLoadData;
var sysLatencyData;
var sysMemoryData;

//last tx and rx values to help calculate the rate
var lastTx = 0;
var lastRx = 0;

var pluginCallback = function updatePluginData(plugindata){
  var tx = Number(plugindata['tx']);
  var rx = Number(plugindata['rx']);
  var txRate = Math.round(((tx - lastTx) / 1024) / (DELAY / 1000), 2);
  var rxRate = Math.round((rx - lastRx) / 1024 / (DELAY / 1000), 2);
  $('#plugin_tickrate').text(plugindata['tps']);
  $('#plugin_jvmused').text(plugindata['memoryused'] + " MB (" +Math.round(Number(plugindata['memoryused'] /plugindata['maxmemory'] ) * 100, 2) + "%)");
  $('#plugin_jvmmax').text(plugindata['maxmemory'] + " MB");
  $('#plugin_jvmversion').text(plugindata['jvmversion']);
  $('#plugin_osname').text(plugindata['osname']);
  $('#plugin_osversion').text(plugindata['osversion']);
  $('#plugin_cwd').text(plugindata['cwd']);
  $('#plugin_bukkitversion').text(plugindata['bukkitversion']);
  $('#plugin_playercount').text(plugindata['playercount']+"/"+plugindata['maxplayers']);
  $('#plugin_motd').html("<em>"+plugindata['motd']+"</em>");
  $('#plugin_tx').text(Math.round(tx / Math.pow(1024, 3), 2));
  $('#plugin_rx').text(Math.round(rx / Math.pow(1024, 3), 2));
  $('#plugin_txrate').text(txRate);
  $('#plugin_rxrate').text(rxRate);
  
  //populate the google tables with new data
  var playercount = Number(plugindata['playercount']) / Number(plugindata['maxplayers']) * 100;
  if (isNaN(playercount)){
    playercount = 0;
  }
  mPlayerData = google.visualization.arrayToDataTable([
    ['Label', 'Value'],
    ['Slots %', Math.round(playercount, 2)]
    ]);
  var memused = Math.round(Number(plugindata['memoryused']) / Number(plugindata['maxmemory']) * 100);
  if(isNaN(memused)){
    memused = 0;
  }
  mJvmData = google.visualization.arrayToDataTable([
    ['Label', 'Value'],
    ['Mem Used', memused]
    ]);
  var tps = Number(plugindata['tps'])
  if(isNaN(tps)){
    tps = 0;
  }
  mTpsData = google.visualization.arrayToDataTable([
    ['Label', 'Value'],
    ['Ticks p/s', Math.round(tps, 2)]
    ]);
    
  mTxData = google.visualization.arrayToDataTable([
    ['Label', 'Value'],
    ['KB Out', txRate]
    ]);
    
  mRxData = google.visualization.arrayToDataTable([
    ['Label', 'Value'],
    ['KB In', rxRate]
    ]);
  var heartbeat = Number(plugindata['heartbeat']);
  if(isNaN(heartbeat)){
    heartbeat = 0;
  }
  var tpc = Number(plugindata['tpc']);
  if(isNaN(tpc)){
    tpc = 0;
  }
  mHeartbeatData = google.visualization.arrayToDataTable([
    ['Label', 'Value'],
    ['Heartrate', heartbeat]
    ]);
    
  mTimePerTickData = google.visualization.arrayToDataTable([
    ['Label', 'Value'],
    ['TPC', tpc]
    ]);
    
  lastRx = rx;
  lastTx = tx;
  drawPluginCharts();
  alertCheck(plugindata);
    
}

var systemCallback = function updateSystemData(systemdata){
  $('#tx').text(Math.round(Number(systemdata['tx']) / (1024*1024*1024), 2));
  $('#rx').text(Math.round(Number(systemdata['rx']) / (1024*1024*1024), 2));
  $('#rxrate').text(systemdata['rxrate']);
  $('#txrate').text(systemdata['txrate']);
  $('#sys_playersonline').text(systemdata['players'] + "/" + systemdata['maxplayers']);
  $('#sys_motd').text(systemdata['motd']);
  $('#sys_latency').text(Math.round(Number(systemdata['latency'])*1000, 1));
  $('#sys_load').text(systemdata['load']);
  $('#sys_memory').text(Math.round(Number(systemdata['memory']), 2) + "%");
  $('#sys_uptime').text(systemdata['uptime']);
    
  
    
  //drawSystemCharts();
}

/**
 * Init is the starting point of the chart system.
 * it is called once the google api is fully loaded.
 * 
 * It starts by settings default values to the data and options
 * arrays for the charts.
 */
function init() {
  //create the google data table array thinamagig.
  data = google.visualization.arrayToDataTable([
    ['Label', 'Value'],
    ['Memory', Math.floor(Math.random()*101)],
    ['CPU', Math.floor(Math.random()*101)],
    ['Network', Math.floor(Math.random()*101)],
    ['TPS', Math.floor(Math.random()*101)],
    ['Latency', Math.floor(Math.random()*101)],
    ['Load', Math.floor(Math.random()*101)]
    ]);
    
  //initilize the charts now.
  //MineloadPlugin charts
  mPlayerChart = new google.visualization.Gauge(document.getElementById('slots_chart'));
  mJvmChart = new google.visualization.Gauge(document.getElementById('jvm_chart'));
  mTpsChart = new google.visualization.Gauge(document.getElementById('tps_chart'));
  mTxChart = new google.visualization.Gauge(document.getElementById('tx_chart'));
  mRxChart = new google.visualization.Gauge(document.getElementById('rx_chart'));
  mHeartbeatChart = new google.visualization.Gauge(document.getElementById('heartbeat_chart'));
  mTimePerTickChart = new google.visualization.Gauge(document.getElementById('tpc_chart'));
  
  //Minload php system charts
  //none anymore :)
  
  // start the loop
  mainloop();
}

/**
 *draw the charts for the MineloadPlugin data
 */
function drawPluginCharts() {
  mPlayerChart.draw(mPlayerData, mPlayersOptions);
  mTpsChart.draw(mTpsData, mTpsOptions);
  mJvmChart.draw(mJvmData, mJvmOptions);
  mTxChart.draw(mTxData, mTxOptions);
  mRxChart.draw(mRxData, mRxOptions);
  mHeartbeatChart.draw(mHeartbeatData, mHeartbeatOptions);
  mTimePerTickChart.draw(mTimePerTickData, mTimePerTickOptions);
}

/**
 *draw the charts for the system data
 */
function drawSystemCharts(){
 
}

function mainloop(){
  //get the latest data
  var xml = new Xmlget();
  xml.loadMineloadPluginData(pluginCallback);
  //xml.loadMineloadSystemData(systemCallback);
    
  //call mainloop over and over again with setTimeout()
  setTimeout(mainloop, DELAY);
}


/**
 * math rounding helper
 */
var _round = Math.round;
Math.round = function(number, decimals){
  if (arguments.length == 1)
    return _round(number);

  multiplier = Math.pow(10, decimals);
  return _round(number * multiplier) / multiplier;
}