'use client';

import type { MessageDTO } from '@/helpers/types';
import MessageBubble from './MessageBubble';

type MessageListProps = {
  messages: MessageDTO[];
  currentUserId: string;
  isMessagePinned: (id: string) => boolean;
  onPinMessage: (message: MessageDTO) => void;
  onUnpinMessage: (messageId: string) => void;
  resolveSenderName: (message: MessageDTO) => string;
};

export default function MessageList({
  messages,
  currentUserId,
  isMessagePinned,
  onPinMessage,
  onUnpinMessage,
  resolveSenderName,
}: MessageListProps) {
  return (
    <div className="space-y-4">
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
    </div>
  );
}
