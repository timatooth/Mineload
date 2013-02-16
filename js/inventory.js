var json;
var mock;
/**
 * Tests
 */
function item(type, qty){
  this.type = type;
  this.amount = qty;
}

function inv(){
  var items = [];
  //fill the inv with random items.
  for(var i = 0; i < 36; i++){
    items.push(new item(random(400,1), 64));
  }
  this.inventory = {
    inventory: items
    
  };
  
}
//end of development tests.

$(document).ready(function(){
  //when the click the inventory browser tab
  $('.ico3').click(function(){
    $.getJSON("jsonapi.php", null, function(options){
      json = new JSONAPI(options);
      json.call("getOfflinePlayerNames", null, function(res){
        var result = res.success;
        $('#inventory_player_list').empty();
        for(var i = 0; i < result.length; i++){
          $('#inventory_player_list').append("<option>" + result[i] + "</option");
        }
      });
    });
  });
  
  //switched player
  $('#inventory_player_list').change(function(){
    var choice = $('#inventory_player_list option:selected').text();
    json.call("getPlayer", [choice], function(res){
      var ic = $('.inventory_container');
      ic.empty();
      var data = res.success;
      var inventory = data.inventory.inventory;
      for (var i = 0; i < 36; i++ ){
        if(inventory[i] != null){
          
          var itemElement = document.createElement("div");
          var item = $(itemElement);
          item.attr("class", "item");
          item.attr("class", item.attr("class") + " sprites");
          item.attr("class", item.attr("class") + " items-3-"+inventory[i].type+"-0");
          item.attr("id", "item-"+i);
          item.html("<p>"+inventory[i].amount+"</p>");
          item.css("top", getY(i));
          //alert(getX(i));
          item.css("left", getX(i));
          ic.append(item);
        //$("#inventory_container").append("<p>Slot: "+i+" Type:" + inventory[i].type + " Qty: " + inventory[i].amount + "</p>");
        }
        else{
        //$("#inventory_container").append("<p>Slot: " + i + " is empty.");
        }
      }
    });
  });
    
  /**
   *Mock tests to fill inventory with random stuff
   */
  $('#mocktest').click(function(){
    mock = new inv();
    var inventory = mock.inventory.inventory;
    var ic = $('.inventory_container');
    ic.empty();
    for (var i = 0; i < 36; i++ ){
      if(inventory[i] != null){ 
        var itemElement = document.createElement("div");
        var item = $(itemElement);
        item.attr("class", "item");
        item.attr("class", item.attr("class") + " sprites");
        item.attr("class", item.attr("class") + " items-3-"+inventory[i].type+"-0");
        item.attr("id", "item-"+i);
        item.html("<p>"+inventory[i].amount+"</p>");
        item.css("top", getY(i));
        item.css("left", getX(i));
        ic.append(item);
      }
    }
  });
  
  //TODO this function is a BIG ask on the client and server for > 100 players.
  //might implement a *update the page as you scroll* like facebooks news feed.
  $('#inventory_page_button').click(function(){
    var players = $('#inventory_player_list');
    //for each item in the player list
    players.find("option").each(function(){
      $('#inventory_status').text("Loading " + $(this).text());
      json.call("getPlayer", [$(this).text()], function(res){
        var data = res.success;
        var inven = data.inventory.inventory;
        var newContainerElement = document.createElement("div");
        var newContainer = $(newContainerElement);
        $(newContainer).attr("class", "inventory_container");
        $(newContainer).attr("id", $(this).text());
        //add meta container
        var metaElement = document.createElement("div");
        var meta = $(metaElement);
        meta.html("<p>"+data.name+"'s Inventory</p>");
        meta.attr("class", "inventory_container_meta");
        meta.attr("id", "inventory_container_meta-"+$(this).text());
        newContainer.append(meta);
        $('#inventory_page').append(newContainer);
        //var mockInventory = new inv();
        
        for (var i = 0; i < 36; i++ ){
          if(inven[i] != null){ 
            var itemElement = document.createElement("div");
            var item = $(itemElement);
            item.attr("class", "item");
            item.attr("class", item.attr("class") + " sprites");
            item.attr("class", item.attr("class") + " items-3-"+inven[i].type+"-0");
            //alert(item.attr("class"));
            item.attr("id", "item-"+$(this).text()+"-"+i);
            item.html("<p>"+inven[i].amount+"</p>");
            item.css("top", getY(i));
            //alert(getX(i));
            item.css("left", getX(i));
            newContainer.append(item);
          }
        }
        $('#inventory_status').text("Done loading inventory");
      }); //end of "got the players inventory" callback
      
      
    }); //end of each player iteration
    
      
  }); //end of "they clicked the whole page" callback
  
  $('#inventory_chest_button').click(function(){
    var choice = $('#inventory_player_list option:selected').text();
    json.call("mineload.getLWCPlayerChests", [choice], function(res){
      //now spit up the nasty comman delimited code response
      var response = res.success;
      for(var c = 0; c < response.length; c++){
        var delimited = response[c].split(",");
        var world = delimited[0];
        var x = delimited[1];
        var y = delimited[2];
        var z = delimited[3];
      
        //now we have enough info to get the exact chest contents.
        json.call("world.getChestContents", [world, x, y, z], function(res){
          //now have the chest contnts
          var chest = res.success;
          var newContainerElement = document.createElement("div");
          var newContainer = $(newContainerElement);
          $(newContainer).attr("class", "chest_container");
          $(newContainer).attr("id", "chest-"+world+"-"+x+"-"+y+"-"+z);
        
          for(var i = 0; i < chest.length; i++){
            if(chest[i] != null){
              var itemElement = document.createElement("div");
              var item = $(itemElement);
              item.attr("class", "item");
              item.attr("class", item.attr("class") + " sprites");
              item.attr("class", item.attr("class") + " items-3-"+chest[i].type+"-0");
              item.html("<p>"+chest[i].amount+"</p>");
              item.css("top", getChestY(i));
              item.css("left", getChestX(i));
              newContainer.append(item);
            }
          }//end one chest for loop
          
          //and the new chest_container
          $('#inventory_page').append(newContainer);
          
        }); //end of get chest contents callback
        
      } // end of the players Each chest they own loop
      
      
    }); //end of get chests for [player] callback
    
  }); //end of chest click button callback
  
}); //end of document.ready callback

