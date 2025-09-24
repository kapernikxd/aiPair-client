'use client';

import React, { useMemo, useState } from "react";
import { ArrowRight, Mic, Sparkles, Shield, Globe2, PlayCircle, CheckCircle2, X } from "lucide-react";
import LandingClient from '@/components/LandingClient';
import DeviceMockup from '@/components/DeviceMockup';
import CardRailTwoRows from "@/components/CardRailTwoRows";
import AuthPopup from "@/components/AuthPopup";
import { useAuthRoutes } from "@/hooks/useAuthRoutes";
import type { AuthRouteKey } from "@/hooks/useAuthRoutes";

// export const metadata = {
//   title: 'AI Pair — Talk with an AI companion',
// }

type CardItem = {
  id: number;
  cardWidth?: string;
  src: string;
  title: string;
  views: string;
  hoverText: string;
  routeKey: AuthRouteKey;
};

const baseCardData: CardItem[] = [
  { id: 0, cardWidth: "200", src: '/img/mizuhara.png', title: 'aiAgent α', views: 'New', hoverText: 'Meet the undercover strategist.', routeKey: 'aiAgentProfile' },
  { id: 1, cardWidth: "200", src: '/img/mizuhara.png', title: 'Emily', views: '1.2K', hoverText: 'Your little sister...', routeKey: 'chatEmily' },
  { id: 2, src: '/img/mizuhara_chizuru_by_ppxd6049_dgcf97z-fullview.jpg', title: 'Tristan', views: '932', hoverText: 'Sirens — everyone has one...', routeKey: 'chatTristan' },
  { id: 3, src: '/img/mizuhara.png', title: 'Emily', views: '1.2K', hoverText: 'Your little sister...', routeKey: 'chatEmily' },
  { id: 4, src: '/img/mizuhara_chizuru_by_ppxd6049_dgcf97z-fullview.jpg', title: 'Tristan', views: '932', hoverText: 'Sirens — everyone has one...', routeKey: 'chatTristan' },
  { id: 5, src: '/img/mizuhara.png', title: 'Emily', views: '1.2K', hoverText: 'Your little sister...', routeKey: 'chatEmily' },
  { id: 6, src: '/img/mizuhara_chizuru_by_ppxd6049_dgcf97z-fullview.jpg', title: 'Tristan', views: '932', hoverText: 'Sirens — everyone has one...', routeKey: 'chatTristan' },
  { id: 7, src: '/img/mizuhara.png', title: 'Emily', views: '1.2K', hoverText: 'Your little sister...', routeKey: 'chatEmily' },
  { id: 8, src: '/img/mizuhara_chizuru_by_ppxd6049_dgcf97z-fullview.jpg', title: 'Tristan', views: '932', hoverText: 'Sirens — everyone has one...', routeKey: 'chatTristan' },
  { id: 9, src: '/img/mizuhara.png', title: 'Emily', views: '1.2K', hoverText: 'Your little sister...', routeKey: 'chatEmily' },
  { id: 10, src: '/img/mizuhara_chizuru_by_ppxd6049_dgcf97z-fullview.jpg', title: 'Tristan', views: '932', hoverText: 'Sirens — everyone has one...', routeKey: 'chatTristan' },
  { id: 11, src: '/img/mizuhara.png', title: 'Emily', views: '1.2K', hoverText: 'Your little sister...', routeKey: 'chatEmily' },
  { id: 12, src: '/img/mizuhara_chizuru_by_ppxd6049_dgcf97z-fullview.jpg', title: 'Tristan', views: '932', hoverText: 'Sirens — everyone has one...', routeKey: 'chatTristan' },
  { id: 13, src: '/img/mizuhara.png', title: 'Emily', views: '1.2K', hoverText: 'Your little sister...', routeKey: 'chatEmily' },
  { id: 14, src: '/img/mizuhara_chizuru_by_ppxd6049_dgcf97z-fullview.jpg', title: 'Tristan', views: '932', hoverText: 'Sirens — everyone has one...', routeKey: 'chatTristan' },
  { id: 15, src: '/img/mizuhara.png', title: 'Emily', views: '1.2K', hoverText: 'Your little sister...', routeKey: 'chatEmily' },
  { id: 16, src: '/img/mizuhara_chizuru_by_ppxd6049_dgcf97z-fullview.jpg', title: 'Tristan', views: '932', hoverText: 'Sirens — everyone has one...', routeKey: 'chatTristan' },
  { id: 17, src: '/img/mizuhara.png', title: 'Emily', views: '1.2K', hoverText: 'Your little sister...', routeKey: 'chatEmily' },
  { id: 18, src: '/img/mizuhara_chizuru_by_ppxd6049_dgcf97z-fullview.jpg', title: 'Tristan', views: '932', hoverText: 'Sirens — everyone has one...', routeKey: 'chatTristan' },
  { id: 19, src: '/img/mizuhara.png', title: 'Emily', views: '1.2K', hoverText: 'Your little sister...', routeKey: 'chatEmily' },
  { id: 20, src: '/img/mizuhara_chizuru_by_ppxd6049_dgcf97z-fullview.jpg', title: 'Tristan', views: '932', hoverText: 'Sirens — everyone has one...', routeKey: 'chatTristan' },
  { id: 21, src: '/img/mizuhara.png', title: 'Emily', views: '1.2K', hoverText: 'Your little sister...', routeKey: 'chatEmily' },
  { id: 22, src: '/img/mizuhara_chizuru_by_ppxd6049_dgcf97z-fullview.jpg', title: 'Tristan', views: '932', hoverText: 'Sirens — everyone has one...', routeKey: 'chatTristan' },
  // ...добавляй дальше сколько нужно
];

