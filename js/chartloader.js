/*
 *Starting point for chart drawing.
 *google will start init once its loaded.
 */
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

//php sourced data charts
var sysTxChart;
var sysRxChart;
var sysLoadChart;
var sysLatencyChart;
var sysMemoryChart;

//data for charts from mineloadPlugin
var mPlayerData;
var mJvmData;
var mTpsData;

//data for charts from php script
var sysTxData;
var sysRxData;
var sysLoadData;
var sysLatencyData;
var sysMemoryData;

var pluginCallback = function updatePluginData(plugindata){
  $('#plugin_tickrate').text(plugindata['tps']);
  $('#plugin_jvmused').text(plugindata['memoryused'] + " MB (" +
    Math.round(Number(plugindata['memoryused'] /plugindata['maxmemory'] ) * 100, 2) + "%)");
  $('#plugin_jvmmax').text(plugindata['maxmemory'] + " MB");
  $('#plugin_jvmversion').text(plugindata['jvmversion']);
  $('#plugin_osname').text(plugindata['osname']);
  $('#plugin_osversion').text(plugindata['osversion']);
  $('#plugin_cwd').text(plugindata['cwd']);
  
  //populate the google tables with new data.
  mPlayerData = google.visualization.arrayToDataTable([
    ['Label', 'Value'],
    ['Slots %', Number(plugindata['playercount']) / Number(plugindata['maxplayers'])]
    ]);
    
  mJvmData = google.visualization.arrayToDataTable([
    ['Label', 'Value'],
    ['Mem Used', Math.round(Number(plugindata['memoryused']) / Number(plugindata['maxmemory']) * 100) ]
    ]);
    
  mTpsData = google.visualization.arrayToDataTable([
    ['Label', 'Value'],
    ['Ticks p/s', Number(plugindata['tps'])]
    ]);
    
  drawPluginCharts();
  alertCheck(plugindata);
    
}

var systemCallback = function updatePluginData(systemdata){
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
  
  sysTxData = google.visualization.arrayToDataTable([
    ['Label', 'Value'],
    ['KB Out', Number(systemdata['txrate'])]
    ]);
    
  sysRxData = google.visualization.arrayToDataTable([
    ['Label', 'Value'],
    ['KB In', Number(systemdata['rxrate']) ]
    ]);
    
  sysLoadData = google.visualization.arrayToDataTable([
    ['Label', 'Value'],
    ['Load', Number(systemdata['load'])]
    ]);
    
  sysLatencyData = google.visualization.arrayToDataTable([
    ['Label', 'Value'],
    ['Latency', Math.round(Number(systemdata['latency']), 3)]
    ]);
    
    drawSystemCharts();
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
    
  //options array sets how the charts will redline, scale etc.
  options = {
    width: 900, 
    height: 120,
    redFrom: 90, 
    redTo: 100,
    yellowFrom:75, 
    yellowTo: 90,
    minorTicks: 5
  };
  
  //initilize the charts now.
  //MineloadPlugin charts
  mPlayerChart = new google.visualization.Gauge(document.getElementById('slots_chart'));
  mJvmChart = new google.visualization.Gauge(document.getElementById('jvm_chart'));
  mTpsChart = new google.visualization.Gauge(document.getElementById('tps_chart'));
  
  //Minload php system charts
  
  sysTxChart = new google.visualization.Gauge(document.getElementById('sys_tx_chart'));
  sysRxChart = new google.visualization.Gauge(document.getElementById('sys_rx_chart'));
  sysLoadChart = new google.visualization.Gauge(document.getElementById('sys_load_chart'));
  sysLatencyChart = new google.visualization.Gauge(document.getElementById('sys_latency_chart'));
  
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
}

/**
 *draw the charts for the system data
 */
function drawSystemCharts(){
  sysTxChart.draw(sysTxData, sysTxOptions);
  sysRxChart.draw(sysRxData, sysRxOptions);
  sysLoadChart.draw(sysLoadData, sysLoadOptions);
  sysLatencyChart.draw(sysLatencyData, sysLatencyOptions);
}

function mainloop(){
  //get the latest data
  var xml = new Xmlget();
  xml.loadMineloadPluginData(pluginCallback);
  xml.loadMineloadSystemData(systemCallback);
    
  //call mainloop over and over again with setTimeout()
  setTimeout(mainloop, 4000);
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