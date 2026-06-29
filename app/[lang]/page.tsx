import Link from 'next/link';
import Image from 'next/image';
import { ComponentProps, PropsWithChildren, ReactNode, Suspense } from 'react';
import { FaFilm, FaGamepad, FaMusic, FaYoutube } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { FiGithub } from 'react-icons/fi';
import { SiKeybase, SiWantedly, SiZenn } from 'react-icons/si';
import { BsFillPersonLinesFill } from 'react-icons/bs';

import { HatenaBlogLogo } from '../_components/HatenaBlogLogo';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../_components/ui/tooltip';
import { QrCodeImage } from '../_components/QrCodeImage';
import { ExternalLink } from '../_components/ExternalLink';
import { getDictionary } from './_dictionaries/getDictionary';
import { ParamsSchema } from './parseLangParam';
import { notFound } from 'next/navigation';
import { locales } from './_dictionaries/locales';
import { RichText } from './RichText';
import { CopyButton } from '../_components/CopyButton';
import {
  pgpFingerprint,
  shortPgpFingerprint,
} from './_constants/pgpFingerprint';
import { fetchAllFeed } from '../_utils/fetchAllFeed';
import { RecentPosts } from './RecentPosts';
import { Skeleton } from '../_components/ui/skeleton';

const Section = ({ children }: PropsWithChildren) => (
  <div className="flex h-max w-full flex-col bg-slate-800/90 px-3 pt-3 pb-6">
    {children}
  </div>
);
const Heading = ({ children }: PropsWithChildren) => (
  <h2 className="mb-3 border-b-2 border-gray-600 text-4xl font-bold">
    {children}
  </h2>
);
const SubHeading = ({ children }: PropsWithChildren) => (
  <h3 className="flex items-center gap-1 text-lg">{children}</h3>
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
          className="flex w-min items-center gap-1 rounded-md border-2 border-slate-700 bg-slate-800 p-1.5 hover:underline"
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

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  let lang;
  try {
    ({ lang } = ParamsSchema.parse(await params));
  } catch {
    notFound();
  }
  const recentPostsPromise = fetchAllFeed()
    .then((posts) => posts.slice(0, 5))
    .catch(() => []);
  const [dict, signedMessage] = await Promise.all([
    getDictionary(lang).then((mod) => mod.home),
    fetch(
      'https://raw.githubusercontent.com/pandanoir/pandanoir/main/signed-message.txt',
      { next: { revalidate: 3600 } }
    ).then((res) => res.text()),
  ]);

  return (
    <div className="w-full max-w-[1680px] place-self-center px-2 text-slate-300">
      <div className="flex flex-col gap-3 lg:flex-row">
        <div className="flex max-h-screen flex-2 items-center">
          <div className="grid h-max max-h-screen grid-cols-1 grid-rows-[repeat(3,min-content)] justify-center gap-x-2 gap-y-3 p-3 pt-6 [grid-template-areas:'name''description''links'] sm:grid-cols-[max-content_1fr] sm:pt-3 sm:[grid-template-areas:'icon_name''icon_description''links_links']">
            <Image
              src="/logo-black.png"
              width="300"
              height="300"
              alt=""
              className="hidden h-36 w-36 rounded-full [grid-area:icon] sm:block"
            />
            <h1 className="self-end text-6xl font-bold [grid-area:name]">
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
                  href="https://keybase.io/pandanoir"
                  icon={<SiKeybase size="1.3rem" />}
                  name="Keybase"
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
        <div className="flex flex-3 flex-col gap-4">
          <Section>
            <Heading>Profile</Heading>
            <div className="flex flex-col gap-3">
              <div>
                <SubHeading>
                  <FaGamepad /> Hobbies
                </SubHeading>
                <ul className="pl-3">
                  <li>
                    {dict['映画']}{' '}
                    <Link
                      href={`/${lang}/films`}
                      className="text-sm text-sky-500 hover:text-sky-300 hover:underline"
                    >
                      {dict['視聴履歴']}
                    </Link>
                  </li>
                  <li>{dict['合気道']}</li>
                </ul>
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
                    {dict['泉まくら']}
                  </ExternalLinkListItem>
                  <ExternalLinkListItem href="https://open.spotify.com/intl-ja/artist/1bj13qFAwnyM3ILOiFnn1Y?si=lZNcP9ecSFG5S-ia0sJTyA">
                    {dict['相対性理論']}
                  </ExternalLinkListItem>
                  <ExternalLinkListItem href="https://open.spotify.com/intl-ja/artist/1mN9lPKzTRTOop4u7S1Uy9?si=CuSKWNGyR6e2syiQAfEH5g">
                    iri
                  </ExternalLinkListItem>
                  <ExternalLinkListItem href="https://open.spotify.com/intl-ja/artist/3rTxb36W3M1BCxx00iiwMU?si=LF8usd58SpKbbHRR7Otuww">
                    {dict['空音']}
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
            <Heading>Recent posts</Heading>
            <Suspense
              fallback={
                <div className="flex flex-col gap-3">
                  <Skeleton className="h-4.5 w-72" />
                  <Skeleton className="h-4.5 w-72" />
                  <Skeleton className="h-4.5 w-72" />
                  <Skeleton className="h-4.5 w-72" />
                  <Skeleton className="h-4.5 w-72" />
                </div>
              }
            >
              <RecentPosts recentPosts={recentPostsPromise} />
            </Suspense>
            <br />
            <Link
              href={`/${lang}/posts`}
              className="text-sky-500 hover:text-sky-300 hover:underline"
            >
              read more
            </Link>
          </Section>
          <Section>
            <Heading>Works</Heading>
            <ul className="flex flex-col gap-1 pl-3">
              <li className="flex flex-col items-start gap-2 md:flex-row md:items-end">
                <ExternalLink href="https://hi-timer.vercel.app">
                  {dict['Hi-Timer']}
                </ExternalLink>
                <span className="text-sm">
                  {dict['ルービックキューブ競技で使えるスタックタイマー']}
                </span>
              </li>
              <li className="flex flex-col items-start gap-2 md:flex-row md:items-end">
                <ExternalLink href="https://pandanoir.github.io/anime-emoji-generator/">
                  {dict['アニメ絵文字ジェネレータ']}
                </ExternalLink>
                <span className="text-sm">
                  {dict['紙芝居式のslackアニメーション絵文字を作るツール']}
                </span>
              </li>
              <li className="flex flex-col items-start gap-2 md:flex-row md:items-end">
                <ExternalLink href="https://github.com/pandanoir/branchify">
                  {dict['branchify']}
                </ExternalLink>
                <span className="text-sm">
                  {
                    dict[
                    'ファイルパスのリストをディレクトリツリーに変換するCLIツール'
                    ]
                  }
                </span>
              </li>
              <li className="flex flex-col items-start gap-2 md:flex-row md:items-end">
                <ExternalLink href="https://www.pandanoir.info/entry/2024/09/04/231051">
                  {dict['電子ペーパー卓上カレンダー']}
                </ExternalLink>
                <span className="text-sm">
                  {dict['Googleカレンダーを表示する電子ペーパー卓上カレンダー']}
                </span>
              </li>
            </ul>
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
            <Heading>PGP key</Heading>
            <ExternalLink
              href={`https://keys.openpgp.org/search?q=${shortPgpFingerprint}`}
              className="w-max"
            >
              <QrCodeImage value={`OPENPGP4FPR:${pgpFingerprint}`} />
            </ExternalLink>
            <p>
              {
                // 4文字区切りでスペースを入れる
                shortPgpFingerprint.match(/.{1,4}/g)?.join(' ') ?? ''
              }{' '}
              (
              <RichText
                componentMap={{
                  link: (children) => (
                    <ExternalLink
                      href={`https://keys.openpgp.org/search?q=${shortPgpFingerprint}`}
                    >
                      {children}
                    </ExternalLink>
                  ),
                }}
              >
                {dict['<link>keys.openpgp.org</link>から公開鍵を取得できます']}
              </RichText>
              )
              <br />
              {dict['署名を確認する']}
            </p>
            <ul className="list-inside list-disc">
              <li>
                <ExternalLink
                  href={`https://keybase.io/verify?msg=${encodeURIComponent(signedMessage)}`}
                >
                  {dict['keybase']}
                </ExternalLink>
              </li>
              <li>
                <Link
                  href={`/${lang}/verify-pgp`}
                  className="text-sky-500 hover:text-sky-300 hover:underline"
                >
                  {dict['手動']}
                </Link>
              </li>
            </ul>
          </Section>
          <Section>
            <Heading>Setup scripts</Heading>
            dotfiles
            <div className="flex max-w-96 gap-1">
              <code className="flex-1 rounded-sm border border-gray-300 px-1 before:content-['$_']">
                curl -sL dot.pandanoir.net | sh
              </code>
              <CopyButton text="curl -sL dot.pandanoir.net | sh" />
            </div>
            tiny vite template
            <div className="flex max-w-96 gap-1">
              <code className="flex-1 rounded-sm border border-gray-300 px-1 before:content-['$_']">
                npx giget@latest gh:pandanoir/my-vite-react-template my-app
                --install
              </code>
              <CopyButton text="npx giget@latest gh:pandanoir/my-vite-react-template my-app --install" />
            </div>
          </Section>
        </div>
      </div>
      <footer className="flex flex-wrap justify-center gap-1">
        <span className="whitespace-nowrap">
          GitHub Repository:{' '}
          <ExternalLink href="https://github.com/pandanoir/pandanoir-homepage">
            pandanoir-homepage
          </ExternalLink>
        </span>
        <span className="whitespace-nowrap">
          (Build Commit ID:
          <ExternalLink
            href={`https://github.com/pandanoir/pandanoir-homepage/tree/${process.env.COMMIT_ID}`}
          >
            {process.env.COMMIT_ID}
          </ExternalLink>
          )
        </span>
      </footer>
    </div>
  );
}
