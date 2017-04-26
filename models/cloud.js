var request = require('request')
var settings = require('../settings');
var crypto = require('crypto');
var moment = require('moment');


function store(title, content, callback) {
    
    var url = "https://s5-dropap.securepilot.com/tracker/v1/store_bulletin_board";
    var time = new Date().getTime().toString();
    
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

function search(date, index, limit,callback) {
    var url = S5_search_url,
        time = new Date().getTime().toString();
    var to = moment(date,"YYYY-MM-DD").toDate().getTime();
    var fromMoment = moment(date,"YYYY-MM-DD").subtract(7,'days');
    var from = fromMoment.toDate().getTime();
    var api_token = get_ApiToken(time);

    request.post(url,{form:{from:from, to:to, index:index, limit:limit,
                            api_key:settings.api_key,api_token:api_token, time:time }},
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

function del(id,callback) {
    var url = S5_search_url,
        time = new Date().getTime().toString();
    var to = moment(date,"YYYY-MM-DD").toDate().getTime();
    var fromMoment = moment(date,"YYYY-MM-DD").subtract(7,'days');
    var from = fromMoment.toDate().getTime();
    var api_token = get_ApiToken(time);

    request.post(url,{form:{id:id, api_key:settings.api_key,
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

exports.store = store;
exports.search = search;
exports.search = search;

function get_ApiToken(time) {
    
    var shasum = crypto.createHash('sha1');
        // secret
        shasum.update(api_secret);
        // time
        shasum.update(time);

    var digest = shasum.digest('hex');
    return digest;
}