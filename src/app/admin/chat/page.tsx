'use client';

import { useState } from "react";
import AppShell from "@/components/AppShell";
import GradientOrbs from "@/components/ui/GradientOrbs";
import HeaderProfile from "@/components/chat/HeaderProfile";
import IntroCard from "@/components/chat/IntroCard";
import MessageList from "@/components/chat/MessageList";
import MessageInput from "@/components/chat/MessageInput";
import { ChatMessage } from "@/helpers/types/chat";

import { initialMessages } from "@/helpers/data/chat";


export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);

  const handleSend = (text: string) => {
    setMessages(prev => [
      ...prev,
      { id: Date.now(), speaker: 'You', timestamp: 'Now', content: text, align: 'right' },
    ]);
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
            title="Angelina"
            avatarSrc="/img/mizuhara.png"
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
                { label: 'Hi', gradient: 'from-amber-200/70 to-orange-300/80' },
                { label: '😍', gradient: 'from-rose-300/80 to-purple-400/80' },
              ].map((chip) => (
                <button
                  key={chip.label}
                  className={`rounded-2xl bg-gradient-to-br ${chip.gradient} px-4 py-2 text-sm font-semibold text-neutral-900 shadow-lg transition hover:brightness-105`}
                  onClick={() => handleSend(chip.label)}
                >
                  {chip.label}
                </button>
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
