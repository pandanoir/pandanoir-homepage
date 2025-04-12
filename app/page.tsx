import Image from 'next/image';
import Link from 'next/link';
import { ComponentProps, PropsWithChildren } from 'react';
import { fetchAllFeed } from './_utils/fetchAllFeed';
import {
  FaFilm,
  FaMusic,
  FaGamepad,
  FaYoutube,
} from 'react-icons/fa';
import clsx from 'clsx';

const Section = ({ children }: PropsWithChildren) => (
  <div className="flex flex-col bg-slate-700/40 p-3 h-max">{children}</div>
);
const Heading = ({ children }: PropsWithChildren) => (
  <h2 className="text-4xl font-bold border-b-2 border-gray-600 w-72 sm:w-80 md:w-96 lg:w-96 mb-3">
    {children}
  </h2>
);
const SubHeading = ({ children }: PropsWithChildren) => (
  <h3 className="text-lg flex items-center gap-1">{children}</h3>
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

const ExternalLink = (props: ComponentProps<'a'>) => (
  <a
    {...props}
    target="_blank"
    rel="noopener noreferrer"
    className={clsx(props.className, 'hover:underline')}
  />
);
const ExternalLinkList = (props: ComponentProps<'ul'>) => <ul {...props} />;
const ExternalLinkListItem = ({
  href,
  children,
}: PropsWithChildren<{ href: string }>) => (
  <li>
    <ExternalLink href={href}>{children}</ExternalLink>
  </li>
);

const Home = async () => {
  const recentPost = (await fetchAllFeed())[0];
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
            <Heading>Profile</Heading>
            <div className="flex flex-col gap-3">
              <div>
                <SubHeading>
                  <FaGamepad /> Hobbies
                </SubHeading>
                <ExternalLinkList className="pl-3">
                  <li>映画</li>
                  <li>合気道</li>
                </ExternalLinkList>
              </div>
              <div>
                <SubHeading>
                  <FaFilm /> Top 5 Films
                </SubHeading>
                <ExternalLinkList className="pl-3">
                  <ExternalLinkListItem href="https://www.imdb.com/title/tt0119472/">
                    ノッキン・オン・ヘブンズ・ドア
                  </ExternalLinkListItem>
                  <ExternalLinkListItem href="https://www.imdb.com/title/tt0780536/">
                    ヒットマンズレクイエム
                  </ExternalLinkListItem>
                  <ExternalLinkListItem href="https://www.imdb.com/title/tt7085058/">
                    四月の永い夢
                  </ExternalLinkListItem>
                  <ExternalLinkListItem href="https://www.imdb.com/title/tt0110413/">
                    レオン
                  </ExternalLinkListItem>
                  <ExternalLinkListItem href="https://www.imdb.com/title/tt0084602/">
                    ロッキー3
                  </ExternalLinkListItem>
                </ExternalLinkList>
              </div>
              <div>
                <SubHeading>
                  <FaMusic /> Top 5 Artists
                </SubHeading>
                <ExternalLinkList className="pl-3">
                  <ExternalLinkListItem href="https://open.spotify.com/intl-ja/artist/012ldd58H1N5UZLxjMzV29?si=XJEJ9We_QXOwMXovcm285g">
                    泉まくら
                  </ExternalLinkListItem>
                  <ExternalLinkListItem href="https://open.spotify.com/intl-ja/artist/1bj13qFAwnyM3ILOiFnn1Y?si=lZNcP9ecSFG5S-ia0sJTyA">
                    相対性理論
                  </ExternalLinkListItem>
                  <ExternalLinkListItem href="https://open.spotify.com/intl-ja/artist/1mN9lPKzTRTOop4u7S1Uy9?si=CuSKWNGyR6e2syiQAfEH5g">
                    iri
                  </ExternalLinkListItem>
                  <ExternalLinkListItem href="https://open.spotify.com/intl-ja/artist/3rTxb36W3M1BCxx00iiwMU?si=LF8usd58SpKbbHRR7Otuww">
                    空音
                  </ExternalLinkListItem>
                  <ExternalLinkListItem href="https://open.spotify.com/intl-ja/artist/58oPVy7oihAEXE0Ott6JOf?si=u6_r0Q8pSHa8i9QxHKk7lg">
                    Eve
                  </ExternalLinkListItem>
                </ExternalLinkList>
              </div>
              <div>
                <SubHeading>
                  <FaYoutube /> Top 3 Channels
                </SubHeading>
                <ExternalLinkList className="pl-3">
                  <ExternalLinkListItem href="https://www.youtube.com/@omocorochannel">
                    オモコロ
                  </ExternalLinkListItem>
                  <ExternalLinkListItem href="https://www.youtube.com/@TsukinoMito">
                    月ノ美兎
                  </ExternalLinkListItem>
                  <ExternalLinkListItem href="https://www.youtube.com/@QuizKnock">
                    QuizKnock
                  </ExternalLinkListItem>
                </ExternalLinkList>
              </div>
            </div>
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
