import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Simple Interest Calculator',
  description:
    'Calculate simple interest and total amount using principal, annual interest rate and time.',
};

export default function SimpleInterestLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}