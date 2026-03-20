import { fetchLetterboxdFilms } from '../_utils/fetchLetterboxdFilms';

export const revalidate = 86400;

function toStars(rating: number): string {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return '★'.repeat(full) + (half ? '½' : '');
}

function escapeIcal(str: string): string {
  return str.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
}

function toIcalDate(dateStr: string): string {
  return dateStr.replace(/-/g, '');
}

export async function GET() {
  const films = await fetchLetterboxdFilms('ja');

  const events = films
    .map((film) => {
      const ratingStr = film.rating !== null ? ` - ${toStars(film.rating)}` : '';
      const summary = escapeIcal(`${film.title}, ${film.year}${ratingStr}`);
      const dtstart = toIcalDate(film.watchedDate);
      const dtend = dtstart;
      const uid = escapeIcal(film.letterboxdUrl);

      return [
        'BEGIN:VEVENT',
        `DTSTART;VALUE=DATE:${dtstart}`,
        `DTEND;VALUE=DATE:${dtend}`,
        `SUMMARY:${summary}`,
        `URL:${film.letterboxdUrl}`,
        `UID:${uid}`,
        'END:VEVENT',
      ].join('\r\n');
    })
    .join('\r\n');

  const ical = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//pandanoir//films//JA',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    events,
    'END:VCALENDAR',
  ].join('\r\n');

  return new Response(ical, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
