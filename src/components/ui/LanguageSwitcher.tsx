'use client';

import { useCallback } from 'react';
import { useTranslations } from '@/localization/TranslationProvider';

export function LanguageSwitcher({ className = '' }: { className?: string }) {
  const { locale, setLocale, t } = useTranslations();

  const handleChange = useCallback<React.ChangeEventHandler<HTMLSelectElement>>(
    (event) => {
      const nextLocale = event.target.value === 'en' ? 'en' : 'ru';
      setLocale(nextLocale);
    },
    [setLocale],
  );

  return (
    <label className={`inline-flex items-center gap-2 text-xs text-white/70 ${className}`}>
      <select
        value={locale}
        onChange={handleChange}
        className="rounded-full border border-white/20 bg-transparent px-3 py-1 text-xs font-medium text-white focus:outline-none focus:ring-2 focus:ring-white/40"
      >
        <option value="ru">{t('common.language.ru', 'Русский')}</option>
        <option value="en">{t('common.language.en', 'English')}</option>
      </select>
    </label>
  );
}
