'use client';

import { useCallback } from 'react';
import AuthPopup from './AuthPopup';
import { useRootStore, useStoreData } from '@/stores/StoreProvider';
import type { AuthProvider } from '@/stores/AuthStore';

export default function AuthPopupContainer() {
  const { uiStore, authStore, profileStore } = useRootStore();
  const isOpen = useStoreData(uiStore, (store) => store.isAuthPopupOpen);
  const profileName = useStoreData(profileStore, (store) => store.profile.username || '');

  const handleProviderAuth = useCallback(
    (provider: AuthProvider) => {
      authStore.startAuth(provider);
      const normalized = profileName.trim().toLowerCase().replace(/\s+/g, '.');
      const fallbackName = profileName.trim() || 'User';

      authStore.completeAuth({
        id: `${provider}-${Date.now()}`,
        name: fallbackName,
        email: `${normalized || 'user'}@example.com`,
      });
      uiStore.closeAuthPopup();
    },
    [authStore, profileName, uiStore],
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
