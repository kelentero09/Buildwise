import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth';
import Link from 'next/link';
import { DashboardStats } from './DashboardStats';
import { ProjectsList } from './ProjectsList';
import { ProjectsAttention } from './ProjectsAttention';
import { PageHeader } from '@/components/ui';

export default async function DashboardPage() {
  const user = await requireAuth();
  const supabase = await createClient();

  const { data: projects } = await supabase
    .from('projects')
    .select(`
      *,
      project_budgets (*),
      expenses (amount),
      payments (amount)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6 animate-enter">
      <PageHeader
        title="Dashboard"
        subtitle="Your jobs, money in, and money out — at a glance"
        action={
          <Link
            href="/dashboard/projects/new"
            className="hidden lg:inline-flex min-h-[44px] items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Project
          </Link>
        }
      />

      <DashboardStats projects={projects || []} />

      <ProjectsAttention projects={projects || []} />

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Recent Projects</h3>
          <Link href="/dashboard/projects" className="text-sm text-blue-600 hover:text-blue-500">
            View all
          </Link>
        </div>
        <ProjectsList projects={projects || []} limit={5} />
      </div>
    </div>
  );
}