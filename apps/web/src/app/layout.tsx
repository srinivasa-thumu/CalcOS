import type { Metadata } from 'next';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';
import { ThemeRegistry } from '@/theme/ThemeRegistry';

export const metadata: Metadata = {
  title: {
    default: 'CalcOS — Financial Calculators',
    template: '%s | CalcOS',
  },
  description:
    'Simple, accurate and easy-to-use financial calculators for everyday financial calculations.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <ThemeRegistry>{children}</ThemeRegistry>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}