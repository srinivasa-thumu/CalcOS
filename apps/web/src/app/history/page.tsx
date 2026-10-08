'use client';

import { useEffect, useState } from 'react';
import {
    Button,
  Card,
  CardContent,
  Container,
  Divider,
  Stack,
  Typography,
} from '@mui/material';

import type { CalculationHistoryRecord } from '@calcos/domain-types';
import { roundCurrency } from '@calcos/money';
import { historyRepository } from '@/lib/history';

function formatCurrency(value: number): string {
  return `₹${roundCurrency(value).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(value: string): string {
  return new Date(value).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

function formatFrequency(
  frequency: 'annually' | 'semi-annually' | 'quarterly' | 'monthly' | 'daily',
): string {
  const labels = {
    annually: 'Annually',
    'semi-annually': 'Semi-annually',
    quarterly: 'Quarterly',
    monthly: 'Monthly',
    daily: 'Daily',
  } as const;

  return labels[frequency];
}

export default function HistoryPage() {
  const [records, setRecords] = useState<CalculationHistoryRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadHistory() {
      try {
        setIsLoading(true);
        setError(null);

        const history = await historyRepository.getAll();

        history.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime(),
        );

        setRecords(history);
      } catch (err) {
        console.error('Failed to load calculation history.', err);
        setError('Unable to load calculation history.');
      } finally {
        setIsLoading(false);
      }
    }

    void loadHistory();
  }, []);

  async function handleDelete(id: string) {
  try {
    await historyRepository.delete(id);

    setRecords((currentRecords) =>
      currentRecords.filter((record) => record.id !== id),
    );
  } catch (err) {
    console.error('Failed to delete calculation history.', err);
    setError('Unable to delete calculation history.');
  }
    }

    async function handleClear() {
    const confirmed = window.confirm(
        'Are you sure you want to clear all calculation history?',
    );

    if (!confirmed) {
        return;
    }

    try {
        await historyRepository.clear();
        setRecords([]);
    } catch (err) {
        console.error('Failed to clear calculation history.', err);
        setError('Unable to clear calculation history.');
    }
    }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Stack
  direction={{ xs: 'column', sm: 'row' }}
  sx={{
    justifyContent: 'space-between',
    alignItems: {
      xs: 'flex-start',
      sm: 'center',
    },
    gap: 2,
  }}
>
  <BoxHeader />

  {!isLoading && records.length > 0 && (
    <Button
      color="error"
      variant="outlined"
      onClick={() => void handleClear()}
    >
      Clear History
    </Button>
  )}
</Stack>

        {isLoading && (
          <Typography color="text.secondary">
            Loading calculation history...
          </Typography>
        )}

        {!isLoading && error && (
          <Typography color="error">
            {error}
          </Typography>
        )}

        {!isLoading && !error && records.length === 0 && (
          <Card>
            <CardContent>
              <Typography variant="h6">
                No calculation history
              </Typography>

              <Typography color="text.secondary" sx={{ mt: 1 }}>
                Your completed calculations will appear here.
              </Typography>
            </CardContent>
          </Card>
        )}

        {!isLoading &&
          !error &&
          records.map((record) => (
            <HistoryCard
  key={record.id}
  record={record}
  onDelete={handleDelete}
/>
          ))}
      </Stack>
    </Container>
  );
}

function BoxHeader() {
  return (
    <Stack spacing={1}>
      <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
        Calculation History
      </Typography>

      <Typography color="text.secondary">
        Your calculations stored locally on this device.
      </Typography>
    </Stack>
  );
}

function HistoryCard({
  record,
  onDelete,
}: {
  record: CalculationHistoryRecord;
  onDelete: (id: string) => Promise<void>;
}) {
  const title =
    record.calculatorType === 'simple-interest'
      ? 'Simple Interest'
      : 'Compound Interest';

  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Stack
  direction="row"
  sx={{
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 2,
  }}
>
  <Stack spacing={0.5}>
    <Typography variant="h6" sx={{ fontWeight: 700 }}>
      {title}
    </Typography>

    <Typography
      variant="body2"
      color="text.secondary"
    >
      {formatDate(record.createdAt)}
    </Typography>
  </Stack>

  <Button
    color="error"
    size="small"
    onClick={() => void onDelete(record.id)}
  >
    Delete
  </Button>
</Stack>

          <Divider />

          <Stack spacing={1}>
            <Typography variant="body2">
              <strong>Principal:</strong>{' '}
              {formatCurrency(record.inputs.principal)}
            </Typography>

            <Typography variant="body2">
              <strong>Annual Rate:</strong>{' '}
              {record.inputs.annualRate}%
            </Typography>

            <Typography variant="body2">
              <strong>Time:</strong>{' '}
              {record.inputs.timeInYears} years
            </Typography>

            {record.calculatorType === 'compound-interest' && (
              <Typography variant="body2">
                <strong>Compounding:</strong>{' '}
                {formatFrequency(record.inputs.compoundingFrequency)}
              </Typography>
            )}
          </Stack>

          <Divider />

          <Stack spacing={1}>
            <Typography variant="body2">
              <strong>
                {record.calculatorType === 'simple-interest'
                  ? 'Simple Interest'
                  : 'Compound Interest'}
                :
              </strong>{' '}
              {formatCurrency(record.result.interest)}
            </Typography>

            <Typography variant="body2">
              <strong>Total Amount:</strong>{' '}
              {formatCurrency(record.result.totalAmount)}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}