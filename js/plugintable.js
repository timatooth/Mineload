var pluginTableLoaded = false;
function loadPluginTable(plugins) {
  //make this only load once.
  //alert(plugins[0]);
  if(playerTableLoaded){return;}
  
  $('#plugin_table').html( '<table cellpadding="0" cellspacing="0" border="0" class="display" id="plugintable"></table>' );
  
  $('#plugintable').dataTable( {
    "aaData": plugins,
    "aoColumns": [
      {"sTitle": "Plugin name" },
      {"sTitle": "Enabled" },
      {"sTitle": "Version"},
      {"sTitle": "Author"},
      {"sTitle": "Website"}
    ]
  });
  pluginTableLoaded = true;
  
}