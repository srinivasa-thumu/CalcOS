
import AsyncStorage from '@react-native-async-storage/async-storage';

import type { CalculationHistoryEntry } from '../history/history.types';

const STORAGE_KEY = '@calcos/calculation-history';
const MAX_HISTORY_ENTRIES = 100;

export async function getCalculationHistory(): Promise<
  CalculationHistoryEntry[]
> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return [];
    }

    // Basic structural validation protects the UI from malformed stored data.
    return parsed.filter(isHistoryEntry);
  } catch {
    return [];
  }
}

export async function saveCalculationHistoryEntry(
  entry: CalculationHistoryEntry,
): Promise<CalculationHistoryEntry[]> {
  const current = await getCalculationHistory();

  const updated = [
    entry,
    ...current.filter((item) => item.id !== entry.id),
  ].slice(0, MAX_HISTORY_ENTRIES);

  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

  return updated;
}

export async function deleteCalculationHistoryEntry(
  id: string,
): Promise<CalculationHistoryEntry[]> {
  const current = await getCalculationHistory();
  const updated = current.filter((item) => item.id !== id);

  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

  return updated;
}

export async function clearCalculationHistory(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}

function isHistoryEntry(value: unknown): value is CalculationHistoryEntry {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const entry = value as Partial<CalculationHistoryEntry>;

  return (
    typeof entry.id === 'string' &&
    (entry.type === 'simple-interest' ||
      entry.type === 'compound-interest') &&
    typeof entry.createdAt === 'string' &&
    typeof entry.principal === 'number' &&
    typeof entry.interest === 'number' &&
    typeof entry.totalAmount === 'number' &&
    (entry.rateMode === 'annual' ||
      entry.rateMode === 'monthly-per-100') &&
    typeof entry.annualRate === 'number' &&
    typeof entry.durationLabel === 'string' &&
    (entry.durationMode === 'manual' ||
      entry.durationMode === 'date-range')
  );
}
