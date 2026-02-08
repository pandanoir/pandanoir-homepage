import { fetchRecentFeed } from '../../../_utils/fetchAllFeed';
import { locales } from '../../_dictionaries/locales';
import { ArticleList } from './ArticleList';

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}
export default async function PostPage() {
  return (
    <>
      <h2 className="text-4xl">Recent posts</h2>
      <ArticleList initialPosts={await fetchRecentFeed(50)} />
    </>
  );
}
