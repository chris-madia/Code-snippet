const express = require('express');
const exphbrs = require('express-handlebars');
const session = require('express-session');
const flash = require('express-flash-messages');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bluebird = require('bluebird');

mongoose.Promise = bluebird;

const User = require('./models/user');
const Snippet = require('./models/snippet');
const passport = require('passport');
const loginRoutes = require('./routes/login');
const snippetsRoutes = require('./routes/snippets');
const searchRoutes = require('./routes/search');


let url = 'mongodb://localhost:27017/snippets';

app.engine('handlebars', exphbrs());
app.set('views', './views');
app.set('view engine', 'handlebars');

app.use(
  session({
    secret: "cheeseburger",
    resave: false,
    saveUninitialized: true
  })
);

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


const requireLogin = (req, res, next) => {
  console.log(req.session);
  console.log('req.user', req.user);
  if (req.user) {
    next();
  } else {
    res.redirect('/login');
  }
};

app.get('/', requireLogin, (req, res) => {
    res.render('home', {user: req.user})
  });

app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/registrationForm', (req, res) => {
  let user = new User(req.body);
  user.provider = 'local';
  user.setPassword(req.body.password);

  user.save()
  .then(() => res.redirect('/'))
  .catch(err => console.log(err));
});

app.use('/', loginRoutes);
app.use('/', snippetsRoutes);
app.use('/', searchRoutes);

mongoose.connect(url, (err, connection) => {
  if (!err){
    console.log('connected to mongo');
  }
  app.listen(3000, function() {
    console.log('Your app is running')
  });
});
