'use client';


import React, { useState } from 'react';


type Props = {
    placeholder?: string;
    onSend?: (text: string) => void;
};


export default function MessageInput({ placeholder = 'Say something...', onSend }: Props) {
    const [value, setValue] = useState('');
    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const v = value.trim();
        if (!v) return;
        onSend?.(v);
        setValue('');
    };
    return (
        <form onSubmit={submit} className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur">
            <label className="block text-xs font-medium uppercase tracking-[0.3em] text-white/40">
                Message, AI will reply
            </label>
            <div className="mt-3 flex items-center gap-3">
                <input
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="flex-1 rounded-2xl border border-white/10 bg-transparent px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none"
                    placeholder={placeholder}
                />
                <button
                    type="submit"
                    className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-neutral-900 transition hover:bg-white/90"
                >
                    Send
                </button>
            </div>
        </form>
    );
}