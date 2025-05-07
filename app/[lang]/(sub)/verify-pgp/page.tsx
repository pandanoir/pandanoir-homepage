import Link from 'next/link';
import { ExternalLink } from '../../../_components/ExternalLink';
import { CodeBlock } from './CodeBlock';
import { ParamsSchema } from '../../parseLangParam';
import { getDictionary } from '../../_dictionaries';

export default async function VerifyPgpPage({
  params,
}: {
  params: Promise<Record<string, unknown>>;
}) {
  const { lang } = ParamsSchema.parse(await params);
  const dict = (await getDictionary(lang)).verifyPage;
  return (
    <div className="text-slate-300 px-8 mb-8 flex flex-col justify-center gap-3 sm:gap-4">
      <h1 className="flex-none text-5xl sm:text-6xl font-bold">
        <Link href={`/${lang}`}>pandanoir</Link>
      </h1>
      <h2 className="text-4xl">Verify PGP</h2>
      <p>
        {lang === 'en' ? (
          <>
            Below are the steps to verify{' '}
            <ExternalLink href="https://keys.openpgp.org/search?q=307BE088C56B9F0D">
              the PGP public key of pandanoir
            </ExternalLink>
            .
          </>
        ) : lang === 'ja' ? (
          <>
            <ExternalLink href="https://keys.openpgp.org/search?q=307BE088C56B9F0D">
              pandanoirのPGP公開鍵
            </ExternalLink>{' '}
            の検証手順は以下のとおりです
          </>
        ) : (
          (lang satisfies never)
        )}
      </p>
      <ol className="list-decimal list-inside">
        <li>
          {lang === 'en' ? (
            <>
              Download{' '}
              <ExternalLink href="https://keys.openpgp.org/search?q=307BE088C56B9F0D">
                pandanoir&apos;s public key
              </ExternalLink>
            </>
          ) : lang === 'ja' ? (
            <>
              <ExternalLink href="https://keys.openpgp.org/search?q=307BE088C56B9F0D">
                pandanoirの公開鍵
              </ExternalLink>
              をダウンロードする
            </>
          ) : (
            (lang satisfies never)
          )}
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
          <CodeBlock>
            {`
-----BEGIN PGP SIGNED MESSAGE-----
Hash: SHA512

This is Naoto Ikuno. fingerprint of PGP key is 307BE088C56B9F0D
-----BEGIN PGP SIGNATURE-----

iHUEARYKAB0WIQQEYzqFjz831UnPMO4we+CIxWufDQUCaBM9lAAKCRAwe+CIxWuf
DbD6AP9YlP2i7jL0g2LSx6L0A66d/AJty7WNtBCDtcpdJcZsSwD+JwjhKHlexw13
DHgX18opTngZCo/gQ6KrLecWm9YlMQs=
=puxA
-----END PGP SIGNATURE-----
`.trim()}
          </CodeBlock>
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
    --import <(curl -s https://keys.openpgp.org/vks/v1/by-fingerprint/04633A858F3F37D549CF30EE307BE088C56B9F0D)

# ${dict['メッセージを検証する']}
gpg --no-default-keyring \
    --keyring /tmp/verify-key/keyring.gpg \
    --verify <(curl -s https://www.pandanoir.net/signed-message.txt)

# ${dict['一時鍵リングを削除']}
rm -rf /tmp/verify-key
`.trim()}
      </CodeBlock>
    </div>
  );
}
