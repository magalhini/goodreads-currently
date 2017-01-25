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

// load environment variables
env(__dirname + '/.env')

const parser = new xml2js.Parser()

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
      console.log(data);
      if (typeof data.html !== 'object' && typeof data.error !== 'null') {
        const { books } = data.GoodreadsResponse
        resolve(books[0].book)
      } else {
        reject({ success: false })
      }
    })
  })
}

app.get('/reading/:user', (req, res) => {
  const user = req.params.user

  getCurrentlyReading(user)
    .then(books => res.render('reading', { books }))
    .catch(err => res.send(err))
})

app.get('/reading/:user/json', (req, res) => {
  const user = req.params.user

  getCurrentlyReading(user)
    .then(books => res.json(books))
    .catch(err => res.send(err))
})

app.get('/', (req, res) => {
  /*fetch(`https://www.goodreads.com/book/title.xml?author=Arthur+Doyle&key=${process.env.KEY}&title=Hound+of+Baskervilles`)
    .then(res => res.text())
    .then(d => parser.parseString(d, (err, parsed) => {
      console.log(parsed.GoodreadsResponse.book);
    }))*/

  res.render('index')
})

app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`))
