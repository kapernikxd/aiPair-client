'use client';

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Share2,
  MoreHorizontal,
  MapPin,
  Users2,
  Star,
  Sparkles,
  Clock3,
  Flame,
  Heart,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import AppShell from "@/components/AppShell";
import { useAuthRoutes } from "@/hooks/useAuthRoutes";

const badges = ["Narrative tactician", "Keeps secrets", "Loyal to the core"];

type TalkieStat = {
  label: string;
  value: string;
  icon: LucideIcon;
};

type TalkieCard = {
  name: string;
  image: string;
  description: string;
  stats: TalkieStat[];
};

const talkies: TalkieCard[] = [
  {
    name: "Chantal",
    image:
      "https://images.unsplash.com/photo-1505739773557-d7f4c02f515f?auto=format&fit=crop&w=800&q=80",
    description: "Chantal's password phrase lives in a photo only you remember.",
    stats: [
      { label: "episodes", value: "02", icon: Clock3 },
      { label: "intensity", value: "8.2", icon: Flame },
      { label: "saves", value: "26", icon: Heart },
    ],
  },
  {
    name: "Mallory",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
    description: "Mallory is a fellow student at the university. You study together at dusk.",
    stats: [
      { label: "episodes", value: "03", icon: Clock3 },
      { label: "pulse", value: "7.4", icon: Flame },
      { label: "notes", value: "18", icon: Heart },
    ],
  },
  {
    name: "Lola",
    image:
      "https://images.unsplash.com/photo-1526218626217-dc65b81f828b?auto=format&fit=crop&w=800&q=80",
    description: "Lola is that ‘free spirit’ no nonsense extroverted best...",
    stats: [
      { label: "episodes", value: "02", icon: Clock3 },
      { label: "spark", value: "8.0", icon: Flame },
      { label: "loops", value: "20", icon: Heart },
    ],
  },
  {
    name: "Caley",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
    description: "Caley keeps the perimeter quiet. She spots trouble half a block away.",
    stats: [
      { label: "episodes", value: "04", icon: Clock3 },
      { label: "focus", value: "7.1", icon: Flame },
      { label: "links", value: "32", icon: Heart },
    ],
  },
  {
    name: "Raven",
    image:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80",
    description: "Raven talks in code. She'll meet you where the signal is weakest.",
    stats: [
      { label: "episodes", value: "03", icon: Clock3 },
      { label: "tempo", value: "7.8", icon: Flame },
      { label: "keys", value: "24", icon: Heart },
    ],
  },
  {
    name: "Tanya",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
    description: "Tanya waits with tea and proof that you're not the villain.",
    stats: [
      { label: "episodes", value: "05", icon: Clock3 },
      { label: "glow", value: "9.1", icon: Flame },
      { label: "scribes", value: "41", icon: Heart },
    ],
  },
];

export default function UserProfilePage() {
  const { routes } = useAuthRoutes();
  return (
    <AppShell>
      <div className="relative min-h-screen overflow-y-auto bg-neutral-950 text-white">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-[-10%] top-[-5%] h-[26rem] w-[26rem] rounded-full bg-violet-500/20 blur-3xl" />
          <div className="absolute right-[-15%] bottom-[-10%] h-[28rem] w-[28rem] rounded-full bg-fuchsia-500/15 blur-3xl" />
        </div>

        <div className="mx-auto w-full max-w-5xl px-4 pb-20 pt-14">
          <header className="space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <button className="inline-flex size-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10">
                  <ArrowLeft className="size-5" />
                </button>
                <button className="inline-flex size-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10">
                  <Share2 className="size-5" />
                </button>
                <button className="inline-flex size-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10">
                  <MoreHorizontal className="size-5" />
                </button>
              </div>
              <button className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 py-2 text-sm font-medium text-white/80 backdrop-blur transition hover:bg-white/20">
                <Sparkles className="size-4" />
                Subscribed
              </button>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
              <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-1 items-start gap-5">
                  <div className="relative size-24 shrink-0 overflow-hidden rounded-3xl border border-white/15">
                    <Image
                      src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=500&q=80"
                      alt="Keyser Soze portrait"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 96px, 150px"
                    />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-white/60">
                      <MapPin className="size-4 text-violet-300" />
                      <span>Somewhere in the shadows</span>
                    </div>
                    <div>
                      <h1 className="text-4xl font-semibold tracking-tight">Keyser Soze</h1>
                      <p className="mt-2 text-sm leading-6 text-white/70">
                        One of my favorite movies is the “Usual Suspects” (1995) from where I picked up the name Keyser Soze.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {badges.map((badge) => (
                        <span
                          key={badge}
                          className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs uppercase tracking-wide text-white/60"
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-start gap-4 text-sm text-white/70 md:items-end">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
                      <Users2 className="size-4 text-violet-200" />
                      <span className="font-medium text-white">114</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
                      <Star className="size-4 text-amber-300" />
                      <span className="font-medium text-white">157</span>
                    </div>
                  </div>
                  <Link
                    href={routes.adminChat}
                    className="inline-flex items-center gap-2 rounded-2xl border border-white/15 px-5 py-2 text-sm font-semibold text-white/90 transition hover:bg-white/10"
                  >
                    Message Keyser
                  </Link>
                </div>
              </div>
            </div>
          </header>

          <section className="mt-12 space-y-6">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold">Talkie List</h2>
                <p className="mt-1 text-sm text-white/60">Where the stories stay safe and the signal stays clear.</p>
              </div>
              <button className="hidden items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-wide text-white/60 transition hover:bg-white/10 sm:flex">
                View archive
              </button>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {talkies.map((talkie) => (
                <article
                  key={talkie.name}
                  className="group overflow-hidden rounded-3xl border border-white/10 bg-neutral-900/60 shadow-[0_20px_40px_-20px_rgba(59,0,104,0.45)] transition hover:border-violet-400/40"
                >
                  <div className="relative h-52 w-full overflow-hidden">
                    <Image
                      src={talkie.image}
                      alt={talkie.name}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 to-transparent" />
                  </div>
                  <div className="space-y-4 p-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold text-white">{talkie.name}</h3>
                      <span className="text-xs uppercase tracking-widest text-violet-200/80">Secure</span>
                    </div>
                    <p className="text-sm leading-6 text-white/70">{talkie.description}</p>
                    <div className="flex items-center gap-3 text-sm text-white/70">
                      {talkie.stats.map((stat) => (
                        <span
                          key={stat.label}
                          className="inline-flex items-center gap-1 rounded-2xl border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium"
                        >
                          <stat.icon className="size-3.5 text-violet-200" />
                          {stat.value}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
