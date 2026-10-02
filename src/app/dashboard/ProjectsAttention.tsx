'use client';

import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';

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

const statusColors: Record<string, string> = {
  Planning: 'bg-yellow-100 text-yellow-800',
  Active: 'bg-blue-100 text-blue-800',
  Completed: 'bg-green-100 text-green-800',
  Cancelled: 'bg-gray-100 text-gray-800',
};

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
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200 bg-red-50">
        <h3 className="text-lg font-medium text-red-800 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Projects Needing Attention
        </h3>
        <p className="text-sm text-red-600 mt-1">
          {attentionProjects.length} project{attentionProjects.length !== 1 ? 's' : ''} with margin below 10%
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Project
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Margin
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actual vs Est. Cost
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {attentionProjects.slice(0, 5).map(({ project, margin, actualTotal, estimatedTotal }) => (
              <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <Link
                    href={`/dashboard/projects/${project.id}`}
                    className="font-medium text-gray-900 hover:text-blue-600"
                  >
                    {project.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-gray-600">{project.client_name}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusColors[project.status] || 'bg-gray-100 text-gray-800'}`}
                  >
                    {project.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`font-medium ${
                      margin < 0
                        ? 'text-red-600'
                        : margin < 10
                        ? 'text-yellow-600'
                        : 'text-green-600'
                    }`}
                  >
                    {margin.toFixed(1)}%
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
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