var express = require('express');
var app = express();
var morgan = require('morgan');
var wikiRouter = require('./routes/wiki.js');
var nunjucks = require("nunjucks");
var bodyParser = require('body-parser');
var models = require("./models");

// point nunjucks to the directory containing templates and turn off caching; configure returns an Environment
// instance, which we'll want to use to add Markdown support later.
var env = nunjucks.configure('views', {noCache: true});
// have res.render work with html files
// when res.render works with html files, have it use nunjucks to do so
app.engine('html', nunjucks.render);


app.set('view engine', 'html'); // what file extension do our templates have
app.set('views', './views'); // where to find the views

// logging middleware
app.use(morgan('dev'));

// body parsing middleware
app.use(bodyParser.urlencoded({ extended: true })); // for HTML form submits
app.use(bodyParser.json()); // would be for AJAX requests

app.use(express.static('public'));


models.User.sync({})
.then(function() {
  return models.Page.sync({});
})
.then(function() {
  app.listen(3001, function(){
    console.log('listening on port 3001');
  });
})
.catch(console.error);

app.use(express.static('/public'));

app.use('/wiki', wikiRouter);

