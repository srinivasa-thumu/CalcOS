'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
} from '@mui/material';
import { calculateSimpleInterest } from '@calcos/calculation-core';
import { validateSimpleInterestInput } from '@calcos/validation';
import { CalculatorResult } from '@/components/calculator/CalculatorResult';
import { saveSimpleInterestHistory } from '@/lib/calculationHistory';
import { CalculatorNumberField } from '@/components/calculator/CalculatorNumberField';
import { historyRepository } from '@/lib/history';
import { CalculatorPageLayout } from '@/components/calculator/CalculatorPageLayout';

interface FormErrors {
  principal?: string;
  annualRate?: string;
  timeInYears?: string;
}

export default function SimpleInterestPage() {
  const [principal, setPrincipal] = useState('');
  const [annualRate, setAnnualRate] = useState('');
  const [timeInYears, setTimeInYears] = useState('');

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

  const handleCalculate = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const input = {
      principal: Number(principal),
      annualRate: Number(annualRate),
      timeInYears: Number(timeInYears),
    };

    const validation = validateSimpleInterestInput(input);

    setErrors(validation.errors);

    if (!validation.isValid) {
      setResult(null);
      return;
    }

    const calculation = calculateSimpleInterest(input);

    setResult(calculation);

    try {
    await saveSimpleInterestHistory(
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
  title="Simple Interest Calculator"
  description="Calculate simple interest and the total amount for your investment or loan."
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
      interestLabel="Simple Interest"
      interest={result.interest}
      totalAmount={result.totalAmount}
    />
  )}
</CalculatorPageLayout>
  );
}