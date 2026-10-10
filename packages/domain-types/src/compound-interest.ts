import type { CompoundingFrequency } from './compounding';
import type { DurationInput, InterestRateInput } from './interest-options';

export interface CompoundInterestInput
  extends DurationInput,
    InterestRateInput {
  principal: number;
  annualRate: number;
  timeInYears: number;
  compoundingFrequency: CompoundingFrequency;
}

export interface CompoundInterestResult {
  interest: number;
  totalAmount: number;
  annualRateEquivalent?: number;
  durationLabel?: string;
}