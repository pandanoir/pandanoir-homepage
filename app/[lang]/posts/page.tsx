import Link from 'next/link';
import { fetchAllFeed } from '../../_utils/fetchAllFeed';
import { ArticleList } from './ArticleList';
import { ParamsSchema } from '../parseLangParam';

export default async function PostPage({
  params,
}: {
  params: Promise<Record<string, unknown>>;
}) {
  const { lang } = ParamsSchema.parse(await params);
  return (
    <div className="text-slate-300 px-8 mb-8 flex flex-col justify-center gap-3 sm:gap-4">
      <h1 className="flex-none text-5xl sm:text-6xl font-bold">
        <Link href={`/${lang}`}>pandanoir</Link>
      </h1>
      <h2 className="text-4xl">Recent posts</h2>
      <ArticleList posts={await fetchAllFeed()} />
    </div>
  );
}
