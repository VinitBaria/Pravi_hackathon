import { getDb } from '@/lib/db';
import SidebarLayout from '@/components/SidebarLayout';

export default async function FinancePage() {
  const db = await getDb();
  const projects = await db.collection('projects').find({}).project({ id: 1, name: 1, estimated_cost: 1, progress: 1 }).toArray();
  
  // Calculate total costs (mock utilization for demonstration)
  const totalSanctioned = projects.reduce((s, p) => s + p.estimated_cost, 0);
  const totalSpent = projects.reduce((s, p) => s + (p.estimated_cost * (p.progress / 100)), 0);
  const utilizationPct = Math.round((totalSpent / totalSanctioned) * 100);
  
  return (
    <SidebarLayout>
      <header className="mb-8">
        <h2 className="text-2xl font-bold text-[var(--text-primary)]">Finance & Budget Tracking</h2>
        <p className="text-[var(--text-muted)] text-sm">Monitor project budgets and expenditure utilization.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card p-6 rounded-xl border-l-4 border-l-blue-500">
          <div className="text-sm text-[var(--text-muted)]">Total Sanctioned</div>
          <div className="text-2xl font-bold text-[var(--text-primary)]">Rs. {totalSanctioned.toFixed(1)} L</div>
        </div>
        <div className="card p-6 rounded-xl border-l-4 border-l-yellow-500">
          <div className="text-sm text-[var(--text-muted)]">Total Spent</div>
          <div className="text-2xl font-bold text-[var(--text-primary)]">Rs. {totalSpent.toFixed(1)} L</div>
        </div>
        <div className="card p-6 rounded-xl border-l-4 border-l-green-500">
          <div className="text-sm text-[var(--text-muted)]">Fund Utilization</div>
          <div className="text-2xl font-bold text-[var(--text-primary)]">{utilizationPct}%</div>
        </div>
      </div>

      <div className="card rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[var(--bg-body)] border-b border-[var(--border)]">
              <th className="p-4 text-xs font-semibold text-[var(--text-muted)] uppercase">Project</th>
              <th className="p-4 text-xs font-semibold text-[var(--text-muted)] uppercase">Sanctioned (Rs L)</th>
              <th className="p-4 text-xs font-semibold text-[var(--text-muted)] uppercase">Spent (Rs L)</th>
              <th className="p-4 text-xs font-semibold text-[var(--text-muted)] uppercase">Utilization</th>
            </tr>
          </thead>
          <tbody>
            {projects.map(p => {
              const spent = p.estimated_cost * (p.progress / 100);
              return (
                <tr key={p.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-body)]">
                  <td className="p-4">
                    <div className="font-medium text-[var(--text-primary)]">{p.name}</div>
                    <div className="text-xs text-[var(--text-muted)]">{p.id}</div>
                  </td>
                  <td className="p-4 text-[var(--text-secondary)]">{p.estimated_cost.toFixed(2)}</td>
                  <td className="p-4 text-[var(--text-secondary)]">{spent.toFixed(2)}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-[var(--bg-body)] rounded-full overflow-hidden border border-[var(--border)]">
                        <div className="h-full bg-blue-500" style={{ width: `${p.progress}%` }}></div>
                      </div>
                      <span className="text-xs font-medium text-[var(--text-muted)]">{p.progress}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </SidebarLayout>
  );
}
