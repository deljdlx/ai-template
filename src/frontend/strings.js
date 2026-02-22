/**
 * Useless string utilities.
 * Over-engineered solutions to problems nobody has.
 */

/**
 * Reverses a string character by character.
 * @param {string} str
 * @returns {string}
 */
export const reverse = (str) => str.split('').reverse().join('');

/**
 * Checks if a string is a palindrome.
 * @param {string} str
 * @returns {boolean}
 */
export const isPalindrome = (str) => {
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  return cleaned === reverse(cleaned);
};

/**
 * Counts the occurrences of each character in a string.
 * @param {string} str
 * @returns {Record<string, number>}
 */
export const charFrequency = (str) => {
  const freq = {};
  for (const char of str) {
    freq[char] = (freq[char] || 0) + 1;
  }
  return freq;
};

/**
 * Converts a string to "spongebob case" (alternating upper/lower).
 * @param {string} str
 * @returns {string}
 */
export const spongebobCase = (str) =>
  str
    .split('')
    .map((char, i) => (i % 2 === 0 ? char.toLowerCase() : char.toUpperCase()))
    .join('');
