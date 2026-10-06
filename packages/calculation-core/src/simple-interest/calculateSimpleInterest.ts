export interface SimpleInterestInput {
  principal: number;
  annualRate: number;
  timeInYears: number;
}

export interface SimpleInterestResult {
  interest: number;
  totalAmount: number;
}

export function calculateSimpleInterest(
  input: SimpleInterestInput,
): SimpleInterestResult {
  const { principal, annualRate, timeInYears } = input;

  const interest = principal * (annualRate / 100) * timeInYears;

  return {
    interest,
    totalAmount: principal + interest,
  };
}