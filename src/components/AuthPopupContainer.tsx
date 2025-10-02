'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import AuthPopup from './AuthPopup';
import { useRootStore, useStoreData } from '@/stores/StoreProvider';
import type { AuthProvider } from '@/stores/AuthStore';
import { useTranslations } from '@/localization/TranslationProvider';
import { useAuthRoutes } from '@/helpers/hooks/useAuthRoutes';

const GOOGLE_PROMPT_EVENT = 'google-identity-loaded';

export default function AuthPopupContainer() {
  const { uiStore, authStore, profileStore } = useRootStore();
  const isOpen = useStoreData(uiStore, (store) => store.isAuthPopupOpen);
  const profileName = useStoreData(profileStore, (store) => store.profile.username || '');
  const { t } = useTranslations();
  const { goToAdmin } = useAuthRoutes();

  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? '';
  const hasGoogleClientId = googleClientId.length > 0;

  const [isGoogleScriptReady, setIsGoogleScriptReady] = useState(() =>
    typeof window !== 'undefined' ? Boolean(window.google?.accounts?.id) : false,
  );
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [googleErrorMessage, setGoogleErrorMessage] = useState<string | null>(null);

  const isGoogleAvailable = useMemo(
    () => hasGoogleClientId && isGoogleScriptReady,
    [hasGoogleClientId, isGoogleScriptReady],
  );

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
      goToAdmin();
    },
    [authStore, goToAdmin, profileName, t, uiStore],
  );

  const resetGoogleState = useCallback(() => {
    setIsGoogleLoading(false);
    setGoogleErrorMessage(null);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      resetGoogleState();
      return;
    }

    if (!hasGoogleClientId) {
      setGoogleErrorMessage(t('auth.google.unavailable', 'Google sign-in is not configured.'));
    }
  }, [hasGoogleClientId, isOpen, resetGoogleState, t]);

  useEffect(() => {
    if (!hasGoogleClientId) {
      setIsGoogleScriptReady(false);
      return;
    }

    if (typeof window === 'undefined') {
      return;
    }

    const updateReady = () => {
      setIsGoogleScriptReady(Boolean(window.google?.accounts?.id));
    };

    updateReady();

    window.addEventListener(GOOGLE_PROMPT_EVENT, updateReady);
    return () => window.removeEventListener(GOOGLE_PROMPT_EVENT, updateReady);
  }, [hasGoogleClientId]);

  const handleGoogleCredential = useCallback(
    async (response: GoogleCredentialResponse) => {
      if (!response?.credential) {
        setIsGoogleLoading(false);
        setGoogleErrorMessage(t('auth.google.error', 'Google sign-in failed. Please try again.'));
        authStore.cancelAuth();
        return;
      }

      try {
        await authStore.loginByGoogle(response.credential);
        setGoogleErrorMessage(null);
        uiStore.closeAuthPopup();
        goToAdmin();
      } catch (error) {
        console.error('Google sign-in failed', error);
        setGoogleErrorMessage(t('auth.google.error', 'Google sign-in failed. Please try again.'));
      } finally {
        setIsGoogleLoading(false);
        const googleId = window.google?.accounts?.id;
        googleId?.cancel();
      }
    },
    [authStore, goToAdmin, t, uiStore],
  );

  useEffect(() => {
    if (!isGoogleAvailable) return;
    if (typeof window === 'undefined') return;

    const googleId = window.google?.accounts?.id;
    googleId?.initialize({
      client_id: googleClientId,
      callback: handleGoogleCredential,
      ux_mode: 'popup',
      auto_select: false,
      cancel_on_tap_outside: true,
    });
  }, [googleClientId, handleGoogleCredential, isGoogleAvailable]);

  const handleGoogleAuth = useCallback(() => {
    if (!hasGoogleClientId) {
      setGoogleErrorMessage(t('auth.google.unavailable', 'Google sign-in is not configured.'));
      return;
    }

    const googleId = window.google?.accounts?.id;
    if (!googleId) {
      setGoogleErrorMessage(t('auth.google.error', 'Google sign-in failed. Please try again.'));
      return;
    }

    setGoogleErrorMessage(null);
    setIsGoogleLoading(true);
    authStore.startAuth('google');

    try {
      googleId.prompt((notification) => {
        if (notification.isNotDisplayed()) {
          setIsGoogleLoading(false);
          setGoogleErrorMessage(t('auth.google.error', 'Google sign-in failed. Please try again.'));
          authStore.cancelAuth();
        } else if (notification.isDismissedMoment() || notification.isSkippedMoment()) {
          setIsGoogleLoading(false);
          authStore.cancelAuth();
        }
      });
    } catch (error) {
      console.error('Failed to prompt Google sign-in', error);
      setIsGoogleLoading(false);
      setGoogleErrorMessage(t('auth.google.error', 'Google sign-in failed. Please try again.'));
      authStore.cancelAuth();
    }
  }, [authStore, hasGoogleClientId, t]);

  useEffect(() => {
    return () => {
      const googleId = window.google?.accounts?.id;
      googleId?.cancel();
    };
  }, []);

  return (
    <AuthPopup
      open={isOpen}
      onClose={() => {
        const googleId = window.google?.accounts?.id;
        googleId?.cancel();
        uiStore.closeAuthPopup();
      }}
      onGoogle={handleGoogleAuth}
      onApple={() => handleProviderAuth('apple')}
      isGoogleLoading={isGoogleLoading}
      isGoogleAvailable={isGoogleAvailable}
      googleErrorMessage={googleErrorMessage}
    />
  );
}
