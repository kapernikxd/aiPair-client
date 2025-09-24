'use client';

import { FormEvent, MouseEvent as ReactMouseEvent, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { Button } from '@/components/ui/Button';
import { useRootStore } from '@/stores/StoreProvider';
import { useAuthRoutes } from '@/helpers/hooks/useAuthRoutes';

type EmailAuthPopupProps = {
  open: boolean;
  onBack: () => void;
  onClose: () => void;
  onSuccess: () => void;
};

type FormErrors = {
  email?: string;
  password?: string;
  general?: string;
};

export default function EmailAuthPopup({ open, onBack, onClose, onSuccess }: EmailAuthPopupProps) {
  const { authStore } = useRootStore();
  const { goToAdmin } = useAuthRoutes();
  const dialogRef = useRef<HTMLDivElement>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      setEmail('');
      setPassword('');
      setErrors({});
      setSubmitting(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  const handleBackdropClick = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors({});
    setSubmitting(true);

    try {
      await authStore.login({ email, password });
      goToAdmin();
      onSuccess();
    } catch (error) {
      if (error && typeof error === 'object') {
        const fieldErrors: Record<string, string> = error as Record<string, string>;
        const nextErrors: FormErrors = {
          email: fieldErrors.email,
          password: fieldErrors.password,
          general: fieldErrors.general ?? fieldErrors.message,
        };

        if (!nextErrors.general && 'detail' in fieldErrors) {
          nextErrors.general = String((fieldErrors as { detail?: string }).detail);
        }

        if (!nextErrors.general && !nextErrors.email && !nextErrors.password) {
          nextErrors.general = 'Не удалось выполнить вход. Попробуйте еще раз.';
        }

        setErrors(nextErrors);
      } else {
        setErrors({ general: 'Не удалось выполнить вход. Попробуйте еще раз.' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center"
          onMouseDown={handleBackdropClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          aria-modal="true"
          role="dialog"
          aria-labelledby="email-auth-title"
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <motion.div
            ref={dialogRef}
            className="relative z-10 w-[min(420px,92vw)] overflow-hidden rounded-3xl bg-neutral-900 text-white shadow-2xl ring-1 ring-white/10"
            initial={{ y: 16, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 10, opacity: 0, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 240, damping: 24 }}
          >
            <div className="absolute left-4 top-4 flex gap-2">
              <Button type="button" variant="ghostRounded" className="gap-2" onClick={onBack}>
                <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m15 19-7-7 7-7" />
                </svg>
                Back
              </Button>
            </div>
            <div className="absolute right-3 top-3">
              <Button onClick={onClose} variant="overlayClose" aria-label="Close email auth dialog">
                <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
                </svg>
              </Button>
            </div>

            <div className="px-6 pb-8 pt-16">
              <h2 id="email-auth-title" className="text-center text-2xl font-semibold tracking-tight">Sign in with email</h2>
              <p className="mt-2 text-center text-sm text-neutral-300">Введите свой email и пароль, чтобы продолжить.</p>

              <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
                <label className="flex flex-col text-sm text-neutral-200">
                  Email
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    className="mt-1 rounded-2xl border border-white/15 bg-neutral-950 px-4 py-3 text-sm text-white placeholder:text-neutral-500 focus:border-violet-500 focus:outline-none"
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                  {errors.email && <span className="mt-1 text-xs text-rose-400">{errors.email}</span>}
                </label>

                <label className="flex flex-col text-sm text-neutral-200">
                  Password
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    className="mt-1 rounded-2xl border border-white/15 bg-neutral-950 px-4 py-3 text-sm text-white placeholder:text-neutral-500 focus:border-violet-500 focus:outline-none"
                    placeholder="••••••••"
                    autoComplete="current-password"
                  />
                  {errors.password && <span className="mt-1 text-xs text-rose-400">{errors.password}</span>}
                </label>

                {errors.general && <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{errors.general}</div>}

                <Button type="submit" variant="primaryTight" disabled={submitting} className="w-full">
                  {submitting ? 'Signing in…' : 'Sign in'}
                </Button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
