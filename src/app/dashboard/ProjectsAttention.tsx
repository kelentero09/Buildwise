'use client';

import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import { StatusBadge, MarginText, StatIcon } from '@/components/ui';

interface Project {
  id: string;
  name: string;
  client_name: string;
  contract_amount: number;
  status: string;
  start_date: string | null;
  end_date: string | null;
  project_budgets: { materials: number; labor: number; equipment: number; other: number } | null;
  expenses: { amount: number }[];
  payments: { amount: number }[];
}

interface ProjectsAttentionProps {
  projects: Project[];
}

export function ProjectsAttention({ projects }: ProjectsAttentionProps) {
  const attentionProjects = projects
    .map((project) => {
      const estimatedTotal = project.project_budgets
        ? Number(project.project_budgets.materials) +
          Number(project.project_budgets.labor) +
          Number(project.project_budgets.equipment) +
          Number(project.project_budgets.other)
        : 0;
      const actualTotal = project.expenses.reduce(
        (sum, exp) => sum + Number(exp.amount),
        0
      );
      const totalCost = actualTotal > 0 ? actualTotal : estimatedTotal;
      const margin =
        totalCost > 0
          ? ((Number(project.contract_amount) - totalCost) /
              Number(project.contract_amount)) *
            100
          : 100;
      return { project, margin, actualTotal, estimatedTotal };
    })
    .filter((p) => p.margin < 10 && p.project.status !== 'Completed' && p.project.status !== 'Cancelled')
    .sort((a, b) => a.margin - b.margin);

  if (attentionProjects.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl border border-red-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-red-100 bg-red-50">
        <h3 className="text-base font-semibold text-red-800 flex items-center gap-2">
          <StatIcon name="warning" className="h-5 w-5 shrink-0" />
          Projects Needing Attention
        </h3>
        <p className="text-sm text-red-600 mt-1">
          {attentionProjects.length} project{attentionProjects.length !== 1 ? 's' : ''} with margin below 10%
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[620px]">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Project
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Client
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Margin
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Actual vs Est. Cost
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {attentionProjects.slice(0, 5).map(({ project, margin, actualTotal, estimatedTotal }) => (
              <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 min-w-[160px]">
                  <Link
                    href={`/dashboard/projects/${project.id}`}
                    className="font-medium text-gray-900 hover:text-blue-600"
                  >
                    {project.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{project.client_name}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={project.status} />
                </td>
                <td className="px-4 py-3">
                  <MarginText value={margin} />
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                  {actualTotal > 0
                    ? `${formatCurrency(actualTotal)} / ${formatCurrency(estimatedTotal)}`
                    : `Est. ${formatCurrency(estimatedTotal)}`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {attentionProjects.length > 5 && (
        <div className="p-4 border-t border-gray-200 text-center">
          <Link
            href="/dashboard/projects"
            className="text-sm text-blue-600 hover:text-blue-500 font-medium"
          >
            View all {attentionProjects.length} projects needing attention
          </Link>
        </div>
      )}
    </div>
  );
}