'use client';

import { useEffect, useRef, useState } from 'react';
import { Flag, LogOut, MoreHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button, type ButtonVariant } from '@/components/ui/Button';
import { useRootStore, useStoreData } from '@/stores/StoreProvider';
import { useAuthRoutes } from '@/helpers/hooks/useAuthRoutes';
import ReportModal from '@/components/ReportModal';

interface MoreActionsMenuProps {
  buttonAriaLabel?: string;
  align?: 'start' | 'end';
  buttonVariant?: ButtonVariant;
  className?: string;
  mode?: 'self' | 'user' | 'aiAgent';
  reportTargetId?: string;
}

export default function MoreActionsMenu({
  buttonAriaLabel = 'More options',
  align = 'end',
  buttonVariant = 'frostedIcon',
  className,
  mode = 'self',
  reportTargetId,
}: MoreActionsMenuProps) {
  const { authStore, profileStore, uiStore } = useRootStore();
  const hasAttemptedAutoLogin = useStoreData(authStore, (store) => store.hasAttemptedAutoLogin);
  const [open, setOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const [reportError, setReportError] = useState<string | null>(null);
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

  const handleOpenReport = () => {
    setOpen(false);
    setReportError(null);
    setIsReportOpen(true);
  };

  const handleSubmitReport = async (reason: string, details: string) => {
    if (!reportTargetId) {
      setReportError('Unable to submit report: missing target identifier.');
      return;
    }

    setIsSubmittingReport(true);
    setReportError(null);
    try {
      if (mode === 'user') {
        await profileStore.blockUser({ reason, details, targetId: reportTargetId });
      } else {
        await profileStore.reportAiBot({ reason, details, targetId: reportTargetId });
      }
      setIsReportOpen(false);
      uiStore.showSnackbar('Thanks for your report. Our team will review it shortly.', 'success');
    } catch (error) {
      console.error('Failed to submit report', error);
      setReportError('Could not send report. Please try again later.');
    } finally {
      setIsSubmittingReport(false);
    }
  };

  const isReportMode = mode !== 'self';
  const reportDisabled = isReportMode && !reportTargetId;
  const reportLabel = mode === 'aiAgent' ? 'Report AI agent' : 'Report user';

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
          {isReportMode ? (
            <button
              type="button"
              className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left transition ${reportDisabled ? 'cursor-not-allowed text-white/40' : 'hover:bg-white/10'}`}
              onClick={reportDisabled ? undefined : handleOpenReport}
              disabled={reportDisabled}
            >
              <Flag className="size-4" />
              {reportLabel}
            </button>
          ) : (
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left transition hover:bg-white/10"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              <LogOut className="size-4" />
              {isLoggingOut ? 'Logging out…' : 'Log out'}
            </button>
          )}
        </div>
      )}
      {isReportMode ? (
        <ReportModal
          open={isReportOpen}
          type={mode === 'aiAgent' ? 'aiAgent' : 'user'}
          onClose={() => setIsReportOpen(false)}
          onSubmit={handleSubmitReport}
          isSubmitting={isSubmittingReport}
          error={reportError}
        />
      ) : null}
    </div>
  );
}
