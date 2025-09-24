"use client";

export default function GenderGroup({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (val: string) => void;
  options: readonly { value: string; label: string }[];
}) {
  return (
    <fieldset className="space-y-3">
      <legend className="text-xs font-medium uppercase tracking-wide text-neutral-400">Gender</legend>
      <div className="grid gap-2 sm:grid-cols-3">
        {options.map((option) => (
          <label
            key={option.value}
            className={`flex items-center gap-3 rounded-2xl border px-3 py-3 text-sm transition ${
              value === option.value
                ? "border-violet-400/60 bg-violet-500/10"
                : "border-white/10 bg-white/[0.06] hover:border-white/20"
            }`}
          >
            <input
              type="radio"
              name="gender"
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value)}
              className="size-4 accent-violet-500"
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
