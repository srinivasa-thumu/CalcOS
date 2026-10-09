'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
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
  const [historySaveError, setHistorySaveError] = useState(false);
  const [result, setResult] = useState<{
    interest: number;
    totalAmount: number;
  } | null>(null);

  const handleInputChange = (
    field: keyof FormErrors,
    value: string,
    setter: (value: string) => void,
  ) => {
    setHistorySaveError(false);
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

  const handleReset = () => {
  setPrincipal('');
  setAnnualRate('');
  setTimeInYears('');
  setErrors({});
  setResult(null);
  setHistorySaveError(false);
};

  const handleCalculate = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    setHistorySaveError(false);
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
    setHistorySaveError(true);
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

                  <Stack
  direction={{ xs: 'column', sm: 'row' }}
  spacing={2}
>
  <Button
    type="submit"
    variant="contained"
    size="large"
    fullWidth
  >
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