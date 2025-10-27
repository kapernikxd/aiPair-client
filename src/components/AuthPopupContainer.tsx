'use client';

import { useCallback } from 'react';
import AuthPopup from './AuthPopup';
import { useRootStore, useStoreData } from '@/stores/StoreProvider';
import { useTranslations } from '@/localization/TranslationProvider';
import { AuthProvider } from '@/types/auth';

export default function AuthPopupContainer() {
  const { uiStore, authStore, profileStore } = useRootStore();
  const isOpen = useStoreData(uiStore, (store) => store.isAuthPopupOpen);
  const profileName = useStoreData(profileStore, (store) => store.profile.username || '');
  const { t } = useTranslations();

  const handleProviderAuth = useCallback(
    (provider: AuthProvider) => {
      authStore.startAuth(provider);
      const normalized = profileName.trim().toLowerCase().replace(/\s+/g, '.');
      const fallbackName = profileName.trim() || t('auth.userFallback', 'User');

      authStore.completeAuth({
        id: `${provider}-${Date.now()}`,
        name: fallbackName,
        email: `${normalized || 'user'}@example.com`,
      });
      uiStore.closeAuthPopup();
    },
    [authStore, profileName, t, uiStore],
  );

  return (
    <AuthPopup
      open={isOpen}
      onClose={() => uiStore.closeAuthPopup()}
      onGoogle={() => handleProviderAuth('google')}
      onApple={() => handleProviderAuth('apple')}
    />
  );
}
