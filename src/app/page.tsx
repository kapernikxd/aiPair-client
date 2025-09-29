'use client';

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowRight, Mic, Sparkles, Shield, Globe2, PlayCircle, CheckCircle2, X, Brain, Bookmark, MessageSquareHeart, XCircle } from "lucide-react";
import LandingClient from '@/components/LandingClient';
import DeviceMockup from '@/components/DeviceMockup';
import CardRailTwoRows from "@/components/ui/CardRailTwoRows";
import AuthPopup from "@/components/AuthPopup";
import { Button } from "@/components/ui/Button";
import { useAuthRoutes } from "@/helpers/hooks/useAuthRoutes";
import type { AuthRouteKey } from "@/helpers/hooks/useAuthRoutes";
import { useRootStore, useStoreData } from "@/stores/StoreProvider";
import { BASE_URL } from "@/helpers/http";
import type { AuthProvider } from "@/stores/AuthStore";
import { Logo } from "@/components/ui/Logo";
import { useRouter } from "next/navigation";
import Image from "next/image";

// export const metadata = {
//   title: 'AI Pair — Talk with an AI companion',
// }

type BaseCardItem = {
  id: number;
  cardWidth?: string;
  src: string;
  title: string;
  views: string;
  hoverText: string;
  routeKey: AuthRouteKey;
};

type LandingCardItem = {
  id: number | string;
  src: string;
  avatarSrc?: string;
  title: string;
  views?: string;
  hoverText?: string;
  href?: string;
  onChatNow?: () => void;
  isChatLoading?: boolean;
};


// Tailwind is assumed available in the preview. Primary brand color from your prefs: #6f2da8
// Minimalistic, fast, single-file landing you can paste into a Next.js page or CRA component.
// Sections: Nav, Hero, SocialProof, Features, Demo, Pricing, FAQ, Footer.

const FALLBACK_IMAGE = "/img/noProfile.jpg";

const buildImageUrl = (path?: string) => {
  if (!path) {
    return undefined;
  }

  if (/^(https?:)?\/\//.test(path) || path.startsWith("data:")) {
    return path;
  }

  if (path.startsWith("/")) {
    return path;
  }

  const normalizedPath = path.startsWith("images/") ? path : `images/${path}`;
  return `${BASE_URL}${normalizedPath}`;
};

const Pill = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs text-white/80 backdrop-blur">
    {children}
  </span>
);

const Badge = ({ children }: { children: React.ReactNode }) => (
  <span className="rounded-full bg-[#6f2da8]/10 px-3 py-1 text-xs font-medium text-[#6f2da8] ring-1 ring-[#6f2da8]/20">
    {children}
  </span>
);

const Section = ({ id, className = "", children }: { id?: string; className?: string; children: React.ReactNode }) => (
  <section id={id} className={`relative mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</section>
);

const GradientBlob = ({ className = "" }: { className?: string }) => (
  <div className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className}`}>
    <div className="absolute left-1/2 top-[-10%] h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-[#6f2da8]/30 blur-3xl" />
    <div className="absolute right-[-10%] top-1/2 h-[24rem] w-[24rem] -translate-y-1/2 rounded-full bg-fuchsia-400/20 blur-3xl" />
    <div className="absolute bottom-[-10%] left-[-10%] h-[22rem] w-[22rem] rounded-full bg-indigo-400/20 blur-3xl" />
  </div>
);

