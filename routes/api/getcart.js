var express = require('express');
var router = express.Router();
var mgdb = require('../../utils/mgdb')

router.get('/', function (req, res, next) {
  //username password 必传参数
  let username = req.session['username']

  //兜库
  mgdb({
    collectionName: 'usercart',
    dbName:'vueobj',
    success: ({ collection, client, ObjectID }) => {
      collection.find({
        username
      }, {
        }).toArray((err, result) => {
          if (err) {
            res.send({ err: 1, msg: 'user集合操作错误' })
          } else {
            if (result.length > 0) {
                res.send({ err: 0, msg: '登陆成功', data: result[0] })
              
            } else {
              res.send({ err: 1, msg: '用户名或者密码有误' })
            }
          }
          client.close();
        })
    }
  })

});

module.exports = router;
