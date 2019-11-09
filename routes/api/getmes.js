var express = require('express');
var router = express.Router();
var pathLib = require('path');
var mgdb = require('../../utils/mgdb');
var fs = require('fs');

router.get('/', function(req, res, next) {
    mgdb({
        collectionName: 'message',
        dbName:'blog',
        success:({collection,client})=>{
            collection.find({}).sort({time:-1}).toArray((err, result) => {
                if (err) {
                    res.send({ err: 1, msg: 'user集合操作错误' })
                } else {
                    if (result.length > 0) {
                        res.send({ err: 0, data: result})

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
