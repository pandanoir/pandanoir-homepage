import { notFound } from 'next/navigation';
import { locales } from '../../_dictionaries/locales';
import { ParamsSchema } from '../../parseLangParam';
import {
  fetchLetterboxdFilms,
  type Film,
} from '../../../_utils/fetchLetterboxdFilms';
import { MonthSection } from './MonthSection';
import '../../../../lib/mapPolyfill';

export const revalidate = 86400;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function FilmsPage({
  params,
}: {
  params: Promise<Record<string, unknown>>;
}) {
  let lang;
  try {
    ({ lang } = ParamsSchema.parse(await params));
  } catch {
    notFound();
  }

  const films = await fetchLetterboxdFilms(lang);

  const filmsByMonth = new Map<string, Film[]>();
  for (const film of films) {
    filmsByMonth.getOrInsert(film.watchedDate.slice(0, 7), []).push(film);
  }

  return (
    <>
      <h2 className="text-4xl">Watch history</h2>
      <div className="flex flex-col gap-8">
        {[...filmsByMonth.entries()]
          .sort(([a], [b]) => b.localeCompare(a))
          .map(([month, films]) => (
            <MonthSection key={month} month={month} films={films} />
          ))}
      </div>
    </>
  );
}
