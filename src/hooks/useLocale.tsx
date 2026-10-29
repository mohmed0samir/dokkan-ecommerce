import { useState, useEffect, useCallback, useContext, createContext } from 'react';
import { Locale, supportedLocales, getStoredLocale, storeLocale, setDocumentDirection, LocaleConfig, locales } from '../locales';

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  config: LocaleConfig;
  t: (key: string, params?: Record<string, string | number>) => string;
  tObject: <T>(key: string) => T;
  formatPrice: (amount: number, options?: { showSymbol?: boolean; showCode?: boolean }) => string;
  formatNumber: (num: number) => string;
  formatDate: (date: Date | string, format?: 'short' | 'long' | 'time') => string;
  formatRelativeTime: (date: Date | string) => string;
  direction: 'rtl' | 'ltr';
  isRTL: boolean;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

// Translation keys type - using a flat key structure
type TranslationKeys = typeof import('../locales/ar').ar;

function getNestedTranslation(obj: Record<string, unknown>, key: string): unknown {
  return key.split('.').reduce((current: unknown, k: string) => {
    if (current && typeof current === 'object' && k in current) {
      return (current as Record<string, unknown>)[k];
    }
    return undefined;
  }, obj) ?? key;
}

export function LocaleProvider({ children, translations }: { children: React.ReactNode; translations: Record<Locale, TranslationKeys> }) {
  const [locale, setLocaleState] = useState<Locale>(() => getStoredLocale());
  const [config, setConfig] = useState<LocaleConfig>(() => locales[getStoredLocale()]);

  const setLocale = useCallback((newLocale: Locale) => {
    if (!supportedLocales.includes(newLocale)) return;
    setLocaleState(newLocale);
    setConfig(locales[newLocale]);
    storeLocale(newLocale);
    setDocumentDirection(newLocale);
  }, []);

  // Update document direction when locale changes
  useEffect(() => {
    setDocumentDirection(locale);
  }, [locale]);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      const translation = getNestedTranslation(translations[locale], key) as string;
      if (!params) return translation;

      // Replace params in translation
      return Object.entries(params).reduce(
        (str, [k, v]) => str.replace(new RegExp(`{{${k}}}`, 'g'), String(v)),
        translation
      );
    },
    [locale, translations]
  );

  const tObject = useCallback(
    <T,>(key: string): T => {
      return getNestedTranslation(translations[locale], key) as T;
    },
    [locale, translations]
  );

  const formatPrice = useCallback(
    (amount: number, options?: { showSymbol?: boolean; showCode?: boolean }) => {
      return new Intl.NumberFormat(locale === 'ar' ? 'ar-SA' : 'en-US', {
        style: 'currency',
        currency: config.currency.code,
        minimumFractionDigits: config.currency.symbol === 'ر.س' ? 2 : 0,
        maximumFractionDigits: config.currency.symbol === 'ر.س' ? 2 : 0,
      }).format(amount);
    },
    [locale, config]
  );

  const formatNumber = useCallback(
    (num: number) => {
      return new Intl.NumberFormat(locale === 'ar' ? 'ar-SA' : 'en-US').format(num);
    },
    [locale]
  );

  const formatDate = useCallback(
    (date: Date | string, format: 'short' | 'long' | 'time' = 'short') => {
      const d = typeof date === 'string' ? new Date(date) : date;
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
    },
    [locale]
  );

  const formatRelativeTime = useCallback(
    (date: Date | string) => {
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
    },
    [locale]
  );

  const direction = config.direction;
  const isRTL = direction === 'rtl';

  const value: LocaleContextType = {
    locale,
    setLocale,
    config,
    t,
    tObject,
    formatPrice,
    formatNumber,
    formatDate,
    formatRelativeTime,
    direction,
    isRTL,
  };

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
}