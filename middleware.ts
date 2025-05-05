import { NextRequest, NextResponse } from 'next/server';

const locales = ['en-us', 'en', 'ja'] as const;

export function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;
  const localeInPathname = locales.find(
    (locale) =>
      pathname.toLowerCase().startsWith(`/${locale}/`) ||
      pathname.toLowerCase() === `/${locale}`,
  );

  // ja locale はリダイレクトする
  if (localeInPathname === 'ja') {
    return NextResponse.redirect(
      new URL(pathname.replace(/^\/ja(\/|$)/, '/'), origin),
    );
  }
  // en locale はそのまま返す
  if (localeInPathname === 'en') {
    return NextResponse.next();
  }
  // en-us locale は en に統合
  if (localeInPathname === 'en-us') {
    return NextResponse.redirect(
      new URL(pathname.replace(/^\/en-us/i, '/en'), origin),
    );
  }

  // デフォではja localeと解釈する
  const redirectUrl = new URL(`/ja${pathname}`, origin);
  return NextResponse.rewrite(redirectUrl);
}

export const config = {
  matcher: [
    // publicに入ってるものは拡張子が入ってると解釈して(?:ico|png|...)で指定している
    '/((?!_next|api|static|favicon\\.ico|prettierrc\\.sh|.*\\.(?:ico|png|jpe?g|svg|webp|css|js|txt|json)$).*)',
  ],
};
