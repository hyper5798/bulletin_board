var express = require('express');
var router = express.Router();
var ListDbTools = require('../models/listDbTools.js');
var UserDbTools =  require('../models/userDbTools.js');
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
  	var name = req.flash('post_name').toString();
	var successMessae,errorMessae;
	console.log('Debug register get -> name:'+ name);

	if(name ==''){
		errorMessae = '';
		res.render('user/login', { title: 'Login',
			error: errorMessae
		});
	}else{
		var password = req.flash('post_password').toString();

		console.log('Debug register get -> password:'+ password);
		UserDbTools.findUserByName(name,function(err,user){
			if(err){
				errorMessae = err;
				res.render('user/login', { title: 'Login',
					error: errorMessae
				});
			}
			if(user == null ){
				//login fail
				errorMessae = 'The account is invalid';
				res.render('user/login', { title: 'Login',
					error: errorMessae
				});
			}else{
				//login success
				if(password == user.password){
					req.session.user = user;
					return res.redirect('/');
				}else{
					//login fail
					errorMessae = 'The password is invalid';
					res.render('user/login', { title: 'Login',
						error: errorMessae
					});
				}
			}
		});
	}
  });

  app.post('/login', function (req, res) {
  	var post_name = req.body.account;
  	var	post_password = req.body.password;
  	console.log('Debug login post -> name:'+post_name);
	console.log('Debug login post -> password:'+post_password);
	req.flash('post_name', post_name);
	req.flash('post_password', post_password);
	return res.redirect('/login');
  });

  app.get('/register', function (req, res) {
  	var name = req.flash('post_name').toString();
	var password = req.flash('post_password').toString();
	var email = req.flash('post_email').toString();
	var successMessae,errorMessae;
	var count = 0;
	var level = 1;
	console.log('Debug register get -> name:'+ name);
	console.log('Debug register get -> password:'+ password);
	console.log('Debug register get -> email:'+ email);
	if(name==''){
		//Redirect from login
		res.render('user/register', { title: 'Register',
			error: errorMessae
		});
	}else{
		//Register submit with post method
		var test = false;
		if(test == true){ //for debug to remove all users
			UserDbTools.removeAllUsers(function(err,result){
				if(err){
					console.log('removeAllUsers :'+err);
				}
				console.log('removeAllUsers : '+result);
			});
		}

		UserDbTools.findUserByName(name,function(err,user){
			if(err){
				errorMessae = err;
				res.render('user/register', { title: 'Register',
					error: errorMessae
				});
			}
			console.log('Debug register user -> name: '+user);
			if(user != null ){
				errorMessae = 'This account already exists!';
				res.render('user/register', { title: 'Register',
					error: errorMessae
				});
			}else{
				//save database
				if(name == 'admin'){
					level = 0;
				}
				UserDbTools.saveUser(name,password,email,level,function(err,result){
					if(err){
						errorMessae = 'Registration is failed!';
						res.render('user/register', { title: 'Register',
							error: errorMessae
						});
					}
					UserDbTools.findUserByName(name,function(err,user){
						if(user){
							req.session.user = user;
						}
						return res.redirect('/');
					});
				});
			}
		});
	}
  });

  app.post('/register', function (req, res) {
		var post_name = req.body.register_account;

		var successMessae,errorMessae;
		var	post_password = req.body.register_password;
		var	post_email = req.body.register_email;
		console.log('Debug register post -> post_name:'+post_name);
		console.log('Debug register post -> post_password:'+post_password);
		console.log('Debug register post -> post_emai:'+post_email);
		req.flash('post_name', post_name);
		req.flash('post_password', post_password);
		req.flash('post_email', post_email);
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
		UserDbTools.findAllUsers(function (err,users){
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

  	app.post('/account', function (req, res) {
  		var	post_name = req.body.postName;
		var postSelect = req.body.postSelect;
		console.log('post_name:'+post_name);
		console.log('postSelect:'+postSelect);
		var successMessae,errorMessae;
		req.flash('name',post_name);//For refresh users data

		if(postSelect == ""){//Delete mode
			UserDbTools.removeUserByName(post_name,function(err,result){
				if(err){
					console.log('removeUserByName :'+post_name+ " fail! \n" + err);
					errorMessae = err;
				}else{
					console.log('removeUserByName :'+post_name + 'success');
					successMessae = successMessae;
				}
				UserDbTools.findAllUsers(function (err,users){
					console.log('Find the account :'+users.length);
				});
				req.flash('refresh','delete');//For refresh users data
				return res.redirect('/account');
			});

		}else{//Edit modej
			console.log('postSelect[0] :'+typeof(postSelect) );
			var arr = postSelect.split(",");
			var authz = {a01:arr[1],a02:arr[2],a03:arr[3],a04:arr[4],a05:arr[5],a06:arr[6]};
			if(arr[1]=='true'){
				authz.a01 = true;
			}else{
				authz.a01 = false;
			}
			if(arr[2]=='true'){
				authz.a02 = true;
			}else{
				authz.a02 = false;
			}
			if(arr[3]=='true'){
				authz.a03 = true;
			}else{
				authz.a03 = false;
			}
			if(arr[4]=='true'){
				authz.a04 = true;
			}else{
				authz.a04 = false;
			}
			if(arr[5]=='true'){
				authz.a05 = true;
			}else{
				authz.a05 = false;
			}
			if(arr[6]=='true'){
				authz.a06 = true;
			}else{
				authz.a06 = false;
			}
			var json = {enable:arr[0],authz:authz};

			console.log('updateUser json:'+json );

			UserDbTools.updateUser(post_name,json,function(err,result){
				if(err){
					console.log('updateUser :'+post_name + err);
					errorMessae = err;
				}else{
					console.log('updateUser :'+post_name + 'success');
					successMessae = successMessae;
				}
				req.flash('refresh','edit');//For refresh users data
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