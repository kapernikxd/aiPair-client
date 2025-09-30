'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/Button";
import { Mic, Bot } from "lucide-react";
import { useTranslations } from '@/localization/TranslationProvider';
// импорт иконок, ваших Badge/Pill и т.п.

function Bubble({ role, text, aiLabel, youLabel }: { role: "ai" | "me"; text: string; aiLabel: string; youLabel: string }) {
  const isAI = role === "ai";
  return (
    <div
      className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${isAI ? "bg-white/5" : "bg-[#6f2da8]/20"
        }`}
    >
      <div className="flex items-center gap-2 text-white/70">
        {isAI ? <Bot className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        <span className="text-white/80">{isAI ? aiLabel : youLabel}</span>
      </div>
      <p className="mt-1 text-white/90">{text}</p>
    </div>
  );
}

export default function DeviceMockup() {
  const { t } = useTranslations();
  const aiLabel = t('landing.mockup.ai', 'AI');
  const youLabel = t('landing.mockup.you', 'You');
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mx-auto w-full max-w-md"
      >
        <div className="relative rounded-[2rem] border border-white/10 bg-neutral-900 p-3 shadow-xl">
          <div className="rounded-[1.6rem] bg-gradient-to-b from-neutral-800 to-neutral-900 p-4">
            <div className="mb-3 flex items-center justify-between text-xs text-white/50">
              <span>{t('landing.mockup.header', 'Conversation')}</span>
              <span>01:12</span>
            </div>
            <div className="space-y-3">
              <Bubble role="ai" text={t('landing.mockup.messages.1', 'You seem quiet today. What’s on your mind?')} aiLabel={aiLabel} youLabel={youLabel} />
              <Bubble role="me" text={t('landing.mockup.messages.2', 'It’s… something I don’t usually talk about.')} aiLabel={aiLabel} youLabel={youLabel} />
              <Bubble role="ai" text={t('landing.mockup.messages.3', 'Want to hear what I’d do in your place, or do you want to share first?')} aiLabel={aiLabel} youLabel={youLabel} />
            </div>
            <div className="mt-5 flex items-center justify-between rounded-xl border border-white/10 bg-neutral-800/60 p-3">
              <div className="flex items-center gap-2 text-white/70">
                <Mic className="h-4 w-4" /> {t('landing.mockup.tap', 'Tap and talk')}
              </div>
              <Button variant="mockup">{t('landing.mockup.hold', 'Hold')}</Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}