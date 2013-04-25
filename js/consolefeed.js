/**
 * 
 * This file manages everything to do with the server console viewer
 * and command sender.
 */
var authed = false;
var startDate, start_time;
var socket;
var consolemessages = 0;

function startSocket() {
    var startDate = new Date();
    var start_time = startDate.getTime();
    $('#command_field').removeAttr("disabled");
    $('#send_command_button').removeAttr("disabled");
    authed = false;
    var address = "ws://" + json.host + ":" + (Number(json.port) + 2) + "/";
    alertify.log("Connecting to " + address);
    socket = new WebSocket(address);

    socket.onopen = function() {
        alertify.log("Console socket Connected! Authenticating...");
        var key = json.sha256(json.username + "console" + json.password + json.salt);
        socket.send("/api/subscribe?source=console&key=" + key);
    };

    socket.onerror = function(ohno) {
        alertify.log("WebSocketError" + ohno);
    };

    socket.onclose = function() {
        alertify.error("Console WebSocket closed");
        alertify.confirm("Mineload server console WebSocket conection closed. Try reconnect now? ", function(e) {

            if (e) {
                alertify.log("Atemmpting to reconnect...");
                startSocket();
            }
        });
    };

    socket.onmessage = function(message) {
        consolemessages++;
        var response = message.data;

        var jsonreply = JSON.parse(response);
        var scroll = $('#consoleframe').contents().scrollTop();
        var newline = jsonreply.success.line;
        if (!authed) {
            $('#command_field').removeAttr("disabled");
            $('#send_command_button').removeAttr("disabled");
            var endDate = new Date();
            var end_time = endDate.getTime();
            alertify.success("Got response! (" + (end_time - start_time) + "ms)");
            authed = true;
            $('#command_field').focus();
        }

        //parse the string for color symbols, adding html entities first for safety.
        newline = (ansiParse(safe_tags(newline)));
        //find the contents of the frame and add the line to the (already existing) pre
        $('#consoleframe').contents().find("pre").append(newline);
        //keep the console scrolled down.
        $('#consoleframe').contents().scrollTop(scroll + 1000);
        $('#consolmessages_num').text(consolemessages);
    };

    /**
     * close the socket correctly before window closes
     */
    window.onbeforeunload = function() {
        socket.onclose = function() {
        }; // disable onclose handler first
        socket.close();
    };
}

/**
 * Parse basic ANSI formatted text and convert it to 
 * colored span elements.
 * 
 * E.g "[0;32;1mMineload"
 * ... "<span style="color: #0F0">Mineload</span>" (green)
 * 
 * @param string - ansi encoded input input as string
 * @returns String of correctly colored spans with escape codes removed.
 */
function ansiParse(string) {
    var result = "<span>" + string;
    result = result.replace(/\[0;30;1m/g, "</span><span style=\"color: #CCC; font-weight: bold\">").
            replace(/\[0;31;1m/g, "</span><span style=\"color: #F00; font-weight: bold\">").
            replace(/\[0;32;1m/g, "</span><span style=\"color: #0F0; font-weight: bold\">").
            replace(/\[0;33;1m/g, "</span><span style=\"color: #EE0; font-weight: bold\">").
            replace(/\[0;34;1m/g, "</span><span style=\"color: #00F; font-weight: bold\">").
            replace(/\[0;35;1m/g, "</span><span style=\"color: #FF00FF\">").
            replace(/\[0;36;1m/g, "</span><span style=\"color: #00EEEE; font-weight: bold\">").
            replace(/\[0;37;1m/g, "</span><span style=\"color: #EEE; font-weight: bold\">").
            replace(/\[0;30;22m/g, "</span><span style=\"color: #CCC\">").
            replace(/\[0;31;22m/g, "</span><span style=\"color: #C00\">").
            replace(/\[0;32;22m/g, "</span><span style=\"color: #0C0\">").
            replace(/\[0;33;22m/g, "</span><span style=\"color: #CC0\">").
            replace(/\[0;34;22m/g, "</span><span style=\"color: #00C\">").
            replace(/\[0;35;22m/g, "</span><span style=\"color: #FF00FF\">").
            replace(/\[0;36;22m/g, "</span><span style=\"color: #00CCCC\">").
            replace(/\[0;37;22m/g, "</span><span style=\"color: #EEE\">").
            replace(/\[21m/g, "<span style=\"font-weight:bold;\">").
            replace(/\[4m/g, "<span style=\"text-decoration:underline;\">").
            replace(/\[9m/g, "<span style=\"text-decoration:line-through;\">").
            replace(/\[5m/g, "<span style=\"text-decoration:blink;\">").
            replace(/\[3m/g, "<span style=\"font-style:italic;\">").
            replace(/\[WARNING]/g, "<span style=\"color:#cc6600\">[WARNING]</span>").
            replace(/\[SEVERE]/g, "<span style=\"color:#F00;font-weight:bold;\">[SEVERE]</span>").
            replace(/\[m/g, "</span>");
    return result;
}

/**
 * Adds html entities for parsing
 * @param str input string to be escaped
 * @returns string of escaped tags.
 */
function safe_tags(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/**
 * User has hit the enter key on a command. send the command to the server
 * 
 */
$('#command_field').bind("hitEnterKey", function(e) {
    //disable inputs while pending operation
    $('#command_field').attr("disabled", "disabled");
    $('#send_command_button').attr("disabled", "disabled");
    json.call("runConsoleCommand", [$('#command_field').val()], function(res) {
        //callback
        $('#command_field').val("");
        $('#command_field').removeAttr("disabled");
        $('#send_command_button').removeAttr("disabled");

    });
});

$('#command_field').keyup(function(e) {
    if (e.keyCode === 13) {
        $(this).trigger("hitEnterKey");
    }
});

$('#send_command_button').click(function() {
    $('#command_field').trigger("hitEnterKey");
});

$('#clearconsoleframebutton').click(function() {
    $('#consoleframe').contents().find("pre").empty();
    consolemessages = 0;
    $('#consolmessages_num').text(consolemessages);
});

$(document).ready(function() {
    $('.ico6').click(function() {
        if (!authed) {
            startSocket();
        }
    });

});
