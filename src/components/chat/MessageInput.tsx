'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';

type Props = {
  placeholder?: string;
  onSend?: (text: string) => Promise<void> | void;
  isSending?: boolean;
  onTyping?: () => void;
  onStopTyping?: () => void;
};

export default function MessageInput({
  placeholder = 'Say something...',
  onSend,
  isSending = false,
  onTyping,
  onStopTyping,
}: Props) {
  const [value, setValue] = useState('');
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTypingRef = useRef(false);

  const stopTyping = useCallback(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
    if (isTypingRef.current) {
      onStopTyping?.();
      isTypingRef.current = false;
    }
  }, [onStopTyping]);

  const scheduleStopTyping = useCallback(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      if (isTypingRef.current) {
        onStopTyping?.();
        isTypingRef.current = false;
      }
    }, 2000);
  }, [onStopTyping]);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const nextValue = event.target.value;
      setValue(nextValue);

      if (!nextValue.trim()) {
        stopTyping();
        return;
      }

      if (!isTypingRef.current) {
        onTyping?.();
        isTypingRef.current = true;
      }

      scheduleStopTyping();
    },
    [onTyping, scheduleStopTyping, stopTyping],
  );

  const submit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const trimmedValue = value.trim();
      if (!trimmedValue) return;
      await onSend?.(trimmedValue);
      setValue('');
      stopTyping();
    },
    [onSend, stopTyping, value],
  );

  useEffect(() => () => {
    stopTyping();
  }, [stopTyping]);

  return (
    <form onSubmit={submit} className="backdrop-blur">
      <div className="flex items-center gap-3">
        <input
          value={value}
          onChange={handleChange}
          onBlur={stopTyping}
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
