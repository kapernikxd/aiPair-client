'use client';

import React from 'react';
import { Crown } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useRootStore, useStoreData } from '@/stores/StoreProvider';
import { useAuthRoutes } from '@/helpers/hooks/useAuthRoutes';

export default function ProfileSection({ open = true }: { open?: boolean }) {
  const { profileStore, authStore, uiStore } = useRootStore();
  const { goTo } = useAuthRoutes();
  const profileName = useStoreData(profileStore, (store) => store.profile.userName);
  const isAuthenticated = useStoreData(authStore, (store) => store.isAuthenticated);
  const authUser = useStoreData(authStore, (store) => store.user);
  const displayName = authUser?.name ?? profileName ?? '';
  const initial = (displayName || 'U').charAt(0).toUpperCase();

  const handleProfileClick = () => {
    if (isAuthenticated) {
      goTo('myProfile');
    } else {
      uiStore.openAuthPopup();
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur px-2 py-2">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleProfileClick}
          className="grid min-h-10 min-w-10 size-10 place-items-center rounded-full bg-orange-500 font-semibold text-white transition hover:bg-orange-400"
          aria-label={isAuthenticated ? 'Открыть профиль' : 'Авторизоваться'}
        >
          {initial}
        </button>

        {open && (
          isAuthenticated ? (
            <div className="mt-1 flex items-center gap-2" onClick={handleProfileClick}>
              <div className="text-left">
                <span className="text-sm font-semibold text-white/90">{displayName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="subscribe">
                  <Crown className="size-4" />
                </Button>
              </div>
            </div>
          ) : (
            <Button
              onClick={handleProfileClick}
              variant="ghostRounded"
              className="h-10 px-4 text-sm font-semibold"
            >
              Авторизоваться
            </Button>
          )
        )}
      </div>
    </div>
  );
}
