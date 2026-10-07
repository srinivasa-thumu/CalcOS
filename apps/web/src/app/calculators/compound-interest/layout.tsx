import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Compound Interest Calculator',
  description:
    'Calculate compound interest and total amount with annual, semi-annual, quarterly, monthly or daily compounding.',
};

export default function CompoundInterestLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}