/**
 * The permission node editor
 */
var containsVault = false;

$(document).ready(function() {
    $('.ico5').click(function() {
        $('#user-permissions-select').empty();
        //check to see if the server has vault installed
        if (!containsVault) {
            json.call("getPlugin", ["Vault"], function(res) {
                if (res.success !== null) {
                    containsVault = true;
                    initPermissions();
                } else {
                    alertify.error("Server doesn't appear to have Vault installed.");
                    alertify.log("Make sure you hava vault + vault compatible permissions system installed.");
                }
            });
        } else {
            //already clicked panel, got vault too.
            initPermissions();
        }
    });

    $('#user-permissions-select').change(function() {
        var playerchoice = $('#user-permissions-select option:selected').text();
        //empty the groups and user permissions boxes first.
        $('#permissions-nodes-select').empty();
        $('#group-permissions-select').empty();
        
        json.call("permissions.getPermissions", [playerchoice], function(res) {
            var perms = res.success;
            for (var i = 0; i < perms.length; i++) {
                var enabled = perms[i].value;
                var style = "";
                if (!enabled) {
                    style = "style=\"background-color: #200\"";
                }
                $('#permissions-nodes-select').append("<option " + style + ">" + perms[i].key + "</option>");
            }

        });

        json.call("permissions.getGroups", [playerchoice], function(res) {
            var playergroups = res.success;
            for(var i = 0; i < playergroups.length; i++){
                $('#group-permissions-select').append("<option>"+ playergroups[i] +"</option>");
            }
        });
    });
});

function initPermissions() {
    json.call("getPlayerNames", null, function(res) {
        if (res.result === "success") {
            console.log(res);
            var players = res.success;
            for (var i = 0; i < players.length; i++) {
                $('#user-permissions-select').append("<option>" + players[i] + "</option>");
            }
        } else {
            alertify.error("Error see JavaScript console for debugging.");
            console.log(res);
        }
    });
}

