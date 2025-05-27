'use client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../_components/ui/dropdown-menu';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IoLanguage } from 'react-icons/io5';
import { locales } from './_dictionaries/locales';
import { FaCheck } from 'react-icons/fa6';

export const LanguageChangeButton = () => {
  const pathname = usePathname();
  const localeInPathname = locales.find(
    (locale) =>
      pathname.toLowerCase().startsWith(`/${locale}/`) ||
      pathname.toLowerCase() === `/${locale}`,
  );
  const pathnameWithoutLang = pathname.replace(
    new RegExp(`^/${localeInPathname}`, 'i'),
    '',
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <button
          type="button"
          className="border-2 border-gray-800 rounded-full text-gray-400 bg-black p-1.5 cursor-pointer"
        >
          <IoLanguage size="1.6rem" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem asChild>
          <Link href={`/en${pathnameWithoutLang}`} replace>
            English {localeInPathname === 'en' && <FaCheck />}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/ja${pathnameWithoutLang}`} replace>
            日本語 {(localeInPathname ?? 'ja') === 'ja' && <FaCheck />}
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
