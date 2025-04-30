import Link from 'next/link';
import { ComponentProps, PropsWithChildren, ReactNode } from 'react';
import { FaFilm, FaGamepad, FaMusic, FaYoutube } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { FiGithub } from 'react-icons/fi';
import { SiWantedly, SiZenn } from 'react-icons/si';
import { BsFillPersonLinesFill } from 'react-icons/bs';

import clsx from 'clsx';
import { fetchAllFeed } from './_utils/fetchAllFeed';
import { HatenaBlogLogo } from './_components/HatenaBlogLogo';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './_components/ui/tooltip';

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

const ExternalLink = (props: ComponentProps<'a'>) => (
  <a
    {...props}
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
const IconLink = ({
  href,
  name,
  icon,
}: {
  href: string;
  name: string;
  icon: ReactNode;
}) => (
  <TooltipProvider delayDuration={0}>
    <Tooltip>
      <TooltipTrigger asChild>
        <a
          href={href}
          rel="noopener noreferrer"
          className="hover:underline w-min flex items-center gap-1 p-1.5 bg-slate-900 border border-slate-800 border-2 rounded-md"
        >
          {icon}
          <span className="sr-only">{name}</span>
        </a>
      </TooltipTrigger>
      <TooltipContent
        className="bg-gray-400 text-black"
        arrowClassName="bg-gray-400 fill-gray-400"
      >
        {name}
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

export default async function Home() {
  const recentPosts = (await fetchAllFeed()).slice(0, 3);
  return (
    <div className="text-slate-300 px-8 flex flex-col justify-center gap-3 sm:gap-4">
      <h1 className="flex-none text-5xl sm:text-6xl font-bold">pandanoir</h1>
      ウェブフロントエンドエンジニア。ReactとTypeScriptに造詣が深い。
      <ul className="flex gap-2">
        <li>
          <IconLink
            href="https://x.com/le_panda_noir"
            icon={<FaXTwitter size="1.3rem" />}
            name="X"
          />
        </li>
        <li>
          <IconLink
            href="https://pandanoir.info"
            icon={
              <HatenaBlogLogo
                width="1.3rem"
                height="1.3rem"
                stroke="currentColor"
                fill="currentColor"
                viewBox="51 51 198 198"
              />
            }
            name="はてなブログ"
          />
        </li>
        <li>
          <IconLink
            href="https://zenn.dev/pandanoir"
            icon={<SiZenn size="1.3rem" />}
            name="Zenn"
          />
        </li>
        <li>
          <IconLink
            href="https://github.com/pandanoir"
            icon={<FiGithub size="1.3rem" />}
            name="GitHub"
          />
        </li>
        <li>
          <IconLink
            href="https://www.wantedly.com/id/naoto_ikuno"
            icon={<SiWantedly size="1.3rem" />}
            name="Wantedly"
          />
        </li>
        <li>
          <IconLink
            href="https://resume.pandanoir.net/"
            icon={<BsFillPersonLinesFill size="1.3rem" />}
            name="職務経歴書"
          />
        </li>
      </ul>
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
          <li>2016-2020 東北大学 工学部 電気情報物理工学科 情報工学コース</li>
          <li>2013-2016 新潟高校 普通科</li>
        </ul>
      </Section>
      <Section>
        <Heading>Recent posts</Heading>
        <div className="flex gap-4 @container">
          {recentPosts.map((post, i) => (
            <a
              key={post.title}
              href={post.link}
              rel="noreferrer"
              className={clsx(
                'w-96',
                i === 2 ? 'hidden @7xl:block' : i === 1 && 'hidden @4xl:block',
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
  );
}
