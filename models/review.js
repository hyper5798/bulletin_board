var mongoose = require('./mongoose.js');
var Schema = mongoose.Schema;
var moment = require('moment');

// create a schema
var reviewSchema = new Schema({
  city: { type: String},
  township: { type: String},
  district: { type: String},
  subject: { type: String},
  content: { type: String},
  enable: { type: Number},
  created_at: { type: Date},
  update_at:{ type: Date}
});

// the schema is useless so far
// we need to create a model using it
var reviewModel = mongoose.model('Review', reviewSchema);

function saveData(city,township,district,subject,content,callback) {
  
  var time =  moment().format("YYYY-MM-DD HH:mm:ss");
  console.log(time +' Debug : review saveData');
  var newData = new reviewModel({
    city: city,
    township: township,
    district: district,
    subject: subject,
    content: content,
    enable: 0,
    update_at:time,
    created_at: time
  });
  newData.save(function(err){
    if(err){
      console.log('Debug : Review save fail!/n'+err);
      return callback(err);
    }
    console.log('Debug : Review save success!');
      return callback(err,'success');
  });

};

exports.saveData =  saveData;

/*exports.saveHead = function (city,township,district,subject,content,callback) {
  console.log(moment().format('YYYY-MM-DD HH:mm:ss')+' Debug : saveUser()');
  
  var time =  moment().format("YYYY-MM-DD HH:mm:ss");

  console.log('Debug saveUser -> name :'+name);
  var newHead = new HeadModel({
    city: city,
    township: township,
    district: district,
    subject: subject,
    content: content,
    enable: 0,
    update_at:time,
    created_at: time
  });
  newHead.save(function(err){
    if(err){
      console.log('Debug : User save fail!/n'+err);
      return callback(err);
    }
    console.log('Debug : User save success!');
      return callback(err,'success');
  });

};*/

/*
*Update name,password,authz
*json:{password : password, level : level ,autthz:authz }
*/
exports.updateUser = function (name,json,calllback) {
  console.log(moment().format('YYYY-MM-DD HH:mm:ss')+' Debug : updateUser()');
  console.log('Debug : updateUser name='+name);
  var time =  moment().format("YYYY-MM-DD HH:mm:ss");
  json.update_at=time;

  if(name){
    UserModel.find({ name: name },function(err,users){
      if(err){
        console.log('Debug : updateUser find user by name =>'+err);
        return calllback(err);
      }
      if(users.length>0){
        var userId = users[0]._id;
        console.log('Debug : getUserId device ' + users);
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

exports.removeUserByName = function (name,calllback) {
    UserModel.remove({name:name}, (err)=>{
      console.log(moment().format('YYYY-MM-DD HH:mm:ss')+' Debug : removeUserByName()');
      if (err) {
        console.log('Debug : User remove name :'+name+' occur a error:', err);
            return calllback(err);
      } else {
        console.log('Debug : User remove name :'+name+' success.');
            return calllback(err,'success');
      }
    });
};

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