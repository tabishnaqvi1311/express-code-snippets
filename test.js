const express = require('express');
const hash = require('pbkdf2-password')()
const path = require('path');
const session = require('express-session');
const fs = require('fs');
const users = require('./db');
console.log(users);

const app = module.exports = express();


//config
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//MIDDLEWARE
app.use(express.urlencoded({ extended: false }))
app.use(session({
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  secret: 'shhhh, very secret'
}));

//SESSION PERSISTED MIDDLEWARE
app.use(function(req, res, next){
    const err = req.session.error;
    const msg = req.session.success;
    delete req.session.error;
    delete req.session.success;
    res.locals.message = '';
    if (err) res.locals.message = '<p class="msg error">' + err + '</p>';
    if (msg) res.locals.message = '<p class="msg success">' + msg + '</p>';
    next();
  });

function restrict(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    req.session.error = 'Access denied!';
    res.redirect('/login');
  }
}

//ENDPOINTS

app.get('/', function(req, res){
  res.redirect('/login');
});

app.get('/restricted', restrict, function(req, res){
  res.send('Wahoo! restricted area, click to <a href="/logout">logout</a>');
});

app.get('/logout', function(req, res){
  // destroy the user's session to log them out
  // will be re-created next request
  req.session.destroy(function(){
    res.redirect('/');
  });
});

app.get('/login', function(req, res){
  res.render('login');
});

app.post('/login', function (req, res, next) {
  // console.log(req.body.username, req.body.password);
  let say = false
  
  const userInpname = req.body.username;
  const userInpPass = req.body.password;
  
  const arrOfkeys = Object.keys(users);
  const arrOfvalues = Object.values(users);

  for(const items in arrOfvalues){
    if(arrOfvalues[items].name == userInpname && arrOfvalues[items].password == userInpPass){
      say = true;
    }
  }

  if(say == true){
    req.session.regenerate(() => {
      req.session.user = userInpname;
      req.session.success = 'Authenticated as ' + userInpname + ' click to <a href="/logout">logout</a>. ' + ' You may now access <a href="/restricted">/restricted</a>.';
      res.redirect('back');
    });
  }
  else{
    req.session.error = 'Authentication failed, please check your ' + ' username and password.';
    res.redirect('/login');
  }
})


if (!module.parent) {
  app.listen(3001);
  console.log('Express started on http://localhost:3001');
}
