'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useRootStore, useStoreData } from '@/stores/StoreProvider';

const LANDING_PATH = '/';

export default function AuthPromptManager() {
  const pathname = usePathname();
  const { authStore, uiStore } = useRootStore();
  const isAuthenticated = useStoreData(authStore, (store) => store.isAuthenticated);
  const isPopupOpen = useStoreData(uiStore, (store) => store.isAuthPopupOpen);
  const wasForcedRef = useRef(false);

  const shouldForceAuthPopup = !isAuthenticated && pathname !== LANDING_PATH;

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
