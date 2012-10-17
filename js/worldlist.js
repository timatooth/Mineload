var worldTableLoaded = false;
function loadWorldTable(worlds) {
  //make this only load once.
  //if(worldTableLoaded){return;}
  
  $('#world_table').html( '<table cellpadding="0" cellspacing="0" border="0" class="display" id="worldtable"></table>' );
  
  $('#worldtable').dataTable( {
    "aaData": worlds,
    "aoColumns": [
      {"sTitle": "World Name" },
      {"sTitle": "Players" },
      {"sTitle": "Entities"},
      {"sTitle": "Time"},
      {"sTitle": "Type"},
      {"sTitle": "Difficulty"}
    ]
  });
  worldTableLoaded = true;
  
}