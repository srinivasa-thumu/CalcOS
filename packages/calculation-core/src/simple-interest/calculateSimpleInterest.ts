import type {
  SimpleInterestInput,
  SimpleInterestResult,
} from '@calcos/domain-types';

export function calculateSimpleInterest(
  input: SimpleInterestInput,
): SimpleInterestResult {
  const { principal, annualRate, timeInYears } = input;

  const interest = principal * (annualRate / 100) * timeInYears;
  const totalAmount = principal + interest;
  if (!Number.isFinite(interest) || !Number.isFinite(totalAmount)) {
    throw new RangeError('Calculation result exceeds the supported numeric range.');
  }
  return {
    interest,
    totalAmount,
  };
}