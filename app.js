const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

// app config
mongoose.connect('mongodb://localhost/blog', { useMongoClient: true });
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

// mongoose/ model config
var blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: {type: Date, default: Date.now}
});

var Blog = mongoose.model('Blog', blogSchema);


// RESTful ROUTES

app.get('/', function(req, res){
  res.redirect('/blogs')
})
app.get('/blogs', function(req, res){
  Blog.find({}, function(err, blogs){
    if(err){
      console.log(err);
    } else {
      res.render('index', {blogs: blogs})
    }
  });
});

app.listen(3000, function(){
  console.log('listening');
});
