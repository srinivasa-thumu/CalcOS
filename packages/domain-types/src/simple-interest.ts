import type { DurationInput, InterestRateInput } from './interest-options';

export interface SimpleInterestInput
  extends DurationInput,
    InterestRateInput {
  principal: number;
  annualRate: number;
  timeInYears: number;
}

export interface SimpleInterestResult {
  interest: number;
  totalAmount: number;
  annualRateEquivalent?: number;
  durationLabel?: string;
}