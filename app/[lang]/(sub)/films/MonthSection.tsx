import '../../../../lib/mapPolyfill';
import { type Film } from '../../../_utils/fetchLetterboxdFilms';

function ratingToStars(rating: number): string {
  return '★'.repeat(Math.floor(rating)) + (rating % 1 >= 0.5 ? '½' : '');
}

function FilmCard({ film }: { film: Film }) {
  const [, month, day] = film.watchedDate.split('-');
  return (
    <a
      href={film.letterboxdUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex w-24 flex-col gap-1 transition-opacity hover:opacity-75"
    >
      {film.posterUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={film.posterUrl}
          alt={film.title}
          width={96}
          height={144}
          className="h-36 w-24 rounded object-cover"
        />
      ) : (
        <div className="flex h-36 w-24 items-center justify-center rounded bg-slate-700">
          <span className="px-1 text-center text-xs leading-tight text-slate-400">
            {film.title}
          </span>
        </div>
      )}
      <span className="text-xs leading-none text-slate-400">
        {month}/{day}
      </span>
      <span className="line-clamp-2 text-xs leading-tight">{film.title}</span>
      {film.rating !== null && (
        <span
          className={`text-xs leading-none ${film.rating >= 4.5 ? 'text-orange-500' : 'text-yellow-400'}`}
        >
          {ratingToStars(film.rating)}
        </span>
      )}
    </a>
  );
}

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function CalendarGrid({
  month,
  filmsByDate,
}: {
  month: string;
  filmsByDate: Map<string, Film[]>;
}) {
  const [year, monthNum] = month.split('-').map(Number);
  const firstDayOfWeek = new Date(year, monthNum - 1, 1).getDay();
  const daysInMonth = new Date(year, monthNum, 0).getDate();

  const cells: (number | null)[] = [
    ...Array(firstDayOfWeek).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="w-44">
      <div className="grid grid-cols-7 text-center">
        {WEEKDAYS.map((d) => (
          <div key={d} className="pb-1 text-xs text-slate-500">
            {d}
          </div>
        ))}
        {cells.map((day, i) => {
          if (day === null) return <div key={`empty-${i}`} />;
          const films = filmsByDate.get(
            `${year}-${String(monthNum).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
          );
          const hasFilm = !!films;

          const inner = (
            <>
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full text-xs leading-none ${!hasFilm ? 'text-slate-500' : 'group-hover:bg-sky-500 group-hover:text-white'}`}
              >
                {day}
              </span>
              {hasFilm && (
                <>
                  <span className="mt-0.5 h-1 w-1 rounded-full bg-slate-500 transition-colors group-hover:bg-sky-400" />
                  <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 hidden -translate-x-1/2 gap-2 rounded border border-slate-600 bg-slate-900/95 p-2 shadow-xl group-hover:flex">
                    {films.toReversed().map((film) => (
                      <div
                        key={film.letterboxdUrl}
                        className="flex w-24 flex-shrink-0 flex-col gap-1"
                      >
                        {film.posterUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={film.posterUrl}
                            alt={film.title}
                            width={96}
                            height={144}
                            className="h-36 w-24 rounded object-cover"
                          />
                        ) : (
                          <div className="flex h-36 w-24 items-center justify-center rounded bg-slate-700">
                            <span className="px-1 text-center text-xs leading-tight text-slate-400">
                              {film.title}
                            </span>
                          </div>
                        )}
                        <span className="line-clamp-2 text-xs leading-tight">
                          {film.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          );

          const className = 'group relative flex flex-col items-center py-0.5';

          const lastFilm = films?.at(-1);
          return lastFilm ? (
            <a
              key={day}
              href={lastFilm.letterboxdUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={className}
            >
              {inner}
            </a>
          ) : (
            <div key={day} className={className}>
              {inner}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function MonthSection({
  month,
  films,
}: {
  month: string;
  films: Film[];
}) {
  const filmsByDate = new Map<string, Film[]>();
  for (const film of films) {
    filmsByDate.getOrInsert(film.watchedDate, []).push(film);
  }

  return (
    <section>
      <h3 className="mb-3 text-xl font-bold">
        {month.replace('-', '/')} ({films.length})
      </h3>
      <div className="flex items-start gap-8">
        <div className="flex min-w-0 flex-1 flex-wrap gap-4">
          {films.map((film) => (
            <FilmCard key={film.letterboxdUrl} film={film} />
          ))}
        </div>
        <div className="hidden flex-shrink-0 lg:block">
          <CalendarGrid month={month} filmsByDate={filmsByDate} />
        </div>
      </div>
    </section>
  );
}
