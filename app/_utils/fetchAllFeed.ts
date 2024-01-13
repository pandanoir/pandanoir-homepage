import { fetchBlogFeed } from './fetchBlog';
import { fetchZennFeed } from './fetchZennFeed';

export const fetchAllFeed = async () =>
  (await Promise.all([fetchBlogFeed(), fetchZennFeed()]))
    .flat()
    .sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());
