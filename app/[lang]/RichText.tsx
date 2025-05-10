import type { JSX, ReactNode } from 'react';

/**
 * 文字列に含まれる <tag>〜</tag> を React コンポーネントに置き換える
 * @param translation 翻訳文字列（例: "<link>link</link>です"）
 * @param componentMap 置き換えたいタグ名とコンポーネントの辞書
 */
export function RichText({
  children,
  componentMap,
}: {
  children: string;
  componentMap: Record<string, (children: ReactNode) => JSX.Element>;
}): JSX.Element {
  const result: ReactNode[] = [];

  // [plainText, taggedText, plainText, taggedText, ...] という感じにパースして、taggedTextはコンポーネントで置き換える (["foo", <Link>link</Link> "bar"]みたいな)
  const regex = /<(\w+)>(.*?)<\/\1>/g;
  let lastIndex = 0,
    match;
  while ((match = regex.exec(children)) !== null) {
    const [fullMatch, tag, innerText] = match;
    const { index } = match;

    // plainTextを追加
    result.push(children.slice(lastIndex, index));

    // タグの中身を対応コンポーネントで包む。なければそのままテキストとして表示する
    result.push(componentMap[tag]?.(innerText) ?? fullMatch);

    lastIndex = index + fullMatch.length;
  }
  // 残りのplainTextを追加
  result.push(children.slice(lastIndex));

  return <>{result.filter((x) => typeof x !== 'string' || x.length > 0)}</>;
}
