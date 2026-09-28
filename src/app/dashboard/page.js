import { getDb } from '@/lib/db';
import { Road, Activity, Settings, AlertTriangle } from 'lucide-react';
import SidebarLayout from '@/components/SidebarLayout';
import DashboardCharts from './DashboardCharts';
import Link from 'next/link';
import { WORKFLOW_STEPS } from '@/lib/data';

export default async function Dashboard() {
  const db = await getDb();
  const projectsData = await db.collection('projects').find({}).toArray();
  const projects = projectsData.map(p => ({ ...p, _id: p._id.toString() }));
  
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === 'construction').length;
  const totalCost = projects.reduce((sum, p) => sum + (p.estimated_cost || 0), 0);
  const totalSpent = projects.reduce((sum, p) => sum + (p.spent_cost || 0), 0);
  const criticalRoads = projects.filter(p => p.rci < 40).length;
  
  return (
    <SidebarLayout>
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">Admin Dashboard</h2>
          <p className="text-[var(--text-muted)] text-sm">System overview and analytics.</p>
        </div>
        <Link href="/projects/new" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
          + Create Project
        </Link>
      </header>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card p-6 rounded-xl flex items-center gap-4">
          <div className="p-4 bg-blue-500/10 text-blue-500 rounded-lg">
            <Road size={24} />
          </div>
          <div>
            <div className="text-2xl font-bold text-[var(--text-primary)]">{totalProjects}</div>
            <div className="text-sm text-[var(--text-muted)]">Total Projects</div>
          </div>
        </div>
        
        <div className="card p-6 rounded-xl flex items-center gap-4">
          <div className="p-4 bg-emerald-500/10 text-emerald-500 rounded-lg">
            <Activity size={24} />
          </div>
          <div>
            <div className="text-2xl font-bold text-[var(--text-primary)]">{activeProjects}</div>
            <div className="text-sm text-[var(--text-muted)]">Under Construction</div>
          </div>
        </div>

        <div className="card p-6 rounded-xl flex items-center gap-4">
          <div className="p-4 bg-yellow-500/10 text-yellow-500 rounded-lg">
            <Settings size={24} />
          </div>
          <div>
            <div className="text-2xl font-bold text-[var(--text-primary)]">Rs. {totalCost.toFixed(2)} L</div>
            <div className="text-xs text-[var(--text-secondary)] mt-1">Paid: Rs. {totalSpent.toFixed(2)} L</div>
            <div className="text-xs text-blue-500 font-semibold">Remaining: Rs. {Math.max(0, totalCost - totalSpent).toFixed(2)} L</div>
            <div className="text-xs text-[var(--text-muted)] mt-2">Total System Budget</div>
          </div>
        </div>

        <div className="card p-6 rounded-xl flex items-center gap-4">
          <div className="p-4 bg-red-500/10 text-red-500 rounded-lg">
            <AlertTriangle size={24} />
          </div>
          <div>
            <div className="text-2xl font-bold text-[var(--text-primary)]">{criticalRoads}</div>
            <div className="text-sm text-[var(--text-muted)]">Critical Roads (RCI &lt; 40)</div>
          </div>
        </div>
      </div>

      <DashboardCharts projects={projects} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">Recent Projects</h3>
          <div className="card rounded-xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[var(--bg-body)] border-b border-[var(--border)]">
                  <th className="p-4 text-xs font-semibold text-[var(--text-muted)] uppercase">Project Name</th>
                  <th className="p-4 text-xs font-semibold text-[var(--text-muted)] uppercase">Status</th>
                  <th className="p-4 text-xs font-semibold text-[var(--text-muted)] uppercase">Financials</th>
                  <th className="p-4 text-xs font-semibold text-[var(--text-muted)] uppercase">Progress</th>
                </tr>
              </thead>
              <tbody>
                {projects.slice(0, 5).map(p => (
                  <tr key={p.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-body)] transition-colors">
                    <td className="p-4">
                      <Link href={`/projects/${p.id}`} className="font-medium text-blue-500 hover:underline">{p.name}</Link>
                      <div className="text-xs text-[var(--text-muted)]">{p.id}</div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-[var(--bg-body)] border border-[var(--border)] text-xs rounded text-[var(--text-secondary)] uppercase">
                        {p.status}
                      </span>
                    </td>
                    <td className="p-4 text-xs">
                      <div className="text-[var(--text-primary)] font-medium">B: {p.estimated_cost || 0} L</div>
                      <div className="text-green-600">P: {p.spent_cost || 0} L</div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-[var(--bg-body)] rounded-full overflow-hidden border border-[var(--border)]">
                          <div className="h-full bg-blue-500" style={{ 
                            width: `${p.status === 'completed' ? 100 : Math.round(((p.current_step || 0) / WORKFLOW_STEPS.length) * 100)}%` 
                          }}></div>
                        </div>
                        <span className="text-xs font-medium text-[var(--text-muted)]">
                          {p.status === 'completed' ? 100 : Math.round(((p.current_step || 0) / WORKFLOW_STEPS.length) * 100)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Placeholder for Documents Pending Review */}
        <div>
          <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">Documents Pending Review</h3>
          <div className="card rounded-xl p-6 text-center text-[var(--text-muted)]">
            <p className="mb-2">No documents currently require administrative review.</p>
            <p className="text-xs">As an Admin, you can review documents but not upload them.</p>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
