import Link from 'next/link';

export default function NotFound() {
  return (
    <html lang="en">
      <body className="bg-black">
        <div className="text-slate-300 px-8 flex flex-col justify-center gap-3 sm:gap-4">
          <h1 className="flex-none text-5xl sm:text-6xl font-bold">
            <Link href="/">pandanoir</Link>
          </h1>
          <h2 className="text-4xl sm:text-5xl">404</h2>
          This page could not be found.
        </div>
      </body>
    </html>
  );
}
