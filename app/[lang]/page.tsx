import Link from 'next/link';
import Image from 'next/image';
import { ComponentProps, PropsWithChildren, ReactNode } from 'react';
import { FaFilm, FaGamepad, FaMusic, FaYoutube } from 'react-icons/fa';
import { FaBuilding, FaXTwitter } from 'react-icons/fa6';
import { FiGithub } from 'react-icons/fi';
import { SiWantedly, SiZenn } from 'react-icons/si';
import { BsFillPersonLinesFill } from 'react-icons/bs';

import clsx from 'clsx';
import { fetchAllFeed } from '../_utils/fetchAllFeed';
import { HatenaBlogLogo } from '../_components/HatenaBlogLogo';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../_components/ui/tooltip';
import { QrCodeImage } from '../_components/QrCodeImage';
import { ExternalLink } from '../_components/ExternalLink';
import { getDictionary } from './_dictionaries';
import { ParamsSchema } from './parseLangParam';
import { notFound } from 'next/navigation';

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
          className="hover:underline w-min flex items-center gap-1 p-1.5 bg-slate-900 border-2 border-slate-800 rounded-md"
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

export default async function Home({
  params,
}: {
  params: Promise<Record<string, unknown>>;
}) {
  let lang;
  try {
    ({ lang } = ParamsSchema.parse(await params));
  } catch {
    notFound();
  }
  const dict = (await getDictionary(lang)).home;

  const recentPosts = (await fetchAllFeed()).slice(0, 3);
  return (
    <div className="text-slate-300 w-full max-w-[1680px] place-self-center flex lg:flex-row flex-col gap-3 px-2">
      <div className="flex-2 max-h-screen flex items-center">
        <div
          className={clsx(
            'grid justify-center max-h-screen h-max gap-y-3 gap-x-2 p-3',
            `sm:[grid-template-areas:'icon_name''icon_description''links_links']`,
            'sm:grid-cols-[max-content_1fr]',
            `[grid-template-areas:'name''description''links']`,
            'grid-rows-[repeat(3,min-content)]',
            'grid-cols-1',
          )}
        >
          <Image
            src="/logo-black.png"
            width="300"
            height="300"
            alt=""
            className="sm:block hidden w-36 h-36 rounded-full [grid-area:icon]"
          />
          <h1 className="text-5xl sm:text-6xl font-bold self-end [grid-area:name]">
            pandanoir
          </h1>
          <p className="[grid-area:description]">
            {
              dict[
                'ウェブフロントエンドエンジニア。ReactとTypeScriptに造詣が深い。'
              ]
            }
          </p>
          <ul className="flex gap-2 [grid-area:links]">
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
                icon={<HatenaBlogLogo width="1.3rem" height="1.3rem" />}
                name={dict['はてなブログ']}
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
                name={dict['職務経歴書']}
              />
            </li>
          </ul>
        </div>
      </div>
      <div className="flex-3 flex flex-col gap-3">
        <Section>
          <Heading>Profile</Heading>
          <div className="flex flex-col gap-3">
            <div>
              <SubHeading>
                <FaGamepad /> Hobbies
              </SubHeading>
              <ExternalLinkList className="pl-3">
                <li>{dict['映画']}</li>
                <li>{dict['合気道']}</li>
              </ExternalLinkList>
            </div>
            <div>
              <SubHeading>
                <FaFilm /> Top 5 Films
              </SubHeading>
              <ExternalLinkList className="pl-3">
                <ExternalLinkListItem href="https://www.imdb.com/title/tt0119472/">
                  {dict['ノッキン・オン・ヘブンズ・ドア']}
                </ExternalLinkListItem>
                <ExternalLinkListItem href="https://www.imdb.com/title/tt0780536/">
                  {dict['ヒットマンズレクイエム']}
                </ExternalLinkListItem>
                <ExternalLinkListItem href="https://www.imdb.com/title/tt7085058/">
                  {dict['四月の永い夢']}
                </ExternalLinkListItem>
                <ExternalLinkListItem href="https://www.imdb.com/title/tt0110413/">
                  {dict['レオン']}
                </ExternalLinkListItem>
                <ExternalLinkListItem href="https://www.imdb.com/title/tt0084602/">
                  {dict['ロッキー3']}
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
              2016-2020 {dict['東北大学 電気情報物理工学科 情報学科コース']}
            </li>
            <li>2013-2016 {dict['新潟高校 普通科']}</li>
          </ul>
        </Section>
        <Section>
          <Heading>Recent posts</Heading>
          <div className="flex gap-4 @container">
            {recentPosts.map((post, i) => (
              <a
                key={post.title}
                href={post.link}
                className={clsx(
                  'w-72',
                  i === 2
                    ? 'hidden @4xl:block'
                    : i === 1 && 'hidden @2xl:block',
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.image}
                  className="w-72 aspect-ogp object-cover rounded"
                  alt=""
                />
                <span className="inline-block align-middle mr-1">
                  {
                    {
                      'hatena blog': <HatenaBlogLogo width="1rem" />,
                      zenn: <SiZenn size="1rem" />,
                      company: <FaBuilding size="1rem" />,
                    }[post.source]
                  }
                </span>
                {post.title}
              </a>
            ))}
          </div>
          <br />
          <Link href={`/${lang}/posts`}>read more</Link>
        </Section>
        <Section>
          <Heading>PGP key</Heading>
          <ExternalLink
            href="https://keys.openpgp.org/search?q=307BE088C56B9F0D"
            className="w-max"
          >
            <QrCodeImage value="OPENPGP4FPR:04633A858F3F37D549CF30EE307BE088C56B9F0D" />
          </ExternalLink>
          <p>
            307B E088 C56B 9F0D (
            {lang === 'en' ? (
              <>
                The public key is available at{' '}
                <ExternalLink href="https://keys.openpgp.org/search?q=307BE088C56B9F0D">
                  keys.openpgp.org
                </ExternalLink>
                .
              </>
            ) : lang === 'ja' ? (
              <>
                <ExternalLink href="https://keys.openpgp.org/search?q=307BE088C56B9F0D">
                  keys.openpgp.org
                </ExternalLink>
                から公開鍵を取得できます
              </>
            ) : (
              (lang satisfies never)
            )}
            )
            <br />
            <Link href={`/${lang}/verify-pgp`} className="hover:underline">
              {dict['署名を確認する']}
            </Link>
          </p>
        </Section>
      </div>
    </div>
  );
}
