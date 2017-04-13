var express = require('express');
var router = express.Router();
var JsonFileTools =  require('../models/jsonFileTools.js');
var ListDbTools = require('../models/listDbTools.js');
var moment = require('moment');
var typepPath = './public/data/test.json';
var hour = 60*60*1000;


router.route('/lists')

	// get all the bears (accessed at GET http://localhost:8080/api/bears)
	.get(function(req, res) {
		var name    = req.query.name;
		var type    = req.query.type;
		var flag    = req.query.flag;
		var json    = {type:req.query.type};
		var now = new Date().getTime();

		var typeObj = JsonFileTools.getJsonFromFile(typepPath);
		if(typeObj){
			typeObj[flag] = type;
			JsonFileTools.saveJsonToFile(typepPath,typeObj);
		}
		
		ListDbTools.findByFlagName(flag,'finalist',function(err,json){
			if (err)
				return res.send(err);
			var flag = json.flag;
			var lists = json.lists;
			if(lists.length>0 ){
				if(type){
					var finalList = lists[0]['list'][type];
				}else{
					var finalList = lists[0]['list'];
				}

				if(finalList === undefined ){
					finalList = null;
				}else{
					var overtime = 1;
					if(type==='pir'){
						overtime = 6;
					} else if(type==='flood'){
						overtime = 8;
					}
					console.log('finalList :'+JSON.stringify(finalList));

					var keys = Object.keys(finalList);

					for(var i=0;i<keys.length ;i++){
						//console.log(i+' timestamp : '+ finalList[keys[i]].timestamp);
						//console.log(i+' result : '+ ((now - finalList[keys[i]].timestamp)/hour));
						finalList[keys[i]].overtime = true;
						if( ((now - finalList[keys[i]].timestamp)/hour) < overtime )  {
							finalList[keys[i]].overtime = false;
						}
					}
				}
				return res.json({flag:flag,lists:finalList});

			}else{
				return res.json({});
			}

		});
	});

module.exports = router;