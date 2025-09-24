'use client';

import React from 'react';
import { Crown } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function ProfileSection({ open = true }: { open?: boolean }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur px-2 py-2">
      <div className="flex items-center gap-3">
        {/* avatar */}
        <div className="grid size-10 place-items-center rounded-full bg-orange-500 text-white font-semibold">
          V
        </div>

        {/* collapsed режим: показываем только аватар */}
        {!open ? null : (
          <div className="flex-1 flex items-center gap-2">
            {/* subscribe pill */}
            <Button variant="subscribe">
              <Crown className="size-4" />
              <span>Subscribe</span>
            </Button>

            {/* discount badge */}
            <div className="rounded-xl bg-purple-300/80 px-2 py-1 text-[12px] font-semibold text-purple-900">
              -50%
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
