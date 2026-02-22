import { describe, it, expect } from 'vitest';
import { shuffle, flatten, unique, groupBy } from '../arrays.js';

describe('shuffle', () => {
  it('should return same length array', () => {
    const input = [1, 2, 3, 4, 5];
    expect(shuffle(input)).toHaveLength(5);
  });

  it('should contain same elements', () => {
    const input = [1, 2, 3, 4, 5];
    expect(shuffle(input).sort()).toEqual([1, 2, 3, 4, 5]);
  });

  it('should be deterministic with same seed', () => {
    const input = [1, 2, 3, 4, 5];
    expect(shuffle(input, 123)).toEqual(shuffle(input, 123));
  });

  it('should produce different results with different seeds', () => {
    const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    expect(shuffle(input, 1)).not.toEqual(shuffle(input, 2));
  });

  it('should not mutate the original array', () => {
    const input = [1, 2, 3];
    shuffle(input);
    expect(input).toEqual([1, 2, 3]);
  });
});

describe('flatten', () => {
  it('should flatten one level deep', () => {
    expect(flatten([1, [2, 3], 4])).toEqual([1, 2, 3, 4]);
  });

  it('should handle empty arrays', () => {
    expect(flatten([])).toEqual([]);
  });

  it('should handle already flat arrays', () => {
    expect(flatten([1, 2, 3])).toEqual([1, 2, 3]);
  });
});

describe('unique', () => {
  it('should remove duplicates', () => {
    expect(unique([1, 2, 2, 3, 1])).toEqual([1, 2, 3]);
  });

  it('should preserve order', () => {
    expect(unique([3, 1, 2, 1, 3])).toEqual([3, 1, 2]);
  });

  it('should handle empty array', () => {
    expect(unique([])).toEqual([]);
  });
});

describe('groupBy', () => {
  it('should group items by key function', () => {
    const items = [
      { type: 'a', val: 1 },
      { type: 'b', val: 2 },
      { type: 'a', val: 3 },
    ];
    const result = groupBy(items, (item) => item.type);
    expect(result).toEqual({
      a: [
        { type: 'a', val: 1 },
        { type: 'a', val: 3 },
      ],
      b: [{ type: 'b', val: 2 }],
    });
  });

  it('should handle empty array', () => {
    expect(groupBy([], (x) => x)).toEqual({});
  });
});
