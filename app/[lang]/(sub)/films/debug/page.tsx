import { Redis } from '@upstash/redis';
import {
  isListItem,
  fetchJapaneseTitle,
} from '../../../../_utils/fetchLetterboxdFilms';

export const dynamic = 'force-dynamic';

type CheckResult = {
  name: string;
  status: 'ok' | 'fail' | 'warn';
  detail: string;
  duration?: number;
};

async function runChecks(): Promise<CheckResult[]> {
  const results: CheckResult[] = [];

  // 1. ENV VARS
  const envVars = [
    'LETTERBOXD_USER',
    'TMDB_API_KEY',
    'KV_REST_API_URL',
    'KV_REST_API_TOKEN',
  ] as const;
  for (const name of envVars) {
    const val = process.env[name];
    results.push({
      name: `env: ${name}`,
      status: val ? 'ok' : 'fail',
      detail: val ? `set (${val.length} chars)` : 'MISSING',
    });
  }

  // 2. RSS FETCH
  const rssUrl = `https://letterboxd.com/${process.env.LETTERBOXD_USER}/rss/`;
  let rssText = '';
  let items: string[] = [];
  {
    const start = Date.now();
    try {
      const res = await fetch(rssUrl, { cache: 'no-store' });
      rssText = await res.text();
      const allItems = rssText.match(/<item>[\s\S]*?<\/item>/g) ?? [];
      items = allItems.filter((item) => !isListItem(item));
      results.push({
        name: 'RSS fetch',
        status: items.length > 0 ? 'ok' : 'warn',
        detail: `status=${res.status}, allItems=${allItems.length}, films=${items.length}`,
        duration: Date.now() - start,
      });
    } catch (e) {
      results.push({
        name: 'RSS fetch',
        status: 'fail',
        detail: String(e),
        duration: Date.now() - start,
      });
    }
  }

  // 3. RSS fetch with next.revalidate (same as production code)
  {
    const start = Date.now();
    try {
      const res = await fetch(rssUrl, { next: { revalidate: 86400 } });
      const text = await res.text();
      const allItems = text.match(/<item>[\s\S]*?<\/item>/g) ?? [];
      const filtered = allItems.filter((item) => !isListItem(item));
      results.push({
        name: 'RSS fetch (revalidate:86400)',
        status: filtered.length > 0 ? 'ok' : 'warn',
        detail: `status=${res.status}, allItems=${allItems.length}, films=${filtered.length}`,
        duration: Date.now() - start,
      });
    } catch (e) {
      results.push({
        name: 'RSS fetch (revalidate:86400)',
        status: 'fail',
        detail: String(e),
        duration: Date.now() - start,
      });
    }
  }

  // 4. REDIS PING
  const hasRedisEnv =
    !!process.env.KV_REST_API_URL && !!process.env.KV_REST_API_TOKEN;
  let redis: Redis | null = null;
  if (hasRedisEnv) {
    redis = new Redis({
      url: process.env.KV_REST_API_URL!,
      token: process.env.KV_REST_API_TOKEN!,
    });
    const start = Date.now();
    try {
      const pong = await redis.ping();
      results.push({
        name: 'Redis ping',
        status: pong === 'PONG' ? 'ok' : 'warn',
        detail: String(pong),
        duration: Date.now() - start,
      });
    } catch (e) {
      results.push({
        name: 'Redis ping',
        status: 'fail',
        detail: String(e),
        duration: Date.now() - start,
      });
    }
  } else {
    results.push({
      name: 'Redis ping',
      status: 'fail',
      detail: 'skipped — env vars missing',
    });
  }

  // 5. REDIS MGET (simulating fetchJaTitleMap)
  const tmdbIds = items
    .map((item) => item.match(/<tmdb:movieId>(\d+)<\/tmdb:movieId>/)?.[1])
    .filter((id): id is string => !!id);
  const uniqueIds = [...new Set(tmdbIds)];

  if (redis && uniqueIds.length > 0) {
    const keys = uniqueIds.map((id) => `tmdb:ja:${id}`);
    const start = Date.now();
    try {
      const cached = await redis.mget<(string | null)[]>(...keys);
      const hits = cached.filter((v) => v !== null).length;
      results.push({
        name: `Redis mget (${keys.length} keys)`,
        status: 'ok',
        detail: `hits=${hits}, misses=${keys.length - hits}`,
        duration: Date.now() - start,
      });
    } catch (e) {
      results.push({
        name: `Redis mget (${keys.length} keys)`,
        status: 'fail',
        detail: String(e),
        duration: Date.now() - start,
      });
    }
  } else {
    results.push({
      name: 'Redis mget',
      status: 'warn',
      detail: `skipped — redis=${!!redis}, uniqueIds=${uniqueIds.length}`,
    });
  }

  // 6. TMDB API (single request)
  if (process.env.TMDB_API_KEY && uniqueIds.length > 0) {
    const testId = uniqueIds[0];
    const start = Date.now();
    try {
      const title = await fetchJapaneseTitle(testId);
      results.push({
        name: `TMDB API (id=${testId})`,
        status: title ? 'ok' : 'warn',
        detail: title ? `"${title}"` : 'returned null',
        duration: Date.now() - start,
      });
    } catch (e) {
      results.push({
        name: `TMDB API (id=${testId})`,
        status: 'fail',
        detail: String(e),
        duration: Date.now() - start,
      });
    }
  } else {
    results.push({
      name: 'TMDB API',
      status: 'warn',
      detail: 'skipped — no API key or no IDs',
    });
  }

  // 7. fetchLetterboxdFilms('en') vs ('ja')
  const { fetchLetterboxdFilms } = await import(
    '../../../../_utils/fetchLetterboxdFilms'
  );
  for (const lang of ['en', 'ja'] as const) {
    const start = Date.now();
    try {
      const films = await fetchLetterboxdFilms(lang);
      results.push({
        name: `fetchLetterboxdFilms("${lang}")`,
        status: films.length > 0 ? 'ok' : 'fail',
        detail: `${films.length} films${films.length > 0 ? `, first="${films[0].title}"` : ''}`,
        duration: Date.now() - start,
      });
    } catch (e) {
      results.push({
        name: `fetchLetterboxdFilms("${lang}")`,
        status: 'fail',
        detail: String(e),
        duration: Date.now() - start,
      });
    }
  }

  return results;
}

export default async function DebugPage() {
  const results = await runChecks();

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">Films Debug</h2>
      <p className="text-sm text-slate-400">
        {new Date().toISOString()} | Node {process.version}
      </p>
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-700 text-slate-400">
            <th className="py-1 pr-4">Check</th>
            <th className="py-1 pr-4">Status</th>
            <th className="py-1 pr-4">Detail</th>
            <th className="py-1">Time</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r) => (
            <tr key={r.name} className="border-b border-slate-800">
              <td className="py-2 pr-4 font-mono">{r.name}</td>
              <td className="py-2 pr-4">
                <span
                  className={
                    r.status === 'ok'
                      ? 'text-green-400'
                      : r.status === 'warn'
                        ? 'text-yellow-400'
                        : 'text-red-400'
                  }
                >
                  {r.status === 'ok' ? 'OK' : r.status === 'warn' ? 'WARN' : 'FAIL'}
                </span>
              </td>
              <td className="max-w-md break-all py-2 pr-4 font-mono text-xs">
                {r.detail}
              </td>
              <td className="py-2 font-mono text-xs text-slate-500">
                {r.duration != null ? `${r.duration}ms` : '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
