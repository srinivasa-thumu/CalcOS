import { describe, expect, it } from 'vitest';
import { calculateSimpleInterest } from './calculateSimpleInterest';

describe('calculateSimpleInterest', () => {
  it('calculates simple interest correctly', () => {
    const result = calculateSimpleInterest({
      principal: 100000,
      annualRate: 10,
      timeInYears: 2,
    });

    expect(result.interest).toBe(20000);
    expect(result.totalAmount).toBe(120000);
  });

  it('handles a zero interest rate', () => {
    const result = calculateSimpleInterest({
      principal: 100000,
      annualRate: 0,
      timeInYears: 2,
    });

    expect(result.interest).toBe(0);
    expect(result.totalAmount).toBe(100000);
  });

  it('handles fractional time periods', () => {
    const result = calculateSimpleInterest({
      principal: 100000,
      annualRate: 12,
      timeInYears: 0.5,
    });

    expect(result.interest).toBe(6000);
    expect(result.totalAmount).toBe(106000);
  });

    it('calculates interest for a zero rate', () => {
    const result = calculateSimpleInterest({
      principal: 100_000,
      annualRate: 0,
      timeInYears: 5,
    });

    expect(result).toEqual({
      interest: 0,
      totalAmount: 100_000,
    });
  });

  it('does not silently return non-finite results for extreme inputs', () => {
    expect(() =>
      calculateSimpleInterest({
        principal: Number.MAX_VALUE,
        annualRate: 100,
        timeInYears: 2,
      }),
    ).toThrow();
  });
});