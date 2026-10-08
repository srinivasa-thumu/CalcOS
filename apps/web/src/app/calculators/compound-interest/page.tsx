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
} from '@mui/material';

import { calculateCompoundInterest } from '@calcos/calculation-core';
import type { CompoundingFrequency } from '@calcos/domain-types';
import { CalculatorResult } from '@/components/calculator/CalculatorResult';
import { validateCompoundInterestInput } from '@calcos/validation';
import { saveCompoundInterestHistory } from '@/lib/calculationHistory';
import { CalculatorNumberField } from '@/components/calculator/CalculatorNumberField';
import { historyRepository } from '@/lib/history';
import { CalculatorPageLayout } from '@/components/calculator/CalculatorPageLayout';

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

  const handleInputChange = (
    field: keyof FormErrors,
    value: string,
    setter: (value: string) => void,
  ) => {
    setter(value);

    setErrors((currentErrors) => {
      if (!currentErrors[field]) {
        return currentErrors;
      }

      const nextErrors = { ...currentErrors };
      delete nextErrors[field];

      return nextErrors;
    });

    setResult(null);
  };

  const handleFrequencyChange = (value: CompoundingFrequency) => {
    setCompoundingFrequency(value);

    setErrors((currentErrors) => {
      if (!currentErrors.compoundingFrequency) {
        return currentErrors;
      }

      const nextErrors = { ...currentErrors };
      delete nextErrors.compoundingFrequency;

      return nextErrors;
    });

    setResult(null);
  };

  const handleCalculate = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const input = {
      principal: Number(principal),
      annualRate: Number(annualRate),
      timeInYears: Number(timeInYears),
      compoundingFrequency,
    };

    const validation = validateCompoundInterestInput(input);

    setErrors(validation.errors);

    if (!validation.isValid) {
      setResult(null);
      return;
    }

    const calculation = calculateCompoundInterest(input);

    setResult(calculation);

    try {
    await saveCompoundInterestHistory(
  historyRepository,
  input,
  calculation,
);
    } catch (error) {
    console.error(
        'Failed to save calculation history.',
        error,
    );
    }
  };

  return (
    <CalculatorPageLayout
  title="Compound Interest Calculator"
  description="Calculate compound interest and the total amount based on your investment, interest rate, time period and compounding frequency."
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
                    onChange={(value) =>
                        handleInputChange('principal', value, setPrincipal)
                    }
                    />

                    <CalculatorNumberField
                    name="annualRate"
                    label="Annual Interest Rate (%)"
                    value={annualRate}
                    error={errors.annualRate}
                    onChange={(value) =>
                        handleInputChange('annualRate', value, setAnnualRate)
                    }
                    />

                    <CalculatorNumberField
                    name="timeInYears"
                    label="Time (Years)"
                    value={timeInYears}
                    error={errors.timeInYears}
                    onChange={(value) =>
                        handleInputChange('timeInYears', value, setTimeInYears)
                    }
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
      handleFrequencyChange(
        event.target.value as CompoundingFrequency,
      )
    }
  >
    {frequencyOptions.map((option) => (
      <MenuItem
        key={option.value}
        value={option.value}
      >
        {option.label}
      </MenuItem>
    ))}
  </Select>

  {errors.compoundingFrequency && (
    <Box
      component="span"
      sx={{
        color: 'error.main',
        fontSize: '0.75rem',
        mt: 0.5,
        ml: 1.75,
      }}
    >
      {errors.compoundingFrequency}
    </Box>
  )}
</FormControl>

                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                  >
                    Calculate
                  </Button>
                </Stack>
              </Box>
            </CardContent>
          </Card>

  {result && (
    <CalculatorResult
      interestLabel="Compound Interest"
      interest={result.interest}
      totalAmount={result.totalAmount}
    />
  )}
</CalculatorPageLayout>
  );
}