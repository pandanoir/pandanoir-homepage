import { z } from 'zod';
import { Article } from '../posts/ArticleList';
import { XMLParser } from 'fast-xml-parser';
const parser = new XMLParser({
  ignoreAttributes: false,
});

export const fetchZennFeed = (): Promise<Article[]> =>
  fetch('https://zenn.dev/pandanoir/feed', {
    next: { revalidate: 60 * 60 * 12 }, //半日ごとに更新
  })
    .then((res) => res.text())
    .then((res) =>
      z
        .object({
          rss: z.object({
            channel: z.object({
              item: z.array(
                z.object({
                  title: z.string(),
                  pubDate: z.string(),
                  description: z.string(),
                  link: z.string(),
                  enclosure: z.object({ '@_url': z.string() }),
                }),
              ),
            }),
          }),
        })
        .parse(parser.parse(res))
        .rss.channel.item.map((x) => ({
          title: x.title,
          pubDate: new Date(x.pubDate),
          link: x.link,
          description: x.description,
          image: x.enclosure['@_url'],
        })),
    );
