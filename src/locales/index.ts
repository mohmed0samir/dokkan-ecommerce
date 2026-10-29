// i18n Configuration for Dokkan E-Commerce Platform
// Arabic (RTL) and English (LTR) support

export type Locale = 'ar' | 'en';
export type Direction = 'rtl' | 'ltr';

export interface LocaleConfig {
  code: Locale;
  name: string;
  nativeName: string;
  direction: Direction;
  currency: {
    code: string;
    symbol: string;
    position: 'before' | 'after';
  };
  dateFormat: {
    short: string;
    long: string;
    time: string;
  };
  numberFormat: {
    decimal: string;
    thousands: string;
  };
}

export const locales: Record<Locale, LocaleConfig> = {
  ar: {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    direction: 'rtl',
    currency: {
      code: 'SAR',
      symbol: 'ر.س',
      position: 'after',
    },
    dateFormat: {
      short: 'DD/MM/YYYY',
      long: 'D MMMM YYYY',
      time: 'HH:mm',
    },
    numberFormat: {
      decimal: '.',
      thousands: ',',
    },
  },
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    direction: 'ltr',
    currency: {
      code: 'SAR',
      symbol: 'SAR',
      position: 'before',
    },
    dateFormat: {
      short: 'MM/DD/YYYY',
      long: 'MMMM D, YYYY',
      time: 'hh:mm A',
    },
    numberFormat: {
      decimal: '.',
      thousands: ',',
    },
  },
};

export const defaultLocale: Locale = 'ar';
export const supportedLocales: Locale[] = ['ar', 'en'];

export function getLocaleConfig(locale: Locale): LocaleConfig {
  return locales[locale] || locales[defaultLocale];
}

export function getDirection(locale: Locale): Direction {
  return locales[locale]?.direction || 'ltr';
}

export function isRTL(locale: Locale): boolean {
  return getDirection(locale) === 'rtl';
}

export function formatPrice(amount: number, locale: Locale, options?: {
  showSymbol?: boolean;
  showCode?: boolean;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}): string {
  const config = getLocaleConfig(locale);
  const { currency } = config;

  const formatted = new Intl.NumberFormat(locale === 'ar' ? 'ar-SA' : 'en-US', {
    style: 'currency',
    currency: currency.code,
    minimumFractionDigits: options?.minimumFractionDigits ?? 2,
    maximumFractionDigits: options?.maximumFractionDigits ?? 2,
  }).format(amount);

  // For Arabic, we might want to adjust the symbol position
  if (locale === 'ar' && options?.showSymbol !== false) {
    return formatted.replace(currency.symbol, '').trim() + ' ' + currency.symbol;
  }

  return formatted;
}

export function formatNumber(num: number, locale: Locale): string {
  return new Intl.NumberFormat(locale === 'ar' ? 'ar-SA' : 'en-US').format(num);
}

export function formatDate(date: Date | string, locale: Locale, format: 'short' | 'long' | 'time' = 'short'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const config = getLocaleConfig(locale);

  if (format === 'time') {
    return d.toLocaleTimeString(locale === 'ar' ? 'ar-SA' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  const options: Intl.DateTimeFormatOptions = format === 'short'
    ? { day: '2-digit', month: '2-digit', year: 'numeric' }
    : { day: 'numeric', month: 'long', year: 'numeric' };

  return d.toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', options);
}

export function formatRelativeTime(date: Date | string, locale: Locale): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  const rtf = new Intl.RelativeTimeFormat(locale === 'ar' ? 'ar-SA' : 'en-US', { numeric: 'auto' });

  if (diffSecs < 60) return rtf.format(-diffSecs, 'second');
  if (diffMins < 60) return rtf.format(-diffMins, 'minute');
  if (diffHours < 24) return rtf.format(-diffHours, 'hour');
  if (diffDays < 30) return rtf.format(-diffDays, 'day');
  if (diffDays < 365) return rtf.format(-Math.floor(diffDays / 30), 'month');
  return rtf.format(-Math.floor(diffDays / 365), 'year');
}

export function getLocalizedString(obj: { ar: string; en: string }, locale: Locale): string {
  return obj[locale] || obj[defaultLocale] || '';
}

export function setDocumentDirection(locale: Locale): void {
  const direction = getDirection(locale);
  document.documentElement.dir = direction;
  document.documentElement.lang = locale;
}

export function getBrowserLocale(): Locale {
  if (typeof window === 'undefined') return defaultLocale;

  const browserLang = navigator.language.toLowerCase();
  if (browserLang.startsWith('ar')) return 'ar';
  return 'en';
}

export function getStoredLocale(): Locale {
  if (typeof window === 'undefined') return defaultLocale;

  try {
    const stored = localStorage.getItem('locale') as Locale | null;
    if (stored && supportedLocales.includes(stored)) {
      return stored;
    }
  } catch {
    // localStorage not available
  }
  return getBrowserLocale();
}

export function storeLocale(locale: Locale): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem('locale', locale);
  } catch {
    // localStorage not available
  }
}