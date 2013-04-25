$(document).ready(function() {
    //when the click the inventory browser tab
    $('.ico3').click(function() {
        //add the online player names first.
        json.call("getPlayerNames", null, function(res) {
            var result = res.success;
            $('#inventory_player_list').empty();
            for (var i = 0; i < result.length; i++) {
                $('#inventory_player_list').append("<option>" + result[i] + "</option");
            }
            //need to add offline player names as well with another call
            json.call("getOfflinePlayerNames", null, function(res2) {
                var result2 = res2.success;
                for (var i = 0; i < result2.length; i++) {
                    $('#inventory_player_list').append("<option>" + result2[i] + "</option");
                }
                //try call the "selection box changed event" to load the inventory.
                $('#inventory_player_list').change();
            });
        });

    });

    //switched player in the option list
    $('#inventory_player_list').change(function() {
        var choice = $('#inventory_player_list option:selected').text();
        json.call("getPlayer", [choice], function(res) {
            var ic = $('#inventorys_div').append("<div>");
            ic.attr("class", "inventory_container");
            //var ic = $('.inventory_container');
            ic.empty();
            var data = res.success;
            var inventory = data.inventory.inventory;
            console.log(inventory);
            for (var i = 0; i < 36; i++) {
                if (inventory[i] !== null) {
                    //the slot contains an item. create a div and place it.
                    var itemElement = document.createElement("div");
                    var item = $(itemElement);
                    item.attr("class", "item");
                    item.attr("class", item.attr("class") + " sprites");
                    item.attr("class", item.attr("class") + " items-3-" + inventory[i].type + "-0");
                    item.attr("id", "item-" + i);
                    item.html("<p>" + inventory[i].amount + "</p>");
                    item.css("top", getY(i));
                    item.css("left", getX(i));
                    ic.append(item);
                }
            }
            //add meta container
            var metaElement = document.createElement("div");
            var meta = $(metaElement);
            meta.html("<p>" + data.name + "'s Inventory</p>");
            meta.attr("class", "inventory_container_meta");
            meta.attr("id", "inventory_container_meta-" + $(this).text());
            //add Chest for player link
            meta.append("<p><a href=\"#\">Chest Lookup</a></p>");
            meta.attr("playername", data.name);
            $(meta).click(function() {
                var playername = $(this).attr("playername");
                //alert(playername);
                getChestContents(playername);
            });

            $(ic).append(meta);
        });
    });


    //TODO this function is a BIG ask on the client and server for > 100 players.
    //might implement a *update the page as you scroll* like facebooks news feed.
    $('#inventory_page_button').click(function() {
        var players = $('#inventory_player_list');
        //for each item in the player list
        players.find("option").each(function() {
            $('#inventory_status').text("Loading " + $(this).text());
            json.call("getPlayer", [$(this).text()], function(res) {
                var data = res.success;
                var inven = data.inventory.inventory;
                var newContainerElement = document.createElement("div");
                var newContainer = $(newContainerElement);
                $(newContainer).attr("class", "inventory_container");
                $(newContainer).attr("id", $(this).text());
                //add meta container
                var metaElement = document.createElement("div");
                var meta = $(metaElement);
                meta.html("<p>" + data.name + "</p>");
                meta.attr("class", "inventory_container_meta");
                meta.attr("id", "inventory_container_meta-" + $(this).text());
                //add Chest for player link
                meta.append("<p><a class=\"chest_button\" href=\"#\">Chest Lookup</a></p>");
                meta.attr("playername", data.name);
                $(meta).click(function() {
                    var playername = $(this).attr("playername");
                    //alert(playername);
                    getChestContents(playername);
                });

                newContainer.append(meta);
                $('#inventorys_div').append(newContainer);

                for (var i = 0; i < 36; i++) {
                    if (inven[i] !== null) {
                        var itemElement = document.createElement("div");
                        var item = $(itemElement);
                        item.attr("class", "item");
                        item.attr("class", item.attr("class") + " sprites");
                        item.attr("class", item.attr("class") + " items-3-" + inven[i].type + "-0");
                        item.attr("id", "item-" + $(this).text() + "-" + i);
                        item.html("<p>" + inven[i].amount + "</p>");
                        item.css("top", getY(i));
                        item.css("left", getX(i));
                        newContainer.append(item);
                    }
                }
                $('#inventory_status').text("Done loading inventory");
            }); //end of "got the players inventory" callback


        }); //end of each player iteration


    }); //end of "they clicked the whole page" callback

    var getChestContents = function(choice) {
        json.call("mineload.getPlayerLWCChests", [choice], function(res) {
            //now spit up the nasty comman delimited code response
            var response = res.success;
            for (var c = 0; c < response.length; c++) {
                var delimited = response[c].split(",");
                var world = delimited[0];
                var x = delimited[1];
                var y = delimited[2];
                var z = delimited[3];

                //now we have enough info to get the exact chest contents.
                json.call("world.getChestContents", [world, x, y, z], function(res) {
                    //now have the chest contnts
                    var chest = res.success;
                    var newContainerElement = document.createElement("div");
                    var newContainer = $(newContainerElement);
                    $(newContainer).attr("class", "chest_container");
                    $(newContainer).attr("id", "chest-" + world + "-" + x + "-" + y + "-" + z);

                    for (var i = 0; i < chest.length; i++) {
                        if (chest[i] !== null) {
                            var itemElement = document.createElement("div");
                            var item = $(itemElement);
                            item.attr("class", "item");
                            item.attr("class", item.attr("class") + " sprites");
                            item.attr("class", item.attr("class") + " items-3-" + chest[i].type + "-0");
                            item.html("<p>" + chest[i].amount + "</p>");
                            item.css("top", getChestY(i));
                            item.css("left", getChestX(i));
                            newContainer.append(item);
                        }
                    }//end one chest for loop

                    //and the new chest_container
                    $('#inventorys_div').append(newContainer);

                }); //end of get chest contents callback

            } // end of the players Each chest they own loop


        }); //end of get chests for [player] callback
    };
    
    //free up the dom where all the inventories are placed.
    $('#inventorys_clear').click(function() {
        $('#inventorys_div').empty();
    });

}); //end of document.ready callback

