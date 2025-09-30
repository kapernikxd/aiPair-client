"use client";

import { useMemo, useState } from "react";
import { X } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { FormState } from "@/helpers/types/agent-create";
import { categoryOptions } from "@/helpers/data/agent-create";
import { useTranslations } from "@/localization/TranslationProvider";

const normalized = (value: string) => value.trim().toLowerCase();

type FocusForm = Pick<FormState, "categories" | "usefulness">;

type FocusStepProps = {
  form: FocusForm;
  onChange: <K extends keyof FocusForm>(field: K, value: FocusForm[K]) => void;
};

export default function FocusStep({ form, onChange }: FocusStepProps) {
  const [inputValue, setInputValue] = useState("");
  const { t } = useTranslations();

  const selectedMap = useMemo(
    () => new Set(form.categories.map((item) => normalized(item))),
    [form.categories],
  );

  const toggleCategory = (category: string) => {
    const key = normalized(category);
    const exists = selectedMap.has(key);
    const next = exists
      ? form.categories.filter((item) => normalized(item) !== key)
      : [...form.categories, category];

    onChange("categories", next);
  };

  const addUsefulness = () => {
    const value = inputValue.trim();
    if (!value) return;

    const exists = form.usefulness.some((item) => normalized(item) === normalized(value));
    if (exists) {
      setInputValue("");
      return;
    }

    onChange("usefulness", [...form.usefulness, value]);
    setInputValue("");
  };

  const removeUsefulness = (value: string) => {
    onChange(
      "usefulness",
      form.usefulness.filter((item) => item !== value),
    );
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addUsefulness();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">
          {t("admin.create.focus.title", "Define its focus")}
        </h2>
        <p className="mt-2 text-sm text-white/70">
          {t(
            "admin.create.focus.subtitle",
            "Choose the categories that match your agent and list out the situations where it shines.",
          )}
        </p>
      </div>

      <div className="space-y-4 rounded-3xl border border-white/10 bg-neutral-900/70 p-6">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-white">
            {t("admin.create.focus.categories", "Categories")}
          </span>
          <span className="text-xs uppercase tracking-wide text-white/50">
            {t("admin.create.focus.categoriesHint", "Pick multiple")}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {categoryOptions.map((category) => {
            const key = normalized(category);
            const isSelected = selectedMap.has(key);
            return (
              <button
                key={category}
                type="button"
                onClick={() => toggleCategory(category)}
                className={`rounded-2xl border px-4 py-2 text-sm transition ${
                  isSelected
                    ? "border-violet-400/60 bg-violet-500/20 text-violet-100"
                    : "border-white/15 bg-white/5 text-white/70 hover:border-violet-400/40 hover:bg-violet-500/10"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
        {!form.categories.length && (
          <p className="text-xs text-white/50">
            {t(
              "admin.create.focus.categoriesEmpty",
              "Select at least one category to help others understand the agent’s domain.",
            )}
          </p>
        )}
      </div>

      <div className="space-y-4 rounded-3xl border border-white/10 bg-neutral-900/70 p-6">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-white">
            {t("admin.create.focus.usefulness", "Usefulness")}
          </span>
          <span className="text-xs uppercase tracking-wide text-white/50">
            {t("admin.create.focus.usefulnessHint", "Add as many as you like")}
          </span>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t("admin.create.focus.placeholder", "For example: Quick brainstorms")}
            className="flex-1 rounded-2xl border border-white/15 bg-neutral-900/80 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-violet-400 focus:outline-none"
          />
          <Button type="button" variant="primaryTight" onClick={addUsefulness} disabled={!inputValue.trim()}>
            {t("admin.create.focus.add", "Add")}
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {form.usefulness.length ? (
            form.usefulness.map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/80"
              >
                {item}
                <button
                  type="button"
                  onClick={() => removeUsefulness(item)}
                  className="rounded-full p-1 text-white/50 transition hover:bg-white/10 hover:text-white"
                  aria-label={t("admin.create.focus.remove", "Remove {value}").replace("{value}", item)}
                >
                  <X className="size-3.5" />
                </button>
              </span>
            ))
          ) : (
            <p className="text-xs text-white/50">
              {t(
                "admin.create.focus.usefulnessEmpty",
                "Add a few scenarios to inspire how people can use the agent.",
              )}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
