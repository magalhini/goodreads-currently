'use strict';

var express = require('express');
var app = express();
var path = require('path');
var hbs = require('hbs');
var bodyParser = require('body-parser');
var env = require('node-env-file');
var fetch = require('node-fetch');
var xml2js = require('xml2js');
var PORT = process.env.PORT || 3000;
var api = require('./api');

if (process.env.ENV === 'development') env(__dirname + '/.env');

hbs.registerHelper('hasLength', function (ctx, opt) {
  return ctx.length;
});

var apiClient = new api({
  key: process.env.key,
  secret: process.env.secret
});

app.set('views', './views');
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/'));
app.use(bodyParser.urlencoded({ extended: true }));
hbs.registerPartials(__dirname + '/views/partials');

app.get('/reading/:user', function (req, res) {
  var user = req.params.user;

  apiClient.getShelf(user, 'currently-reading').then(function (b) {
    console.log(b[0].book[0].id[0]['_']);return b;
  }).then(function (items) {
    return res.render('reading', { items: items });
  }).catch(function (error) {
    return res.render('reading', { error: error });
  });
});

app.get('/reading/:user/json', function (req, res) {
  var user = req.params.user;

  apiClient.getShelf(user, 'currently-reading').then(function (items) {
    return res.json(items);
  }).catch(function (error) {
    return renderError(res, error);
  });
});

app.get('/book/:id/json', function (req, res) {
  apiClient.getBookById(req.params.id).then(function (book) {
    return res.json(book);
  }).catch(function (error) {
    return renderError(res, error);
  });
});

app.get('/book/:id', function (req, res) {
  apiClient.getBookById(req.params.id).then(function (book) {
    return res.render('book', { book: book });
  }).catch(function (error) {
    return res.render('book', { error: error });
  });
});

app.get('/', function (req, res) {
  /*apiClient.searchBook({
    title: 'Hound Of Baskervilles'
  })
    .then(res => console.log(res))
    .catch(err => console.log(err));*/
  res.render('index');
});

function renderError(res, error) {
  res.status(400).json({ error: error });
}

app.listen(PORT, function () {
  return console.log('Listening on http://localhost:' + PORT);
});