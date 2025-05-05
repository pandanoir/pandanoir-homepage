import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from './_components/ui/sonner';
import { LanguageChangeButton } from './LanguageChangeButton';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'pandanoir',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`bg-black ${inter.className}`}>
        <div className="absolute top-0 right-0">
          <LanguageChangeButton />
        </div>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
