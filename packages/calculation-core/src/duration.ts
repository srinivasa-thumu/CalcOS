import type { DurationInput } from '@calcos/domain-types';

export interface DurationResult {
  years: number;
  months: number;
  days: number;
  timeInYears: number;
  durationLabel: string;
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function parseDate(value: string): Date {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (!match) {
    throw new RangeError('Enter a valid date.');
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    throw new RangeError('Enter a valid calendar date.');
  }

  return date;
}

function daysInMonth(year: number, monthIndex: number): number {
  return new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
}

function addCalendarMonths(date: Date, months: number): Date {
  const absoluteMonth = date.getUTCFullYear() * 12 + date.getUTCMonth() + months;
  const year = Math.floor(absoluteMonth / 12);
  const month = absoluteMonth % 12;
  const day = Math.min(date.getUTCDate(), daysInMonth(year, month));

  return new Date(Date.UTC(year, month, day));
}

function formatDuration(years: number, months: number, days: number): string {
  const parts: string[] = [];

  if (years > 0) parts.push(`${years}y`);
  if (months > 0) parts.push(`${months}m`);
  if (days > 0 || parts.length === 0) parts.push(`${days} days`);

  return parts.join(', ');
}

export function calculateDuration(input: DurationInput): DurationResult {
  let years: number;
  let months: number;
  let days: number;
  let elapsedDays: number;

  if (input.durationMode === 'date-range') {
    if (!input.startDate || !input.endDate) {
      throw new RangeError('Start date and end date are required.');
    }

    const start = parseDate(input.startDate);
    const end = parseDate(input.endDate);

    if (end.getTime() < start.getTime()) {
      throw new RangeError('End date must be on or after start date.');
    }

    elapsedDays = (end.getTime() - start.getTime()) / MS_PER_DAY;

    let cursor = new Date(start);
    years = 0;
    months = 0;
    days = 0;

    while (addCalendarMonths(cursor, 12).getTime() <= end.getTime()) {
      cursor = addCalendarMonths(cursor, 12);
      years += 1;
    }

    while (addCalendarMonths(cursor, 1).getTime() <= end.getTime()) {
      cursor = addCalendarMonths(cursor, 1);
      months += 1;
    }

    days = Math.round((end.getTime() - cursor.getTime()) / MS_PER_DAY);
  } else {
    const values = [input.durationYears, input.durationMonths, input.durationDays];

    if (values.some((value) => value === undefined || !Number.isInteger(value))) {
      throw new RangeError('Enter whole numbers for years, months, and days.');
    }

    years = input.durationYears!;
    months = input.durationMonths!;
    days = input.durationDays!;

    if (years < 0 || months < 0 || months > 11 || days < 0) {
      throw new RangeError('Enter non-negative years, months from 0 to 11, and non-negative days.');
    }

    elapsedDays = years * 365 + months * (365 / 12) + days;
  }

  return {
    years,
    months,
    days,
    timeInYears: elapsedDays / 365,
    durationLabel: formatDuration(years, months, days),
  };
}
