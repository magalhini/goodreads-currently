# Goodreads Currently

Goodreads Currently is two things:

- An API microservice around the Goodreads API (which returns responses in JSON instead of XML)
- A display page where you can show off your current reading shelf, view details about its books and authors

It's up and running on a Zeit/now instance, so [feel free to play around with the demo](https://currently-reads.now.sh/).

To run this locally, you'll need your own Goodreads API key.
Once you get one, create and `.env` file on the root of the folder with the following

`secret=YOUR_API_KEY_HERE`

```
npm install
npm run dev
```

And you're good to go.

## API Documentation

At the moment, very little is offered in terms of using the API. For now, you can get shelves (which will default to `currently-reading`), get a book information by its ID, and search books through name and author. All these responses are returned in `JSON` format, unlike their original `XML` counterparts. I love Goodreads, but why their developers choose to live in 1998, I do not know.

### Currently Reading Shelf

Returns a JSON response with the book details on a currently reading shelf.

`GET /reading/:userID/json`

### Get book detail by ID

Given a book ID, returns a JSON response with all the available information of a book.

`GET /book/:bookID/json`

### Search books by author and title

Given an author or/and a book title, displays a JSON response with all the search results.

`POST /search/book`

```
{title |String|}
{author |String|}
```

## What this project isn't

A full blown conversion of the Goodreads API, at least, not at the moment.
The instance is running using my own API key so you don't need to use your own if you just intend on querying it, just don't abuse it too much 😉

The design needs a lot of tweaking, and the node.js / express routes aren't designed to best practices, since the project wasn't even meant to be. I'm planning of making it better as I go and learn.

## A few TODOs:

- [ ] Implement API caching
- [ ] Add Author search API method
- [ ] Publish API independently to npm
