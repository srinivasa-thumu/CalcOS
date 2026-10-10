import { describe, expect, it } from 'vitest';
import { calculateDuration } from './duration';

describe('calculateDuration', () => {
  it('converts a manual duration to a year fraction', () => {
    const result = calculateDuration({
      durationMode: 'manual',
      durationYears: 2,
      durationMonths: 4,
      durationDays: 32,
    });

    expect(result).toMatchObject({
      years: 2,
      months: 4,
      days: 32,
      durationLabel: '2y, 4m, 32 days',
    });

    expect(result.timeInYears).toBeCloseTo(2 + 4 / 12 + 32 / 365, 10);
  });

  it('calculates calendar duration from dates', () => {
    const result = calculateDuration({
      durationMode: 'date-range',
      startDate: '2024-01-01',
      endDate: '2026-05-03',
    });

    expect(result).toMatchObject({
      years: 2,
      months: 4,
      days: 2,
      durationLabel: '2y, 4m, 2 days',
    });

    expect(result.timeInYears).toBeCloseTo(853 / 365, 10);
  });

  it('rejects invalid dates', () => {
    expect(() =>
      calculateDuration({
        durationMode: 'date-range',
        startDate: '2025-02-30',
        endDate: '2025-03-01',
      }),
    ).toThrow('Enter a valid calendar date.');
  });

  it('rejects an end date before the start date', () => {
    expect(() =>
      calculateDuration({
        durationMode: 'date-range',
        startDate: '2025-04-02',
        endDate: '2025-04-01',
      }),
    ).toThrow('End date must be on or after start date.');
  });

  it('supports a zero-length date range', () => {
    expect(
      calculateDuration({
        durationMode: 'date-range',
        startDate: '2025-04-02',
        endDate: '2025-04-02',
      }),
    ).toMatchObject({
      years: 0,
      months: 0,
      days: 0,
      timeInYears: 0,
      durationLabel: '0 days',
    });
  });
});
