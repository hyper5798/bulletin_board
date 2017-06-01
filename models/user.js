var mongoose = require('./mongoose.js');
var Schema = mongoose.Schema;
var moment = require('moment');

// create a schema
var userSchema = new Schema({
  account: { type: String},
  email: { type: String},
  name: { type: String},
  password: { type: String},
  enable: { type: Boolean},
  level:{type: Number},//0:Hightest 1:normal
  city:{type: String},
  update_at: { type: String},
  created_at: { type: String}
});

// the schema is useless so far
// we need to create a model using it
var UserModel = mongoose.model('User', userSchema);

function saveUser(account,email,name,password,city,callback) {
  console.log(moment().format('YYYY-MM-DD HH:mm:ss')+' Debug : saveUser()');
  var isEnable = false;
  var level = 3;
  var area = 0;
  if(account === 'admin' || account === 'blazing'){
    isEnable = true;
    level = 0;
  }
  var time =  moment().format("YYYY-MM-DD HH:mm:ss");

  console.log('Debug saveUser -> name :'+name);
  var newUser = new UserModel({
    account:account,
    name: name,
    password: password,
    email: email,
    enable: isEnable,
    level:level,//0:Hightest,1:area manager,2:announcer,3:normal
    city: city,
    update_at  : time,
    created_at: time
  });
  newUser.save(function(err){
    if(err){
      console.log('Debug : User save fail!/n'+err);
      return callback(err);
    }
    console.log('Debug : User save success!');
      return callback(err,'success');
  });

};

exports.saveUser = saveUser;

/*
*Update name,password,authz
*json:{password : password, level : level ,autthz:authz }
*/
function updateUser(account,json,calllback) {
  console.log(moment().format('YYYY-MM-DD HH:mm:ss')+' Debug : updateUser()');
  console.log('Debug : updateUser account='+account);
  var time =  moment().format("YYYY-MM-DD HH:mm:ss");
  json.update_at=time;

  if(account){
    UserModel.find({ account: account },function(err,users){
      if(err){
        console.log('Debug : updateUser find user by account =>'+err);
        return calllback(err);
      }
      if(users.length>0){
        var userId = users[0]._id;
        console.log('Debug : getUser  :' + JSON.stringify(users[0]));
        console.log('Debug : getUserId : ' +userId);
        UserModel.update({_id : userId},
          json,
          {safe : true, upsert : true},
          (err, rawResponse)=>{
            if (err) {
                      console.log('Debug : updateUser : '+ err);
                      return calllback(err);
            } else {
                      console.log('Debug : updateUser : success');
                return calllback(err,'success');
              }
            }
          );
      }else{
        console.log('Debug : updateUser can not find user!');
        return calllback('Can not find user!');
      }
    });
  }else{
    console.log('Debug : updateUser no referance');
        return calllback('Referance nul!');
  }
};

exports.updateUser = updateUser;

/*
*Remove all of users
*Return -1:資料存取錯誤 0:刪除完成 1:刪除失敗
*/
exports.removeAllUsers = function (calllback) {
    UserModel.remove({}, (err)=>{
      console.log(moment().format('YYYY-MM-DD HH:mm:ss')+' Debug : removeAllUsers');
      if (err) {
        console.log('Debug : User remove all occur a error:', err);
            return calllback(err);
      } else {
        console.log('Debug : User remove all success.');
            return calllback(err,'success');
      }
    });
};

function removeUserByAccount(account,calllback) {
    UserModel.remove({account:account}, (err)=>{
      console.log(moment().format('YYYY-MM-DD HH:mm:ss')+' Debug : removeUserByAccount()');
      if (err) {
        console.log('Debug : User remove account :'+account+' occur a error:', err);
            return calllback(err);
      } else {
        console.log('Debug : User remove account :'+account+' success.');
            return calllback(err,'success');
      }
    });
};

exports.removeUserByAccount = removeUserByAccount;

/*Find all of users
*/
exports.findAllUsers = function (calllback) {
    console.log(moment().format('YYYY-MM-DD HH:mm:ss')+' Debug : findAllUsers()');
    UserModel.find((err, users) => {
      if (err) {
        console.log('Debug : findAllUsers err:', err);
            return calllback(err);
      } else {
            console.log('Debug : findAllUsers success\n:',users.length);
        return calllback(err,users);
      }
    });
};

exports.findUserByAccount = function (account,calllback) {
    console.log(moment().format('YYYY-MM-DD HH:mm:ss')+' Debug : findUserByName()');
    UserModel.find({ account: account }, function(err,users){
      if(err){
        return callback(err);
      }
      if (users.length>0) {
        console.log('find '+users);
        return calllback(err,users[0]);
      }else{
        console.log('找不到資料!');
        return calllback(err,null);
      }
    });
};

function findUser(json,calllback) {
    console.log(moment().format('YYYY-MM-DD HH:mm:ss')+' Debug : findUserByName()');
    UserModel.find(json, function(err,users){
      if(err){
        return callback(err);
      }
      if (users.length>0) {
        console.log('find '+users);
        return calllback(err,users);
      }else{
        console.log('找不到資料!');
        return calllback(err,null);
      }
    });
};

exports.findUser = findUser;