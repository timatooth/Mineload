/**
 * Fetches the current settings and fills in the fields.
 * Sends new settings to the PHP file to be written.
 * 
 */

$(document).ready(function() {
    $('.ico8').click(function() {
        loadSettingsData();
    });

    $('#save_settings').click(function() {
        var settings = {
            mc_host: $('#mc_host').val(),
            mc_port: $('#mc_port').val(),
            mlp_host: $('#mlp_host').val(),
            mlp_port: $('#mlp_port').val(),
            mlp_password: $('#mlp_password').val(),
            jsonapi_host: $('#jsonapi_host').val(),
            jsonapi_port: $('#jsonapi_port').val(),
            jsonapi_username: $('#jsonapi_username').val(),
            jsonapi_password: $('#jsonapi_password').val(),
            jsonapi_salt: $('#jsonapi_salt').val(),
            mlw_username: $('#mlw_username').val(),
            mlw_password: $('#mlw_password').val()
        };

        $.post("config/configloader.php", settings, function(data, status) {
            if (status === "success") {
                var response = JSON.parse(data);
                if (response.success) {
                    $('#settings_status').html("Settings saved. Please log out/in for them to take effect.");
                    $('#settings_status').css('color', '#0a0');
                } else {
                    $('#settings_status').html(response.status);
                }
            } else {
                $('#settings_status').html("Sending settings failed: " + status);
            }
        });
    });

});

function loadSettingsData() {
    $.getJSON("config/configloader.php", null, function(res) {
        $('#mc_host').val(res.mc_host);
        $('#mc_port').val(res.mc_port);
        $('#mlp_host').val(res.mlp_host);
        $('#mlp_port').val(res.mlp_port);
        $('#mlp_password').val(res.mlp_password);
        $('#jsonapi_host').val(res.jsonapi_host);
        $('#jsonapi_port').val(res.jsonapi_port);
        $('#jsonapi_username').val(res.jsonapi_username);
        $('#jsonapi_password').val(res.jsonapi_password);
        $('#jsonapi_salt').val(res.jsonapi_salt);
        $('#mlw_username').val(res.mlw_username);
        $('#mlw_password').val(res.mlw_password);
    });
}
