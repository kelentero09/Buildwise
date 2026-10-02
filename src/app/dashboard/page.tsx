import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth';
import Link from 'next/link';
import { DashboardStats } from './DashboardStats';
import { ProjectsList } from './ProjectsList';
import { ProjectsAttention } from './ProjectsAttention';

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
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Dashboard</h2>
        <p className="text-gray-600 text-sm">Overview of your projects</p>
      </div>

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