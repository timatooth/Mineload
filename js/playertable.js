//load the players in a google table
var player_table;
var data;
var rows_selected;
$(document).ready(function() {
    $('.ico4').click(function() {
        $(".player_operation_button").attr("disabled", "disabled");
        json.call("getPlayers", null, function(res) {
            //json response callback
            var response = res.success;
            data = new google.visualization.DataTable();
            data.addColumn('string', 'Name');
            data.addColumn('number', 'Health');
            data.addColumn('number', 'Food');
            data.addColumn('string', 'IP');
            data.addColumn('number', 'Level');
            data.addColumn('boolean', "Op");
            data.addColumn('boolean', "Whitelisted");
            data.addColumn('string', "Location");
            
            for (var i = 0; i < response.length; i++) {
                var player = response[i];
                var world = player.worldInfo.name;
                var loc = player.location;
                var ip = player.ip.replace(/\//, "").split(":")[0];

                data.addRows([
                    [player.name,
                        player.health,
                        player.foodLevel,
                        ip,
                        player.level,
                        player.op,
                        player.whitelisted,
                        world + ", " + Math.round(loc.x) + ", " + Math.round(loc.y) + ", " + Math.round(loc.z)
                    ]
                ]);
            }

            player_table = new google.visualization.Table(document.getElementById('player_table'));
            player_table.draw(data, {showRowNumber: false});
            google.visualization.events.addListener(player_table, 'select', selectHandler);

            function selectHandler(e) {
                rows_selected = player_table.getSelection();
                if (rows_selected.length > 0) {
                    $(".player_operation_button").removeAttr("disabled");
                } else {
                    $(".player_operation_button").attr("disabled", "disabled");
                }
                $('#selected_players').empty();
                for (var i = 0; i < rows_selected.length; i++) {
                    var playername = data.getValue(rows_selected[i].row, 0);
                    //update the UL for displaying
                    var nameElement = document.createElement("li");
                    $(nameElement).text(playername);
                    $('#selected_players').append(nameElement);

                }
            }
        });
        
    });

    $(".player_operation_button").click(function() {
        var c = $(this).text();
        if (c === "Kick") {
            alertify.confirm("Are you sure you want to kick selected player(s)?", function(e) {
                if (e) {
                    for (var i = 0; i < rows_selected.length; i++) {
                        var playername = data.getValue(rows_selected[i].row, 0);
                        alertify.log("Kicking: " + playername);
                        json.call("kickPlayer", [playername, "Kicked via MineloadPlugin"], function(res) {
                            $('#selected_players').empty();
                            $('.ico4').click(); //refresh the table
                        });
                    }
                }
            });
        } else if (c === "Ban") {
            alertify.confirm("Are you sure you want to BAN selected player(s)?", function(e) {
                if (e) {
                    for (var i = 0; i < rows_selected.length; i++) {
                        var playername = data.getValue(rows_selected[i].row, 0);
                        alertify.log("Banning: " + playername);
                        
                        json.call("ban", [playername], function(res) {
                            $('#selected_players').empty();
                            $('.ico4').click(); //refresh the table
                        });
                    }
                }
            });
        } else if (c === "IP Ban") {
            alertify.confirm("Are you sure you want to <strong>IPBAN</strong> selected player(s)?", function(e) {
                if (e) {
                    for (var i = 0; i < rows_selected.length; i++) {
                        var ip = data.getValue(rows_selected[i].row, 3);
                        alertify.log("Banning IP: " + ip);
                        
                        json.call("banIP", [ip], function(res) {
                            alertify.error("JSONAPI banIP(ip) method appears to be broken.");
                            $('#selected_players').empty();
                            $('.ico4').click(); //refresh the table
                        });
                    }
                }
            });
        } else if (c === "Toggle Whitelist") {
            alertify.log("Uncaught LazyProgrammerException was thrown. Sorry.");
        } else if (c === "Toggle OP") {
            alertify.log("Uncaught LazyProgrammerException was thrown. Sorry.");
        }



    });
});//end of document.ready