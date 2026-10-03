import { getUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { BrandMark } from '@/components/ui';

const features = [
  {
    title: 'Track Budgets',
    text: 'Set estimated costs for materials, labor, equipment, and other expenses per project.',
    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    tint: 'bg-amber-100 text-amber-700',
  },
  {
    title: 'Record Expenses',
    text: 'Log actual site expenses by category and compare against your budget in real time.',
    icon: 'M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z',
    tint: 'bg-blue-100 text-blue-700',
  },
  {
    title: 'Monitor Payments',
    text: 'Track client collections and see the remaining balance on every job at a glance.',
    icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z',
    tint: 'bg-green-100 text-green-700',
  },
];

export default async function HomePage() {
  const user = await getUser();

  if (user) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-2">
          <Link href="/" className="flex items-center gap-2 min-h-[44px]" aria-label="Buildwise home">
            <BrandMark size="sm" />
            <span className="text-xl font-bold text-slate-900">Buildwise</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/login"
              className="inline-flex min-h-[44px] items-center px-3 text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="inline-flex min-h-[44px] items-center px-4 py-2 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-800"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 py-14 sm:py-20 text-center">
            <p className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-400/15 text-amber-300 text-xs font-semibold uppercase tracking-wider">
              Built for small contractors
            </p>
            <h1 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight max-w-3xl mx-auto">
              Know if you&apos;re making money on every project
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto">
              Buildwise helps small contractors track project budgets, expenses, and payments
              so you always know your actual profit — not just your estimated profit.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/signup"
                className="inline-flex min-h-[52px] items-center justify-center px-8 py-3 bg-amber-400 text-slate-900 font-bold rounded-lg hover:bg-amber-300 text-center shadow-sm"
              >
                Start Free
              </Link>
              <Link
                href="/login"
                className="inline-flex min-h-[52px] items-center justify-center px-8 py-3 border border-slate-600 text-white font-semibold rounded-lg hover:bg-slate-800 text-center"
              >
                Sign In
              </Link>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
          <div className="max-w-2xl">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Everything a small contractor needs, nothing it doesn&apos;t
            </h2>
            <p className="mt-2 text-gray-600">
              Simple tools for the job site office — usable from a phone between site visits.
            </p>
          </div>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature) => (
              <div key={feature.title} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <span className={`inline-flex h-11 w-11 items-center justify-center rounded-lg ${feature.tint}`}>
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                  </svg>
                </span>
                <h3 className="mt-4 font-semibold text-gray-900">{feature.title}</h3>
                <p className="mt-1.5 text-gray-600 text-sm leading-relaxed">{feature.text}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-gray-200 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="flex items-center gap-2">
            <BrandMark size="sm" />
            <span className="font-bold text-slate-900">Buildwise</span>
          </span>
          <p className="text-center text-sm text-gray-500">
            Built for small contractors in the Philippines
          </p>
        </div>
      </footer>
    </div>
  );
}
