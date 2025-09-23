'use client';


import React from 'react';
import type { ChatMessage } from './types';


export default function MessageBubble({ m }: { m: ChatMessage }) {
    const isRight = m.align === 'right';
    return (
        <article className={`flex ${isRight ? 'justify-end' : 'justify-start'}`}>
            <div
                className={
                    'relative max-w-[80%] rounded-3xl border border-white/10 p-5 shadow-2xl backdrop-blur transition ' +
                    (isRight
                        ? 'bg-gradient-to-br from-amber-300/90 to-orange-500/90 text-neutral-900'
                        : 'bg-white/5 text-white')
                }
            >
                <div
                    className={
                        'absolute top-4 flex h-10 w-10 items-center justify-center rounded-2xl text-xs font-semibold shadow-lg backdrop-blur ' +
                        (isRight ? '-right-5 bg-white text-neutral-900' : '-left-5 bg-white/10 text-white/70')
                    }
                >
                    {m.timestamp}
                </div>
                <div
                    className={
                        'flex items-center justify-between text-xs uppercase tracking-wide ' +
                        (isRight ? 'text-neutral-900/70' : 'text-white/60')
                    }
                >
                    <span className={'font-semibold ' + (isRight ? 'text-neutral-900' : 'text-white/80')}>{m.speaker}</span>
                    <span>{isRight ? 'Now' : 'Scene'}</span>
                </div>
                <div className="mt-3 space-y-3 text-sm">
                    {m.content.split('\n').map((line, idx) => (
                        <p key={idx} className={'leading-relaxed ' + (isRight ? 'text-neutral-900' : 'text-white/90')}>
                            {line}
                        </p>
                    ))}
                </div>
            </div>
        </article>
    );
}