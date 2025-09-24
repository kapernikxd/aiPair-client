'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

const ROUTES = {
  home: '/',
  discover: '/',
  createAgent: '/create',
  aiAgentProfile: '/profile/ai-agent',
  userProfile: '/profile/user',
  adminRoot: '/admin',
  adminChats: '/admin/chats',
  adminChat: '/admin/chat',
  chatEmily: '/chat/emily',
  chatTristan: '/chat/tristan',
  landingFeatures: '#features',
  landingDemo: '#demo',
  landingPricing: '#pricing',
  landingFaq: '#faq',
  landingCta: '#cta',
  terms: '#',
  privacy: '#',
  contact: '#',
  placeholder: '#',
} as const;

export type AuthRoutes = typeof ROUTES;
export type AuthRouteKey = keyof AuthRoutes;

export function useAuthRoutes() {
  const router = useRouter();

  const goTo = useCallback(
    (route: AuthRouteKey) => {
      router.push(ROUTES[route]);
    },
    [router],
  );

  const goToAdmin = useCallback(() => {
    router.push(ROUTES.adminRoot);
  }, [router]);

  return {
    routes: ROUTES,
    goTo,
    goToAdmin,
  };
}
