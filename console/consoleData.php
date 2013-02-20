<?php
	$consoleCommand = $_POST['consoleCommand'];
	include '../jsonapi.php';
	require('json.php');
	$api = new JSONAPI($data['host'], $data['port'], $data['username'], $data['password'], $data['salt']);
	$consoleLog = $api->call("getLatestConsoleLogsWithLimit", array(150));
	$consoleLines = $consoleLog['success'];
	
	foreach ($consoleLines as $key => $lines) {
		$time_stamp = substr($lines['line'], 0, 19);
	
		//personal preference coloring
		$strip_line = str_replace('[INFO] ', '', $lines['line']);
		$strip_line = str_replace('[FINE] ', '', $strip_line);
		$strip_line = str_replace('[SEVERE]', '[<font color="#FF0000"><b>SEVERE</b></font>]<font color="#777">', $strip_line);
		$strip_line = str_replace('[WARNING]', '[<font color="#FF6600"><b>WARNING</b></font>]', $strip_line);
		$strip_line = str_replace('[CommandLog]', '[<font color="#CCFF00">CommandLog</font>] <font color="#33FF00">', $strip_line);
		$strip_line = str_replace('[WebAuction+]', '[<font color="#0066FF">WebAuction</font><font color="red">+</font>]<font color="#33FF00">', $strip_line);
		$strip_line = str_replace('[Buycraft]', '[<font color="#10C779"><b>Buycraft</b></font>]', $strip_line);
		$strip_line = str_replace('[mcMMO]', '[<font color="#3ED7C4"><b>mcMMO</b></font>]', $strip_line);
		$strip_line = str_replace('[glizer]', '[<font color="#32A01F"><b>Glizer</b></font>]', $strip_line);
		$strip_line = str_replace('[zPermissions]', '[<font color="#6CC6B8"><b>zPermissions</b></font>]', $strip_line);
		if(preg_match('/lost connection/i', $strip_line)) {
				$strip_line = '<font color="#FF6600">' .ltrim($strip_line, $time_stamp);
		}
		/////////////////////////////
	
		$strip_line = str_replace('[1;1m', '<b>', $strip_line);
		$strip_line = str_replace('[3m', '', $strip_line);
		$strip_line = str_replace('[4;1m', '<u>', $strip_line);
		$strip_line = str_replace('[9;1m', '<del>', $strip_line);
		$strip_line = str_replace('[21m', '<font color="#777">', $strip_line);
		$strip_line = str_replace('[22;1m', '</b>', $strip_line);
		$strip_line = str_replace('[23;1m', '</i>', $strip_line);
		$strip_line = str_replace('[24;1m', '</u>', $strip_line);
		$strip_line = str_replace('[29;1m', '</del>', $strip_line);
		$strip_line = str_replace('[30;1m', '<font color="#000000">', $strip_line);
		$strip_line = str_replace('[31;1m', '<font color="#FF0000">', $strip_line);
		$strip_line = str_replace('[32;1m', '<font color="#009900">', $strip_line);
		$strip_line = str_replace('[33;1m', '<font color="#FFFF00">', $strip_line);
		$strip_line = str_replace('[34;1m', '<font color="#0000FF">', $strip_line);
		$strip_line = str_replace('[35;1m', '<font color="#CC0099">', $strip_line);
		$strip_line = str_replace('[36;1m', '<font color="#0099FF">', $strip_line);
		$strip_line = str_replace('[37;1m', '<font color="#FFFFFF">', $strip_line);
		$strip_line = str_replace('[39;1m', '<font color="#FFFFFF">', $strip_line);
		$strip_line = str_replace('[33;22m', '<font color="#FF9900">', $strip_line);
		$strip_line = str_replace('[34;22m', '<font color="#000099">', $strip_line);
		$strip_line = str_replace('[36;22m', '<font color="#009999">', $strip_line);
		$strip_line = str_replace('[37;22m', '<font color="#777">', $strip_line);
		$strip_line = str_replace('[31;22m', '<font color="#FF0000">', $strip_line);
		$strip_line = str_replace('[0;39m', '', $strip_line);
		$strip_line = str_replace('[40;1m', '<font style="background-color: black;">', $strip_line);
		$strip_line = str_replace('[41;1m', '<font style="background-color: red;">', $strip_line);
		$strip_line = str_replace('[42;1m', '<font style="background-color: green;">', $strip_line);
		$strip_line = str_replace('[43;1m', '<font style="background-color: yellow;">', $strip_line);
		$strip_line = str_replace('[44;1m', '<font style="background-color: blue;">', $strip_line);
		$strip_line = str_replace('[45;1m', '<font style="background-color: magenta;">', $strip_line);
		$strip_line = str_replace('[46;1m', '<font style="background-color: cyan;">', $strip_line);
		$strip_line = str_replace('[47;1m', '<font style="background-color: white;">', $strip_line);
		$strip_line = str_replace('[40;1m', '<font style="background-color: black;">', $strip_line);
		$strip_line = str_replace('[0;1m', '</font>', $strip_line);
		if(!preg_match('/mcMMO/', $strip_line)) {
				$strip_line = str_replace('[m', '</font>', $strip_line);
		}
		$strip_line = ltrim($strip_line, $time_stamp);
	
		echo '</font><font color="#FFFFFF">' .date("<b>m/j/Y g:i:s a</b>", strtotime($time_stamp)). '| ' .trim($strip_line). '</font><br>';
	}

	if(isset($consoleCommand)) {
			$api->call('runConsoleCommand', array(trim($consoleCommand)));
	}
?>
