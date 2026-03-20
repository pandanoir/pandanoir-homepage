import { notFound } from 'next/navigation';
import { locales } from '../../_dictionaries/locales';
import { ParamsSchema } from '../../parseLangParam';
import {
  fetchLetterboxdFilms,
  type Film,
} from '../../../_utils/fetchLetterboxdFilms';

export const revalidate = 86400;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

function ratingToStars(rating: number): string {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  return '★'.repeat(fullStars) + (halfStar ? '½' : '');
}

function FilmCard({ film }: { film: Film }) {
  const [, month, day] = film.watchedDate.split('-');
  return (
    <a
      href={film.letterboxdUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col gap-1 w-24 hover:opacity-75 transition-opacity"
    >
      {film.posterUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={film.posterUrl}
          alt={film.title}
          width={96}
          height={144}
          className="w-24 h-36 object-cover rounded"
        />
      ) : (
        <div className="w-24 h-36 bg-slate-700 rounded flex items-center justify-center">
          <span className="text-xs text-slate-400 text-center px-1 leading-tight">
            {film.title}
          </span>
        </div>
      )}
      <span className="text-xs text-slate-400 leading-none">
        {month}/{day}
      </span>
      <span className="text-xs leading-tight line-clamp-2">{film.title}</span>
      {film.rating !== null && (
        <span className="text-xs text-yellow-400 leading-none">
          {ratingToStars(film.rating)}
        </span>
      )}
    </a>
  );
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

  // yyyy-MM をキーに月ごとにグループ化 (降順)
  const filmsByMonth = new Map<string, Film[]>();
  for (const film of films) {
    const month = film.watchedDate.slice(0, 7); // "2025-12"
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
          <section key={month}>
            <h3 className="text-xl font-bold mb-3">
              {month.replace('-', '/')}
            </h3>
            <div className="flex flex-wrap gap-4">
              {filmsByMonth.get(month)!.map((film) => (
                <FilmCard key={film.letterboxdUrl} film={film} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
