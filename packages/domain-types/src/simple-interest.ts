export interface SimpleInterestInput {
  principal: number;
  annualRate: number;
  timeInYears: number;
}

export interface SimpleInterestResult {
  interest: number;
  totalAmount: number;
}