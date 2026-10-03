'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';
import { BrandMark } from '@/components/ui';

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z',
  },
  {
    name: 'New',
    href: '/dashboard/projects/new',
    icon: 'M12 4v16m8-8H4',
    accent: true,
  },
  {
    name: 'Projects',
    href: '/dashboard/projects',
    icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
  },
];

function isActive(pathname: string, href: string) {
  if (href === '/dashboard') return pathname === href;
  if (href === '/dashboard/projects/new') return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavIcon({ path, className }: { path: string; className: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={path} />
    </svg>
  );
}

interface DashboardNavProps {
  children: ReactNode;
}

export function DashboardNav({ children }: DashboardNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  }

  return (
    <>
      {/* Mobile top bar */}
      <header className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-2.5 flex items-center justify-between gap-2">
          <Link href="/dashboard" className="flex items-center gap-2 min-h-[44px]" aria-label="Buildwise home">
            <BrandMark size="sm" />
            <span className="text-lg font-bold text-slate-900">Buildwise</span>
          </Link>
          <button
            onClick={handleSignOut}
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center px-3 text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            Sign out
          </button>
        </div>
      </header>

      {/* Mobile bottom tab bar */}
      <nav
        aria-label="Primary"
        className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10 pb-[env(safe-area-inset-bottom)]"
      >
        <div className="grid grid-cols-3">
          {navigation.map((item) => {
            const active = isActive(pathname, item.href);
            if (item.accent) {
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  aria-label="Create new project"
                  className="flex min-h-[60px] flex-col items-center justify-center gap-0.5 text-xs font-semibold text-amber-700 hover:text-amber-800"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-400 text-slate-900 shadow-sm">
                    <NavIcon path={item.icon} className="h-5 w-5" />
                  </span>
                  {item.name}
                </Link>
              );
            }
            return (
              <Link
                key={item.name}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={`flex min-h-[60px] flex-col items-center justify-center gap-0.5 text-xs font-medium ${
                  active ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <NavIcon path={item.icon} className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 lg:bg-slate-900 lg:z-10">
        <Link href="/dashboard" className="flex items-center gap-2.5 px-5 h-16 border-b border-slate-800">
          <BrandMark size="sm" />
          <span className="text-lg font-bold text-white">Buildwise</span>
        </Link>
        <nav aria-label="Primary" className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navigation
            .filter((item) => !item.accent)
            .map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                    active
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <NavIcon path={item.icon} className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          <Link
            href="/dashboard/projects/new"
            className="mt-2 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold bg-amber-400 text-slate-900 hover:bg-amber-300"
          >
            <NavIcon path="M12 4v16m8-8H4" className="h-5 w-5" />
            New Project
          </Link>
        </nav>
        <div className="p-3 border-t border-slate-800">
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-lg"
          >
            <NavIcon
              path="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              className="h-5 w-5"
            />
            Sign out
          </button>
        </div>
      </aside>

      <div className="lg:pl-64">
        <main className="mx-auto w-full max-w-7xl p-4 pb-28 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </>
  );
}
