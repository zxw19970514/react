var express = require('express');
var router = express.Router();
var pathLib = require('path');
var mgdb = require('../../utils/mgdb');
var fs = require('fs');

router.get('/', function(req, res, next) {
  let {_nickname,_mess,_time} =req.query;
  //校验必传参数
  
  mgdb({
    collectionName: 'message',
    dbName:'blog',
    success:({collection,client})=>{
      collection.insertOne({
        nickname:_nickname,mess:_mess,time:_time
      },(err,result)=>{
        if(!err){
            res.send({err:0,msg:'插入成功',data:result.ops[0]})
        }else{
          res.send({err:1,msg:'user集合操作失败'})
          client.close()
        }
      })
    }
  })

});

module.exports = router;
