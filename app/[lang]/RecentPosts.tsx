import clsx from 'clsx';
import { use } from 'react';
import { FaBuilding } from 'react-icons/fa6';
import { FaCalendar } from 'react-icons/fa';
import { SiZenn } from 'react-icons/si';
import { HatenaBlogLogo } from '../_components/HatenaBlogLogo';
import { Post } from '../_utils/fetchAllFeed';

export function RecentPosts({ recentPosts }: { recentPosts: Promise<Post[]> }) {
  return (
    <ul className="grid grid-cols-1 gap-x-2 gap-y-0 sm:grid-cols-[1fr_max-content] sm:gap-y-1">
      {use(recentPosts).map((post) => (
        <li key={post.title} className="contents">
          <a
            href={post.link}
            className="contents rounded-sm px-1 py-0.5 hover:underline"
          >
            <span>
              <span className="relative mr-1 pl-4">
                <span
                  className={clsx(
                    'absolute top-1/2 -left-0.5 -mt-2.5 rounded-full p-0.5',
                    {
                      zenn: 'bg-[#3EA8FF] text-gray-900',
                      'hatena blog': 'bg-gray-300 text-gray-800',
                      company: 'bg-emerald-300 text-gray-800',
                    }[post.source],
                  )}
                >
                  {
                    {
                      'hatena blog': <HatenaBlogLogo width="1rem" />,
                      zenn: <SiZenn size="1rem" />,
                      company: <FaBuilding size="1rem" />,
                    }[post.source]
                  }
                </span>
              </span>
              {post.title}
            </span>
            <span className="pb-2 text-sm text-gray-400 sm:pb-0">
              <span className="inline-flex items-center">
                <FaCalendar className="inline" />
                {post.pubDate.toLocaleDateString('ja-JP')}
              </span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
