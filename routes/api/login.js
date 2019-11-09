var express = require('express');
var router = express.Router();
var mgdb = require('../../utils/mgdb')
var bcrypt = require('bcrypt')

router.post('/', function (req, res, next) {

  let { username, password, save } = req.body
  //username password 必传参数
  if (!username || !password) {
    res.send({ err: 1, msg: '用户名和密码为必传参数' })
    return;
  }

  //兜库
  mgdb({
    collectionName: 'user',
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
              // result[0].password == 加了盐的密码
              let pass = bcrypt.compare(password,result[0].password);
              if (pass) {
                if (save) {
                  //种cookie
                  req.session['1907_session'] = result[0]._id
                  req.session['username']=result[0].username
                  console.log(req.session['username'])
                }
                res.send({ err: 0, msg: '登陆成功', data: result[0] })
              } else {
                res.send({ err: 1, msg: '用户名或者密码有误' })
              }
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
