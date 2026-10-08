import type { Metadata } from 'next';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';
import { ThemeRegistry } from '@/theme/ThemeRegistry';
import { AppHeader } from '@/components/layout/AppHeader';

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
          <ThemeRegistry>
            <AppHeader />
            {children}
          </ThemeRegistry>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}