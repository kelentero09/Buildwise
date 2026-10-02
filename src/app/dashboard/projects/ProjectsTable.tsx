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

interface ProjectsTableProps {
  projects: Project[];
}

const statusColors: Record<string, string> = {
  Planning: 'bg-yellow-100 text-yellow-800',
  Active: 'bg-blue-100 text-blue-800',
  Completed: 'bg-green-100 text-green-800',
  Cancelled: 'bg-gray-100 text-gray-800',
};

export function ProjectsTable({ projects }: ProjectsTableProps) {
  if (projects.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No projects</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by creating a new project.</p>
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
                Est. Cost
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Est. Margin
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dates
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                  <td className="px-4 py-3 text-gray-600">
                    {formatCurrency(estimatedTotal)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`font-medium ${
                        estimatedMargin < 0
                          ? 'text-red-600'
                          : estimatedMargin < 10
                          ? 'text-yellow-600'
                          : 'text-green-600'
                      }`}
                    >
                      {estimatedMargin.toFixed(1)}%
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
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/dashboard/projects/${project.id}`}
                        className="text-sm text-blue-600 hover:text-blue-500"
                      >
                        View
                      </Link>
                      <Link
                        href={`/dashboard/projects/${project.id}/edit`}
                        className="text-sm text-gray-600 hover:text-gray-900"
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