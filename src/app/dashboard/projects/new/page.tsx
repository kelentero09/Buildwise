'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { projectSchema, type ProjectInput } from '@/lib/validators';

const initialData: ProjectInput = {
  name: '',
  client_name: '',
  contract_amount: 0,
  start_date: '',
  end_date: '',
  status: 'Planning',
};

export default function NewProjectPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<ProjectInput>(initialData);
  const [errors, setErrors] = useState<Partial<Record<keyof ProjectInput, string>>>({});
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');

  function handleChange<K extends keyof ProjectInput>(field: K, value: ProjectInput[K]) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setGeneralError('');
    setErrors({});

    const parsed = projectSchema.safeParse(formData);
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      const newErrors: Partial<Record<keyof ProjectInput, string>> = {};
      for (const [key, messages] of Object.entries(fieldErrors)) {
        if (messages.length > 0) {
          newErrors[key as keyof ProjectInput] = messages[0];
        }
      }
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error && typeof data.error === 'object') {
          setErrors(data.error);
        } else {
          setGeneralError(data.error || 'Failed to create project');
        }
        setLoading(false);
        return;
      }

      router.push(`/dashboard/projects/${data.project.id}`);
      router.refresh();
    } catch {
      setGeneralError('Network error. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Link
          href="/dashboard/projects"
          className="text-sm text-gray-600 hover:text-gray-900 inline-flex items-center gap-1 mb-4"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Projects
        </Link>
        <h2 className="text-xl font-semibold text-gray-900">New Project</h2>
        <p className="text-gray-600 text-sm">Enter project details and contract amount</p>
      </div>

      {generalError && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded">
          {generalError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded-lg border border-gray-200 p-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Project Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            maxLength={100}
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.name ? 'border-red-300' : 'border-gray-300'
            }`}
            disabled={loading}
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="client_name" className="block text-sm font-medium text-gray-700 mb-1">
            Client Name <span className="text-red-500">*</span>
          </label>
          <input
            id="client_name"
            name="client_name"
            type="text"
            required
            maxLength={100}
            value={formData.client_name}
            onChange={(e) => handleChange('client_name', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.client_name ? 'border-red-300' : 'border-gray-300'
            }`}
            disabled={loading}
          />
          {errors.client_name && <p className="mt-1 text-sm text-red-600">{errors.client_name}</p>}
        </div>

        <div>
          <label htmlFor="contract_amount" className="block text-sm font-medium text-gray-700 mb-1">
            Contract Amount (PHP) <span className="text-red-500">*</span>
          </label>
          <input
            id="contract_amount"
            name="contract_amount"
            type="number"
            required
            min="0"
            step="0.01"
            value={formData.contract_amount}
            onChange={(e) => handleChange('contract_amount', Number(e.target.value) || 0)}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.contract_amount ? 'border-red-300' : 'border-gray-300'
            }`}
            disabled={loading}
          />
          {errors.contract_amount && <p className="mt-1 text-sm text-red-600">{errors.contract_amount}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              id="start_date"
              name="start_date"
              type="date"
              value={formData.start_date || ''}
              onChange={(e) => handleChange('start_date', e.target.value || null)}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.start_date ? 'border-red-300' : 'border-gray-300'
              }`}
              disabled={loading}
            />
            {errors.start_date && <p className="mt-1 text-sm text-red-600">{errors.start_date}</p>}
          </div>

          <div>
            <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              id="end_date"
              name="end_date"
              type="date"
              value={formData.end_date || ''}
              onChange={(e) => handleChange('end_date', e.target.value || null)}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.end_date ? 'border-red-300' : 'border-gray-300'
              }`}
              disabled={loading}
            />
            {errors.end_date && <p className="mt-1 text-sm text-red-600">{errors.end_date}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Status <span className="text-red-500">*</span>
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value as ProjectInput['status'])}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.status ? 'border-red-300' : 'border-gray-300'
            }`}
            disabled={loading}
          >
            <option value="Planning">Planning</option>
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          {errors.status && <p className="mt-1 text-sm text-red-600">{errors.status}</p>}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-2 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Create Project'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50"
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}