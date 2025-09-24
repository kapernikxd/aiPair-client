import Link from "next/link";
import { MessageCircle, UserPlus, Share2 } from "lucide-react";


export default function ActionButtons({
    homeHref,
    chatHref,
}: {
    homeHref: string;
    chatHref: string;
}) {
    return (
        <div className="flex items-center gap-3 self-start md:self-center">
            <Link href={homeHref} className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-white/80 hover:bg-white/10">
                Discover more
            </Link>
            <button className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-white/80 hover:bg-white/10">
                <Share2 className="size-4" /> Share
            </button>


            {/* Primary CTA row */}
            <div className="hidden md:flex" />
        </div>
    );
}


export function PrimaryCTAs({ chatHref }: { chatHref: string }) {
    return (
        <div className="flex flex-col gap-3 md:flex-row">
            <button className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-violet-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/30 transition hover:bg-violet-400">
                <UserPlus className="size-4" /> Follow
            </button>
            <Link href={chatHref} className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-white/15 px-4 py-3 text-sm font-semibold text-white/90 transition hover:bg-white/5">
                <MessageCircle className="size-4" /> Chat with aiAgent
            </Link>
        </div>
    );
}