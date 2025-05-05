'use client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './_components/ui/dropdown-menu';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IoLanguage } from 'react-icons/io5';

export const LanguageChangeButton = () => {
  const pathnameWithoutLang = usePathname().replace(/^\/(en-us|ja)/i, '');
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="border border-gray-700 rounded-full text-gray-300 bg-black p-1">
          <IoLanguage size="1.8rem" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem asChild>
          <Link href={`/en-US${pathnameWithoutLang}`}>English</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={pathnameWithoutLang || '/'}>日本語</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
