'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Flag, LogOut, MoreHorizontal, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button, type ButtonVariant } from '@/components/ui/Button';
import { useRootStore, useStoreData } from '@/stores/StoreProvider';
import { useAuthRoutes } from '@/helpers/hooks/useAuthRoutes';
import ReportModal from '@/components/ReportModal';
import ModalShell from '@/components/profile/edit/overview/ModalShell';
import { useTranslations } from '@/localization/TranslationProvider';

interface MoreActionsMenuProps {
  buttonAriaLabel?: string;
  align?: 'start' | 'end';
  buttonVariant?: Exclude<ButtonVariant, 'gradient'>;
  className?: string;
  mode?: 'self' | 'user' | 'aiAgent';
  reportTargetId?: string;
  aiAgentId?: string;
  canDeleteAiAgent?: boolean;
  onAiAgentDeleted?: () => void;
}

export default function MoreActionsMenu({
  buttonAriaLabel,
  align = 'end',
  buttonVariant = 'frostedIcon',
  className,
  mode = 'self',
  reportTargetId,
  aiAgentId,
  canDeleteAiAgent = false,
  onAiAgentDeleted,
}: MoreActionsMenuProps) {
  const { authStore, profileStore, uiStore, aiBotStore } = useRootStore();
  const { t } = useTranslations();
  const hasAttemptedAutoLogin = useStoreData(authStore, (store) => store.hasAttemptedAutoLogin);
  const [open, setOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const [reportError, setReportError] = useState<string | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [resolvedAlign, setResolvedAlign] = useState<'start' | 'end'>(align);
  const { goTo } = useAuthRoutes();
  const router = useRouter();
  const menuAriaLabel = buttonAriaLabel ?? t('common.moreOptions', 'More options');

  useEffect(() => {
    setResolvedAlign((previous) => (previous === align ? previous : align));
  }, [align]);

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
      setReportError(
        t('moreActions.report.missingTarget', 'Unable to submit report: missing target identifier.'),
      );
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
      uiStore.showSnackbar(
        t('moreActions.report.success', 'Thanks for your report. Our team will review it shortly.'),
        'success',
      );
    } catch (error) {
      console.error('Failed to submit report', error);
      setReportError(
        t('moreActions.report.error', 'Could not send report. Please try again later.'),
      );
    } finally {
      setIsSubmittingReport(false);
    }
  };

  const handleOpenDelete = () => {
    setOpen(false);
    setDeleteError(null);
    setIsDeleteOpen(true);
  };

  const handleCloseDelete = () => {
    if (isDeleting) return;
    setIsDeleteOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!aiAgentId) {
      setDeleteError(
        t('moreActions.delete.missingTarget', 'Unable to delete AI agent: missing target identifier.'),
      );
      return;
    }

    setIsDeleting(true);
    setDeleteError(null);
    try {
      await aiBotStore.deleteBot(aiAgentId);
      setIsDeleteOpen(false);
      uiStore.showSnackbar(t('moreActions.delete.success', 'AI agent deleted'), 'success');
      onAiAgentDeleted?.();
    } catch (error) {
      console.error('Failed to delete AI agent', error);
      setDeleteError(
        t('moreActions.delete.error', 'Could not delete this AI agent. Please try again later.'),
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const isReportMode = mode !== 'self';
  const reportDisabled = isReportMode && !reportTargetId;
  const reportLabel =
    mode === 'aiAgent'
      ? t('report.agent.title', 'Report AI agent')
      : t('report.user.title', 'Report user');
  const canShowDeleteOption = mode === 'aiAgent' && canDeleteAiAgent;
  const deleteTitle = t('moreActions.delete.title', 'Delete AI agent?');
  const deleteDescription = t(
    'moreActions.delete.description',
    'Deleting this AI agent will permanently remove all of its chats, conversations, and related information for every user. This action cannot be undone. Are you sure you want to continue?',
  );
  const cancelLabel = t('common.cancel', 'Cancel');
  const deleteLabel = t('common.delete', 'Delete');
  const deletingLabel = t('common.deleting', 'Deleting…');

  useLayoutEffect(() => {
    if (!open) return;

    setResolvedAlign((previous) => (previous === align ? previous : align));

    const ensureMenuWithinViewport = () => {
      const menu = menuRef.current;
      if (!menu) return;

      const rect = menu.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const safePadding = 16;

      if (rect.left < safePadding && resolvedAlign !== 'start') {
        setResolvedAlign('start');
        return;
      }

      if (rect.right > viewportWidth - safePadding && resolvedAlign !== 'end') {
        setResolvedAlign('end');
      }
    };

    const rafId = window.requestAnimationFrame(ensureMenuWithinViewport);
    const handleResize = () => {
      window.requestAnimationFrame(ensureMenuWithinViewport);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleResize);
    };
  }, [align, open, resolvedAlign]);

  const alignmentClass = 'left-0';

  return (
    <div ref={containerRef} className={`relative ${className ?? ''}`}>
      <Button
        type="button"
        variant={buttonVariant}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={menuAriaLabel}
        onClick={() => setOpen((prev) => !prev)}
      >
        <MoreHorizontal className="size-5" />
      </Button>
      {open && (
        <div
          ref={menuRef}
          className={`absolute z-50 mt-2 w-44 max-w-[calc(100vw-2rem)] rounded-xl border border-white/10 bg-neutral-900/95 p-1 text-sm text-white/90 shadow-xl backdrop-blur ${alignmentClass}`}
          role="menu"
        >
          {isReportMode ? (
            <>
              {canShowDeleteOption ? (
              <button
                type="button"
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-red-400 transition hover:bg-red-500/10"
                onClick={handleOpenDelete}
              >
                <Trash2 className="size-4" />
                  {t('moreActions.delete.button', 'Delete AI agent')}
              </button>
              ) : null}
              <button
                type="button"
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left transition ${reportDisabled ? 'cursor-not-allowed text-white/40' : 'hover:bg-white/10'}`}
                onClick={reportDisabled ? undefined : handleOpenReport}
                disabled={reportDisabled}
              >
                <Flag className="size-4" />
                {reportLabel}
              </button>
            </>
          ) : (
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left transition hover:bg-white/10"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              <LogOut className="size-4" />
              {isLoggingOut ? t('common.loggingOut', 'Logging out…') : t('common.logout', 'Log out')}
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
      {canShowDeleteOption ? (
        <ModalShell open={isDeleteOpen} onBackdrop={handleCloseDelete}>
          <div className="space-y-6 px-1 pb-6 pt-6 md:px-6">
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-white">{deleteTitle}</h2>
              <p className="text-sm text-white/70">{deleteDescription}</p>
            </div>
            {deleteError ? <p className="text-sm text-red-400">{deleteError}</p> : null}
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={handleCloseDelete} disabled={isDeleting}>
                {cancelLabel}
              </Button>
              <Button
                type="button"
                variant="solidWhite"
                className="bg-red-600 text-black hover:bg-red-500"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? deletingLabel : deleteLabel}
              </Button>
            </div>
          </div>
        </ModalShell>
      ) : null}
    </div>
  );
}
