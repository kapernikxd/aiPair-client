'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import AppShell from '@/components/AppShell';
import ChatAvatar from '@/components/chats/ChatAvatar';
import MessageList from '@/components/chat/MessageList';
import MessageInput from '@/components/chat/MessageInput';
import TypingIndicator, { buildTypingMessage } from '@/components/chat/TypingIndicator';
import GradientOrbs from '@/components/ui/GradientOrbs';
import { Button } from '@/components/ui/Button';
import type { MessageDTO } from '@/helpers/types';
import { getUserAvatar, getUserFullName } from '@/helpers/utils/user';
import { useRootStore, useStoreData } from '@/stores/StoreProvider';
import { useAuthRoutes } from '@/helpers/hooks/useAuthRoutes';

function formatPinnedTimestamp(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  return date.toLocaleString();
}

function PinnedMessagesSection({ messages, onUnpin }: { messages: MessageDTO[]; onUnpin: (messageId: string) => void }) {
  if (!messages.length) {
    return null;
  }

  return (
    <section className="flex flex-col gap-3">
      <header className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-white/70">Pinned messages</h2>
        <span className="text-xs text-white/50">{messages.length}</span>
      </header>
      <div className="space-y-3">
        {messages.map((message) => (
          <div
            key={message._id}
            className="flex items-start justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/90"
          >
            <div className="flex-1 space-y-1">
              <p className="font-medium text-white">{message.content}</p>
              <span className="text-[11px] uppercase tracking-wide text-white/60">
                {formatPinnedTimestamp(message.createdAt)}
              </span>
            </div>
            <Button
              variant="ghostPillCompact"
              className="border-white/20 text-white/80 hover:border-white/40 hover:text-white"
              onClick={() => onUnpin(message._id)}
            >
              Unpin
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function ChatPage() {
  const searchParams = useSearchParams();
  const chatId = searchParams.get('chatId');
  const { chatStore, authStore, onlineStore } = useRootStore();
  const { routes } = useAuthRoutes();

  const messages = useStoreData(chatStore, (store) => store.messages);
  const pinnedMessages = useStoreData(chatStore, (store) => store.pinnedMessages);
  const hasMoreMessages = useStoreData(chatStore, (store) => store.hasMoreMessages);
  const selectedChat = useStoreData(chatStore, (store) => store.selectedChat);
  const isSendingMessage = useStoreData(chatStore, (store) => store.isSendingMessage);
  const myId = useStoreData(authStore, (store) => store.user?.id ?? '');
  const isSocketConnected = useStoreData(onlineStore, (store) => store.isConnected);
  const typingUsers = useStoreData(onlineStore, (store) => store.typingUsers);

  const [isLoadingConversation, setIsLoadingConversation] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const previousLastMessageIdRef = useRef<string | undefined>(undefined);
  const previousChatIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!chatId) {
      chatStore.cleanMessages();
      chatStore.clearPinnedMessages();
      chatStore.cleanOpponentId();
      return;
    }

    let isCancelled = false;

    const loadConversation = async () => {
      setIsLoadingConversation(true);
      chatStore.cleanMessages();
      chatStore.clearPinnedMessages();
      try {
        await Promise.all([
          chatStore.fetchChatMessages(chatId, 0),
          chatStore.loadPinnedMessages(chatId),
        ]);
      } finally {
        if (!isCancelled) {
          setIsLoadingConversation(false);
        }
      }
    };

    void loadConversation();

    return () => {
      isCancelled = true;
      chatStore.cleanMessages();
      chatStore.clearPinnedMessages();
      chatStore.cleanOpponentId();
    };
  }, [chatId, chatStore]);

  useEffect(() => {
    if (!chatId) return;
    void chatStore.fetchChat(chatId, myId);
  }, [chatId, chatStore, myId]);

  useEffect(() => {
    if (!myId) return;
    void onlineStore.connectSocket();
  }, [myId, onlineStore]);

  useEffect(() => {
    if (!chatId) return;
    void onlineStore.ensureConnectedAndJoined([chatId]);
  }, [chatId, onlineStore]);

  useEffect(() => {
    if (!chatId || !isSocketConnected) return;
    chatStore.subscribeToChat(chatId);
    return () => {
      chatStore.unsubscribeFromChat(chatId);
    };
  }, [chatId, chatStore, isSocketConnected]);

  useEffect(() => {
    onlineStore.clearTypingUsers();
    return () => {
      onlineStore.clearTypingUsers();
    };
  }, [chatId, onlineStore]);

  const handleSend = useCallback(async (text: string) => {
    if (!chatId || !text.trim()) return;
    await chatStore.sendMessage(text, chatId);
  }, [chatId, chatStore]);

  const handleTyping = useCallback(() => {
    if (!chatId) return;
    onlineStore.emitTyping(chatId);
  }, [chatId, onlineStore]);

  const handleStopTyping = useCallback(() => {
    if (!chatId) return;
    onlineStore.emitStopTyping(chatId);
  }, [chatId, onlineStore]);

  const handlePin = useCallback((message: MessageDTO) => {
    if (chatStore.isMessagePinned(message._id)) return;
    void chatStore.pinMessage(message);
  }, [chatStore]);

  const handleUnpin = useCallback((messageId: string) => {
    void chatStore.unpinMessage(messageId);
  }, [chatStore]);

  const isPinned = useCallback((id: string) => chatStore.isMessagePinned(id), [chatStore]);

  const handleLoadMore = useCallback(async () => {
    if (!chatId || isLoadingMore) return;
    setIsLoadingMore(true);
    try {
      await chatStore.fetchChatMessages(chatId, messages.length);
    } finally {
      setIsLoadingMore(false);
    }
  }, [chatId, chatStore, isLoadingMore, messages.length]);

  const messageCount = messages.length;
  const lastMessageId = messageCount ? messages[messageCount - 1]?._id : undefined;

  useEffect(() => {
    const container = scrollContainerRef.current;

    if (!container || !messageCount) {
      previousLastMessageIdRef.current = lastMessageId;
      previousChatIdRef.current = chatId;
      return;
    }

    const chatHasChanged = chatId && chatId !== previousChatIdRef.current;
    const hasNewLastMessage = lastMessageId && lastMessageId !== previousLastMessageIdRef.current;

    if (chatHasChanged || hasNewLastMessage) {
      container.scrollTop = container.scrollHeight;
    }

    previousLastMessageIdRef.current = lastMessageId;
    previousChatIdRef.current = chatId;
  }, [chatId, lastMessageId, messageCount]);

  const conversationTitle = useMemo(() => {
    if (!selectedChat) return 'Chat';
    if (selectedChat.isGroupChat) {
      return selectedChat.chatName || selectedChat.post?.title || 'Group chat';
    }
    const opponent = selectedChat.users?.find((user) => user._id !== myId);
    const name = [opponent?.name, opponent?.lastname].filter(Boolean).join(' ').trim();
    return name || opponent?.username || 'Direct chat';
  }, [myId, selectedChat]);

  const conversationUser = useMemo(() => {
    if (!selectedChat || selectedChat.isGroupChat) return null;
    return selectedChat.users?.find((user) => user._id !== myId) ?? null;
  }, [myId, selectedChat]);

  const conversationFullName = useMemo(() => {
    if (conversationUser) {
      const fullName = getUserFullName(conversationUser).trim();
      if (fullName) {
        return fullName;
      }
      return conversationUser.username || conversationUser.email || conversationTitle;
    }
    return conversationTitle;
  }, [conversationTitle, conversationUser]);

  const conversationProfileHref = useMemo(() => {
    if (conversationUser) {
      const isAiBot = conversationUser.role === 'aiBot';
      const baseRoute = isAiBot ? routes.aiAgentProfile : routes.userProfile;
      return `${baseRoute}/${encodeURIComponent(conversationUser._id)}`;
    }

    return null;
  }, [conversationUser, routes]);

  const senderNameMap = useMemo(() => {
    const map = new Map<string, string>();
    selectedChat?.users?.forEach((user) => {
      const fullName = [user.name, user.lastname].filter(Boolean).join(' ').trim();
      const displayName = fullName || user.username || user.email || user._id;
      map.set(user._id, displayName);
    });
    return map;
  }, [selectedChat]);

  const activeTypingMessage = useMemo(() => {
    const filteredUsers = typingUsers.filter((user) => user.userId && user.userId !== myId);
    if (!filteredUsers.length) {
      return null;
    }
    return buildTypingMessage(filteredUsers);
  }, [myId, typingUsers]);

  const resolveSenderName = useCallback((message: MessageDTO) => {
    const id = message.sender?._id;
    if (!id) return 'Anonymous';
    const stored = senderNameMap.get(id);
    if (stored) return stored;
    return id.length > 8 ? `${id.slice(0, 6)}…` : id;
  }, [senderNameMap]);

  const renderEmptyState = () => (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-3xl border border-dashed border-white/10 bg-white/5 p-8 text-center text-sm text-white/60">
      <p>Select a chat from the list to start messaging.</p>
      <p className="text-xs text-white/40">Pinned messages and history will appear here.</p>
    </div>
  );

  return (
    <AppShell>
      <div className="relative flex h-full min-h-0 flex-col overflow-hidden">
        <GradientOrbs />
        <div className="relative z-10 mx-auto grid h-full w-full max-w-4xl flex-1 grid-rows-[auto,1fr,auto] gap-y-4 px-4 pb-16 pt-4 md:gap-y-6">
          <header className="rounded-3xl border border-white/10 bg-white/5 px-6 py-5 shadow-[0_18px_40px_rgba(15,15,15,0.45)] backdrop-blur">
            <div className="flex flex-col gap-2">
              <span className="text-xs uppercase tracking-[0.28em] text-white/40">Conversation</span>
              {conversationProfileHref ? (
                <Link
                  href={conversationProfileHref}
                  className="flex items-center gap-4 rounded-2xl transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                >
                  <ChatAvatar
                    name={conversationFullName}
                    avatarUrl={conversationUser ? getUserAvatar(conversationUser) : undefined}
                    avatarAlt={conversationFullName}
                  />
                  <div className="flex flex-col">
                    <h1 className="text-2xl font-semibold text-white">{conversationFullName}</h1>
                    {activeTypingMessage ? (
                      <p className="text-sm text-white/60">{activeTypingMessage}</p>
                    ) : selectedChat?.users?.length ? (
                      <p className="text-sm text-white/60">
                        {selectedChat.users.length} participant{selectedChat.users.length === 1 ? '' : 's'}
                      </p>
                    ) : null}
                  </div>
                </Link>
              ) : (
                <div className="flex items-center gap-4">
                  <ChatAvatar
                    name={conversationFullName}
                    avatarUrl={conversationUser ? getUserAvatar(conversationUser) : undefined}
                    avatarAlt={conversationFullName}
                  />
                  <div className="flex flex-col">
                    <h1 className="text-2xl font-semibold text-white">{conversationFullName}</h1>
                    {activeTypingMessage ? (
                      <p className="text-sm text-white/60">{activeTypingMessage}</p>
                    ) : selectedChat?.users?.length ? (
                      <p className="text-sm text-white/60">
                        {selectedChat.users.length} participant{selectedChat.users.length === 1 ? '' : 's'}
                      </p>
                    ) : null}
                  </div>
                </div>
              )}
            </div>
          </header>

          <div className="min-h-0 overflow-hidden">
            {!chatId ? (
              renderEmptyState()
            ) : (
              <div className="flex h-full flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-4 shadow-[0_18px_40px_rgba(15,15,15,0.45)] backdrop-blur">
                {isLoadingConversation ? (
                  <div className="flex flex-1 items-center justify-center text-sm text-white/60">Loading conversation…</div>
                ) : (
                  <>
                    <PinnedMessagesSection messages={pinnedMessages} onUnpin={handleUnpin} />
                    <div ref={scrollContainerRef} className="flex-1 overflow-y-auto pr-2">
                      {hasMoreMessages ? (
                        <div className="mb-4 flex justify-center">
                          <Button
                            variant="outline"
                            className="rounded-full border-white/20 px-4 py-1 text-xs text-white/70 hover:border-white/50 hover:text-white"
                            onClick={handleLoadMore}
                            disabled={isLoadingMore}
                          >
                            {isLoadingMore ? 'Loading…' : 'Load previous messages'}
                          </Button>
                        </div>
                      ) : null}
                      <MessageList
                        messages={messages}
                        currentUserId={myId}
                        isMessagePinned={isPinned}
                        onPinMessage={handlePin}
                        onUnpinMessage={handleUnpin}
                        resolveSenderName={resolveSenderName}
                      />
                      <TypingIndicator typingUsers={typingUsers} currentUserId={myId} />
                      {!messages.length ? (
                        <p className="pt-6 text-center text-sm text-white/50">No messages yet. Say hello!</p>
                      ) : null}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          <div>
            <MessageInput
              onSend={handleSend}
              placeholder={chatId ? `Message ${conversationTitle}` : 'Select a chat to start messaging'}
              isSending={isSendingMessage}
              onTyping={handleTyping}
              onStopTyping={handleStopTyping}
            />
          </div>
        </div>
      </div>
    </AppShell>
  );
}

