'use client';
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
          <div key={d} className="text-xs text-slate-500 pb-1">
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
                className={`text-xs w-5 h-5 flex items-center justify-center rounded-full leading-none ${!hasFilm ? 'text-slate-500' : 'group-hover:bg-sky-500 group-hover:text-white'}`}
              >
                {day}
              </span>
              {hasFilm && (
                <>
                  <span className="w-1 h-1 rounded-full mt-0.5 bg-slate-500 transition-colors group-hover:bg-sky-400" />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-10 pointer-events-none hidden group-hover:flex gap-2 bg-slate-900/95 border border-slate-600 rounded p-2 shadow-xl">
                    {films.toReversed().map((film) => (
                      <div
                        key={film.letterboxdUrl}
                        className="flex flex-col gap-1 w-24 flex-shrink-0"
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
                        <span className="text-xs leading-tight line-clamp-2">
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
      <h3 className="text-xl font-bold mb-3">
        {month.replace('-', '/')} ({films.length})
      </h3>
      <div className="flex gap-8 items-start">
        <div className="flex flex-wrap gap-4 flex-1 min-w-0">
          {films.map((film) => (
            <FilmCard key={film.letterboxdUrl} film={film} />
          ))}
        </div>
        <div className="hidden lg:block flex-shrink-0">
          <CalendarGrid month={month} filmsByDate={filmsByDate} />
        </div>
      </div>
    </section>
  );
}
