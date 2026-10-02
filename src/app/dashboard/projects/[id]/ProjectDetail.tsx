'use client';

import { useState } from 'react';
import Link from 'next/link';
import { formatCurrency, formatDate } from '@/lib/utils';
import { BudgetForm } from './BudgetForm';
import { ExpensesList } from './ExpensesList';
import { PaymentsList } from './PaymentsList';

interface Project {
  id: string;
  name: string;
  client_name: string;
  contract_amount: number;
  status: string;
  start_date: string | null;
  end_date: string | null;
}

interface Budget {
  materials: number;
  labor: number;
  equipment: number;
  other: number;
}

interface Profitability {
  estimated_total_cost: number;
  estimated_profit: number;
  estimated_margin: number;
}

interface ProjectDetailProps {
  project: Project;
  budget: Budget | null;
  profitability: Profitability;
  actualTotal: number;
  actualProfit: number;
  actualMargin: number;
  totalReceived: number;
  remainingBalance: number;
}

const statusColors: Record<string, string> = {
  Planning: 'bg-yellow-100 text-yellow-800',
  Active: 'bg-blue-100 text-blue-800',
  Completed: 'bg-green-100 text-green-800',
  Cancelled: 'bg-gray-100 text-gray-800',
};

export function ProjectDetail({
  project,
  budget,
  profitability,
  actualTotal,
  actualProfit,
  actualMargin,
  totalReceived,
  remainingBalance,
}: ProjectDetailProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'budget' | 'expenses' | 'payments'>('overview');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/projects"
            className="text-sm text-gray-600 hover:text-gray-900 inline-flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </Link>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{project.name}</h2>
            <p className="text-gray-600 text-sm">{project.client_name}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusColors[project.status] || 'bg-gray-100 text-gray-800'}`}>
            {project.status}
          </span>
          <Link
            href={`/dashboard/projects/${project.id}/edit`}
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            Edit
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Contract Amount"
          value={formatCurrency(project.contract_amount)}
          variant="primary"
        />
        <MetricCard
          label="Est. Total Cost"
          value={formatCurrency(profitability.estimated_total_cost)}
        />
        <MetricCard
          label="Actual Cost"
          value={formatCurrency(actualTotal)}
        />
        <MetricCard
          label="Est. Profit"
          value={formatCurrency(profitability.estimated_profit)}
          variant={profitability.estimated_profit < 0 ? 'negative' : 'positive'}
        />
        <MetricCard
          label="Actual Profit"
          value={formatCurrency(actualProfit)}
          variant={actualProfit < 0 ? 'negative' : 'positive'}
        />
        <MetricCard
          label="Est. Margin"
          value={`${profitability.estimated_margin.toFixed(1)}%`}
          variant={profitability.estimated_margin < 0 ? 'negative' : profitability.estimated_margin < 10 ? 'warning' : 'positive'}
        />
        <MetricCard
          label="Actual Margin"
          value={`${actualMargin.toFixed(1)}%`}
          variant={actualMargin < 0 ? 'negative' : actualMargin < 10 ? 'warning' : 'positive'}
        />
        <MetricCard
          label="Total Received"
          value={formatCurrency(totalReceived)}
        />
        <MetricCard
          label="Remaining Balance"
          value={formatCurrency(remainingBalance)}
          variant={remainingBalance > 0 ? 'warning' : 'primary'}
        />
      </div>

      {actualTotal > profitability.estimated_total_cost && profitability.estimated_total_cost > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-lg text-sm">
          <strong>Warning:</strong> Actual costs ({formatCurrency(actualTotal)}) have exceeded the estimated budget ({formatCurrency(profitability.estimated_total_cost)}).
        </div>
      )}

      <div className="border-b border-gray-200">
        <nav className="flex gap-4 overflow-x-auto" aria-label="Project tabs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('budget')}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
              activeTab === 'budget'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Budget
          </button>
          <button
            onClick={() => setActiveTab('expenses')}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
              activeTab === 'expenses'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Expenses
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
              activeTab === 'payments'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Payments
          </button>
        </nav>
      </div>

      {activeTab === 'overview' && <OverviewTab project={project} />}
      {activeTab === 'budget' && <BudgetForm projectId={project.id} initialBudget={budget} />}
      {activeTab === 'expenses' && <ExpensesList projectId={project.id} />}
      {activeTab === 'payments' && <PaymentsList projectId={project.id} />}
    </div>
  );
}

function MetricCard({
  label,
  value,
  variant = 'neutral',
}: {
  label: string;
  value: string;
  variant?: 'primary' | 'positive' | 'negative' | 'warning' | 'neutral';
}) {
  const variantClasses = {
    primary: 'text-gray-900',
    positive: 'text-green-600',
    negative: 'text-red-600',
    warning: 'text-yellow-600',
    neutral: 'text-gray-900',
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      <p className={`text-xl font-semibold ${variantClasses[variant]}`}>{value}</p>
    </div>
  );
}

function OverviewTab({ project }: { project: Project }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Project Details</h3>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-600">Name</dt>
              <dd className="font-medium text-gray-900">{project.name}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600">Client</dt>
              <dd className="font-medium text-gray-900">{project.client_name}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600">Status</dt>
              <dd className="font-medium text-gray-900">{project.status}</dd>
            </div>
          </dl>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Dates</h3>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-600">Start Date</dt>
              <dd className="font-medium text-gray-900">{project.start_date ? formatDate(project.start_date) : '—'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600">End Date</dt>
              <dd className="font-medium text-gray-900">{project.end_date ? formatDate(project.end_date) : '—'}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}