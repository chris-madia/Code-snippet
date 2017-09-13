const express = require('express');
const routes = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

passport.use(
  new LocalStrategy(function(username, password, done) {
    console.log('configuing passport');

    User.authenticate(username, password)
      .then(user => {
        if (user) {
          done(null, user);
        } else {
          done(null, null, { message: 'No user found.'});
        }
      })
      .catch(err => done(err));
  })
);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id).then(user => done(null, user));
});

routes.get('/login', (req, res) => {
  res.render('login', {failed: req.query.failed});
});

routes.post('/loginForm', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login?failed=true',
  failureFlash: true
}));

routes.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});


module.exports = routes;
