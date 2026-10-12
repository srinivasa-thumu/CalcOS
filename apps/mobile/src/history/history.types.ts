
export type CalculationType = 'simple-interest' | 'compound-interest';

export interface CalculationHistoryEntry {
  id: string;
  type: CalculationType;
  createdAt: string;

  principal: number;
  interest: number;
  totalAmount: number;

  rateMode: 'annual' | 'monthly-per-100';
  annualRate: number;
  monthlyRatePer100?: number;

  durationLabel: string;
  durationMode: 'manual' | 'date-range';

  compoundingFrequency?: 
    | 'annually'
    | 'semi-annually'
    | 'quarterly'
    | 'monthly'
    | 'daily';
}
