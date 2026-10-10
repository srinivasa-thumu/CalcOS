export type InterestRateMode = 'annual' | 'monthly-per-100';

export type DurationMode = 'manual' | 'date-range';

export type DayCountConvention = 'actual/365';

export interface DurationInput {
  durationMode?: DurationMode;
  durationYears?: number;
  durationMonths?: number;
  durationDays?: number;
  startDate?: string;
  endDate?: string;
  dayCountConvention?: DayCountConvention;
  durationLabel?: string;
}

export interface InterestRateInput {
  rateMode?: InterestRateMode;
  monthlyRatePer100?: number;
}