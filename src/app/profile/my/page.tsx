"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
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
import EditProfileDialog, { EditableProfile } from "@/components/EditProfileDialog";

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

const badges = ["Narrative tactician", "Keeps secrets", "Loyal to the core"];

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

const initialProfile: EditableProfile = {
  userName: "Vadim Stepanov",
  gender: "he_him",
  intro: "AI product designer exploring the edges of digital companions.",
  relationshipPreference: "View your relationship preference",
};

const genderLabels: Record<string, string> = {
  he_him: "He/Him",
  she_her: "She/Her",
  they_them: "They/Them",
};

export default function MyProfilePage() {
  const [profile, setProfile] = useState<EditableProfile>(initialProfile);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const genderLabel = useMemo(() => genderLabels[profile.gender] ?? profile.gender, [profile.gender]);

  return (
    <AppShell>
      <div className="relative min-h-screen overflow-y-auto bg-neutral-950 text-white">
        <EditProfileDialog
          open={isDialogOpen}
          profile={profile}
          onClose={() => setIsDialogOpen(false)}
          onSave={setProfile}
        />

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
              <div className="flex items-center gap-3">
                <button className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 py-2 text-sm font-medium text-white/80 backdrop-blur transition hover:bg-white/20">
                  <Sparkles className="size-4" />
                  Subscribed
                </button>
                <button
                  onClick={() => setIsDialogOpen(true)}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-200"
                >
                  Edit Profile
                </button>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
              <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-1 items-start gap-5">
                  <div className="relative size-24 shrink-0 overflow-hidden rounded-3xl border border-white/15">
                    <Image
                      src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=500&q=80"
                      alt="Vadim Stepanov portrait"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 96px, 150px"
                    />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-white/60">
                      <MapPin className="size-4 text-violet-300" />
                      <span>Designing between worlds</span>
                    </div>
                    <div>
                      <h1 className="text-4xl font-semibold tracking-tight">{profile.userName}</h1>
                      <p className="mt-2 text-sm leading-6 text-white/70">{profile.intro}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-wide text-white/60">
                      <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1">{genderLabel}</span>
                      <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1">
                        {profile.relationshipPreference}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="grid w-full max-w-xs gap-4 rounded-2xl border border-white/10 bg-neutral-900/80 p-5 text-sm text-white/70">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-white/40">Membership</p>
                    <p className="mt-1 font-medium text-white">Creator tier</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-white/40">Joined</p>
                    <p className="mt-1">August 2022</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-white/40">Last updated</p>
                    <p className="mt-1">2 days ago</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {badges.map((badge) => (
                  <div
                    key={badge}
                    className="rounded-2xl border border-white/10 bg-white/[0.08] px-4 py-3 text-sm text-white/80"
                  >
                    {badge}
                  </div>
                ))}
              </div>
            </div>
          </header>

          <section className="mt-12 grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="space-y-6">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                <h2 className="text-lg font-semibold text-white">Talkie timeline</h2>
                <p className="mt-2 text-sm text-white/70">
                  Curated journeys and storylines that chart my evolution as a companion creator.
                </p>
                <div className="mt-6 space-y-4">
                  {talkies.slice(0, 3).map((talkie) => (
                    <article
                      key={talkie.name}
                      className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-neutral-900/80 p-4 sm:flex-row"
                    >
                      <div className="relative h-40 w-full shrink-0 overflow-hidden rounded-2xl sm:h-32 sm:w-32">
                        <Image
                          src={talkie.image}
                          alt={talkie.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, 128px"
                        />
                      </div>
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <h3 className="text-base font-semibold text-white">{talkie.name}</h3>
                          <p className="mt-1 text-sm text-white/70">{talkie.description}</p>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-3 text-xs text-white/50">
                          {talkie.stats.map((stat) => (
                            <span
                              key={stat.label}
                              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1"
                            >
                              <stat.icon className="size-3.5" />
                              {stat.label}: {stat.value}
                            </span>
                          ))}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                <h2 className="text-lg font-semibold text-white">Recent milestones</h2>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {["Built the first multilingual storyline engine", "Hosted a co-creation salon in Lisbon", "Launched Talkie mentorship series", "Documented narrative design patterns"].map((milestone) => (
                    <div
                      key={milestone}
                      className="rounded-2xl border border-white/10 bg-neutral-900/80 p-4 text-sm text-white/70"
                    >
                      {milestone}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <aside className="space-y-6">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                <h2 className="text-lg font-semibold text-white">Community stats</h2>
                <div className="mt-4 grid gap-4">
                  <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-neutral-900/80 px-4 py-3">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-white/40">Core circle</p>
                      <p className="text-sm text-white">58 members</p>
                    </div>
                    <Users2 className="size-6 text-white/60" />
                  </div>
                  <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-neutral-900/80 px-4 py-3">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-white/40">Avg. rating</p>
                      <p className="text-sm text-white">4.9</p>
                    </div>
                    <Star className="size-6 text-amber-400" />
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-neutral-900/80 px-4 py-3 text-sm text-white/70">
                    “Vadim&apos;s sessions feel like stepping into a movie scene you secretly hope is real.”
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                <h2 className="text-lg font-semibold text-white">More talkies</h2>
                <div className="mt-5 space-y-4">
                  {talkies.slice(3).map((talkie) => (
                    <div key={talkie.name} className="flex gap-3 rounded-2xl border border-white/10 bg-neutral-900/80 p-3">
                      <div className="relative h-16 w-16 overflow-hidden rounded-xl">
                        <Image
                          src={talkie.image}
                          alt={talkie.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-white">{talkie.name}</h3>
                        <p className="mt-1 text-xs text-white/60">{talkie.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
