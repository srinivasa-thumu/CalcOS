import type { SimpleInterestInput } from '@calcos/domain-types';

export interface SimpleInterestValidationErrors {
  principal?: string;
  annualRate?: string;
  monthlyRatePer100?: string;
  timeInYears?: string;
}

export interface SimpleInterestValidationResult {
  isValid: boolean;
  errors: SimpleInterestValidationErrors;
}

export function validateSimpleInterestInput(
  input: SimpleInterestInput,
): SimpleInterestValidationResult {
  const errors: SimpleInterestValidationErrors = {};

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

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}