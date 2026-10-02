import { requireAuth } from '@/lib/auth';
import { DashboardNav } from './DashboardNav';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav>{children}</DashboardNav>
    </div>
  );
}