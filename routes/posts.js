var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var db = require('monk')('localhost/nodeblog');



router.get('/add',(req,res)=>{
  var categories = db.get('categories');
  categories.find({},function(err,categories){
    if (err){
      console.log(err);
    }else{
      res.render('addPosts',{'category':categories});
    }
  });
});

router.get('/edit/:id',(req,res)=>{
  var posts = db.get('posts');
  posts.find({_id:req.params.id},function(err,posts){
    posts = posts[0];
    res.render('editposts',{'posts':posts});
  });
});




router.post('/add',(req,res)=>{
  var title = req.body.title;
  var category = req.body.category;
  var body = req.body.body;
  var author = req.body.Author;
  var date = new Date().toDateString();

  if(req.file){
      var addImageOriginalName = req.file.originalname;
      var addImageName = req.file.filename;
      var addImageMime = req.file.mimetype;
      var addImagePath = req.file.path;
      var addImageExt = req.file.extension;
      var addImageSize = req.file.size;
    }else{
    var addImageName = 'noimage.png';
    }


  //check for validation
  req.checkBody('title','Title field is required').notEmpty();
  req.checkBody('body','Body field is required').notEmpty();
  req.checkBody('Author','Author name is required').notEmpty();

   //check for validation console.error
 var errors = req.validationErrors();

 if(errors){

   res.render('addPosts',{
     "errors":errors,
     "title":title,
     "body":body,
     "Author":author,
     "date":date
   });
 }
 else
 {
      var posts = db.get('posts');
       posts.insert({
       "title":title,
       "body":body,
       "Author":author,
       "category":category,
       "addimage":addImageName,
       "date":date
     },function(err,posts){
       if(err){
         res.send('there was an issue submitting the post');
       }else {
         req.flash("success_msg","Post submitted");
         res.location('/');
         res.redirect('/');
       }
     })
   }
 });

 router.post('/edit/:id',(req,res)=>{
   var title = req.body.title;
   var category = req.body.category;
   var body = req.body.body;
   var author = req.body.Author;
   var date = new Date().toDateString();

   if(req.file){
       var addImageOriginalName = req.file.originalname;
       var addImageName = req.file.filename;
       var addImageMime = req.file.mimetype;
       var addImagePath = req.file.path;
       var addImageExt = req.file.extension;
       var addImageSize = req.file.size;
     }else{
     var addImageName = 'noimage.png';
     }


   //check for validation
   req.checkBody('title','Title field is required').notEmpty();
   req.checkBody('body','Body field is required').notEmpty();
   req.checkBody('Author','Author name is required').notEmpty();

    //check for validation console.error
  var errors = req.validationErrors();

  if(errors){

    res.render('editposts',{
      "errors":errors,
      "title":title,
      "body":body,
      "Author":author,
      "date":date
    });
  }
  else
  {
       var posts = db.get('posts');
        posts.update({"_id":req.params.id},
        {$set:{
        "title":title,
        "body":body,
        "Author":author,
        "category":category,
        "addimage":addImageName,
        "date":date
      }},function(err,posts){
        if(err){
          res.send('there was an issue submitting the post');
        }else {
          req.flash("success_msg","Post updated");
          res.location('/');
          res.redirect('/');
        }
      })
    }
  });



module.exports = router;
