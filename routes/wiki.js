'use strict'
var express = require('express');
var router = express.Router();
var models = require('../models/index.js');

var Page = models.Page;
var Users = models.User;

module.exports = router;

router.get('/', function(req, res, next){
  res.redirect('/');
});

router.post('/', function(req, res, next){
  // res.send(res.json(req.body))
 var user = Users.build({
  name: req.body.userName,
  email: req.body.userEmail
  }).save();

 var page = Page.build({
    title: req.body.title,
    content: req.body.content
  }).save()
  .then(function (page) {
    res.redirect(page.urlTitle);
  });

});


router.get('/add', function(req, res, next){
  res.render('addpage');
});

router.get('/:urlTitle', function (req, res, next) {
  var userAndPage = {};
  Page.findOne({
    where: {
      urlTitle: req.params.urlTitle
    }
  })
  .then(function(foundPage){
    userAndPage.id = foundPage.dataValues.id;
    userAndPage.title = foundPage.dataValues.title;
    userAndPage.content = foundPage.dataValues.content;
    userAndPage.urlTitle = foundPage.dataValues.urlTitle;
    userAndPage.status = foundPage.dataValues.status;
    userAndPage.date = foundPage.dataValues.date;

    Users.findOne({
      where: {id: userAndPage.id}
    })
    .then(function(foundUser){
      userAndPage.name = foundUser.dataValues.name;
      userAndPage.email = foundUser.dataValues.email;
  })
    .then(function(){
      res.render('wikipage', userAndPage)
    })
  })
  .catch(next);
});
