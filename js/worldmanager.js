var json;
$(document).ready(function(){
  $.getJSON("jsonapi.php", null, function(options){
    json = new JSONAPI(options);
    
    json.call("getWorlds", null, function(req){
      var r = req.success;
      var worlddata = [];
      for(var i = 0; i < r.length; i++){
        var world = [r[i].name, r[i].environment, r[i].time];
        worlddata[i] = world;
      }
      $('#world_table').html( '<table cellpadding="0" cellspacing="0" border="0" class="display" id="world_data"></table>' );
      $('#world_data').dataTable({
        "aaData": worlddata,
        "aoColumns": [
        {
          "sTitle": "World Name"
        },
        {
          "sTitle": "Type"
        },
        {
          "sTitle": "Time"
        }
        ]
      });
    });
    
  });
});  