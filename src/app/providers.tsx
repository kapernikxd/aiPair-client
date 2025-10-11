'use client';

import { TranslationProvider } from '@/localization/TranslationProvider';
import '@/localization/dictionaries';
import { StoreProvider } from '@/stores/StoreProvider';
import AuthPromptManager from '@/components/AuthPromptManager';
import Snackbar from '@/components/ui/Snackbar';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <TranslationProvider>
      <StoreProvider>
        <AuthPromptManager />
        <Snackbar />
        {children}
      </StoreProvider>
    </TranslationProvider>
  );
}
