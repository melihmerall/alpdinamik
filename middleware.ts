import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always' // Her locale için prefix göster
});

export const config = {
  // Match all pathnames except for
  // - /api routes
  // - /_next (Next.js internals)
  // - /_vercel (Vercel internals)
  // - /admin (admin panel)
  // - Static files (e.g. /favicon.ico, /robots.txt, etc.)
  matcher: ['/((?!api|_next|_vercel|admin|.*\\..*).*)']
};
