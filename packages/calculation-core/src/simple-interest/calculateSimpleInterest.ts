import type {
  SimpleInterestInput,
  SimpleInterestResult,
} from '@calcos/domain-types';

export function calculateSimpleInterest(
  input: SimpleInterestInput,
): SimpleInterestResult {
  const {
    principal,
    annualRate,
    timeInYears,
    rateMode = 'annual',
    monthlyRatePer100,
    durationLabel,
  } = input;

  const effectiveAnnualRate =
    rateMode === 'monthly-per-100'
      ? (monthlyRatePer100 ?? 0) * 12
      : annualRate;

  const interest =
    principal * (effectiveAnnualRate / 100) * timeInYears;
  const totalAmount = principal + interest;

  if (!Number.isFinite(interest) || !Number.isFinite(totalAmount)) {
    throw new RangeError(
      'Calculation result exceeds the supported numeric range.',
    );
  }

  return {
    interest,
    totalAmount,
    annualRateEquivalent: effectiveAnnualRate,
    ...(durationLabel ? { durationLabel } : {}),
  };
}