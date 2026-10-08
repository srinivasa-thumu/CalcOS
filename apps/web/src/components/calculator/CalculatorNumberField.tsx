import { TextField } from '@mui/material';

interface CalculatorNumberFieldProps {
  name: string;
  label: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
}

export function CalculatorNumberField({
  name,
  label,
  value,
  error,
  onChange,
}: CalculatorNumberFieldProps) {
  return (
    <TextField
      fullWidth
      name={name}
      label={label}
      type="number"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      error={Boolean(error)}
      helperText={error}
      slotProps={{
        htmlInput: {
          min: 0,
          step: '0.01',
        },
      }}
    />
  );
}