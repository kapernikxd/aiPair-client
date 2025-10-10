/* eslint-disable @next/next/no-img-element */
import { Sparkles } from "lucide-react";
import { CreateAiAgentFormState, GalleryItem } from "../../helpers/types/agent-create";
import { useTranslations } from "@/localization/TranslationProvider";

export default function PreviewSidebar({
  form,
  avatarPreview,
  gallery,
  maxItems,
}: {
  form: CreateAiAgentFormState;
  avatarPreview: string | null;
  gallery: GalleryItem[];
  maxItems: number;
}) {
  const { t } = useTranslations();
  return (
    <aside className="w-full rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur lg:w-[40%]">
      <div className="space-y-6">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">
            {t("admin.create.preview.title", "Live preview")}
          </h2>
          <p className="text-sm text-white/70">
            {t(
              "admin.create.preview.subtitle",
              "Keep an eye on how your agent is shaping up. Details update in real-time as you type.",
            )}
          </p>
        </div>

        <div className="flex items-center gap-4 rounded-3xl border border-white/10 bg-neutral-900/80 p-5">
          <div className="relative flex size-20 items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-white/10">
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt={t("admin.create.preview.avatarAlt", "Avatar preview")}
                className="h-full w-full object-cover"
              />
            ) : (
              <Sparkles className="size-6 text-white/40" />
            )}
          </div>
          <div className="space-y-2">
            <p className="text-sm font-semibold text-white">
              {(form.firstName || t("admin.create.preview.defaultFirst", "Your")) +
                " " +
                (form.lastName || t("admin.create.preview.defaultLast", "agent"))}
            </p>
            <p className="text-xs uppercase tracking-wide text-white/50">
              {form.profession || t("admin.create.preview.professionPlaceholder", "Profession")}
            </p>
            <p className="max-h-20 overflow-hidden text-xs text-white/60">
              {form.description ||
                t(
                  "admin.create.preview.descriptionPlaceholder",
                  "Describe the essence of your companion to hint at the experience users will unlock.",
                )}
            </p>
          </div>
        </div>

        <div className="space-y-4 rounded-3xl border border-white/10 bg-neutral-900/70 p-5">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/60">
              {t("admin.create.preview.intro", "Intro message")}
            </h3>
            <p className="mt-2 rounded-2xl border border-white/5 bg-white/5 p-4 text-sm text-white/70">
              {form.intro ||
                t(
                  "admin.create.preview.introPlaceholder",
                  "This is where your aiAgent opens the conversation with warmth, clarity, and direction.",
                )}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/60">
              {t("admin.create.preview.prompt", "System prompt")}
            </h3>
            <p className="mt-2 rounded-2xl border border-white/5 bg-white/5 p-4 text-xs text-white/60">
              {form.prompt ||
                t(
                  "admin.create.preview.promptPlaceholder",
                  "Define the rules, tone, and expertise. Your guidance informs every response.",
                )}
            </p>
          </div>
        </div>

        <div className="space-y-4 rounded-3xl border border-white/10 bg-neutral-900/70 p-5">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/60">
              {t("admin.create.preview.categories", "Categories")}
            </h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {form.categories.length ? (
                form.categories.map((category) => (
                  <span
                    key={category}
                    className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70"
                  >
                    {category}
                  </span>
                ))
              ) : (
                <p className="text-xs text-white/50">
                  {t(
                    "admin.create.preview.categoriesPlaceholder",
                    "Select categories to spotlight the agent’s niche.",
                  )}
                </p>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/60">
              {t("admin.create.preview.usefulness", "Usefulness")}
            </h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {form.usefulness.length ? (
                form.usefulness.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70"
                  >
                    {item}
                  </span>
                ))
              ) : (
                <p className="text-xs text-white/50">
                  {t(
                    "admin.create.preview.usefulnessPlaceholder",
                    "Add scenarios to illustrate how the agent helps.",
                  )}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs uppercase tracking-wider text-white/50">
            <span>{t("admin.create.preview.gallery", "Gallery")}</span>
            <span>
              {t("admin.create.preview.galleryCount", "{count} {label} · {left} left")
                .replace("{count}", String(gallery.length))
                .replace(
                  "{label}",
                  gallery.length === 1
                    ? t("admin.create.preview.gallerySingle", "image")
                    : t("admin.create.preview.galleryPlural", "images"),
                )
                .replace("{left}", String(Math.max(0, maxItems - gallery.length)))}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {gallery.length ? (
              gallery.slice(0, 6).map((item) => (
                <div key={item.id} className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                  <img
                    src={item.preview}
                    alt={t("admin.create.preview.galleryAlt", "Gallery preview")}
                    className="h-20 w-full object-cover"
                  />
                </div>
              ))
            ) : (
              <div className="col-span-3 rounded-2xl border border-dashed border-white/15 bg-neutral-900/60 p-4 text-center text-xs text-white/50">
                {t(
                  "admin.create.preview.galleryPlaceholder",
                  "Add up to six highlight visuals to enrich the story.",
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
