import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Calculation History',
  description:
    'View and manage your locally stored CalcOS financial calculations.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function HistoryLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}