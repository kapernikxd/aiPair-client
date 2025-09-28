'use client';

import { useEffect, useRef, useState } from 'react';
import { LogOut, MoreHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button, type ButtonVariant } from '@/components/ui/Button';
import { useRootStore, useStoreData } from '@/stores/StoreProvider';
import { useAuthRoutes } from '@/helpers/hooks/useAuthRoutes';

interface MoreActionsMenuProps {
  buttonAriaLabel?: string;
  align?: 'start' | 'end';
  buttonVariant?: ButtonVariant;
  className?: string;
}

export default function MoreActionsMenu({
  buttonAriaLabel = 'More options',
  align = 'end',
  buttonVariant = 'frostedIcon',
  className,
}: MoreActionsMenuProps) {
  const { authStore } = useRootStore();
  const hasAttemptedAutoLogin = useStoreData(authStore, (store) => store.hasAttemptedAutoLogin);
  const [open, setOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { goTo } = useAuthRoutes();
  const router = useRouter();

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (!hasAttemptedAutoLogin) {
      setOpen(false);
    }
  }, [hasAttemptedAutoLogin]);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      setOpen(false);
      await authStore.logout();
      goTo('home');
    } catch (error) {
      console.error('Failed to logout', error);
      router.refresh();
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className ?? ''}`}>
      <Button
        type="button"
        variant={buttonVariant}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={buttonAriaLabel}
        onClick={() => setOpen((prev) => !prev)}
      >
        <MoreHorizontal className="size-5" />
      </Button>
      {open && (
        <div
          className={`absolute z-50 mt-2 w-44 rounded-xl border border-white/10 bg-neutral-900/95 p-1 text-sm text-white/90 shadow-xl backdrop-blur ${align === 'end' ? 'right-0' : 'left-0'}`}
          role="menu"
        >
          <button
            type="button"
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left transition hover:bg-white/10"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            <LogOut className="size-4" />
            {isLoggingOut ? 'Logging out…' : 'Log out'}
          </button>
        </div>
      )}
    </div>
  );
}
