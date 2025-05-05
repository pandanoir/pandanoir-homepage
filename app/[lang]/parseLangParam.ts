import { z } from 'zod';

export const ParamsSchema = z.object({
  lang: z.preprocess(
    (val) => (typeof val === 'string' ? val.toLowerCase() : val),
    z.enum(['en-us', 'ja']),
  ),
});
