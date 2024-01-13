import { ArticleList } from './ArticleList';
import { fetchZennFeed } from './fetchZennFeed';
import { fetchBlogFeed } from './fetchBlog';

export default async function PostPage() {
  const posts = (await Promise.all([fetchBlogFeed(), fetchZennFeed()]))
    .flat()
    .sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());

  return (
    <div className="text-slate-300 before:content-[''] before:bg-black before:opacity-50 flex flex-col gap-4">
      <h1 className="text-4xl">recent posts</h1>
      <ArticleList posts={posts} />
    </div>
  );
}
