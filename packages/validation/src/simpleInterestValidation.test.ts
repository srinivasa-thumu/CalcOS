import { describe, expect, it } from 'vitest';
import { validateSimpleInterestInput } from './simpleInterestValidation';

describe('validateSimpleInterestInput', () => {
  it('accepts valid input', () => {
    const result = validateSimpleInterestInput({
      principal: 100000,
      annualRate: 10,
      timeInYears: 2,
    });

    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it('rejects zero principal', () => {
    const result = validateSimpleInterestInput({
      principal: 0,
      annualRate: 10,
      timeInYears: 2,
    });

    expect(result.isValid).toBe(false);
    expect(result.errors.principal).toBe(
      'Principal amount must be greater than 0.',
    );
  });

  it('rejects negative principal', () => {
    const result = validateSimpleInterestInput({
      principal: -100,
      annualRate: 10,
      timeInYears: 2,
    });

    expect(result.isValid).toBe(false);
    expect(result.errors.principal).toBe(
      'Principal amount must be greater than 0.',
    );
  });

  it('rejects negative interest rate', () => {
    const result = validateSimpleInterestInput({
      principal: 100000,
      annualRate: -10,
      timeInYears: 2,
    });

    expect(result.isValid).toBe(false);
    expect(result.errors.annualRate).toBe(
      'Interest rate cannot be negative.',
    );
  });

  it('rejects zero time period', () => {
    const result = validateSimpleInterestInput({
      principal: 100000,
      annualRate: 10,
      timeInYears: 0,
    });

    expect(result.isValid).toBe(false);
    expect(result.errors.timeInYears).toBe(
      'Time period must be greater than 0.',
    );
  });
});