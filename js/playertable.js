//load the players in a google table
$(document).ready(function() {
    $('.ico4').click(function() {
        json.call("getPlayers", null, function(res) {
            //json response callback
            var response = res.success;
            console.log(response);
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'Name');
            data.addColumn('number', 'Health');
            data.addColumn('number', 'Food');
            data.addColumn('string', 'IP');
            data.addColumn('number', 'Level');
            data.addColumn('boolean', "Op");
            data.addColumn('boolean', "Whitelisted");
            data.addColumn('string', "Location");
            
            for(var i = 0; i < response.length; i++){
                var player = response[i];
                var world = player.worldInfo.name;
                var loc = player.location;
                data.addRows([
                    [player.name,
                        player.health,
                        player.foodLevel,
                        player.ip,
                        player.level,
                        player.op,
                        player.whitelisted,
                        world+", "+Math.round(loc.x)+", "+Math.round(loc.y)+", "+Math.round(loc.z)
                    ]
                ]);
            }

            var table = new google.visualization.Table(document.getElementById('player_table'));
            table.draw(data, {showRowNumber: false});
        });

    });
});