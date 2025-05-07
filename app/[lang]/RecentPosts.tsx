import { SiZenn } from 'react-icons/si';
import { HatenaBlogLogo } from '../_components/HatenaBlogLogo';
import { fetchAllFeed } from '../_utils/fetchAllFeed';
import { FaBuilding } from 'react-icons/fa6';
import clsx from 'clsx';

export async function RecentPosts() {
  await new Promise((r) => setTimeout(r, 500));
  const recentPosts = (await fetchAllFeed()).slice(0, 5);
  return (
    <ul className="flex flex-col gap-1">
      {recentPosts.map((post) => (
        <li key={post.title}>
          <a
            href={post.link}
            className="hover:underline rounded-sm px-1 py-0.5"
          >
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
          </a>
        </li>
      ))}
    </ul>
  );
}
