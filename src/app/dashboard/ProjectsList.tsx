'use client';

import Link from 'next/link';
import { formatCurrency, formatDate } from '@/lib/utils';

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

const statusColors: Record<string, string> = {
  Planning: 'bg-yellow-100 text-yellow-800',
  Active: 'bg-blue-100 text-blue-800',
  Completed: 'bg-green-100 text-green-800',
  Cancelled: 'bg-gray-100 text-gray-800',
};

export function ProjectsList({ projects, limit }: ProjectsListProps) {
  const displayProjects = limit ? projects.slice(0, limit) : projects;

  if (displayProjects.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <p className="text-gray-600">No projects yet</p>
        <Link
          href="/dashboard/projects/new"
          className="mt-4 inline-block text-blue-600 hover:text-blue-500 font-medium"
        >
          Create your first project
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
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
                Contract
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Margin
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                  <td className="px-4 py-3">
                    <Link
                      href={`/dashboard/projects/${project.id}`}
                      className="font-medium text-gray-900 hover:text-blue-600"
                    >
                      {project.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{project.client_name}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {formatCurrency(Number(project.contract_amount))}
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
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusColors[project.status] || 'bg-gray-100 text-gray-800'}`}
                    >
                      {project.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
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