import type { CompoundingFrequency } from './compounding';

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