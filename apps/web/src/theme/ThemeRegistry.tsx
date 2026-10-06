'use client';

import { CssBaseline, ThemeProvider } from '@mui/material';
import { ReactNode } from 'react';
import { theme } from './theme';

interface ThemeRegistryProps {
  children: ReactNode;
}

export function ThemeRegistry({ children }: ThemeRegistryProps) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}