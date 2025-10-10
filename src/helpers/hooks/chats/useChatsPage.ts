// hooks/useChatsPage.ts
"use client";

import { useEffect, useCallback } from "react";
import { useRootStore, useStoreData } from "@/stores/StoreProvider";
import { useAuthRoutes, AuthRouteKey } from "@/helpers/hooks/useAuthRoutes";

export function useChatsPage() {
  const { routes } = useAuthRoutes();
  const { chatStore, authStore, onlineStore } = useRootStore();

  // store-backed state
  const chats = useStoreData(chatStore, (s) => s.chats);
  const isLoadingChats = useStoreData(chatStore, (s) => s.isLoadingChats);
  const myId = useStoreData(authStore, (s) => s.user?.id ?? "");
  const isSocketConnected = useStoreData(onlineStore, (s) => s.isConnected);

  // initial load
  useEffect(() => {
    void chatStore.fetchChats({ page: 1 });
  }, [chatStore]);

  // connect socket when we know myId
  useEffect(() => {
    if (!myId) return;
    void onlineStore.connectSocket();
  }, [myId, onlineStore]);

  // subscribe/unsubscribe to chats stream
  useEffect(() => {
    if (!isSocketConnected) return;
    chatStore.subscribeToChats();
    return () => {
      chatStore.unsubscribeFromChats();
    };
  }, [chatStore, isSocketConnected]);

  const chatHrefBuilder = useCallback(
    (chatId: string) => `${routes.adminChat}?chatId=${encodeURIComponent(chatId)}`,
    [routes.adminChat],
  );

  const handleChatSelect = useCallback(
    (chatId: string) => {
      if (!chatId || !myId) return;
      void chatStore.fetchChat(chatId, myId);
    },
    [chatStore, myId],
  );

  const routeFor = useCallback((key: AuthRouteKey) => routes[key], [routes]);

  return {
    // data
    chats,
    isLoadingChats,
    myId,
    // helpers
    routeFor,
    getChatHref: (chat: { _id: string }) => chatHrefBuilder(chat._id),
    onSelect: (chat: { _id: string }) => handleChatSelect(chat._id),
  } as const;
}
