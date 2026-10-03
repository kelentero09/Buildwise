import Link from 'next/link';
import type { ReactNode } from 'react';

/* Shared presentational primitives. No data fetching, no new dependencies. */

const statusStyles: Record<string, string> = {
  Planning: 'bg-amber-100 text-amber-800',
  Active: 'bg-blue-100 text-blue-800',
  Completed: 'bg-green-100 text-green-800',
  Cancelled: 'bg-gray-100 text-gray-800',
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap px-2.5 py-1 text-xs font-semibold rounded-full ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}
    >
      <span
        aria-hidden="true"
        className={`mr-1.5 h-1.5 w-1.5 rounded-full bg-current`}
      />
      {status}
    </span>
  );
}

export function marginTone(margin: number): 'negative' | 'warning' | 'positive' {
  if (margin < 0) return 'negative';
  if (margin < 10) return 'warning';
  return 'positive';
}

const marginTextStyles = {
  negative: 'text-red-600',
  warning: 'text-amber-700',
  positive: 'text-green-600',
} as const;

export function MarginText({ value }: { value: number }) {
  return (
    <span className={`font-semibold whitespace-nowrap ${marginTextStyles[marginTone(value)]}`}>
      {value.toFixed(1)}%
    </span>
  );
}

const iconPaths: Record<string, string> = {
  projects: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
  contract: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  received: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z',
  expenses: 'M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z',
  profit: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
  warning: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
};

export function StatIcon({ name, className = 'h-5 w-5' }: { name: keyof typeof iconPaths | string; className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={iconPaths[name] || iconPaths.projects} />
    </svg>
  );
}

const statTones = {
  default: 'bg-blue-100 text-blue-700',
  positive: 'bg-green-100 text-green-700',
  negative: 'bg-red-100 text-red-700',
  warning: 'bg-amber-100 text-amber-700',
} as const;

type StatTone = keyof typeof statTones;

const statValueTones = {
  default: 'text-gray-900',
  positive: 'text-green-600',
  negative: 'text-red-600',
  warning: 'text-amber-700',
} as const;

export function StatCard({
  label,
  value,
  sub,
  icon,
  tone = 'default',
  valueTone = 'default',
}: {
  label: string;
  value: string;
  sub?: string;
  icon?: string;
  tone?: StatTone;
  valueTone?: StatTone;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 overflow-hidden">
      <div className="flex items-center gap-2.5">
        {icon && (
          <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${statTones[tone]}`}>
            <StatIcon name={icon} />
          </span>
        )}
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 leading-snug">{label}</p>
      </div>
      <p className={`mt-2 text-base sm:text-xl font-bold whitespace-nowrap ${statValueTones[valueTone]}`}>{value}</p>
      {sub && <p className="mt-0.5 text-xs text-gray-500">{sub}</p>}
    </div>
  );
}

export function ProgressBar({
  percent,
  tone = 'default',
  label,
}: {
  percent: number;
  tone?: StatTone;
  label?: string;
}) {
  const clamped = Math.min(100, Math.max(0, percent));
  const barStyles = {
    default: 'bg-blue-600',
    positive: 'bg-green-600',
    negative: 'bg-red-600',
    warning: 'bg-amber-500',
  } as const;
  return (
    <div>
      {label && (
        <div className="mb-1.5 flex items-center justify-between gap-2 text-sm">
          <span className="text-gray-600">{label}</span>
          <span className="font-semibold text-gray-900 whitespace-nowrap">{clamped.toFixed(0)}%</span>
        </div>
      )}
      <div
        className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100"
        role="progressbar"
        aria-valuenow={Math.round(clamped)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className={`h-full rounded-full ${barStyles[tone]}`} style={{ width: `${clamped}%` }} />
      </div>
    </div>
  );
}

const emptyIcons = {
  projects: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
  expenses: 'M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z',
  payments: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z',
} as const;

export function EmptyState({
  icon = 'projects',
  title,
  hint,
  actionHref,
  actionLabel,
}: {
  icon?: keyof typeof emptyIcons;
  title: string;
  hint: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-dashed border-gray-300 px-6 py-10 text-center">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={emptyIcons[icon]} />
        </svg>
      </span>
      <h3 className="mt-3 text-base font-semibold text-gray-900">{title}</h3>
      <p className="mx-auto mt-1 max-w-sm text-sm text-gray-500">{hint}</p>
      {actionHref && actionLabel && (
        <Link
          href={actionHref}
          className="mt-4 inline-flex min-h-[44px] items-center justify-center px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}

export function BrandMark({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: 'h-8 w-8 text-base',
    md: 'h-9 w-9 text-lg',
    lg: 'h-11 w-11 text-xl',
  } as const;
  return (
    <span
      aria-hidden="true"
      className={`flex ${sizes[size]} shrink-0 items-center justify-center rounded-lg bg-amber-400 font-extrabold text-slate-900 shadow-sm`}
    >
      B
    </span>
  );
}

export function Spinner({ label }: { label: string }) {
  return (
    <div className="py-10 text-center" role="status">
      <svg className="animate-spin h-8 w-8 text-blue-600 mx-auto" fill="none" viewBox="0 0 24 24" aria-hidden="true">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
      <p className="mt-2 text-sm text-gray-600">{label}</p>
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        <p className="mt-0.5 text-sm text-gray-600">{subtitle}</p>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
