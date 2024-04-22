import createIntlMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { localePrefix, locales } from './app/utils/navigation/navigation';

export default async function middleware(request: NextRequest) {
  const defaultLocale = request.headers.get('x-your-custom-locale') || 'en';

  const handleI18nRouting = createIntlMiddleware({
    defaultLocale: 'en',
    localePrefix,
    locales,
  });
  const response = await handleI18nRouting(request);
  response.headers.set('x-your-custom-locale', defaultLocale);
  const referer = request.headers.get('Referer') || '';

  if (
    !(request.nextUrl.pathname.includes('/get-started') || request.nextUrl.pathname.includes('/introduction') ||
      request.nextUrl.pathname.includes('/introduction-questionnaire') || request.nextUrl.pathname.includes('/questionnaire') ||
      request.nextUrl.pathname.includes('/ai-or-real') || request.nextUrl.pathname.includes('/thanks') ||
      request.nextUrl.pathname.includes('/demographics') || request.nextUrl.pathname.includes('/select-language') ||
      request.nextUrl.pathname.includes('/results'))
  ) {
    console.log('Redirecting to select-language');
    return NextResponse.redirect(`${request.nextUrl.origin}/${defaultLocale}/select-language`, { status: 302 });
  }

  return response;

}


export const config = {
  // Matcher entries are linked with a logical "or", therefore
  // if one of them matches, the middleware will be invoked.
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
};

