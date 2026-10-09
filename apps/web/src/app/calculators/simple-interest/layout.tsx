import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Simple Interest Calculator',
  description:
    'Calculate simple interest and total maturity amount using principal, annual interest rate, and time period.',
  alternates: {
    canonical: '/calculators/simple-interest',
  },
  openGraph: {
    title: 'Simple Interest Calculator | CalcOS',
    description:
      'Calculate simple interest and total maturity amount quickly with CalcOS.',
    url: '/calculators/simple-interest',
  },
};

export default function SimpleInterestLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}