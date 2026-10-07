'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import { calculateCompoundInterest } from '@calcos/calculation-core';
import type { CompoundingFrequency } from '@calcos/domain-types';
import { CalculatorResult } from '@/components/calculator/CalculatorResult';
import { validateCompoundInterestInput } from '@calcos/validation';
import { historyRepository } from '@/lib/history';

interface FormErrors {
  principal?: string;
  annualRate?: string;
  timeInYears?: string;
  compoundingFrequency?: string;
}

const frequencyOptions: {
  value: CompoundingFrequency;
  label: string;
}[] = [
  {
    value: 'annually',
    label: 'Annually',
  },
  {
    value: 'semi-annually',
    label: 'Semi-annually',
  },
  {
    value: 'quarterly',
    label: 'Quarterly',
  },
  {
    value: 'monthly',
    label: 'Monthly',
  },
  {
    value: 'daily',
    label: 'Daily',
  },
];

export default function CompoundInterestPage() {
  const [principal, setPrincipal] = useState('');
  const [annualRate, setAnnualRate] = useState('');
  const [timeInYears, setTimeInYears] = useState('');
  const [compoundingFrequency, setCompoundingFrequency] =
    useState<CompoundingFrequency>('annually');

  const [errors, setErrors] = useState<FormErrors>({});

  const [result, setResult] = useState<{
    interest: number;
    totalAmount: number;
  } | null>(null);

  const handleCalculate = async () => {
    const validation = validateCompoundInterestInput({
      principal: Number(principal),
      annualRate: Number(annualRate),
      timeInYears: Number(timeInYears),
      compoundingFrequency,
    });

    setErrors(validation.errors);

    if (!validation.isValid) {
      setResult(null);
      return;
    }

    const calculation = calculateCompoundInterest({
      principal: Number(principal),
      annualRate: Number(annualRate),
      timeInYears: Number(timeInYears),
      compoundingFrequency,
    });

    setResult(calculation);
    try {
    await historyRepository.save({
        id: crypto.randomUUID(),
        calculatorType: 'compound-interest',
        inputs: {
        principal: Number(principal),
        annualRate: Number(annualRate),
        timeInYears: Number(timeInYears),
        compoundingFrequency,
        },
        result: calculation,
        createdAt: new Date().toISOString(),
    });
    } catch (error) {
    console.error('Failed to save calculation history.', error);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: { xs: 4, md: 8 } }}>
        <Stack spacing={4}>
          <Box>
            <Typography
              component="h1"
              variant="h3"
              sx={{
                fontWeight: 700,
                mb: 1,
              }}
            >
              Compound Interest Calculator
            </Typography>

            <Typography color="text.secondary">
              Calculate compound interest and the total amount based on your
              investment, interest rate, time period and compounding frequency.
            </Typography>
          </Box>

          <Card>
            <CardContent>
              <Stack spacing={3}>
                <TextField
                  label="Principal Amount"
                  type="number"
                  value={principal}
                  onChange={(event) => setPrincipal(event.target.value)}
                  error={Boolean(errors.principal)}
                  helperText={errors.principal}
                  slotProps={{
                    htmlInput: {
                      min: 0,
                      step: '0.01',
                    },
                  }}
                />

                <TextField
                  label="Annual Interest Rate (%)"
                  type="number"
                  value={annualRate}
                  onChange={(event) => setAnnualRate(event.target.value)}
                  error={Boolean(errors.annualRate)}
                  helperText={errors.annualRate}
                  slotProps={{
                    htmlInput: {
                      min: 0,
                      step: '0.01',
                    },
                  }}
                />

                <TextField
                  label="Time (Years)"
                  type="number"
                  value={timeInYears}
                  onChange={(event) => setTimeInYears(event.target.value)}
                  error={Boolean(errors.timeInYears)}
                  helperText={errors.timeInYears}
                  slotProps={{
                    htmlInput: {
                      min: 0,
                      step: '0.01',
                    },
                  }}
                />

                <FormControl
                  fullWidth
                  error={Boolean(errors.compoundingFrequency)}
                >
                  <InputLabel id="compounding-frequency-label">
                    Compounding Frequency
                  </InputLabel>

                  <Select
                    labelId="compounding-frequency-label"
                    value={compoundingFrequency}
                    label="Compounding Frequency"
                    onChange={(event) =>
                      setCompoundingFrequency(
                        event.target.value as CompoundingFrequency,
                      )
                    }
                  >
                    {frequencyOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>

                  {errors.compoundingFrequency && (
                    <Typography
                      variant="caption"
                      color="error"
                      sx={{ mt: 0.5, ml: 1.75 }}
                    >
                      {errors.compoundingFrequency}
                    </Typography>
                  )}
                </FormControl>

                <Button
                  variant="contained"
                  size="large"
                  onClick={handleCalculate}
                >
                  Calculate
                </Button>
              </Stack>
            </CardContent>
          </Card>

          {result && (
            <CalculatorResult
                interestLabel="Compound Interest"
                interest={result.interest}
                totalAmount={result.totalAmount}
            />
            )}
        </Stack>
      </Box>
    </Container>
  );
}