var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var pathLib = require('path');
var mgdb = require('../../utils/mgdb');
var fs = require('fs');

router.post('/', function(req, res, next) {
  //抓取用户信息(name,pass,icon,nikename)
  // console.log(req.body);
  let {username,password} = req.body;
  //校验必传参数
  if(!username || !password){
    res.send({err:1,msg:'username,password为必传参数'});
    return;
  }

  //注册时间生成服务器时间  关注粉丝设0
  // let follow = 0;
  // let fans = 0;
  // let time = Date.now();//生成注册时间
  console.log(req.body)
  //密码加盐
  password = bcrypt.hashSync(password, 10); 

  mgdb({

    collectionName: 'user',
    dbName:'vueobj',
    success:({collection,client})=>{
      collection.find({
        username
      },{
  
      }).toArray((err,result)=>{
        if(!err){
          if(result.length>0){
            //不通过 返回错误信息
            res.send({err:1,msg:'用户名已存在'})
            // fs.unlink('./public'+icon,(err)=>{})
            
            client.close()
  
          }else{
            //通过   返回用户数据  插入库 返回插入后的数据
            collection.insertOne({
              username,password
            },(err,result)=>{
              if(!err){
                // delete result.ops[0].password
                res.send({err:0,msg:'注册成功',data:result.ops[0]})
              }else{
                res.send({err:1,msg:'user集合操作失败'})
                client.close()
              }
            })
          }
        }else{
          res.send({err:1,msg:'user集合操作失败'})
          client.close()
        }
      })
    }
  })

});

module.exports = router;
