const rating = document.querySelector('.book__rating');

const createStar = () => {
  const starEl = document.createElement('div');
  starEl.innerHTML = '★';
  starEl.classList.add('star-rating');
  return starEl;
}

Array
  .apply(null, { length: Math.round(rating.innerHTML) })
  .map(Number.call, Number)
  .forEach(star => rating.appendChild(createStar()));
