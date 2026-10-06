export interface SimpleInterestValidationInput {
  principal: number;
  annualRate: number;
  timeInYears: number;
}

export interface SimpleInterestValidationResult {
  isValid: boolean;
  errors: {
    principal?: string;
    annualRate?: string;
    timeInYears?: string;
  };
}

export function validateSimpleInterestInput(
  input: SimpleInterestValidationInput,
): SimpleInterestValidationResult {
  const errors: SimpleInterestValidationResult['errors'] = {};

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

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}