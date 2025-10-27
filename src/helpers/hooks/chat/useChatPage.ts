// hooks/useChatPage.ts
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { MessageDTO } from "@/types";
import { useRootStore, useStoreData } from "@/stores/StoreProvider";
import { useAuthRoutes } from "@/helpers/hooks/useAuthRoutes";
import { getUserAvatar, getUserFullName } from "@/helpers/utils/user";
import { useTranslations } from "@/localization/TranslationProvider";
import { buildTypingMessage } from "@/components/chat/TypingIndicator";

export function useChatPage(chatId: string | null) {
    const { chatStore, authStore, onlineStore, uiStore } = useRootStore();
    const { routes } = useAuthRoutes();
    const { t } = useTranslations();

    // store state
    const messages = useStoreData(chatStore, s => s.messages);
    const pinnedMessages = useStoreData(chatStore, s => s.pinnedMessages);
    const hasMoreMessages = useStoreData(chatStore, s => s.hasMoreMessages);
    const selectedChat = useStoreData(chatStore, s => s.selectedChat);
    const isSendingMessage = useStoreData(chatStore, s => s.isSendingMessage);
    const myId = useStoreData(authStore, s => s.user?.id ?? "");
    const isSocketConnected = useStoreData(onlineStore, s => s.isConnected);
    const typingUsers = useStoreData(onlineStore, s => s.typingUsers);

    // local flags
    const [isLoadingConversation, setIsLoadingConversation] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [isClearingHistory, setIsClearingHistory] = useState(false);

    // bootstrap conversation on chatId change
    useEffect(() => {
        if (!chatId) {
            chatStore.cleanMessages();
            chatStore.clearPinnedMessages();
            chatStore.cleanOpponentId();
            return;
        }
        let cancelled = false;
        (async () => {
            setIsLoadingConversation(true);
            chatStore.cleanMessages();
            chatStore.clearPinnedMessages();
            try {
                await Promise.all([
                    chatStore.fetchChatMessages(chatId, 0),
                    chatStore.loadPinnedMessages(chatId),
                ]);
            } finally {
                if (!cancelled) setIsLoadingConversation(false);
            }
        })();
        return () => {
            cancelled = true;
            chatStore.cleanMessages();
            chatStore.clearPinnedMessages();
            chatStore.cleanOpponentId();
        };
    }, [chatId, chatStore]);

    // fetch chat meta
    useEffect(() => {
        if (!chatId) return;
        void chatStore.fetchChat(chatId, myId);
    }, [chatId, chatStore, myId]);

    // socket connect + room join
    useEffect(() => {
        if (!myId) return;
        void onlineStore.connectSocket();
    }, [myId, onlineStore]);

    useEffect(() => {
        if (!chatId) return;
        void onlineStore.ensureConnectedAndJoined([chatId]);
    }, [chatId, onlineStore]);

    // subscribe to live chat updates
    useEffect(() => {
        if (!chatId || !isSocketConnected) return;
        chatStore.subscribeToChat(chatId);
        return () => chatStore.unsubscribeFromChat();
    }, [chatId, chatStore, isSocketConnected]);

    // typing users cleanup on chat change
    useEffect(() => {
        onlineStore.clearTypingUsers();
        return () => onlineStore.clearTypingUsers();
    }, [chatId, onlineStore]);

    // handlers
    const handleTyping = useCallback(() => {
        if (!chatId) return;
        onlineStore.emitTyping(chatId);
    }, [chatId, onlineStore]);

    const handleStopTyping = useCallback(() => {
        if (!chatId) return;
        onlineStore.emitStopTyping(chatId);
    }, [chatId, onlineStore]);

    const handleClearHistory = useCallback(async () => {
        if (!chatId) return;
        const confirmed = window.confirm(
            t(
                "admin.chat.clearHistory.confirm",
                "Are you sure you want to delete this conversation history? This action cannot be undone."
            )
        );
        if (!confirmed) return;

        setIsClearingHistory(true);
        try {
            await chatStore.clearChatHistory(chatId);
            uiStore.showSnackbar(
                t("admin.chat.clearHistory.success", "Conversation history deleted."),
                "success"
            );
        } catch (e) {
            console.error("Failed to delete conversation history", e);
            uiStore.showSnackbar(
                t("admin.chat.clearHistory.error", "Failed to delete conversation history."),
                "error"
            );
        } finally {
            setIsClearingHistory(false);
        }
    }, [chatId, chatStore, t, uiStore]);

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

    const handleSend = useCallback(async (text: string) => {
        if (!chatId || !text.trim()) return;
        await chatStore.sendMessage(text, chatId);
    }, [chatId, chatStore]);

    // derived conversation header info
    const conversationUser = useMemo(() => {
        if (!selectedChat || selectedChat.isGroupChat) return null;
        return selectedChat.users?.find((u) => u._id !== myId) ?? null;
    }, [myId, selectedChat]);

    const conversationTitle = useMemo(() => {
        if (!selectedChat) return t("admin.chat.title.default", "Chat");
        if (selectedChat.isGroupChat) {
            return selectedChat.chatName || t("admin.chat.title.group", "Group chat");
        }
        const opponent = conversationUser;
        const name = [opponent?.name, opponent?.lastname].filter(Boolean).join(" ").trim();
        return name || opponent?.username || t("admin.chat.title.direct", "Direct chat");
    }, [selectedChat, conversationUser, t]);

    const conversationFullName = useMemo(() => {
        if (conversationUser) {
            const fullName = getUserFullName(conversationUser).trim();
            if (fullName) return fullName;
            return conversationUser.username || conversationUser.email || conversationTitle;
        }
        return conversationTitle;
    }, [conversationTitle, conversationUser]);

    const conversationProfileHref = useMemo(() => {
        if (!conversationUser) return null;
        const isAiBot = conversationUser.role === "aiBot";
        const base = isAiBot ? routes.aiAgentProfile : routes.userProfile;
        return `${base}/${encodeURIComponent(conversationUser._id)}`;
    }, [conversationUser, routes]);

    const senderNameMap = useMemo(() => {
        const map = new Map<string, string>();
        selectedChat?.users?.forEach((u) => {
            const full = [u.name, u.lastname].filter(Boolean).join(" ").trim();
            const display = full || u.username || u.email || u._id;
            map.set(u._id, display);
        });
        return map;
    }, [selectedChat]);

    const resolveSenderName = useCallback((m: MessageDTO) => {
        const id = m.sender?._id;
        if (!id) return t("admin.chat.sender.unknown", "Anonymous");
        return senderNameMap.get(id) ?? (id.length > 8 ? `${id.slice(0, 6)}…` : id);
    }, [senderNameMap, t]);

    // typing text
    const activeTypingMessage = useMemo(() => { 
        const filteredUsers = typingUsers.filter((user) => user.userId && user.userId !== myId); 
        if (!filteredUsers.length) { return null; } 
        return buildTypingMessage(filteredUsers); }, 
    [myId, typingUsers]);

    return {
        // store data
        messages,
        pinnedMessages,
        hasMoreMessages,
        selectedChat,
        isSendingMessage,
        myId,
        isSocketConnected,
        typingUsers,

        // local flags
        isLoadingConversation,
        isLoadingMore,
        isClearingHistory,

        // derived
        conversationUser,
        conversationTitle,
        conversationFullName,
        conversationProfileHref,

        // utils
        getUserAvatar,
        t,

        // handlers
        handleTyping,
        handleStopTyping,
        handleClearHistory,
        handlePin,
        handleUnpin,
        isPinned,
        handleLoadMore,
        handleSend,

        resolveSenderName,

        // typing label
        activeTypingMessage,
    } as const;
}
