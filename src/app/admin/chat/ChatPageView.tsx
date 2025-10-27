// components/chat/ChatPageView.tsx
"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useCallback } from "react";
import { Trash2 } from "lucide-react";
import ChatAvatar from "@/components/chats/ChatAvatar";
import MessageList from "@/components/chat/MessageList";
import MessageInput from "@/components/chat/MessageInput";
import TypingIndicator from "@/components/chat/TypingIndicator";
import GradientOrbs from "@/components/ui/GradientOrbs";
import { Button } from "@/components/ui/Button";
import type { MessageDTO, UserBasicDTO, UserDTO } from "@/types";

function formatPinnedTimestamp(value: string) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleString();
}

function PinnedMessagesSection({
    messages,
    onUnpin,
    t,
}: {
    messages: MessageDTO[];
    onUnpin: (messageId: string) => void;
    t: (k: string, def: string) => string;
}) {
    if (!messages.length) return null;
    return (
        <section className="flex flex-col gap-3">
            <header className="flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-white/70">
                    {t("admin.chat.pinned.title", "Pinned messages")}
                </h2>
                <span className="text-xs text-white/50">{messages.length}</span>
            </header>
            <div className="space-y-3">
                {messages.map((m) => (
                    <div
                        key={m._id}
                        className="flex items-start justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/90"
                    >
                        <div className="flex-1 space-y-1">
                            <p className="font-medium text-white">{m.content}</p>
                            <span className="text-[11px] uppercase tracking-wide text-white/60">
                                {formatPinnedTimestamp(m.createdAt)}
                            </span>
                        </div>
                        <Button
                            variant="ghostPillCompact"
                            className="border-white/20 text-white/80 hover:border-white/40 hover:text-white"
                            onClick={() => onUnpin(m._id)}
                        >
                            {t("admin.chat.pinned.unpin", "Unpin")}
                        </Button>
                    </div>
                ))}
            </div>
        </section>
    );
}

type Props = {
    chatId: string | null;

    // data
    messages: MessageDTO[];
    pinnedMessages: MessageDTO[];
    hasMoreMessages: boolean;
    isSendingMessage: boolean;
    typingUsers: {
        userId: string;
        userName: string;
    }[];
    myId: string;

    // flags
    isLoadingConversation: boolean;
    isLoadingMore: boolean;
    isClearingHistory: boolean;

    // header info
    conversationUser: UserDTO | null;
    conversationTitle: string;
    conversationFullName: string;
    conversationProfileHref: string | null;

    // utils
    getUserAvatar: (u: UserDTO | UserBasicDTO) => string | undefined;
    t: (key: string, def: string) => string;
    activeTypingMessage: string | null;

    // handlers
    handleClearHistory: () => void;
    handleLoadMore: () => void;
    handleSend: (text: string) => void;
    handleTyping: () => void;
    handleStopTyping: () => void;
    handlePin: (m: MessageDTO) => void;
    handleUnpin: (id: string) => void;
    resolveSenderName: (m: MessageDTO) => string;
    isPinned: (id: string) => boolean;
};

