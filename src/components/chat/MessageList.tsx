'use client';

import type { ReactNode, Ref } from 'react';
import type { MessageDTO } from '@/types';
import MessageBubble from './MessageBubble';

type MessageListProps = {
  messages: MessageDTO[];
  currentUserId: string;
  isMessagePinned: (id: string) => boolean;
  onPinMessage: (message: MessageDTO) => void;
  onUnpinMessage: (messageId: string) => void;
  resolveSenderName: (message: MessageDTO) => string;
  children?: ReactNode;
  containerRef?: Ref<HTMLDivElement>;
  bottomSentinelRef?: Ref<HTMLDivElement>;
};

export default function MessageList({
  messages,
  currentUserId,
  isMessagePinned,
  onPinMessage,
  onUnpinMessage,
  resolveSenderName,
  children,
  containerRef,
  bottomSentinelRef,
}: MessageListProps) {
  return (
    <div ref={containerRef} className="space-y-4">
      {messages.map((message) => (
        <MessageBubble
          key={message._id}
          message={message}
          isOwn={message.sender?._id === currentUserId}
          isPinned={isMessagePinned(message._id)}
          senderName={resolveSenderName(message)}
          onPin={onPinMessage}
          onUnpin={onUnpinMessage}
        />
      ))}
      {children}
      <div ref={bottomSentinelRef} aria-hidden className="h-px w-full" />
    </div>
  );
}
