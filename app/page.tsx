import Image from 'next/image';
import Link from 'next/link';
import { PropsWithChildren } from 'react';
import { fetchBlogFeed } from './posts/fetchBlog';
import { fetchZennFeed } from './posts/fetchZennFeed';

const Section = ({ children }: PropsWithChildren) => (
  <div className="flex flex-col bg-slate-700/40 p-3 h-max">{children}</div>
);
const Heading = ({ children }: PropsWithChildren) => (
  <h2 className="text-4xl font-bold border-b-2 border-gray-600 w-72 sm:w-80 md:w-96 lg:w-96 mb-3">
    {children}
  </h2>
);

const HeroImage = () => (
  <div className="row-start-1 col-start-[-1] flex justify-center items-center">
    <Image
      src="/logo-black.png"
      alt=""
      width="512"
      height="512"
      className="flex-none max-w-full max-h-full rounded-full"
    />
  </div>
);
const HeroContent = ({ children }: PropsWithChildren) => (
  <div className="z-10 flex flex-col gap-4 items-center row-start-1 col-start-[-1]">
    {children}
  </div>
);
const Home = async () => {
  const recentPost = (await Promise.all([fetchBlogFeed(), fetchZennFeed()]))
    .flat()
    .sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime())[0];
  return (
    <div
      className={`grid w-screen h-screen text-slate-300
      before:content-[''] before:bg-black before:opacity-50 before:row-start-1 before:col-start-[-1]`}
    >
      <HeroImage />
      <HeroContent>
        <h1 className="flex-none text-6xl font-bold">pandanoir</h1>
        <div className="flex flex-col md:flex-row flex-wrap justify-center gap-4 row-start-1 col-start-[-1]">
          <Section>
            <Heading>Recent post</Heading>
            <a
              href={recentPost.link}
              target="_blank"
              rel="noreferrer"
              className="w-96"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={recentPost.image}
                className="w-96 aspect-ogp object-cover rounded"
                alt=""
              />
              {recentPost.title}
            </a>
            <br />
            <Link href="/posts">read more</Link>
          </Section>

          <Section>
            <Heading>Works</Heading>
            <a
              href="https://hi-timer.vercel.app/"
              target="_blank"
              rel="noreferrer"
            >
              Hi-Timer
            </a>
          </Section>

          <Section>
            <Heading>Links</Heading>
            <a
              href="https://twitter.com/le_panda_noir"
              target="_blank"
              rel="noreferrer"
              className="w-min"
            >
              Twitter
            </a>
            <a
              href="https://pandanoir.info"
              target="_blank"
              rel="noreferrer"
              className="w-min"
            >
              blog
            </a>
            <a
              href="https://zenn.dev/pandanoir"
              target="_blank"
              rel="noreferrer"
              className="w-min"
            >
              Zenn
            </a>
            <a
              href="https://github.com/pandanoir"
              target="_blank"
              rel="noreferrer"
              className="w-min"
            >
              GitHub
            </a>
          </Section>
        </div>
      </HeroContent>
    </div>
  );
};
export default Home;
