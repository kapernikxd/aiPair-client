'use client';
import React from 'react';


export default function IntroCard({ title = 'Intro', children }: { title?: string; children: React.ReactNode }) {
    return (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/60">
                {title}
            </div>
            <div className="space-y-3 text-sm text-white/80">{children}</div>
        </div>
    );
}