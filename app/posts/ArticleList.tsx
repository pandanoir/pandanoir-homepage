'use client';
import { useState } from 'react';

export type Article = {
  title: string;
  pubDate: Date;
  link: string;
  description: string;
  image: string;
};
export const ArticleList = ({ posts }: { posts: Article[] }) => {
  const [hasClickedReadMore, setHasClickedReadMore] = useState(false);

  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-8 justify-center">
      {(hasClickedReadMore ? posts : posts.slice(0, 23)).map((x) => (
        <li
          key={x.link}
          className="w-128 h-min bg-gray-800 rounded shadow-sm overflow-hidden"
        >
          <a
            href={x.link}
            className="inline-block"
            target="_blank"
            rel="noreferrer"
          >
            {x.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={x.image}
                alt=""
                className="w-128 aspect-ogp object-cover"
              />
            )}
            <div className="px-2 py-1">
              <span suppressHydrationWarning={true} className="font-bold">
                {x.title}
              </span>
              <br />
              <time
                dateTime={x.pubDate.toLocaleString('ja-JP')}
                className="text-sm"
              >
                {x.pubDate.toLocaleDateString('ja-JP')}
              </time>
            </div>
          </a>
        </li>
      ))}
      {!hasClickedReadMore && (
        <li className="w-128 h-min bg-gray-800 rounded shadow-sm overflow-hidden">
          <button
            className="w-128 h-64"
            onClick={() => setHasClickedReadMore(true)}
          >
            readmore≫
          </button>
        </li>
      )}
    </ul>
  );
};
