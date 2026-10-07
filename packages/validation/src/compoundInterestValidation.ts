import type { CompoundingFrequency } from '@calcos/domain-types';

import type {
  CompoundInterestInput,
} from '@calcos/domain-types';

export interface CompoundInterestValidationResult {
  isValid: boolean;
  errors: {
    principal?: string;
    annualRate?: string;
    timeInYears?: string;
    compoundingFrequency?: string;
  };
}

export function validateCompoundInterestInput(
  input: CompoundInterestInput,
): CompoundInterestValidationResult {
  const errors: CompoundInterestValidationResult['errors'] = {};

  if (!Number.isFinite(input.principal)) {
    errors.principal = 'Enter a valid principal amount.';
  } else if (input.principal <= 0) {
    errors.principal = 'Principal amount must be greater than 0.';
  }

  if (!Number.isFinite(input.annualRate)) {
    errors.annualRate = 'Enter a valid interest rate.';
  } else if (input.annualRate < 0) {
    errors.annualRate = 'Interest rate cannot be negative.';
  }

  if (!Number.isFinite(input.timeInYears)) {
    errors.timeInYears = 'Enter a valid time period.';
  } else if (input.timeInYears <= 0) {
    errors.timeInYears = 'Time period must be greater than 0.';
  }

  const validFrequencies: CompoundingFrequency[] = [
    'annually',
    'semi-annually',
    'quarterly',
    'monthly',
    'daily',
  ];

  if (!validFrequencies.includes(input.compoundingFrequency)) {
    errors.compoundingFrequency = 'Select a valid compounding frequency.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}