/**
 * returns the css "top" value to position each item
 * @param slot - what slot slot to locate
 */
function getY(slot) {
    if (slot >= 0 && slot <= 8) {
        return 280;
    }
    else if (slot >= 9 && slot <= 17) {
        return 165;//235;
    }
    else if (slot >= 17 && slot <= 26) {
        return 195 + 5;
    }
    else if (slot >= 26 && slot <= 36) {
        return 235;//165;
    }
    else {
        return -30; //something is wrong place it randomly
    }
}

/**
 * returns the css "left" value to position each item
 * @param slot - what slot slot to locate
 */
function getX(slot) {
    var initialBorder = 12;
    var inlineBorder = 4;
    if (slot % 9 == 0) {
        return initialBorder;
    }
    else {
        return initialBorder + ((slot % 9) * inlineBorder) + ((slot % 9) * 32);
    }
}

function getChestY(slot) {
    if (slot >= 0 && slot <= 8) {
        return 30;
    }
    else if (slot >= 9 && slot <= 17) {
        return 68;//235;
    }
    else if (slot >= 17 && slot <= 26) {
        return 98 + 5;
    }
    else if (slot >= 26 && slot <= 36) {
        return 138;//165;
    }
    else if (slot >= 36 && slot <= 45) {
        return 176;//165;
    }
    else if (slot >= 45 && slot <= 54) {
        return 210;//165;
    }
    else {
        return -30; //something is wrong place it randomly
    }
}

/**
 * returns the css "left" value to position each item
 * @param slot - what slot slot to locate
 */
function getChestX(slot) {
    var initialBorder = 12;
    var inlineBorder = 4;
    if (slot % 9 == 0) {
        return initialBorder;
    }
    else {
        return initialBorder + ((slot % 9) * inlineBorder) + ((slot % 9) * 32) - 1;
    }
}

function random(max, min) {
    return Math.round(Math.random() * (max - min) + min);
}



