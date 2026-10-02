'use client';

import { formatCurrency } from '@/lib/utils';

interface Project {
  contract_amount: number;
  status: string;
  project_budgets: { materials: number; labor: number; equipment: number; other: number } | null;
  expenses: { amount: number }[];
  payments: { amount: number }[];
}

interface DashboardStatsProps {
  projects: Project[];
}

export function DashboardStats({ projects }: DashboardStatsProps) {
  const activeProjects = projects.filter((p) => p.status === 'Active');
  
  const totalContractValue = projects.reduce((sum, p) => sum + Number(p.contract_amount), 0);
  const totalReceived = projects.reduce(
    (sum, p) => sum + p.payments.reduce((s, pay) => s + Number(pay.amount), 0),
    0
  );
  const totalActualExpenses = projects.reduce(
    (sum, p) => sum + p.expenses.reduce((s, exp) => s + Number(exp.amount), 0),
    0
  );
  const totalEstimatedCost = projects.reduce(
    (sum, p) => sum + (p.project_budgets
      ? Number(p.project_budgets.materials) +
        Number(p.project_budgets.labor) +
        Number(p.project_budgets.equipment) +
        Number(p.project_budgets.other)
      : 0),
    0
  );

  const estimatedProfit = totalContractValue - totalEstimatedCost;
  const actualProfit = totalContractValue - totalActualExpenses;

  const stats = [
    { label: 'Active Projects', value: activeProjects.length.toString() },
    { label: 'Total Contract Value', value: formatCurrency(totalContractValue) },
    { label: 'Total Received', value: formatCurrency(totalReceived) },
    { label: 'Total Actual Expenses', value: formatCurrency(totalActualExpenses) },
    { label: 'Estimated Profit', value: formatCurrency(estimatedProfit), variant: estimatedProfit < 0 ? 'negative' : 'positive' },
    { label: 'Actual Profit', value: formatCurrency(actualProfit), variant: actualProfit < 0 ? 'negative' : 'positive' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-lg border border-gray-200 p-4"
        >
          <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
          <p
            className={`text-xl font-semibold ${
              stat.variant === 'negative'
                ? 'text-red-600'
                : stat.variant === 'positive'
                ? 'text-green-600'
                : 'text-gray-900'
            }`}
          >
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}