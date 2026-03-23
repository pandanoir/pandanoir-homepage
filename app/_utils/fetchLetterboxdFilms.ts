import { Redis } from '@upstash/redis';

const LETTERBOXD_RSS_URL = `https://letterboxd.com/${process.env.LETTERBOXD_USER}/rss/`;
const TMDB_API_BASE = 'https://api.themoviedb.org/3';

const redis =
  process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN
    ? new Redis({
      url: process.env.KV_REST_API_URL,
      token: process.env.KV_REST_API_TOKEN,
    })
    : null;

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
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  try {
    const res = await fetch(
      `${TMDB_API_BASE}/movie/${movieId}?api_key=${apiKey}&language=ja`,
      { signal: controller.signal },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as { title?: string };
    return data.title ?? null;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchJaTitleMap(
  tmdbIds: string[],
): Promise<Map<string, string>> {
  const apiKey = process.env.TMDB_API_KEY;
  const map = new Map<string, string>();
  if (!apiKey || tmdbIds.length === 0) return map;

  // 1. mget で一括取得
  const keys = tmdbIds.map((id) => `tmdb:ja:${id}`);
  const cached = redis ? await redis.mget<(string | null)[]>(...keys) : [];
  const missIds: string[] = [];
  tmdbIds.forEach((id, i) => {
    const hit = cached[i];
    if (hit) {
      map.set(id, hit);
    } else {
      missIds.push(id);
    }
  });

  // 2. キャッシュミスのみ TMDB API を叩く
  await Promise.all(
    missIds.map(async (id) => {
      const title = await fetchJapaneseTitle(id);
      if (title) {
        map.set(id, title);
        void redis?.set(`tmdb:ja:${id}`, title, { ex: 86400 * 7 });
      }
    }),
  );

  return map;
}

export async function fetchLetterboxdFilms(lang: 'ja' | 'en'): Promise<Film[]> {
  const rssText = await fetch(LETTERBOXD_RSS_URL, {
    next: { revalidate: 86400 },
  }).then((res) => res.text());

  const allItems = rssText.match(/<item>[\s\S]*?<\/item>/g) ?? [];
  const items = allItems.filter((item) => !isListItem(item));

  // ja の場合: tmdbId を全件集めて mget で一括キャッシュ取得
  let jaTitleMap = new Map<string, string>();
  if (lang === 'ja') {
    const tmdbIds = items
      .map((item) => item.match(/<tmdb:movieId>(\d+)<\/tmdb:movieId>/)?.[1])
      .filter((id): id is string => !!id);
    try {
      jaTitleMap = await fetchJaTitleMap([...new Set(tmdbIds)]);
    } catch {
      // Redis/TMDB 障害時は英語タイトルにフォールバック
    }
  }

  return items.map((itemXml) => {
    const filmTitle =
      itemXml.match(
        /<letterboxd:filmTitle>(.*?)<\/letterboxd:filmTitle>/,
      )?.[1] ?? '';
    const year = Number(
      itemXml.match(/<letterboxd:filmYear>(\d+)<\/letterboxd:filmYear>/)?.[1] ??
      '0',
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

    const tmdbId = itemXml.match(/<tmdb:movieId>(\d+)<\/tmdb:movieId>/)?.[1];
    const title =
      (lang === 'ja' && tmdbId && jaTitleMap.get(tmdbId)) || filmTitle;

    return {
      title,
      year,
      rating: ratingStr ? parseFloat(ratingStr) : null,
      watchedDate,
      posterUrl,
      letterboxdUrl,
      rewatchCount,
    } satisfies Film;
  });
}
