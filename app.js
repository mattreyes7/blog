const express = require('express');
const expressSanitizer = require('express-sanitizer');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const app = express();

// app config
mongoose.connect('mongodb://localhost/blog', { useMongoClient: true });
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride('_method'));

// mongoose/ model config
var blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: {type: Date, default: Date.now}
});

var Blog = mongoose.model('Blog', blogSchema);


// RESTful ROUTES

// INDEX Route
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

// NEW Route
app.get('/blogs/new', function(req, res){
  res.render('new');
});
// CREATE Route
app.post('/blogs', function(req, res){
  // create blog
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.create(req.body.blog, function(err, newBlog){
    if (err) {
      res.render('new');
    } else {
      // redirect
      res.redirect('/blogs');
    }
  });
});

// SHOW Route
app.get('/blogs/:id', function(req, res){
  Blog.findById(req.params.id, function(err, foundBlog){
    if(err){
      res.redirect('/blogs');
    } else {
      res.render('show', {blog: foundBlog});
    }
  });
});

// EDIT Route
app.get('/blogs/:id/edit', function(req, res){
  Blog.findById(req.params.id, function(err, foundBlog){
    if(err){
      res.redirect('/blogs')
    } else {
      res.render('edit', {blog: foundBlog});
    }
  })
})
// UPDATE Route
app.put('/blogs/:id', function(req, res){
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
    if(err){
      res.redirect('/blogs');
    } else {
      res.redirect('/blogs/' + req.params.id);
    }
  });
});

// DELETE Route
app.delete('/blogs/:id', function(req, res){
  // destroy blog
  Blog.findByIdAndRemove(req.params.id, function(err){
    if(err){
      res.redirect('/blogs')
    } else {
      res.redirect('blogs')
    }
  })
});

app.listen(3000, function(){
  console.log('listening');
});
