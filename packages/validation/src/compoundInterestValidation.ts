import type {
  CompoundInterestInput,
  CompoundingFrequency,
} from '@calcos/domain-types';

export interface CompoundInterestValidationErrors {
  principal?: string;
  annualRate?: string;
  monthlyRatePer100?: string;
  timeInYears?: string;
  compoundingFrequency?: string;
}

export interface CompoundInterestValidationResult {
  isValid: boolean;
  errors: CompoundInterestValidationErrors;
}

const validFrequencies: CompoundingFrequency[] = [
  'annually',
  'semi-annually',
  'quarterly',
  'monthly',
  'daily',
];

export function validateCompoundInterestInput(
  input: CompoundInterestInput,
): CompoundInterestValidationResult {
  const errors: CompoundInterestValidationErrors = {};

  if (!Number.isFinite(input.principal) || input.principal <= 0) {
    errors.principal = 'Principal must be greater than 0.';
  }

  if (input.rateMode === 'monthly-per-100') {
    if (
      !Number.isFinite(input.monthlyRatePer100) ||
      (input.monthlyRatePer100 ?? -1) < 0
    ) {
      errors.monthlyRatePer100 =
        'Monthly interest per ₹100 must be a non-negative number.';
    }
  } else if (!Number.isFinite(input.annualRate) || input.annualRate < 0) {
    errors.annualRate =
      'Annual interest rate must be a non-negative number.';
  }

  if (!Number.isFinite(input.timeInYears) || input.timeInYears <= 0) {
    errors.timeInYears = 'Time period must be greater than 0.';
  }

  if (!validFrequencies.includes(input.compoundingFrequency)) {
    errors.compoundingFrequency = 'Select a valid compounding frequency.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}