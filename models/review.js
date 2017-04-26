var mongoose = require('./mongoose.js');
var Schema = mongoose.Schema;
var moment = require('moment');

// create a schema
var reviewSchema = new Schema({
  city: { type: String},
  township: { type: String},
  district: { type: String},
  account: { type: String},
  name: { type: String},
  subject: { type: String},
  content: { type: String},
  enable: { type: Number},//0:no review 1:upload 2:reject
  created_at: { type: String},
  update_at:{ type: String}
});

// the schema is useless so far
// we need to create a model using it
var reviewModel = mongoose.model('Review', reviewSchema);

function saveData(city,township,district,subject,content,account,name,callback) {
  
  var time =  moment().format("YYYY-MM-DD HH:mm:ss");
  console.log(time +' Debug : review saveData');
  var newData = new reviewModel({
    city: city,
    township: township,
    district: district,
    account: account,
    name:name,
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

function updateData(dataId,json,calllback) {
  console.log(moment().format('YYYY-MM-DD HH:mm:ss')+' Debug : updateData()');
  
  var time =  moment().format("YYYY-MM-DD HH:mm:ss");
  json.update_at=time;

  reviewModel.update({_id : dataId},
    json,
    {safe : true, upsert : true},
    (err, rawResponse)=>{
      if (err) {
                console.log('Debug : update dataId : '+ err);
                return calllback(err);
      } else {
                console.log('Debug : update data : success');
          return calllback(err,'success');
        }
      }
    );
};

exports.updateData = updateData;

/*
*Remove all of users
*Return -1:資料存取錯誤 0:刪除完成 1:刪除失敗
*/
function removeAllData(calllback) {
    reviewModel.remove({}, (err)=>{
      console.log(moment().format('YYYY-MM-DD HH:mm:ss')+' Debug : removeAllUsers');
      if (err) {
        console.log('Debug :  remove all data occur a error:', err);
            return calllback(err);
      } else {
        console.log('Debug : remove all data is success.');
            return calllback(err,'success');
      }
    });
};

exports.removeAllData = removeAllData;

function removeData(json,calllback) {
    reviewModel.remove(json, (err)=>{
      console.log(moment().format('YYYY-MM-DD HH:mm:ss')+' Debug : remove data');
      if (err) {
        console.log('Debug : remove data occur a error:', err);
            return calllback(err);
      } else {
        console.log('Debug : remove data success.');
            return calllback(err,'success');
      }
    });
};

exports.removeData = removeData;

/*Find all of users
*/
function findAllUsers(calllback) {
    console.log(moment().format('YYYY-MM-DD HH:mm:ss')+' Debug : findAllUsers()');
    reviewModel.find((err, datas) => {
      if (err) {
        console.log('Debug : findAllDatas err:', err);
            return calllback(err);
      } else {
            console.log('Debug : findAllDatas success\n:',datas.length);
        return calllback(err,datas);
      }
    });
};
exports.findAllUsers = findAllUsers;

function findDatas(json,calllback) {
    console.log(moment().format('YYYY-MM-DD HH:mm:ss')+' Debug : find data');
    reviewModel.find(json, function(err,datas){
      if(err){
        return callback(err);
      }
      if (datas.length>0) {
        console.log('find '+datas.length);
        return calllback(err,datas);
      }else{
        console.log('找不到資料!');
        return calllback(err,null);
      }
    });
};

exports.findDatas = findDatas;