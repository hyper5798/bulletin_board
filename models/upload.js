var request = require('request')
var settings = require('../settings');
var crypto = require('crypto');

function storeBoard(title, content, callback) {
    var url = settings.S5_url,
        time = new Date().getTime().toString();

    var api_token = get_ApiToken(time);
    
    request.post(url,{form:{title:title, content:content,api_key:settings.api_key,
                             api_token:api_token, time:time }},
        function(err, result) {
            if(err) {
                callback(err, null);
            }
            else {
                var value = JSON.parse(result.body).value
                if(value == undefined) {
                    callback(null, false)
                }
                else {
                    callback(null, value)
                }
            }
    });
}

function upload_check(title, content, callback) {
    var url = settings.S5_url,
        time = new Date().getTime().toString();

    var api_token = get_ApiToken(time);
    
    request.post(url,{form:{title:title, content:content,api_key:settings.api_key,
                             api_token:api_token, time:time }},
        function(err, result) {
            if(err) {
                callback(err, null);
            }
            else {
                var value = JSON.parse(result.body).value
                if(value == undefined) {
                    callback(null, false)
                }
                else {
                    callback(null, value)
                }
            }
    });
}

exports.input_check = input_check;

function get_ApiToken(time) {
    var shasum = crypto.createHash('sha1');
        // secret
        shasum.update(settings.api_secret);
        // time
        shasum.update(time);

    var digest = shasum.digest('hex');
    return digest;
}