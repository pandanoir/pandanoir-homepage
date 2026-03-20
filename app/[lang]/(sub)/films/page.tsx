import { notFound } from 'next/navigation';
import { locales } from '../../_dictionaries/locales';
import { ParamsSchema } from '../../parseLangParam';
import { fetchLetterboxdFilms, type Film } from '../../../_utils/fetchLetterboxdFilms';
import { MonthSection } from './MonthSection';

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
    const month = film.watchedDate.slice(0, 7);
    const group = filmsByMonth.get(month);
    if (group) {
      group.push(film);
    } else {
      filmsByMonth.set(month, [film]);
    }
  }
  const sortedMonths = [...filmsByMonth.keys()].sort().reverse();

  return (
    <>
      <h2 className="text-4xl">Watch history</h2>
      <div className="flex flex-col gap-8">
        {sortedMonths.map((month) => (
          <MonthSection
            key={month}
            month={month}
            films={filmsByMonth.get(month)!}
          />
        ))}
      </div>
    </>
  );
}
