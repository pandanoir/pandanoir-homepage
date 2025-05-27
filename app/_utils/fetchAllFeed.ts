import { fetchRss2 } from './fetchRss2';

export type Post = {
  source: 'hatena blog' | 'zenn' | 'company';
  title: string;
  pubDate: Date;
  link: string;
  description: string;
  image: string;
};
export const fetchAllFeed = async (): Promise<Post[]> =>
  (
    await Promise.all([
      fetchRss2('https://www.pandanoir.info/rss?size=100').then((articles) =>
        articles.map((x) => ({ ...x, source: 'hatena blog' as const })),
      ),
      fetchRss2('https://zenn.dev/pandanoir/feed').then((articles) =>
        articles.map((x) => ({ ...x, source: 'zenn' as const })),
      ),
      [
        {
          source: 'company' as const,
          title: 'LINE NEWS フロントエンドの自動テストの改善',
          pubDate: new Date(2023, 2 - 1, 24),
          link: 'https://engineering.linecorp.com/ja/blog/frontend-testing-automation-line-news',
          description:
            'この記事は UIT 新春 Tech blog 2023 4日目の記事です。こんにちは。LINEフロントエンド開発センターの幾野(ikuno)です。普段は LINE NEWS のフロントエンド開発をしています。LINE NEWS では昨年テストをたくさん書いた昨年 LINE NEWS...',
          image:
            'https://vos.line-scdn.net/landpress-content-v2_1761/1676888290829.png?updatedAt=1676888291000',
        },
      ],
    ])
  )
    .flat()
    .sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());
