'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

type TruncatedRevealProps = {
  text: string;
  maxChars: number;
  className?: string;
  overlayClassName?: string;
  panelClassName?: string;
  title?: string;
};

function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    if (locked) document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [locked]);
}

function useIsMounted() {
  const [m, setM] = useState(false);
  useEffect(() => setM(true), []);
  return m;
}

export default function TruncatedReveal({
  text,
  maxChars,
  className = '',
  overlayClassName = '',
  panelClassName = '',
  title,
}: TruncatedRevealProps) {
  const [open, setOpen] = useState(false);
  const isMounted = useIsMounted();
  useBodyScrollLock(open);

  const truncated = useMemo(() => {
    if (!text) return '';
    if (text.length <= maxChars) return text;
    const slice = text.slice(0, maxChars);
    return slice.replace(/[\s.,;:!?-]+$/u, '') + '…';
  }, [text, maxChars]);

  const hasOverflow = text.length > maxChars;

  const onOpen = () => hasOverflow && setOpen(true);
  const onClose = () => setOpen(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={onOpen}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && hasOverflow) {
            e.preventDefault();
            onOpen();
          }
        }}
        className={
          'inline-block cursor-pointer bg-transparent p-0 text-left align-top ' +
          (className || '')
        }
        aria-expanded={open}
        aria-haspopup={hasOverflow ? 'dialog' : undefined}
      >
        {truncated}
      </button>

      {isMounted && open && createPortal(
        <div
          className={
            'fixed inset-0 z-[999] flex items-center justify-center ' +
            'bg-black/70 backdrop-blur-sm p-4 sm:p-8 ' +
            (overlayClassName || '')
          }
          role="dialog"
          aria-modal="true"
          aria-label={title || 'Full text'}
          onClick={onClose}
        >
          <div
            className={
              'relative w-full max-w-3xl max-h-[85vh] overflow-auto rounded-2xl ' +
              'bg-zinc-900 text-zinc-100 shadow-2xl ring-1 ring-white/10 ' +
              'p-5 sm:p-7 md:p-8 ' +
              (panelClassName || '')
            }
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/70 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>

            {title && (
              <h3 className="mb-4 text-xl font-semibold leading-snug text-white">
                {title}
              </h3>
            )}

            <div className="whitespace-pre-wrap leading-relaxed text-white/80 selection:bg-white/20">
              {text}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
