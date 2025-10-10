// app/.../ChatPage.tsx
"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import AppShell from "@/components/AppShell";
import GradientOrbs from "@/components/ui/GradientOrbs";
import ChatPageView from "./ChatPageView";
import { useChatPage } from "@/helpers/hooks/chat/useChatPage";
import { useTranslations } from "@/localization/TranslationProvider";

function ChatPageFallback() {
  const { t } = useTranslations();
  return (
    <AppShell>
      <div className="flex h-full min-h-0 flex-col items-center justify-center gap-4 p-6 text-sm text-white/60">
        <GradientOrbs />
        <p>{t("admin.chat.fallback.loading", "Loading chat…")}</p>
      </div>
    </AppShell>
  );
}

function ChatPageContent() {
  const params = useSearchParams();
  const chatId = params.get("chatId");
  const vm = useChatPage(chatId);

  return (
    <AppShell>
      <ChatPageView
        chatId={chatId}
        // data
        messages={vm.messages}
        pinnedMessages={vm.pinnedMessages}
        hasMoreMessages={vm.hasMoreMessages}
        isSendingMessage={vm.isSendingMessage}
        typingUsers={vm.typingUsers}
        myId={vm.myId}
        // flags
        isLoadingConversation={vm.isLoadingConversation}
        isLoadingMore={vm.isLoadingMore}
        isClearingHistory={vm.isClearingHistory}
        // header info
        conversationUser={vm.conversationUser}
        conversationTitle={vm.conversationTitle}
        conversationFullName={vm.conversationFullName}
        conversationProfileHref={vm.conversationProfileHref}
        // utils
        getUserAvatar={vm.getUserAvatar}
        t={vm.t}
        activeTypingMessage={vm.activeTypingMessage}
        // handlers
        handleClearHistory={vm.handleClearHistory}
        handleLoadMore={vm.handleLoadMore}
        handleSend={vm.handleSend}
        handleTyping={vm.handleTyping}
        handleStopTyping={vm.handleStopTyping}
        handlePin={vm.handlePin}
        handleUnpin={vm.handleUnpin}
        resolveSenderName={vm.resolveSenderName}
        isPinned={vm.isPinned}
      />
    </AppShell>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<ChatPageFallback />}>
      <ChatPageContent />
    </Suspense>
  );
}
