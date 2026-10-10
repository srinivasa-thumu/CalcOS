import { describe, expect, it } from 'vitest';
import { calculateDuration } from './duration';

describe('calculateDuration', () => {
  it('converts a manual duration to a year fraction', () => {
    expect(
      calculateDuration({
        durationMode: 'manual',
        durationYears: 2,
        durationMonths: 4,
        durationDays: 32,
      }),
    ).toMatchObject({
      years: 2,
      months: 4,
      days: 32,
      timeInYears: 2 + 4 / 12 + 32 / 365,
      durationLabel: '2y, 4m, 32 days',
    });
  });

  it('calculates calendar duration from dates', () => {
    expect(
      calculateDuration({
        durationMode: 'date-range',
        startDate: '2024-01-01',
        endDate: '2026-05-03',
      }),
    ).toMatchObject({
      years: 2,
      months: 4,
      days: 2,
      durationLabel: '2y, 4m, 2 days',
    });
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