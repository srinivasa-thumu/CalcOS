import 'fake-indexeddb/auto';

import { beforeEach, describe, expect, it } from 'vitest';

import type { CalculationHistoryRecord } from '@calcos/domain-types';

import { IndexedDbHistoryRepository } from './indexedDbHistoryRepository';

function createRecord(): CalculationHistoryRecord {
  return {
    id: crypto.randomUUID(),
    calculatorType: 'simple-interest',
    inputs: {
      principal: 100000,
      annualRate: 10,
      timeInYears: 2,
    },
    result: {
      interest: 20000,
      totalAmount: 120000,
    },
    createdAt: new Date().toISOString(),
  };
}

describe('IndexedDbHistoryRepository', () => {
    beforeEach(async () => {
    const request = indexedDB.deleteDatabase('calcos');

    await new Promise<void>((resolve, reject) => {
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
      request.onblocked = () => resolve();
    });
  });

  it('saves and retrieves a calculation', async () => {
    const repository = new IndexedDbHistoryRepository();
    const record = createRecord();

    await repository.save(record);

    const result = await repository.getById(record.id);

    expect(result).toEqual(record);
  });

  it('returns all saved calculations', async () => {
    const repository = new IndexedDbHistoryRepository();

    const first = createRecord();
    const second = createRecord();

    await repository.save(first);
    await repository.save(second);

    const result = await repository.getAll();

    expect(result).toHaveLength(2);
    expect(result).toEqual(
      expect.arrayContaining([first, second]),
    );
  });

  it('deletes a calculation', async () => {
    const repository = new IndexedDbHistoryRepository();
    const record = createRecord();

    await repository.save(record);
    await repository.delete(record.id);

    const result = await repository.getById(record.id);

    expect(result).toBeNull();
  });

  it('clears all calculations', async () => {
    const repository = new IndexedDbHistoryRepository();

    await repository.save(createRecord());
    await repository.save(createRecord());

    await repository.clear();

    const result = await repository.getAll();

    expect(result).toEqual([]);
  });

  it('returns null for a missing calculation', async () => {
    const repository = new IndexedDbHistoryRepository();

    const result = await repository.getById('does-not-exist');

    expect(result).toBeNull();
  });
});