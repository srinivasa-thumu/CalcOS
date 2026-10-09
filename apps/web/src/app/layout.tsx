import type { Metadata } from 'next';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';
import { ThemeRegistry } from '@/theme/ThemeRegistry';
import { AppHeader } from '@/components/layout/AppHeader';
import {
  defaultDescription,
  siteName,
  siteUrl,
} from '@/lib/site';

export const metadata: Metadata = {
  metadataBase: siteUrl,

  title: {
    default: 'CalcOS — Free Financial Calculators',
    template: '%s | CalcOS',
  },

  description: defaultDescription,

  applicationName: siteName,

  openGraph: {
    type: 'website',
    siteName,
    title: 'CalcOS — Free Financial Calculators',
    description: defaultDescription,
    url: '/',
    locale: 'en_IN',
  },

  twitter: {
    card: 'summary',
    title: 'CalcOS — Free Financial Calculators',
    description: defaultDescription,
  },

  robots: {
    index: true,
    follow: true,
  },
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