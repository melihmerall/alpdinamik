"use client";

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { locales } from '@/i18n';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    // Remove current locale from pathname
    const pathnameWithoutLocale = pathname.replace(`/${locale}`, '');
    
    // Navigate to new locale
    router.push(`/${newLocale}${pathnameWithoutLocale}`);
  };

  return (
    <div className="language-switcher" style={{ display: 'flex', gap: '0.5rem' }}>
      {locales.map((loc) => (
        <button
          key={loc}
          onClick={() => switchLocale(loc)}
          className={`lang-btn ${locale === loc ? 'active' : ''}`}
          style={{
            padding: '0.25rem 0.75rem',
            border: locale === loc ? '2px solid #007bff' : '1px solid #ddd',
            background: locale === loc ? '#007bff' : 'white',
            color: locale === loc ? 'white' : '#333',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: locale === loc ? '600' : '400',
            textTransform: 'uppercase',
            transition: 'all 0.2s ease',
          }}
        >
          {loc === 'tr' ? '🇹🇷 TR' : '🇬🇧 EN'}
        </button>
      ))}
    </div>
  );
}

