'use client';

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowRight, Sparkles, PlayCircle, CheckCircle2, X, Brain, Bookmark, MessageSquareHeart, XCircle } from "lucide-react";
import LandingClient from '@/components/LandingClient';
import DeviceMockup from '@/components/DeviceMockup';
import CardRailTwoRows from "@/components/ui/CardRailTwoRows";
import AuthPopup from "@/components/AuthPopup";
import { Button } from "@/components/ui/Button";
import { useAuthRoutes } from "@/helpers/hooks/useAuthRoutes";
import { useRootStore, useStoreData } from "@/stores/StoreProvider";
import { BASE_URL } from "@/helpers/http";
import { Logo } from "@/components/ui/Logo";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { useTranslations } from "@/localization/TranslationProvider";
import { AuthProvider } from "@/types/auth";

// export const metadata = {
//   title: 'AI Pair — Talk with an AI companion',
// }

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
  const profileName = useStoreData(profileStore, (store) => store.profile.username);
  const mainPageBots = useStoreData(aiBotStore, (store) => store.mainPageBots);
  const router = useRouter();
  const [chatLoadingBotId, setChatLoadingBotId] = useState<string | null>(null);
  const { t, tList } = useTranslations();
  const popularLabel = t('landing.pricing.popular', 'Popular');
  const [isPlusUnavailableOpen, setIsPlusUnavailableOpen] = useState(false);

  useEffect(() => {
    if (aiBotStore.mainPageBots.length === 0 && !aiBotStore.isLoadingMainPageBots) {
      void aiBotStore.fetchMainPageBots();
    }
  }, [aiBotStore]);

  const handleAuth = (provider: AuthProvider) => {
    authStore.startAuth(provider);
    const rawProfileName = profileName ?? '';
    const normalizedProfile = rawProfileName.trim().toLowerCase().replace(/\s+/g, '.');
    const fallbackName = rawProfileName.trim() || t('auth.userFallback', 'User');
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
  const handleOpenAuthPopup = useCallback(() => {
    uiStore.openAuthPopup();
  }, [uiStore]);
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
      const chatId = response?._id ?? response?.data?._id;
      if (chatId) {
        router.push(`${routes.adminChat}?chatId=${encodeURIComponent(chatId)}`);
      } else {
        uiStore.showSnackbar(t('landing.errors.chat', 'Failed to open chat. Please try again.'), "error");
      }
    } catch (error) {
      console.error("Failed to open chat with AI bot:", error);
      uiStore.showSnackbar(t('landing.errors.chat', 'Failed to open chat. Please try again.'), "error");
    } finally {
      setChatLoadingBotId(null);
    }
  }, [chatStore, isAuthenticated, router, routes.adminChat, t, uiStore]);
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
          title: fullName || bot.username || t('common.aiAgent', 'AI Agent'),
          views: bot.profession || bot.username,
          hoverText: bot.userBio || bot.details?.intro,
          href: `${routes.aiAgentProfile}/${botId}`,
          onChatNow: () => handleChatNow(botId),
          isChatLoading: chatLoadingBotId === botId,
        } satisfies LandingCardItem;
      });
    }
    return [];
  }, [chatLoadingBotId, handleChatNow, mainPageBots, routes, t]);
  const faqItems = useMemo(
    () => [
      {
        q: t('landing.faq.items.create.question', 'Can I create my own bot?'),
        a: t(
          'landing.faq.items.create.answer',
          'Yes, the free plan includes one custom agent. Paid plans let you create more.',
        ),
      },
      {
        q: t('landing.faq.items.skills.question', 'What can the agents do?'),
        a: t(
          'landing.faq.items.skills.answer',
          'Agents can be a friend, tutor, coach, or mentor — you define their style and personality.',
        ),
      },
      {
        q: t('landing.faq.items.memory.question', 'Will the AI remember our chats?'),
        a: t(
          'landing.faq.items.memory.answer',
          'The free tier has memory disabled, so conversations reset. Plus and higher unlock optional memory.',
        ),
      },
      {
        q: t('landing.faq.items.mobile.question', 'Does it work on iOS and Android?'),
        a: t(
          'landing.faq.items.mobile.answer',
          'Yes, the web app runs in your mobile browser. Native apps are coming soon.',
        ),
      },
      {
        q: t('landing.faq.items.share.question', 'Can I share my agents with others?'),
        a: t(
          'landing.faq.items.share.answer',
          'Yes, the Plus plan lets you share the agents you build with other users.',
        ),
      },
      {
        q: t('landing.faq.items.future.question', 'What features are coming next?'),
        a: t(
          'landing.faq.items.future.answer',
          'Photo and video sharing plus full voice conversations are on the roadmap.',
        ),
      },
      {
        q: t('landing.faq.items.privacy.question', 'How is my privacy protected?'),
        a: t(
          'landing.faq.items.privacy.answer',
          'You control memory and data sharing. No hidden forms or tracking.',
        ),
      },
    ],
    [t],
  );

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <GradientBlob />
      {/* NAV */}
      <nav className="sticky top-0 z-40 border-b border-white/10 bg-neutral-950/70 backdrop-blur">
        <Section className="flex items-center justify-between py-3">
          <Logo />
          <div className="hidden gap-6 text-sm text-white/80 md:flex">
            <a href={routes.landingFeatures} className="hover:text-white">
              {t('landing.nav.features', 'Features')}
            </a>
            <a href={routes.landingDemo} className="hover:text-white">
              {t('landing.nav.demo', 'Demo')}
            </a>
            <a href={routes.landingPricing} className="hover:text-white">
              {t('landing.nav.pricing', 'Pricing')}
            </a>
            <a href={routes.landingFaq} className="hover:text-white">
              {t('landing.nav.faq', 'FAQ')}
            </a>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3">
              <div className="hidden md:inline">
                <LanguageSwitcher />
              </div>
              <Button onClick={handleAccountClick} variant="ghostRounded">
                {isAuthenticated
                  ? authUser?.name ?? profileName
                  : t('common.signIn', 'Sign in')}
              </Button>
            </div>
          </div>
        </Section>
      </nav>

      {/* HERO */}
      <header className="relative">
        <Section className="grid grid-cols-1 items-center gap-10 py-16 md:grid-cols-2 md:py-24">
          <div>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <Badge>{t('landing.hero.badges.customizable', 'Customizable')}</Badge>
              <Badge>{t('landing.hero.badges.realtime', 'Real-time')}</Badge>
              <Badge>{t('landing.hero.badges.private', 'Private')}</Badge>
            </div>
            <LandingClient />

            <blockquote className="mt-5 max-w-xl italic text-white/80">
              {t('landing.hero.testimonial.text', '“It feels like I’m talking to a real friend, not a bot. I never thought AI could remember me like this.”')}
            </blockquote>
            <cite className="mt-2 block text-sm text-white/50">{t('landing.hero.testimonial.author', '— Anna')}</cite>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleOpenAuthPopup}
                className="inline-flex items-center gap-2 rounded-2xl bg-[#6f2da8] px-5 py-3 text-sm font-semibold hover:opacity-90"
              >
                {t('landing.hero.primaryCta', 'Start free')}
                <ArrowRight className="h-4 w-4" />
              </button>
              <a
                href={routes.landingDemo}
                className="inline-flex items-center gap-2 rounded-2xl border border-white/15 px-5 py-3 text-sm font-semibold hover:bg-white/5"
              >
                <PlayCircle className="h-4 w-4" /> {t('landing.hero.watchDemo', 'Watch demo')}
              </a>
            </div>

            <div className="mt-6 text-xs text-white/50">
              {t('landing.hero.availability', 'Available on iOS & Android • Works in the browser')}
            </div>
          </div>

          {/* Device mockup */}
          <DeviceMockup />
        </Section>
      </header>

      {/* SOCIAL PROOF */}
      <Section className="py-8">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-white/50">
          <span>{t('landing.socialProof.creators', 'Trusted by creators & students')}</span>
          <span>•</span>
          <span>{t('landing.socialProof.onboarding', 'Fast onboarding')}</span>
          <span>•</span>
          <span>{t('landing.socialProof.voices', 'Human‑like voices')}</span>
        </div>
      </Section>

      <main className=" text-white p-6">
        <CardRailTwoRows items={cardItems} className="mx-auto max-w-[1200px]" />
      </main>


      {/* FEATURES */}
      <Section id="features" className="py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold">{t('landing.features.title', 'An AI that acts more like a person')}</h2>
          <p className="mt-2 text-white/70">
            {t('landing.features.subtitle', 'Built around values that make conversations feel natural, meaningful, and human.')}
          </p>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
          <Feature
            icon={<MessageSquareHeart className="h-5 w-5" />}
            title={t('landing.features.items.feelsHuman.title', 'Feels human')}
            desc={t('landing.features.items.feelsHuman.desc', 'Speaks with emotion, nuance, and empathy — not just flat responses.')}
          />
          <Feature
            icon={<Bookmark className="h-5 w-5" />}
            title={t('landing.features.items.remembers.title', 'Remembers you')}
            desc={t('landing.features.items.remembers.desc', 'Keeps track of what matters: your name, goals, and past conversations.')}
          />
          <Feature
            icon={<Sparkles className="h-5 w-5" />}
            title={t('landing.features.items.adapts.title', 'Adapts to you')}
            desc={t('landing.features.items.adapts.desc', 'Learns your preferences and adjusts its style to fit your personality.')}
          />
          <Feature
            icon={<Brain className="h-5 w-5" />}
            title={t('landing.features.items.thinks.title', 'Thinks it through')}
            desc={t('landing.features.items.thinks.desc', 'Explains reasoning step by step, like talking with a thoughtful friend.')}
          />
        </div>
      </Section>

      {/* DEMO */}
      <Section id="demo" className="py-16">
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
          <div>
            <h3 className="text-xl font-bold">{t('landing.builder.title', 'Bring any character to life')}</h3>
            <p className="mt-2 max-w-md text-white/70">
              {t('landing.builder.description', 'Create your own AI companion — whether it’s a mentor, a friend, or a completely fictional persona. Customize their traits, style, and the way they interact with you.')}
            </p>
            <ul className="mt-6 space-y-2 text-sm text-white/80">
              {tList('landing.builder.points', [
                'Design personalities that feel unique',
                'Choose how they speak, think, and respond',
                'Role-play with characters from any world you imagine',
              ]).map((x) => (
                <li key={x} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4" /> {x}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <button
                type="button"
                onClick={handleOpenAuthPopup}
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2 text-sm hover:bg-white/5"
              >
                {t('landing.builder.cta', 'Start creating')} <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 p-2">
            <div className="aspect-video w-full rounded-xl bg-neutral-800">
              <div className="flex h-full items-center justify-center text-white/40">
                <Image
                  src="/img/video.gif"
                  alt={t('landing.demo.alt', 'AI character demo')}
                  unoptimized
                  width={960}
                  height={540}
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
          <h3 className="text-xl font-bold">{t('landing.pricing.title', 'Simple pricing')}</h3>
          <p className="mt-2 text-white/70">{t('landing.pricing.subtitle', 'Start free. Upgrade when you need more talk time.')}</p>
        </div>
        <div className="mx-auto mt-8 grid max-w-4xl grid-cols-1 gap-4 md:grid-cols-3">
          <Plan
            name={t('landing.pricing.free.name', 'Free')}
            price="0 /месяц"
            features={[
              { text: t('landing.pricing.free.features.limit', 'Limited daily talk time'), available: true },
              { text: t('landing.pricing.free.features.catalog', 'Chat with 50+ AI agents'), available: true },
              { text: t('landing.pricing.free.features.custom', '1 custom AI agent'), available: true },
              { text: t('landing.pricing.free.features.memory', 'No memory (conversations reset)'), available: false },
              { text: t('landing.pricing.free.features.updates', 'Limited features and updates'), available: false },
            ]}
            cta={t('landing.pricing.free.cta', 'Try free')}
            href={routes.landingCta}
          />
          <Plan
            highlight
            name={t('landing.pricing.plus.name', 'Plus')}
            price="299 /месяц"
            features={[
              { text: t('landing.pricing.plus.features.unlimited', 'Unlimited talk time (no limits)'), available: true },
              { text: t('landing.pricing.plus.features.customAgents', 'Create up to 25 custom AI agents'), available: true },
              { text: t('landing.pricing.plus.features.memory', 'Memory: your agents remember past conversations'), available: true },
              { text: t('landing.pricing.plus.features.premium', 'Access to premium features and bots'), available: true },
              { text: t('landing.pricing.plus.features.share', 'Share your bots with other users'), available: true },
            ]}
            cta={t('landing.pricing.plus.cta', 'Upgrade')}
            href={routes.landingCta}
            popularLabel={popularLabel}
            onClick={() => setIsPlusUnavailableOpen(true)}
          />
          <Plan
            name={t('landing.pricing.pro.name', 'Pro')}
            price="699 /месяц"
            features={[
              { text: t('landing.pricing.pro.features.plus', 'Everything in Plus'), available: true },
              { text: t('landing.pricing.pro.features.customAgents', 'Create up to 100 custom AI agents'), available: true },
              { text: t('landing.pricing.pro.features.photos', 'Photo sharing'), available: true },
              { text: t('landing.pricing.pro.features.video', 'Video support'), available: true },
              { text: t('landing.pricing.pro.features.voice', 'Voice conversations'), available: true },
            ]}
            cta={t('landing.pricing.pro.cta', 'Coming soon')}
            href="#"
          />
        </div>
      </Section>

      {isPlusUnavailableOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
          onClick={() => setIsPlusUnavailableOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="relative w-full max-w-md rounded-2xl border border-white/10 bg-neutral-900 p-6 text-center text-white shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsPlusUnavailableOpen(false)}
              className="absolute right-3 top-3 rounded-full p-1 text-white/60 transition hover:bg-white/10 hover:text-white"
              aria-label={t('landing.pricing.plus.close', 'Close notification')}
            >
              <X className="h-4 w-4" />
            </button>
            <h3 className="text-lg font-semibold">{t('landing.pricing.plus.unavailableTitle', 'Тариф Plus временно недоступен')}</h3>
            <p className="mt-3 text-sm text-white/70">
              {t(
                'landing.pricing.plus.unavailableDescription',
                'Чтобы перейти на тариф, напишите нам на почту aipairpro@yandex.com.'
              )}
            </p>
            <a
              href="mailto:aipairpro@yandex.com"
              className="mt-5 inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-semibold text-neutral-900 transition hover:bg-white/90"
            >
              aipairpro@yandex.com
            </a>
          </div>
        </div>
      )}

      {/* FAQ */}
      <Section id="faq" className="py-16">
        <div className="mx-auto max-w-3xl">
          <h3 className="text-xl font-bold">{t('landing.faq.title', 'FAQ')}</h3>
          <div className="mt-6 divide-y divide-white/10 rounded-2xl border border-white/10 bg-neutral-900/60">
            {faqItems.map((item, idx) => (
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
              {t('landing.cta.title', 'Ready to create your own AI friend?')}
            </h3>
            <p className="mt-2 text-white/90">
              {t('landing.cta.subtitle', 'Register for free and start building an AI companion who listens, supports, and grows with you.')}
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleOpenAuthPopup}
                className="inline-flex items-center gap-2 rounded-2xl bg-neutral-950 px-5 py-3 text-sm font-semibold hover:bg-neutral-900"
              >
                {t('landing.cta.primary', 'Sign up free')} <ArrowRight className="h-4 w-4" />
              </button>
              <a
                href={routes.placeholder}
                className="inline-flex items-center gap-2 rounded-2xl border border-white/20 px-5 py-3 text-sm font-semibold hover:bg-white/10"
              >
                {t('landing.cta.secondary', 'Get the app')}
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
            <span>{t('landing.footer.copyright', `© ${new Date().getFullYear()} AI Pair`)}</span>
          </div>
          <div className="flex items-center gap-6">
            <a href={routes.privacy} className="hover:text-white">{t('landing.footer.privacy', 'Privacy')}</a>
            <a href={routes.terms} className="hover:text-white">{t('landing.footer.terms', 'Terms')}</a>
            <a href={routes.contact} className="hover:text-white">{t('landing.footer.contact', 'Contact')}</a>
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
              aria-label={t('landing.mobile.dismiss', 'Dismiss mobile banner')}
            >
              <X className="h-4 w-4" />
            </Button>
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-[#6f2da8] text-lg font-semibold text-white">
              AI
            </div>
            <div className="flex flex-1 flex-col text-left">
              <span className="text-sm font-semibold text-white">{t('landing.mobile.title', 'Download AiPair')}</span>
              <span className="text-xs text-white/60">{t('landing.mobile.subtitle', 'For full features and a superior experience.')}</span>
            </div>
            <a
              href={routes.placeholder}
              className="inline-flex items-center rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-neutral-900 shadow-sm hover:bg-white/90"
            >
              {t('landing.mobile.cta', 'Get')}
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
  onClick,
  popularLabel,
}: {
  name: string;
  price: string;
  features: { text: string; available: boolean }[];
  cta: string;
  highlight?: boolean;
  href: string;
  onClick?: () => void;
  popularLabel?: string;
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
          {popularLabel ?? 'Popular'}
        </span>
      )}
      <h4 className="text-lg font-bold text-white/90">{name}</h4>
      <div className="mt-1 text-3xl font-extrabold text-white">
        {price}
        <span className="ml-1 align-top text-xs font-medium text-white/50">
          РУБ
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
        onClick={(event) => {
          if (onClick) {
            event.preventDefault();
            onClick();
          }
        }}
      >
        {cta}
      </a>
    </div>
  );
}
