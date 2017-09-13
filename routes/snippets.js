const express = require('express');
const routes = express.Router();
const mongoose = require('mongoose');
const Snippet = require('../models/snippet');

routes.get('/snippetlist', (req, res) => {
  Snippet.find({ userID: req.user.id })
    .then(snippet => res.render('snippetlist', { snippet: snippet }))
    .catch(err => res.send('there was an error :('));
});

routes.get('/addsnippet', (req, res) => {
  if (req.query.id) {
    Snippet.findById(req.query.id)
      .then(snippet => res.render('addsnippet', { snippet: snippet }));
  } else {
    res.render('addsnippet');
  }
});

routes.post('/saveSnippet', (req, res) => {
  if (!req.body.id){
    req.body.id = new mongoose.mongo.ObjectID();
  }
  req.body.userID = req.user.id;
  Snippet.findByIdAndUpdate(req.body.id, req.body, { upsert: true })
    .then(() => res.redirect('/snippetlist'))
    .catch(err => {
      console.log(err);
      res.render('addsnippet', {
        errors: err.errors,
        snippet: req.body
      });
    });
});

routes.get('/deleteSnippet', (req, res) => {
  Snippet.findById(req.query.id)
    .remove()
    .then(() => res.redirect('/snippetlist'));
});

module.exports = routes;
