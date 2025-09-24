import { Star, Users2 } from "lucide-react";


export default function SocialCounters({ members = 114, likes = 157 }: { members?: number; likes?: number }) {
    return (
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
                <Users2 className="size-4 text-violet-200" />
                <span className="font-medium text-white">{members}</span>
            </div>
            <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
                <Star className="size-4 text-amber-300" />
                <span className="font-medium text-white">{likes}</span>
            </div>
        </div>
    );
}