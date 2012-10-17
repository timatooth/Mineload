var playerTableLoaded = false;
var dataTable = null;
function loadPlayerTable(players) {
  
  
  $('#player_table').html( '<table cellpadding="0" cellspacing="0" border="0" class="display" id="playertable"></table>' );
  dataTable = $('#playertable').dataTable( {
    "aaData": players,
    "aoColumns": [
      { "sTitle": "Player" },
      { "sTitle": "IP" },
      { "sTitle": "XYZ" },
      { "sTitle": "World"},
      { "sTitle": "Health" },
      { "sTitle": "Gamemode"},
      { "sTitle": "Can Fly"},
      { "sTitle": "Op"},
      { "sTitle": "In Hand"}
    ]
  });
  playerTableLoaded = true;
}