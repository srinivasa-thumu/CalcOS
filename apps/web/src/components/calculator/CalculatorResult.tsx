import {
  Box,
  Card,
  CardContent,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import { roundCurrency } from '@calcos/money';

interface CalculatorResultProps {
  interestLabel: string;
  interest: number;
  totalAmount: number;
  durationLabel?: string;
  annualRateEquivalent?: number;
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
  durationLabel,
  annualRateEquivalent,
}: CalculatorResultProps) {
  return (
    <Card component="section" aria-label="Calculation result">
      <CardContent>
        <Stack spacing={3}>
          <Typography component="h2" variant="h5" sx={{ fontWeight: 700 }}>
            Result
          </Typography>

          <Box>
            <Typography color="text.secondary">{interestLabel}</Typography>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '2rem', sm: '2.5rem' },
              }}
            >
              {formatCurrency(interest)}
            </Typography>
          </Box>

          <Divider />

          <Box>
            <Typography color="text.secondary">Total Amount</Typography>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '2rem', sm: '2.5rem' },
              }}
            >
              {formatCurrency(totalAmount)}
            </Typography>
          </Box>

          {durationLabel && (
            <Box>
              <Typography color="text.secondary">Duration</Typography>
              <Typography variant="body1">{durationLabel}</Typography>
            </Box>
          )}

          {annualRateEquivalent !== undefined && (
            <Box>
              <Typography color="text.secondary">
                Nominal Annual Rate Equivalent
              </Typography>
              <Typography variant="body1">
                {annualRateEquivalent.toLocaleString('en-IN', {
                  maximumFractionDigits: 6,
                })}
                %
              </Typography>
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}