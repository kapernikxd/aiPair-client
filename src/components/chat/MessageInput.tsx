'use client';


import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';


type Props = {
    placeholder?: string;
    onSend?: (text: string) => Promise<void> | void;
    isSending?: boolean;
};


export default function MessageInput({ placeholder = 'Say something...', onSend, isSending = false }: Props) {
    const [value, setValue] = useState('');
    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        const v = value.trim();
        if (!v) return;
        await onSend?.(v);
        setValue('');
    };
    return (
        <form onSubmit={submit} className="backdrop-blur">
            <div className="flex items-center gap-3">
                <input
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="flex-1 rounded-2xl border border-white/10 bg-transparent px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none"
                    placeholder={placeholder}
                    disabled={isSending}
                />
                <Button type="submit" variant="solidWhite" disabled={isSending}>
                    Send
                </Button>
            </div>
        </form>
    );
}
