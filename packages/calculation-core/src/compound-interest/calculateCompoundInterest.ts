export type CompoundingFrequency =
  | 'annually'
  | 'semi-annually'
  | 'quarterly'
  | 'monthly'
  | 'daily';

export interface CompoundInterestInput {
  principal: number;
  annualRate: number;
  timeInYears: number;
  compoundingFrequency: CompoundingFrequency;
}

export interface CompoundInterestResult {
  interest: number;
  totalAmount: number;
}

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