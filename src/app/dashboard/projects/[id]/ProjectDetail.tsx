'use client';

import { useState } from 'react';
import Link from 'next/link';
import { formatCurrency, formatDate } from '@/lib/utils';
import { BudgetForm } from './BudgetForm';
import { ExpensesList } from './ExpensesList';
import { PaymentsList } from './PaymentsList';
import { StatusBadge, StatCard, ProgressBar } from '@/components/ui';

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
    <div className="space-y-6 animate-enter">
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
        <div className="flex items-center gap-2">
          <StatusBadge status={project.status} />
          <Link
            href={`/dashboard/projects/${project.id}/edit`}
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center px-2 text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            Edit
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard label="Contract Amount" value={formatCurrency(project.contract_amount)} />
        <StatCard label="Est. Total Cost" value={formatCurrency(profitability.estimated_total_cost)} />
        <StatCard label="Actual Cost" value={formatCurrency(actualTotal)} />
        <StatCard
          label="Est. Profit"
          value={formatCurrency(profitability.estimated_profit)}
          valueTone={profitability.estimated_profit < 0 ? 'negative' : 'positive'}
        />
        <StatCard
          label="Actual Profit"
          value={formatCurrency(actualProfit)}
          valueTone={actualProfit < 0 ? 'negative' : 'positive'}
        />
        <StatCard
          label="Est. Margin"
          value={`${profitability.estimated_margin.toFixed(1)}%`}
          valueTone={profitability.estimated_margin < 0 ? 'negative' : profitability.estimated_margin < 10 ? 'warning' : 'positive'}
        />
        <StatCard
          label="Actual Margin"
          value={`${actualMargin.toFixed(1)}%`}
          valueTone={actualMargin < 0 ? 'negative' : actualMargin < 10 ? 'warning' : 'positive'}
        />
        <StatCard
          label="Total Received"
          value={formatCurrency(totalReceived)}
        />
        <StatCard
          label="Remaining Balance"
          value={formatCurrency(remainingBalance)}
          valueTone={remainingBalance > 0 ? 'warning' : 'default'}
        />
      </div>

      {actualTotal > profitability.estimated_total_cost && profitability.estimated_total_cost > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-lg text-sm">
          <strong>Warning:</strong> Actual costs ({formatCurrency(actualTotal)}) have exceeded the estimated budget ({formatCurrency(profitability.estimated_total_cost)}).
        </div>
      )}

      <div className="border-b border-gray-200">
        <nav className="flex gap-2 overflow-x-auto" aria-label="Project tabs" role="tablist">
          {(
            [
              { key: 'overview', label: 'Overview' },
              { key: 'budget', label: 'Budget' },
              { key: 'expenses', label: 'Expenses' },
              { key: 'payments', label: 'Payments' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              role="tab"
              aria-selected={activeTab === tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 min-h-[44px] text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.key
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div key={activeTab} className="animate-enter">
        {activeTab === 'overview' && (
          <OverviewTab
            project={project}
            profitability={profitability}
            actualTotal={actualTotal}
            totalReceived={totalReceived}
          />
        )}
        {activeTab === 'budget' && <BudgetForm projectId={project.id} initialBudget={budget} />}
        {activeTab === 'expenses' && <ExpensesList projectId={project.id} />}
        {activeTab === 'payments' && <PaymentsList projectId={project.id} />}
      </div>
    </div>
  );
}

function OverviewTab({
  project,
  profitability,
  actualTotal,
  totalReceived,
}: {
  project: Project;
  profitability: Profitability;
  actualTotal: number;
  totalReceived: number;
}) {
  const contractAmount = Number(project.contract_amount);
  const budgetUsedPercent =
    profitability.estimated_total_cost > 0
      ? (actualTotal / profitability.estimated_total_cost) * 100
      : 0;
  const paidPercent = contractAmount > 0 ? (totalReceived / contractAmount) * 100 : 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6 space-y-6">
      <div className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500">Job progress</h3>
        <ProgressBar
          label={`Budget used · ${formatCurrency(actualTotal)} of ${formatCurrency(profitability.estimated_total_cost)}`}
          percent={budgetUsedPercent}
          tone={budgetUsedPercent > 100 ? 'negative' : budgetUsedPercent > 85 ? 'warning' : 'positive'}
        />
        <ProgressBar
          label={`Paid by client · ${formatCurrency(totalReceived)} of ${formatCurrency(contractAmount)}`}
          percent={paidPercent}
          tone={paidPercent >= 100 ? 'positive' : 'default'}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-gray-100 pt-6">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-2">Project details</h3>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-gray-600 shrink-0">Name</dt>
              <dd className="font-medium text-gray-900 text-right break-words">{project.name}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-gray-600 shrink-0">Client</dt>
              <dd className="font-medium text-gray-900 text-right break-words">{project.client_name}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-gray-600 shrink-0">Status</dt>
              <dd className="font-medium text-gray-900">{project.status}</dd>
            </div>
          </dl>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-2">Schedule</h3>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-gray-600 shrink-0">Start date</dt>
              <dd className="font-medium text-gray-900 text-right">{project.start_date ? formatDate(project.start_date) : '—'}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-gray-600 shrink-0">End date</dt>
              <dd className="font-medium text-gray-900 text-right">{project.end_date ? formatDate(project.end_date) : '—'}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}