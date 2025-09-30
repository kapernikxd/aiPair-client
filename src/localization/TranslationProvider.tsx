'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';


type Locale = 'ru' | 'en';

type TranslationValue = string | string[];

type TranslationDictionaries = Record<Locale, Record<string, TranslationValue>>;

const dictionaries: TranslationDictionaries = {
  ru: {},
  en: {},
};

type TranslationContextValue = {
  locale: Locale;
  setLocale: (next: Locale) => void;
  t: (key: string, fallback: string) => string;
  tList: (key: string, fallback: string[]) => string[];
};

const TranslationContext = createContext<TranslationContextValue | null>(null);

const STORAGE_KEY = 'aipair_locale';

const normalizeLocale = (value: string | null | undefined): Locale | null => {
  if (!value) {
    return null;
  }
  const normalized = value.toLowerCase();
  if (normalized.startsWith('ru')) {
    return 'ru';
  }
  if (normalized.startsWith('en')) {
    return 'en';
  }
  return null;
};

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('ru');

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const stored = normalizeLocale(window.localStorage.getItem(STORAGE_KEY));
    if (stored) {
      setLocaleState(stored);
      return;
    }
    const browserLocale = normalizeLocale(window.navigator.language);
    if (browserLocale) {
      setLocaleState(browserLocale);
    }
  }, []);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale;
    }
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, locale);
    }
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
  }, []);

  const translate = useCallback(
    (key: string, fallback: string) => {
      const value = dictionaries[locale]?.[key];
      if (typeof value === 'string') {
        return value;
      }
      if (Array.isArray(value)) {
        return value.join(' ');
      }
      return fallback;
    },
    [locale],
  );

  const translateList = useCallback(
    (key: string, fallback: string[]) => {
      const value = dictionaries[locale]?.[key];
      if (Array.isArray(value)) {
        return value;
      }
      if (typeof value === 'string') {
        return [value];
      }
      return fallback;
    },
    [locale],
  );

  const value = useMemo<TranslationContextValue>(() => ({
    locale,
    setLocale,
    t: translate,
    tList: translateList,
  }), [locale, setLocale, translate, translateList]);

  return <TranslationContext.Provider value={value}>{children}</TranslationContext.Provider>;
}

export function useTranslations() {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslations must be used within a TranslationProvider');
  }
  return context;
}

export function registerTranslations(locale: Locale, values: Record<string, TranslationValue>) {
  Object.assign(dictionaries[locale], values);
}
