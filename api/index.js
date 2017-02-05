const fetch = require('node-fetch');
const xml2js = require('xml2js');
const parser = new xml2js.Parser();

class API {
  constructor({key, secret}) {
    this.key = key;
    this.secret = secret;
  }

  request(url) {
    return new Promise((res, rej) => {
      fetch(url)
        .then(res => res.status === 200 ? res.text() : rej('Book not found'))
        .then(text => parser.parseString(text, (err, parsed) => {
          //console.log(parsed.GoodreadsResponse.book);
          if (text) res(parsed.GoodreadsResponse.book);
          else rej(err);
        }))
        .catch(err => rej(err));
    });
  }

  searchBook(author = '', title = '') {
    const formatTitle = title.split(' ').join('+');
    const formatAuthor = author.split(' ').join('+');
    const url = `https://www.goodreads.com/book/title.xml?author=${formatAuthor}&key=${this.key}&title=${formatTitle}`;

    return this.request(url);
  }
}

module.exports = API;
