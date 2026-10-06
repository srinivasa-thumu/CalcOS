'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { calculateSimpleInterest } from '@calcos/calculation-core';
import { roundCurrency } from '@calcos/money';
import { validateSimpleInterestInput } from '@calcos/validation';

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

  const handleCalculate = () => {
    const validation = validateSimpleInterestInput({
      principal: Number(principal),
      annualRate: Number(annualRate),
      timeInYears: Number(timeInYears),
    });

    setErrors(validation.errors);

    if (!validation.isValid) {
      setResult(null);
      return;
    }

    const calculation = calculateSimpleInterest({
      principal: Number(principal),
      annualRate: Number(annualRate),
      timeInYears: Number(timeInYears),
    });

    setResult(calculation);
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
              Simple Interest Calculator
            </Typography>

            <Typography color="text.secondary">
              Calculate simple interest and the total amount for your
              investment or loan.
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
            <Card>
              <CardContent>
                <Stack spacing={2}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Result
                  </Typography>

                  <Box>
                    <Typography color="text.secondary">
                      Simple Interest
                    </Typography>

                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      ₹
                      {roundCurrency(result.interest).toLocaleString('en-IN', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography color="text.secondary">
                      Total Amount
                    </Typography>

                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      ₹
                      {roundCurrency(result.totalAmount).toLocaleString('en-IN', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          )}
        </Stack>
      </Box>
    </Container>
  );
}