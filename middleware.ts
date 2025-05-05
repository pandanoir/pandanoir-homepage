import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;

  // ja locale はリダイレクトする
  if (pathname.toLowerCase().startsWith('/ja')) {
    const redirectUrl = new URL(pathname.replace(/^\/ja(\/|$)/, '/'), origin);
    return NextResponse.redirect(redirectUrl);
  }
  // en-us locale はそのまま返す
  if (/^\/en-us(\/|$)/i.test(pathname)) {
    return NextResponse.next();
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
