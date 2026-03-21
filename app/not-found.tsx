import Link from 'next/link';

export default function NotFound() {
  return (
    <html lang="en">
      <body className="bg-black">
        <div className="flex flex-col justify-center gap-3 px-8 text-slate-300 sm:gap-4">
          <h1 className="flex-none text-5xl font-bold sm:text-6xl">
            <Link href="/">pandanoir</Link>
          </h1>
          <h2 className="text-4xl sm:text-5xl">404</h2>
          This page could not be found.
        </div>
      </body>
    </html>
  );
}
