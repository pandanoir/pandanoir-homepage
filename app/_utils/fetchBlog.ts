import { z } from 'zod';
import { Article } from '../posts/ArticleList';
import { JSDOM } from 'jsdom';
import { XMLParser } from 'fast-xml-parser';
const parser = new XMLParser({
  ignoreAttributes: false,
});

const fetchOgp = (url: string): Promise<{ image: string }> =>
  fetch(url, { cache: 'force-cache' }) // たぶんOGP画像が変わることはほとんどないのでずっとキャッシュする
    .then((res) => res.text())
    .then((text) => {
      const dom = new new JSDOM().window.DOMParser().parseFromString(
        text,
        'text/html',
      );
      return z.object({ image: z.string() }).parse(
        [...dom.head.children].reduce((ogp, v) => {
          const prop = v.getAttribute('property');
          return prop
            ? { ...ogp, [prop.replace('og:', '')]: v.getAttribute('content') }
            : ogp;
        }, {}),
      );
    });

export const fetchBlogFeed = (): Promise<Article[]> =>
  fetch('https://www.pandanoir.info/feed', {
    next: { revalidate: 60 * 60 * 12 }, //半日ごとに更新
  })
    .then((res) => res.text())
    .then((res) => {
      const parsedXml = parser.parse(res);
      const validated = z
        .object({
          feed: z.object({
            entry: z.array(
              z.object({
                title: z.string(),
                published: z.string(),
                summary: z.object({ '#text': z.string() }),
                link: z
                  .tuple([z.object({ '@_href': z.string() })])
                  .rest(z.any()),
              }),
            ),
          }),
        })
        .parse(parsedXml);

      return Promise.all(
        validated.feed.entry.map(async (x) => {
          const url = x.link[0]['@_href'];
          return {
            title: x.title,
            pubDate: new Date(x.published),
            link: url,
            description: x.summary['#text'],
            image: (await fetchOgp(url)).image,
          };
        }),
      );
    });
