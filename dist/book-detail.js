'use strict';

var rating = document.querySelector('.book__rating');

var createStar = function createStar() {
  var starEl = document.createElement('div');
  starEl.innerHTML = '★';
  starEl.classList.add('star-rating');
  return starEl;
};

Array.apply(null, { length: Math.round(rating.innerHTML) }).map(Number.call, Number).forEach(function (star) {
  return rating.appendChild(createStar());
});