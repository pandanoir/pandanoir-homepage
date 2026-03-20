const LETTERBOXD_RSS_URL = `https://letterboxd.com/${process.env.LETTERBOXD_USER}/rss/`;
const TMDB_API_BASE = 'https://api.themoviedb.org/3';

export type Film = {
  title: string;
  year: number;
  rating: number | null;
  watchedDate: string; // YYYY-MM-DD
  posterUrl: string | null;
  letterboxdUrl: string;
  rewatchCount: number | null; // 何回目の視聴か (/n/ に相当、初回はnull)
};

export function isListItem(itemXml: string): boolean {
  const link = itemXml.match(/<link>(.*?)<\/link>/s)?.[1] ?? '';
  if (link.includes('/list/')) return true;

  const guid = itemXml.match(/<guid[^>]*>(.*?)<\/guid>/s)?.[1] ?? '';
  if (guid.startsWith('letterboxd-list')) return true;

  if (!/<letterboxd:watchedDate>/.test(itemXml)) return true;

  return false;
}

function extractPosterUrl(itemXml: string): string | null {
  const cdata = itemXml.match(
    /<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/,
  )?.[1];
  return cdata?.match(/<img[^>]+src="([^"]+)"/)?.[1] ?? null;
}

export async function fetchJapaneseTitle(
  movieId: string,
): Promise<string | null> {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) return null;
  try {
    const res = await fetch(
      `${TMDB_API_BASE}/movie/${movieId}?api_key=${apiKey}&language=ja`,
      { next: { revalidate: 86400 * 7 } },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as { title?: string };
    return data.title ?? null;
  } catch {
    return null;
  }
}

export async function fetchLetterboxdFilms(lang: 'ja' | 'en'): Promise<Film[]> {
  const rssText = await fetch(LETTERBOXD_RSS_URL, {
    next: { revalidate: 86400 },
  }).then((res) => res.text());

  const allItems = rssText.match(/<item>[\s\S]*?<\/item>/g) ?? [];

  return Promise.all(
    allItems
      .filter((item) => !isListItem(item))
      .map(async (itemXml) => {
        const filmTitle =
          itemXml.match(
            /<letterboxd:filmTitle>(.*?)<\/letterboxd:filmTitle>/,
          )?.[1] ?? '';
        const year = Number(
          itemXml.match(
            /<letterboxd:filmYear>(\d+)<\/letterboxd:filmYear>/,
          )?.[1] ?? '0',
        );
        const ratingStr = itemXml.match(
          /<letterboxd:memberRating>([\d.]+)<\/letterboxd:memberRating>/,
        )?.[1];
        const watchedDate =
          itemXml.match(
            /<letterboxd:watchedDate>(.*?)<\/letterboxd:watchedDate>/,
          )?.[1] ?? '';
        const rawUrl = itemXml.match(/<link>(.*?)<\/link>/s)?.[1] ?? '';
        // https://letterboxd.com/{user}/film/xxx/{n}/ → https://letterboxd.com/film/xxx/
        const letterboxdUrl = rawUrl.replace(
          /letterboxd\.com\/[^/]+\/film\/([^/]+\/)(\d+\/?)?$/,
          'letterboxd.com/film/$1',
        );
        const rewatchCount =
          Number(rawUrl.match(/\/film\/[^/]+\/(\d+)\/?$/)?.[1] ?? '') || null;
        const posterUrl = extractPosterUrl(itemXml);

        let title = filmTitle;
        if (lang === 'ja') {
          const tmdbId = itemXml.match(
            /<tmdb:movieId>(\d+)<\/tmdb:movieId>/,
          )?.[1];
          if (tmdbId) {
            const jaTitle = await fetchJapaneseTitle(tmdbId);
            if (jaTitle) title = jaTitle;
          }
        }

        return {
          title,
          year,
          rating: ratingStr ? parseFloat(ratingStr) : null,
          watchedDate,
          posterUrl,
          letterboxdUrl,
          rewatchCount,
        } satisfies Film;
      }),
  );
}
