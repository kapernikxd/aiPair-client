"use client";

export default function ProfessionField({
  value,
  onChange,
  placeholder = "",
}: {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-xs font-medium uppercase tracking-wide text-neutral-400">
        Profession
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-left text-base text-white placeholder:text-neutral-500 focus:border-white/40 focus:outline-none"
      />
    </label>
  );
}
