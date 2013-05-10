/**
 * The inventory manager script.
 * much needs to be done still to improve the performance on servers
 * with large amounts of players. Or players with lots of chests.
 * The UI needs a lot of work to make it more intuiative.
 * 
 */

/* Keep track of whether user has clicked the inventory tab
 * which triggers the player list box to load.
 */
var player_inventory_list_loaded = false;

/*
 * set up callbacks for elements.
 */
$(document).ready(function() {
    //when the click the inventory browser tab
    $('.ico3').click(function() {
        if (!player_inventory_list_loaded) {
            $('#inventory_status').text("Loading player list...");
            //online players first
            json.call("getPlayerNames", null, function(res) {
                var result = res.success;
                $('#inventory_player_list').empty();
                for (var i = 0; i < result.length; i++) {
                    $('#inventory_player_list').append("<option>" + result[i] + "</option");
                }
                //need to add offline player names as well with another jsonapi call
                json.call("getOfflinePlayerNames", null, function(res2) {
                    var result2 = res2.success;
                    for (var i = 0; i < result2.length; i++) {
                        $('#inventory_player_list').append("<option>" + result2[i] + "</option");
                    }
                    $('#inventory_status').text("Done player list.");
                    player_inventory_list_loaded = true;
                    //try call the "selection box changed event" to load the inventory.
                    $('#inventory_player_list').change();
                });
            });
        }
    });

    /*
     * User switched player in the option list. Load a new inventory
     * container and attach it to the #inventorys_div
     */
    $('#inventory_player_list').change(function() {
        var choice = $('#inventory_player_list option:selected').text();
        $('#inventory_status').text("Getting player data for " + choice + "...");
        json.call("getPlayer", [choice], function(res) {
            var newInventoryContainer = document.createElement("div");
            $('#inventorys_div').append(newInventoryContainer);
            $(newInventoryContainer).attr("class", "inventory_container");
            var data = res.success;
            /* Inventory contents */
            var inventory = data.inventory.inventory;
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
                    $(newInventoryContainer).append(item);
                }
            }

            /*Armor contents */
            var armor = data.inventory.armor;
            addArmorItem(armor.helmet, newInventoryContainer, "helmet");
            addArmorItem(armor.chestplate, newInventoryContainer, "chestplate");
            addArmorItem(armor.leggings, newInventoryContainer, "leggings");
            addArmorItem(armor.boots, newInventoryContainer, "boots");

            $('#inventory_status').text("Done loading " + choice + "'s inventory.");
            //add meta container
            var metaElement = document.createElement("div");
            var meta = $(metaElement);
            meta.html("<p>" + data.name + "'s Inventory</p>");
            meta.attr("class", "inventory_container_meta");
            meta.attr("id", "inventory_container_meta-" + $(this).text());
            //add Chest for player link
            var chestbutton = document.createElement("button");
            $(chestbutton).text("Chest Lookup");
            $(meta).append(chestbutton);
            $(chestbutton).attr("playername", data.name);
            $(chestbutton).click(function() {
                var playername = $(this).attr("playername");
                getChestContents(playername);
            });
            
            var avatarElement = document.createElement("div");
            var avatar = $(avatarElement);
            $(avatar).attr("class", "minecraft_avatar");
            //credit to https://github.com/ion1/minecraft-avatars
            $(avatar).minecraftAvatar({player: data.name});
            
            $(newInventoryContainer).append(avatar);
            $(newInventoryContainer).append(meta);
        });
    });

    /**
     * Get the chests for a player and render them.
     * Chest containers get attached to the #inventorys_div
     * @param {String} playername to lookup
     * @returns void
     */
    var getChestContents = function(playername) {
        var queue = [];
        json.call("mineload.getPlayerLWCChests", [playername], function(res) {
            //now spit up the nasty comma delimited code response
            //should be a json object.
            var response = res.success;
            for (var c = 0; c < response.length; c++) {
                var delimited = response[c].split(",");
                var world = delimited[0];
                var x = delimited[1];
                var y = delimited[2];
                var z = delimited[3];
                console.log("Looking up " + world + " " + x + " " + y + " " + z);

                queue.push({world: world, x: x, y: y, z: z});
                //console.log(queue);
                //now we have enough info to get the exact chest contents.
                json.call("world.getChestContents", [world, x, y, z], function(res) {
                    //console.log(playername +"'s Chest at: ("+world+" - "+x+", "+y+", "+z+")");
                    //now have the chest contnts
                    var chest = res.success;
                    //console.log(res);
                    //get the chest from the queue.
                    var co = queue.shift();
                    console.log(co);
                    //console.log(queue.length);
                    //the chest will be null if it doesn't exist in the world.
                    if (chest === null) {
                        console.log("Contents of " + co.world + ": " + co.x + ", " + co.y + ", " + co.z + " are null. returning");
                        return;
                    } else {
                        console.log("Contents of " + co.world + ": " + co.x + ", " + co.y + ", " + co.z + " NOT NULL");
                    }


                    var newContainerElement = document.createElement("div");
                    var newContainer = $(newContainerElement);
                    $(newContainer).attr("class", "chest_container");
                    $(newContainer).attr("id", "chest-" + co.world + "-" + co.x + "-" + co.y + "-" + co.z);

                    //add chest meta data, owner, xyz etc
                    var chestMeta = document.createElement("div");
                    $(chestMeta).attr("class", "chest_container_meta");
                    $(newContainer).append(chestMeta);
                    $(chestMeta).text(playername + "'s Chest at: (" + co.world + ": " + co.x + ", " + co.y + ", " + co.z + ")");


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
    if (slot % 9 === 0) {
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
    if (slot % 9 === 0) {
        return initialBorder;
    }
    else {
        return initialBorder + ((slot % 9) * inlineBorder) + ((slot % 9) * 32) - 1;
    }
}

function random(max, min) {
    return Math.round(Math.random() * (max - min) + min);
}

function addArmorItem(id, container, loc) {
    /*locations for positioning items */
    var armorLocs = {
        left: 12,
        helmet: 14,
        chestplate: 47,
        leggings: 83,
        boots: 118
    };
    var itemElement = document.createElement("div");
    var item = $(itemElement);
    item.attr("class", "item");
    item.attr("class", item.attr("class") + " sprites");
    item.attr("class", item.attr("class") + " items-3-" + id.type + "-0");
    item.css("top", armorLocs[loc]);
    item.css("left", armorLocs.left);
    $(container).append(item);
}