export default function ChatPageView(props: Props) {
    const {
        chatId,
        messages, pinnedMessages, hasMoreMessages,
        isSendingMessage, typingUsers, myId,
        isLoadingConversation, isLoadingMore, isClearingHistory,
        conversationUser, conversationTitle, conversationFullName, conversationProfileHref,
        getUserAvatar, t, activeTypingMessage,
        handleClearHistory, handleLoadMore, handleSend, handleTyping, handleStopTyping,
        handlePin, handleUnpin, resolveSenderName, isPinned,
    } = props;

    // UI-only scrolling
    const scrollContainerRef = useRef<HTMLDivElement | null>(null);
    const messageListRef = useRef<HTMLDivElement | null>(null);
    const scrollAnchorRef = useRef<HTMLDivElement | null>(null);
    const scrollAnimationFrameRef = useRef<number | null>(null);
    const maintainScrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const shouldMaintainScrollRef = useRef(false);
    const previousLastMessageIdRef = useRef<string | undefined>(undefined);
    const previousChatIdRef = useRef<string | null>(null);

    const messageCount = messages.length;
    const lastMessageId = messageCount ? messages[messageCount - 1]?._id : undefined;

    const queueScrollToBottom = useCallback(() => {
        const anchor = scrollAnchorRef.current;
        const container = scrollContainerRef.current;
        if (!anchor || !container) return;

        shouldMaintainScrollRef.current = true;
        if (maintainScrollTimeoutRef.current) clearTimeout(maintainScrollTimeoutRef.current);
        maintainScrollTimeoutRef.current = setTimeout(() => {
            shouldMaintainScrollRef.current = false;
            maintainScrollTimeoutRef.current = null;
        }, 1500);

        if (scrollAnimationFrameRef.current !== null) {
            cancelAnimationFrame(scrollAnimationFrameRef.current);
        }
        scrollAnimationFrameRef.current = requestAnimationFrame(() => {
            container.scrollTop = container.scrollHeight;
            anchor.scrollIntoView({ block: "end", inline: "nearest", behavior: "auto" });
            scrollAnimationFrameRef.current = null;
        });
    }, []);

    useEffect(() => {
        if (!chatId || isLoadingConversation || !messageCount) return;
        queueScrollToBottom();
    }, [chatId, isLoadingConversation, messageCount, queueScrollToBottom]);

    useLayoutEffect(() => {
        const container = scrollContainerRef.current;
        if (!container || !messageCount) {
            previousLastMessageIdRef.current = lastMessageId;
            previousChatIdRef.current = chatId;
            return;
        }
        const chatHasChanged = chatId && chatId !== previousChatIdRef.current;
        const hasNewLast = lastMessageId && lastMessageId !== previousLastMessageIdRef.current;
        if (chatHasChanged || hasNewLast) queueScrollToBottom();
        previousLastMessageIdRef.current = lastMessageId;
        previousChatIdRef.current = chatId;
    }, [chatId, lastMessageId, messageCount, queueScrollToBottom]);

    const messageListElement = messageListRef.current;
    useEffect(() => {
        if (!messageListElement) return;
        const observer = new ResizeObserver(() => {
            if (shouldMaintainScrollRef.current) queueScrollToBottom();
        });
        observer.observe(messageListElement);
        return () => observer.disconnect();
    }, [messageListElement, queueScrollToBottom]);

    useEffect(() => () => {
        if (scrollAnimationFrameRef.current !== null) cancelAnimationFrame(scrollAnimationFrameRef.current);
        if (maintainScrollTimeoutRef.current) clearTimeout(maintainScrollTimeoutRef.current);
        shouldMaintainScrollRef.current = false;
    }, []);

    const renderEmptyState = () => (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-3xl border border-dashed border-white/10 bg-white/5 p-8 text-center text-sm text-white/60">
            <p>{t("admin.chat.empty.select", "Select a chat from the list to start messaging.")}</p>
            <p className="text-xs text-white/40">
                {t("admin.chat.empty.detail", "Pinned messages and history will appear here.")}
            </p>
        </div>
    );

    return (
        <div className="relative flex h-screen min-h-0 flex-col overflow-hidden">
            <GradientOrbs />

            <div className="relative z-10 mx-auto w-full max-w-4xl flex-1 min-h-0 grid grid-rows-[auto_minmax(0,1fr)_auto] gap-y-2 px-1 pt-1 pb-16 md:px-4 md:pt-4 md:gap-y-6">
                {/* Header */}
                <header className="rounded-3xl max-h-[140px] border border-white/10 bg-white/5 px-6 py-5 shadow-[0_18px_40px_rgba(15,15,15,0.45)] backdrop-blur">
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between gap-3">
                            <span className="text-xs uppercase tracking-[0.28em] text-white/40">
                                {t("admin.chat.header.label", "Conversation")}
                            </span>
                            {chatId ? (
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="whitespace-nowrap"
                                    disabled={isClearingHistory}
                                    onClick={handleClearHistory}
                                >
                                    <Trash2 className="size-4" />
                                    <span>
                                        {isClearingHistory
                                            ? t("admin.chat.clearHistory.clearing", "Clearing…")
                                            : t("admin.chat.clearHistory.action", "Clear history")}
                                    </span>
                                </Button>
                            ) : null}
                        </div>

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
                                    ) : conversationUser?.profession ? (
                                        <p className="text-sm text-white/60">{conversationUser?.profession}</p>
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
                                    ) : conversationUser?.profession ? (
                                        <p className="text-sm text-white/60">{conversationUser?.profession}</p>
                                    ) : null}
                                </div>
                            </div>
                        )}
                    </div>
                </header>

                {/* Body */}
                <div className="flex min-h-0">
                    {!chatId ? (
                        <div className="flex-1 min-h-0 overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-4 shadow-[0_18px_40px_rgba(15,15,15,0.45)] backdrop-blur">
                            {renderEmptyState()}
                        </div>
                    ) : (
                        <div className="flex h-full min-h-0 flex-1 flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-4 shadow-[0_18px_40px_rgba(15,15,15,0.45)] backdrop-blur">
                            {isLoadingConversation ? (
                                <div className="flex flex-1 items-center justify-center text-sm text-white/60">
                                    {t("admin.chat.loadingConversation", "Loading conversation…")}
                                </div>
                            ) : (
                                <>
                                    <PinnedMessagesSection messages={pinnedMessages} onUnpin={handleUnpin} t={t} />

                                    <div ref={scrollContainerRef} className="flex-1 min-h-0 overflow-y-auto pr-2">
                                        {hasMoreMessages ? (
                                            <div className="mb-4 flex justify-center">
                                                <Button
                                                    variant="outline"
                                                    className="rounded-full border-white/20 px-4 py-1 text-xs text-white/70 hover:border-white/50 hover:text-white"
                                                    onClick={handleLoadMore}
                                                    disabled={isLoadingMore}
                                                >
                                                    {isLoadingMore
                                                        ? t("admin.chat.loadingMore", "Loading…")
                                                        : t("admin.chat.loadPrevious", "Load previous messages")}
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
                                            containerRef={messageListRef}
                                            bottomSentinelRef={scrollAnchorRef}
                                        >
                                            <TypingIndicator typingUsers={typingUsers} currentUserId={myId} />
                                            {!messages.length ? (
                                                <p className="pt-6 text-center text-sm text-white/50">
                                                    {t("admin.chat.noMessages", "No messages yet. Say hello!")}
                                                </p>
                                            ) : null}
                                        </MessageList>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* Input */}
                <div>
                    <MessageInput
                        onSend={handleSend}
                        placeholder={
                            chatId
                                ? t("admin.chat.input.placeholder", "Message {name}").replace("{name}", conversationTitle)
                                : t("admin.chat.input.emptyPlaceholder", "Select a chat to start messaging")
                        }
                        isSending={isSendingMessage}
                        onTyping={handleTyping}
                        onStopTyping={handleStopTyping}
                    />
                </div>
            </div>
        </div>
    );
}
