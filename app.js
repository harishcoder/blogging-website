var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var path = require('path');
var favicon = require('serve-favicon');
var expressValidator = require('express-validator');
var session = require('express-session');
var flash = require('connect-flash');
var exhbs = require('express-handlebars');
var mongo = require('mongodb');
var db = require('monk')('localhost/nodeblog');
var multer = require('multer');



// set routes
var routes = require('./routes/index');
var posts = require('./routes/posts');
var categories = require('./routes/categories');
var comments = require('./routes/comments');


//initialise
var app = express();

//setup multer engine

const storage = multer.diskStorage({
  destination:'./public/images/uploads',
  filename: function(req,file,cb){
    cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

//setup engine
app.set('views',path.join(__dirname,'views'));
app.engine('handlebars',exhbs({defaultLayout:'layout'}));
app.set('view engine','handlebars');



//set public files
app.use(express.static(path.join(__dirname,'public')));

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));



//multer for uploading files
app.use(multer({
  storage:storage,
}).single('addimage'));


//body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());

//express-session middleware
app.use(session({
    secret:'secret',
    saveUninitialized : true,
    resave : true
}));

//express-validator middleware
app.use(expressValidator({
    errorFormatter:function(param,msg,value){
     var namespace = param.split('.')
     , root = namespace.shift()
     , formParam = root;

        while (namespace.length)
            {
                formParam +='[' +namespace.shift() + ']';
            }
         return{
             param : formParam,
             msg : msg,
             value:value
         }
        }
}));



//connect-flash middleware
app.use(flash());

//global variable for flash
app.use(function(req,res,next){
   res.locals.success_msg = req.flash('success_msg') ;
   res.locals.error_msg = req.flash('error_msg') ;
   res.locals.error = req.flash('error') ;
   next();
});

//make our db accessible to our Router
app.use((req,res,next)=>{
  req.db = db;
  next();
});

//set routes
app.use('/',routes);
app.use('/posts',posts);
app.use('/categories',categories);
app.use('/addcomments',comments);


//set port
app.set('port' , (process.env.PORT || 3000));

app.listen(app.get('port'),function(){
    console.log('server is running at ' + app.get('port'));
});
