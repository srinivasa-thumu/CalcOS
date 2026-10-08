import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Calculation History',
  description:
    'View and manage your locally stored financial calculation history.',
};

export default function HistoryLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}