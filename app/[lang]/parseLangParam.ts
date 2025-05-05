import { z } from 'zod';
import { locales } from './_dictionaries/locales';

export const ParamsSchema = z.object({
  lang: z.preprocess(
    (val) => (typeof val === 'string' ? val.toLowerCase() : val),
    z.enum(locales),
  ),
});
