"use client";
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token !== 'admin3974' && pathname !== '/login') {
        router.replace('/login');
      }
      if (token === 'admin3974' && pathname === '/login') {
        router.replace('/');
      }
    }
  }, [router, pathname]);
  return <>{children}</>;
} 