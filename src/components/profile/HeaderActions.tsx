import { ArrowLeft, MoreHorizontal, Share2, Sparkles } from "lucide-react";


export default function HeaderActions({ onEdit }: { onEdit: () => void }) {
    return (
        <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
                <button className="inline-flex size-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10">
                    <ArrowLeft className="size-5" />
                </button>
                <button className="inline-flex size-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10">
                    <Share2 className="size-5" />
                </button>
                <button className="inline-flex size-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10">
                    <MoreHorizontal className="size-5" />
                </button>
            </div>
            <div className="flex items-center gap-3">
                <button className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 py-2 text-sm font-medium text-white/80 backdrop-blur transition hover:bg-white/20">
                    <Sparkles className="size-4" />
                    Subscribed
                </button>
                <button onClick={onEdit} className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-200">
                    Edit Profile
                </button>
            </div>
        </div>
    );
}