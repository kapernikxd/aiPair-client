'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

export function useAuthRoutes() {
  const router = useRouter();

  const goToAdmin = useCallback(() => {
    router.push('/admin');
  }, [router]);

  return {
    goToAdmin,
  };
}
