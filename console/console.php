<script>
$(document).ready(function(){
        $(setInterval(function() {
        $('#consolebox').load('consoleData.php');
        }, 1000));
});
</script>
<script>
$(document).ready(function() {
	$('#consoleCommand').submit(function() {
		$.ajax({
			type: 'POST',
			url: 'consoleData.php',
			data: $('#consoleCommand').serialize(),
			success: function(data, textStatus, jqXHR) {
			},
			error: function(jqXHR, textStatus, errorThrown) {
				$('#consoleCommand').replaceWith('<div class="error">Error!</div>');
			}
		});
	return false;
	});
});
</script>

<style>
#submitCommand {
        width: 1207px;
        height: 30px;
        background-color: #999;
        border: 1px #000 solid;
}
#console {
	margin-left: 25px;
}
#consolebox {
        background-color: black;
        min-width: 550px;
        max-width: 1200px;
        border: 1px solid #000;
        width: 1200px;
        height: 670px;
        max-height: 720px;
        overflow-y: scroll;
        color: #00C919;
        padding: 3px;
        font-family: monospace;
}
</style>
<div id="console">
    <div id="consolebox">Loading...</div>
    
    
    <div id="submitCommand">
      <form id="consoleCommand" style="display:inline" method="POST" action="">
            <input type="text" name="consoleCommand" size="195" value="enter a command..." onClick="this.value=''"/>
      </form>
    </div>
</div>

