'use client';
import { HatenaBlogLogo } from '@/app/_components/HatenaBlogLogo';
import clsx from 'clsx';
import { useState } from 'react';
import { FaBuilding } from 'react-icons/fa6';
import { SiZenn } from 'react-icons/si';

type Article = {
  source: 'hatena blog' | 'zenn' | 'company';
  title: string;
  pubDate: Date;
  link: string;
  description: string;
  image: string;
};
export const ArticleList = ({ posts }: { posts: Article[] }) => {
  const [hasClickedReadMore, setHasClickedReadMore] = useState(false);
  const slicedPosts = hasClickedReadMore ? posts : posts.slice(0, 23);

  return (
    <>
      <ul className="flex flex-col gap-y-2 justify-center">
        {slicedPosts.map((x, i) => (
          <>
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
            {i + 1 < slicedPosts.length &&
              x.pubDate.getFullYear() !==
                slicedPosts[i + 1].pubDate.getFullYear() && (
                <div className="max-w-256 grid grid-cols-[1fr_max-content_1fr] items-center gap-2">
                  <div className="bg-gray-300 h-[1px]" />
                  <div>{x.pubDate.getFullYear()}年</div>
                  <div className="bg-gray-300 h-[1px]" />
                </div>
              )}
          </>
        ))}
      </ul>
      {!hasClickedReadMore && (
        <button
          className="border border-gray-500 rounded px-4 py-2 bg-gray-800 w-max"
          onClick={() => setHasClickedReadMore(true)}
        >
          readmore≫
        </button>
      )}
    </>
  );
};