// Tailwind is assumed available in the preview. Primary brand color from your prefs: #6f2da8
// Minimalistic, fast, single-file landing you can paste into a Next.js page or CRA component.
// Sections: Nav, Hero, SocialProof, Features, Demo, Pricing, FAQ, Footer.

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
  const { routes } = useAuthRoutes();
  const [open, setOpen] = useState(false);
  const [showMobileBanner, setShowMobileBanner] = useState(true);
  const cardItems = useMemo(
    () =>
      baseCardData.map(({ routeKey, ...rest }) => ({
        ...rest,
        href: routes[routeKey],
      })),
    [routes],
  );

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <GradientBlob />
      {/* NAV */}
      <nav className="sticky top-0 z-40 border-b border-white/10 bg-neutral-950/70 backdrop-blur">
        <Section className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#6f2da8] font-bold">AI</div>
            <div className="text-sm text-white/70">by <span className="font-semibold text-white">Freudly‑style</span></div>
          </div>
          <div className="hidden gap-6 text-sm text-white/80 md:flex">
            <a href={routes.aiAgentProfile} className="hover:text-white">aiAgent α</a>
            <a href={routes.landingFeatures} className="hover:text-white">Features</a>
            <a href={routes.landingDemo} className="hover:text-white">Demo</a>
            <a href={routes.landingPricing} className="hover:text-white">Pricing</a>
            <a href={routes.landingFaq} className="hover:text-white">FAQ</a>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setOpen(true)} className="hidden rounded-xl border border-white/15 px-4 py-2 text-sm text-white/90 hover:bg-white/5 md:inline">
              Sign in
            </button>
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
              <Badge>Voice‑first</Badge>
              <Badge>Real‑time</Badge>
              <Badge>Private</Badge>
            </div>
            <LandingClient />
            <p className="mt-5 max-w-xl text-white/70">
              A simplified, fast landing inspired by Talkie. Speak naturally, get instant responses, and feel supported—anytime, anywhere.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a href={routes.landingCta} className="inline-flex items-center gap-2 rounded-2xl bg-[#6f2da8] px-5 py-3 text-sm font-semibold hover:opacity-90">
                Start free
                <ArrowRight className="h-4 w-4" />
              </a>
              <a href={routes.landingDemo} className="inline-flex items-center gap-2 rounded-2xl border border-white/15 px-5 py-3 text-sm font-semibold hover:bg-white/5">
                <PlayCircle className="h-4 w-4" /> Watch demo
              </a>
              <Pill><Mic className="h-3.5 w-3.5" /> No signup required</Pill>
            </div>
            <div className="mt-6 text-xs text-white/50">Available on iOS & Android • Works in the browser</div>
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
          <h2 className="text-2xl font-bold">Everything you need to start talking</h2>
          <p className="mt-2 text-white/70">Clean, focused, and built for conversion.</p>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
          <Feature icon={<Mic className="h-5 w-5" />} title="Live voice" desc="Low‑latency, full‑duplex conversation that feels natural." />
          <Feature icon={<Globe2 className="h-5 w-5" />} title="On‑the‑go" desc="Works in the browser; apps for iOS/Android coming soon." />
          <Feature icon={<Sparkles className="h-5 w-5" />} title="Smart memory" desc="Opt‑in recall for names, goals, and preferences." />
          <Feature icon={<Shield className="h-5 w-5" />} title="Private by design" desc="Local controls and transparent data settings." />
        </div>
      </Section>

      {/* DEMO */}
      <Section id="demo" className="py-16">
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
          <div>
            <h3 className="text-xl font-bold">See it in action</h3>
            <p className="mt-2 max-w-md text-white/70">
              Press play to watch a 60‑second walkthrough: starting a conversation, pausing, and setting a goal.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-white/80">
              {[
                "Instant mic start (no forms)",
                "Human‑like responses",
                "Goal‑focused tips",
              ].map((x) => (
                <li key={x} className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4" /> {x}</li>
              ))}
            </ul>
            <div className="mt-8">
              <a href={routes.landingPricing} className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2 text-sm hover:bg-white/5">
                View pricing <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 p-2">
            <div className="aspect-video w-full rounded-xl bg-neutral-800">
              <div className="flex h-full items-center justify-center text-white/40">
                <PlayCircle className="mr-2 h-6 w-6" /> Demo video placeholder
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
            features={["5 min/day", "Core voices", "Web access"]}
            cta="Try now"
            href={routes.landingCta}
          />
          <Plan
            highlight
            name="Plus"
            price="$9/mo"
            features={["Unlimited talk", "Premium voices", "Priority latency"]}
            cta="Upgrade"
            href={routes.landingCta}
          />
          <Plan
            name="Pro"
            price="$19/mo"
            features={["Everything in Plus", "Memory opt‑in", "Early features"]}
            cta="Go Pro"
            href={routes.landingCta}
          />
        </div>
      </Section>

      {/* FAQ */}
      <Section id="faq" className="py-16">
        <div className="mx-auto max-w-3xl">
          <h3 className="text-xl font-bold">FAQ</h3>
          <div className="mt-6 divide-y divide-white/10 rounded-2xl border border-white/10 bg-neutral-900/60">
            {[
              { q: "Нужно ли регистрироваться?", a: "Нет. Можно сразу нажать на микрофон и начать разговор в браузере." },
              { q: "Работает на iOS и Android?", a: "Да, веб‑версия работает в мобильном браузере. Нативные приложения — скоро." },
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
            <h3 className="text-2xl font-extrabold tracking-tight">Ready to talk?</h3>
            <p className="mt-2 text-white/90">Open the mic and try a 30‑second conversation. No email required.</p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <a href={routes.placeholder} className="inline-flex items-center gap-2 rounded-2xl bg-neutral-950 px-5 py-3 text-sm font-semibold hover:bg-neutral-900">
                Open in browser <ArrowRight className="h-4 w-4" />
              </a>
              <a href={routes.placeholder} className="inline-flex items-center gap-2 rounded-2xl border border-white/20 px-5 py-3 text-sm font-semibold hover:bg-white/10">
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
        onClose={() => setOpen(false)}
        onGoogle={() => console.log('google')}
        onApple={() => console.log('apple')}
      />
      {showMobileBanner && (
        <div className="fixed inset-x-0 bottom-4 z-50 px-4 md:hidden">
          <div className="mx-auto flex max-w-xl items-center gap-3 rounded-3xl border border-white/15 bg-neutral-900/95 p-3 shadow-2xl shadow-black/40 backdrop-blur">
            <button
              type="button"
              onClick={() => setShowMobileBanner(false)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-white/50 hover:bg-white/10 hover:text-white"
              aria-label="Dismiss mobile banner"
            >
              <X className="h-4 w-4" />
            </button>
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

function Plan({ name, price, features, cta, highlight, href }: { name: string; price: string; features: string[]; cta: string; highlight?: boolean; href: string }) {
  return (
    <div className={`relative rounded-2xl border p-6 ${highlight ? "border-[#6f2da8] bg-[#6f2da8]/5" : "border-white/10 bg-neutral-900/60"}`}>
      {highlight && <span className="absolute -top-2 right-4 rounded-full bg-[#6f2da8] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">Popular</span>}
      <h4 className="text-lg font-bold text-white/90">{name}</h4>
      <div className="mt-1 text-3xl font-extrabold text-white">
        {price}
        <span className="ml-1 align-top text-xs font-medium text-white/50">USD</span>
      </div>
      <ul className="mt-4 space-y-2 text-sm text-white/80">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4" /> {f}</li>
        ))}
      </ul>
      <a href={href} className={`mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold ${highlight ? "bg-[#6f2da8] text-white hover:opacity-90" : "border border-white/15 text-white hover:bg-white/5"}`}>
        {cta}
      </a>
    </div>
  );
}
