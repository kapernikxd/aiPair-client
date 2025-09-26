'use client';

import React from 'react';
import { Crown } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useRootStore, useStoreData } from '@/stores/StoreProvider';
import { useAuthRoutes } from '@/helpers/hooks/useAuthRoutes';

export default function ProfileSection({ open = true }: { open?: boolean }) {
  const { profileStore, authStore } = useRootStore();
  const { goTo } = useAuthRoutes();
  const profileName = "Name" // useStoreData(profileStore, (store) => store.profile.userName);
  const authUser = useStoreData(authStore, (store) => store.user);
  const displayName = authUser?.name ?? profileName;
  const initial = displayName.charAt(0)?.toUpperCase() || 'U';

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur px-2 py-2">
      <div className="flex items-center gap-3">
        <div onClick={() => goTo("myProfile")} className="grid min-w-10 min-h-10 size-10 place-items-center rounded-full bg-orange-500 text-white font-semibold">
          {initial}
        </div>

        {open ? (

          <div className="mt-1 flex items-center gap-2">
            <div className="text-left">
              <span className="text-sm font-semibold text-white/90">{displayName}</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="subscribe">
                <Crown className="size-4" />
                {/* <span>Subscribe</span> */}
              </Button>
              {/* <div className="rounded-xl bg-purple-300/80 px-2 py-1 text-[12px] font-semibold text-purple-900">-50%</div> */}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
