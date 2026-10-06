import { describe, expect, it } from 'vitest';
import { roundCurrency } from './roundCurrency';

describe('roundCurrency', () => {
  it('rounds to two decimal places', () => {
    expect(roundCurrency(123.456)).toBe(123.46);
  });

  it('rounds down when appropriate', () => {
    expect(roundCurrency(123.454)).toBe(123.45);
  });

  it('handles whole numbers', () => {
    expect(roundCurrency(100)).toBe(100);
  });

  it('handles zero', () => {
    expect(roundCurrency(0)).toBe(0);
  });

  it('handles common floating-point precision cases', () => {
    expect(roundCurrency(0.1 + 0.2)).toBe(0.3);
  });
});