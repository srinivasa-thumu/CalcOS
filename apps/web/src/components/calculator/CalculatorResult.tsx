import { Box, Card, CardContent, Stack, Typography } from '@mui/material';

import { roundCurrency } from '@calcos/money';

interface CalculatorResultProps {
  interestLabel: string;
  interest: number;
  totalAmount: number;
}

function formatCurrency(value: number): string {
  return `₹${roundCurrency(value).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function CalculatorResult({
  interestLabel,
  interest,
  totalAmount,
}: CalculatorResultProps) {
  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Result
          </Typography>

          <Box>
            <Typography color="text.secondary">
              {interestLabel}
            </Typography>

            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {formatCurrency(interest)}
            </Typography>
          </Box>

          <Box>
            <Typography color="text.secondary">
              Total Amount
            </Typography>

            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {formatCurrency(totalAmount)}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}