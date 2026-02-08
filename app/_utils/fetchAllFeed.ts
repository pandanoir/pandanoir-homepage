import { fetchRss2 } from './fetchRss2';
import oldHatenaPostsJson from '../_data/hatena-posts.json';
import companyPostsJson from '../_data/company-posts.json';

export type Post = {
  source: 'hatena blog' | 'zenn' | 'company';
  title: string;
  pubDate: Date;
  link: string;
  description: string;
  image: string;
};

/** URLからentryパス部分を抽出（例: /entry/2026/01/19/220608） */
const extractEntryPath = (url: string) => url.match(/\/entry\/.+/)?.[0] ?? '';

export const fetchRecentFeed = async (limit: number) =>
  (await fetchAllFeed()).slice(0, limit);

export const fetchAllFeed = async (): Promise<Post[]> => {
  const [hatenaPosts, zennPosts] = await Promise.all([
    fetchRss2('https://www.pandanoir.info/rss?size=100').then((articles) =>
      articles.map((x) => ({ ...x, source: 'hatena blog' as const })),
    ),
    fetchRss2('https://zenn.dev/pandanoir/feed').then((articles) =>
      articles.map((x) => ({ ...x, source: 'zenn' as const })),
    ),
  ]);

  // RSSで取得できない昔の記事
  const rssEntryPaths = new Set(
    hatenaPosts.map((post) => extractEntryPath(post.link)),
  );
  const oldHatenaPosts = oldHatenaPostsJson
    .filter((post) => !rssEntryPaths.has(extractEntryPath(post.link)))
    .map((post) => ({
      ...post,
      source: 'hatena blog' as const,
      pubDate: new Date(post.pubDate),
    }));

  const companyPosts = companyPostsJson.map((post) => ({
    ...post,
    source: 'company' as const,
    pubDate: new Date(post.pubDate),
  }));

  return [
    ...hatenaPosts,
    ...zennPosts,
    ...oldHatenaPosts,
    ...companyPosts,
  ].sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());
};
