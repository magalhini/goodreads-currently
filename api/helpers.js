const upperCaseWords = (string) =>
  string.replace(/\w\S*/g, (str) =>
    str.charAt(0).toUpperCase() + str.substr(1).toLowerCase());

const breakSpaces = (string) =>
  string.split(' ').join('+');

const compose = (f, g) => x => f(g(x));

const apiFormatString = compose(breakSpaces, upperCaseWords);

module.exports = { apiFormatString };
