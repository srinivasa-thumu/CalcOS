import type {
  CompoundInterestInput,
  CompoundInterestResult,
} from './compound-interest';

import type {
  SimpleInterestInput,
  SimpleInterestResult,
} from './simple-interest';

export type CalculatorType =
  | 'simple-interest'
  | 'compound-interest';

export interface SimpleInterestHistoryRecord {
  id: string;
  calculatorType: 'simple-interest';
  inputs: SimpleInterestInput;
  result: SimpleInterestResult;
  createdAt: string;
}

export interface CompoundInterestHistoryRecord {
  id: string;
  calculatorType: 'compound-interest';
  inputs: CompoundInterestInput;
  result: CompoundInterestResult;
  createdAt: string;
}

export type CalculationHistoryRecord =
  | SimpleInterestHistoryRecord
  | CompoundInterestHistoryRecord;