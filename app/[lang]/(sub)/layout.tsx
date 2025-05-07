import { notFound } from 'next/navigation';
import { PropsWithChildren } from 'react';
import { ParamsSchema } from '../parseLangParam';
import Link from 'next/link';

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
    <div className="text-slate-300 px-8 mb-8 flex flex-col justify-center gap-3 sm:gap-4">
      <h1 className="flex-none text-5xl sm:text-6xl font-bold">
        <Link href={`/${lang}`}>pandanoir</Link>
      </h1>
      {children}
    </div>
  );
}
