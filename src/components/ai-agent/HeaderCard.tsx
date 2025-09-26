import Image from "next/image";
import { ShieldCheck } from "lucide-react";
import { AiBotDTO } from "@/helpers/types/dtos/AiBotDto";
import { getUserAvatar, getUserFullName } from "@/helpers/utils/user";

export default function HeaderCard({ user }: { user: AiBotDTO }) {

    const avatarUrl = getUserAvatar(user);
    const userFullName = getUserFullName(user);

    return (
        <div className="flex items-center gap-4">
            <div className="relative size-20 overflow-hidden rounded-3xl border border-white/10">
                <Image src={avatarUrl} alt={`${userFullName} portrait`} fill sizes="80px" className="object-cover" />
            </div>
            <div>
                <div className="flex items-center gap-2 text-sm text-white/60">
                    <ShieldCheck className="size-4 text-violet-300" />
                    Ai agent
                </div>
                <h1 className="text-3xl font-semibold tracking-tight">{userFullName}</h1>
                {user.userBio && <p className="text-sm text-white/70">{user.userBio}</p>}
            </div>
        </div>
    );
}