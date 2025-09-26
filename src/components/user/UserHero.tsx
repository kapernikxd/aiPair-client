import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import BadgePills from "./BadgePills";
import SocialCounters from "./SocialCounters";


export default function UserHero({
    name,
    intro,
    location,
    avatar,
    badges,
    messageHref,
}: {
    name: string;
    intro: string;
    location: string;
    avatar: string;
    badges: string[];
    messageHref: string;
}) {
    return (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-1 md:p-8 backdrop-blur">
            <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-1 items-start gap-5">
                    <div className="relative size-24 shrink-0 overflow-hidden rounded-3xl border border-white/15">
                        <Image src={avatar} alt={`${name} portrait`} fill className="object-cover" sizes="(max-width: 768px) 96px, 150px" />
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-white/60">
                            <MapPin className="size-4 text-violet-300" />
                            <span>{location}</span>
                        </div>
                        <div>
                            <h1 className="text-4xl font-semibold tracking-tight">{name}</h1>
                            <p className="mt-2 text-sm leading-6 text-white/70">{intro}</p>
                        </div>
                        <BadgePills badges={badges} />
                    </div>
                </div>
                <div className="flex flex-col items-start gap-4 text-sm text-white/70 md:items-end">
                    <SocialCounters />
                    <Link href={messageHref} className="inline-flex items-center gap-2 rounded-2xl border border-white/15 px-5 py-2 text-sm font-semibold text-white/90 transition hover:bg-white/10">
                        Message {name.split(" ")[0]}
                    </Link>
                </div>м
            </div>
        </div>
    );
}