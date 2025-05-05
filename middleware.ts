import { NextRequest, NextResponse } from 'next/server';

const locales = ['en', 'ja'] as const;
const secondsPerYear = 60 * 60 * 24 * 365;

// ロケール関連の処理をしている(リダイレクトする、cookieにロケールをセットする)
export function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;
  const localeInPathname = locales.find(
    (locale) =>
      pathname.toLowerCase().startsWith(`/${locale}/`) ||
      pathname.toLowerCase() === `/${locale}`,
  );

  if (localeInPathname === 'ja') {
    // ja locale は /(ロケールなし) にリダイレクトする
    const response = NextResponse.redirect(
      new URL(pathname.replace(/^\/ja(\/?)/, '$1'), origin),
    );
    response.cookies.set('locale', 'ja', { path: '/', maxAge: secondsPerYear });
    return response;
  }
  if (localeInPathname === 'en') {
    // en locale はそのまま返す
    const response = NextResponse.next();
    response.cookies.set('locale', 'en', { path: '/', maxAge: secondsPerYear });
    return response;
  }
  localeInPathname satisfies undefined;

  // localeがURLで指定されてない場合、適切なロケールへリダイレクトする
  // (localeをjaに変更する場合は/jaに明示的にアクセスする方針にしたので、このケースにおいて設定の変更について考えなくて良い)
  const preferredLocale =
    request.headers.get('accept-language')?.split(',')[0].split('-')[0] ?? 'ja';
  const locale = request.cookies.get('locale')?.value ?? preferredLocale;

  if (locale !== 'ja') {
    return NextResponse.redirect(new URL(`/${locale}${pathname}`, origin));
  }
  // jaのときはrewriteを使って、内部的には/ja/でアクセスしたことにする (lang paramを受け取るため)
  return NextResponse.rewrite(new URL(`/ja${pathname}`, origin));
}

export const config = {
  matcher: [
    /*
     * [lang]ルーティングに入れたくないので除外している
     * publicに入ってるものも、拡張子が入ってる=publicとみなして除外している
     */
    '/((?!_next|api|static|favicon\\.ico|prettierrc\\.sh|.*\\.(?:ico|png|jpe?g|svg|webp|css|js|txt|json)$).*)',
  ],
};