/**
 * returns the css "top" value to position each item
 * @param slot - what slot slot to locate
 */
function getY(slot){
  if(slot >= 0 && slot <=8){
    return 280;
  }
  else if (slot >= 9 && slot <= 17 ){
    return 165;//235;
  }
  else if (slot >= 17 && slot <= 26 ){
    return 195 + 5;
  }
  else if (slot >= 26 && slot <= 36 ){
    return 235;//165;
  }
  else{
    return -30; //something is wrong place it randomly
  }
}

/**
 * returns the css "left" value to position each item
 * @param slot - what slot slot to locate
 */
function getX(slot){
  var initialBorder = 12;
  var inlineBorder = 4;
  if(slot % 9 == 0){
    return initialBorder;
  }
  else {
    return initialBorder + ((slot % 9) * inlineBorder) + ((slot % 9) * 32);
  }
}

function getChestY(slot){
  if(slot >= 0 && slot <=8){
    return 30;
  }
  else if (slot >= 9 && slot <= 17 ){
    return 68;//235;
  }
  else if (slot >= 17 && slot <= 26 ){
    return 98 + 5;
  }
  else if (slot >= 26 && slot <= 36 ){
    return 138;//165;
  }
  else if (slot >= 36 && slot <= 45 ){
    return 176;//165;
  }
  else if (slot >= 45 && slot <= 54 ){
    return 210;//165;
  }
  else{
    return -30; //something is wrong place it randomly
  }
}

/**
 * returns the css "left" value to position each item
 * @param slot - what slot slot to locate
 */
function getChestX(slot){
  var initialBorder = 12;
  var inlineBorder = 4;
  if(slot % 9 == 0){
    return initialBorder;
  }
  else {
    return initialBorder + ((slot % 9) * inlineBorder) + ((slot % 9) * 32) - 1;
  }
}

function random(max, min){
  return Math.round(Math.random() * (max - min) + min);
}



