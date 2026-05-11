// exercises.js

// easy
const sum = require("./exercises/sumtwo.js");
const fizzbuzz = require("./exercises/fizzbuzz.js");
const reverseSentence = require("./exercises/reversesentence.js");

// medium
const characterFrequency = require("./exercises/characterfrequency.js");
const caesarCipher = require("./exercises/caesarcipher.js");
const twoSum = require("./exercises/twosum.js");
const validParentheses = require("./exercises/validparentheses.js");
const removeDuplicateCharacters = require("./exercises/removeduplicatechars.js");

// hard
const longestPalindrome = require("./exercises/palindromicsubstringlength.js");
const minCoins = require("./exercises/minimumcoins.js");

module.exports = {
  // easy
  [sum.id]: sum,
  [fizzbuzz.id]: fizzbuzz,
  [reverseSentence.id]: reverseSentence,

  // medium
	[characterFrequency.id]: characterFrequency,
	[caesarCipher.id]: caesarCipher,
  [twoSum.id]: twoSum,
  [validParentheses.id]: validParentheses,
  [removeDuplicateCharacters.id]: removeDuplicateCharacters,

  // hard
  [longestPalindrome.id]: longestPalindrome,
  [minCoins.id]: minCoins
};