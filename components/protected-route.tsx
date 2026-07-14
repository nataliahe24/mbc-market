'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';

interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  redirectTo = '/admin-login',
}: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function validateSession() {
      try {
        const res = await fetch('/api/admin/me', {
          method: 'GET',
          credentials: 'same-origin',
          cache: 'no-store',
        });

        if (cancelled) return;

        if (res.ok) {
          setAuthorized(true);
          setChecking(false);
          return;
        }

        const nextPath = pathname && pathname !== '/admin'
          ? pathname
          : '/admin';

        const target = `${redirectTo}?next=${encodeURIComponent(nextPath)}`;
        router.replace(target);
      } catch {
        if (!cancelled) {
          const nextPath = pathname && pathname !== '/admin'
            ? pathname
            : '/admin';
          router.replace(`${redirectTo}?next=${encodeURIComponent(nextPath)}`);
        }
      } finally {
        if (!cancelled) {
          setChecking(false);
        }
      }
    }

    validateSession();

    return () => {
      cancelled = true;
    };
  }, [pathname, redirectTo, router]);

  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        window.location.reload();
      }
    };

    window.addEventListener('pageshow', handlePageShow);

    return () => {
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, []);

  if (checking) {
    return null;
  }

  if (!authorized) {
    return null;
  }

  return <>{children}</>;
}
