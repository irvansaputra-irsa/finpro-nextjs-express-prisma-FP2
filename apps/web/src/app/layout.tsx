import type { Metadata } from 'next';
import './globals.css';
import ReactQueryProvider from './utils/reactQueryProvider';
import { Providers } from '@/utils/providerStyle';
import { AuthProvider } from '@/context/Auth';

export const metadata: Metadata = {
  title: 'Librairie',
  description: 'Mind your own stories, now',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ReactQueryProvider>
          <Providers>
            <AuthProvider>{children}</AuthProvider>
          </Providers>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
