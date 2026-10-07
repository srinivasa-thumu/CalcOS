import type { CompoundingFrequency } from '@calcos/domain-types';

import type {
  CompoundInterestInput,
  CompoundInterestResult,
} from '@calcos/domain-types';

const compoundsPerYear: Record<CompoundingFrequency, number> = {
  annually: 1,
  'semi-annually': 2,
  quarterly: 4,
  monthly: 12,
  daily: 365,
};

export function calculateCompoundInterest(
  input: CompoundInterestInput,
): CompoundInterestResult {
  const {
    principal,
    annualRate,
    timeInYears,
    compoundingFrequency,
  } = input;

  const n = compoundsPerYear[compoundingFrequency];
  const rate = annualRate / 100;

  const totalAmount =
    principal * Math.pow(1 + rate / n, n * timeInYears);

  const interest = totalAmount - principal;

  return {
    interest,
    totalAmount,
  };
}