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
        <div className="border border-gray-700 rounded-full text-gray-300 bg-black p-1">
          <IoLanguage size="1.8rem" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem asChild>
          <Link href={`/en${pathnameWithoutLang}`}>
            English {localeInPathname === 'en' && <FaCheck />}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/ja${pathnameWithoutLang}`}>
            日本語 {(localeInPathname ?? 'ja') === 'ja' && <FaCheck />}
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
