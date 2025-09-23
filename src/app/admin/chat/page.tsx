import AppShell from "@/components/AppShell";
import Image from "next/image";

const messages = [
  {
    id: 1,
    speaker: "Angelina",
    timestamp: "6",
    content: '"Don\'t get any ideas." Angelina smirks with a twinkle in her eye.',
    align: "left" as const,
  },
  {
    id: 2,
    speaker: "Angelina",
    timestamp: "6",
    content: 'Her voice is like honey. "Hello there."',
    align: "left" as const,
  },
  {
    id: 3,
    speaker: "You",
    timestamp: "Now",
    content: "Hi 👋",
    align: "right" as const,
  },
];

export default function ChatPage() {
  return (
    <AppShell>
      <div className="relative min-h-screen bg-[#08090B] text-white">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-[-20%] h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-[#F9A8D4]/10 blur-3xl" />
          <div className="absolute bottom-[-30%] right-[-20%] h-[32rem] w-[32rem] rounded-full bg-[#7C3AED]/20 blur-3xl" />
          <div className="absolute bottom-[-10%] left-[-10%] h-[24rem] w-[24rem] rounded-full bg-[#FBBF24]/10 blur-3xl" />
        </div>

        <div className="relative mx-auto flex min-h-screen w-full max-w-3xl flex-col px-4 pb-10 pt-16">
          <header className="flex items-center gap-4">
            <div className="relative h-20 w-20">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-400 via-rose-400 to-indigo-500" />
              <div className="absolute inset-[3px] overflow-hidden rounded-full bg-neutral-900">
                <Image
                  src="/img/mizuhara.png"
                  alt="Angelina"
                  fill
                  sizes="80px"
                  className="object-cover"
                  priority
                />
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-semibold">Angelina</h1>
                <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs text-white/70 backdrop-blur">
                  <span>1.0K</span>
                  <span className="h-1 w-1 rounded-full bg-white/30" />
                  <span>2&apos;30</span>
                  <span className="h-1 w-1 rounded-full bg-white/30" />
                  <span>By Keyser Soze</span>
                </div>
              </div>
              <button className="w-fit rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-neutral-900 transition hover:bg-white/90">
                Follow
              </button>
            </div>
          </header>

          <section className="mt-10 space-y-6">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/60">
                Intro
              </div>
              <div className="space-y-3 text-sm text-white/80">
                <p>
                  You just met Angelina for the first time just before walking down the aisle. The marriage is a &quot;backstop&quot; to both of your &quot;cover&quot; identities as undercover intelligence agents. You both
                  &quot;wheel up&quot; and off to your first mission together after the reception. Congratulations and good luck.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {messages.map((message) => {
                const isRight = message.align === "right";
                return (
                  <article
                    key={message.id}
                    className={`flex ${isRight ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`relative max-w-[80%] rounded-3xl border border-white/10 p-5 shadow-2xl backdrop-blur transition ${isRight
                          ? "bg-gradient-to-br from-amber-300/90 to-orange-500/90 text-neutral-900"
                          : "bg-white/5 text-white"
                        }`}
                    >
                      <div
                        className={`absolute top-4 flex h-10 w-10 items-center justify-center rounded-2xl text-xs font-semibold shadow-lg backdrop-blur ${isRight
                            ? "-right-5 bg-white text-neutral-900"
                            : "-left-5 bg-white/10 text-white/70"
                          }`}
                      >
                        {message.timestamp}
                      </div>
                      <div
                        className={`flex items-center justify-between text-xs uppercase tracking-wide ${isRight ? "text-neutral-900/70" : "text-white/60"
                          }`}
                      >
                        <span
                          className={`font-semibold ${isRight ? "text-neutral-900" : "text-white/80"
                            }`}
                        >
                          {message.speaker}
                        </span>
                        <span>{isRight ? "Now" : "Scene"}</span>
                      </div>
                      <div className="mt-3 space-y-3 text-sm">
                        {message.content.split("\n").map((line, idx) => (
                          <p
                            key={idx}
                            className={`leading-relaxed ${isRight ? "text-neutral-900" : "text-white/90"
                              }`}
                          >
                            {line}
                          </p>
                        ))}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            {[
              { label: "Hi", gradient: "from-amber-200/70 to-orange-300/80" },
              { label: "😍", gradient: "from-rose-300/80 to-purple-400/80" },
            ].map((chip) => (
              <button
                key={chip.label}
                className={`rounded-2xl bg-gradient-to-br ${chip.gradient} px-4 py-2 text-sm font-semibold text-neutral-900 shadow-lg transition hover:brightness-105`}
              >
                {chip.label}
              </button>
            ))}
          </div>

          <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur">
            <label className="block text-xs font-medium uppercase tracking-[0.3em] text-white/40">
              Message Angelina, reply from AI
            </label>
            <div className="mt-3 flex items-center gap-3">
              <input
                className="flex-1 rounded-2xl border border-white/10 bg-transparent px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none"
                placeholder="Say something..."
              />
              <button className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-neutral-900 transition hover:bg-white/90">
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
