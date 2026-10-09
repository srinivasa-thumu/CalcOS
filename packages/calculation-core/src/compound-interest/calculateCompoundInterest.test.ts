import { describe, expect, it } from 'vitest';
import { calculateCompoundInterest } from './calculateCompoundInterest';

describe('calculateCompoundInterest', () => {
  it('calculates annual compounding correctly', () => {
    const result = calculateCompoundInterest({
      principal: 100000,
      annualRate: 10,
      timeInYears: 2,
      compoundingFrequency: 'annually',
    });

    expect(result.totalAmount).toBeCloseTo(121000, 10);
    expect(result.interest).toBeCloseTo(21000, 10);
  });

  it('calculates semi-annual compounding correctly', () => {
    const result = calculateCompoundInterest({
      principal: 100000,
      annualRate: 10,
      timeInYears: 2,
      compoundingFrequency: 'semi-annually',
    });

    expect(result.totalAmount).toBeCloseTo(121550.625, 10);
    expect(result.interest).toBeCloseTo(21550.625, 10);
  });

  it('calculates quarterly compounding correctly', () => {
    const result = calculateCompoundInterest({
      principal: 100000,
      annualRate: 10,
      timeInYears: 2,
      compoundingFrequency: 'quarterly',
    });

    expect(result.totalAmount).toBeCloseTo(121840.28975099172, 10);
expect(result.interest).toBeCloseTo(21840.28975099172, 10);
  });

  it('calculates monthly compounding correctly', () => {
    const result = calculateCompoundInterest({
      principal: 100000,
      annualRate: 10,
      timeInYears: 2,
      compoundingFrequency: 'monthly',
    });

    expect(result.totalAmount).toBeCloseTo(122039.09613755593, 10);
expect(result.interest).toBeCloseTo(22039.09613755593, 10);
  });

  it('calculates daily compounding correctly', () => {
    const result = calculateCompoundInterest({
      principal: 100000,
      annualRate: 10,
      timeInYears: 2,
      compoundingFrequency: 'daily',
    });

    expect(result.totalAmount).toBeCloseTo(122136.9301639786, 10);
      expect(result.interest).toBeCloseTo(22136.9301639786, 10);
        });

        it('handles zero interest rate', () => {
          const result = calculateCompoundInterest({
            principal: 100000,
            annualRate: 0,
            timeInYears: 2,
            compoundingFrequency: 'monthly',
          });

          expect(result.interest).toBe(0);
          expect(result.totalAmount).toBe(100000);
        });

        it('does not silently return non-finite results for extreme inputs', () => {
        expect(() =>
          calculateCompoundInterest({
            principal: Number.MAX_VALUE,
            annualRate: 100,
            timeInYears: 2,
            compoundingFrequency: 'annually',
          }),
        ).toThrow();
      });
});