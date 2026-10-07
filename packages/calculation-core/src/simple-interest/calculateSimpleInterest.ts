import type {
  SimpleInterestInput,
  SimpleInterestResult,
} from '@calcos/domain-types';

export function calculateSimpleInterest(
  input: SimpleInterestInput,
): SimpleInterestResult {
  const { principal, annualRate, timeInYears } = input;

  const interest = principal * (annualRate / 100) * timeInYears;

  return {
    interest,
    totalAmount: principal + interest,
  };
}