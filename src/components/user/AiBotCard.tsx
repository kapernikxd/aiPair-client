"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Users, UserPlus, Sparkles } from "lucide-react";

import type { AiBotDTO } from "@/helpers/types/dtos/AiBotDto";
import { getUserAvatar } from "@/helpers/utils/user";
import { useAuthRoutes } from "@/helpers/hooks/useAuthRoutes";


type AiBotCardProps = {
    bot: AiBotDTO;
};

const formatNumber = (value?: number) =>
    typeof value === "number" ? value.toLocaleString("ru-RU") : "0";

export default function AiBotCard({ bot }: AiBotCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const { getAiProfile } = useAuthRoutes(); 

    const avatar = getUserAvatar(bot);
    const description = bot.userBio?.trim() || "Описание пока отсутствует.";
    const botHref = getAiProfile(encodeURIComponent(bot._id));

    const stats = [
        { label: "Подписчики", value: formatNumber(bot.followers), icon: Users },
        { label: "Подписки", value: formatNumber(bot.following), icon: UserPlus },
        { label: "Роль", value: bot.profession || "AI-компаньон", icon: Sparkles },
    ];

    return (
        <Link
            href={botHref}
            className="group flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-neutral-900/60 shadow-[0_20px_40px_-20px_rgba(59,0,104,0.45)] transition hover:border-violet-400/40 focus-visible:border-violet-400/60 focus-visible:outline-none"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onFocus={() => setIsHovered(true)}
            onBlur={() => setIsHovered(false)}
            aria-label={`Открыть профиль AI-бота ${bot.name}`}
        >
            <div className="relative h-52 w-full overflow-hidden">
                <Image
                    src={avatar}
                    alt={bot.name}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105 group-focus-visible:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                />
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 to-transparent" />
            </div>
            <div className="flex h-full flex-col justify-between space-y-4 p-6">
                <div>
                    <div className="flex items-center justify-between gap-2">
                        <h3 className="text-xl font-semibold text-white">{bot.name}</h3>
                        <span className="text-xs uppercase tracking-widest text-violet-200/80">AI Bot</span>
                    </div>
                    <p
                        className="mt-3 text-sm leading-6 text-white/70"
                        style={
                            isHovered
                                ? { display: "block" }
                                : {
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden",
                                }
                        }
                    >
                        {description}
                    </p>
                </div>
                <div className="flex flex-wrap gap-3 text-sm text-white/70">
                    {stats.map((stat) => (
                        <span
                            key={stat.label}
                            className="inline-flex items-center gap-1 rounded-2xl border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium"
                        >
                            <stat.icon className="size-3.5 text-violet-200" />
                            {stat.value}
                        </span>
                    ))}
                </div>
            </div>
        </Link>
    );
}
