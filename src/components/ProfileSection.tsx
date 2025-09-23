'use client';

import React from 'react';
import { Crown } from 'lucide-react';

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
            <button
              className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold 
                         text-white ring-1 ring-white/10 
                         bg-gradient-to-r from-fuchsia-400/30 via-pink-400/30 to-purple-400/30
                         hover:from-fuchsia-400/40 hover:to-purple-400/40 transition"
            >
              <Crown className="size-4" />
              <span>Subscribe</span>
            </button>

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
