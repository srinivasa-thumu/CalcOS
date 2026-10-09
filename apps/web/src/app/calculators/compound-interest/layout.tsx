import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Compound Interest Calculator',
  description:
    'Calculate compound interest and investment growth with annual, semi-annual, quarterly, monthly, and daily compounding.',
  alternates: {
    canonical: '/calculators/compound-interest',
  },
  openGraph: {
    title: 'Compound Interest Calculator | CalcOS',
    description:
      'Estimate compound interest and total investment value with different compounding frequencies.',
    url: '/calculators/compound-interest',
  },
};

export default function CompoundInterestLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}