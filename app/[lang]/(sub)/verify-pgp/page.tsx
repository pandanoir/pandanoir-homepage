import { ExternalLink } from '../../../_components/ExternalLink';
import { CodeBlock } from './CodeBlock';
import { ParamsSchema } from '../../parseLangParam';
import { getDictionary } from '../../_dictionaries';
import { locales } from '../../_dictionaries/locales';
import { RichText } from '../../RichText';

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function VerifyPgpPage({
  params,
}: {
  params: Promise<Record<string, unknown>>;
}) {
  const { lang } = ParamsSchema.parse(await params);
  const dict = (await getDictionary(lang)).verifyPage;
  return (
    <>
      <h2 className="text-4xl">Verify PGP</h2>
      <p>
        <RichText
          componentMap={{
            link: (children) => (
              <ExternalLink href="https://keys.openpgp.org/search?q=307BE088C56B9F0D">
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
                <ExternalLink href="https://keys.openpgp.org/search?q=307BE088C56B9F0D">
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
    </>
  );
}
