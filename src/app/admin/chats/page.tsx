'use client';

import AppShell from "@/components/AppShell";
import PageHeader from "@/components/chats/PageHeader";
import ChatList from "@/components/chats/ChatList";
import { AuthRouteKey, useAuthRoutes } from "@/helpers/hooks/useAuthRoutes";
import { useRootStore, useStoreData } from "@/stores/StoreProvider";

export default function ChatsPage() {
  const { routes } = useAuthRoutes();
  const { chatStore } = useRootStore();
  const threads = useStoreData(chatStore, (store) => store.threads);

  return (
    <AppShell>
      <div className="flex-1 overflow-y-auto px-4 pb-20 pt-4 md:px-8 md:pb-16 md:pt-8">
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
          <PageHeader />
          <ChatList
            threads={threads}
            routeFor={(key: AuthRouteKey) => routes[key]}
            onSelect={(thread) => chatStore.setActiveThread(thread.id)}
          />
        </div>
      </div>
    </AppShell>
  );
}
