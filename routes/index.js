var express = require('express');
var router = express.Router();
var ListDbTools = require('../models/listDbTools.js');
var User =  require('../models/user.js');
var settings = require('../settings');
var JsonFileTools =  require('../models/jsonFileTools.js');
var path = './public/data/finalList.json';
var path2 = './public/data/test.json';
var path3 = './public/data/gwMap.json';
var hour = 60*60*1000;
var type = 'gps';

module.exports = function(app) {
  
  app.get('/', function (req, res) {
	  if(req.session.user){
		  console.log('$$$$ user is login')
	  }
	  res.render('index', { title: 'Index',
			user:req.session.user
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
			error: errorMessae
		});
	}else{
		//Register submit with post method
		var name = req.flash('post_name').toString();
		var password = req.flash('post_password').toString();
		var email = req.flash('post_email').toString();
		var confirm = req.flash('post_confirm').toString();
		
		
		var count = 0;
		var level = 1;
		console.log('Debug register get -> account:'+ account);
		console.log('Debug register get -> name:'+ name);
		console.log('Debug register get -> password:'+ password);
		console.log('Debug register get -> email:'+ email);
		console.log('Debug register get -> confirm:'+ confirm);
		
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
					error: errorMessae
				});
			}
			console.log('Debug register user -> name: '+user);
			if(user != null ){
				errorMessae = '帳號已註冊,請更換帳號再註冊!';
				res.render('user/register', { title: 'Register',
					account:account,
					email:email,
					username:name,
					password:password,
					confirm:confirm,
					error: errorMessae
				});
			}else{
				
				User.saveUser(account,email,name,password,function(err,result){
					if(err){
						errorMessae = '註冊失敗,請重新註冊!';
						res.render('user/register', { title: 'Register',
							account:account,
							email:email,
							username:name,
							password:password,
							confirm:confirm,
							error: errorMessae
						});
					}
					//跳到註冊成功頁面
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
		var successMessae,errorMessae;
		if(!validateEmail(email)){
			errorMessae = '電子信箱格式不正確!';
			res.render('user/register', { title: 'Register',
			    account:account,
				email:email,
				username:username,
				password:password,
				confirm:confirm,
				error: errorMessae
			});
		}
		if(password !== confirm){
			errorMessae = '確認密碼不正確!';
			res.render('user/register', { title: 'Register',
			    account:account,
				email:email,
				username:username,
				password:password,
				confirm:confirm,
				error: errorMessae
			});
		}
		
		console.log('account:'+account);
		console.log('email:'+email);
		console.log('username:'+username);
		console.log('password:'+password);
		console.log('confirm:'+confirm);
		req.flash('post_account', account);
		req.flash('post_name', username);
		req.flash('post_password', password);
		req.flash('post_email', email);
		req.flash('post_confirm', confirm);
		return res.redirect('/register');
  });

  app.get('/logout', function (req, res) {
    req.session.user = null;
    res.redirect('/');
  });

 
    app.get('/account', function (req, res) {

		console.log('render to account.ejs');
		var refresh = req.flash('refresh').toString();
		var myuser = req.session.user;
		var myusers = req.session.userS;
		var successMessae,errorMessae;
		var post_name = req.flash('name').toString();

		console.log('Debug account get -> refresh :'+refresh);
		User.findAllUsers(function (err,users){
			if(err){
				errorMessae = err;
			}
			if(refresh == 'delete'){
				successMessae = 'Delete account ['+post_name+'] is finished!';
			}else if(refresh == 'edit'){
				successMessae = 'Edit account ['+post_name+'] is finished!';
			}
			req.session.userS = users;
			console.log('Debug account get -> users:'+users.length+'\n'+users);
			console.log('----------------------------------------------------------------');
			console.log('Debug account get -> users:'+users[0].authz.a01);
			console.log('----------------------------------------------------------------');
			//console.log('Debug account get -> user:'+mUser.name);
			res.render('user/account', { title: 'Manager', // user/account : ejs path
				user:myuser,//current user : administrator
				users:users,//All users
				error: errorMessae,
				success: successMessae
			});
		});
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