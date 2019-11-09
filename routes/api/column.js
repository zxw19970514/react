var express = require('express');
var router = express.Router();
var mgdb = require('../../utils/mgdb')

//列表详情
router.get('/', function (req, res, next) {
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin); 
  let { _id,_limit, _sort, q ,_skip,_type} = req.query;//结构出请求携带的所有参数
  //整理搜索条件
  let skip=_skip || 0;
  let type= _type || null;
  q = q ? {
    $or: [{ title: eval('/' + q + '/') }, { des: eval('/' + q + '/') }]
  }:{};
console.log(_sort);

  if (_id) {
    //详情
    findDetail({_id,req,res,next})
  } else if(type){
    //列表
    mgdb({
      collectionName: 'notes',
      dbName:'blog',
      success: ({ collection, client }) => {
        collection.find({type},{limit:Number(_limit),skip:Number(skip)}
         ).toArray((err, result) => {
            if (err) {
              res.send({ err: 1, msg: 'column集合操作错误' })
            } else {
              res.send({ err: 0, data: result })
            }
            client.close()
          })
      },
      error: (err) => { console.log(err) },
    })
  }else if(_sort){
    //列表
    mgdb({
      collectionName: 'notes',
      dbName:'blog',
      success: ({ collection, client }) => {
        collection.find({},{limit:Number(_limit)}
        ).sort({'follow':-1}).toArray((err, result) => {
          if (err) {
            res.send({ err: 1, msg: 'column集合操作错误' })
          } else {
            res.send({ err: 0, data: result })
          }
          client.close()
        })
      },
      error: (err) => { console.log(err) },
    })
  } else{
    //列表
    mgdb({
      collectionName: 'notes',
      dbName:'blog',
      success: ({ collection, client }) => {
        collection.find({},{limit:Number(_limit),skip:Number(skip)}
        ).toArray((err, result) => {
          if (err) {
            res.send({ err: 1, msg: 'column集合操作错误' })
          } else {
            res.send({ err: 0, data: result })
          }
          client.close()
        })
      },
      error: (err) => { console.log(err) },
    })
  }

});

//详情
router.get('/:id', function (req, res, next) {
  //详情
  // console.log(':id',req.params)
  findDetail({_id:req.params.id,req,res,next})
});

function findDetail({_id,req,res,next}){
  mgdb({
    collectionName: 'notes',
    dbName:'blog',
    success: ({ collection, client, ObjectID }) => {
      collection.find(
        {
          _id:ObjectID(_id)
        }, 
        {
        }).toArray((err, result) => {
          if (err) {
            res.send({ err: 1, msg: 'column集合操作错误' })
          } else {
            if(result.length>0){
              res.send({ err: 0, data: result[0] })
            }else{
              res.send({ err: 1, msg: '未查询到' })
            }
          }
          client.close()
        })
    },
    error: (err) => { console.log(err) },
  })
}

module.exports = router;
