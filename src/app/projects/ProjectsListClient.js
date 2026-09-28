'use client';

import { useAuth } from '@/app/providers';
import { WORKFLOW_STEPS } from '@/lib/data';
import Link from 'next/link';
import SidebarLayout from '@/components/SidebarLayout';

export default function ProjectsListClient({ initialProjects }) {
  const { role, user } = useAuth();

  const filteredProjects = initialProjects.filter(p => {
    if (role === 'admin') return true;
    
    // For prototype testing: show the project to any contractor, 
    // BUT only if it has actually been awarded (contractor_id exists).
    if (role === 'contractor') {
      if (!p.contractor_id) {
        return false; // Hide if not awarded yet
      }
    }
    
    const stepIndex = p.current_step !== undefined ? p.current_step : 0;
    const activeStepRoles = WORKFLOW_STEPS[stepIndex]?.roles || [];
    const isMyTurn = activeStepRoles.includes(role);
    const isWorking = p.status === 'construction';
    
    // Show the project if it is this role's turn to act, or if it's in active construction
    // Maintenance role also sees all projects in 'Active / Under Maintenance' status
    const isUnderMaintenance = role === 'maintenance' && (p.status || '').includes('Maintenance');
    return isMyTurn || isWorking || isUnderMaintenance;
  });

  return (
    <SidebarLayout>
      <header className="mb-8">
        <h2 className="text-2xl font-bold text-[var(--text-primary)]">My Projects</h2>
        <p className="text-[var(--text-muted)] text-sm">
          {role === 'engineer' 
            ? "Showing only projects currently assigned to you or in active execution." 
            : role === 'contractor'
            ? "Showing all awarded projects for execution."
            : "Select a project to view its details, history, and documents."}
        </p>
      </header>

      {filteredProjects.length === 0 ? (
        <div className="p-8 text-center text-[var(--text-muted)] border border-[var(--border)] rounded-xl bg-[var(--bg-body)]">
          You have no pending projects requiring your input at this stage.
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {filteredProjects.map(p => {
            const stepIndex = p.current_step !== undefined ? p.current_step : 0;
            const dynamicProgress = p.status === 'completed' ? 100 : p.status === 'rejected' ? 0 : Math.round((stepIndex / WORKFLOW_STEPS.length) * 100);

            return (
            <div key={p.id} className={`card rounded-xl p-6 hover:shadow-lg transition-shadow border-l-4 ${p.status === 'rejected' ? 'border-red-500 opacity-80' : ''}`} style={p.status !== 'rejected' ? { borderLeftColor: p.rci < 40 ? 'var(--color-danger)' : p.rci < 70 ? 'var(--color-warning)' : 'var(--color-success)' } : {}}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="text-xs font-mono text-[var(--text-muted)] mb-1">{p.id}</div>
                  <h4 className="text-lg font-semibold text-[var(--text-primary)]">{p.name}</h4>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded uppercase tracking-wider border ${p.status === 'rejected' ? 'bg-red-500/10 text-red-500 border-red-500/20' : p.status.includes('Maintenance') ? 'bg-orange-500/10 text-orange-600 border-orange-500/20 font-bold' : 'bg-[var(--bg-body)] text-[var(--text-secondary)] border-[var(--border)]'}`}>
                  {p.status}
                </span>
              </div>
              
              <p className="text-sm text-[var(--text-secondary)] mb-4 line-clamp-2">{p.description}</p>
              
              <div className="flex flex-wrap gap-2 text-xs font-medium text-[var(--text-muted)] mb-6">
                <span className="bg-[var(--bg-body)] border border-[var(--border)] px-2 py-1 rounded">{p.length || 0} {p.asset_category === 'Building' ? 'sq.m' : 'km'}</span>
                <span className="bg-[var(--bg-body)] border border-[var(--border)] px-2 py-1 rounded">{p.asset_category === 'Building' || p.asset_category === 'Bridge' ? 'Score' : 'RCI'}: {p.rci}</span>
                <span className="bg-[var(--bg-body)] border border-[var(--border)] px-2 py-1 rounded">Budget: Rs. {p.estimated_cost} L</span>
              </div>
              
              <div className="flex items-center justify-between mt-auto">
                <div className="flex-1 mr-6">
                  <div className="mb-1 flex justify-between text-xs font-medium text-[var(--text-secondary)]">
                    <span>Progress</span>
                    <span className={p.status === 'rejected' ? 'text-red-500' : 'text-blue-500'}>{dynamicProgress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[var(--bg-body)] rounded-full overflow-hidden">
                    <div className={`h-full ${p.status === 'rejected' ? 'bg-red-500' : 'bg-blue-500'}`} style={{ width: `${dynamicProgress}%` }}></div>
                  </div>
                </div>
                <Link href={`/projects/${p.id}`} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors whitespace-nowrap">
                  View Project
                </Link>
              </div>
            </div>
            );
          })}
        </div>
      )}
    </SidebarLayout>
  );
}
