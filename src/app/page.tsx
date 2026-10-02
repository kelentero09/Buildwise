import { getUser } from '@/lib/auth';
import Link from 'next/link';

export default async function HomePage() {
  const user = await getUser();

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <h1 className="text-3xl font-semibold text-gray-900 mb-4">Welcome back!</h1>
          <p className="text-gray-600 mb-8">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">Buildwise</h1>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">
              Sign in
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-3xl w-full text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Know if you&apos;re making money on every project
          </h2>
          <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
            Buildwise helps small contractors track project budgets, expenses, and payments
            so you always know your actual profit — not just your estimated profit.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="px-8 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 text-center"
            >
              Start Free
            </Link>
            <Link
              href="/login"
              className="px-8 py-3 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 text-center"
            >
              Sign In
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Track Budgets</h3>
              <p className="text-gray-600 text-sm">
                Set estimated costs for materials, labor, equipment, and other expenses per project.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Record Expenses</h3>
              <p className="text-gray-600 text-sm">
                Log actual expenses by category and compare against your budget in real time.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Monitor Payments</h3>
              <p className="text-gray-600 text-sm">
                Track client payments and see remaining balance at a glance.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-8 px-4">
        <p className="text-center text-sm text-gray-500">
          Built for small contractors in the Philippines
        </p>
      </footer>
    </div>
  );
}