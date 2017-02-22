const fetch = require('node-fetch');
const xml2js = require('xml2js');
const parser = new xml2js.Parser();
const apiFormatString = require('./helpers').apiFormatString;
const BASE_URL = 'https://www.goodreads.com';

class API {
  constructor({key, secret}) {
    this.key = key;
    this.secret = secret;
    this.constructBookList = this.constructBookList.bind(this);
  }

  flattenBy(type, response) {
    switch (type) {
      case 'reviews':
      console.log(response['reviews'][0]['review']);
      return response['reviews'][0]['review'];
      case 'book':
      console.log(response['book'])
      return response.book.length ? response['book'] : [];
    }
  }

  request(url, type) {
    return new Promise((res, rej) => {
      fetch(url)
        .then(res => res.status === 200 ? res.text() : rej('There was an error getting the response'))
        .then(text => parser.parseString(text, (err, parsed) => {
          if (text) {
            res(this.flattenBy(type, parsed.GoodreadsResponse));
          }
          else rej(err);
        }))
        .catch(err => rej(err));
    });
  }

  constructBookList(res) {
    // flatten hierarchy here on a more sane way
  }

  getShelf(userId, shelf = 'currently-reading') {
    const url = `${BASE_URL}/review/list/${userId}.xml?key=${this.key}&shelf=${shelf}&v=2`;
    return this.request(url, 'reviews');
  }

  getBookById(id) {
    const url = `${BASE_URL}/book/show/${id}.xml?key=${this.key}`;
    return this.request(url, 'book');
  }

  searchBook({ author = '', title = '' }) {
    const formatTitle = apiFormatString(title);
    const formatAuthor = apiFormatString(author);
    const url = `${BASE_URL}/book/title.xml?author=${formatAuthor}&key=${this.key}&title=${formatTitle}`;

    return this.request(url, 'book');
  }
}

module.exports = API;
