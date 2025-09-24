'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';


type Props = {
    title: string;
    avatarSrc: string;
    stats?: { views: string; duration: string; author: string };
    onFollow?: () => void;
};


export default function HeaderProfile({ title, avatarSrc, stats, onFollow }: Props) {
    return (
        <header className="flex items-center gap-4">
            <div className="relative h-20 w-20">
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-400 via-rose-400 to-indigo-500" />
                <div className="absolute inset-[3px] overflow-hidden rounded-full bg-neutral-900">
                    <Image src={avatarSrc} alt={title} fill sizes="80px" className="object-cover" priority />
                </div>
            </div>


            <div className="flex flex-1 flex-col gap-2">
                <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-2xl font-semibold">{title}</h1>
                    {stats && (
                        <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs text-white/70 backdrop-blur">
                            <span>{stats.views}</span>
                            <span className="h-1 w-1 rounded-full bg-white/30" />
                            <span>{stats.duration}</span>
                            <span className="h-1 w-1 rounded-full bg-white/30" />
                            <span>By {stats.author}</span>
                        </div>
                    )}
                </div>
                <Button onClick={onFollow} variant="solidWhitePillCompact" className="self-start">
                    Follow
                </Button>
            </div>
        </header>
    );
}