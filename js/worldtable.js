//load the world in a google table
$(document).ready(function() {
    $('.ico2').click(function() {
        json.call("getWorlds", null, function(res) {
            //json response callback
            var response = res.success;
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'Name');
            data.addColumn('string', 'Type');
            data.addColumn('boolean', 'Storm');
            data.addColumn('boolean', 'Is Thundering');
            data.addColumn('number', 'Time (Ticks)');
            data.addColumn('number', "Remaing Weather Ticks");
            
            for(var i = 0; i < response.length; i++){
                var world = response[i];
                data.addRows([
                    [world.name, world.environment, world.hasStorm, world.isThundering, world.time, world.remainingWeatherTicks]
                ]);
            }

            var table = new google.visualization.Table(document.getElementById('world_table'));
            table.draw(data, {showRowNumber: false});
        });

    });
});