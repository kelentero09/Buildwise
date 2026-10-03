'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { SignupForm } from './SignupForm';
import { BrandMark, Spinner } from '@/components/ui';

export default function SignupPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 px-4 py-12">
      <Link href="/" className="mb-6 flex items-center gap-2.5 min-h-[44px]" aria-label="Buildwise home">
        <BrandMark />
        <span className="text-xl font-bold text-white">Buildwise</span>
      </Link>
      <Suspense fallback={<Spinner label="Loading..." />}>
        <SignupForm />
      </Suspense>
      <p className="mt-6 text-center text-sm text-slate-400">
        Built for contractors who want to know their real profit
      </p>
    </div>
  );
}
