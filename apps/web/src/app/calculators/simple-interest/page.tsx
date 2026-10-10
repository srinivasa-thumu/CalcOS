'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import type { DurationMode, InterestRateMode } from '@calcos/domain-types';
import { calculateDuration, calculateSimpleInterest } from '@calcos/calculation-core';
import { validateSimpleInterestInput } from '@calcos/validation';
import { CalculatorNumberField } from '@/components/calculator/CalculatorNumberField';
import { CalculatorPageLayout } from '@/components/calculator/CalculatorPageLayout';
import { CalculatorResult } from '@/components/calculator/CalculatorResult';
import { saveSimpleInterestHistory } from '@/lib/calculationHistory';
import { historyRepository } from '@/lib/history';
import { CalculatorDateField } from '@/components/calculator/CalculatorDateField';

interface FormErrors {
  principal?: string;
  annualRate?: string;
  monthlyRatePer100?: string;
  timeInYears?: string;
  duration?: string;
}

function parseNumber(value: string): number {
  return value.trim() === '' ? Number.NaN : Number(value);
}

export default function SimpleInterestPage() {
  const [principal, setPrincipal] = useState('');
  const [rateMode, setRateMode] = useState<InterestRateMode>('annual');
  const [annualRate, setAnnualRate] = useState('');
  const [monthlyRatePer100, setMonthlyRatePer100] = useState('');

  const [durationMode, setDurationMode] = useState<DurationMode>('manual');
  const [durationYears, setDurationYears] = useState('');
  const [durationMonths, setDurationMonths] = useState('');
  const [durationDays, setDurationDays] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [errors, setErrors] = useState<FormErrors>({});
  const [historySaveError, setHistorySaveError] = useState(false);
  const [result, setResult] = useState<{
    interest: number;
    totalAmount: number;
    annualRateEquivalent?: number;
    durationLabel?: string;
  } | null>(null);

  const resetResult = () => {
    setResult(null);
    setHistorySaveError(false);
  };

  const handleReset = () => {
    setPrincipal('');
    setRateMode('annual');
    setAnnualRate('');
    setMonthlyRatePer100('');
    setDurationMode('manual');
    setDurationYears('');
    setDurationMonths('');
    setDurationDays('');
    setStartDate('');
    setEndDate('');
    setErrors({});
    setResult(null);
    setHistorySaveError(false);
  };

const handleCalculate = async (
  event: React.FormEvent<HTMLFormElement>,
) => {
  event.preventDefault();
  setHistorySaveError(false);

  const rate =
    rateMode === 'annual'
      ? parseNumber(annualRate)
      : parseNumber(monthlyRatePer100);

  const baseInput = {
    principal: parseNumber(principal),
    annualRate: rateMode === 'annual' ? rate : rate * 12,
    monthlyRatePer100:
      rateMode === 'monthly-per-100' ? rate : undefined,
    rateMode,
    durationMode,
    timeInYears: 0,
    ...(durationMode === 'date-range'
      ? {
          startDate,
          endDate,
          dayCountConvention: 'actual/365' as const,
        }
      : {
          durationYears: parseNumber(durationYears),
          durationMonths: parseNumber(durationMonths),
          durationDays: parseNumber(durationDays),
        }),
  };

  let duration;
  let durationError: string | undefined;

  try {
    duration = calculateDuration(
      durationMode === 'date-range'
        ? {
            durationMode,
            startDate,
            endDate,
            dayCountConvention: 'actual/365',
          }
        : {
            durationMode,
            durationYears: parseNumber(durationYears),
            durationMonths: parseNumber(durationMonths),
            durationDays: parseNumber(durationDays),
          },
    );
  } catch (error) {
    durationError =
      error instanceof Error
        ? error.message
        : 'Enter a valid duration.';
  }

  const validationInput = {
    ...baseInput,
    ...(duration ? { ...duration } : {}),
  };

  const validation = validateSimpleInterestInput(validationInput);

  const nextErrors = {
    ...validation.errors,
    ...(durationError ? { duration: durationError } : {}),
  };

  setErrors(nextErrors);

  if (!validation.isValid || !duration) {
    setResult(null);
    return;
  }

  const calculationInput = {
    ...baseInput,
    ...duration,
    durationMode,
    ...(durationMode === 'date-range'
      ? {
          startDate,
          endDate,
          dayCountConvention: 'actual/365' as const,
        }
      : {
          durationYears: parseNumber(durationYears),
          durationMonths: parseNumber(durationMonths),
          durationDays: parseNumber(durationDays),
        }),
  };

  const calculation = calculateSimpleInterest(calculationInput);
  setResult(calculation);

  try {
    await saveSimpleInterestHistory(
      historyRepository,
      calculationInput,
      calculation,
    );
  } catch (error) {
    console.error('Failed to save calculation history.', error);
    setHistorySaveError(true);
  }
};

  return (
    <CalculatorPageLayout
      title="Simple Interest Calculator"
      description="Calculate simple interest using an annual rate or monthly interest per ₹100, with manual duration or calendar dates."
    >
      <Card>
        <CardContent>
          <Box
            component="form"
            aria-label="Simple interest calculator"
            onSubmit={handleCalculate}
            noValidate
          >
            <Stack spacing={3}>
              <CalculatorNumberField
                name="principal"
                label="Principal Amount"
                value={principal}
                error={errors.principal}
                onChange={(value) => {
                  setPrincipal(value);
                  resetResult();
                }}
              />

              <FormControl fullWidth>
                <InputLabel id="rate-mode-label">Interest Rate Type</InputLabel>
                <Select
                  labelId="rate-mode-label"
                  label="Interest Rate Type"
                  name="rateMode"
                  value={rateMode}
                  onChange={(event) => {
                    setRateMode(event.target.value as InterestRateMode);
                    setErrors({});
                    resetResult();
                  }}
                >
                  <MenuItem value="annual">Annual interest rate (%)</MenuItem>
                  <MenuItem value="monthly-per-100">
                    Monthly interest per ₹100
                  </MenuItem>
                </Select>
              </FormControl>

              {rateMode === 'annual' ? (
                <CalculatorNumberField
                  name="annualRate"
                  label="Annual Interest Rate (%)"
                  value={annualRate}
                  error={errors.annualRate}
                  onChange={(value) => {
                    setAnnualRate(value);
                    resetResult();
                  }}
                />
              ) : (
                <CalculatorNumberField
                  name="monthlyRatePer100"
                  label="Monthly Interest per ₹100 (₹)"
                  value={monthlyRatePer100}
                  error={errors.monthlyRatePer100}
                  onChange={(value) => {
                    setMonthlyRatePer100(value);
                    resetResult();
                  }}
                />
              )}

              <FormControl fullWidth>
                <InputLabel id="duration-mode-label">Duration Type</InputLabel>
                <Select
                  labelId="duration-mode-label"
                  label="Duration Type"
                  name="durationMode"
                  value={durationMode}
                  onChange={(event) => {
                    setDurationMode(event.target.value as DurationMode);
                    setErrors({});
                    resetResult();
                  }}
                >
                  <MenuItem value="manual">Enter duration manually</MenuItem>
                  <MenuItem value="date-range">Start and end dates</MenuItem>
                </Select>
              </FormControl>

              {durationMode === 'manual' ? (
                <Stack spacing={2}>
                  <Typography variant="subtitle2">
                    Duration
                  </Typography>
                  <CalculatorNumberField
                    name="durationYears"
                    label="Years"
                    value={durationYears}
                    error={errors.duration}
                    onChange={(value) => {
                      setDurationYears(value);
                      setErrors((current) => ({ ...current, duration: undefined }));
                      resetResult();
                    }}
                  />
                  <CalculatorNumberField
                    name="durationMonths"
                    label="Months (0–11)"
                    value={durationMonths}
                    onChange={(value) => {
                      setDurationMonths(value);
                      setErrors((current) => ({ ...current, duration: undefined }));
                      resetResult();
                    }}
                  />
                  <CalculatorNumberField
                    name="durationDays"
                    label="Days"
                    value={durationDays}
                    onChange={(value) => {
                      setDurationDays(value);
                      setErrors((current) => ({ ...current, duration: undefined }));
                      resetResult();
                    }}
                  />
                  {errors.duration && (
                    <Typography color="error" variant="body2" role="alert">
                      {errors.duration}
                    </Typography>
                  )}
                </Stack>
              ) : (
                <Stack spacing={2}>
                  <CalculatorDateField
  name="startDate"
  label="Start Date"
  value={startDate}
  error={errors.duration}
  onChange={(value) => {
    setStartDate(value);
    setErrors((current) => ({ ...current, duration: undefined }));
    resetResult();
  }}
/>

<CalculatorDateField
  name="endDate"
  label="End Date"
  value={endDate}
  error={errors.duration}
  onChange={(value) => {
    setEndDate(value);
    setErrors((current) => ({ ...current, duration: undefined }));
    resetResult();
  }}
/>
                  <Typography variant="caption" color="text.secondary">
                    Date-based simple interest uses Actual/365. Enter dates as
                    YYYY-MM-DD.
                  </Typography>
                  {errors.duration && (
                    <Typography color="error" variant="body2" role="alert">
                      {errors.duration}
                    </Typography>
                  )}
                </Stack>
              )}

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button type="submit" variant="contained" size="large" fullWidth>
                  Calculate
                </Button>
                <Button
                  type="button"
                  variant="outlined"
                  size="large"
                  fullWidth
                  onClick={handleReset}
                >
                  Reset
                </Button>
              </Stack>
            </Stack>
          </Box>
        </CardContent>
      </Card>

      {result && (
        <Box aria-live="polite">
          <CalculatorResult
            interestLabel="Simple Interest"
            interest={result.interest}
            totalAmount={result.totalAmount}
            durationLabel={result.durationLabel}
            annualRateEquivalent={result.annualRateEquivalent}
          />
        </Box>
      )}

      {historySaveError && (
        <Typography role="status" color="warning.main">
          Calculation completed, but it could not be saved to history.
        </Typography>
      )}
    </CalculatorPageLayout>
  );
}