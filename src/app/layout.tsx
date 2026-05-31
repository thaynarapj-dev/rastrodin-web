import type { Metadata } from 'next';
import '../styles/index.css';

export const metadata: Metadata = {
  title: 'RastroDin',
  description:
    'Track and manage daily family transactions with a mobile-responsive app designed to help users monitor spending and improve budget control.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
