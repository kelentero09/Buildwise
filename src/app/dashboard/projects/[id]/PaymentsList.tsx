'use client';

import { useState, useEffect } from 'react';
import { formatCurrency, formatDate } from '@/lib/utils';

interface Payment {
  id: string;
  amount: number;
  payment_date: string;
  notes: string | null;
}

interface PaymentsListProps {
  projectId: string;
}

export function PaymentsList({ projectId }: PaymentsListProps) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<{
    amount: number;
    payment_date: string;
    notes: string;
  }>({
    amount: 0,
    payment_date: new Date().toISOString().split('T')[0],
    notes: '',
  });
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof typeof formData, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchPayments() {
      setLoading(true);
      try {
        const res = await fetch(`/api/projects/${projectId}/payments`);
        const data = await res.json();
        if (res.ok) {
          setPayments(data.payments || []);
        }
      } catch {
        setError('Failed to load payments');
      } finally {
        setLoading(false);
      }
    }
    fetchPayments();
  }, [projectId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setFormErrors({});

    if (typeof formData.amount !== 'number' || formData.amount <= 0) {
      setFormErrors({ amount: 'Amount must be greater than 0' });
      return;
    }
    if (!formData.payment_date) {
      setFormErrors({ payment_date: 'Date is required' });
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch(`/api/projects/${projectId}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to add payment');
        setSubmitting(false);
        return;
      }

      setPayments((prev) => [data.payment, ...prev]);
      setFormData({
        amount: 0,
        payment_date: new Date().toISOString().split('T')[0],
        notes: '',
      });
      setShowForm(false);
      setSubmitting(false);
    } catch {
      setError('Network error. Please try again.');
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this payment?')) return;

    try {
      const res = await fetch(`/api/projects/${projectId}/payments/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setPayments((prev) => prev.filter((p) => p.id !== id));
      }
    } catch {
      setError('Failed to delete payment');
    }
  }

  const totalReceived = payments.reduce((sum, pay) => sum + Number(pay.amount), 0);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h3 className="text-lg font-medium text-gray-900">Payments</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Payment
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="text-sm font-medium text-gray-700">Record Payment</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount (PHP)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) || 0 })}
                className={`w-full px-3 py-2 border rounded-md ${
                  formErrors.amount ? 'border-red-300' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {formErrors.amount && <p className="mt-1 text-sm text-red-600">{formErrors.amount}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={formData.payment_date}
                onChange={(e) => setFormData({ ...formData, payment_date: e.target.value })}
                className={`w-full px-3 py-2 border rounded-md ${
                  formErrors.payment_date ? 'border-red-300' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {formErrors.payment_date && <p className="mt-1 text-sm text-red-600">{formErrors.payment_date}</p>}
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <input
                type="text"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? 'Adding...' : 'Add Payment'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </form>
      )}

      {error && !showForm && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading payments...</div>
      ) : payments.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No payments recorded yet. Click Add Payment to start tracking.
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center pb-2 border-b border-gray-200">
            <span className="text-sm text-gray-600">{payments.length} payment{payments.length !== 1 ? 's' : ''}</span>
            <span className="font-medium text-gray-900">Total Received: {formatCurrency(totalReceived)}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <th className="pb-2">Date</th>
                  <th className="pb-2">Amount</th>
                  <th className="pb-2">Notes</th>
                  <th className="pb-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="py-2 text-sm text-gray-600">{formatDate(payment.payment_date)}</td>
                    <td className="py-2 text-sm font-medium text-gray-900">{formatCurrency(payment.amount)}</td>
                    <td className="py-2 text-sm text-gray-600">{payment.notes || '&mdash;'}</td>
                    <td className="py-2 text-right">
                      <button
                        onClick={() => handleDelete(payment.id)}
                        className="text-sm text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}