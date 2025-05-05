import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;

  // ja locale はリダイレクトする
  if (pathname.toLowerCase().startsWith('/ja')) {
    const redirectUrl = new URL(pathname.replace(/^\/ja(\/|$)/, '/'), origin);
    return NextResponse.redirect(redirectUrl);
  }
  if (pathname.toLowerCase().startsWith('/en-us')) {
    return NextResponse.next();
  }
  const redirectUrl = new URL(`/ja${pathname}`, origin);
  return NextResponse.rewrite(redirectUrl);
}

export const config = {
  matcher: [
    /*
     * 除外したいシステムパス:
     */
    '/((?!_next|api|static|favicon.ico|prettierrc.sh).*)',
  ],
};
