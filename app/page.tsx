import Image from 'next/image';
import { FaFileAlt } from 'react-icons/fa';
import Link from 'next/link';
import { ComponentProps, PropsWithChildren } from 'react';
import { fetchAllFeed } from './_utils/fetchAllFeed';
import {
  FaFilm,
  FaMusic,
  FaGamepad,
  FaYoutube,
  FaTwitter,
  FaGithub,
} from 'react-icons/fa';
import { SiWantedly, SiZenn } from 'react-icons/si';
import { SlNotebook } from 'react-icons/sl';
import clsx from 'clsx';

const Section = ({ children }: PropsWithChildren) => (
  <div className="flex flex-col bg-slate-700/40 p-3 w-full h-max">
    {children}
  </div>
);
const Heading = ({ children }: PropsWithChildren) => (
  <h2 className="text-4xl font-bold border-b-2 border-gray-600 mb-3">
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
  <div className="z-10 flex flex-col gap-4 items-center row-start-1 col-start-[-1] px-8">
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
  const recentPosts = (await fetchAllFeed()).slice(0, 3);
  return (
    <div
      className={`grid w-screen h-screen text-slate-300
      before:content-[''] before:bg-black before:opacity-50 before:row-start-1 before:col-start-[-1]`}
    >
      <HeroImage />
      <HeroContent>
        <h1 className="flex-none text-6xl font-bold">pandanoir</h1>
        <div className="flex flex-col justify-center gap-4 row-start-1 col-start-[-1] w-full">
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
            <Heading>Education</Heading>
            <ul className="pl-3">
              <li>
                2016-2020 東北大学 工学部 電気情報物理工学科 情報工学コース
              </li>
              <li>2013-2016 新潟高校 普通科</li>
            </ul>
          </Section>

          <Section>
            <Heading>Links</Heading>
            <ExternalLink
              href="https://twitter.com/le_panda_noir"
              className="w-min flex items-center gap-1"
            >
              <FaTwitter />
              Twitter
            </ExternalLink>
            <ExternalLink
              href="https://pandanoir.info"
              className="w-min flex items-center gap-1"
            >
              <SlNotebook />
              blog
            </ExternalLink>
            <ExternalLink
              href="https://zenn.dev/pandanoir"
              className="w-min flex items-center gap-1"
            >
              <SiZenn />
              Zenn
            </ExternalLink>
            <ExternalLink
              href="https://github.com/pandanoir"
              className="w-min flex items-center gap-1"
            >
              <FaGithub />
              GitHub
            </ExternalLink>
            <ExternalLink
              href="https://www.wantedly.com/id/naoto_ikuno"
              className="w-min flex items-center gap-1"
            >
              <SiWantedly />
              Wantedly
            </ExternalLink>
            <ExternalLink
              href="https://resume.pandanoir.net/"
              className="w-min flex items-center gap-1"
            >
              <FaFileAlt />
              Resume
            </ExternalLink>
          </Section>

          <Section>
            <Heading>Recent posts</Heading>
            <div className="flex gap-4 @container">
              {recentPosts.map((post, i) => (
                <a
                  key={post.title}
                  href={post.link}
                  target="_blank"
                  rel="noreferrer"
                  className={clsx(
                    'w-96',
                    i === 2
                      ? 'hidden @7xl:block'
                      : i === 1 && 'hidden @4xl:block',
                  )}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.image}
                    className="w-96 aspect-ogp object-cover rounded"
                    alt=""
                  />
                  {post.title}
                </a>
              ))}
            </div>
            <br />
            <Link href="/posts">read more</Link>
          </Section>
        </div>
      </HeroContent>
    </div>
  );
};
export default Home;
