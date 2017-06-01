var express = require('express');
var router = express.Router();
var ListDbTools = require('../models/listDbTools.js');
var User =  require('../models/user.js');
var Review =  require('../models/review.js');
var Cloud =  require('../models/cloud.js');
var settings = require('../settings');
var JsonFileTools =  require('../models/jsonFileTools.js');
var path = './public/data/areaList.json';
var hour = 60*60*1000;
var type = 'gps';
var citys = settings.citys;//All of citys

module.exports = function(app) {
  
  app.get('/', function (req, res) {
	  if(req.session.user){
		  console.log('$$$$ user is login')
	  }
	  var user = req.session.user;
	  res.render('index', { title: 'Index',
			user:user
		});
  });

  app.get('/board', function (req, res) {
      
	  var error = true;
	  var user = req.session.user;
	  var city = '新竹市';
	  var list=null;area = [],town=[];
	  var areaList = JsonFileTools.getJsonFromFile(path);//All of citys data list
	  var keys = Object.keys(areaList);//All of citys with data
	  console.log("areaList :"+JSON.stringify(areaList));
	  if(user && user.enable && user.level !== 3){
		    error = false;
			city = user.city;
			if(city==='無'){
				city = keys[0];
			}
			list = areaList[city];
			if(list === null || list === undefined){
				list = areaList[keys[0]];
			}
			for(var i=0;i<list.length;i++){
				//console.log('town:'+Object.keys(list[i])[0]);
				area.push(Object.keys(list[i])[0]);
				//
				if(i===0){
					//town list of first town
					town = list[i][Object.keys(list[i])[0]];
				}
			}
			console.log(':'+JSON.stringify(area));
			console.log('town:'+JSON.stringify(town));
	  }
	  
	  res.render('board', { title: 'Board',
			user:req.session.user,
			citys : citys,
			city : city,
			area:area,
			town: town,
			areaList: areaList,
			error
	  });
  });

  app.post('/board', function (req, res) {
  	var city = req.body.mCity;
  	var	area = req.body.mArea;
	var	town = req.body.mTown;
	var	title = req.body.mTitle;
	var	content = req.body.mContent;
	var	account = req.body.mAccount;
	var	name = req.body.mName;
  	console.log('Debug board post -> city:'+city);
	console.log('Debug login post -> area:'+area);
	console.log('Debug board post -> town:'+town);
	console.log('Debug login post -> title:'+title);
	console.log('Debug login post -> content:'+content);
	console.log('Debug login post -> account:'+account);
	console.log('Debug login post -> name:'+name);

	Review.saveData(city,area,town,title,content,account,name,function(err,result){
		if(err){
			console.log('Debug board Review.saveData -> err:'+err);
		}
		return res.redirect('/board');
	});
	
  });

  app.get('/login', function (req, res) {
	req.session.user = null;
  	var account = req.flash('post_account').toString();
	var successMessae,errorMessae;
	console.log('Debug register get -> account:'+ account);

	if(account ==''){
		errorMessae = '';
		res.render('user/login', { title: 'Login',
			account:account,
			password:password,
			error: errorMessae
		});
	}else{
		var password = req.flash('post_password').toString();

		console.log('Debug register get -> password:'+ password);
		User.findUserByAccount(account,function(err,user){
			if(err){
				errorMessae = err;
				res.render('user/login', { title: 'Login',
					account:account,
					password:password,
					error: errorMessae
				});
			}
			if(user == null ){
				//login fail
				errorMessae = '帳號未註冊!';
				res.render('user/login', { title: 'Login',
					account:null,
					password:password,
					error: errorMessae
				});
			}else{
				//login success
				if(password == user.password){
					req.session.user = user;
					return res.redirect('/');
				}else{
					//login fail
					errorMessae = '密碼不正確!';
					res.render('user/login', { title: 'Login',
						account:account,
						password:null,
						error: errorMessae
					});
				}
			}
		});
	}
  });

  app.post('/login', function (req, res) {
  	var post_account = req.body.account;
  	var	post_password = req.body.password;
  	console.log('Debug login post -> account:'+post_account);
	console.log('Debug login post -> password:'+post_password);
	req.flash('post_account', post_account);
	req.flash('post_password', post_password);
	return res.redirect('/login');
  });

  app.get('/register', function (req, res) {
	var account = req.flash('post_account').toString();
	var successMessae,errorMessae;
	
  	
	if(account==''){
		//Redirect from login
		res.render('user/register', { title: 'Register',
			account:null,
			email:null,
			username:null,
			password:null,
			confirm:null,
			citys:citys,
			error: errorMessae
		});
	}else{
		//Register submit with post method
		var name = req.flash('post_name').toString();
		var password = req.flash('post_password').toString();
		var email = req.flash('post_email').toString();
		var confirm = req.flash('post_confirm').toString();
		var city = req.flash('post_city').toString();
		
		
		var count = 0;
		var level = 1;
		console.log('Debug register get -> account:'+ account);
		console.log('Debug register get -> name:'+ name);
		console.log('Debug register get -> password:'+ password);
		console.log('Debug register get -> email:'+ email);
		console.log('Debug register get -> confirm:'+ confirm);
		console.log('Debug register get -> city:'+ city);
		
		var test = false;
		if(test == true){ //for debug to remove all users
			User.removeAllUsers(function(err,result){
				if(err){
					console.log('removeAllUsers :'+err);
				}
				console.log('removeAllUsers : '+result);
			});
		}

		User.findUserByAccount(account,function(err,user){
			if(err){
				errorMessae = err;
				res.render('user/register', { title: 'Register',
					account:account,
					email:email,
					username:name,
					password:password,
					confirm:confirm,
					citys:citys,
					error: errorMessae
				});
			}
			console.log('Debug register user -> name: '+user);
			if(user != null ){
				errorMessae = '帳號已註冊,請更換帳號再註冊!';
				registerError
				registerError(res,errorMessae);
			}else{
				
				User.saveUser(account,email,name,password,city,function(err,result){
					if(err){
						errorMessae = '註冊失敗,請重新註冊!';
						registerError(res,errorMessae);
					}
					//跳到註冊成功頁面
					User.findUserByAccount(account,function(err,user){
						req.session.user = user;
						return res.redirect('/');
					});
				});
			}
		});
	}
  });

  

  app.post('/register', function (req, res) {
		var account = req.body.account;
		var	email = req.body.email;
		var	username = req.body.username;
		var	password = req.body.password;
		var	confirm = req.body.confirm;
		var	city = req.body.city;
		var areaList = JsonFileTools.getJsonFromFile(path);//All of citys data list
	  	var keys = Object.keys(areaList);//All of citys with data
		var index = keys.indexOf(city);
		var successMessae,errorMessae;
		if(!validateEmail(email)){
			errorMessae = '電子信箱格式不正確!';
			registerError(res,account,email,username,password,confirm,citys,errorMessae);
		}else if(password !== confirm){
			errorMessae = '確認密碼不正確!';
			registerError(res,account,email,username,password,confirm,citys,errorMessae);
		}else if(index<0){
			errorMessae = '你選擇的城市目前無資料!目前有資料的城市如下:\n'+JSON.stringify(keys);
			registerError(res,account,email,username,password,confirm,citys,errorMessae);
		}else {
			console.log('account:'+account);
			console.log('email:'+email);
			console.log('username:'+username);
			console.log('password:'+password);
			console.log('confirm:'+confirm);
			console.log('confirm:'+city);
			req.flash('post_account', account);
			req.flash('post_name', username);
			req.flash('post_password', password);
			req.flash('post_email', email);
			req.flash('post_confirm', confirm);
			req.flash('post_city', city);
			return res.redirect('/register');
		}
  });

  app.get('/logout', function (req, res) {
    req.session.user = null;
    res.redirect('/');
  });

  app.get('/board-manager', function (req, res) {
	  var user = req.session.user;
	  var errorMessage;
	  if(user && user.enable && user.level<2){
		  var json = {enable:0,city:user.city};
		  Review.findDatas(json,function(err,datas){
			  if(err){
				console.log('Debug board Review.saveData -> err:'+err);
			  }
			  res.render('user/board-manager', { title: 'Board-Manager',
				user:user,
				datas:datas,
				error:errorMessage
			  });
		  });
	  }else{
		  return res.redirect('/');
	  }
  });

  app.post('/board-manager', function (req, res) {
	  
	  var mode = req.body.postMode;
	  var id = req.body.postId;
	  var data = JSON.parse(req.body.postData);
      var errorMessage;
	  var status = 0;

	  if(mode === 'reject'){
		   status = 2;
	  }else{
		  status = 1;
		  Cloud.store(data.title,data.content,data.city,data.area,data.town,
		  	function(err,result){
			  if(err){
				  status = 0;
				  errorMessage = "上傳失敗,請稍待一會再重傳"; 
				  req.flash('error',errorMessage);
			      req.flash('refresh',mode);//For refresh data 
		          return res.redirect('/board-manager'); 
			  }
			  var json = {enable:status};
			  Review.updateData(id,json,function(err,datas){
					if(err){
						//For refresh error message
					}
					req.flash('error',errorMessage);
					req.flash('refresh',mode);//For refresh data 
					return res.redirect('/board-manager');
			  });
		  });
		  return;
	  }
	  var json = {enable:status};
	  Review.updateData(id,json,function(err,datas){
			if(err){
				//For refresh error message
				errorMessage = err;
			}
			req.flash('error',errorMessage);
			req.flash('refresh',mode);//For refresh data 
			return res.redirect('/board-manager');
	  });
  });

 
    app.get('/account', function (req, res) {
	 var myuser = req.session.user;
	 if(myuser && myuser.enable && myuser.level<2){
		  console.log('render to account.ejs');
			var refresh = req.flash('refresh').toString();
			
			var citys = settings.citys;
			var successMessae,errorMessae;
			var postAccount = req.flash('postAccount').toString();
			console.log('Debug account get -> refresh :'+refresh);
			if(myuser.level ===0){
				var json =  {"level": {"$gte": myuser.level, "$lt": 4}};
			}else{
				var json =  {"city":myuser.city,"level": {"$gte": myuser.level, "$lt": 4}};
			}
			
			console.log('Find json -> refresh :'+JSON.stringify(json));
			User.findUser(json,function (err,users){
				if(err){
					errorMessae = err;
				}
				if(refresh == 'delete'){
					errorMessae = '刪除帳號 ['+postAccount+'] 完成!';
				}else if(refresh == 'edit'){
					errorMessae = '更新帳號 ['+postAccount+'] 完成!';
				}
				req.session.userS = users;
				var myusers = req.session.userS;
				console.log('Debug account get -> users:'+users.length+'\n'+users);
				//Jason add for filter 'admin' on 2017.06.01
				var filterAccount = 'admin';
				if(myuser.level ===0){
					var removeIndex = -1;
					for(var i in users){
						if(users[i].account === 'admin'){
							removeIndex = i;
						}
					}
					if (removeIndex > -1) {
						users.splice(removeIndex, 1);
					}
				}

				//console.log('Debug account get -> user:'+mUser.name);
				res.render('user/account', { title: 'Account', // user/account : ejs path
					user:myuser,//current user : administrator
					users:users,//All users
					citys:citys,
					error: errorMessae,
					success: successMessae
				});
			});
	  }else{
		  return res.redirect('/');
	  }

		
    });

	app.post('/account', function (req, res) {

		var	mode = req.body.postMode;
		var account = req.body.postAccount;
		var successMessae,errorMessae;
		
		if(mode === 'del'){
			User.removeUserByAccount(account,function(err,result){
				if(err){
					console.log('removeUserByAccount :'+account+ " fail! \n" + err);
					errorMessae = err;
				}else{
					console.log('removeUserByAccount :'+account + 'success');
					successMessae = successMessae;
				}
				User.findAllUsers(function (err,users){
					console.log('查詢到帳戶 :'+users.length);
				});
				req.flash('refresh','delete');//For refresh users data
				req.flash('postAccount',account);//For refresh users data
				return res.redirect('/account');
			});

		}else{
			var	name = req.body.postName;
			var	level = Number(req.body.postLevel);
			var	enable = req.body.postEnable;
			var json = {name:name,level:level,enable:enable};

			console.log('updateUser json:'+json );

			User.updateUser(account,json,function(err,result){
				if(err){
					console.log('updateUser :'+account + err);
					errorMessae = err;
				}else{
					console.log('updateUser :'+account + 'success');
				}
				req.flash('refresh','edit');//For refresh users data
				req.flash('postAccount',account);//For refresh users data
				return res.redirect('/account');
			});
		}	
    });
};

function checkLogin(req, res, next) {
  if (!req.session.user) {
    req.flash('error', 'No Register!'); 
    res.redirect('/login');
  }else
  {
	  next();
  }
  
}

function checkNotLogin(req, res, next) {
  if (req.session.user) {
    req.flash('error', 'Have login!'); 
    res.redirect('back');//返回之前的页面
  }else
  {
	  next();
  }
  
}

function validateEmail(sEmail) {
	var reEmail = /^(?:[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+\.)*[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+@(?:(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!\.)){0,61}[a-zA-Z0-9]?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!$)){0,61}[a-zA-Z0-9]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/;

	if(!sEmail.match(reEmail)) {
		return false;
	}
	return true;
}

function registerError(res,account,email,username,password,confirm,citys,msg) {
	
	res.render('user/register', { title: 'Register',
		account:account,
		email:email,
		username:username,
		password:password,
		confirm:confirm,
		citys:citys,
		error: msg
	});
}