import { z } from 'zod';
import { XMLParser } from 'fast-xml-parser';

type Article = {
  title: string;
  pubDate: Date;
  link: string;
  description: string;
  image: string;
};
const parser = new XMLParser({
  ignoreAttributes: false,
});
const rss2Schema = z.object({
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
});

export const fetchRss2 = (url: string): Promise<Article[]> =>
  fetch(url, {
    next: { revalidate: 60 * 10 }, // 10分ごとに更新
  })
    .then((res) => res.text())
    .then((res) =>
      rss2Schema.parse(parser.parse(res)).rss.channel.item.map((x) => ({
        title: x.title,
        pubDate: new Date(x.pubDate),
        link: x.link,
        description: x.description,
        image: x.enclosure['@_url'],
      })),
    );
