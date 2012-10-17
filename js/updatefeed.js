google.load("feeds", "1");

function feedLoaded(result) {
  if (!result.error) {
    var container = document.getElementById("feedcontent");
    container.innerHTML = '';

    for (var i = 0; i < result.feed.entries.length; i++) {
      var entry = result.feed.entries[i];
      var div = document.createElement("div");
      div.innerHTML = "<h4>"+entry.title+"</h4>" + entry.content;

      container.appendChild(div);
    }
  }
}

function OnLoad() {
  var feed = new google.feeds.Feed("http://mineloadplugin.blogspot.com/feeds/posts/default?alt=rss");

  feed.includeHistoricalEntries(); 
  feed.setNumEntries(2);
  
  feed.load(feedLoaded);
}

google.setOnLoadCallback(OnLoad);