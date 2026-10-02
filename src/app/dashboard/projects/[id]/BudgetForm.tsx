'use client';

import { useState } from 'react';
import { projectBudgetSchema, type ProjectBudgetInput, calculateProjectProfitability } from '@/lib/validators';
import { formatCurrency } from '@/lib/utils';

interface BudgetFormProps {
  projectId: string;
  initialBudget: ProjectBudgetInput | null;
}

export function BudgetForm({ projectId, initialBudget }: BudgetFormProps) {
  const [formData, setFormData] = useState<ProjectBudgetInput>({
    materials: initialBudget?.materials || 0,
    labor: initialBudget?.labor || 0,
    equipment: initialBudget?.equipment || 0,
    other: initialBudget?.other || 0,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ProjectBudgetInput, string>>>({});
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [generalError, setGeneralError] = useState('');

  function handleChange(field: keyof ProjectBudgetInput, value: number) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setGeneralError('');
    setErrors({});
    setSaved(false);

    const parsed = projectBudgetSchema.safeParse(formData);
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      const newErrors: Partial<Record<keyof ProjectBudgetInput, string>> = {};
      for (const [key, messages] of Object.entries(fieldErrors)) {
        if (messages.length > 0) {
          newErrors[key as keyof ProjectBudgetInput] = messages[0];
        }
      }
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/projects/${projectId}/budget`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error && typeof data.error === 'object') {
          setErrors(data.error);
        } else {
          setGeneralError(data.error || 'Failed to save budget');
        }
        setLoading(false);
        return;
      }

      setSaved(true);
      setLoading(false);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setGeneralError('Network error. Please try again.');
      setLoading(false);
    }
  }

  const profitability = calculateProjectProfitability(0, formData);
  const estimatedTotal = profitability.estimated_total_cost;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
      {saved && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded">
          Budget saved successfully
        </div>
      )}

      {generalError && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded">
          {generalError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Estimated Costs</h3>
        <p className="text-sm text-gray-600">Enter estimated costs for each category</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <BudgetInput
            label="Materials"
            value={formData.materials}
            onChange={(v) => handleChange('materials', v)}
            error={errors.materials}
          />
          <BudgetInput
            label="Labor"
            value={formData.labor}
            onChange={(v) => handleChange('labor', v)}
            error={errors.labor}
          />
          <BudgetInput
            label="Equipment"
            value={formData.equipment}
            onChange={(v) => handleChange('equipment', v)}
            error={errors.equipment}
          />
          <BudgetInput
            label="Other"
            value={formData.other}
            onChange={(v) => handleChange('other', v)}
            error={errors.other}
          />
        </div>

        <div className="bg-gray-50 rounded-lg p-4 pt-0">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Summary</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Estimated Total Cost</span>
              <span className="font-medium text-gray-900">{formatCurrency(estimatedTotal)}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-2 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : 'Save Budget'}
          </button>
        </div>
      </form>

      {initialBudget && (
        <div className="border-t border-gray-200 pt-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Current Budget Summary</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Materials: </span>
              <span className="font-medium">{formatCurrency(initialBudget.materials)}</span>
            </div>
            <div>
              <span className="text-gray-600">Labor: </span>
              <span className="font-medium">{formatCurrency(initialBudget.labor)}</span>
            </div>
            <div>
              <span className="text-gray-600">Equipment: </span>
              <span className="font-medium">{formatCurrency(initialBudget.equipment)}</span>
            </div>
            <div>
              <span className="text-gray-600">Other: </span>
              <span className="font-medium">{formatCurrency(initialBudget.other)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function BudgetInput({
  label,
  value,
  onChange,
  error,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  error?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} (PHP)
      </label>
      <input
        type="number"
        min="0"
        step="0.01"
        value={value}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
          error ? 'border-red-300' : 'border-gray-300'
        }`}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}