const express = require('express')
const app = express()
const path = require('path')
const hbs = require('hbs')
const goodreads = require('goodreads')
const bodyParser = require('body-parser')
const env = require('node-env-file')
const fetch = require('node-fetch')
const xml2js = require('xml2js')
const PORT = process.env.PORT || 3000;
const api = require('./api');

if (process.env.ENV === 'development') env(__dirname + '/.env');

const parser = new xml2js.Parser()

const apiClient = new api({
  key: process.env.KEY,
  secret: process.env.SECRET
});

const goodreadsClient = new goodreads.client({
  key: process.env.KEY,
  secret: process.env.SECRET
})

app.set('views', './views')
app.set('view engine', 'hbs')
app.use(express.static(__dirname + '/'))
app.use(bodyParser.urlencoded({ extended: true }))
hbs.registerPartials(__dirname + '/views/partials')

function getCurrentlyReading(userID) {
  return new Promise((resolve, reject) => {
    goodreadsClient.getSingleShelf({
      userID: userID,
      shelf: 'currently-reading',
      page: 1
    }, (data) => {
      if (typeof data.html !== 'object' && typeof data.error !== 'null') {
        const { books } = data.GoodreadsResponse;
        resolve(books[0].book)
      } else {
        reject({ success: false })
      }
    })
  });
}

app.get('/reading/:user', (req, res) => {
  const user = req.params.user;

  apiClient
    .getShelf(user, 'currently-reading')
    .then(b => { console.log(b[0].book[0].id[0]['_']); return b })
    .then(items => res.render('reading', { items }))
    .catch(error => res.render('reading', { error }));
});

app.get('/reading/:user/json', (req, res) => {
  const user = req.params.user;

  apiClient
    .getShelf(user, 'currently-reading')
    .then(items => res.json(items));
});

app.get('/book/:id', (req, res) => {
  const id = req.params.id;

  apiClient.getBookById(id)
    .then(book => res.render('book', { book }))
    .catch(error => res.render('book', { error }))
});

app.get('/', (req, res) => {
  /*apiClient.searchBook({
    title: 'Hound Of Baskervilles'
  })
    .then(res => console.log(res))
    .catch(err => console.log(err));*/

  res.render('index')
})

app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`))
