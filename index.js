const express = require('express')
const app = express()
const path = require('path')
const engines = require('consolidate')
const goodreads = require('goodreads')
const bodyParser = require('body-parser')
const env = require('node-env-file')

// load environment variables
env(__dirname + '/.env');

const goodreadsClient = new goodreads.client({
  key: process.env.KEY,
  secret: process.env.SECRET
})

app.engine('hbs', engines.handlebars)
app.set('views', './views')
app.set('view engine', 'hbs')
app.use(bodyParser.urlencoded({ extended: true }))

function getCurrentlyReading(userID) {
  return new Promise((resolve, reject) => {
    goodreadsClient.getSingleShelf({
      userID: userID,
      shelf: 'currently-reading',
      page: 1
    }, (data) => {
      if (typeof data.html !== 'object') {
        const { books } = data.GoodreadsResponse
        console.dir(books[0].book[0].authors[0].author.name);
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
    .then(books => res.render('reading', { books: books }))
    .catch(err => res.send(err))
})

app.get('/reading/:user/json', (req, res) => {
  const user = req.params.user
  getCurrentlyReading(user)
    .then(books => res.json(books))
    .catch(err => res.send(err))
})

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'))
})

app.listen(3000, () => console.log('Listening on http://localhost:3000'))
