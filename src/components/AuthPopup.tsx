'use client';

import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';

import { useAuthRoutes } from '@/helpers/hooks/useAuthRoutes';

type Props = {
  open: boolean;
  onClose: () => void;
  onGoogle?: () => void;
  onApple?: () => void;
  // Картинки на верхней ленте
  coverUrls?: string[];
};

export default function AuthPopup({
  open,
  onClose,
  onGoogle,
  onApple,
  coverUrls = [
    'https://picsum.photos/seed/a/300/420',
    'https://picsum.photos/seed/b/300/420',
    'https://picsum.photos/seed/c/300/420',
    'https://picsum.photos/seed/d/300/420',
    'https://picsum.photos/seed/e/300/420',
  ],
}: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const { routes, goToAdmin } = useAuthRoutes();

  // Закрытие по Esc
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // Клик по фону
  const backdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onMouseDown={backdropClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          aria-labelledby="auth-title"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          {/* Card */}
          <motion.div
            ref={dialogRef}
            className="relative z-10 w-[min(720px,92vw)] overflow-hidden rounded-3xl bg-neutral-900 text-white shadow-2xl ring-1 ring-white/10"
            initial={{ y: 20, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 10, scale: 0.98, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          >
            {/* Верхняя лента с изображениями */}
            <div className="grid grid-cols-5 h-40 sm:h-48">
              {coverUrls.map((src, i) => (
                <div key={i} className="relative overflow-hidden">
                  <img
                    src={src}
                    alt=""
                    className="h-full w-full object-cover"
                    draggable={false}
                  />
                  <div className="absolute inset-0 bg-black/20" />
                </div>
              ))}
              {/* Крестик */}
              <div className="absolute right-3 top-3">
                <Button onClick={onClose} variant="overlayClose" aria-label="Close">
                  <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </Button>
              </div>
            </div>

            {/* Контент */}
            <div className="px-6 pb-7 pt-6 sm:px-10 sm:pb-10 sm:pt-8">
              <h2 id="auth-title" className="text-center text-3xl font-semibold tracking-[-0.02em] sm:text-4xl">
                Create an account.
              </h2>
              <p className="mt-3 text-center text-neutral-300">
                Create an account to unlock free chats with any Talkie!
              </p>

              <div className="mx-auto mt-6 flex max-w-md flex-col gap-4">
                {/* Google */}
                <Button
                  onClick={() => {
                    onGoogle?.();
                    goToAdmin();
                  }}
                  variant="authProvider"
                >
                  <svg viewBox="0 0 48 48" className="size-5" aria-hidden="true">
                    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
                  </svg>
                  Continue with Google
                </Button>

                {/* Apple */}
                <Button
                  onClick={() => {
                    onApple?.();
                    goToAdmin();
                  }}
                  variant="authProvider"
                >
                  <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden="true">
                    <path d="M16.36 13.46c-.03-2.36 1.93-3.49 2.02-3.55-1.1-1.6-2.83-1.82-3.43-1.85-1.46-.15-2.85.86-3.6.86-.75 0-1.9-.84-3.12-.82-1.61.02-3.1.94-3.93 2.39-1.68 2.9-.43 7.18 1.2 9.53.8 1.16 1.75 2.47 3.01 2.42 1.21-.05 1.66-.78 3.12-.78s1.86.78 3.12.76c1.29-.03 2.11-1.18 2.9-2.35.9-1.33 1.27-2.62 1.29-2.69-.03-.01-2.51-.96-2.58-3.92zM14.5 5.6c.66-.8 1.11-1.9.99-2.99-.96.04-2.12.64-2.8 1.43-.61.71-1.15 1.86-1 2.95 1.06.08 2.15-.53 2.81-1.39z"/>
                  </svg>
                  Continue with Apple
                </Button>
              </div>

              <p className="mt-6 text-center text-sm text-neutral-400">
                By continuing, you agree to Talkie’s{' '}
                <a className="underline hover:text-white" href={routes.terms}>Terms of Service</a> and{' '}
                <a className="underline hover:text-white" href={routes.privacy}>Privacy Policy</a>.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
