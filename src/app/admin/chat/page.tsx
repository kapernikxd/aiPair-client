'use client';

import AppShell from "@/components/AppShell";
import GradientOrbs from "@/components/ui/GradientOrbs";
import { Button } from "@/components/ui/Button";
import HeaderProfile from "@/components/chat/HeaderProfile";
import IntroCard from "@/components/chat/IntroCard";
import MessageList from "@/components/chat/MessageList";
import MessageInput from "@/components/chat/MessageInput";
import { useRootStore, useStoreData } from "@/stores/StoreProvider";


export default function ChatPage() {
  const { chatStore } = useRootStore();
  const messages = useStoreData(chatStore, (store) => store.activeMessages);
  const activeThread = useStoreData(chatStore, (store) => store.activeThread);

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    chatStore.sendMessage(text);
  };

  return (
    <AppShell>
      {/* весь экран, внешняя прокрутка отключена */}
      <div className="relative flex h-full min-h-0 flex-col overflow-hidden">
        <GradientOrbs />

        {/* три строки: Header / Messages(scroll) / Input */}
        <div className="relative z-10 mx-auto grid h-full w-full max-w-3xl flex-1 grid-rows-[auto,1fr,auto] gap-y-6 px-4 pt-4 pb-4">
          {/* 1) ШАПКА — статично */}
          <HeaderProfile
            title={activeThread?.name ?? 'Angelina'}
            avatarSrc={activeThread?.avatar?.src ?? '/img/mizuhara.png'}
            stats={{ views: '1.0K', duration: "2'30", author: 'Keyser Soze' }}
            onFollow={() => console.log('follow')}
          />

          {/* 2) СРЕДНИЙ РЯД — ТОЛЬКО ЗДЕСЬ СКРОЛЛ */}
          <div className="min-h-0 overflow-y-auto space-y-6 pr-1">
            <IntroCard>
              <p>
                You just met Angelina for the first time just before walking down the aisle. The marriage is a
                &quot;backstop&quot; to both of your &quot;cover&quot; identities as undercover intelligence agents.
              </p>
              <p>
                You both &quot;wheel up&quot; and off to your first mission together after the reception. Congratulations and good luck.
              </p>
            </IntroCard>

            <MessageList messages={messages} />

            {/* быстрые чипы — тоже остаются в зоне прокрутки сообщений или вынеси выше, если хочешь фиксированно */}
            <div className="flex flex-wrap items-center gap-3">
              {[
                {
                  label: 'Hi',
                  gradientFrom: 'rgba(253, 230, 138, 0.7)',
                  gradientTo: 'rgba(253, 186, 116, 0.8)',
                },
                {
                  label: '😍',
                  gradientFrom: 'rgba(253, 164, 175, 0.8)',
                  gradientTo: 'rgba(192, 132, 252, 0.8)',
                },
              ].map((chip) => (
                <Button
                  key={chip.label}
                  variant="gradient"
                  gradientFrom={chip.gradientFrom}
                  gradientTo={chip.gradientTo}
                  onClick={() => handleSend(chip.label)}
                >
                  {chip.label}
                </Button>
              ))}
            </div>
          </div>

          {/* 3) ИНПУТ — статично снизу */}
          <div>
            <MessageInput onSend={handleSend} placeholder="Message Angelina, reply from AI" />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
