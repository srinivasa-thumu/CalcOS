import type { CalculationHistoryRecord } from './history';

export interface HistoryRepository {
  save(record: CalculationHistoryRecord): Promise<void>;

  getAll(): Promise<CalculationHistoryRecord[]>;

  getById(id: string): Promise<CalculationHistoryRecord | null>;

  delete(id: string): Promise<void>;

  clear(): Promise<void>;
}