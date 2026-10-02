import { z } from 'zod';

export const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required').max(100),
  client_name: z.string().min(1, 'Client name is required').max(100),
  contract_amount: z.coerce.number().min(0, 'Contract amount must be positive'),
  start_date: z.string().optional().nullable(),
  end_date: z.string().optional().nullable(),
  status: z.enum(['Planning', 'Active', 'Completed', 'Cancelled']),
});

export const projectBudgetSchema = z.object({
  materials: z.coerce.number().min(0, 'Materials cost cannot be negative').default(0),
  labor: z.coerce.number().min(0, 'Labor cost cannot be negative').default(0),
  equipment: z.coerce.number().min(0, 'Equipment cost cannot be negative').default(0),
  other: z.coerce.number().min(0, 'Other cost cannot be negative').default(0),
});

export type ProjectInput = z.infer<typeof projectSchema>;
export type ProjectBudgetInput = z.infer<typeof projectBudgetSchema>;

export function calculateBudgetTotals(budget: ProjectBudgetInput) {
  const estimated_total_cost =
    budget.materials + budget.labor + budget.equipment + budget.other;
  return {
    estimated_total_cost,
    estimated_profit: 0,
    estimated_margin: 0,
  };
}

export function calculateProjectProfitability(
  contractAmount: number,
  budget: ProjectBudgetInput
) {
  const estimated_total_cost =
    budget.materials + budget.labor + budget.equipment + budget.other;
  const estimated_profit = contractAmount - estimated_total_cost;
  const estimated_margin =
    contractAmount > 0 ? (estimated_profit / contractAmount) * 100 : 0;
  return {
    estimated_total_cost,
    estimated_profit,
    estimated_margin,
  };
}