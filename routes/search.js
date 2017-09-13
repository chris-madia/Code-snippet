const express = require('express');
const routes = express.Router();
const Snippet = require('../models/snippet');

const requireLogin = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect('/login');
  }
};

routes.use(requireLogin);

routes.get('/search', (req, res) => {
  let search = req.query.snippets;

 Snippet.find({
   $and: [{
       userID: req.user.id
     },
     {
       $or: [{
         language: search
       }, {
         tags: search
       }]
     }
   ]
 })
 .then(snippets => res.render('search', {
   snippets: snippets
 }))
 .catch(err => res.send('Can not find snippet.'));
 });

module.exports = routes;
