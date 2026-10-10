import { TextField } from '@mui/material';

interface CalculatorDateFieldProps {
  name: string;
  label: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
}

export function CalculatorDateField({
  name,
  label,
  value,
  error,
  onChange,
}: CalculatorDateFieldProps) {
  return (
    <TextField
      fullWidth
      name={name}
      label={label}
      type="date"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      error={Boolean(error)}
      helperText={error}
      slotProps={{
        inputLabel: { shrink: true },
      }}
    />
  );
}