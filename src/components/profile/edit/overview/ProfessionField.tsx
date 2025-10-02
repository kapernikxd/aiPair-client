"use client";

export default function ProfessionField({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (val: string) => void;
  options: readonly string[];
}) {
  return (
    <label className="block space-y-2">
      <span className="text-xs font-medium uppercase tracking-wide text-neutral-400">
        Profession
      </span>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-left text-base text-white focus:border-white/40 focus:outline-none"
        >
          {options.map((option) => (
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
  );
}
