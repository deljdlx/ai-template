import { describe, it, expect } from 'vitest';
import { reverse, isPalindrome, charFrequency, spongebobCase } from '../src/strings.js';

describe('reverse', () => {
  it('should reverse a string', () => {
    expect(reverse('hello')).toBe('olleh');
  });

  it('should handle empty string', () => {
    expect(reverse('')).toBe('');
  });

  it('should handle single character', () => {
    expect(reverse('a')).toBe('a');
  });
});

describe('isPalindrome', () => {
  it('should detect palindromes', () => {
    expect(isPalindrome('racecar')).toBe(true);
  });

  it('should ignore case', () => {
    expect(isPalindrome('Racecar')).toBe(true);
  });

  it('should ignore non-alphanumeric characters', () => {
    expect(isPalindrome('A man, a plan, a canal: Panama')).toBe(true);
  });

  it('should reject non-palindromes', () => {
    expect(isPalindrome('hello')).toBe(false);
  });
});

describe('charFrequency', () => {
  it('should count character occurrences', () => {
    expect(charFrequency('aab')).toEqual({ a: 2, b: 1 });
  });

  it('should handle empty string', () => {
    expect(charFrequency('')).toEqual({});
  });
});

describe('spongebobCase', () => {
  it('should alternate case', () => {
    expect(spongebobCase('hello')).toBe('hElLo');
  });

  it('should handle empty string', () => {
    expect(spongebobCase('')).toBe('');
  });
});
