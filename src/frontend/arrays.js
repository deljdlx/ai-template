/**
 * Useless array utilities.
 * Reinventing wheels, one function at a time.
 */

/**
 * Shuffles an array using Fisher-Yates with a seedable RNG.
 * @param {Array} arr
 * @param {number} seed
 * @returns {Array}
 */
export const shuffle = (arr, seed = 42) => {
  const result = [...arr];
  let s = seed;
  const random = () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

/**
 * Flattens a nested array one level deep.
 * @param {Array} arr
 * @returns {Array}
 */
export const flatten = (arr) => {
  const result = [];
  for (const item of arr) {
    if (Array.isArray(item)) {
      for (const sub of item) {
        result.push(sub);
      }
    } else {
      result.push(item);
    }
  }
  return result;
};

/**
 * Returns unique values from an array, preserving order.
 * @param {Array} arr
 * @returns {Array}
 */
export const unique = (arr) => {
  const seen = new Set();
  const result = [];
  for (const item of arr) {
    if (!seen.has(item)) {
      seen.add(item);
      result.push(item);
    }
  }
  return result;
};

/**
 * Groups array items by a key function.
 * @param {Array} arr
 * @param {Function} keyFn
 * @returns {Record<string, Array>}
 */
export const groupBy = (arr, keyFn) => {
  const groups = {};
  for (const item of arr) {
    const key = keyFn(item);
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
  }
  return groups;
};
