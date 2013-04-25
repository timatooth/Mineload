//load the plugins in a google table
$(document).ready(function() {
    $('.ico7').click(function() {
        json.call("getPlugins", null, function(res) {
            //json response callback
            var response = res.success;
            //console.log(response);
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'Name');
            data.addColumn('boolean', 'Enabled');
            data.addColumn('string', 'Version');
            data.addColumn('string', 'Description');
            data.addColumn('string', 'Authors');
            data.addColumn('string', "Website");

            //data.addRows([
                //['Mike', {v: 10000, f: '$10,000'}, true],
             //   ['MineloadPlugin', true, '0.0.5', 'Timatooth', 'timatooth.com']
            //]);
            
            for(var i = 0; i < response.length; i++){
                var plug = response[i];
                var authors = "";
                for(var j = 0; j < plug.authors.length; j++){
                    authors += plug.authors[j];
                    if(j < plug.authors.length - 1){
                        authors += ", ";
                    }
                }
                data.addRows([
                    [plug.name, plug.enabled, plug.version, plug.description, authors, plug.website]
                ]);
            }

            var table = new google.visualization.Table(document.getElementById('plugin_table'));
            table.draw(data, {showRowNumber: false});
        });

    });
});