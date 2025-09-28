'use client';

import type { MessageDTO } from '@/helpers/types';
import { useMemo } from 'react';

type MessageBubbleProps = {
  message: MessageDTO;
  isOwn: boolean;
  isPinned: boolean;
  senderName: string;
  onPin: (message: MessageDTO) => void;
  onUnpin: (messageId: string) => void;
};

function formatTimestamp(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}

export default function MessageBubble({ message, isOwn, isPinned, senderName, onPin, onUnpin }: MessageBubbleProps) {
  const timestamp = useMemo(() => formatTimestamp(message.createdAt), [message.createdAt]);
  const content = typeof message.content === 'string' ? message.content : '';
  const displayName = isOwn ? 'You' : senderName || 'Anonymous';

  return (
    <article className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div
        className={
          'group relative max-w-[82%] rounded-3xl border border-white/10 px-4 py-1 shadow-2xl backdrop-blur transition ' +
          (isOwn
            ? 'bg-gradient-to-br from-amber-300/90 to-orange-500/90 text-neutral-900'
            : 'bg-white/5 text-white')
        }
      >
        {/* <div className="flex items-start justify-between gap-4">
          <div className="flex flex-1 flex-col">
            <span className={`text-xs font-semibold uppercase tracking-wide ${isOwn ? 'text-neutral-900' : 'text-white/70'}`}>
              {displayName}
            </span>
          </div>
          <button
            type="button"
            onClick={() => (isPinned ? onUnpin(message._id) : onPin(message))}
            className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
              isPinned
                ? isOwn
                  ? 'border-neutral-900/50 bg-neutral-900/20 text-neutral-900'
                  : 'border-white/50 bg-white/10 text-white'
                : isOwn
                  ? 'border-transparent bg-neutral-900/80 text-white hover:bg-neutral-900'
                  : 'border-white/20 bg-white/10 text-white/80 hover:border-white/40 hover:text-white'
            }`}
          >
            {isPinned ? 'Unpin' : 'Pin'}
          </button>
        </div> */}

        <div className="mt-3 space-y-2 text-sm leading-relaxed">
          {content.split('\n').map((line, index) => (
            <p key={index} className={isOwn ? 'text-neutral-900' : 'text-white/90'}>
              {line}
            </p>
          ))}
        </div>
        {timestamp ? (
          <span className={`text-[11px] flex ${isOwn ? 'text-neutral-900/80 justify-end' : 'text-white/60'}`}>{timestamp}</span>
        ) : null}

        {isPinned ? (
          <div
            className={`mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${isOwn ? 'bg-neutral-900/10 text-neutral-900' : 'bg-white/10 text-white/80'
              }`}
          >
            Pinned
          </div>
        ) : null}
      </div>
    </article>
  );
}
