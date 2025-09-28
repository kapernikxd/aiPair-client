'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

const ROUTES = {
  home: '/',
  discover: '/admin',
  createAgent: '/admin/create',
  aiAgentProfile: '/admin/profile/ai-agent',
  userProfile: '/admin/profile/user',
  myProfile: '/admin/profile/my',
  adminRoot: '/admin',
  adminChats: '/admin/chats',
  adminChat: '/admin/chat',
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

export type GetProfile = (id: string) => string;

export function useAuthRoutes() {
  const router = useRouter();

  const goTo = useCallback(
    (route: AuthRouteKey) => {
      router.push(ROUTES[route]);
    },
    [router],
  );

  const getProfile = (userId: string) => `${ROUTES.userProfile}/${userId}`;
  const getAiProfile = (aiId: string) => `${ROUTES.aiAgentProfile}/${aiId}`;

  const goToMyProfile = () => router.push(`${ROUTES.myProfile}`);


  const goToAdmin = useCallback(() => {
    router.push(ROUTES.adminRoot);
  }, [router]);

  return {
    routes: ROUTES,
    goTo,
    getProfile,
    goToMyProfile,
    getAiProfile,
    goToAdmin,
  };
}
