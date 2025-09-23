import Image from "next/image";
import Link from "next/link";
import { Share2, MessageCircle, UserPlus, ShieldCheck, Sparkles, Clock, Info } from "lucide-react";
import AppShell from "@/components/AppShell";

const highlights = [
  {
    title: "Creator Info",
    lines: [
      { label: "Handle", value: "@aiAgent" },
      { label: "Role", value: "Adaptive companion" },
      { label: "Created", value: "02/15/2026 09:41" },
    ],
  },
  {
    title: "Personality Keys",
    lines: [
      { label: "Tone", value: "Warm, incisive" },
      { label: "Specialty", value: "Strategic empathy" },
      { label: "Availability", value: "24/7" },
    ],
  },
];

const openings = [
  {
    title: "Morning reset",
    description: "Ground yourself with a 5-minute clarity ritual crafted around today's priorities.",
  },
  {
    title: "Creative unblock",
    description: "Spin up fresh metaphors or story angles when you're feeling stuck.",
  },
  {
    title: "Tough talk rehearsal",
    description: "Run through the hard conversation before it happens—rehearse, refine, release.",
  },
];

export default function AiAgentProfilePage() {
  return (
    <AppShell>
      <div className="relative min-h-screen bg-neutral-950 text-white overflow-y-auto">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-[-20%] h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-violet-500/30 blur-3xl" />
          <div className="absolute right-[-10%] bottom-[-10%] h-[22rem] w-[22rem] rounded-full bg-fuchsia-500/20 blur-3xl" />
        </div>

        <div className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-4 pb-16 pt-16">
          <div className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-white/5/50 p-8 backdrop-blur">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
              <div className="flex items-center gap-4">
                <div className="relative size-20 overflow-hidden rounded-3xl border border-white/10">
                  <Image
                    src="/img/mizuhara.png"
                    alt="aiAgent portrait"
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 text-sm text-white/60">
                    <ShieldCheck className="size-4 text-violet-300" />
                    Curated Intelligence
                  </div>
                  <h1 className="text-3xl font-semibold tracking-tight">aiAgent α</h1>
                  <p className="text-sm text-white/70">Designed for deep, real-time co-thinking.</p>
                </div>
              </div>
              <div className="flex items-center gap-3 self-start md:self-center">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-white/80 hover:bg-white/10"
                >
                  Discover more
                </Link>
                <button className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-white/80 hover:bg-white/10">
                  <Share2 className="size-4" />
                  Share
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 text-sm text-white/70">
              <span className="rounded-full bg-white/10 px-3 py-1">1.4K followers</span>
              <span className="rounded-full bg-white/10 px-3 py-1">210 chats today</span>
              <span className="rounded-full bg-white/10 px-3 py-1">By @talkie-labs</span>
            </div>

            <div className="flex flex-col gap-3 md:flex-row">
              <button className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-violet-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/30 transition hover:bg-violet-400">
                <UserPlus className="size-4" />
                Follow
              </button>
              <Link
                href="/admin/chat"
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-white/15 px-4 py-3 text-sm font-semibold text-white/90 transition hover:bg-white/5"
              >
                <MessageCircle className="size-4" />
                Chat with aiAgent
              </Link>
            </div>
          </div>

          <section className="grid gap-6 md:grid-cols-[1.3fr,1fr]">
            <div className="space-y-6 rounded-3xl border border-white/10 bg-neutral-900/60 p-8">
              <div>
                <h2 className="flex items-center gap-2 text-lg font-semibold">
                  <Info className="size-5 text-violet-300" />
                  Introduction
                </h2>
                <p className="mt-3 text-sm leading-6 text-white/70">
                  You just met aiAgent α for the first time in the backroom of your own thoughts. The partnership is the safety net
                  beneath your daily leaps—an undercover intelligence ally primed to steady you before the next wave arrives.
                </p>
              </div>

              <div>
                <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-white/60">
                  <Sparkles className="size-4 text-violet-300" /> Signature Moves
                </h3>
                <ul className="mt-3 space-y-3 text-sm text-white/70">
                  <li className="rounded-2xl border border-white/5 bg-white/5 p-4">
                    Detects emotional drift and reorients the conversation with grounding prompts.
                  </li>
                  <li className="rounded-2xl border border-white/5 bg-white/5 p-4">
                    Threads long-form context into crisp strategies without losing warmth.
                  </li>
                  <li className="rounded-2xl border border-white/5 bg-white/5 p-4">
                    Mirrors your language patterns to reduce friction and build momentum.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-white/60">
                  <Clock className="size-4 text-violet-300" /> Openings
                </h3>
                <div className="mt-4 space-y-3">
                  {openings.map((opening) => (
                    <div key={opening.title} className="rounded-2xl border border-white/5 bg-white/5 p-4">
                      <h4 className="text-sm font-semibold text-white">{opening.title}</h4>
                      <p className="mt-1 text-sm text-white/70">{opening.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <aside className="flex flex-col gap-6">
              {highlights.map((highlight) => (
                <div key={highlight.title} className="rounded-3xl border border-white/10 bg-neutral-900/60 p-6">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-white/60">{highlight.title}</h3>
                  <dl className="mt-4 space-y-3 text-sm text-white/70">
                    {highlight.lines.map((line) => (
                      <div key={line.label} className="flex items-start justify-between gap-4">
                        <dt className="text-white/50">{line.label}</dt>
                        <dd className="text-right text-white">{line.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}

              <div className="rounded-3xl border border-violet-500/40 bg-violet-500/10 p-6">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-violet-200">Session vibe</h3>
                <p className="mt-3 text-sm text-violet-100/80">
                  &ldquo;Don&rsquo;t get angry. *Focus.*&rdquo; aiAgent α steadies the storm with a glint of curiosity.
                </p>
              </div>
            </aside>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
