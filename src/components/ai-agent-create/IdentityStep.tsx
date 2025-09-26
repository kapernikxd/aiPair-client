/* eslint-disable @next/next/no-img-element */
"use client";

import { Upload } from "lucide-react";
import { FormState } from "../../helpers/types/agent-create";

type IdentityForm = Pick<FormState, "firstName" | "lastName">;

type IdentityStepProps = {
  form: IdentityForm;
  avatarPreview: string | null;
  onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChange: <K extends keyof IdentityForm>(field: K, value: IdentityForm[K]) => void;
};

export default function IdentityStep({
  form,
  avatarPreview,
  onAvatarChange,
  onChange,
}: IdentityStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Give your agent a face</h2>
        <p className="mt-2 text-sm text-white/70">
          Upload an avatar and set a memorable identity. This will be the first thing users see.
        </p>
      </div>

      <div className="rounded-3xl border border-white/10 bg-neutral-900/70 p-6 backdrop-blur">
        <span className="text-sm font-medium text-white/70">Avatar</span>
        <div className="mt-4 flex flex-col gap-6 sm:flex-row">
          <div className="relative flex h-36 w-36 items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-white/5">
            {avatarPreview ? (
              <img src={avatarPreview} alt="Selected avatar" className="h-full w-full object-cover" />
            ) : (
              <Upload className="size-8 text-white/40" />
            )}
          </div>
          <label className="flex flex-1 cursor-pointer flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-white/20 bg-white/5 p-6 text-center text-sm text-white/70 transition hover:border-violet-400/60 hover:bg-violet-500/10">
            <Upload className="size-5 text-violet-300" />
            <span className="font-medium text-white">Upload image</span>
            <span className="text-xs text-white/60">PNG, JPG up to 5MB</span>
            <input type="file" accept="image/*" className="hidden" onChange={onAvatarChange} />
          </label>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm text-white/70">
          First name
          <input
            value={form.firstName}
            onChange={(e) => onChange("firstName", e.target.value)}
            placeholder="aiAgent"
            className="rounded-2xl border border-white/10 bg-neutral-900/80 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-violet-400 focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm text-white/70">
          Last name
          <input
            value={form.lastName}
            onChange={(e) => onChange("lastName", e.target.value)}
            placeholder="Alpha"
            className="rounded-2xl border border-white/10 bg-neutral-900/80 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-violet-400 focus:outline-none"
          />
        </label>
      </div>
    </div>
  );
}
