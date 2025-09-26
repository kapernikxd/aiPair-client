'use client';

import AppShell from "@/components/AppShell";
import { useEffect } from "react";
import PageHeader from "@/components/chats/PageHeader";
import ChatList from "@/components/chats/ChatList";
import { AuthRouteKey, useAuthRoutes } from "@/helpers/hooks/useAuthRoutes";
import { useRootStore, useStoreData } from "@/stores/StoreProvider";

export default function ChatsPage() {
  const { routes } = useAuthRoutes();
  const { chatStore, authStore } = useRootStore();
  const chats = useStoreData(chatStore, (store) => store.chats);
  const isLoadingChats = useStoreData(chatStore, (store) => store.isLoadingChats);
  const myId = useStoreData(authStore, (store) => store.user?.id ?? "");

  useEffect(() => {
    void chatStore.fetchChats({ page: 1 });
  }, [chatStore]);

  const chatHrefBuilder = (chatId: string) => `${routes.adminChat}?chatId=${chatId}`;

  const handleChatSelect = (chatId: string) => {
    void chatStore.fetchChat(chatId, myId);
  };

  return (
    <AppShell>
      <div className="flex-1 overflow-y-auto px-4 pb-20 pt-4 md:px-8 md:pb-16 md:pt-8">
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
          <PageHeader />
          <ChatList
            chats={chats}
            routeFor={(key: AuthRouteKey) => routes[key]}
            onSelect={(chat) => handleChatSelect(chat._id)}
            isLoading={isLoadingChats}
            getChatHref={(chat) => chatHrefBuilder(chat._id)}
          />
        </div>
      </div>
    </AppShell>
  );
}
