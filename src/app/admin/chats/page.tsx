'use client';

import AppShell from "@/components/AppShell";
import PageHeader from "@/components/chats/PageHeader";
import ChatList from "@/components/chats/ChatList";

import { chatThreads } from "@/helpers/data/chats";
import { AuthRouteKey, useAuthRoutes } from "@/helpers/hooks/useAuthRoutes";

export default function ChatsPage() {
  const { routes } = useAuthRoutes();

  return (
    <AppShell>
      <div className="flex-1 overflow-y-auto px-4 pb-28 pt-4 md:px-8 md:pb-12 md:pt-8">
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
          <PageHeader />
          <ChatList
            threads={chatThreads}
            routeFor={(key: AuthRouteKey) => routes[key]}
          />
        </div>
      </div>
    </AppShell>
  );
}
