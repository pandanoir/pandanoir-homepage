import { fetchAllFeed } from '../_utils/fetchAllFeed';
import { ArticleList } from './ArticleList';

export default async function PostPage() {
  return (
    <div className="text-slate-300 before:content-[''] before:bg-black before:opacity-50 flex flex-col gap-4">
      <h1 className="text-4xl">recent posts</h1>
      <ArticleList posts={await fetchAllFeed()} />
    </div>
  );
}
