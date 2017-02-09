const fetch = require('node-fetch');
const xml2js = require('xml2js');
const parser = new xml2js.Parser();
const apiFormatString = require('./helpers').apiFormatString;

class API {
  constructor({key, secret}) {
    this.key = key;
    this.secret = secret;
  }

  getHierarchy(type) {
    switch (type) {
      case 'reviews':
      return ['reviews'][0];
      case 'book':
      return ['book'];
    }
  }

  request(url, type) {
    return new Promise((res, rej) => {
      fetch(url)
        .then(res => res.status === 200 ? res.text() : rej('Error'))
        .then(text => parser.parseString(text, (err, parsed) => {
          const flatBy = this.getHierarchy(type);
          if (text) res(parsed.GoodreadsResponse[flatBy]);
          else rej(err);
        }))
        .catch(err => rej(err));
    });
  }

  getShelf(id, shelf = 'currently-reading') {
    const url = `https://www.goodreads.com/review/list/${id}.xml?key=${this.key}&shelf=${shelf}&v=2`;
    return this.request(url, 'reviews');
  }

  searchBook(author = '', title = '') {
    const formatTitle = title.split(' ').join('+');
    const formatAuthor = author.split(' ').join('+');
    const url = `https://www.goodreads.com/book/title.xml?author=${formatAuthor}&key=${this.key}&title=${formatTitle}`;

    return this.request(url, 'book');
  }
}

module.exports = API;
