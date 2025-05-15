import { SiZenn } from 'react-icons/si';
import { HatenaBlogLogo } from '../_components/HatenaBlogLogo';
import { fetchAllFeed } from '../_utils/fetchAllFeed';
import { FaBuilding } from 'react-icons/fa6';
import clsx from 'clsx';
import { FaCalendar } from 'react-icons/fa';

export async function RecentPosts() {
  await new Promise((r) => setTimeout(r, 500));
  const recentPosts = (await fetchAllFeed()).slice(0, 5);
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-[1fr_max-content] gap-x-2 gap-y-0 sm:gap-y-1">
      {recentPosts.map((post) => (
        <li key={post.title} className="contents">
          <a
            href={post.link}
            className="contents hover:underline rounded-sm px-1 py-0.5"
          >
            <span>
              <span className="pl-4 mr-1 relative">
                <span
                  className={clsx(
                    'absolute p-0.5 -left-0.5 top-1/2 -mt-2.5 rounded-full',
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
            <span className="text-gray-400 text-sm pb-2 sm:pb-0">
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
