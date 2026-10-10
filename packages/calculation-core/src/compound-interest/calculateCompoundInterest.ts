import type {
  CompoundInterestInput,
  CompoundInterestResult,
  CompoundingFrequency,
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
    rateMode = 'annual',
    monthlyRatePer100,
    durationLabel,
  } = input;

  const n = compoundsPerYear[compoundingFrequency];

  // Monthly-per-100 is already a monthly periodic rate when
  // compounding monthly. Otherwise use its nominal annual equivalent.
  const periodicRate =
    rateMode === 'monthly-per-100' && compoundingFrequency === 'monthly'
      ? (monthlyRatePer100 ?? 0) / 100
      : (rateMode === 'monthly-per-100'
          ? (monthlyRatePer100 ?? 0) * 12
          : annualRate) /
        100 /
        n;

  const totalAmount = principal * Math.pow(1 + periodicRate, n * timeInYears);
  const interest = totalAmount - principal;

  if (!Number.isFinite(interest) || !Number.isFinite(totalAmount)) {
    throw new RangeError(
      'Calculation result exceeds the supported numeric range.',
    );
  }

  return {
    interest,
    totalAmount,
    annualRateEquivalent:
      rateMode === 'monthly-per-100'
        ? (monthlyRatePer100 ?? 0) * 12
        : annualRate,
    ...(durationLabel ? { durationLabel } : {}),
  };
}