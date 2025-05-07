import { fetchAllFeed } from '../../../_utils/fetchAllFeed';
import { ArticleList } from './ArticleList';

export default async function PostPage() {
  return (
    <>
      <h2 className="text-4xl">Recent posts</h2>
      <ArticleList posts={await fetchAllFeed()} />
    </>
  );
}
