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
    <Card
      component="section"
      aria-label="Calculation result"
    >
      <CardContent>
        <Stack spacing={3}>
          <Typography
            component="h2"
            variant="h5"
            sx={{ fontWeight: 700 }}
          >
            Result
          </Typography>

          <Box>
            <Typography color="text.secondary">
              {interestLabel}
            </Typography>

            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                fontSize: {
                  xs: '2rem',
                  sm: '2.5rem',
                },
              }}
            >
              {formatCurrency(interest)}
            </Typography>
          </Box>

          <Divider />

          <Box>
            <Typography color="text.secondary">
              Total Amount
            </Typography>

            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                fontSize: {
                  xs: '2rem',
                  sm: '2.5rem',
                },
              }}
            >
              {formatCurrency(totalAmount)}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}