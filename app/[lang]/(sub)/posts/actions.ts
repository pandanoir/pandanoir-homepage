'use server';

import { fetchAllFeed, type Post } from '@/app/_utils/fetchAllFeed';

export async function fetchRemainingPosts(
  offset: number,
): Promise<{ title: string; pubDate: string; link: string; description: string; image: string; source: Post['source'] }[]> {
  const posts = await fetchAllFeed();
  return posts.slice(offset).map((post) => ({
    ...post,
    pubDate: post.pubDate.toISOString(),
  }));
}
