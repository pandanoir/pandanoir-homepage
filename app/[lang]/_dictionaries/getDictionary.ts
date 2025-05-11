import 'server-only';
import { locales } from './locales';

const dictionaries = {
  en: () => import('./en.json').then((module) => module.default),
  ja: () => import('./ja.json').then((module) => module.default),
} as const satisfies Record<(typeof locales)[number], unknown>;

export const getDictionary = async (locale: keyof typeof dictionaries) => {
  return dictionaries[locale]();
};
