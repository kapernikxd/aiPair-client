"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { PropsWithChildren, MouseEvent } from "react";

export default function ModalShell({
  open,
  onBackdrop,
  children,
}: PropsWithChildren<{ open: boolean; onBackdrop: () => void }>) {
  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onBackdrop();
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center px-4"
          onMouseDown={handleBackdropClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <motion.div
            className="relative z-10 w-full max-w-xl rounded-3xl border border-white/10 bg-neutral-900 text-white shadow-2xl"
            initial={{ scale: 0.96, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.97, opacity: 0, y: 12 }}
            transition={{ type: "spring", stiffness: 220, damping: 20 }}
          >
            {children}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
