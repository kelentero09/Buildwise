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

interface ProjectsListProps {
  projects: Project[];
  limit?: number;
}

export function ProjectsList({ projects, limit }: ProjectsListProps) {
  const displayProjects = limit ? projects.slice(0, limit) : projects;

  if (displayProjects.length === 0) {
    return (
      <EmptyState
        icon="projects"
        title="No projects yet"
        hint="Add your first job to start tracking its budget, expenses, and payments."
        actionHref="/dashboard/projects/new"
        actionLabel="Create your first project"
      />
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px]">
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
                Margin
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Dates
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {displayProjects.map((project) => {
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
                  : 0;

              return (
                <tr
                  key={project.id}
                  className="hover:bg-gray-50 transition-colors"
                >
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
                  <td className="px-4 py-3">
                    <MarginText value={margin} />
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
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}