export default function Landing() {
  const { routes, goToAdmin } = useAuthRoutes();
  const { uiStore, authStore, profileStore, aiBotStore, chatStore } = useRootStore();
  const open = useStoreData(uiStore, (store) => store.isAuthPopupOpen);
  const showMobileBanner = useStoreData(uiStore, (store) => store.isMobileBannerVisible);
  const isAuthenticated = useStoreData(authStore, (store) => store.isAuthenticated);
  const authUser = useStoreData(authStore, (store) => store.user);
  const profileName = useStoreData(profileStore, (store) => store.profile.userName);
  const mainPageBots = useStoreData(aiBotStore, (store) => store.mainPageBots);
  const router = useRouter();
  const [chatLoadingBotId, setChatLoadingBotId] = useState<string | null>(null);

  useEffect(() => {
    if (aiBotStore.mainPageBots.length === 0 && !aiBotStore.isLoadingMainPageBots) {
      void aiBotStore.fetchMainPageBots();
    }
  }, [aiBotStore]);

  const handleAuth = (provider: AuthProvider) => {
    authStore.startAuth(provider);
    const rawProfileName = profileName ?? '';
    const normalizedProfile = rawProfileName.trim().toLowerCase().replace(/\s+/g, '.');
    const fallbackName = rawProfileName.trim() || 'User';
    authStore.completeAuth({
      id: `${provider}-${Date.now()}`,
      name: fallbackName,
      email: `${normalizedProfile || 'user'}@example.com`,
    });
    uiStore.closeAuthPopup();
  };
  const handleAccountClick = () => {
    if (isAuthenticated) {
      goToAdmin();
      return;
    }
    uiStore.openAuthPopup();
  };
  const handleChatNow = useCallback(async (botId: string) => {
    if (!botId) {
      return;
    }

    if (!isAuthenticated) {
      uiStore.openAuthPopup();
      return;
    }

    setChatLoadingBotId(botId);

    try {
      const response = await chatStore.messageById(botId);
      const chatId = response?._id ?? response?.data?._id ?? response?.chat?._id;
      if (chatId) {
        router.push(`${routes.adminChat}?chatId=${encodeURIComponent(chatId)}`);
      } else {
        uiStore.showSnackbar("Failed to open chat. Please try again.", "error");
      }
    } catch (error) {
      console.error("Failed to open chat with AI bot:", error);
      uiStore.showSnackbar("Failed to open chat. Please try again.", "error");
    } finally {
      setChatLoadingBotId(null);
    }
  }, [chatStore, isAuthenticated, router, routes.adminChat, uiStore]);
  const cardItems: LandingCardItem[] = useMemo(() => {
    if (mainPageBots.length > 0) {
      return mainPageBots.map((bot) => {
        const previewImage = bot.details?.photos?.[0] ?? bot.avatarFile;
        const src = buildImageUrl(previewImage) ?? FALLBACK_IMAGE;
        const avatarSrc = buildImageUrl(bot.avatarFile) ?? FALLBACK_IMAGE;
        const fullName = [bot.name, bot.lastname].filter(Boolean).join(" ").trim();
        const botId = bot.id;

        return {
          id: botId,
          src,
          avatarSrc,
          title: fullName || bot.username || "AI Agent",
          views: bot.profession || bot.username,
          hoverText: bot.userBio || bot.details?.intro,
          href: `${routes.aiAgentProfile}/${botId}`,
          onChatNow: () => handleChatNow(botId),
          isChatLoading: chatLoadingBotId === botId,
        } satisfies LandingCardItem;
      });
    }
    return []
  }, [chatLoadingBotId, handleChatNow, mainPageBots, routes]);

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <GradientBlob />
      {/* NAV */}
      <nav className="sticky top-0 z-40 border-b border-white/10 bg-neutral-950/70 backdrop-blur">
        <Section className="flex items-center justify-between py-3">
          <Logo />
          <div className="hidden gap-6 text-sm text-white/80 md:flex">
            <a href={routes.landingFeatures} className="hover:text-white">Features</a>
            <a href={routes.landingDemo} className="hover:text-white">Demo</a>
            <a href={routes.landingPricing} className="hover:text-white">Pricing</a>
            <a href={routes.landingFaq} className="hover:text-white">FAQ</a>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:inline">
              <Button onClick={handleAccountClick} variant="ghostRounded">
                {isAuthenticated ? authUser?.name ?? profileName : 'Sign in'}
              </Button>
            </div>
            <a className="inline-flex items-center gap-2 rounded-xl bg-[#6f2da8] px-4 py-2 text-sm font-medium text-white hover:opacity-90" href={routes.landingCta}>
              Try it free <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </Section>
      </nav>

      {/* HERO */}
      <header className="relative">
        <Section className="grid grid-cols-1 items-center gap-10 py-16 md:grid-cols-2 md:py-24">
          <div>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <Badge>Customizable</Badge>
              <Badge>Real-time</Badge>
              <Badge>Private</Badge>
            </div>
            <LandingClient />

            <blockquote className="mt-5 max-w-xl italic text-white/80">
              “It feels like I’m talking to a real friend, not a bot.
              I never thought AI could remember me like this.”
            </blockquote>
            <cite className="mt-2 block text-sm text-white/50">— Anna</cite>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href={routes.landingCta}
                className="inline-flex items-center gap-2 rounded-2xl bg-[#6f2da8] px-5 py-3 text-sm font-semibold hover:opacity-90"
              >
                Start free
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href={routes.landingDemo}
                className="inline-flex items-center gap-2 rounded-2xl border border-white/15 px-5 py-3 text-sm font-semibold hover:bg-white/5"
              >
                <PlayCircle className="h-4 w-4" /> Watch demo
              </a>
            </div>

            <div className="mt-6 text-xs text-white/50">
              Available on iOS & Android • Works in the browser
            </div>
          </div>

          {/* Device mockup */}
          <DeviceMockup />
        </Section>
      </header>

      {/* SOCIAL PROOF */}
      <Section className="py-8">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-white/50">
          <span>Trusted by creators & students</span>
          <span>•</span>
          <span>Fast onboarding</span>
          <span>•</span>
          <span>Human‑like voices</span>
        </div>
      </Section>

      <main className=" text-white p-6">
        <CardRailTwoRows items={cardItems} className="mx-auto max-w-[1200px]" />
      </main>


      {/* FEATURES */}
      <Section id="features" className="py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold">An AI that acts more like a person</h2>
          <p className="mt-2 text-white/70">
            Built around values that make conversations feel natural, meaningful, and human.
          </p>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
          <Feature
            icon={<MessageSquareHeart className="h-5 w-5" />}
            title="Feels human"
            desc="Speaks with emotion, nuance, and empathy — not just flat responses."
          />
          <Feature
            icon={<Bookmark className="h-5 w-5" />}
            title="Remembers you"
            desc="Keeps track of what matters: your name, goals, and past conversations."
          />
          <Feature
            icon={<Sparkles className="h-5 w-5" />}
            title="Adapts to you"
            desc="Learns your preferences and adjusts its style to fit your personality."
          />
          <Feature
            icon={<Brain className="h-5 w-5" />}
            title="Thinks it through"
            desc="Explains reasoning step by step, like talking with a thoughtful friend."
          />
        </div>
      </Section>

      {/* DEMO */}
      <Section id="demo" className="py-16">
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
          <div>
            <h3 className="text-xl font-bold">Bring any character to life</h3>
            <p className="mt-2 max-w-md text-white/70">
              Create your own AI companion — whether it’s a mentor, a friend, or a
              completely fictional persona. Customize their traits, style, and the way
              they interact with you.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-white/80">
              {[
                "Design personalities that feel unique",
                "Choose how they speak, think, and respond",
                "Role-play with characters from any world you imagine",
              ].map((x) => (
                <li key={x} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4" /> {x}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <a
                href={routes.landingPricing}
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2 text-sm hover:bg-white/5"
              >
                Start creating <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 p-2">
            <div className="aspect-video w-full rounded-xl bg-neutral-800">
              <div className="flex h-full items-center justify-center text-white/40">
                <img
                  src="/img/video.gif"
                  alt="AI character demo"
                  className="h-full w-full object-cover rounded-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* PRICING */}
      <Section id="pricing" className="py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h3 className="text-xl font-bold">Simple pricing</h3>
          <p className="mt-2 text-white/70">Start free. Upgrade when you need more talk time.</p>
        </div>
        <div className="mx-auto mt-8 grid max-w-4xl grid-cols-1 gap-4 md:grid-cols-3">
          <Plan
            name="Free"
            price="$0"
            features={[
              { text: "Limited daily talk time", available: true },
              { text: "Chat with 50+ AI agents", available: true },
              { text: "1 custom AI agent", available: true },
              { text: "No memory (conversations reset)", available: false },
              { text: "Limited features and updates", available: false },
            ]}
            cta="Try free"
            href={routes.landingCta}
          />
          <Plan
            highlight
            name="Plus"
            price="$9/mo"
            features={[
              { text: "Unlimited talk time (no limits)", available: true },
              { text: "Create up to 25 custom AI agents", available: true },
              { text: "Memory: your agents remember past conversations", available: true },
              { text: "Access to premium features and bots", available: true },
              { text: "Share your bots with other users", available: true },
            ]}
            cta="Upgrade"
            href={routes.landingCta}
          />
          <Plan
            name="Pro"
            price="$19/mo"
            features={[
              { text: "Everything in Plus", available: true },
              { text: "Create up to 100 custom AI agents", available: true },
              { text: "Photo sharing", available: true },
              { text: "Video support", available: true },
              { text: "Voice conversations", available: true },
            ]}
            cta="Coming soon"
            href="#"
          />
        </div>
      </Section>

      {/* FAQ */}
      <Section id="faq" className="py-16">
        <div className="mx-auto max-w-3xl">
          <h3 className="text-xl font-bold">FAQ</h3>
          <div className="mt-6 divide-y divide-white/10 rounded-2xl border border-white/10 bg-neutral-900/60">
            {[
              { q: "Можно ли создать своего бота?", a: "Да, в бесплатной версии доступен один кастомный агент. В платных планах можно создавать больше." },
              { q: "Что умеют агенты?", a: "Агенты могут быть другом, учителем, психологом или наставником — ты сам задаёшь их стиль и характер." },
              { q: "Будет ли память?", a: "В бесплатном тарифе память отключена: разговоры сбрасываются. В Plus и выше — память включается по выбору." },
              { q: "Работает на iOS и Android?", a: "Да, веб-версия работает в мобильном браузере. Нативные приложения — скоро." },
              { q: "Можно ли делиться своими агентами?", a: "Да, в тарифе Plus можно делиться созданными агентами с другими пользователями." },
              { q: "Что дальше в планах?", a: "Скоро появится возможность делиться фото и видео, а также полноценные голосовые разговоры." },
              { q: "Что с приватностью?", a: "Вы контролируете память и отправку данных. Никаких скрытых форм и трекинга." },
            ].map((item, idx) => (
              <details key={idx} className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-4 text-sm font-medium text-white/90 hover:bg-white/5">
                  {item.q}
                  <span className="ml-4 text-white/40 group-open:rotate-45">+</span>
                </summary>
                <div className="px-4 pb-4 text-sm text-white/70">{item.a}</div>
              </details>
            ))}
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section id="cta" className="py-16">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#6f2da8] via-fuchsia-500 to-indigo-500 p-8 text-center">
          <div className="mx-auto max-w-2xl">
            <h3 className="text-2xl font-extrabold tracking-tight">
              Ready to create your own AI friend?
            </h3>
            <p className="mt-2 text-white/90">
              Register for free and start building an AI companion who listens, supports, and grows with you.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <a
                href={routes.placeholder}
                className="inline-flex items-center gap-2 rounded-2xl bg-neutral-950 px-5 py-3 text-sm font-semibold hover:bg-neutral-900"
              >
                Sign up free <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href={routes.placeholder}
                className="inline-flex items-center gap-2 rounded-2xl border border-white/20 px-5 py-3 text-sm font-semibold hover:bg-white/10"
              >
                Get the app
              </a>
            </div>
          </div>
        </div>
      </Section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-10">
        <Section className="flex flex-col items-center justify-between gap-6 text-sm text-white/50 md:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#6f2da8] text-xs font-bold">AI</div>
            <span>© {new Date().getFullYear()} AI Pair</span>
          </div>
          <div className="flex items-center gap-6">
            <a href={routes.privacy} className="hover:text-white">Privacy</a>
            <a href={routes.terms} className="hover:text-white">Terms</a>
            <a href={routes.contact} className="hover:text-white">Contact</a>
          </div>
        </Section>
      </footer>

      <AuthPopup
        open={open}
        onClose={() => uiStore.closeAuthPopup()}
        onGoogle={() => handleAuth('google')}
        onApple={() => handleAuth('apple')}
      />
      {showMobileBanner && (
        <div className="fixed inset-x-0 bottom-4 z-50 px-4 md:hidden">
          <div className="mx-auto flex max-w-xl items-center gap-3 rounded-3xl border border-white/15 bg-neutral-900/95 p-3 shadow-2xl shadow-black/40 backdrop-blur">
            <Button
              type="button"
              onClick={() => uiStore.dismissMobileBanner()}
              variant="mobileClose"
              aria-label="Dismiss mobile banner"
            >
              <X className="h-4 w-4" />
            </Button>
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-[#6f2da8] text-lg font-semibold text-white">
              t
            </div>
            <div className="flex flex-1 flex-col text-left">
              <span className="text-sm font-semibold text-white">Download Talkie</span>
              <span className="text-xs text-white/60">For full features and a superior experience.</span>
            </div>
            <a
              href={routes.placeholder}
              className="inline-flex items-center rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-neutral-900 shadow-sm hover:bg-white/90"
            >
              Get
            </a>
          </div>
        </div>
      )}
    </div>
  );
}


function Feature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="group rounded-2xl border border-white/10 bg-neutral-900/60 p-5 hover:border-white/20">
      <div className="mb-2 inline-flex items-center gap-2 text-white/90">
        <span className="rounded-lg bg-[#6f2da8]/15 p-2 ring-1 ring-[#6f2da8]/20">{icon}</span>
        <span className="font-semibold">{title}</span>
      </div>
      <p className="text-sm text-white/70">{desc}</p>
    </div>
  );
}

function Plan({
  name,
  price,
  features,
  cta,
  highlight,
  href,
}: {
  name: string;
  price: string;
  features: { text: string; available: boolean }[];
  cta: string;
  highlight?: boolean;
  href: string;
}) {
  return (
    <div
      className={`relative rounded-2xl border p-6 ${highlight
        ? "border-[#6f2da8] bg-[#6f2da8]/5"
        : "border-white/10 bg-neutral-900/60"
        }`}
    >
      {highlight && (
        <span className="absolute -top-2 right-4 rounded-full bg-[#6f2da8] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
          Popular
        </span>
      )}
      <h4 className="text-lg font-bold text-white/90">{name}</h4>
      <div className="mt-1 text-3xl font-extrabold text-white">
        {price}
        <span className="ml-1 align-top text-xs font-medium text-white/50">
          USD
        </span>
      </div>
      <ul className="mt-4 space-y-2 text-sm text-white/80">
        {features.map((f, idx) => (
          <li key={idx} className="flex items-start gap-2">
            {f.available ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 text-white/60" />
            ) : (
              <XCircle className="mt-0.5 h-4 w-4 text-white/40" />
            )}
            {f.text}
          </li>
        ))}
      </ul>
      <a
        href={href}
        className={`mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold ${highlight
          ? "bg-[#6f2da8] text-white hover:opacity-90"
          : "border border-white/15 text-white hover:bg-white/5"
          }`}
      >
        {cta}
      </a>
    </div>
  );
}
