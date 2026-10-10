'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import type {
  CompoundingFrequency,
  DurationMode,
  InterestRateMode,
} from '@calcos/domain-types';
import {
  calculateCompoundInterest,
  calculateDuration,
} from '@calcos/calculation-core';
import { validateCompoundInterestInput } from '@calcos/validation';
import { CalculatorDateField } from '@/components/calculator/CalculatorDateField';
import { CalculatorNumberField } from '@/components/calculator/CalculatorNumberField';
import { CalculatorPageLayout } from '@/components/calculator/CalculatorPageLayout';
import { CalculatorResult } from '@/components/calculator/CalculatorResult';
import { saveCompoundInterestHistory } from '@/lib/calculationHistory';
import { historyRepository } from '@/lib/history';

interface FormErrors {
  principal?: string;
  annualRate?: string;
  monthlyRatePer100?: string;
  timeInYears?: string;
  compoundingFrequency?: string;
  duration?: string;
}

const frequencyOptions: {
  value: CompoundingFrequency;
  label: string;
}[] = [
  { value: 'annually', label: 'Annually' },
  { value: 'semi-annually', label: 'Semi-annually' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'daily', label: 'Daily' },
];

function parseNumber(value: string): number {
  return value.trim() === '' ? Number.NaN : Number(value);
}

export default function CompoundInterestPage() {
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

  const [compoundingFrequency, setCompoundingFrequency] =
    useState<CompoundingFrequency>('annually');

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
    setCompoundingFrequency('annually');
    setErrors({});
    setResult(null);
    setHistorySaveError(false);
  };

const handleCalculate = async (
  event: React.FormEvent<HTMLFormElement>,
) => {
  event.preventDefault();
  setHistorySaveError(false);

  const enteredRate =
    rateMode === 'annual'
      ? parseNumber(annualRate)
      : parseNumber(monthlyRatePer100);

  const baseInput = {
    principal: parseNumber(principal),
    annualRate:
      rateMode === 'annual' ? enteredRate : enteredRate * 12,
    monthlyRatePer100:
      rateMode === 'monthly-per-100' ? enteredRate : undefined,
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
    compoundingFrequency,
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

  const validation = validateCompoundInterestInput(validationInput);

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
    compoundingFrequency,
  };

  const calculation = calculateCompoundInterest(calculationInput);
  setResult(calculation);

  try {
    await saveCompoundInterestHistory(
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
      title="Compound Interest Calculator"
      description="Calculate compound interest using annual rates or monthly interest per ₹100, with flexible duration and compounding options."
    >
      <Card>
        <CardContent>
          <Box
            component="form"
            aria-label="Compound interest calculator"
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
                <InputLabel id="compound-rate-mode-label">
                  Interest Rate Type
                </InputLabel>
                <Select
                  name="rateMode"
                  labelId="compound-rate-mode-label"
                  label="Interest Rate Type"
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
                <InputLabel id="compound-duration-mode-label">
                  Duration Type
                </InputLabel>
                <Select
                  name="durationMode"
                  labelId="compound-duration-mode-label"
                  label="Duration Type"
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
                  <Typography variant="subtitle2">Duration</Typography>
                  <CalculatorNumberField
                    name="durationYears"
                    label="Years"
                    value={durationYears}
                    onChange={(value) => {
                      setDurationYears(value);
                      setErrors((current) => ({
                        ...current,
                        duration: undefined,
                      }));
                      resetResult();
                    }}
                  />
                  <CalculatorNumberField
                    name="durationMonths"
                    label="Months (0–11)"
                    value={durationMonths}
                    onChange={(value) => {
                      setDurationMonths(value);
                      setErrors((current) => ({
                        ...current,
                        duration: undefined,
                      }));
                      resetResult();
                    }}
                  />
                  <CalculatorNumberField
                    name="durationDays"
                    label="Days"
                    value={durationDays}
                    onChange={(value) => {
                      setDurationDays(value);
                      setErrors((current) => ({
                        ...current,
                        duration: undefined,
                      }));
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
                      setErrors((current) => ({
                        ...current,
                        duration: undefined,
                      }));
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
                      setErrors((current) => ({
                        ...current,
                        duration: undefined,
                      }));
                      resetResult();
                    }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    Date-based calculations use Actual/365 for the year
                    fraction.
                  </Typography>
                  {errors.duration && (
                    <Typography color="error" variant="body2" role="alert">
                      {errors.duration}
                    </Typography>
                  )}
                </Stack>
              )}

              <FormControl
                fullWidth
                error={Boolean(errors.compoundingFrequency)}
              >
                <InputLabel id="compounding-frequency-label">
                  Compounding Frequency
                </InputLabel>
                <Select
                  name="compoundingFrequency"
                  labelId="compounding-frequency-label"
                  value={compoundingFrequency}
                  label="Compounding Frequency"
                  onChange={(event) => {
                    setCompoundingFrequency(
                      event.target.value as CompoundingFrequency,
                    );
                    setErrors((current) => ({
                      ...current,
                      compoundingFrequency: undefined,
                    }));
                    resetResult();
                  }}
                >
                  {frequencyOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                {errors.compoundingFrequency && (
                  <FormHelperText>
                    {errors.compoundingFrequency}
                  </FormHelperText>
                )}
              </FormControl>

              {rateMode === 'monthly-per-100' && (
                <Typography variant="caption" color="text.secondary">
                  With monthly compounding, this is applied as the monthly
                  periodic rate. For other frequencies, the rate is converted
                  to a nominal annual equivalent by multiplying by 12.
                </Typography>
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
            interestLabel="Compound Interest"
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