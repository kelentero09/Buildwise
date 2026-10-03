'use client';

import { formatCurrency } from '@/lib/utils';
import { StatCard } from '@/components/ui';

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

  const stats: {
    label: string;
    value: string;
    icon: string;
    tone: 'default' | 'positive' | 'negative' | 'warning';
    valueTone?: 'default' | 'positive' | 'negative' | 'warning';
  }[] = [
    { label: 'Active Projects', value: activeProjects.length.toString(), icon: 'projects', tone: 'default' },
    { label: 'Contract Value', value: formatCurrency(totalContractValue), icon: 'contract', tone: 'default' },
    { label: 'Received', value: formatCurrency(totalReceived), icon: 'received', tone: 'positive' },
    { label: 'Actual Expenses', value: formatCurrency(totalActualExpenses), icon: 'expenses', tone: 'warning' },
    { label: 'Estimated Profit', value: formatCurrency(estimatedProfit), icon: 'profit', tone: estimatedProfit < 0 ? 'negative' : 'positive', valueTone: estimatedProfit < 0 ? 'negative' : 'positive' },
    { label: 'Actual Profit', value: formatCurrency(actualProfit), icon: 'profit', tone: actualProfit < 0 ? 'negative' : 'positive', valueTone: actualProfit < 0 ? 'negative' : 'positive' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
      {stats.map((stat) => (
        <StatCard
          key={stat.label}
          label={stat.label}
          value={stat.value}
          icon={stat.icon}
          tone={stat.tone}
          valueTone={stat.valueTone ?? 'default'}
        />
      ))}
    </div>
  );
}