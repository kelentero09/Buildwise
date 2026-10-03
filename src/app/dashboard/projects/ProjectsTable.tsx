'use client';

import Link from 'next/link';
import { formatCurrency, formatDate } from '@/lib/utils';
import { StatusBadge, MarginText, EmptyState } from '@/components/ui';

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

interface ProjectsTableProps {
  projects: Project[];
}

export function ProjectsTable({ projects }: ProjectsTableProps) {
  if (projects.length === 0) {
    return (
      <EmptyState
        icon="projects"
        title="No projects"
        hint="Get started by creating a new project."
        actionHref="/dashboard/projects/new"
        actionLabel="Create your first project"
      />
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px]">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Project
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Client
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Contract
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Est. Cost
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Est. Margin
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Dates
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {projects.map((project) => {
              const estimatedTotal = project.project_budgets
                ? Number(project.project_budgets.materials) +
                  Number(project.project_budgets.labor) +
                  Number(project.project_budgets.equipment) +
                  Number(project.project_budgets.other)
                : 0;
              const estimatedMargin =
                estimatedTotal > 0
                  ? ((Number(project.contract_amount) - estimatedTotal) /
                      Number(project.contract_amount)) *
                    100
                  : 0;

              return (
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
                  <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                    {formatCurrency(Number(project.contract_amount))}
                  </td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                    {formatCurrency(estimatedTotal)}
                  </td>
                  <td className="px-4 py-3">
                    <MarginText value={estimatedMargin} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={project.status} />
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                    {project.start_date && formatDate(project.start_date)}
                    {' '}
                    {project.start_date && project.end_date && '–'}
                    {' '}
                    {project.end_date && formatDate(project.end_date)}
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/dashboard/projects/${project.id}`}
                        className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center px-2 text-sm font-medium text-blue-600 hover:text-blue-500"
                      >
                        View
                      </Link>
                      <Link
                        href={`/dashboard/projects/${project.id}/edit`}
                        className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center px-2 text-sm font-medium text-gray-600 hover:text-gray-900"
                      >
                        Edit
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}