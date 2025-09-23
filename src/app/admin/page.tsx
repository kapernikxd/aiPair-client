'use client';

import React, { useState } from "react";
import CardRailTwoRows from "@/components/CardRailTwoRows";
import AppShell from "@/components/AppShell";

// export const metadata = {
//   title: 'AI Pair — Talk with an AI companion',
// }

const data = [
  { id: 1, cardWidth: "200", src: '/img/mizuhara.png', title: 'Emily', views: '1.2K', hoverText: 'Your little sister...', href: '/admin/chat' },
  { id: 2, src: '/img/mizuhara_chizuru_by_ppxd6049_dgcf97z-fullview.jpg', title: 'Tristan', views: '932', hoverText: 'Sirens — everyone has one...', href: '/admin/chat' },
  { id: 3, src: '/img/mizuhara.png', title: 'Emily', views: '1.2K', hoverText: 'Your little sister...', href: '/admin/chat' },
  { id: 4, src: '/img/mizuhara_chizuru_by_ppxd6049_dgcf97z-fullview.jpg', title: 'Tristan', views: '932', hoverText: 'Sirens — everyone has one...', href: '/admin/chat' },
  { id: 5, src: '/img/mizuhara.png', title: 'Emily', views: '1.2K', hoverText: 'Your little sister...', href: '/admin/chat' },
  { id: 6, src: '/img/mizuhara_chizuru_by_ppxd6049_dgcf97z-fullview.jpg', title: 'Tristan', views: '932', hoverText: 'Sirens — everyone has one...', href: '/admin/chat' },
  { id: 7, src: '/img/mizuhara.png', title: 'Emily', views: '1.2K', hoverText: 'Your little sister...', href: '/admin/chat' },
  { id: 8, src: '/img/mizuhara_chizuru_by_ppxd6049_dgcf97z-fullview.jpg', title: 'Tristan', views: '932', hoverText: 'Sirens — everyone has one...', href: '/admin/chat' },
  { id: 9, src: '/img/mizuhara.png', title: 'Emily', views: '1.2K', hoverText: 'Your little sister...', href: '/admin/chat' },
  { id: 10, src: '/img/mizuhara_chizuru_by_ppxd6049_dgcf97z-fullview.jpg', title: 'Tristan', views: '932', hoverText: 'Sirens — everyone has one...', href: '/admin/chat' },
  { id: 11, src: '/img/mizuhara.png', title: 'Emily', views: '1.2K', hoverText: 'Your little sister...', href: '/admin/chat' },
  { id: 12, src: '/img/mizuhara_chizuru_by_ppxd6049_dgcf97z-fullview.jpg', title: 'Tristan', views: '932', hoverText: 'Sirens — everyone has one...', href: '/admin/chat' },
  { id: 13, src: '/img/mizuhara.png', title: 'Emily', views: '1.2K', hoverText: 'Your little sister...', href: '/admin/chat' },
  { id: 14, src: '/img/mizuhara_chizuru_by_ppxd6049_dgcf97z-fullview.jpg', title: 'Tristan', views: '932', hoverText: 'Sirens — everyone has one...', href: '/admin/chat' },
  { id: 15, src: '/img/mizuhara.png', title: 'Emily', views: '1.2K', hoverText: 'Your little sister...', href: '/admin/chat' },
  { id: 16, src: '/img/mizuhara_chizuru_by_ppxd6049_dgcf97z-fullview.jpg', title: 'Tristan', views: '932', hoverText: 'Sirens — everyone has one...', href: '/admin/chat' },
  { id: 17, src: '/img/mizuhara.png', title: 'Emily', views: '1.2K', hoverText: 'Your little sister...', href: '/admin/chat' },
  { id: 18, src: '/img/mizuhara_chizuru_by_ppxd6049_dgcf97z-fullview.jpg', title: 'Tristan', views: '932', hoverText: 'Sirens — everyone has one...', href: '/admin/chat' },
  { id: 19, src: '/img/mizuhara.png', title: 'Emily', views: '1.2K', hoverText: 'Your little sister...', href: '/admin/chat' },
  { id: 20, src: '/img/mizuhara_chizuru_by_ppxd6049_dgcf97z-fullview.jpg', title: 'Tristan', views: '932', hoverText: 'Sirens — everyone has one...', href: '/admin/chat' },
  { id: 21, src: '/img/mizuhara.png', title: 'Emily', views: '1.2K', hoverText: 'Your little sister...', href: '/admin/chat' },
  { id: 22, src: '/img/mizuhara_chizuru_by_ppxd6049_dgcf97z-fullview.jpg', title: 'Tristan', views: '932', hoverText: 'Sirens — everyone has one...', href: '/admin/chat' },
  // ...добавляй дальше сколько нужно
];

// Tailwind is assumed available in the preview. Primary brand color from your prefs: #6f2da8
// Minimalistic, fast, single-file landing you can paste into a Next.js page or CRA component.
// Sections: Nav, Hero, SocialProof, Features, Demo, Pricing, FAQ, Footer.

export default function Landing() {
  return (
    <AppShell>
      {/* любой контент справа */}
      <div className="p-0 m-0 h-full overflow-y-auto">
      <CardRailTwoRows items={data} className="mx-auto max-w-[1400px]" />
      <CardRailTwoRows items={data} className="mx-auto max-w-[1400px]" />
      <CardRailTwoRows items={data} className="mx-auto max-w-[1400px]" />
      <CardRailTwoRows items={data} className="mx-auto max-w-[1400px]" />
      </div>
    </AppShell>
  )
}
