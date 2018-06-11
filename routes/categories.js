var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var db = require('monk')('localhost/nodeblog');


router.get('/add',(req,res)=>{
  res.render('category' );
});

router.get('/show/:category',(req,res)=>{
    var posts = db.get('posts');
    posts.find({category:req.params.category},function(err,posts){
      if(err){
        console.log("Error! Facing problem in uploading file.");
      }else{
      res.render('index',{
        "posts":posts
      });
    }
    });
});

router.post('/add',(req,res)=>{
  var title = req.body.title;
  console.log(title);

  //validation check
  req.checkBody('title','Please enter the category').notEmpty();

  //check for error

  var errors = req.validationErrors();
  if(errors){
    res.render('category',{"errors":errors,"title":title});
  }
  else {

      var category = db.get('categories');
      category.insert({"title":title},function(err,category){
        if(err) {
          console.log("there is a problem in adding category");
        }
        else
          {
            req.flash('success_msg','category is added');
            res.redirect('/posts/add');
          }

      })
    }
  });




module.exports = router;
