import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth';
import { notFound } from 'next/navigation';
import { ProjectDetail } from './ProjectDetail';
import { calculateProjectProfitability } from '@/lib/validators';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectPage({ params }: PageProps) {
  const user = await requireAuth();
  const supabase = await createClient();
  const { id } = await params;

  const { data: project } = await supabase
    .from('projects')
    .select(`
      *,
      project_budgets (*),
      expenses (amount, category, description, expense_date),
      payments (amount, payment_date, notes)
    `)
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (!project) {
    notFound();
  }

  const budget = project.project_budgets;
  const profitability = budget
    ? calculateProjectProfitability(Number(project.contract_amount), budget)
    : {
        estimated_total_cost: 0,
        estimated_profit: Number(project.contract_amount),
        estimated_margin: 100,
      };

  const actualTotal = project.expenses.reduce(
    (sum: number, exp: { amount: number }) => sum + Number(exp.amount),
    0
  );
  const actualProfit = Number(project.contract_amount) - actualTotal;
  const actualMargin =
    actualTotal > 0 ? (actualProfit / Number(project.contract_amount)) * 100 : 100;

  const totalReceived = project.payments.reduce(
    (sum: number, pay: { amount: number }) => sum + Number(pay.amount),
    0
  );
  const remainingBalance = Number(project.contract_amount) - totalReceived;

  return (
    <ProjectDetail
      project={project}
      budget={budget}
      profitability={profitability}
      actualTotal={actualTotal}
      actualProfit={actualProfit}
      actualMargin={actualMargin}
      totalReceived={totalReceived}
      remainingBalance={remainingBalance}
    />
  );
}