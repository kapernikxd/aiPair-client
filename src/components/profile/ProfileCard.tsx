import Image from "next/image";
import { MapPin } from "lucide-react";
import { MyProfileDTO } from "@/helpers/types";
import { getUserAvatar, getUserFullName } from "@/helpers/utils/user";
import { getMonthYear, getTimeAgo } from "@/helpers/utils/date";


export default function ProfileCard({ profile, genderLabel }: { profile: MyProfileDTO; genderLabel: string }) {
    const profileAvatar = getUserAvatar(profile);
    const userFullName = getUserFullName(profile);

    return (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
            <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-1 items-start gap-5">
                    <div className="relative size-24 shrink-0 overflow-hidden rounded-3xl border border-white/15">
                        <Image
                            src={profileAvatar}
                            alt={`${userFullName} portrait`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 96px, 150px"
                        />
                    </div>
                    <div className="space-y-3">
                        {/* <div className="flex items-center gap-2 text-sm text-white/60">
                            <MapPin className="size-4 text-violet-300" />
                            <span>Designing between worlds</span>
                        </div> */}
                        <div>
                            <h1 className="text-4xl font-semibold tracking-tight">{userFullName}</h1>
                            <p className="mt-2 text-sm leading-6 text-white/70">{profile?.userBio}</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-wide text-white/60">
                            <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1">{genderLabel}</span>
                        </div>
                    </div>
                </div>
                <div className="grid w-full max-w-xs gap-4 rounded-2xl border border-white/10 bg-neutral-900/80 p-5 text-sm text-white/70">
                    <div>
                        <p className="text-xs uppercase tracking-wide text-white/40">Membership</p>
                        <p className="mt-1 font-medium text-white">{profile?.role}</p>
                    </div>
                    <div>
                        <p className="text-xs uppercase tracking-wide text-white/40">Joined</p>
                        <p className="mt-1">{getMonthYear(profile?.createdAt)}</p>
                    </div>
                    <div>
                        <p className="text-xs uppercase tracking-wide text-white/40">Last updated</p>
                        <p className="mt-1">{getTimeAgo(profile?.updatedAt)}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}