import { describe, expect, it } from 'vitest';
import { calculateSimpleInterest } from './simple-interest/calculateSimpleInterest';
import { calculateCompoundInterest } from './compound-interest/calculateCompoundInterest';

describe('monthly-per-100 rate mode', () => {
  it('calculates simple interest using the nominal annual equivalent', () => {
    const result = calculateSimpleInterest({
      principal: 10_000,
      annualRate: 18,
      timeInYears: 1,
      rateMode: 'monthly-per-100',
      monthlyRatePer100: 1.5,
    });

    expect(result.interest).toBeCloseTo(1_800);
    expect(result.totalAmount).toBeCloseTo(11_800);
    expect(result.annualRateEquivalent).toBeCloseTo(18);
  });

  it('uses the monthly periodic rate directly for monthly compounding', () => {
    const result = calculateCompoundInterest({
      principal: 10_000,
      annualRate: 18,
      timeInYears: 1,
      compoundingFrequency: 'monthly',
      rateMode: 'monthly-per-100',
      monthlyRatePer100: 1.5,
    });

    expect(result.totalAmount).toBeCloseTo(10_000 * Math.pow(1.015, 12));
    expect(result.interest).toBeCloseTo(10_000 * (Math.pow(1.015, 12) - 1));
  });

  it('uses the nominal annual equivalent for quarterly compounding', () => {
    const result = calculateCompoundInterest({
      principal: 10_000,
      annualRate: 18,
      timeInYears: 1,
      compoundingFrequency: 'quarterly',
      rateMode: 'monthly-per-100',
      monthlyRatePer100: 1.5,
    });

    expect(result.totalAmount).toBeCloseTo(10_000 * Math.pow(1.045, 4));
  });
});