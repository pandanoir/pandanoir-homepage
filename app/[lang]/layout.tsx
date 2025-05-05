import { Toaster } from '../_components/ui/sonner';
import { LanguageChangeButton } from '../LanguageChangeButton';
import { PropsWithChildren } from 'react';
import { ParamsSchema } from './parseLangParam';
import { notFound } from 'next/navigation';

export default async function RootLayout({
  params,
  children,
}: PropsWithChildren<{
  params: Promise<Record<string, unknown>>;
}>) {
  let lang;
  try {
    ({ lang } = ParamsSchema.parse(await params));
  } catch {
    notFound();
  }
  return (
    <html lang={lang}>
      <body className="bg-black">
        <div className="absolute top-0 right-0">
          <LanguageChangeButton />
        </div>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
