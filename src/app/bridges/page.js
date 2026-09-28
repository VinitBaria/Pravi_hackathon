import { getDb } from '@/lib/db';
import SidebarLayout from '@/components/SidebarLayout';
import { Bridge as BridgeIcon } from 'lucide-react';
import Link from 'next/link';

export default async function BridgesPage() {
  const db = await getDb();
  const bridgesData = await db.collection('bridges').find({}).toArray();
  const projectsData = await db.collection('projects').find({}).toArray();
  
  const bridges = bridgesData.map(b => {
    const proj = projectsData.find(p => p.id === b.project_id);
    return { ...b, project_name: proj ? proj.name : 'Unknown' };
  });
  
  return (
    <SidebarLayout>
      <header className="mb-8">
        <h2 className="text-2xl font-bold text-[var(--text-primary)]">Bridge Assets</h2>
        <p className="text-[var(--text-muted)] text-sm">Monitor all bridge construction and structural conditions.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bridges.map(b => (
          <div key={b.id} className="card rounded-xl p-6 relative overflow-hidden">
            {/* Color Accent based on status */}
            <div className={`absolute top-0 left-0 w-full h-1 ${b.status === 'construction' ? 'bg-blue-500' : 'bg-gray-500'}`}></div>
            
            <div className="flex justify-between items-start mb-4 mt-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[var(--bg-body)] rounded-lg text-[var(--text-muted)] border border-[var(--border)]">
                  <BridgeIcon size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-[var(--text-primary)]">{b.name}</h4>
                  <div className="text-xs text-[var(--text-muted)]">{b.id}</div>
                </div>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-secondary)]">Parent Project:</span>
                <span className="font-medium text-[var(--text-primary)] truncate max-w-[150px]"><Link href={`/projects/${b.project_id}`} className="hover:underline">{b.project_name}</Link></span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-secondary)]">Type:</span>
                <span className="font-medium text-[var(--text-primary)] uppercase">{b.type}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-secondary)]">Waterbody:</span>
                <span className="font-medium text-[var(--text-primary)]">{b.waterbody}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-secondary)]">Total Length:</span>
                <span className="font-medium text-[var(--text-primary)]">{b.total_length}m ({b.spans} spans)</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
              <span className={`px-2 py-1 text-xs font-medium rounded uppercase ${b.status === 'construction' ? 'bg-blue-500/10 text-blue-500' : 'bg-gray-500/10 text-gray-500'}`}>
                {b.status}
              </span>
              <div className="text-right">
                <div className="text-xs text-[var(--text-muted)]">Condition Score</div>
                <div className={`font-bold ${b.condition_score > 80 ? 'text-green-500' : 'text-yellow-500'}`}>{b.condition_score}/100</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </SidebarLayout>
  );
}
