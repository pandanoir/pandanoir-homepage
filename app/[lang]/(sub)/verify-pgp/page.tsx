import { ExternalLink } from '../../../_components/ExternalLink';
import { ParamsSchema } from '../../parseLangParam';
import { getDictionary } from '../../_dictionaries/getDictionary';
import { locales } from '../../_dictionaries/locales';
import { RichText } from '../../RichText';
import { CopyButton } from '@/app/_components/CopyButton';
import {
  pgpFingerprint,
  shortPgpFingerprint,
} from '../../_constants/pgpFingerprint';
import { promises as fs } from 'fs';

const CodeBlock = (props: { children: string }) => (
  <div className="bg-gray-300 w-min max-w-full text-gray-900 px-4 py-2 rounded-sm relative group">
    <pre className="overflow-x-auto">
      <code>{props.children}</code>
    </pre>
    <CopyButton
      className="group-hover:block hidden absolute top-1.5 right-1.5 border border-black rounded p-1.5 cursor-pointer"
      text={props.children}
    />
  </div>
);

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function VerifyPgpPage({
  params,
}: {
  params: Promise<Record<string, unknown>>;
}) {
  const { lang } = ParamsSchema.parse(await params);
  const [dict, signedMessage] = await Promise.all([
    getDictionary(lang).then((mod) => mod.verifyPage),
    fs.readFile(`${process.cwd()}/public/signed-message.txt`, 'utf8'),
  ]);
  return (
    <>
      <h2 className="text-4xl">Verify PGP</h2>
      <p>
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
          {
            dict[
            '<link>pandanoirのPGP公開鍵</link> の検証手順は以下のとおりです'
            ]
          }
        </RichText>
      </p>
      <ol className="list-decimal list-inside">
        <li>
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
            {dict['<link>pandanoirの公開鍵</link>をダウンロードする']}
          </RichText>
        </li>
        <li>
          {dict['ダウンロードしてきた公開鍵をインポートする']}{' '}
          <code className="bg-gray-500 rounded-xs px-1">
            gpg --import pandanoir.asc
          </code>
        </li>
        <li>
          {dict['以下の署名されたメッセージを検証する']}{' '}
          <code className="bg-gray-500 rounded-xs px-1">
            gpg --verify signed-message.txt
          </code>
          <CodeBlock>{signedMessage}</CodeBlock>
        </li>
      </ol>
      <p>{dict['上記手順を行うbashスクリプトも掲載しておきます。']}</p>
      <CodeBlock>
        {String.raw`
#!/bin/bash
# ${dict['公開鍵を取得して一時鍵リングにインポート']}
mkdir -p /tmp/verify-key
gpg --no-default-keyring \
    --keyring /tmp/verify-key/keyring.gpg \
    --import <(curl -s https://keys.openpgp.org/vks/v1/by-fingerprint/${pgpFingerprint})

# ${dict['メッセージを検証する']}
gpg --no-default-keyring \
    --keyring /tmp/verify-key/keyring.gpg \
    --verify <(curl -s https://www.pandanoir.net/signed-message.txt)

# ${dict['一時鍵リングを削除']}
rm -rf /tmp/verify-key
`.trim()}
      </CodeBlock>
      <p>
        <RichText
          componentMap={{
            link: (children) => (
              <ExternalLink href="https://keybase.io/verify">
                {children}
              </ExternalLink>
            ),
          }}
        >
          {
            dict[
            '<link>keybaseのverify</link>に上記の署名されたメッセージを貼ることで検証することもできます。'
            ]
          }
        </RichText>
      </p>
    </>
  );
}
