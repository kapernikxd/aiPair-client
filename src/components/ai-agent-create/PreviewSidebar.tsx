/* eslint-disable @next/next/no-img-element */
import { Sparkles } from "lucide-react";
import { FormState, GalleryItem } from "../../helpers/types/agent-create";

export default function PreviewSidebar({
  form,
  avatarPreview,
  gallery,
  maxItems,
}: {
  form: FormState;
  avatarPreview: string | null;
  gallery: GalleryItem[];
  maxItems: number;
}) {
  return (
    <aside className="w-full rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur lg:w-[40%]">
      <div className="space-y-6">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Live preview</h2>
          <p className="text-sm text-white/70">
            Keep an eye on how your agent is shaping up. Details update in real-time as you type.
          </p>
        </div>

        <div className="flex items-center gap-4 rounded-3xl border border-white/10 bg-neutral-900/80 p-5">
          <div className="relative flex size-20 items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-white/10">
            {avatarPreview ? (
              <img src={avatarPreview} alt="Avatar preview" className="h-full w-full object-cover" />
            ) : (
              <Sparkles className="size-6 text-white/40" />
            )}
          </div>
          <div className="space-y-2">
            <p className="text-sm font-semibold text-white">
              {(form.firstName || "Your") + " " + (form.lastName || "agent")}
            </p>
            <p className="max-h-20 overflow-hidden text-xs text-white/60">
              {form.description || "Describe the essence of your companion to hint at the experience users will unlock."}
            </p>
          </div>
        </div>

        <div className="space-y-4 rounded-3xl border border-white/10 bg-neutral-900/70 p-5">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/60">Intro message</h3>
            <p className="mt-2 rounded-2xl border border-white/5 bg-white/5 p-4 text-sm text-white/70">
              {form.intro || "This is where your aiAgent opens the conversation with warmth, clarity, and direction."}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/60">System prompt</h3>
            <p className="mt-2 rounded-2xl border border-white/5 bg-white/5 p-4 text-xs text-white/60">
              {form.prompt || "Define the rules, tone, and expertise. Your guidance informs every response."}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs uppercase tracking-wider text-white/50">
            <span>Gallery</span>
            <span>
              {gallery.length} {gallery.length === 1 ? "image" : "images"} · {Math.max(0, maxItems - gallery.length)} left
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {gallery.length ? (
              gallery.slice(0, 6).map((item) => (
                <div key={item.id} className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                  <img src={item.preview} alt="Gallery preview" className="h-20 w-full object-cover" />
                </div>
              ))
            ) : (
              <div className="col-span-3 rounded-2xl border border-dashed border-white/15 bg-neutral-900/60 p-4 text-center text-xs text-white/50">
                Add up to six highlight visuals to enrich the story.
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
