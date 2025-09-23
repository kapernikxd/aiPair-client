'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Mic, Sparkles, Shield, Globe2, Bot, PlayCircle, CheckCircle2 } from "lucide-react";
// импорт иконок, ваших Badge/Pill и т.п.

function Bubble({ role, text }: { role: "ai" | "me"; text: string }) {
  const isAI = role === "ai";
  return (
    <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${isAI ? "bg-white/5" : "bg-[#6f2da8]/20"}`}>
      <div className="flex items-center gap-2 text-white/70">
        {isAI ? <Bot className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        <span className="text-white/80">{isAI ? "AI" : "You"}</span>
      </div>
      <p className="mt-1 text-white/90">{text}</p>
    </div>
  );
}

export default function DeviceMockup() {
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
                  <span>Conversation</span>
                  <span>00:42</span>
                </div>
                <div className="space-y-3">
                  <Bubble role="ai" text="Hey! What do you want to talk about today?" />
                  <Bubble role="me" text="I feel anxious about a presentation." />
                  <Bubble role="ai" text="Let's break it down together and rehearse step‑by‑step." />
                </div>
                <div className="mt-5 flex items-center justify-between rounded-xl border border-white/10 bg-neutral-800/60 p-3">
                  <div className="flex items-center gap-2 text-white/70"><Mic className="h-4 w-4" /> Tap and talk</div>
                  <button className="rounded-lg bg-[#6f2da8] px-3 py-1.5 text-sm font-medium">Hold</button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
    )
}