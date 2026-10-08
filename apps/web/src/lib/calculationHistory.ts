import type {
  CalculationHistoryRecord,
  CompoundInterestInput,
  CompoundInterestResult,
  HistoryRepository,
  SimpleInterestInput,
  SimpleInterestResult,
} from '@calcos/domain-types';

export async function saveSimpleInterestHistory(
  repository: HistoryRepository,
  input: SimpleInterestInput,
  result: SimpleInterestResult,
): Promise<void> {
  const record: CalculationHistoryRecord = {
    id: crypto.randomUUID(),
    calculatorType: 'simple-interest',
    inputs: input,
    result,
    createdAt: new Date().toISOString(),
  };

  await repository.save(record);
}

export async function saveCompoundInterestHistory(
  repository: HistoryRepository,
  input: CompoundInterestInput,
  result: CompoundInterestResult,
): Promise<void> {
  const record: CalculationHistoryRecord = {
    id: crypto.randomUUID(),
    calculatorType: 'compound-interest',
    inputs: input,
    result,
    createdAt: new Date().toISOString(),
  };

  await repository.save(record);
}