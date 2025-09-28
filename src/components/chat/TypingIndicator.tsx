'use client';

import React from 'react';

export type TypingUser = {
  userId: string;
  userName: string;
};

type Props = {
  typingUsers: TypingUser[];
  currentUserId?: string;
};

export function buildTypingMessage(users: TypingUser[]): string {
  const names = users
    .map((user) => user.userName?.trim())
    .filter((name): name is string => Boolean(name));

  if (!names.length) {
    return users.length === 1 ? 'Someone is typing…' : 'Several people are typing…';
  }

  if (names.length === 1) {
    return `${names[0]} is typing…`;
  }

  if (names.length === 2) {
    return `${names[0]} and ${names[1]} are typing…`;
  }

  const [first, second, ...rest] = names;
  const othersCount = rest.length;
  return `${first}, ${second} and ${othersCount} other${othersCount === 1 ? '' : 's'} are typing…`;
}

export default function TypingIndicator({ typingUsers, currentUserId }: Props) {
  const filteredUsers = typingUsers.filter((user) => user.userId && user.userId !== currentUserId);

  if (!filteredUsers.length) {
    return null;
  }

  return (
    <div className="mt-3 flex items-center gap-2 text-xs text-white/70" aria-live="polite">
      <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-white/60" aria-hidden />
      <span className="italic">{buildTypingMessage(filteredUsers)}</span>
    </div>
  );
}
