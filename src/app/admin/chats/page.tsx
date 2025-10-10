// app/.../ChatsPage.tsx
"use client";

import AppShell from "@/components/AppShell";
import ChatsView from "./ChatsView";
import { useChatsPage } from "@/helpers/hooks/chats/useChatsPage";

export default function ChatsPage() {
  const vm = useChatsPage();

  return (
    <AppShell>
      <ChatsView
        chats={vm.chats}
        isLoadingChats={vm.isLoadingChats}
        currentUserId={vm.myId}
        routeFor={vm.routeFor}
        onSelect={vm.onSelect}
        getChatHref={vm.getChatHref}
      />
    </AppShell>
  );
}
