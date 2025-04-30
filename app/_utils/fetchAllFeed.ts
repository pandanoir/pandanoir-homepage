import { fetchRss2 } from './fetchRss2';

export const fetchAllFeed = async () =>
  (
    await Promise.all([
      fetchRss2('https://www.pandanoir.info/rss?size=100'),
      fetchRss2('https://zenn.dev/pandanoir/feed'),
    ])
  )
    .flat()
    .sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());
