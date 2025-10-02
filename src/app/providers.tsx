'use client';

import Script from 'next/script';
import { TranslationProvider } from '@/localization/TranslationProvider';
import '@/localization/dictionaries';
import { StoreProvider } from '@/stores/StoreProvider';
import AuthPromptManager from '@/components/AuthPromptManager';

export function AppProviders({ children }: { children: React.ReactNode }) {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  const handleGoogleScriptLoad = () => {
    if (typeof window === 'undefined') return;
    window.dispatchEvent(new Event('google-identity-loaded'));
  };

  return (
    <TranslationProvider>
      {googleClientId ? (
        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="afterInteractive"
          onLoad={handleGoogleScriptLoad}
        />
      ) : null}
      <StoreProvider>
        <AuthPromptManager />
        {children}
      </StoreProvider>
    </TranslationProvider>
  );
}
