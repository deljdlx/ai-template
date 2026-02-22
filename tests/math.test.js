import { describe, it, expect } from 'vitest';
import { add, multiply, fibonacci, isEven } from '../src/math.js';

describe('add', () => {
  it('should add two positive numbers', () => {
    expect(add(2, 3)).toBe(5);
  });

  it('should handle negative numbers', () => {
    expect(add(-1, -2)).toBe(-3);
  });

  it('should handle zero', () => {
    expect(add(0, 5)).toBe(5);
  });
});

describe('multiply', () => {
  it('should multiply two positive numbers', () => {
    expect(multiply(3, 4)).toBe(12);
  });

  it('should handle zero', () => {
    expect(multiply(5, 0)).toBe(0);
  });

  it('should handle negative numbers', () => {
    expect(multiply(3, -2)).toBe(-6);
  });
});

describe('fibonacci', () => {
  it('should return 0 for n=0', () => {
    expect(fibonacci(0)).toBe(0);
  });

  it('should return 1 for n=1', () => {
    expect(fibonacci(1)).toBe(1);
  });

  it('should return 55 for n=10', () => {
    expect(fibonacci(10)).toBe(55);
  });
});

describe('isEven', () => {
  it('should return true for even numbers', () => {
    expect(isEven(4)).toBe(true);
  });

  it('should return false for odd numbers', () => {
    expect(isEven(7)).toBe(false);
  });

  it('should return true for zero', () => {
    expect(isEven(0)).toBe(true);
  });

  it('should handle negative numbers', () => {
    expect(isEven(-6)).toBe(true);
  });
});
