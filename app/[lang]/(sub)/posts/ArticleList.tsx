'use client';
import { HatenaBlogLogo } from '@/app/_components/HatenaBlogLogo';
import clsx from 'clsx';
import {
  startTransition,
  useActionState,
  useEffect,
  useEffectEvent,
  useRef,
} from 'react';
import { FaBuilding } from 'react-icons/fa6';
import { SiZenn } from 'react-icons/si';
import { fetchRemainingPosts } from './actions';

type Article = {
  source: 'hatena blog' | 'zenn' | 'company';
  title: string;
  pubDate: Date;
  link: string;
  description: string;
  image: string;
};
export const ArticleList = ({ initialPosts }: { initialPosts: Article[] }) => {
  const [remainingPosts, loadMore, isPending] = useActionState(
    async (prev: Article[] | null) =>
      prev ??
      (await fetchRemainingPosts(initialPosts.length)).map((post) => ({
        ...post,
        pubDate: new Date(post.pubDate),
      })),
    null,
  );

  const sentinelRef = useRef<HTMLDivElement>(null);
  const onLoadMore = useEffectEvent(() => {
    if (isPending) return;
    startTransition(() => {
      loadMore();
    });
  });
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onLoadMore();
        }
      },
      { rootMargin: '200px' },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  const postsByYear = [
    ...Map.groupBy([...initialPosts, ...(remainingPosts ?? [])], (post) =>
      post.pubDate.getFullYear(),
    ).entries(),
  ].sort((a, b) => Number(b[0]) - Number(a[0]));

  return (
    <>
      {postsByYear.map(([year, posts]) => (
        <section key={year}>
          <div
            className="sticky top-0 z-10 bg-black/70 py-2
              max-w-256 flex place-items-center gap-2
              after:flex-1 after:border-t after:border-gray-300
              before:flex-1 before:border-t before:border-gray-300"
          >
            <div>{year}年</div>
          </div>
          <ul className="flex flex-col gap-y-2 justify-center">
            {posts.map((x) => (
              <li key={x.link}>
                <a
                  href={x.link}
                  className={clsx(
                    'flex flex-col px-2 py-1 max-w-256 rounded shadow-sm overflow-hidden group',
                    {
                      zenn: 'bg-[#3EA8FF] text-gray-900',
                      'hatena blog': 'bg-gray-300 text-gray-800',
                      company: 'bg-emerald-300 text-gray-800',
                    }[x.source],
                  )}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span
                    suppressHydrationWarning={true}
                    className="font-bold group-hover:underline"
                  >
                    <span className="pl-4 mr-1 relative">
                      <span className="absolute left-0 top-1/2 -mt-2">
                        {
                          {
                            'hatena blog': <HatenaBlogLogo width="1rem" />,
                            zenn: <SiZenn size="1rem" />,
                            company: <FaBuilding size="1rem" />,
                          }[x.source]
                        }
                      </span>
                    </span>
                    {x.title}
                  </span>
                  <time
                    dateTime={x.pubDate.toLocaleString('ja-JP')}
                    className="text-sm"
                  >
                    {x.pubDate.toLocaleDateString('ja-JP')}
                  </time>
                </a>
              </li>
            ))}
          </ul>
        </section>
      ))}
      {remainingPosts == null && <div ref={sentinelRef} className="h-1" />}
    </>
  );
};
