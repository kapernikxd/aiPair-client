"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const genderOptions = [
  { value: "he_him", label: "He/Him" },
  { value: "she_her", label: "She/Her" },
  { value: "they_them", label: "They/Them" },
];

const relationshipOptions = [
  "View your relationship preference",
  "Open to exploring",
  "Looking for long-term",
  "Here for friendship",
];

export type EditableProfile = {
  userName: string;
  gender: string;
  intro: string;
  relationshipPreference: string;
};

type Props = {
  open: boolean;
  profile: EditableProfile;
  onClose: () => void;
  onSave: (profile: EditableProfile) => void;
};

export default function EditProfileDialog({ open, profile, onClose, onSave }: Props) {
  const [formState, setFormState] = useState(profile);

  useEffect(() => {
    if (open) {
      setFormState(profile);
    }
  }, [open, profile]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) onClose();
  };

  const handleSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSave(formState);
    onClose();
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
          <motion.form
            onSubmit={handleSave}
            className="relative z-10 w-full max-w-xl rounded-3xl border border-white/10 bg-neutral-900 text-white shadow-2xl"
            initial={{ scale: 0.96, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.97, opacity: 0, y: 12 }}
            transition={{ type: "spring", stiffness: 220, damping: 20 }}
          >
            <div className="flex items-center justify-between px-6 pb-4 pt-6 sm:px-8">
              <h2 className="text-xl font-semibold sm:text-2xl">Edit Profile</h2>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:bg-white/10"
                aria-label="Close"
              >
                <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>

            <div className="space-y-6 px-6 pb-6 sm:px-8 sm:pb-8">
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
                <div className="grid size-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 text-2xl font-semibold">
                  {formState.userName.charAt(0) || "?"}
                </div>
                <p className="text-center text-sm text-neutral-300 sm:text-left">
                  Update your personal details to help others know you better.
                </p>
              </div>

              <label className="block space-y-2">
                <div className="flex items-center justify-between text-xs font-medium uppercase tracking-wide text-neutral-400">
                  <span>User Name</span>
                  <span>
                    {formState.userName.length.toString().padStart(2, "0")}/18
                  </span>
                </div>
                <input
                  type="text"
                  value={formState.userName}
                  onChange={(event) =>
                    setFormState((current) => ({ ...current, userName: event.target.value.slice(0, 18) }))
                  }
                  placeholder="Enter your display name"
                  maxLength={18}
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-base text-white placeholder:text-neutral-500 focus:border-white/40 focus:outline-none"
                />
              </label>

              <fieldset className="space-y-3">
                <legend className="text-xs font-medium uppercase tracking-wide text-neutral-400">Gender</legend>
                <div className="grid gap-2 sm:grid-cols-3">
                  {genderOptions.map((option) => (
                    <label
                      key={option.value}
                      className={`flex items-center gap-3 rounded-2xl border px-3 py-3 text-sm transition ${
                        formState.gender === option.value
                          ? "border-violet-400/60 bg-violet-500/10"
                          : "border-white/10 bg-white/[0.06] hover:border-white/20"
                      }`}
                    >
                      <input
                        type="radio"
                        name="gender"
                        value={option.value}
                        checked={formState.gender === option.value}
                        onChange={(event) =>
                          setFormState((current) => ({ ...current, gender: event.target.value }))
                        }
                        className="size-4 accent-violet-500"
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <label className="block space-y-2">
                <div className="flex items-center justify-between text-xs font-medium uppercase tracking-wide text-neutral-400">
                  <span>Intro.</span>
                  <span>
                    {formState.intro.length.toString().padStart(3, "0")}/120
                  </span>
                </div>
                <textarea
                  value={formState.intro}
                  onChange={(event) =>
                    setFormState((current) => ({ ...current, intro: event.target.value.slice(0, 120) }))
                  }
                  placeholder="Share a fun fact about yourself"
                  maxLength={120}
                  rows={4}
                  className="w-full resize-none rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-base text-white placeholder:text-neutral-500 focus:border-white/40 focus:outline-none"
                />
              </label>

              <label className="block space-y-2">
                <span className="text-xs font-medium uppercase tracking-wide text-neutral-400">
                  Relationship Preference
                </span>
                <div className="relative">
                  <select
                    value={formState.relationshipPreference}
                    onChange={(event) =>
                      setFormState((current) => ({ ...current, relationshipPreference: event.target.value }))
                    }
                    className="w-full appearance-none rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-left text-base text-white focus:border-white/40 focus:outline-none"
                  >
                    {relationshipOptions.map((option) => (
                      <option key={option} value={option} className="bg-neutral-900 text-white">
                        {option}
                      </option>
                    ))}
                  </select>
                  <svg
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-neutral-400"
                  >
                    <path d="M6 8l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </label>

              <p className="rounded-2xl border border-white/5 bg-white/[0.03] px-4 py-3 text-xs text-neutral-400">
                Please note that name and introduction can only be changed 1 time within 7 days.
              </p>

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex items-center justify-center rounded-2xl border border-white/15 px-6 py-3 text-sm font-medium text-white/70 transition hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-200"
                >
                  Save
                </button>
              </div>
            </div>
          </motion.form>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
