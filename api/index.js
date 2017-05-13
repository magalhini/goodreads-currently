const fetch = require('node-fetch');
const xml2js = require('xml2js');
const parser = new xml2js.Parser();
const apiFormatString = require('./helpers').apiFormatString;
const BASE_URL = 'https://www.goodreads.com';

class API {
  constructor({ key, secret }) {
    this.key = key;
    this.secret = secret;
  }

  flattenBy(type, response) {
    switch (type) {
      case 'reviews':
      return response['reviews'][0]['review'];
      case 'book':
      return response.book.length ? response['book'] : [];
      case 'author':
      return response.author[0];
    }
  }

  checkStatus(response, reject) {
    return (response.status === 200) ? response.text() : reject('There was an error getting the response');
  }

  request(url, type) {
    return new Promise((res, rej) => {
      fetch(url)
        .then(response => this.checkStatus(response))
        .then(text => parser.parseString(text, (err, parsed) => {
          if (text) {
            res(this.flattenBy(type, parsed.GoodreadsResponse));
          }
          else rej(err);
        }))
        .catch(err => rej('Error getting the response'));
    });
  }

  getShelf(userId, shelf = 'currently-reading') {
    const url = `${BASE_URL}/review/list/${userId}.xml?key=${this.key}&shelf=${shelf}&v=2`;
    return this.request(url, 'reviews');
  }

  getBookById(id) {
    const url = `${BASE_URL}/book/show/${id}.xml?key=${this.key}`;
    return this.request(url, 'book');
  }

  getAuthorById(id) {
    const url = `${BASE_URL}/author/show/${id}.xml?key=${this.key}`;
    return this.request(url, 'author');
  }

  searchBook({ author = '', title = '' }) {
    const formatTitle = apiFormatString(title);
    const formatAuthor = apiFormatString(author);
    const url = `${BASE_URL}/book/title.xml?author=${formatAuthor}&key=${this.key}&title=${formatTitle}`;

    return new Promise((res, rej) => {
      this.request(url, 'book')
        .then(data => res(data))
        .catch(err => rej(err))
    });
  }
}

module.exports = API;
