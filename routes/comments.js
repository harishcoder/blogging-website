var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var db = require('monk')('localhost/nodeblog');

router.get('/show/:id',(req,res)=>{
  var posts = db.get('posts');
  posts.find({_id : req.params.id},function(err,posts){
    posts = posts[0];
    res.render('show',{posts:posts});
  })
});

router.post('/show/:id' ,(req,res)=>{
  var name = req.body.name;
  var email = req.body.email;
  var body = req.body.body;
  var postid = req.body.postid;
  console.log(req.body.postid);
  var commentdate = new Date().toDateString();
  console.log(req.body);

 //check for validationErrors
 req.checkBody('name','Name field is required').notEmpty();
 req.checkBody('email','Email field is required').notEmpty();
 req.checkBody('email','Invalid email id.').isEmail();
 req.checkBody('body','Body field is required').notEmpty();

 //check for error
     var errors = req.validationErrors();
     if(errors){
       var posts = db.get('posts');
       posts.find({"_id":postid}, function (err , posts){
         res.render('show',{
           "errors":errors,
           "posts":posts
         });
       })

     }else{
       var comments = {"name":name , "email":email , "body":body , "commentdate":commentdate };
       var posts = db.get('posts');
       posts.update({"_id": postid},{$push:{"comments" : comments}},function(err , posts){
         if(err) throw err;
         req.flash('success_msg' , 'Your comment is added');
         res.location('/addcomments/show/'+ postid);
         res.redirect('/addcomments/show/'+ postid);
       })
     }

});

router.delete('/delete/:id',(req,res)=>{
  var posts = db.get('posts');
  posts.remove({"_id":req.params.id},function(err,posts){
    if(err){console.log(err)}
    req.flash('success_msg',"post is deleted");
    res.location('/');
    res.redirect('/');
  })
})
module.exports = router;
