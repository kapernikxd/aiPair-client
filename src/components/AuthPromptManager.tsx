'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useRootStore, useStoreData } from '@/stores/StoreProvider';

export default function AuthPromptManager() {
  const pathname = usePathname();
  const { authStore, uiStore } = useRootStore();
  const isAuthenticated = useStoreData(authStore, (store) => store.isAuthenticated);
  const hasAttemptedAutoLogin = useStoreData(authStore, (store) => store.hasAttemptedAutoLogin);
  const isPopupOpen = useStoreData(uiStore, (store) => store.isAuthPopupOpen);
  const wasForcedRef = useRef(false);

  const isProtectedRoute = pathname?.startsWith('/admin') ?? false;
  const shouldForceAuthPopup =
    hasAttemptedAutoLogin && isProtectedRoute && !isAuthenticated;

  useEffect(() => {
    if (shouldForceAuthPopup) {
      if (!isPopupOpen) {
        wasForcedRef.current = true;
        uiStore.openAuthPopup();
      }
      return;
    }

    if (wasForcedRef.current) {
      wasForcedRef.current = false;
      if (isPopupOpen) {
        uiStore.closeAuthPopup();
      }
    }
  }, [shouldForceAuthPopup, isPopupOpen, uiStore]);

  return null;
}
