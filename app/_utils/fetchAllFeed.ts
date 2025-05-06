import { fetchRss2 } from './fetchRss2';

export const fetchAllFeed = async () =>
  (
    await Promise.all([
      fetchRss2('https://www.pandanoir.info/rss?size=100').then((articles) =>
        articles.map((x) => ({ ...x, source: 'hatena blog' as const })),
      ),
      fetchRss2('https://zenn.dev/pandanoir/feed').then((articles) =>
        articles.map((x) => ({ ...x, source: 'zenn' as const })),
      ),
    ])
  )
    .flat()
    .sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());
