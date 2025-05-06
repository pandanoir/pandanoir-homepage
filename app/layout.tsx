import type { Metadata } from 'next';
import './globals.css';
import 'core-js/features/map/group-by';
import { PropsWithChildren } from 'react';

export const metadata: Metadata = {
  title: 'pandanoir',
};

export default function RootLayout({ children }: PropsWithChildren) {
  return <>{children}</>;
}
