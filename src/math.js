/**
 * Useless math utilities.
 * Each function does something technically correct but profoundly unnecessary.
 */

/**
 * Adds two numbers. Revolutionary.
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
export const add = (a, b) => a + b;

/**
 * Multiplies two numbers using repeated addition.
 * Because why use the * operator when you can suffer?
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
export const multiply = (a, b) => {
  let result = 0;
  const sign = b < 0 ? -1 : 1;
  const absB = Math.abs(b);
  for (let i = 0; i < absB; i++) {
    result = add(result, a);
  }
  return result * sign;
};

/**
 * Returns the fibonacci number at index n.
 * Uses the most naive recursive approach possible.
 * @param {number} n
 * @returns {number}
 */
export const fibonacci = (n) => {
  if (n <= 0) return 0;
  if (n === 1) return 1;
  return fibonacci(n - 1) + fibonacci(n - 2);
};

/**
 * Checks if a number is even by subtracting 2 repeatedly.
 * @param {number} n
 * @returns {boolean}
 */
export const isEven = (n) => {
  const abs = Math.abs(n);
  if (abs === 0) return true;
  if (abs === 1) return false;
  return isEven(abs - 2);
};
