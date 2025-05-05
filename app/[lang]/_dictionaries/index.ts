import 'server-only';

const dictionaries = {
  ['en-us']: () => import('./en-US.json').then((module) => module.default),
  ja: () => import('./ja.json').then((module) => module.default),
} as const;

export const getDictionary = async (locale: keyof typeof dictionaries) => {
  return dictionaries[locale]();
};
