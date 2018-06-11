var express = require('express');
var mongo = require('mongodb');
var db = require('monk')('localhost/nodeblog');
var posts = db.get('posts');

var router = express.Router();

db.once('open',function(){
console.log('connected');
});

router.get('/',(req,res)=>{
  //var db = req.db;
  //var posts = db.get('posts');
  posts.find({},function(err,posts){
    res.render('index',{"posts":posts})
  });
  });


module.exports = router;
